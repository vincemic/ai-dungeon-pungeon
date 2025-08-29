export interface Player {
  id: string;
  name: string;
  character: Character;
  position: Position;
  isActive: boolean;
  stats: PlayerStats;
  inventory: InventoryItem[];
  sessionId?: string;
}

export interface Character {
  id: string;
  name: string;
  class: CharacterClass;
  level: number;
  sprite: CharacterSprite;
  abilities: Ability[];
}

export enum CharacterClass {
  WARRIOR = 'warrior',
  MAGE = 'mage',
  ROGUE = 'rogue',
  RANGER = 'ranger',
  CLERIC = 'cleric',
  PALADIN = 'paladin',
  BARBARIAN = 'barbarian',
  MONK = 'monk'
}

export interface CharacterSprite {
  idle: string;
  walking: string[];
  attacking?: string[];
  casting?: string[];
  size: { width: number; height: number };
}

export interface Position {
  x: number;
  y: number;
  facing: Direction;
}

export enum Direction {
  NORTH = 'north',
  SOUTH = 'south',
  EAST = 'east',
  WEST = 'west',
  NORTHEAST = 'northeast',
  NORTHWEST = 'northwest',
  SOUTHEAST = 'southeast',
  SOUTHWEST = 'southwest'
}

export interface PlayerStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  experience: number;
  gold: number;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  manaCost: number;
  range: number;
  effect: AbilityEffect;
}

export interface AbilityEffect {
  type: EffectType;
  value: number;
  duration?: number;
  areaOfEffect?: number;
}

export enum EffectType {
  DAMAGE = 'damage',
  HEAL = 'heal',
  BUFF = 'buff',
  DEBUFF = 'debuff',
  TELEPORT = 'teleport',
  SUMMON = 'summon'
}

export interface InventoryItem {
  id: string;
  name: string;
  type: ItemType;
  quantity: number;
  description: string;
  value: number;
  sprite: string;
}

export enum ItemType {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  CONSUMABLE = 'consumable',
  TREASURE = 'treasure',
  KEY = 'key',
  QUEST_ITEM = 'quest_item',
  TOOL = 'tool'
}