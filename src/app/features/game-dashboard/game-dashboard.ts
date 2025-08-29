import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MapGenerationService } from '../../core/services/map-generation.service';
import { GameManagementService } from '../../core/services/game-management.service';
import { AudioService } from '../../core/services/audio.service';
import { GameState, Player, CharacterClass, Direction } from '../../core/types';

@Component({
  selector: 'app-game-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './game-dashboard.html',
  styleUrl: './game-dashboard.css'
})
export class GameDashboard implements OnInit {
  private mapService = inject(MapGenerationService);
  private gameService = inject(GameManagementService);
  private audioService = inject(AudioService);
  private router = inject(Router);

  // Session management
  sessionName = signal<string>('');
  dungeonMasterName = signal<string>('');
  showCreateSession = signal<boolean>(false);

  // Computed properties
  currentSession = computed(() => this.gameService.session());
  activePlayers = computed(() => this.gameService.activePlayers());
  savedMaps = computed(() => this.mapService.savedMaps());
  
  // Quick stats
  totalMaps = computed(() => this.savedMaps().length);
  totalPlayers = computed(() => this.activePlayers().length);
  sessionDuration = computed(() => {
    const session = this.currentSession();
    if (!session) return '0m';
    
    const now = new Date();
    const created = new Date(session.createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}m`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
  });

  // Enums for template
  GameState = GameState;

  ngOnInit() {
    // Try to load existing session
    this.gameService.loadSession();
    
    // Initialize audio service
    this.audioService.init().catch(error => {
      console.warn('Failed to initialize audio:', error);
    });
  }

  toggleCreateSession() {
    this.showCreateSession.set(!this.showCreateSession());
    if (!this.showCreateSession()) {
      this.resetSessionForm();
    }
  }

  createNewSession() {
    const sessionName = this.sessionName().trim();
    const dmName = this.dungeonMasterName().trim();
    
    if (!sessionName || !dmName) {
      alert('Please fill in all required fields');
      return;
    }

    // Create dungeon master player
    const dungeonMaster: Player = {
      id: this.generateId(),
      name: dmName,
      character: {
        id: this.generateId(),
        name: dmName,
        class: CharacterClass.MAGE, // DM gets mage abilities
        level: 20, // DM is high level
        sprite: {
          idle: '/assets/sprites/dm/idle.png',
          walking: ['/assets/sprites/dm/walk.png'],
          size: { width: 32, height: 32 }
        },
        abilities: []
      },
      position: { x: 0, y: 0, facing: Direction.NORTH },
      isActive: true,
      stats: {
        health: 1000,
        maxHealth: 1000,
        mana: 1000,
        maxMana: 1000,
        experience: 999999,
        gold: 10000
      },
      inventory: []
    };

    const session = this.gameService.createSession(sessionName, dungeonMaster);
    
    if (session) {
      this.resetSessionForm();
      this.showCreateSession.set(false);
      this.audioService.playTreasureSound();
    }
  }

  startGame() {
    this.gameService.startGame();
    this.audioService.playTreasureSound();
  }

  pauseGame() {
    this.gameService.pauseGame();
  }

  resumeGame() {
    this.gameService.resumeGame();
    this.audioService.playTreasureSound();
  }

  endGame() {
    if (confirm('Are you sure you want to end the current game session?')) {
      this.gameService.endGame();
      this.audioService.playTrapSound();
    }
  }

  saveSession() {
    this.gameService.saveSession();
    this.audioService.playTreasureSound();
  }

  navigateToMapGenerator() {
    this.router.navigate(['/map-generator']);
  }

  navigateToGameMap() {
    this.router.navigate(['/game-map']);
  }

  navigateToPlayerManagement() {
    this.router.navigate(['/player-management']);
  }

  getGameStateLabel(state: GameState): string {
    switch (state) {
      case GameState.WAITING_FOR_PLAYERS:
        return 'Waiting for Players';
      case GameState.IN_PROGRESS:
        return 'In Progress';
      case GameState.PAUSED:
        return 'Paused';
      case GameState.COMPLETED:
        return 'Completed';
      default:
        return 'Unknown';
    }
  }

  getGameStateColor(state: GameState): string {
    switch (state) {
      case GameState.WAITING_FOR_PLAYERS:
        return '#ffc107';
      case GameState.IN_PROGRESS:
        return '#28a745';
      case GameState.PAUSED:
        return '#fd7e14';
      case GameState.COMPLETED:
        return '#6c757d';
      default:
        return '#6c757d';
    }
  }

  getRecentMaps() {
    return this.savedMaps()
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3);
  }

  getRecentPlayers() {
    return this.activePlayers().slice(0, 4);
  }

  exportSessionData() {
    const session = this.currentSession();
    if (!session) return;

    const exportData = {
      session,
      players: this.activePlayers(),
      maps: this.savedMaps(),
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `session-${session.name}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    this.audioService.playTreasureSound();
  }

  private resetSessionForm() {
    this.sessionName.set('');
    this.dungeonMasterName.set('');
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
