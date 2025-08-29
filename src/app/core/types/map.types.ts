import { Tile } from './tile.types';

export interface DungeonMap {
  id: string;
  name: string;
  width: number;
  height: number;
  tiles: Tile[][];
  metadata: MapMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface MapMetadata {
  theme: MapTheme;
  difficulty: DifficultyLevel;
  estimatedPlayTime: number;
  maxPlayers: number;
  description: string;
  tags: string[];
  dungeonMasterNotes?: string;
}

export enum MapTheme {
  CLASSIC_DUNGEON = 'classic_dungeon',
  CAVE_SYSTEM = 'cave_system',
  CASTLE = 'castle',
  FOREST = 'forest',
  DESERT_RUINS = 'desert_ruins',
  ICE_CAVERN = 'ice_cavern',
  VOLCANO = 'volcano',
  UNDERWATER = 'underwater',
  SPACE_STATION = 'space_station',
  CYBERPUNK = 'cyberpunk'
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
  NIGHTMARE = 'nightmare'
}

export interface MapGenerationSettings {
  width: number;
  height: number;
  theme: MapTheme;
  difficulty: DifficultyLevel;
  roomDensity: number; // 0-1
  corridorComplexity: number; // 0-1
  treasureDensity: number; // 0-1
  trapDensity: number; // 0-1
  secretAreaChance: number; // 0-1
  multiLevelProbability: number; // 0-1
  seed?: string;
}