import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapGenerationService } from '../../core/services/map-generation.service';
import { GameManagementService } from '../../core/services/game-management.service';
import { AudioService } from '../../core/services/audio.service';
import { DungeonMap, Player, Position, TileType, Tile, Direction } from '../../core/types';

@Component({
  selector: 'app-game-map',
  imports: [CommonModule, FormsModule],
  templateUrl: './game-map.html',
  styleUrl: './game-map.css'
})
export class GameMap {
  private mapService = inject(MapGenerationService);
  private gameService = inject(GameManagementService);
  private audioService = inject(AudioService);

  selectedMapId = signal<string>('');
  zoomLevel = signal<number>(1);
  showPlayerNames = signal<boolean>(true);
  showGrid = signal<boolean>(true);
  selectedPlayerId = signal<string>('');
  
  currentMap = computed(() => {
    const mapId = this.selectedMapId();
    return mapId ? this.mapService.savedMaps().find(map => map.id === mapId) : null;
  });

  currentPlayers = computed(() => this.gameService.activePlayers());
  
  savedMaps = computed(() => this.mapService.savedMaps());

  TileType = TileType;

  loadMap(mapId: string) {
    this.selectedMapId.set(mapId);
    if (mapId) {
      this.audioService.playAmbientSound('dungeon');
    }
  }

  getTileClass(tile: Tile): string {
    const baseClass = 'tile';
    switch (tile.type) {
      case TileType.WALL: return `${baseClass} wall`;
      case TileType.FLOOR: return `${baseClass} floor`;
      case TileType.DOOR: return `${baseClass} door`;
      case TileType.TREASURE: return `${baseClass} treasure`;
      case TileType.TRAP: return `${baseClass} trap`;
      case TileType.START: return `${baseClass} start`;
      case TileType.EXIT: return `${baseClass} exit`;
      case TileType.WATER: return `${baseClass} water`;
      case TileType.LAVA: return `${baseClass} lava`;
      case TileType.STAIRS_UP: return `${baseClass} stairs-up`;
      case TileType.STAIRS_DOWN: return `${baseClass} stairs-down`;
      default: return baseClass;
    }
  }

  getPlayerAt(x: number, y: number): Player | null {
    return this.currentPlayers().find(player => 
      player.position.x === x && player.position.y === y
    ) || null;
  }

  onTileClick(x: number, y: number) {
    const map = this.currentMap();
    if (!map) return;

    const tile = map.tiles[y][x];
    
    // Play appropriate sound effect
    switch (tile.type) {
      case TileType.DOOR:
        this.audioService.playDoorSound(true);
        break;
      case TileType.TREASURE:
        this.audioService.playTreasureSound();
        break;
      case TileType.TRAP:
        this.audioService.playTrapSound();
        break;
      default:
        this.audioService.playFootstep();
    }

    // Move selected player if any
    const selectedPlayerId = this.selectedPlayerId();
    if (selectedPlayerId && this.canMoveTo(tile)) {
      const newPosition: Position = { 
        x, 
        y, 
        facing: this.calculateDirection(selectedPlayerId, x, y) 
      };
      this.gameService.movePlayer(selectedPlayerId, newPosition);
    }
  }

  private canMoveTo(tile: Tile): boolean {
    return tile.isWalkable;
  }

  private calculateDirection(playerId: string, targetX: number, targetY: number): Direction {
    const player = this.currentPlayers().find(p => p.id === playerId);
    if (!player) return Direction.NORTH;

    const deltaX = targetX - player.position.x;
    const deltaY = targetY - player.position.y;

    if (deltaX > 0 && deltaY === 0) return Direction.EAST;
    if (deltaX < 0 && deltaY === 0) return Direction.WEST;
    if (deltaX === 0 && deltaY > 0) return Direction.SOUTH;
    if (deltaX === 0 && deltaY < 0) return Direction.NORTH;
    if (deltaX > 0 && deltaY > 0) return Direction.SOUTHEAST;
    if (deltaX > 0 && deltaY < 0) return Direction.NORTHEAST;
    if (deltaX < 0 && deltaY > 0) return Direction.SOUTHWEST;
    if (deltaX < 0 && deltaY < 0) return Direction.NORTHWEST;

    return Direction.NORTH;
  }

  selectPlayer(playerId: string) {
    this.selectedPlayerId.set(playerId);
  }

  adjustZoom(delta: number) {
    const newZoom = Math.max(0.5, Math.min(3, this.zoomLevel() + delta));
    this.zoomLevel.set(newZoom);
  }

  resetZoom() {
    this.zoomLevel.set(1);
  }

  toggleGrid() {
    this.showGrid.set(!this.showGrid());
  }

  togglePlayerNames() {
    this.showPlayerNames.set(!this.showPlayerNames());
  }

  exportMap() {
    const map = this.currentMap();
    if (!map) return;

    const dataStr = JSON.stringify(map, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${map.name}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }
}
