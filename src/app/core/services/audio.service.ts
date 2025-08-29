import { Injectable, signal } from '@angular/core';
import { SoundEffect, SoundEffectType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private readonly audioContext = signal<AudioContext | null>(null);
  private readonly soundCache = new Map<string, AudioBuffer>();
  private readonly activeSounds = new Map<string, AudioBufferSourceNode>();
  private readonly masterVolume = signal<number>(1.0);
  private readonly soundEnabled = signal<boolean>(true);

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.audioContext.set(context);
        resolve();
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
        reject(error);
      }
    });
  }

  async loadSound(src: string, id: string): Promise<void> {
    if (this.soundCache.has(id)) {
      return;
    }

    const context = this.audioContext();
    if (!context) {
      throw new Error('Audio context not initialized');
    }

    try {
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('audio')) {
        console.warn(`File ${src} doesn't appear to be an audio file (Content-Type: ${contentType})`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      
      if (arrayBuffer.byteLength < 100) {
        throw new Error(`File too small (${arrayBuffer.byteLength} bytes) - likely not a valid audio file`);
      }
      
      const audioBuffer = await context.decodeAudioData(arrayBuffer);
      this.soundCache.set(id, audioBuffer);
      console.log(`Successfully loaded sound: ${id} (${audioBuffer.duration.toFixed(2)}s)`);
    } catch (error) {
      console.warn(`Failed to load sound ${id} from ${src}:`, error);
      // Create a silent buffer as fallback
      this.createSilentBuffer(id);
    }
  }

  private createSilentBuffer(id: string): void {
    const context = this.audioContext();
    if (!context) return;

    // Create a 0.1 second silent buffer as fallback
    const buffer = context.createBuffer(1, context.sampleRate * 0.1, context.sampleRate);
    this.soundCache.set(id, buffer);
    console.log(`Created silent fallback for sound: ${id}`);
  }

  playSound(soundEffect: SoundEffect, id?: string): void {
    if (!this.soundEnabled()) {
      return;
    }

    const context = this.audioContext();
    if (!context) {
      console.warn('Audio context not initialized');
      return;
    }

    const soundId = id || soundEffect.src;
    const audioBuffer = this.soundCache.get(soundId);
    
    if (!audioBuffer) {
      console.warn(`Sound ${soundId} not loaded`);
      return;
    }

    // Stop existing sound if not looping
    if (!soundEffect.loop && this.activeSounds.has(soundId)) {
      this.stopSound(soundId);
    }

    const source = context.createBufferSource();
    const gainNode = context.createGain();

    source.buffer = audioBuffer;
    source.loop = soundEffect.loop;
    
    // Set volume
    gainNode.gain.value = soundEffect.volume * this.masterVolume();
    
    // Connect audio graph
    source.connect(gainNode);
    gainNode.connect(context.destination);

    // Handle cleanup
    source.onended = () => {
      this.activeSounds.delete(soundId);
    };

    this.activeSounds.set(soundId, source);
    source.start();
  }

  stopSound(id: string): void {
    const source = this.activeSounds.get(id);
    if (source) {
      source.stop();
      this.activeSounds.delete(id);
    }
  }

  stopAllSounds(): void {
    this.activeSounds.forEach((source, id) => {
      source.stop();
    });
    this.activeSounds.clear();
  }

  setMasterVolume(volume: number): void {
    this.masterVolume.set(Math.max(0, Math.min(1, volume)));
  }

  getMasterVolume(): number {
    return this.masterVolume();
  }

  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled.set(enabled);
    if (!enabled) {
      this.stopAllSounds();
    }
  }

  isSoundEnabled(): boolean {
    return this.soundEnabled();
  }

  isAudioInitialized(): boolean {
    return this.audioContext() !== null;
  }

  getLoadedSoundsCount(): number {
    return this.soundCache.size;
  }

  getAudioSystemStatus(): {
    initialized: boolean;
    soundsLoaded: number;
    totalSounds: number;
    enabled: boolean;
    missingFiles: string[];
  } {
    const expectedSounds = [
      'footstep', 'door-open', 'door-close', 'treasure', 
      'trap', 'magic', 'combat', 'ambient-dungeon'
    ];
    
    const loadedSounds = Array.from(this.soundCache.keys());
    const missingFiles = expectedSounds.filter(sound => !this.soundCache.has(sound));
    
    return {
      initialized: this.isAudioInitialized(),
      soundsLoaded: this.soundCache.size,
      totalSounds: expectedSounds.length,
      enabled: this.soundEnabled(),
      missingFiles
    };
  }

  // Preload common game sounds
  async preloadGameSounds(): Promise<void> {
    const sounds = [
      { src: '/assets/sounds/footstep.mp3', id: 'footstep' },
      { src: '/assets/sounds/door-open.mp3', id: 'door-open' },
      { src: '/assets/sounds/door-close.mp3', id: 'door-close' },
      { src: '/assets/sounds/treasure.mp3', id: 'treasure' },
      { src: '/assets/sounds/trap.mp3', id: 'trap' },
      { src: '/assets/sounds/magic.mp3', id: 'magic' },
      { src: '/assets/sounds/combat.mp3', id: 'combat' },
      { src: '/assets/sounds/ambient-dungeon.mp3', id: 'ambient-dungeon' }
    ];

    console.log('Starting to preload game sounds...');
    
    const promises = sounds.map(sound => 
      this.loadSound(sound.src, sound.id).catch(error => 
        console.warn(`Failed to preload sound ${sound.id}:`, error)
      )
    );

    const results = await Promise.allSettled(promises);
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.length - successful;
    
    console.log(`Audio preloading complete: ${successful} successful, ${failed} failed`);
    
    if (failed > 0) {
      console.warn('Some audio files are missing. The game will work but without sound effects.');
      console.warn('To add audio: Place MP3 files in public/assets/sounds/ directory');
    }
  }

  playFootstep(): void {
    this.playSound({
      src: '/assets/sounds/footstep.mp3',
      volume: 0.3,
      loop: false,
      type: SoundEffectType.FOOTSTEP
    }, 'footstep');
  }

  playDoorSound(isOpening: boolean): void {
    const soundId = isOpening ? 'door-open' : 'door-close';
    this.playSound({
      src: `/assets/sounds/${soundId}.mp3`,
      volume: 0.5,
      loop: false,
      type: SoundEffectType.DOOR
    }, soundId);
  }

  playTreasureSound(): void {
    this.playSound({
      src: '/assets/sounds/treasure.mp3',
      volume: 0.6,
      loop: false,
      type: SoundEffectType.TREASURE
    }, 'treasure');
  }

  playTrapSound(): void {
    this.playSound({
      src: '/assets/sounds/trap.mp3',
      volume: 0.7,
      loop: false,
      type: SoundEffectType.TRAP
    }, 'trap');
  }

  playAmbientSound(type: string, loop: boolean = true): void {
    this.playSound({
      src: `/assets/sounds/ambient-${type}.mp3`,
      volume: 0.2,
      loop,
      type: SoundEffectType.AMBIENT
    }, `ambient-${type}`);
  }

  stopAmbientSound(type: string): void {
    this.stopSound(`ambient-${type}`);
  }
}