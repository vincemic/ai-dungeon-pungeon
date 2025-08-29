import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MapGenerationService, AudioService } from './core/services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('AI Dungeon Pungeon');
  
  private readonly mapService = inject(MapGenerationService);
  protected readonly audioService = inject(AudioService);
  
  readonly audioEnabled = signal(true);
  readonly audioStatus = signal('Initializing...');

  ngOnInit(): void {
    // Initialize services
    this.mapService.loadFromStorage();
    this.initializeAudio();
  }

  private async initializeAudio(): Promise<void> {
    try {
      this.audioStatus.set('Initializing audio context...');
      await this.audioService.init();
      
      this.audioStatus.set('Loading audio files...');
      await this.audioService.preloadGameSounds();
      
      const status = this.audioService.getAudioSystemStatus();
      
      if (status.missingFiles.length === 0) {
        this.audioStatus.set(`Audio ready (${status.soundsLoaded}/${status.totalSounds})`);
      } else {
        this.audioStatus.set(`Audio partial (${status.soundsLoaded}/${status.totalSounds} loaded)`);
        console.warn(`Missing audio files: ${status.missingFiles.join(', ')}`);
      }
      
      console.log('Audio system status:', status);
    } catch (error) {
      console.warn('Audio initialization failed:', error);
      this.audioEnabled.set(false);
      this.audioStatus.set('Audio unavailable');
    }
  }

  toggleAudio(): void {
    if (!this.audioService.isAudioInitialized()) {
      console.warn('Audio system not initialized');
      return;
    }
    
    const enabled = !this.audioService.isSoundEnabled();
    this.audioService.setSoundEnabled(enabled);
    this.audioEnabled.set(enabled);
  }

  getAudioStatus(): string {
    return this.audioStatus();
  }
}
