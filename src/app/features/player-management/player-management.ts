import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameManagementService } from '../../core/services/game-management.service';
import { AudioService } from '../../core/services/audio.service';
import { Player, Character, CharacterClass, Direction, Position, PlayerStats, EffectType } from '../../core/types';

@Component({
  selector: 'app-player-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './player-management.html',
  styleUrl: './player-management.css'
})
export class PlayerManagement {
  private gameService = inject(GameManagementService);
  private audioService = inject(AudioService);

  // Form data
  playerName = signal<string>('');
  characterName = signal<string>('');
  selectedClass = signal<CharacterClass>(CharacterClass.WARRIOR);
  
  // UI state
  showCreateForm = signal<boolean>(false);
  editingPlayerId = signal<string>('');
  selectedPlayerId = signal<string>('');

  // Computed properties
  currentPlayers = computed(() => this.gameService.activePlayers());
  currentSession = computed(() => this.gameService.session());
  selectedPlayer = computed(() => {
    const playerId = this.selectedPlayerId();
    return playerId ? this.currentPlayers().find(p => p.id === playerId) : null;
  });

  // Enums for template
  CharacterClass = CharacterClass;
  Direction = Direction;

  // Available character classes
  characterClasses = Object.values(CharacterClass);

  toggleCreateForm() {
    this.showCreateForm.set(!this.showCreateForm());
    if (!this.showCreateForm()) {
      this.resetForm();
    }
  }

  createPlayer() {
    const name = this.playerName().trim();
    const charName = this.characterName().trim();
    
    if (!name || !charName) {
      alert('Please fill in all required fields');
      return;
    }

    const newPlayer: Player = {
      id: this.generateId(),
      name,
      character: {
        id: this.generateId(),
        name: charName,
        class: this.selectedClass(),
        level: 1,
        sprite: this.getDefaultSprite(this.selectedClass()),
        abilities: this.getDefaultAbilities(this.selectedClass())
      },
      position: { x: 0, y: 0, facing: Direction.NORTH },
      isActive: true,
      stats: this.getDefaultStats(),
      inventory: [],
      sessionId: this.currentSession()?.id
    };

    // Add player to session
    const session = this.currentSession();
    if (session) {
      const success = this.gameService.joinSession(session.id, newPlayer);
      if (success) {
        this.resetForm();
        this.showCreateForm.set(false);
        this.audioService.playTreasureSound(); // Success sound
      } else {
        alert('Failed to add player to session');
      }
    } else {
      alert('No active session found');
    }
  }

  selectPlayer(playerId: string) {
    this.selectedPlayerId.set(playerId);
  }

  removePlayer(playerId: string) {
    if (confirm('Are you sure you want to remove this player?')) {
      this.gameService.leaveSession(playerId);
      if (this.selectedPlayerId() === playerId) {
        this.selectedPlayerId.set('');
      }
      this.audioService.playTrapSound(); // Removal sound
    }
  }

  updatePlayerStats(playerId: string, statUpdate: Partial<PlayerStats>) {
    this.gameService.updatePlayerStats(playerId, statUpdate);
  }

  healPlayer(playerId: string, amount: number) {
    const player = this.currentPlayers().find(p => p.id === playerId);
    if (player) {
      const newHealth = Math.min(
        player.stats.health + amount,
        player.stats.maxHealth
      );
      this.updatePlayerStats(playerId, { health: newHealth });
      this.audioService.playTreasureSound(); // Healing sound
    }
  }

  damagePlayer(playerId: string, amount: number) {
    const player = this.currentPlayers().find(p => p.id === playerId);
    if (player) {
      const newHealth = Math.max(0, player.stats.health - amount);
      this.updatePlayerStats(playerId, { health: newHealth });
      this.audioService.playTrapSound(); // Damage sound
    }
  }

  restorePlayer(playerId: string) {
    const player = this.currentPlayers().find(p => p.id === playerId);
    if (player) {
      this.updatePlayerStats(playerId, {
        health: player.stats.maxHealth,
        mana: player.stats.maxMana
      });
      this.audioService.playTreasureSound(); // Restoration sound
    }
  }

  levelUpPlayer(playerId: string) {
    const player = this.currentPlayers().find(p => p.id === playerId);
    if (player) {
      const newLevel = player.character.level + 1;
      const healthBonus = 10 + (newLevel * 2);
      const manaBonus = 5 + newLevel;
      
      this.updatePlayerStats(playerId, {
        maxHealth: player.stats.maxHealth + healthBonus,
        health: player.stats.maxHealth + healthBonus,
        maxMana: player.stats.maxMana + manaBonus,
        mana: player.stats.maxMana + manaBonus
      });
      
      // Update character level (would need additional service method)
      this.audioService.playTreasureSound(); // Level up sound
    }
  }

  getHealthPercentage(player: Player): number {
    return (player.stats.health / player.stats.maxHealth) * 100;
  }

  getManaPercentage(player: Player): number {
    return (player.stats.mana / player.stats.maxMana) * 100;
  }

  getHealthBarColor(percentage: number): string {
    if (percentage > 60) return '#28a745';
    if (percentage > 30) return '#ffc107';
    return '#dc3545';
  }

  private resetForm() {
    this.playerName.set('');
    this.characterName.set('');
    this.selectedClass.set(CharacterClass.WARRIOR);
    this.editingPlayerId.set('');
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getDefaultSprite(characterClass: CharacterClass) {
    return {
      idle: `/assets/sprites/${characterClass}/idle.png`,
      walking: [
        `/assets/sprites/${characterClass}/walk1.png`,
        `/assets/sprites/${characterClass}/walk2.png`,
        `/assets/sprites/${characterClass}/walk3.png`,
        `/assets/sprites/${characterClass}/walk4.png`
      ],
      attacking: [
        `/assets/sprites/${characterClass}/attack1.png`,
        `/assets/sprites/${characterClass}/attack2.png`,
        `/assets/sprites/${characterClass}/attack3.png`
      ],
      size: { width: 32, height: 32 }
    };
  }

  private getDefaultAbilities(characterClass: CharacterClass) {
    // Return class-specific default abilities
    const baseAbilities = [
      {
        id: 'basic_attack',
        name: 'Basic Attack',
        description: 'A simple melee attack',
        cooldown: 0,
        manaCost: 0,
        range: 1,
        effect: {
          type: EffectType.DAMAGE,
          value: 10
        }
      }
    ];

    switch (characterClass) {
      case CharacterClass.MAGE:
        baseAbilities.push({
          id: 'fireball',
          name: 'Fireball',
          description: 'Launches a fireball at target',
          cooldown: 3000,
          manaCost: 15,
          range: 5,
          effect: {
            type: EffectType.DAMAGE,
            value: 25
          }
        });
        break;
      case CharacterClass.CLERIC:
        baseAbilities.push({
          id: 'heal',
          name: 'Heal',
          description: 'Restores health to target',
          cooldown: 2000,
          manaCost: 10,
          range: 3,
          effect: {
            type: EffectType.HEAL,
            value: 20
          }
        });
        break;
      // Add more class-specific abilities as needed
    }

    return baseAbilities;
  }

  private getDefaultStats(): PlayerStats {
    return {
      health: 100,
      maxHealth: 100,
      mana: 50,
      maxMana: 50,
      experience: 0,
      gold: 100
    };
  }
}
