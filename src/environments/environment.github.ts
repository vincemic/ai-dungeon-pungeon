export const environment = {
  production: true,
  development: false,
  apiUrl: '',
  baseHref: '/ai-dungeon-pungeon/',
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
    prefix: 'dungeon-pungeon-gh'
  }
};