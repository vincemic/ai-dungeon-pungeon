# � AI Dungeon Pungeon ⚔️

A comprehensive **Dungeons & Dragons** dungeon generator and management system built with **Angular 20**. Create immersive dungeons, manage players, and enhance your D&D campaigns with procedural map generation, interactive gameplay, and atmospheric sound effects.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen)](https://vincemic.github.io/ai-dungeon-pungeon/)
[![Angular](https://img.shields.io/badge/Angular-20.2.1-red)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ Features

### 🗺️ **Procedural Map Generation**
- **10 Unique Themes**: Classic dungeons, caves, castles, forests, deserts, ice caverns, volcanoes, underwater ruins, space stations, and cyberpunk environments
- **5 Difficulty Levels**: Easy, Medium, Hard, Expert, and Nightmare
- **Customizable Parameters**: Adjustable room density, treasure placement, and trap frequency
- **Seed-based Generation**: Create reproducible maps with custom seeds
- **Visual Map Preview**: Instant map visualization with estimated play time

### 👥 **Player Management System**
- **Character Creation**: Support for multiple D&D character classes
- **Session Tracking**: Manage active players and their progress
- **Character Stats**: Track health, abilities, and equipment
- **Party Management**: Organize players into adventuring parties

### 🎮 **Interactive Game Map**
- **Tile-based Navigation**: Click to move through dungeon tiles
- **Interactive Elements**: Discover treasures, avoid traps, open doors
- **Zoom Controls**: Scale maps for detailed exploration
- **Export Functionality**: Save maps for external use

### 🔊 **Immersive Audio System**
- **Sound Effect Categories**: Footsteps, doors, treasures, traps, magic, combat, and ambient sounds
- **Freesound.org Integration**: Browse and download sound effects directly
- **Web Audio API**: High-quality audio processing with graceful fallbacks
- **Sound Management**: Organize and activate sound effects by category

### � **Authentic D&D Theming**
- **Medieval Typography**: Cinzel Decorative and Cinzel fonts for authentic feel
- **Rich Color Palette**: Gold, deep red, royal purple, forest green, and bronze
- **Parchment Textures**: Subtle background patterns and medieval styling
- **Responsive Design**: Optimized for desktop and mobile devices

## 📸 Screenshots

### 🛡️ Game Dashboard
The central hub for managing your D&D campaigns with session overview and quick access to all features.

![Game Dashboard](screenshots/dashboard.png)

### 🗺️ Map Generator
Create procedural dungeons with customizable parameters and instant visual feedback.

![Map Generator](screenshots/map-generator.png)

### 🎯 Interactive Game Map
Navigate through generated dungeons with zoom controls and interactive tile exploration.

![Game Map](screenshots/game-map.png)

### 👥 Player Management
Organize and track your adventuring party with detailed character management.

![Player Management](screenshots/players.png)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- Modern web browser with Web Audio API support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-dungeon-pungeon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Build for GitHub Pages
npm run build:github

# Run end-to-end tests
npm run test:e2e

# Lint code
npm run lint
```

### Project Structure

```
src/app/
├── core/
│   ├── services/           # Business logic services
│   │   ├── map-generation.service.ts
│   │   ├── game-management.service.ts
│   │   └── audio.service.ts
│   └── types/              # TypeScript definitions
│       ├── tile.types.ts
│       ├── map.types.ts
│       ├── player.types.ts
│       └── game.types.ts
├── features/               # Feature components
│   ├── game-dashboard/     # Main dashboard
│   ├── map-generator/      # Map creation
│   ├── game-map/          # Interactive map
│   └── player-management/  # Player management
├── app.component.*         # Root component
└── app.routes.ts          # Routing configuration
```

## 🧪 Testing

### End-to-End Testing with Playwright

The project includes comprehensive E2E testing setup:

```bash
# Run all tests
npm run test:e2e

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests in headed mode
npx playwright test --headed

# Generate test report
npx playwright show-report
```

### Supported Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🚀 Deployment

### GitHub Pages (Automatic)

The project is configured for automatic deployment to GitHub Pages via GitHub Actions:

1. **Push to main branch** triggers the deployment workflow
2. **Automated build** with GitHub Pages configuration
3. **Test execution** (non-blocking)
4. **Deployment** to GitHub Pages

### Manual Deployment

```bash
# Build for GitHub Pages
npm run build:github

# Deploy dist/ folder to your hosting provider
```

## 🎮 How to Use

### 1. Create a Game Session
- Navigate to the Dashboard
- Click "Create New Session"
- Enter session name and Dungeon Master name
- Click "Create Session"

### 2. Generate a Map
- Go to "Map Generator"
- Configure map settings (size, theme, difficulty)
- Click "Generate Map"
- Save the map for use in gameplay

### 3. Add Players
- Navigate to "Player Management"
- Click "Add Player"
- Fill in player and character details
- Select character class
- Click "Create Player"

### 4. Start Playing
- Go to "Game Map"
- Select a saved map
- Click on tiles to move players
- Interact with doors, treasures, and traps
- Enjoy the audio feedback and visual effects

## 🔧 Configuration

### Environment Files

- `src/environments/environment.ts` - Development settings
- `src/environments/environment.prod.ts` - Production settings
- `src/environments/environment.github.ts` - GitHub Pages settings

### Audio Settings

The application uses Web Audio API for sound effects. Audio can be toggled using the speaker icon in the navigation bar.

### Map Generation Settings

Customize map generation through the Map Generator interface:
- **Dimensions**: Width and height (10-100 tiles)
- **Theme**: Visual style and tile types
- **Difficulty**: Affects trap and treasure density
- **Density Settings**: Room, corridor, treasure, and trap density

## 🎨 Customization

### Adding New Tile Types

1. Update `src/app/core/types/tile.types.ts`
2. Add new tile type to `TileType` enum
3. Update map generation logic in `MapGenerationService`
4. Add visual styles in component CSS files

### Adding Character Classes

1. Update `src/app/core/types/player.types.ts`
2. Add new class to `CharacterClass` enum
3. Update character creation in `PlayerManagementComponent`
4. Add class-specific abilities and sprites

### Custom Themes

1. Update `src/app/core/types/map.types.ts`
2. Add new theme to `MapTheme` enum
3. Update map generation algorithms
4. Add theme-specific visual styles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Follow Angular Style Guide
- Use TypeScript strict mode
- Include proper error handling
- Add meaningful comments
- Maintain test coverage

## 📚 Documentation

- [Requirements Documentation](./REQUIREMENTS.md) - Detailed functional and non-functional requirements
- [Technical Summary](./TECHNICAL-SUMMARY.md) - Implementation details and architecture
- [Angular Documentation](https://angular.io/docs) - Official Angular framework documentation
- [Playwright Documentation](https://playwright.dev/) - E2E testing framework documentation

## 🔊 Audio Assets

The application expects audio files in the following locations:
```
public/assets/sounds/
├── footstep.mp3
├── door-open.mp3
├── door-close.mp3
├── treasure.mp3
├── trap.mp3
├── magic.mp3
├── combat.mp3
└── ambient-dungeon.mp3
```

*Note: Audio files are not included in the repository due to licensing considerations.*

## 🌐 Browser Support

### Minimum Requirements
- Modern browser with ES2020 support
- Web Audio API support
- Local Storage support
- CSS Grid and Flexbox support

### Recommended Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Angular team for the excellent framework
- Playwright team for reliable testing tools
- GitHub for free hosting and CI/CD
- The RPG community for inspiration and feedback

## 📞 Support

For issues, questions, or feature requests:
1. Check existing [Issues](../../issues)
2. Create a new issue with detailed description
3. Follow the issue template for bug reports

## 🔄 Changelog

### Version 1.0.0 (Initial Release)
- ✅ Complete Angular 20.2.1 implementation
- ✅ Dungeon map generation system
- ✅ Interactive gameplay features
- ✅ Player management system
- ✅ Session management
- ✅ Audio system integration
- ✅ Responsive design
- ✅ GitHub Pages deployment
- ✅ Playwright testing setup

---

**Built with ❤️ using Angular 20.2.1**

*Ready to create epic adventures? Start generating your dungeons today!* 🏰⚔️
