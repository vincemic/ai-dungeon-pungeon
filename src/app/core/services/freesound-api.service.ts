import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface FreesoundSound {
  id: number;
  name: string;
  description: string;
  url: string;
  username: string;
  created: string;
  filesize: number;
  type: string;
  duration: number;
  bitdepth: number;
  bitrate: number;
  samplerate: number;
  channels: number;
  filesize_pretty: string;
  license: string;
  pack?: string;
  pack_name?: string;
  download: string;
  bookmark: string;
  previews: {
    'preview-hq-mp3': string;
    'preview-hq-ogg': string;
    'preview-lq-mp3': string;
    'preview-lq-ogg': string;
  };
  images?: {
    waveform_m: string;
    waveform_l: string;
    spectral_m: string;
    spectral_l: string;
  };
  tags: string[];
  rating: number;
  num_ratings: number;
  comment: string;
  num_comments: number;
  geotag?: string;
}

export interface FreesoundSearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FreesoundSound[];
}

export interface FreesoundSearchParams {
  query?: string;
  filter?: string;
  sort?: 'score' | 'downloads_desc' | 'downloads_asc' | 'created_desc' | 'created_asc' | 'duration_desc' | 'duration_asc' | 'rating_desc' | 'rating_asc';
  group_by_pack?: 0 | 1;
  page?: number;
  page_size?: number;
  fields?: string;
  descriptors?: string;
  normalized?: 0 | 1;
}

export interface SoundEffectCategory {
  id: string;
  name: string;
  description: string;
  searchTerms: string[];
  expectedDuration: string;
  filename: string;
  priority: 'high' | 'medium' | 'low';
}

@Injectable({
  providedIn: 'root'
})
export class FreesoundApiService {
  private readonly baseUrl = 'https://freesound.org/apiv2';
  private readonly clientId = signal<string>(''); // Will need to be set by user
  private readonly token = signal<string>(''); // OAuth token for downloads
  private readonly isAuthenticated = signal<boolean>(false);

  // Sound effect categories for D&D app
  readonly soundCategories: SoundEffectCategory[] = [
    {
      id: 'footstep',
      name: 'Footstep',
      description: 'Character movement sounds on stone or concrete',
      searchTerms: ['footstep stone', 'boot concrete', 'step stone', 'walking stone'],
      expectedDuration: '0.5-1 second',
      filename: 'footstep.mp3',
      priority: 'high'
    },
    {
      id: 'door-open',
      name: 'Door Open',
      description: 'Wooden door opening with creaking sound',
      searchTerms: ['door open wood', 'wooden door creak', 'door opening', 'creak door open'],
      expectedDuration: '1-2 seconds',
      filename: 'door-open.mp3',
      priority: 'high'
    },
    {
      id: 'door-close',
      name: 'Door Close',
      description: 'Wooden door closing or slamming',
      searchTerms: ['door close wood', 'door slam', 'wooden door shut', 'door closing'],
      expectedDuration: '1-2 seconds',
      filename: 'door-close.mp3',
      priority: 'high'
    },
    {
      id: 'treasure',
      name: 'Treasure',
      description: 'Coins, treasure chest, or loot sounds',
      searchTerms: ['coins treasure', 'gold coins', 'treasure chest', 'money coins'],
      expectedDuration: '1-3 seconds',
      filename: 'treasure.mp3',
      priority: 'high'
    },
    {
      id: 'trap',
      name: 'Trap',
      description: 'Mechanical trap or spring mechanism',
      searchTerms: ['trap spring', 'mouse trap', 'mechanical click', 'spring mechanism'],
      expectedDuration: '0.5-2 seconds',
      filename: 'trap.mp3',
      priority: 'high'
    },
    {
      id: 'magic',
      name: 'Magic',
      description: 'Magical spell casting or mystical sounds',
      searchTerms: ['magic spell', 'magical whoosh', 'spell cast', 'mystical sound'],
      expectedDuration: '1-3 seconds',
      filename: 'magic.mp3',
      priority: 'high'
    },
    {
      id: 'combat',
      name: 'Combat',
      description: 'Sword clashing or weapon sounds',
      searchTerms: ['sword clash', 'metal sword', 'weapon clash', 'blade combat'],
      expectedDuration: '1-2 seconds',
      filename: 'combat.mp3',
      priority: 'high'
    },
    {
      id: 'ambient-dungeon',
      name: 'Ambient Dungeon',
      description: 'Background dungeon or cave atmosphere',
      searchTerms: ['cave ambient', 'dungeon atmosphere', 'underground ambient', 'dark ambient'],
      expectedDuration: '30-60 seconds',
      filename: 'ambient-dungeon.mp3',
      priority: 'medium'
    }
  ];

  constructor(private http: HttpClient) {}

  /**
   * Set the Freesound API client ID
   * Get this from: https://freesound.org/apiv2/apply/
   */
  setClientId(clientId: string): void {
    this.clientId.set(clientId);
  }

  /**
   * Set OAuth token for authenticated requests (downloads)
   */
  setToken(token: string): void {
    this.token.set(token);
    this.isAuthenticated.set(!!token);
  }

  /**
   * Check if we have valid API credentials
   */
  hasCredentials(): boolean {
    return !!this.clientId();
  }

  /**
   * Search for sounds using the Freesound API
   */
  searchSounds(params: FreesoundSearchParams): Observable<FreesoundSearchResponse> {
    if (!this.hasCredentials()) {
      return throwError(() => new Error('Freesound API client ID not set. Get one from https://freesound.org/apiv2/apply/'));
    }

    let httpParams = new HttpParams()
      .set('token', this.clientId());

    // Add search parameters
    if (params.query) httpParams = httpParams.set('query', params.query);
    if (params.filter) httpParams = httpParams.set('filter', params.filter);
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    if (params.group_by_pack !== undefined) httpParams = httpParams.set('group_by_pack', params.group_by_pack.toString());
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.page_size) httpParams = httpParams.set('page_size', params.page_size.toString());
    if (params.fields) httpParams = httpParams.set('fields', params.fields);
    if (params.descriptors) httpParams = httpParams.set('descriptors', params.descriptors);
    if (params.normalized !== undefined) httpParams = httpParams.set('normalized', params.normalized.toString());

    return this.http.get<FreesoundSearchResponse>(`${this.baseUrl}/search/text/`, { params: httpParams })
      .pipe(
        catchError(error => {
          console.error('Freesound API error:', error);
          if (error.status === 401) {
            return throwError(() => new Error('Invalid Freesound API credentials'));
          }
          if (error.status === 429) {
            return throwError(() => new Error('Freesound API rate limit exceeded. Please try again later.'));
          }
          return throwError(() => new Error(`Freesound API error: ${error.message || 'Unknown error'}`));
        })
      );
  }

  /**
   * Search for sounds by category
   */
  searchByCategory(categoryId: string, page: number = 1): Observable<FreesoundSearchResponse> {
    const category = this.soundCategories.find(c => c.id === categoryId);
    if (!category) {
      return throwError(() => new Error(`Unknown sound category: ${categoryId}`));
    }

    // Use the first search term for the category
    const query = category.searchTerms[0];
    
    return this.searchSounds({
      query,
      sort: 'rating_desc',
      page,
      page_size: 15,
      fields: 'id,name,description,username,created,filesize,duration,license,previews,tags,rating,download',
      filter: 'duration:[0.1 TO 10]' // Filter for reasonable duration sounds
    });
  }

  /**
   * Get detailed information about a specific sound
   */
  getSoundDetail(soundId: number): Observable<FreesoundSound> {
    if (!this.hasCredentials()) {
      return throwError(() => new Error('Freesound API client ID not set'));
    }

    const params = new HttpParams().set('token', this.clientId());
    
    return this.http.get<FreesoundSound>(`${this.baseUrl}/sounds/${soundId}/`, { params })
      .pipe(
        catchError(error => {
          console.error('Freesound API error:', error);
          return throwError(() => new Error(`Failed to get sound details: ${error.message || 'Unknown error'}`));
        })
      );
  }

  /**
   * Get similar sounds to a given sound
   */
  getSimilarSounds(soundId: number): Observable<FreesoundSearchResponse> {
    if (!this.hasCredentials()) {
      return throwError(() => new Error('Freesound API client ID not set'));
    }

    const params = new HttpParams()
      .set('token', this.clientId())
      .set('fields', 'id,name,description,username,duration,license,previews,rating');
    
    return this.http.get<FreesoundSearchResponse>(`${this.baseUrl}/sounds/${soundId}/similar/`, { params })
      .pipe(
        catchError(error => {
          console.error('Freesound API error:', error);
          return throwError(() => new Error(`Failed to get similar sounds: ${error.message || 'Unknown error'}`));
        })
      );
  }

  /**
   * Download a sound file (requires OAuth token)
   */
  downloadSound(soundId: number): Observable<Blob> {
    if (!this.isAuthenticated()) {
      return throwError(() => new Error('Authentication required for downloads. Please authenticate with Freesound.'));
    }

    const params = new HttpParams().set('token', this.token());
    
    return this.http.get(`${this.baseUrl}/sounds/${soundId}/download/`, { 
      params,
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        console.error('Download error:', error);
        if (error.status === 401) {
          return throwError(() => new Error('Invalid authentication token for download'));
        }
        return throwError(() => new Error(`Download failed: ${error.message || 'Unknown error'}`));
      })
    );
  }

  /**
   * Get OAuth authorization URL for authenticated downloads
   */
  getAuthUrl(): string {
    if (!this.hasCredentials()) {
      throw new Error('Client ID required for authentication');
    }
    
    const params = new URLSearchParams({
      client_id: this.clientId(),
      response_type: 'code',
      state: 'dnd-app-auth'
    });
    
    return `https://freesound.org/apiv2/oauth2/authorize/?${params.toString()}`;
  }

  /**
   * Filter sounds by license (Creative Commons only)
   */
  filterByOpenLicense(sounds: FreesoundSound[]): FreesoundSound[] {
    const openLicenses = [
      'Creative Commons 0',
      'Attribution',
      'Attribution Noncommercial'
    ];
    
    return sounds.filter(sound => 
      openLicenses.some(license => 
        sound.license.toLowerCase().includes(license.toLowerCase())
      )
    );
  }

  /**
   * Get recommended search filters for better results
   */
  getRecommendedFilters(): string[] {
    return [
      'duration:[0.1 TO 10]', // Reasonable duration
      'filesize:[0 TO 5000000]', // Under 5MB
      'samplerate:44100', // Standard sample rate
      'channels:1 OR channels:2' // Mono or stereo
    ];
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Format duration for display
   */
  formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${seconds.toFixed(1)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  /**
   * Check if a sound is suitable for a specific category
   */
  isSuitableForCategory(sound: FreesoundSound, categoryId: string): boolean {
    const category = this.soundCategories.find(c => c.id === categoryId);
    if (!category) return false;

    // Check duration (basic heuristics)
    if (categoryId === 'ambient-dungeon' && sound.duration < 10) return false;
    if (categoryId !== 'ambient-dungeon' && sound.duration > 10) return false;

    // Check if any search terms appear in name, description, or tags
    const searchText = `${sound.name} ${sound.description} ${sound.tags.join(' ')}`.toLowerCase();
    return category.searchTerms.some(term => 
      term.split(' ').every(word => searchText.includes(word.toLowerCase()))
    );
  }
}