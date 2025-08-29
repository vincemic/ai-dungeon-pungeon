import { Injectable, signal, computed } from '@angular/core';
import { DungeonMap, MapGenerationSettings, MapTheme, DifficultyLevel, Tile, TileType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class MapGenerationService {
  private readonly maps = signal<DungeonMap[]>([]);
  private readonly currentMap = signal<DungeonMap | null>(null);

  readonly savedMaps = computed(() => this.maps());
  readonly activeMap = computed(() => this.currentMap());

  generateMap(settings: MapGenerationSettings): DungeonMap {
    const map: DungeonMap = {
      id: this.generateId(),
      name: `${settings.theme} Dungeon`,
      width: settings.width,
      height: settings.height,
      tiles: this.generateTiles(settings),
      metadata: {
        theme: settings.theme,
        difficulty: settings.difficulty,
        estimatedPlayTime: this.calculatePlayTime(settings),
        maxPlayers: 6,
        description: `A ${settings.difficulty} ${settings.theme} dungeon`,
        tags: [settings.theme, settings.difficulty],
        dungeonMasterNotes: ''
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return map;
  }

  private generateTiles(settings: MapGenerationSettings): Tile[][] {
    const tiles: Tile[][] = [];
    
    // Initialize all tiles as walls
    for (let y = 0; y < settings.height; y++) {
      tiles[y] = [];
      for (let x = 0; x < settings.width; x++) {
        tiles[y][x] = {
          id: `${x}-${y}`,
          type: TileType.WALL,
          x,
          y,
          isWalkable: false,
          hasInteraction: false
        };
      }
    }

    // Generate rooms
    this.generateRooms(tiles, settings);
    
    // Generate corridors
    this.generateCorridors(tiles, settings);
    
    // Add special tiles
    this.addSpecialTiles(tiles, settings);

    return tiles;
  }

  private generateRooms(tiles: Tile[][], settings: MapGenerationSettings): void {
    const roomCount = Math.floor(settings.roomDensity * 10) + 3;
    const minRoomSize = 3;
    const maxRoomSize = Math.min(8, Math.floor(Math.min(settings.width, settings.height) / 4));

    for (let i = 0; i < roomCount; i++) {
      const roomWidth = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
      const roomHeight = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
      
      const x = Math.floor(Math.random() * (settings.width - roomWidth - 2)) + 1;
      const y = Math.floor(Math.random() * (settings.height - roomHeight - 2)) + 1;

      // Create room
      for (let ry = y; ry < y + roomHeight; ry++) {
        for (let rx = x; rx < x + roomWidth; rx++) {
          tiles[ry][rx] = {
            id: `${rx}-${ry}`,
            type: TileType.FLOOR,
            x: rx,
            y: ry,
            isWalkable: true,
            hasInteraction: false
          };
        }
      }
    }
  }

  private generateCorridors(tiles: Tile[][], settings: MapGenerationSettings): void {
    // Simple corridor generation - connect floor tiles
    const floorTiles = this.findFloorTiles(tiles);
    
    for (let i = 0; i < floorTiles.length - 1; i++) {
      const start = floorTiles[i];
      const end = floorTiles[i + 1];
      this.createCorridor(tiles, start, end);
    }
  }

  private findFloorTiles(tiles: Tile[][]): Tile[] {
    const floorTiles: Tile[] = [];
    for (let y = 0; y < tiles.length; y++) {
      for (let x = 0; x < tiles[y].length; x++) {
        if (tiles[y][x].type === TileType.FLOOR) {
          floorTiles.push(tiles[y][x]);
        }
      }
    }
    return floorTiles;
  }

  private createCorridor(tiles: Tile[][], start: Tile, end: Tile): void {
    let x = start.x;
    let y = start.y;

    // Move horizontally first
    while (x !== end.x) {
      if (tiles[y] && tiles[y][x] && tiles[y][x].type === TileType.WALL) {
        tiles[y][x] = {
          id: `${x}-${y}`,
          type: TileType.FLOOR,
          x,
          y,
          isWalkable: true,
          hasInteraction: false
        };
      }
      x += x < end.x ? 1 : -1;
    }

    // Move vertically
    while (y !== end.y) {
      if (tiles[y] && tiles[y][x] && tiles[y][x].type === TileType.WALL) {
        tiles[y][x] = {
          id: `${x}-${y}`,
          type: TileType.FLOOR,
          x,
          y,
          isWalkable: true,
          hasInteraction: false
        };
      }
      y += y < end.y ? 1 : -1;
    }
  }

  private addSpecialTiles(tiles: Tile[][], settings: MapGenerationSettings): void {
    const floorTiles = this.findFloorTiles(tiles);
    
    if (floorTiles.length === 0) return;

    // Add start tile
    const startTile = floorTiles[0];
    startTile.type = TileType.START;

    // Add exit tile
    const exitTile = floorTiles[floorTiles.length - 1];
    exitTile.type = TileType.EXIT;

    // Add treasures
    const treasureCount = Math.floor(settings.treasureDensity * floorTiles.length * 0.1);
    for (let i = 0; i < treasureCount && i < floorTiles.length - 2; i++) {
      const tile = floorTiles[i + 2];
      tile.type = TileType.TREASURE;
      tile.hasInteraction = true;
    }

    // Add traps
    const trapCount = Math.floor(settings.trapDensity * floorTiles.length * 0.05);
    for (let i = 0; i < trapCount && i < floorTiles.length - treasureCount - 2; i++) {
      const tile = floorTiles[i + treasureCount + 2];
      tile.type = TileType.TRAP;
      tile.hasInteraction = true;
    }
  }

  saveMap(map: DungeonMap): void {
    const currentMaps = this.maps();
    const existingIndex = currentMaps.findIndex(m => m.id === map.id);
    
    if (existingIndex >= 0) {
      currentMaps[existingIndex] = { ...map, updatedAt: new Date() };
    } else {
      currentMaps.push(map);
    }
    
    this.maps.set([...currentMaps]);
    this.saveToStorage();
  }

  loadMap(mapId: string): DungeonMap | null {
    const map = this.maps().find(m => m.id === mapId);
    if (map) {
      this.currentMap.set(map);
    }
    return map || null;
  }

  deleteMap(mapId: string): void {
    const updatedMaps = this.maps().filter(m => m.id !== mapId);
    this.maps.set(updatedMaps);
    this.saveToStorage();
  }

  private calculatePlayTime(settings: MapGenerationSettings): number {
    const baseTime = 30; // 30 minutes base
    const sizeMultiplier = (settings.width * settings.height) / 400; // 20x20 baseline
    const difficultyMultiplier = this.getDifficultyMultiplier(settings.difficulty);
    
    return Math.round(baseTime * sizeMultiplier * difficultyMultiplier);
  }

  private getDifficultyMultiplier(difficulty: DifficultyLevel): number {
    switch (difficulty) {
      case DifficultyLevel.EASY: return 0.8;
      case DifficultyLevel.MEDIUM: return 1.0;
      case DifficultyLevel.HARD: return 1.3;
      case DifficultyLevel.EXPERT: return 1.6;
      case DifficultyLevel.NIGHTMARE: return 2.0;
      default: return 1.0;
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('dungeon-maps', JSON.stringify(this.maps()));
    } catch (error) {
      console.error('Failed to save maps to storage:', error);
    }
  }

  loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('dungeon-maps');
      if (stored) {
        const maps = JSON.parse(stored);
        this.maps.set(maps);
      }
    } catch (error) {
      console.error('Failed to load maps from storage:', error);
    }
  }
}