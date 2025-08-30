import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, from, throwError } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { FreesoundApiService, FreesoundSound, SoundEffectCategory } from './freesound-api.service';

export interface ManagedSoundEffect {
  id: string;
  categoryId: string;
  name: string;
  filename: string;
  source: 'local' | 'freesound' | 'generated';
  freesoundId?: number;
  freesoundData?: FreesoundSound;
  localPath?: string;
  isDownloaded: boolean;
  isActive: boolean;
  fileSize?: number;
  duration?: number;
  license?: string;
  attribution?: string;
  downloadedAt?: Date;
  lastUsed?: Date;
}

export interface SoundLibraryStats {
  totalSounds: number;
  downloadedSounds: number;
  totalSize: number;
  categoriesComplete: number;
  totalCategories: number;
}

export interface DownloadProgress {
  soundId: string;
  progress: number;
  status: 'pending' | 'downloading' | 'complete' | 'error';
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SoundEffectManagementService {
  private readonly managedSounds = signal<ManagedSoundEffect[]>([]);
  private readonly downloadProgress = signal<Map<string, DownloadProgress>>(new Map());
  private readonly searchResults = signal<Map<string, FreesoundSound[]>>(new Map());
  private readonly isSearching = signal<boolean>(false);
  private readonly currentCategory = signal<string | null>(null);

  // Computed signals
  readonly sounds = computed(() => this.managedSounds());
  readonly stats = computed(() => this.calculateStats());
  readonly activeSounds = computed(() => this.managedSounds().filter(s => s.isActive));
  readonly downloadedSounds = computed(() => this.managedSounds().filter(s => s.isDownloaded));
  readonly missingSounds = computed(() => this.managedSounds().filter(s => !s.isDownloaded));
  readonly currentCategoryResults = computed(() => {
    const category = this.currentCategory();
    return category ? this.searchResults().get(category) || [] : [];
  });

  // Storage keys
  private readonly STORAGE_KEY = 'dnd-sound-library';
  private readonly SETTINGS_KEY = 'dnd-sound-settings';

  constructor(
    private freesoundApi: FreesoundApiService,
    private http: HttpClient
  ) {
    this.loadFromStorage();
    this.initializeDefaultSounds();
  }

  /**
   * Initialize default sound categories
   */
  private initializeDefaultSounds(): void {
    const currentSounds = this.managedSounds();
    const categories = this.freesoundApi.soundCategories;

    categories.forEach(category => {
      const existingSound = currentSounds.find(s => s.categoryId === category.id);
      if (!existingSound) {
        const newSound: ManagedSoundEffect = {
          id: category.id,
          categoryId: category.id,
          name: category.name,
          filename: category.filename,
          source: 'local',
          localPath: `/assets/sounds/${category.filename}`,
          isDownloaded: false,
          isActive: true
        };
        
        this.addManagedSound(newSound);
      }
    });
  }

  /**
   * Add a managed sound effect
   */
  private addManagedSound(sound: ManagedSoundEffect): void {
    const current = this.managedSounds();
    this.managedSounds.set([...current, sound]);
    this.saveToStorage();
  }

  /**
   * Update a managed sound effect
   */
  private updateManagedSound(soundId: string, updates: Partial<ManagedSoundEffect>): void {
    const current = this.managedSounds();
    const index = current.findIndex(s => s.id === soundId);
    
    if (index !== -1) {
      const updated = [...current];
      updated[index] = { ...updated[index], ...updates, lastUsed: new Date() };
      this.managedSounds.set(updated);
      this.saveToStorage();
    }
  }

  /**
   * Remove a managed sound effect
   */
  removeManagedSound(soundId: string): void {
    const current = this.managedSounds();
    this.managedSounds.set(current.filter(s => s.id !== soundId));
    this.saveToStorage();
  }

  /**
   * Search for sounds in a specific category
   */
  searchCategory(categoryId: string, page: number = 1): Observable<FreesoundSound[]> {
    this.isSearching.set(true);
    this.currentCategory.set(categoryId);

    return this.freesoundApi.searchByCategory(categoryId, page).pipe(
      map(response => {
        // Filter for open licenses only
        const openLicenseSounds = this.freesoundApi.filterByOpenLicense(response.results);
        
        // Filter for sounds suitable for this category
        const suitableSounds = openLicenseSounds.filter(sound => 
          this.freesoundApi.isSuitableForCategory(sound, categoryId)
        );

        return suitableSounds;
      }),
      tap(sounds => {
        const current = this.searchResults();
        current.set(categoryId, sounds);
        this.searchResults.set(new Map(current));
        this.isSearching.set(false);
      }),
      catchError(error => {
        this.isSearching.set(false);
        console.error(`Error searching category ${categoryId}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Preview a sound from Freesound
   */
  previewSound(sound: FreesoundSound): Observable<void> {
    return new Observable(observer => {
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      
      audio.onloadeddata = () => {
        audio.play().then(() => {
          observer.next();
          observer.complete();
        }).catch(error => {
          observer.error(new Error(`Failed to play preview: ${error.message}`));
        });
      };
      
      audio.onerror = () => {
        observer.error(new Error('Failed to load audio preview'));
      };
      
      // Use high-quality MP3 preview if available
      const previewUrl = sound.previews['preview-hq-mp3'] || sound.previews['preview-lq-mp3'];
      audio.src = previewUrl;
    });
  }

  /**
   * Download and install a sound from Freesound
   */
  downloadAndInstallSound(sound: FreesoundSound, categoryId: string): Observable<ManagedSoundEffect> {
    const soundId = `${categoryId}-${sound.id}`;
    
    // Set initial progress
    this.setDownloadProgress(soundId, { soundId, progress: 0, status: 'pending' });

    // Check if we need authentication for download
    if (!this.freesoundApi.hasCredentials()) {
      return throwError(() => new Error('Freesound API credentials required'));
    }

    return this.freesoundApi.downloadSound(sound.id).pipe(
      tap(() => this.setDownloadProgress(soundId, { soundId, progress: 50, status: 'downloading' })),
      switchMap(blob => {
        // Save the blob to local storage or file system
        return this.saveDownloadedSound(blob, sound, categoryId);
      }),
      map(localPath => {
        // Create managed sound effect
        const managedSound: ManagedSoundEffect = {
          id: soundId,
          categoryId,
          name: sound.name,
          filename: this.getCategoryFilename(categoryId),
          source: 'freesound',
          freesoundId: sound.id,
          freesoundData: sound,
          localPath,
          isDownloaded: true,
          isActive: true,
          fileSize: sound.filesize,
          duration: sound.duration,
          license: sound.license,
          attribution: `"${sound.name}" by ${sound.username} from Freesound.org`,
          downloadedAt: new Date()
        };

        // Update or add the managed sound
        this.updateManagedSoundForCategory(categoryId, managedSound);
        
        // Set completion progress
        this.setDownloadProgress(soundId, { soundId, progress: 100, status: 'complete' });
        
        return managedSound;
      }),
      catchError(error => {
        this.setDownloadProgress(soundId, { 
          soundId, 
          progress: 0, 
          status: 'error', 
          error: error.message 
        });
        return throwError(() => error);
      })
    );
  }

  /**
   * Save downloaded sound blob to appropriate location
   */
  private saveDownloadedSound(blob: Blob, sound: FreesoundSound, categoryId: string): Observable<string> {
    return new Observable(observer => {
      try {
        // In a real app, you'd save to a proper file system or IndexedDB
        // For now, we'll create a blob URL and simulate saving
        const url = URL.createObjectURL(blob);
        const filename = this.getCategoryFilename(categoryId);
        
        // Simulate file saving with a delay
        setTimeout(() => {
          observer.next(`/assets/sounds/${filename}`);
          observer.complete();
        }, 1000);
        
      } catch (error) {
        observer.error(new Error(`Failed to save sound: ${error}`));
      }
    });
  }

  /**
   * Get filename for a category
   */
  private getCategoryFilename(categoryId: string): string {
    const category = this.freesoundApi.soundCategories.find(c => c.id === categoryId);
    return category?.filename || `${categoryId}.mp3`;
  }

  /**
   * Update managed sound for a category
   */
  private updateManagedSoundForCategory(categoryId: string, newSound: ManagedSoundEffect): void {
    const current = this.managedSounds();
    const existingIndex = current.findIndex(s => s.categoryId === categoryId);
    
    if (existingIndex !== -1) {
      // Update existing
      const updated = [...current];
      updated[existingIndex] = newSound;
      this.managedSounds.set(updated);
    } else {
      // Add new
      this.managedSounds.set([...current, newSound]);
    }
    
    this.saveToStorage();
  }

  /**
   * Set download progress
   */
  private setDownloadProgress(soundId: string, progress: DownloadProgress): void {
    const current = this.downloadProgress();
    current.set(soundId, progress);
    this.downloadProgress.set(new Map(current));
  }

  /**
   * Get download progress for a sound
   */
  getDownloadProgress(soundId: string): DownloadProgress | null {
    return this.downloadProgress().get(soundId) || null;
  }

  /**
   * Clear download progress
   */
  clearDownloadProgress(soundId: string): void {
    const current = this.downloadProgress();
    current.delete(soundId);
    this.downloadProgress.set(new Map(current));
  }

  /**
   * Generate placeholder sound effect
   */
  generatePlaceholderSound(categoryId: string): Observable<ManagedSoundEffect> {
    return new Observable(observer => {
      try {
        // This would generate a simple sound using Web Audio API
        const managedSound: ManagedSoundEffect = {
          id: `${categoryId}-generated`,
          categoryId,
          name: `Generated ${this.getCategoryName(categoryId)}`,
          filename: this.getCategoryFilename(categoryId),
          source: 'generated',
          localPath: `/generated/${categoryId}.mp3`,
          isDownloaded: true,
          isActive: true,
          duration: 1.0,
          license: 'Generated',
          downloadedAt: new Date()
        };

        this.updateManagedSoundForCategory(categoryId, managedSound);
        observer.next(managedSound);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Get category name
   */
  private getCategoryName(categoryId: string): string {
    const category = this.freesoundApi.soundCategories.find(c => c.id === categoryId);
    return category?.name || categoryId;
  }

  /**
   * Calculate library statistics
   */
  private calculateStats(): SoundLibraryStats {
    const sounds = this.managedSounds();
    const categories = this.freesoundApi.soundCategories;
    
    return {
      totalSounds: sounds.length,
      downloadedSounds: sounds.filter(s => s.isDownloaded).length,
      totalSize: sounds.reduce((total, s) => total + (s.fileSize || 0), 0),
      categoriesComplete: categories.filter(c => 
        sounds.some(s => s.categoryId === c.id && s.isDownloaded)
      ).length,
      totalCategories: categories.length
    };
  }

  /**
   * Get sounds by category
   */
  getSoundsByCategory(categoryId: string): ManagedSoundEffect[] {
    return this.managedSounds().filter(s => s.categoryId === categoryId);
  }

  /**
   * Get active sound for category
   */
  getActiveSoundForCategory(categoryId: string): ManagedSoundEffect | null {
    const categorySounds = this.getSoundsByCategory(categoryId);
    return categorySounds.find(s => s.isActive && s.isDownloaded) || null;
  }

  /**
   * Set active sound for category
   */
  setActiveSoundForCategory(categoryId: string, soundId: string): void {
    const current = this.managedSounds();
    const updated = current.map(sound => ({
      ...sound,
      isActive: sound.categoryId === categoryId ? sound.id === soundId : sound.isActive
    }));
    
    this.managedSounds.set(updated);
    this.saveToStorage();
  }

  /**
   * Check if sounds need setup
   */
  needsSetup(): boolean {
    const stats = this.stats();
    return stats.downloadedSounds === 0 || stats.categoriesComplete < stats.totalCategories;
  }

  /**
   * Get setup progress percentage
   */
  getSetupProgress(): number {
    const stats = this.stats();
    if (stats.totalCategories === 0) return 100;
    return Math.round((stats.categoriesComplete / stats.totalCategories) * 100);
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    try {
      const data = {
        sounds: this.managedSounds(),
        timestamp: Date.now()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save sound library to storage:', error);
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.sounds && Array.isArray(data.sounds)) {
          this.managedSounds.set(data.sounds);
        }
      }
    } catch (error) {
      console.error('Failed to load sound library from storage:', error);
    }
  }

  /**
   * Export sound library configuration
   */
  exportLibrary(): string {
    const data = {
      sounds: this.managedSounds(),
      stats: this.stats(),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import sound library configuration
   */
  importLibrary(jsonData: string): Observable<boolean> {
    return new Observable(observer => {
      try {
        const data = JSON.parse(jsonData);
        
        if (data.sounds && Array.isArray(data.sounds)) {
          this.managedSounds.set(data.sounds);
          this.saveToStorage();
          observer.next(true);
          observer.complete();
        } else {
          observer.error(new Error('Invalid sound library format'));
        }
      } catch (error) {
        observer.error(new Error(`Failed to import library: ${error}`));
      }
    });
  }

  /**
   * Reset sound library
   */
  resetLibrary(): void {
    this.managedSounds.set([]);
    this.searchResults.set(new Map());
    this.downloadProgress.set(new Map());
    localStorage.removeItem(this.STORAGE_KEY);
    this.initializeDefaultSounds();
  }
}