import { Player } from './player.types';
import { DungeonMap } from './map.types';

export interface GameSession {
  id: string;
  name: string;
  dungeonMaster: Player;
  players: Player[];
  currentMap: DungeonMap;
  gameState: GameState;
  settings: GameSettings;
  createdAt: Date;
  lastActivity: Date;
}

export enum GameState {
  WAITING_FOR_PLAYERS = 'waiting_for_players',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned'
}

export interface GameSettings {
  maxPlayers: number;
  turnBasedMode: boolean;
  allowSpectators: boolean;
  autoSave: boolean;
  autoSaveInterval: number;
  soundEnabled: boolean;
  visualEffectsEnabled: boolean;
  chatEnabled: boolean;
  voiceChatEnabled: boolean;
  gridVisible: boolean;
  fogOfWar: boolean;
  characterMovementSpeed: number;
}

export interface GameEvent {
  id: string;
  type: GameEventType;
  playerId?: string;
  timestamp: Date;
  data: any;
  description: string;
}

export enum GameEventType {
  PLAYER_JOINED = 'player_joined',
  PLAYER_LEFT = 'player_left',
  PLAYER_MOVED = 'player_moved',
  TILE_INTERACTION = 'tile_interaction',
  COMBAT_STARTED = 'combat_started',
  COMBAT_ENDED = 'combat_ended',
  ITEM_PICKUP = 'item_pickup',
  ITEM_USE = 'item_use',
  ABILITY_USED = 'ability_used',
  MAP_CHANGED = 'map_changed',
  GAME_PAUSED = 'game_paused',
  GAME_RESUMED = 'game_resumed',
  CHAT_MESSAGE = 'chat_message'
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: Date;
  type: ChatMessageType;
}

export enum ChatMessageType {
  PLAYER = 'player',
  SYSTEM = 'system',
  DM_ONLY = 'dm_only',
  WHISPER = 'whisper',
  ROLL = 'roll'
}