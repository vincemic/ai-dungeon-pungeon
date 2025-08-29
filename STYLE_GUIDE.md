# D&D Dungeon Pungeon Style Guide

## Overview

This style guide documents the visual design system for the D&D Dungeon Pungeon application, featuring a medieval fantasy theme that creates an immersive Dungeons & Dragons experience.

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Layout & Spacing](#layout--spacing)
4. [Component Styling](#component-styling)
5. [Visual Effects](#visual-effects)
6. [Responsive Design](#responsive-design)
7. [Accessibility](#accessibility)

## Color Palette

### Primary Colors

Our color system is built around medieval and fantasy themes:

```css
:root {
  /* Primary Colors */
  --primary-gold: #D4AF37;        /* Rich gold for highlights and accents */
  --deep-red: #8B0000;            /* Deep burgundy for headers and emphasis */
  --royal-purple: #4B0082;        /* Royal purple for primary actions */
  --forest-green: #228B22;        /* Forest green for success states */
  --ancient-bronze: #CD7F32;      /* Bronze for borders and details */
  
  /* Background Colors */
  --parchment: #F4E4BC;           /* Warm parchment for text and backgrounds */
  --dark-leather: #3C2414;        /* Dark leather for secondary text */
  --stone-gray: #696969;          /* Stone gray for disabled/secondary elements */
  
  /* Typography */
  --font-display: 'Cinzel Decorative', serif;  /* Ornate headings */
  --font-title: 'Cinzel', serif;               /* Section titles */
  --font-body: 'Cinzel', serif;                /* Body text */
  --font-ancient: 'Uncial Antiqua', cursive;   /* Special ancient text */
}
```

### Color Usage Guidelines

- **Primary Gold**: Use for primary buttons, active states, and key highlights
- **Deep Red**: Reserved for main headings, warnings, and important text
- **Royal Purple**: Primary action buttons and interactive elements
- **Forest Green**: Success states, health bars, and positive actions
- **Ancient Bronze**: Borders, decorative elements, and secondary accents
- **Parchment**: Main text color and light background elements
- **Dark Leather**: Secondary text and form labels
- **Stone Gray**: Disabled states and secondary actions

## Typography

### Font Hierarchy

```css
/* Display Headings (h1) */
.display-heading {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--deep-red);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
}

/* Section Titles (h2, h3) */
.section-title {
  font-family: var(--font-title);
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--deep-red);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* Subsection Titles (h4, h5) */
.subsection-title {
  font-family: var(--font-title);
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--deep-red);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* Body Text */
.body-text {
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.6;
  color: var(--dark-leather);
}

/* Ancient/Special Text */
.ancient-text {
  font-family: var(--font-ancient);
  font-style: italic;
  color: var(--ancient-bronze);
}
```

### Typography Best Practices

- Always include `text-shadow` for headings to enhance readability
- Use `var(--font-*)` custom properties for consistent font application
- Maintain proper line-height (1.6) for body text readability
- Reserve decorative fonts for headings only

## Layout & Spacing

### Spacing Scale

```css
/* Spacing Variables */
:root {
  --spacing-xs: 0.5rem;    /* 8px */
  --spacing-sm: 0.75rem;   /* 12px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-xxl: 3rem;     /* 48px */
}
```

### Container Standards

```css
/* Main Containers */
.main-container {
  padding: var(--spacing-lg);
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(135deg, 
    rgba(60, 36, 20, 0.1) 0%, 
    rgba(139, 69, 19, 0.05) 50%, 
    rgba(244, 228, 188, 0.1) 100%
  );
  min-height: calc(100vh - 140px);
  position: relative;
}

/* Content Sections */
.content-section {
  background: linear-gradient(145deg, 
    rgba(244, 228, 188, 0.95) 0%, 
    rgba(218, 165, 32, 0.1) 100%
  );
  padding: var(--spacing-xl);
  border: 3px solid var(--ancient-bronze);
  border-radius: 12px;
  box-shadow: 
    0 8px 24px rgba(139, 69, 19, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  margin-bottom: var(--spacing-lg);
  position: relative;
}
```

## Component Styling

### Buttons

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(145deg, var(--royal-purple), #3a006b);
  color: var(--parchment);
  border: 2px solid var(--primary-gold);
  padding: 1rem 2rem;
  border-radius: 8px;
  font-family: var(--font-title);
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 16px rgba(75, 0, 130, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: linear-gradient(145deg, var(--stone-gray), #4a4a4a);
  color: var(--parchment);
  border: 2px solid var(--ancient-bronze);
  /* ... other styles same as primary ... */
}
```

#### Success Button
```css
.btn-success {
  background: linear-gradient(145deg, var(--forest-green), #1e7e1e);
  color: var(--parchment);
  border: 2px solid var(--primary-gold);
  /* ... other styles same as primary ... */
}
```

#### Danger Button
```css
.btn-danger {
  background: linear-gradient(145deg, var(--deep-red), #a00000);
  color: var(--parchment);
  border: 2px solid rgba(220, 53, 69, 0.8);
  /* ... other styles same as primary ... */
}
```

### Form Elements

#### Input Fields
```css
.form-control {
  padding: 1rem;
  border: 2px solid var(--ancient-bronze);
  border-radius: 8px;
  font-family: var(--font-body);
  background: linear-gradient(145deg, 
    rgba(244, 228, 188, 0.9) 0%, 
    rgba(218, 165, 32, 0.1) 100%
  );
  color: var(--dark-leather);
  box-shadow: 
    inset 0 2px 4px rgba(139, 69, 19, 0.2),
    0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: var(--primary-gold);
  box-shadow: 
    inset 0 2px 4px rgba(139, 69, 19, 0.3),
    0 0 0 3px rgba(212, 175, 55, 0.3),
    0 2px 6px rgba(0, 0, 0, 0.2);
  background: linear-gradient(145deg, 
    rgba(244, 228, 188, 1) 0%, 
    rgba(218, 165, 32, 0.2) 100%
  );
}
```

#### Labels
```css
.form-label {
  font-weight: 600;
  color: var(--deep-red);
  font-family: var(--font-title);
  font-size: 1.1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  margin-bottom: var(--spacing-sm);
  display: block;
}
```

### Cards & Panels

#### Standard Card
```css
.card {
  background: linear-gradient(145deg, 
    rgba(60, 36, 20, 0.9) 0%, 
    rgba(28, 28, 28, 0.9) 100%
  );
  color: var(--parchment);
  border: 3px solid var(--ancient-bronze);
  border-radius: 12px;
  padding: var(--spacing-lg);
  box-shadow: 
    0 4px 12px rgba(139, 69, 19, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 8px 20px rgba(139, 69, 19, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
```

### Navigation

#### Navigation Header
```css
.nav-header {
  background: linear-gradient(145deg, 
    rgba(60, 36, 20, 0.95) 0%, 
    rgba(28, 28, 28, 0.95) 100%
  );
  border-bottom: 4px solid var(--primary-gold);
  padding: var(--spacing-lg);
  box-shadow: 
    0 4px 12px rgba(139, 69, 19, 0.4),
    inset 0 -1px 0 rgba(218, 165, 32, 0.3);
}
```

#### Navigation Links
```css
.nav-link {
  color: var(--parchment);
  text-decoration: none;
  font-family: var(--font-title);
  font-weight: 600;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--primary-gold);
  background: rgba(212, 175, 55, 0.1);
  text-shadow: 0 0 8px var(--primary-gold);
}
```

## Visual Effects

### Parchment Texture Pattern

Apply to section backgrounds:

```css
.parchment-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><defs><pattern id="parchment" patternUnits="userSpaceOnUse" width="60" height="60"><rect width="60" height="60" fill="%23F4E4BC" opacity="0.1"/><circle cx="30" cy="30" r="1" fill="%23CD7F32" opacity="0.2"/></pattern></defs><rect width="60" height="60" fill="url(%23parchment)"/></svg>') repeat;
  opacity: 0.3;
  border-radius: inherit;
  z-index: 1;
}
```

### Magical Glow Effects

For interactive elements:

```css
.magical-glow {
  position: relative;
}

.magical-glow::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    transparent 50%, 
    rgba(255, 255, 255, 0.1) 100%
  );
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.magical-glow:hover::before {
  opacity: 1;
}
```

### Animated Effects

#### Treasure Glow Animation
```css
@keyframes treasure-glow {
  from { 
    box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.3), 
                0 0 8px rgba(255, 215, 0, 0.6); 
  }
  to { 
    box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5), 
                0 0 12px rgba(255, 215, 0, 0.8); 
  }
}

.treasure-glow {
  animation: treasure-glow 2s ease-in-out infinite alternate;
}
```

#### Pulse Animation
```css
@keyframes pulse {
  0%, 100% { 
    box-shadow: 0 0 8px rgba(34, 139, 34, 0.6); 
  }
  50% { 
    box-shadow: 0 0 12px rgba(34, 139, 34, 0.8); 
  }
}

.pulse-effect {
  animation: pulse 3s ease-in-out infinite;
}
```

## Game-Specific Components

### Tile System

#### Floor Tiles
```css
.tile.floor {
  background: linear-gradient(145deg, 
    rgba(244, 228, 188, 0.9) 0%, 
    rgba(218, 165, 32, 0.3) 100%
  );
  border: 1px solid rgba(205, 127, 50, 0.3);
  box-shadow: inset 0 1px 2px rgba(139, 69, 19, 0.2);
}
```

#### Wall Tiles
```css
.tile.wall {
  background: linear-gradient(145deg, 
    rgba(60, 36, 20, 0.9) 0%, 
    rgba(28, 28, 28, 0.9) 100%
  );
  border: 1px solid var(--ancient-bronze);
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.4),
    0 1px 2px rgba(139, 69, 19, 0.3);
}
```

#### Special Tiles
```css
.tile.treasure {
  background: linear-gradient(145deg, 
    var(--primary-gold) 0%, 
    rgba(184, 134, 11, 0.9) 100%
  );
  animation: treasure-glow 2s ease-in-out infinite alternate;
}

.tile.trap {
  background: linear-gradient(145deg, 
    var(--deep-red) 0%, 
    rgba(119, 0, 0, 0.9) 100%
  );
  box-shadow: 0 0 6px rgba(220, 53, 69, 0.5);
}
```

### Player Sprites
```css
.player-sprite {
  width: 24px;
  height: 24px;
  background: linear-gradient(145deg, var(--royal-purple), #3a006b);
  color: var(--primary-gold);
  border: 2px solid var(--ancient-bronze);
  border-radius: 50%;
  font-family: var(--font-title);
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  box-shadow: 
    0 2px 6px rgba(75, 0, 130, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
```

### Health & Status Bars
```css
.health-bar {
  height: 10px;
  background: rgba(60, 36, 20, 0.6);
  border: 1px solid var(--ancient-bronze);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
}

.health-fill {
  height: 100%;
  background: linear-gradient(90deg, 
    var(--forest-green) 0%, 
    #32cd32 100%
  );
  transition: width 0.3s ease;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.3);
}

.mana-fill {
  background: linear-gradient(90deg, 
    var(--royal-purple) 0%, 
    #6a5acd 100%
  );
}
```

## Responsive Design

### Breakpoints
```css
/* Tablet */
@media (max-width: 1024px) {
  .detail-sections {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .players-grid {
    grid-template-columns: 1fr;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .btn {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: 0.9rem;
  }
  
  .display-heading {
    font-size: 2rem;
  }
}
```

### Mobile-Specific Adjustments
- Reduce padding and margins for mobile screens
- Stack grid layouts vertically
- Adjust font sizes for readability
- Ensure touch targets are minimum 44px

## Accessibility

### Color Contrast
- All text meets WCAG AA contrast requirements
- Important actions use high contrast combinations
- Never rely on color alone to convey information

### Focus States
```css
.interactive-element:focus {
  outline: 2px solid var(--primary-gold);
  outline-offset: 2px;
  box-shadow: 
    0 0 0 4px rgba(212, 175, 55, 0.3),
    0 0 8px var(--primary-gold);
}
```

### Screen Reader Support
- Use semantic HTML elements
- Provide alt text for decorative elements when necessary
- Ensure proper heading hierarchy
- Include ARIA labels for complex interactions

## Implementation Guidelines

### CSS Custom Properties
Always use CSS custom properties for:
- Colors
- Typography
- Spacing
- Border radius values
- Shadow definitions

### Component Structure
1. Start with semantic HTML
2. Apply base styles using custom properties
3. Add texture patterns with `::before` pseudo-elements
4. Include hover/focus states
5. Add responsive adjustments

### Performance Considerations
- Use `transform` and `opacity` for animations
- Minimize box-shadow complexity where possible
- Optimize SVG patterns for repeated use
- Use `will-change` property sparingly for animations

### Code Organization
```
styles/
├── base/
│   ├── reset.css
│   ├── typography.css
│   └── variables.css
├── components/
│   ├── buttons.css
│   ├── forms.css
│   ├── cards.css
│   └── navigation.css
├── layout/
│   ├── grid.css
│   └── containers.css
└── themes/
    └── dnd-medieval.css
```

## Maintenance

### Version Control
- Document all changes to the color palette
- Test new components against existing patterns
- Maintain backwards compatibility when possible

### Testing Checklist
- [ ] Visual consistency across components
- [ ] Responsive behavior on all breakpoints
- [ ] Accessibility compliance
- [ ] Performance impact assessment
- [ ] Cross-browser compatibility

This style guide serves as the single source of truth for maintaining visual consistency throughout the D&D Dungeon Pungeon application. Follow these guidelines to ensure all new components and features align with the established medieval fantasy theme.