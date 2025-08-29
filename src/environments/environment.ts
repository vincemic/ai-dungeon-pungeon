export const environment = {
  production: false,
  development: true,
  apiUrl: 'http://localhost:3000',
  gameConfig: {
    mapTileSize: 32,
    defaultMapSize: { width: 50, height: 50 },
    maxPlayers: 6,
    soundEnabled: true,
    visualEffectsEnabled: true,
    autoSave: true,
    autoSaveInterval: 30000 // 30 seconds
  },
  storage: {
    type: 'localStorage',
    prefix: 'dungeon-pungeon-dev'
  }
};