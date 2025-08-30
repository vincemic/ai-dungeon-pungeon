import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  SoundEffectManagementService, 
  ManagedSoundEffect,
  DownloadProgress 
} from '../../core/services/sound-effect-management.service';
import { 
  FreesoundApiService, 
  FreesoundSound, 
  SoundEffectCategory 
} from '../../core/services/freesound-api.service';

@Component({
  selector: 'app-sound-browser',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sound-browser">
      <div class="browser-header">
        <h2>🎵 Sound Effect Library</h2>
        <div class="library-stats">
          <div class="stat-item">
            <span class="stat-value">{{ stats().downloadedSounds }}</span>
            <span class="stat-label">Downloaded</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ stats().categoriesComplete }}/{{ stats().totalCategories }}</span>
            <span class="stat-label">Categories</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ formatFileSize(stats().totalSize) }}</span>
            <span class="stat-label">Total Size</span>
          </div>
        </div>
      </div>

      @if (needsApiSetup()) {
        <div class="api-setup">
          <div class="setup-card">
            <h3>🔑 Freesound API Setup Required</h3>
            <p>To download sounds from Freesound.org, you need an API key:</p>
            <ol>
              <li>Go to <a href="https://freesound.org/apiv2/apply/" target="_blank" rel="noopener">Freesound API page</a></li>
              <li>Create a free account and apply for API access</li>
              <li>Copy your Client ID and paste it below</li>
            </ol>
            <div class="api-input">
              <input 
                type="text" 
                [(ngModel)]="apiClientId" 
                placeholder="Enter your Freesound API Client ID"
                class="api-input-field">
              <button (click)="setApiKey()" [disabled]="!apiClientId()" class="btn-primary">
                Set API Key
              </button>
            </div>
          </div>
        </div>
      }

      <div class="category-tabs">
        @for (category of categories(); track category.id) {
          <button 
            class="category-tab"
            [class.active]="selectedCategory() === category.id"
            [class.complete]="isCategoryComplete(category.id)"
            (click)="selectCategory(category.id)">
            <span class="tab-icon">{{ getCategoryIcon(category.id) }}</span>
            <span class="tab-name">{{ category.name }}</span>
            @if (isCategoryComplete(category.id)) {
              <span class="tab-status">✅</span>
            } @else {
              <span class="tab-status">❌</span>
            }
          </button>
        }
      </div>

      @if (selectedCategory()) {
        <div class="category-section">
          <div class="section-header">
            <h3>{{ getCurrentCategory()?.name }} Sounds</h3>
            <div class="section-actions">
              @if (hasApiKey()) {
                <button 
                  (click)="searchCategorySounds()" 
                  [disabled]="isSearching()"
                  class="btn-secondary">
                  @if (isSearching()) {
                    🔄 Searching...
                  } @else {
                    🔍 Search Freesound
                  }
                </button>
              }
              <button 
                (click)="generatePlaceholder()"
                class="btn-warning">
                🎛️ Generate Placeholder
              </button>
            </div>
          </div>

          <!-- Current Category Sounds -->
          <div class="current-sounds">
            <h4>Current Sounds</h4>
            @if (getCurrentCategorySounds().length > 0) {
              <div class="sound-list">
                @for (sound of getCurrentCategorySounds(); track sound.id) {
                  <div class="sound-item" [class.active]="sound.isActive">
                    <div class="sound-info">
                      <div class="sound-name">{{ sound.name }}</div>
                      <div class="sound-details">
                        <span class="sound-source">{{ sound.source }}</span>
                        @if (sound.duration) {
                          <span class="sound-duration">{{ formatDuration(sound.duration) }}</span>
                        }
                        @if (sound.fileSize) {
                          <span class="sound-size">{{ formatFileSize(sound.fileSize) }}</span>
                        }
                      </div>
                      @if (sound.attribution) {
                        <div class="sound-attribution">{{ sound.attribution }}</div>
                      }
                    </div>
                    <div class="sound-actions">
                      @if (sound.isDownloaded) {
                        <button 
                          (click)="playSound(sound)"
                          class="btn-sm btn-success">
                          ▶️ Play
                        </button>
                        <button 
                          (click)="setActiveSound(sound)"
                          [disabled]="sound.isActive"
                          class="btn-sm btn-primary">
                          @if (sound.isActive) {
                            ✅ Active
                          } @else {
                            Set Active
                          }
                        </button>
                      } @else {
                        <span class="status-badge not-downloaded">Not Downloaded</span>
                      }
                      <button 
                        (click)="removeSound(sound)"
                        class="btn-sm btn-danger">
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="empty-state">
                <p>No sounds found for this category.</p>
                <p>Search Freesound or generate a placeholder to get started.</p>
              </div>
            }
          </div>

          <!-- Search Results -->
          @if (searchResults().length > 0) {
            <div class="search-results">
              <h4>Search Results from Freesound</h4>
              <div class="sound-list">
                @for (sound of searchResults(); track sound.id) {
                  <div class="sound-item search-result">
                    <div class="sound-info">
                      <div class="sound-name">{{ sound.name }}</div>
                      <div class="sound-details">
                        <span class="sound-author">by {{ sound.username }}</span>
                        <span class="sound-duration">{{ formatDuration(sound.duration) }}</span>
                        <span class="sound-size">{{ formatFileSize(sound.filesize) }}</span>
                        <span class="sound-license">{{ sound.license }}</span>
                      </div>
                      @if (sound.description) {
                        <div class="sound-description">{{ sound.description.slice(0, 100) }}...</div>
                      }
                      @if (sound.tags.length > 0) {
                        <div class="sound-tags">
                          @for (tag of sound.tags.slice(0, 5); track tag) {
                            <span class="tag">{{ tag }}</span>
                          }
                        </div>
                      }
                    </div>
                    <div class="sound-actions">
                      <button 
                        (click)="previewSound(sound)"
                        [disabled]="isPreviewPlaying(sound.id)"
                        class="btn-sm btn-secondary">
                        @if (isPreviewPlaying(sound.id)) {
                          🔄 Playing...
                        } @else {
                          🎧 Preview
                        }
                      </button>
                      <button 
                        (click)="downloadSound(sound)"
                        [disabled]="isDownloading(sound.id)"
                        class="btn-sm btn-success">
                        @if (isDownloading(sound.id)) {
                          {{ getDownloadProgress(sound.id) }}%
                        } @else {
                          💾 Download
                        }
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- Download Progress Overlay -->
      @if (hasActiveDownloads()) {
        <div class="download-overlay">
          <div class="download-progress">
            <h4>Downloading Sounds...</h4>
            @for (download of getActiveDownloads(); track download.soundId) {
              <div class="progress-item">
                <div class="progress-info">
                  <span>{{ download.soundId }}</span>
                  <span>{{ download.status }}</span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    [style.width.%]="download.progress">
                  </div>
                </div>
                @if (download.error) {
                  <div class="progress-error">{{ download.error }}</div>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './sound-browser.css'
})
export class SoundBrowserComponent implements OnInit {
  private soundManager = inject(SoundEffectManagementService);
  private freesoundApi = inject(FreesoundApiService);

  // Signals
  readonly selectedCategory = signal<string | null>(null);
  readonly apiClientId = signal<string>('');
  readonly searchResults = signal<FreesoundSound[]>([]);
  readonly isSearching = signal<boolean>(false);
  readonly previewingSound = signal<number | null>(null);
  readonly downloadingSound = signal<number | null>(null);

  // Computed properties
  readonly stats = computed(() => this.soundManager.stats());
  readonly categories = computed(() => this.freesoundApi.soundCategories);
  readonly hasApiKey = computed(() => this.freesoundApi.hasCredentials());
  readonly needsApiSetup = computed(() => !this.hasApiKey());

  ngOnInit() {
    // Select first category by default
    const firstCategory = this.categories()[0];
    if (firstCategory) {
      this.selectedCategory.set(firstCategory.id);
    }
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId);
    this.searchResults.set([]);
  }

  getCurrentCategory(): SoundEffectCategory | undefined {
    const categoryId = this.selectedCategory();
    return categoryId ? this.categories().find(c => c.id === categoryId) : undefined;
  }

  getCurrentCategorySounds(): ManagedSoundEffect[] {
    const categoryId = this.selectedCategory();
    return categoryId ? this.soundManager.getSoundsByCategory(categoryId) : [];
  }

  isCategoryComplete(categoryId: string): boolean {
    const sounds = this.soundManager.getSoundsByCategory(categoryId);
    return sounds.some(s => s.isDownloaded);
  }

  getCategoryIcon(categoryId: string): string {
    const icons: Record<string, string> = {
      'footstep': '👣',
      'door-open': '🚪',
      'door-close': '🚪',
      'treasure': '💰',
      'trap': '🪤',
      'magic': '✨',
      'combat': '⚔️',
      'ambient-dungeon': '🏰'
    };
    return icons[categoryId] || '🎵';
  }

  setApiKey(): void {
    const clientId = this.apiClientId();
    if (clientId.trim()) {
      this.freesoundApi.setClientId(clientId.trim());
      this.apiClientId.set('');
    }
  }

  searchCategorySounds(): void {
    const categoryId = this.selectedCategory();
    if (!categoryId || !this.hasApiKey()) return;

    this.isSearching.set(true);
    this.soundManager.searchCategory(categoryId).subscribe({
      next: (sounds) => {
        this.searchResults.set(sounds);
        this.isSearching.set(false);
      },
      error: (error) => {
        console.error('Search error:', error);
        this.isSearching.set(false);
        // Show user-friendly error message
      }
    });
  }

  previewSound(sound: FreesoundSound): void {
    this.previewingSound.set(sound.id);
    this.soundManager.previewSound(sound).subscribe({
      next: () => {
        this.previewingSound.set(null);
      },
      error: (error) => {
        console.error('Preview error:', error);
        this.previewingSound.set(null);
      }
    });
  }

  downloadSound(sound: FreesoundSound): void {
    const categoryId = this.selectedCategory();
    if (!categoryId) return;

    this.downloadingSound.set(sound.id);
    this.soundManager.downloadAndInstallSound(sound, categoryId).subscribe({
      next: (managedSound) => {
        console.log('Sound downloaded:', managedSound);
        this.downloadingSound.set(null);
        // Remove from search results
        const current = this.searchResults();
        this.searchResults.set(current.filter(s => s.id !== sound.id));
      },
      error: (error) => {
        console.error('Download error:', error);
        this.downloadingSound.set(null);
      }
    });
  }

  generatePlaceholder(): void {
    const categoryId = this.selectedCategory();
    if (!categoryId) return;

    this.soundManager.generatePlaceholderSound(categoryId).subscribe({
      next: (sound) => {
        console.log('Placeholder generated:', sound);
      },
      error: (error) => {
        console.error('Generation error:', error);
      }
    });
  }

  playSound(sound: ManagedSoundEffect): void {
    // This would integrate with your existing AudioService
    console.log('Playing sound:', sound);
  }

  setActiveSound(sound: ManagedSoundEffect): void {
    this.soundManager.setActiveSoundForCategory(sound.categoryId, sound.id);
  }

  removeSound(sound: ManagedSoundEffect): void {
    if (confirm(`Remove "${sound.name}"?`)) {
      this.soundManager.removeManagedSound(sound.id);
    }
  }

  isPreviewPlaying(soundId: number): boolean {
    return this.previewingSound() === soundId;
  }

  isDownloading(soundId: number): boolean {
    return this.downloadingSound() === soundId;
  }

  getDownloadProgress(soundId: number): number {
    const progress = this.soundManager.getDownloadProgress(`${this.selectedCategory()}-${soundId}`);
    return progress?.progress || 0;
  }

  hasActiveDownloads(): boolean {
    return this.getActiveDownloads().length > 0;
  }

  getActiveDownloads(): DownloadProgress[] {
    // For now, return empty array. This could be enhanced to track actual downloads
    return [];
  }

  formatFileSize(bytes: number): string {
    return this.freesoundApi.formatFileSize(bytes);
  }

  formatDuration(seconds: number): string {
    return this.freesoundApi.formatDuration(seconds);
  }
}