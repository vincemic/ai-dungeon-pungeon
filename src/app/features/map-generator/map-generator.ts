import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapGenerationService } from '../../core/services';
import { MapGenerationSettings, MapTheme, DifficultyLevel, DungeonMap } from '../../core/types';

@Component({
  selector: 'app-map-generator',
  imports: [CommonModule, FormsModule],
  templateUrl: './map-generator.html',
  styleUrl: './map-generator.css'
})
export class MapGenerator {
  private readonly mapService = inject(MapGenerationService);

  readonly settings = signal<MapGenerationSettings>({
    width: 30,
    height: 30,
    theme: MapTheme.CLASSIC_DUNGEON,
    difficulty: DifficultyLevel.MEDIUM,
    roomDensity: 0.5,
    corridorComplexity: 0.5,
    treasureDensity: 0.3,
    trapDensity: 0.2,
    secretAreaChance: 0.1,
    multiLevelProbability: 0.0
  });

  readonly generatedMap = signal<DungeonMap | null>(null);
  readonly isGenerating = signal<boolean>(false);
  
  readonly mapThemes = Object.values(MapTheme);
  readonly difficultyLevels = Object.values(DifficultyLevel);
  readonly savedMaps = computed(() => this.mapService.savedMaps());

  updateSetting<K extends keyof MapGenerationSettings>(
    key: K, 
    value: MapGenerationSettings[K]
  ): void {
    this.settings.update(current => ({ ...current, [key]: value }));
  }

  generateMap(): void {
    this.isGenerating.set(true);
    
    // Simulate generation delay for UX
    setTimeout(() => {
      try {
        const map = this.mapService.generateMap(this.settings());
        this.generatedMap.set(map);
      } catch (error) {
        console.error('Failed to generate map:', error);
      } finally {
        this.isGenerating.set(false);
      }
    }, 500);
  }

  saveMap(): void {
    const map = this.generatedMap();
    if (map) {
      this.mapService.saveMap(map);
    }
  }

  loadMap(mapId: string): void {
    const map = this.mapService.loadMap(mapId);
    if (map) {
      this.generatedMap.set(map);
    }
  }

  deleteMap(mapId: string): void {
    this.mapService.deleteMap(mapId);
  }

  randomizeSeed(): void {
    const randomSeed = Math.random().toString(36).substring(2, 15);
    this.updateSetting('seed', randomSeed);
  }
}
