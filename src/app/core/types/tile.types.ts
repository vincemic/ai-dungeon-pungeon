export interface Tile {
  id: string;
  type: TileType;
  x: number;
  y: number;
  isWalkable: boolean;
  hasInteraction: boolean;
  interactionType?: InteractionType;
  visualEffects?: VisualEffect[];
  soundEffect?: SoundEffect;
}

export enum TileType {
  FLOOR = 'floor',
  WALL = 'wall',
  DOOR = 'door',
  TRAP = 'trap',
  TREASURE = 'treasure',
  START = 'start',
  EXIT = 'exit',
  WATER = 'water',
  LAVA = 'lava',
  STAIRS_UP = 'stairs_up',
  STAIRS_DOWN = 'stairs_down'
}

export enum InteractionType {
  OPEN_DOOR = 'open_door',
  PICKUP_TREASURE = 'pickup_treasure',
  TRIGGER_TRAP = 'trigger_trap',
  USE_STAIRS = 'use_stairs',
  ENTER_PORTAL = 'enter_portal'
}

export interface VisualEffect {
  type: VisualEffectType;
  duration: number;
  intensity: number;
  color?: string;
}

export enum VisualEffectType {
  GLOW = 'glow',
  SPARKLE = 'sparkle',
  FLAME = 'flame',
  SMOKE = 'smoke',
  LIGHTNING = 'lightning',
  RIPPLE = 'ripple'
}

export interface SoundEffect {
  src: string;
  volume: number;
  loop: boolean;
  type: SoundEffectType;
}

export enum SoundEffectType {
  AMBIENT = 'ambient',
  FOOTSTEP = 'footstep',
  DOOR = 'door',
  TREASURE = 'treasure',
  TRAP = 'trap',
  MAGIC = 'magic',
  COMBAT = 'combat'
}