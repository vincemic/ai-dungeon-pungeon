# 🎲 AI Dungeon Pungeon

A modern web-based dungeon map generator and game management system for tabletop RPG sessions, built with Angular 20.2.1.

![Angular](https://img.shields.io/badge/Angular-20.2.1-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Playwright](https://img.shields.io/badge/Playwright-Testing-green)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-success)

## 🌟 Features

### 🗺️ Map Generation
- **Algorithmic Dungeon Creation**: Generate unique dungeon maps with customizable parameters
- **Multiple Themes**: Classic dungeons, caves, castles, forests, and more
- **Difficulty Levels**: From easy to nightmare difficulty settings
- **Save & Export**: Store maps locally and export as JSON files

### 👥 Player Management
- **Character Creation**: Multiple character classes with unique abilities
- **Statistics Tracking**: Health, mana, experience, and gold management
- **Real-time Updates**: Live player position and stat tracking
- **Inventory System**: Item management with various item types

### 🎮 Interactive Gameplay
- **Tile-based Movement**: Click-to-move player navigation
- **Interactive Elements**: Doors, traps, treasures, and special tiles
- **Visual Feedback**: Smooth animations and state indicators
- **Audio Effects**: Immersive sound effects for enhanced gameplay

### 🎯 Session Management
- **Game Sessions**: Create and manage multiplayer RPG sessions
- **State Tracking**: Game progress and session duration monitoring
- **Auto-save**: Automatic session persistence to local storage
- **Export/Import**: Share session data between devices

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
