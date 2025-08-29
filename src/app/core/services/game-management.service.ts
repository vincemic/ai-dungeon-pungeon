import { Injectable, signal, computed } from '@angular/core';
import { Player, Position, Direction, GameSession, GameState, GameSettings } from '../types';

@Injectable({
  providedIn: 'root'
})
export class GameManagementService {
  private readonly currentSession = signal<GameSession | null>(null);
  private readonly players = signal<Player[]>([]);
  private readonly gameSettings = signal<GameSettings>(this.getDefaultSettings());

  readonly session = computed(() => this.currentSession());
  readonly activePlayers = computed(() => this.players().filter(p => p.isActive));
  readonly settings = computed(() => this.gameSettings());

  createSession(sessionName: string, dungeonMaster: Player): GameSession {
    const session: GameSession = {
      id: this.generateId(),
      name: sessionName,
      dungeonMaster,
      players: [dungeonMaster],
      currentMap: null as any, // Will be set when map is loaded
      gameState: GameState.WAITING_FOR_PLAYERS,
      settings: this.gameSettings(),
      createdAt: new Date(),
      lastActivity: new Date()
    };

    this.currentSession.set(session);
    this.players.set([dungeonMaster]);
    return session;
  }

  joinSession(sessionId: string, player: Player): boolean {
    const session = this.currentSession();
    if (!session || session.id !== sessionId) {
      return false;
    }

    const currentPlayers = this.players();
    if (currentPlayers.length >= session.settings.maxPlayers) {
      return false;
    }

    const updatedPlayers = [...currentPlayers, player];
    this.players.set(updatedPlayers);
    
    const updatedSession = {
      ...session,
      players: updatedPlayers,
      lastActivity: new Date()
    };
    this.currentSession.set(updatedSession);

    return true;
  }

  leaveSession(playerId: string): void {
    const updatedPlayers = this.players().filter(p => p.id !== playerId);
    this.players.set(updatedPlayers);

    const session = this.currentSession();
    if (session) {
      const updatedSession = {
        ...session,
        players: updatedPlayers,
        lastActivity: new Date()
      };
      this.currentSession.set(updatedSession);
    }
  }

  movePlayer(playerId: string, newPosition: Position): boolean {
    const players = this.players();
    const playerIndex = players.findIndex(p => p.id === playerId);
    
    if (playerIndex === -1) {
      return false;
    }

    // TODO: Add validation for valid move (check map, collisions, etc.)
    
    const updatedPlayers = [...players];
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      position: newPosition
    };
    
    this.players.set(updatedPlayers);
    this.updateLastActivity();
    
    return true;
  }

  updatePlayerStats(playerId: string, stats: Partial<Player['stats']>): void {
    const players = this.players();
    const playerIndex = players.findIndex(p => p.id === playerId);
    
    if (playerIndex === -1) {
      return;
    }

    const updatedPlayers = [...players];
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      stats: { ...updatedPlayers[playerIndex].stats, ...stats }
    };
    
    this.players.set(updatedPlayers);
    this.updateLastActivity();
  }

  startGame(): void {
    const session = this.currentSession();
    if (session && session.gameState === GameState.WAITING_FOR_PLAYERS) {
      const updatedSession = {
        ...session,
        gameState: GameState.IN_PROGRESS,
        lastActivity: new Date()
      };
      this.currentSession.set(updatedSession);
    }
  }

  pauseGame(): void {
    const session = this.currentSession();
    if (session && session.gameState === GameState.IN_PROGRESS) {
      const updatedSession = {
        ...session,
        gameState: GameState.PAUSED,
        lastActivity: new Date()
      };
      this.currentSession.set(updatedSession);
    }
  }

  resumeGame(): void {
    const session = this.currentSession();
    if (session && session.gameState === GameState.PAUSED) {
      const updatedSession = {
        ...session,
        gameState: GameState.IN_PROGRESS,
        lastActivity: new Date()
      };
      this.currentSession.set(updatedSession);
    }
  }

  endGame(): void {
    const session = this.currentSession();
    if (session) {
      const updatedSession = {
        ...session,
        gameState: GameState.COMPLETED,
        lastActivity: new Date()
      };
      this.currentSession.set(updatedSession);
    }
  }

  updateSettings(newSettings: Partial<GameSettings>): void {
    const currentSettings = this.gameSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    this.gameSettings.set(updatedSettings);

    const session = this.currentSession();
    if (session) {
      const updatedSession = {
        ...session,
        settings: updatedSettings,
        lastActivity: new Date()
      };
      this.currentSession.set(updatedSession);
    }
  }

  private updateLastActivity(): void {
    const session = this.currentSession();
    if (session) {
      const updatedSession = {
        ...session,
        lastActivity: new Date()
      };
      this.currentSession.set(updatedSession);
    }
  }

  private getDefaultSettings(): GameSettings {
    return {
      maxPlayers: 6,
      turnBasedMode: false,
      allowSpectators: true,
      autoSave: true,
      autoSaveInterval: 30000,
      soundEnabled: true,
      visualEffectsEnabled: true,
      chatEnabled: true,
      voiceChatEnabled: false,
      gridVisible: true,
      fogOfWar: true,
      characterMovementSpeed: 1.0
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  saveSession(): void {
    const session = this.currentSession();
    if (session) {
      try {
        localStorage.setItem('current-game-session', JSON.stringify(session));
      } catch (error) {
        console.error('Failed to save game session:', error);
      }
    }
  }

  loadSession(): GameSession | null {
    try {
      const stored = localStorage.getItem('current-game-session');
      if (stored) {
        const session = JSON.parse(stored);
        this.currentSession.set(session);
        this.players.set(session.players);
        this.gameSettings.set(session.settings);
        return session;
      }
    } catch (error) {
      console.error('Failed to load game session:', error);
    }
    return null;
  }
}