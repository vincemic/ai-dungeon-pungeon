export const environment = {
  production: true,
  development: false,
  apiUrl: 'https://api.dungeon-pungeon.com',
  gameConfig: {
    mapTileSize: 32,
    defaultMapSize: { width: 50, height: 50 },
    maxPlayers: 6,
    soundEnabled: true,
    visualEffectsEnabled: true,
    autoSave: true,
    autoSaveInterval: 60000 // 60 seconds
  },
  storage: {
    type: 'localStorage',
    prefix: 'dungeon-pungeon-prod'
  }
};