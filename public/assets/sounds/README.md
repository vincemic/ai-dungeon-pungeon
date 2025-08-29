# Audio Assets

This directory contains audio files for the AI Dungeon Pungeon game.

## Required Audio Files

The following MP3 files should be placed in this directory for full audio functionality:

- `footstep.mp3` - Player movement sound
- `door-open.mp3` - Door opening sound
- `door-close.mp3` - Door closing sound  
- `treasure.mp3` - Treasure collection sound
- `trap.mp3` - Trap activation sound
- `magic.mp3` - Magic spell sound
- `combat.mp3` - Combat action sound
- `ambient-dungeon.mp3` - Background ambient sound

## Audio Requirements

- Format: MP3
- Quality: Any (recommend 128kbps for web)
- Length: 1-5 seconds for effects, longer for ambient
- Volume: Mixed at consistent levels

## Sources

Audio files are not included due to licensing considerations. You can:

1. Create your own audio files
2. Use royalty-free audio from sites like:
   - Freesound.org
   - Zapsplat.com
   - Adobe Stock
   - YouTube Audio Library

## Fallback Behavior

If audio files are missing, the application will:
- Display warnings in browser console
- Create silent audio buffers as fallbacks
- Continue functioning without sound effects
- Show audio disabled state in UI

## Testing Audio

1. Place MP3 files in this directory
2. Refresh the application
3. Check browser console for loading status
4. Toggle audio with speaker icon in navigation