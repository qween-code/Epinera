# Epinera Design System
## Retro-Futuristic Neomorphic Gaming Marketplace

**Design Philosophy:** A fusion of retro-futuristic cyberpunk aesthetics with soft neomorphic (neumorphism) UI elements, creating a dark-mode-first gaming marketplace that feels both nostalgic and cutting-edge. Inspired by Cyberpunk 2077's UI art direction, the neon glow of 80s sci-fi, and the tactile depth of neumorphism -- all adapted for a modern e-commerce experience.

**Key Influences:** G2A's dark marketplace layout with orange accents, Eneba's clean user-friendly interface with strong filtering, Kinguin's community-driven trust signals, DaisyUI's cyberpunk theme, and the broader 2025-2026 "Hyper-Retroism" trend.

---

## 1. Color Palette

### 1.1 Core Dark Backgrounds (Dark-Mode-First)
Never use pure black or pure white. All backgrounds use tinted dark grays with subtle blue undertones.
```css
--bg-void:        #06080F;  /* Deepest background, page body */
--bg-base:        #0B0E18;  /* Primary surface (main content area) */
--bg-raised:      #111629;  /* Raised surfaces (cards, panels) */
--bg-elevated:    #1A1F36;  /* Elevated elements (dropdowns, modals) */
--bg-surface:     #222847;  /* Interactive surfaces (hover states) */
--bg-highlight:   #2A3158;  /* Highlighted/selected states */
```

### 1.2 Primary Brand -- Electric Cyan
The signature neon color. Used for primary CTAs, active states, links, and key highlights.
```css
--neon-cyan-50:   #E0FFFE;
--neon-cyan-100:  #B8FFFC;
--neon-cyan-200:  #76FFF9;
--neon-cyan-300:  #33FFF5;
--neon-cyan-400:  #00E5FF;  /* Primary neon accent */
--neon-cyan-500:  #00BCD4;
--neon-cyan-600:  #0097A7;
--neon-cyan-700:  #00838F;
--neon-cyan-800:  #006064;
--neon-cyan-900:  #004D40;
```

### 1.3 Secondary -- Neon Magenta / Hot Pink
Used for prices, sale badges, urgent CTAs, and secondary accent elements.
```css
--neon-magenta-50:   #FFF0F6;
--neon-magenta-100:  #FFD6E8;
--neon-magenta-200:  #FFADD2;
--neon-magenta-300:  #FF6EB4;
--neon-magenta-400:  #FF0080;  /* Primary hot pink */
--neon-magenta-500:  #EA00D9;  /* Neon magenta */
--neon-magenta-600:  #C51162;
--neon-magenta-700:  #AD1457;
--neon-magenta-800:  #880E4F;
--neon-magenta-900:  #5C0A33;
```

### 1.4 Tertiary -- Deep Purple
Used for gradients, secondary backgrounds, gaming-themed sections, and category badges.
```css
--neon-purple-50:   #F5F0FF;
--neon-purple-100:  #EDE0FF;
--neon-purple-200:  #D8B4FE;
--neon-purple-300:  #C084FC;
--neon-purple-400:  #A855F7;
--neon-purple-500:  #9333EA;  /* Main purple */
--neon-purple-600:  #7E22CE;
--neon-purple-700:  #6B21A8;  /* Deep purple */
--neon-purple-800:  #581C87;
--neon-purple-900:  #3B0764;
```

### 1.5 Accent -- Acid Green (for success / deals / "live" indicators)
```css
--neon-green-400:  #B0FF00;  /* Acid green */
--neon-green-500:  #76FF03;
--neon-green-600:  #64DD17;
```

### 1.6 Accent -- Neon Orange (for warnings, flash sales, urgency)
```css
--neon-orange-400: #FF5F1F;  /* Neon orange */
--neon-orange-500: #FF6D00;
--neon-orange-600: #E65100;
```

### 1.7 Semantic Colors
```css
--success:   #00E676;  /* Green with neon tint */
--warning:   #FFD600;  /* Bright yellow */
--error:     #FF1744;  /* Neon red */
--info:      #00B0FF;  /* Bright blue info */
```

### 1.8 Text Colors
```css
--text-primary:    #E8EAF6;  /* Near-white with blue tint */
--text-secondary:  #9FA8DA;  /* Muted lavender */
--text-tertiary:   #5C6BC0;  /* Dim purple-blue */
--text-disabled:   #3949AB;  /* Very muted */
--text-neon:       #00E5FF;  /* Neon-highlighted text */
--text-price:      #FF0080;  /* Price display */
--text-sale:       #B0FF00;  /* Sale/discount text */
```

### 1.9 Border Colors
```css
--border-base:     rgba(99, 102, 241, 0.15);   /* Subtle indigo */
--border-hover:    rgba(0, 229, 255, 0.3);      /* Cyan glow on hover */
--border-active:   rgba(0, 229, 255, 0.6);      /* Cyan solid on active */
--border-neon:     rgba(255, 0, 128, 0.4);       /* Magenta accent border */
```

### 1.10 Gradient Presets
```css
/* Primary brand gradient -- hero sections, featured cards */
--gradient-cyberpunk: linear-gradient(135deg, #0B0E18 0%, #1A1F36 25%, #2A0845 50%, #1A1F36 75%, #0B0E18 100%);

/* Neon sweep -- CTA buttons, highlighted elements */
--gradient-neon: linear-gradient(135deg, #00E5FF 0%, #EA00D9 50%, #FF0080 100%);

/* Deep space -- page background, large sections */
--gradient-void: radial-gradient(ellipse at 20% 50%, #1A0533 0%, #0B0E18 50%, #06080F 100%);

/* Card shimmer -- product card backgrounds */
--gradient-card: linear-gradient(145deg, #151A30 0%, #111629 50%, #0E1224 100%);

/* Price tag gradient */
--gradient-price: linear-gradient(90deg, #FF0080, #EA00D9);

/* Holographic accent -- premium items, featured badges */
--gradient-holo: linear-gradient(135deg, #00E5FF 0%, #A855F7 25%, #FF0080 50%, #B0FF00 75%, #00E5FF 100%);

/* Neumorphic surface gradient (subtle for raised elements) */
--gradient-neumorph-raised: linear-gradient(145deg, #1A1F36, #111629);
--gradient-neumorph-inset: linear-gradient(145deg, #0E1224, #1A1F36);
```

---

## 2. Typography

### 2.1 Font Stack
```css
/* Display / Headlines -- retro-futuristic geometric sans */
--font-display: 'Orbitron', 'Exo 2', 'Audiowide', sans-serif;

/* UI / Body text -- clean modern sans with good readability */
--font-body: 'Inter', 'Exo 2', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace / Prices / Codes -- retro terminal feel */
--font-mono: 'Space Mono', 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;

/* Accent / Badges / Tags -- condensed futuristic */
--font-accent: 'Electrolize', 'Russo One', 'Oxanium', sans-serif;
```

**Google Fonts import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&family=Exo+2:wght@300;400;500;600;700;800&family=Electrolize&display=swap" rel="stylesheet">
```

### 2.2 Type Scale
```css
--text-xs:    0.75rem;    /* 12px -- badges, timestamps, fine print */
--text-sm:    0.875rem;   /* 14px -- secondary text, descriptions */
--text-base:  1rem;       /* 16px -- body text, product details */
--text-lg:    1.125rem;   /* 18px -- card titles, emphasized text */
--text-xl:    1.25rem;    /* 20px -- section subtitles */
--text-2xl:   1.5rem;     /* 24px -- section headings */
--text-3xl:   1.875rem;   /* 30px -- page titles */
--text-4xl:   2.25rem;    /* 36px -- hero subtitle */
--text-5xl:   3rem;       /* 48px -- hero headline */
--text-6xl:   3.75rem;    /* 60px -- hero headline large */
--text-7xl:   4.5rem;     /* 72px -- splash/landing display */
```

### 2.3 Usage Guidelines
| Context | Font | Weight | Size | Letter Spacing |
|---------|------|--------|------|----------------|
| Hero headline | Orbitron | 700-900 | text-5xl to text-7xl | 0.05em |
| Section heading | Orbitron | 600-700 | text-2xl to text-3xl | 0.03em |
| Card title | Exo 2 | 600 | text-lg | 0.01em |
| Body text | Inter | 400 | text-base | normal |
| Prices | Space Mono | 700 | text-xl to text-2xl | 0.02em |
| Badges/Tags | Electrolize | 400 | text-xs to text-sm | 0.05em |
| Navigation | Inter | 500-600 | text-sm | 0.02em |
| Button text | Inter | 600 | text-sm | 0.04em |
| Code/Keys | Space Mono | 400 | text-sm | normal |

---

## 3. Neumorphic System (Dark Mode Adaptation)

### 3.1 Core Neumorphic Shadows
Neumorphism on dark backgrounds requires higher contrast shadows and subtle light sources. The base surface color is `#111629`.

```css
/* === RAISED (Convex) -- default card state === */
--neumorph-raised:
  6px 6px 16px rgba(0, 0, 0, 0.6),
  -6px -6px 16px rgba(45, 50, 80, 0.15);

/* === FLAT -- resting state, subtle depth === */
--neumorph-flat:
  4px 4px 12px rgba(0, 0, 0, 0.5),
  -4px -4px 12px rgba(45, 50, 80, 0.1);

/* === PRESSED (Concave/Inset) -- active/pressed buttons === */
--neumorph-pressed:
  inset 4px 4px 12px rgba(0, 0, 0, 0.6),
  inset -4px -4px 12px rgba(45, 50, 80, 0.1);

/* === DEEP INSET -- input fields, search bars === */
--neumorph-inset:
  inset 6px 6px 16px rgba(0, 0, 0, 0.7),
  inset -6px -6px 16px rgba(45, 50, 80, 0.12);

/* === HOVER -- raised with neon hint === */
--neumorph-hover:
  8px 8px 20px rgba(0, 0, 0, 0.6),
  -8px -8px 20px rgba(45, 50, 80, 0.18),
  0 0 20px rgba(0, 229, 255, 0.08);

/* === GLOW -- interactive elements with neon aura === */
--neumorph-glow-cyan:
  6px 6px 16px rgba(0, 0, 0, 0.6),
  -6px -6px 16px rgba(45, 50, 80, 0.15),
  0 0 30px rgba(0, 229, 255, 0.15),
  0 0 60px rgba(0, 229, 255, 0.05);

--neumorph-glow-magenta:
  6px 6px 16px rgba(0, 0, 0, 0.6),
  -6px -6px 16px rgba(45, 50, 80, 0.15),
  0 0 30px rgba(255, 0, 128, 0.15),
  0 0 60px rgba(255, 0, 128, 0.05);

--neumorph-glow-purple:
  6px 6px 16px rgba(0, 0, 0, 0.6),
  -6px -6px 16px rgba(45, 50, 80, 0.15),
  0 0 30px rgba(147, 51, 234, 0.15),
  0 0 60px rgba(147, 51, 234, 0.05);
```

### 3.2 Neumorphic Sizing Scale
Scale shadow values proportionally to element size:
```css
/* Small elements (badges, chips, toggles) */
--neumorph-sm: 3px 3px 8px rgba(0,0,0,0.5), -3px -3px 8px rgba(45,50,80,0.1);
--neumorph-sm-pressed: inset 3px 3px 8px rgba(0,0,0,0.5), inset -3px -3px 8px rgba(45,50,80,0.1);

/* Medium elements (buttons, inputs, small cards) */
--neumorph-md: 5px 5px 14px rgba(0,0,0,0.55), -5px -5px 14px rgba(45,50,80,0.12);
--neumorph-md-pressed: inset 5px 5px 14px rgba(0,0,0,0.55), inset -5px -5px 14px rgba(45,50,80,0.12);

/* Large elements (product cards, panels) */
--neumorph-lg: 8px 8px 24px rgba(0,0,0,0.6), -8px -8px 24px rgba(45,50,80,0.15);
--neumorph-lg-pressed: inset 8px 8px 24px rgba(0,0,0,0.6), inset -8px -8px 24px rgba(45,50,80,0.15);

/* XL elements (hero cards, featured sections) */
--neumorph-xl: 12px 12px 36px rgba(0,0,0,0.7), -12px -12px 36px rgba(45,50,80,0.18);
```

---

## 4. Button Styles

### 4.1 Primary CTA -- Neon Glow Button
```css
.btn-neon {
  background: var(--bg-raised);
  color: var(--neon-cyan-400);
  border: 1px solid rgba(0, 229, 255, 0.3);
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  box-shadow: var(--neumorph-md), 0 0 20px rgba(0, 229, 255, 0.1);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.btn-neon:hover {
  border-color: rgba(0, 229, 255, 0.6);
  box-shadow: var(--neumorph-hover),
    0 0 30px rgba(0, 229, 255, 0.2),
    0 0 60px rgba(0, 229, 255, 0.1);
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.5);
  transform: translateY(-2px);
}

.btn-neon:active {
  box-shadow: var(--neumorph-md-pressed),
    0 0 15px rgba(0, 229, 255, 0.15);
  transform: translateY(0);
}
```

### 4.2 Buy Now / Add to Cart -- Filled Neon
```css
.btn-buy {
  background: linear-gradient(135deg, #00BCD4, #00E5FF);
  color: #0B0E18;
  border: none;
  padding: 0.875rem 2.5rem;
  border-radius: 12px;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  box-shadow:
    0 4px 15px rgba(0, 229, 255, 0.3),
    0 0 30px rgba(0, 229, 255, 0.1);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-buy:hover {
  background: linear-gradient(135deg, #00E5FF, #33FFF5);
  box-shadow:
    0 6px 25px rgba(0, 229, 255, 0.4),
    0 0 50px rgba(0, 229, 255, 0.2);
  transform: translateY(-2px);
}

.btn-buy:active {
  transform: translateY(1px);
  box-shadow:
    0 2px 10px rgba(0, 229, 255, 0.25),
    inset 0 2px 4px rgba(0, 0, 0, 0.2);
}
```

### 4.3 Secondary / Ghost Button -- Neumorphic
```css
.btn-ghost-neumorph {
  background: var(--bg-raised);
  color: var(--text-secondary);
  border: 1px solid var(--border-base);
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  box-shadow: var(--neumorph-sm);
  transition: all 0.2s ease;
}

.btn-ghost-neumorph:hover {
  color: var(--text-primary);
  border-color: var(--border-hover);
  box-shadow: var(--neumorph-md);
}

.btn-ghost-neumorph:active {
  box-shadow: var(--neumorph-sm-pressed);
}
```

### 4.4 Danger / Hot Sale Button -- Magenta Pulse
```css
.btn-hot {
  background: linear-gradient(135deg, #C51162, #FF0080);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  box-shadow: 0 4px 15px rgba(255, 0, 128, 0.3);
  transition: all 0.25s ease;
  animation: hotPulse 2s ease-in-out infinite;
}

@keyframes hotPulse {
  0%, 100% { box-shadow: 0 4px 15px rgba(255, 0, 128, 0.3); }
  50% { box-shadow: 0 4px 25px rgba(255, 0, 128, 0.5), 0 0 40px rgba(255, 0, 128, 0.2); }
}
```

### 4.5 Toggle Button -- Neumorphic On/Off
```css
.toggle-neumorph {
  width: 56px;
  height: 28px;
  background: var(--bg-raised);
  border-radius: 14px;
  box-shadow: var(--neumorph-inset);
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
}

.toggle-neumorph::after {
  content: '';
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--bg-elevated);
  box-shadow: var(--neumorph-sm);
  position: absolute;
  top: 3px;
  left: 3px;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.toggle-neumorph.active {
  background: rgba(0, 229, 255, 0.15);
  box-shadow: var(--neumorph-inset), 0 0 20px rgba(0, 229, 255, 0.1);
}

.toggle-neumorph.active::after {
  transform: translateX(28px);
  background: var(--neon-cyan-400);
  box-shadow: 0 0 12px rgba(0, 229, 255, 0.5);
}
```

---

## 5. Card Designs

### 5.1 Product Card -- Neumorphic with Neon Hover
```css
.product-card {
  background: var(--gradient-card);
  border: 1px solid var(--border-base);
  border-radius: 16px;
  padding: 0;
  overflow: hidden;
  box-shadow: var(--neumorph-lg);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.product-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  padding: 1px;
  background: linear-gradient(135deg, transparent 40%, rgba(0, 229, 255, 0.3) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.35s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--neumorph-xl),
    0 0 40px rgba(0, 229, 255, 0.08);
  border-color: rgba(0, 229, 255, 0.2);
}

.product-card:hover::before {
  opacity: 1;
}

/* Card image area */
.product-card__image {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: var(--bg-base);
}

.product-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-card__image img {
  transform: scale(1.05);
}

/* Card body */
.product-card__body {
  padding: 1rem 1.25rem;
}

/* Card platform badge */
.product-card__platform {
  font-family: var(--font-accent);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--neon-cyan-400);
  background: rgba(0, 229, 255, 0.1);
  border: 1px solid rgba(0, 229, 255, 0.2);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  display: inline-block;
}

/* Card title */
.product-card__title {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-primary);
  margin: 0.5rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Card price section */
.product-card__price {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--text-price);
}

.product-card__price--original {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--text-tertiary);
  text-decoration: line-through;
}

.product-card__discount {
  font-family: var(--font-accent);
  font-size: 0.75rem;
  color: var(--neon-green-400);
  background: rgba(176, 255, 0, 0.1);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}
```

### 5.2 Featured / Hero Card -- Large Format with Glow
```css
.featured-card {
  background: var(--gradient-card);
  border: 1px solid rgba(147, 51, 234, 0.2);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--neumorph-xl),
    0 0 60px rgba(147, 51, 234, 0.08);
  position: relative;
}

.featured-card::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent 0deg, rgba(0, 229, 255, 0.05) 60deg, transparent 120deg);
  animation: featureRotate 8s linear infinite;
  pointer-events: none;
}

@keyframes featureRotate {
  to { transform: rotate(360deg); }
}
```

### 5.3 Category Card -- Compact Neumorphic
```css
.category-card {
  background: var(--bg-raised);
  border-radius: 14px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: var(--neumorph-md);
  border: 1px solid var(--border-base);
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  box-shadow: var(--neumorph-lg),
    0 0 25px rgba(0, 229, 255, 0.1);
  border-color: rgba(0, 229, 255, 0.2);
  transform: translateY(-3px);
}

.category-card:active {
  box-shadow: var(--neumorph-md-pressed);
  transform: translateY(0);
}

.category-card__icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
  filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.4));
}

.category-card__label {
  font-family: var(--font-accent);
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-secondary);
}
```

### 5.4 Deal/Sale Card -- Urgent Magenta Accent
```css
.deal-card {
  background: var(--gradient-card);
  border: 1px solid rgba(255, 0, 128, 0.25);
  border-radius: 16px;
  box-shadow: var(--neumorph-lg),
    0 0 30px rgba(255, 0, 128, 0.06);
  position: relative;
  overflow: hidden;
}

.deal-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-price);
  box-shadow: 0 0 15px rgba(255, 0, 128, 0.4);
}
```

---

## 6. Navigation Patterns

### 6.1 Top Navigation -- Glassmorphic + Neumorphic Hybrid
```css
.nav-top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 64px;
  background: rgba(11, 14, 24, 0.85);
  backdrop-filter: blur(20px) saturate(1.2);
  border-bottom: 1px solid var(--border-base);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  padding: 0 2rem;
}

.nav-top__logo {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: 0.08em;
  background: var(--gradient-neon);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-top__link {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.02em;
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-top__link:hover {
  color: var(--text-primary);
  background: rgba(0, 229, 255, 0.05);
}

.nav-top__link.active {
  color: var(--neon-cyan-400);
}

.nav-top__link.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--neon-cyan-400);
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
  border-radius: 1px;
}
```

### 6.2 Search Bar -- Neumorphic Inset
```css
.search-bar {
  background: var(--bg-base);
  border: 1px solid var(--border-base);
  border-radius: 12px;
  padding: 0.625rem 1rem 0.625rem 2.75rem;
  width: 100%;
  max-width: 480px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.875rem;
  box-shadow: var(--neumorph-inset);
  transition: all 0.3s ease;
}

.search-bar:focus {
  outline: none;
  border-color: rgba(0, 229, 255, 0.4);
  box-shadow: var(--neumorph-inset),
    0 0 20px rgba(0, 229, 255, 0.08);
}

.search-bar::placeholder {
  color: var(--text-tertiary);
}
```

### 6.3 Sidebar Filter -- Neumorphic Panel
```css
.sidebar-filter {
  background: var(--bg-raised);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: var(--neumorph-lg);
  border: 1px solid var(--border-base);
}

.sidebar-filter__section-title {
  font-family: var(--font-accent);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin-bottom: 1rem;
}

.sidebar-filter__option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  color: var(--text-secondary);
}

.sidebar-filter__option:hover {
  background: rgba(0, 229, 255, 0.05);
  color: var(--text-primary);
}

.sidebar-filter__option.selected {
  background: rgba(0, 229, 255, 0.1);
  color: var(--neon-cyan-400);
}

/* Neumorphic checkbox */
.neumorph-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: var(--bg-base);
  box-shadow: var(--neumorph-sm);
  border: 1px solid var(--border-base);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.neumorph-checkbox.checked {
  background: rgba(0, 229, 255, 0.15);
  border-color: rgba(0, 229, 255, 0.4);
  box-shadow: var(--neumorph-sm), 0 0 10px rgba(0, 229, 255, 0.15);
}
```

---

## 7. Hero Section Pattern

### 7.1 Main Hero -- Cyberpunk Atmospheric
```css
.hero {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: var(--gradient-void);
  padding: 6rem 2rem 4rem;
}

/* Animated grid background */
.hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: gridPan 20s linear infinite;
  mask-image: radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%);
}

@keyframes gridPan {
  0% { background-position: 0 0; }
  100% { background-position: 60px 60px; }
}

/* Floating neon orbs */
.hero__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: orbFloat 6s ease-in-out infinite;
}

.hero__orb--cyan {
  width: 400px;
  height: 400px;
  background: var(--neon-cyan-400);
  top: 10%;
  right: 15%;
  animation-delay: 0s;
}

.hero__orb--magenta {
  width: 300px;
  height: 300px;
  background: var(--neon-magenta-400);
  bottom: 15%;
  left: 10%;
  animation-delay: -3s;
}

.hero__orb--purple {
  width: 350px;
  height: 350px;
  background: var(--neon-purple-500);
  top: 40%;
  left: 40%;
  animation-delay: -1.5s;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.05); }
  66% { transform: translate(-20px, 15px) scale(0.95); }
}

/* Scanline overlay */
.hero__scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
  pointer-events: none;
  z-index: 2;
}

/* Hero text */
.hero__headline {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 1.1;
  letter-spacing: 0.03em;
  color: var(--text-primary);
  margin-bottom: 1rem;
  position: relative;
  z-index: 3;
}

.hero__headline span.neon {
  background: var(--gradient-neon);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(0, 229, 255, 0.3));
}

.hero__subtitle {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--text-secondary);
  max-width: 600px;
  line-height: 1.6;
  margin-bottom: 2rem;
  position: relative;
  z-index: 3;
}

/* Hero CTA group */
.hero__cta-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 3;
}
```

---

## 8. Animation & Effects Library

### 8.1 Neon Text Glow
```css
.neon-text {
  color: var(--neon-cyan-400);
  text-shadow:
    0 0 7px rgba(0, 229, 255, 0.6),
    0 0 10px rgba(0, 229, 255, 0.4),
    0 0 21px rgba(0, 229, 255, 0.3),
    0 0 42px rgba(0, 229, 255, 0.2),
    0 0 82px rgba(0, 229, 255, 0.1);
}

.neon-text-magenta {
  color: var(--neon-magenta-400);
  text-shadow:
    0 0 7px rgba(255, 0, 128, 0.6),
    0 0 10px rgba(255, 0, 128, 0.4),
    0 0 21px rgba(255, 0, 128, 0.3),
    0 0 42px rgba(255, 0, 128, 0.2);
}
```

### 8.2 Neon Flicker (Retro Neon Sign Effect)
```css
@keyframes neonFlicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    text-shadow:
      0 0 7px rgba(0, 229, 255, 0.6),
      0 0 10px rgba(0, 229, 255, 0.4),
      0 0 21px rgba(0, 229, 255, 0.3),
      0 0 42px rgba(0, 229, 255, 0.2);
    opacity: 1;
  }
  20%, 24%, 55% {
    text-shadow: none;
    opacity: 0.6;
  }
}

.neon-flicker {
  animation: neonFlicker 3s infinite alternate;
}
```

### 8.3 Neon Breathing / Pulse
```css
@keyframes neonBreathe {
  0%, 100% {
    box-shadow:
      0 0 10px rgba(0, 229, 255, 0.2),
      0 0 20px rgba(0, 229, 255, 0.1);
  }
  50% {
    box-shadow:
      0 0 20px rgba(0, 229, 255, 0.4),
      0 0 40px rgba(0, 229, 255, 0.2),
      0 0 60px rgba(0, 229, 255, 0.1);
  }
}

.neon-breathe {
  animation: neonBreathe 3s ease-in-out infinite;
}
```

### 8.4 Glitch Text Effect
```css
.glitch {
  position: relative;
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--text-primary);
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  color: var(--neon-cyan-400);
  z-index: -1;
  animation: glitchCyan 3s infinite linear alternate-reverse;
}

.glitch::after {
  color: var(--neon-magenta-400);
  z-index: -2;
  animation: glitchMagenta 2s infinite linear alternate-reverse;
}

@keyframes glitchCyan {
  0% { clip-path: inset(40% 0 61% 0); transform: translate(-2px, -1px); }
  20% { clip-path: inset(92% 0 1% 0); transform: translate(1px, 2px); }
  40% { clip-path: inset(43% 0 1% 0); transform: translate(-1px, 3px); }
  60% { clip-path: inset(25% 0 58% 0); transform: translate(3px, -1px); }
  80% { clip-path: inset(54% 0 7% 0); transform: translate(-3px, 2px); }
  100% { clip-path: inset(58% 0 43% 0); transform: translate(2px, -2px); }
}

@keyframes glitchMagenta {
  0% { clip-path: inset(65% 0 13% 0); transform: translate(2px, 1px); }
  20% { clip-path: inset(15% 0 62% 0); transform: translate(-1px, -2px); }
  40% { clip-path: inset(79% 0 3% 0); transform: translate(1px, -1px); }
  60% { clip-path: inset(30% 0 28% 0); transform: translate(-2px, 1px); }
  80% { clip-path: inset(8% 0 71% 0); transform: translate(1px, 2px); }
  100% { clip-path: inset(45% 0 16% 0); transform: translate(-1px, -1px); }
}
```

### 8.5 CRT Scanline Overlay
```css
.crt-overlay {
  position: relative;
}

.crt-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.05) 2px,
    rgba(0, 0, 0, 0.05) 4px
  );
  pointer-events: none;
  z-index: 10;
}

/* Optional: animated scanline sweep */
.crt-sweep::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(0, 229, 255, 0.06),
    transparent
  );
  animation: scanlineSweep 8s linear infinite;
  pointer-events: none;
  z-index: 11;
}

@keyframes scanlineSweep {
  0% { top: -4px; }
  100% { top: 100%; }
}
```

### 8.6 CRT Screen Flicker
```css
@keyframes crtFlicker {
  0% { opacity: 0.97; }
  5% { opacity: 0.95; }
  10% { opacity: 0.98; }
  15% { opacity: 0.96; }
  20% { opacity: 0.99; }
  50% { opacity: 0.97; }
  80% { opacity: 0.98; }
  90% { opacity: 0.96; }
  100% { opacity: 0.98; }
}

.crt-flicker {
  animation: crtFlicker 0.15s infinite;
}
```

### 8.7 Neon Border Animation (Traveling Glow)
```css
.neon-border-anim {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.neon-border-anim::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    var(--neon-cyan-400) 60deg,
    transparent 120deg,
    transparent 180deg,
    var(--neon-magenta-400) 240deg,
    transparent 300deg,
    transparent 360deg
  );
  animation: borderRotate 4s linear infinite;
  border-radius: inherit;
  z-index: -1;
}

.neon-border-anim::after {
  content: '';
  position: absolute;
  inset: 2px;
  background: var(--bg-raised);
  border-radius: 10px;
  z-index: -1;
}

@keyframes borderRotate {
  to { transform: rotate(360deg); }
}
```

### 8.8 Holographic Shimmer (for Premium Items)
```css
@keyframes holoShimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.holo-badge {
  background: linear-gradient(
    135deg,
    #00E5FF 0%,
    #A855F7 20%,
    #FF0080 40%,
    #B0FF00 60%,
    #00E5FF 80%,
    #EA00D9 100%
  );
  background-size: 300% 300%;
  animation: holoShimmer 4s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: var(--font-accent);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
```

### 8.9 Card Hover Shine Sweep
```css
.card-shine {
  position: relative;
  overflow: hidden;
}

.card-shine::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 229, 255, 0.04),
    rgba(0, 229, 255, 0.08),
    rgba(0, 229, 255, 0.04),
    transparent
  );
  transition: left 0.6s ease;
  pointer-events: none;
  z-index: 5;
}

.card-shine:hover::before {
  left: 120%;
}
```

### 8.10 Staggered Fade-In (for Card Grids)
```css
@keyframes staggerFadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stagger-item {
  opacity: 0;
  animation: staggerFadeUp 0.5s ease forwards;
}

.stagger-item:nth-child(1) { animation-delay: 0.05s; }
.stagger-item:nth-child(2) { animation-delay: 0.1s; }
.stagger-item:nth-child(3) { animation-delay: 0.15s; }
.stagger-item:nth-child(4) { animation-delay: 0.2s; }
.stagger-item:nth-child(5) { animation-delay: 0.25s; }
.stagger-item:nth-child(6) { animation-delay: 0.3s; }
.stagger-item:nth-child(7) { animation-delay: 0.35s; }
.stagger-item:nth-child(8) { animation-delay: 0.4s; }
```

---

## 9. Micro-Interaction Specifications

### 9.1 Button Press Feedback
```css
/* Neumorphic click feedback */
.btn-neumorph-click {
  transition: all 0.15s ease;
}

.btn-neumorph-click:active {
  box-shadow: var(--neumorph-md-pressed);
  transform: scale(0.97);
  transition-duration: 0.05s;
}
```

### 9.2 Cart Badge Bounce
```css
@keyframes cartBounce {
  0% { transform: scale(1); }
  30% { transform: scale(1.3); }
  50% { transform: scale(0.9); }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.cart-badge-update {
  animation: cartBounce 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
```

### 9.3 Add-to-Cart Success Flash
```css
@keyframes successFlash {
  0% { background-color: transparent; }
  30% { background-color: rgba(0, 230, 118, 0.15); }
  100% { background-color: transparent; }
}

.success-flash {
  animation: successFlash 0.6s ease;
}
```

### 9.4 Price Ticker / Count Down
```css
@keyframes priceTick {
  0% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(-100%); opacity: 0; }
  51% { transform: translateY(100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.price-tick {
  display: inline-block;
  overflow: hidden;
}

.price-tick .digit {
  animation: priceTick 0.3s ease-in-out;
}
```

### 9.5 Hover "Micro-Glow" (Subtle Neon Pull)
```css
.micro-glow {
  transition: all 0.25s ease;
}

.micro-glow:hover {
  box-shadow: 0 0 0 1px rgba(0, 229, 255, 0.15),
    0 0 15px rgba(0, 229, 255, 0.06);
}
```

### 9.6 Link Hover -- Neon Underline Draw
```css
.neon-link {
  position: relative;
  color: var(--text-secondary);
  transition: color 0.2s ease;
}

.neon-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--neon-cyan-400);
  box-shadow: 0 0 8px rgba(0, 229, 255, 0.4);
  transition: width 0.3s ease;
}

.neon-link:hover {
  color: var(--neon-cyan-400);
}

.neon-link:hover::after {
  width: 100%;
}
```

### 9.7 Skeleton Loader -- Dark Neon Shimmer
```css
@keyframes darkShimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton-dark {
  background: linear-gradient(
    90deg,
    var(--bg-raised) 0%,
    var(--bg-elevated) 20%,
    rgba(0, 229, 255, 0.03) 40%,
    var(--bg-elevated) 60%,
    var(--bg-raised) 100%
  );
  background-size: 2000px 100%;
  animation: darkShimmer 2s linear infinite;
  border-radius: 8px;
}
```

### 9.8 Tooltip Neon
```css
.tooltip-neon {
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(0, 229, 255, 0.06);
  animation: tooltipIn 0.15s ease-out;
}

@keyframes tooltipIn {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

---

## 10. Input & Form Elements

### 10.1 Neumorphic Input
```css
.input-neumorph {
  background: var(--bg-base);
  color: var(--text-primary);
  border: 1px solid var(--border-base);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  box-shadow: var(--neumorph-inset);
  transition: all 0.25s ease;
  width: 100%;
}

.input-neumorph:focus {
  outline: none;
  border-color: rgba(0, 229, 255, 0.4);
  box-shadow: var(--neumorph-inset),
    0 0 0 3px rgba(0, 229, 255, 0.08),
    0 0 20px rgba(0, 229, 255, 0.05);
}

.input-neumorph::placeholder {
  color: var(--text-tertiary);
}

.input-neumorph.error {
  border-color: rgba(255, 23, 68, 0.4);
  box-shadow: var(--neumorph-inset),
    0 0 0 3px rgba(255, 23, 68, 0.08);
}
```

### 10.2 Neumorphic Select / Dropdown
```css
.select-neumorph {
  appearance: none;
  background: var(--bg-raised);
  color: var(--text-primary);
  border: 1px solid var(--border-base);
  border-radius: 12px;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  box-shadow: var(--neumorph-md);
  cursor: pointer;
  transition: all 0.2s ease;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%239FA8DA' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
}

.select-neumorph:focus {
  outline: none;
  border-color: rgba(0, 229, 255, 0.4);
}
```

---

## 11. Utility Classes (Tailwind Extension Map)

These map the design system to Tailwind v4 custom utilities:

```css
/* === Tailwind @theme extension suggestions === */

/* Background utilities */
.bg-void      { background: #06080F; }
.bg-base      { background: #0B0E18; }
.bg-raised    { background: #111629; }
.bg-elevated  { background: #1A1F36; }
.bg-surface   { background: #222847; }

/* Text utilities */
.text-neon-cyan     { color: #00E5FF; }
.text-neon-magenta  { color: #FF0080; }
.text-neon-purple   { color: #9333EA; }
.text-neon-green    { color: #B0FF00; }
.text-neon-orange   { color: #FF5F1F; }

/* Border glow utilities */
.border-glow-cyan    { border-color: rgba(0, 229, 255, 0.3); }
.border-glow-magenta { border-color: rgba(255, 0, 128, 0.3); }

/* Shadow utilities */
.shadow-neumorph        { box-shadow: 6px 6px 16px rgba(0,0,0,0.6), -6px -6px 16px rgba(45,50,80,0.15); }
.shadow-neumorph-inset  { box-shadow: inset 6px 6px 16px rgba(0,0,0,0.7), inset -6px -6px 16px rgba(45,50,80,0.12); }
.shadow-neon-cyan       { box-shadow: 0 0 30px rgba(0,229,255,0.15), 0 0 60px rgba(0,229,255,0.05); }
.shadow-neon-magenta    { box-shadow: 0 0 30px rgba(255,0,128,0.15), 0 0 60px rgba(255,0,128,0.05); }
```

---

## 12. Spacing, Radius & Layout (Unchanged from Base System)

### Spacing Scale
```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
--spacing-24: 6rem;     /* 96px */
```

### Border Radius
```css
--radius-sm:   0.375rem;  /* 6px */
--radius-base: 0.5rem;    /* 8px */
--radius-md:   0.75rem;   /* 12px -- default for buttons & inputs */
--radius-lg:   1rem;      /* 16px -- cards */
--radius-xl:   1.25rem;   /* 20px -- featured cards */
--radius-2xl:  1.5rem;    /* 24px -- hero cards, modals */
--radius-3xl:  2rem;      /* 32px -- large panels */
--radius-full: 9999px;    /* pills, avatars */
```

### Container & Grid
```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Product grid */
.product-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

@media (min-width: 640px)  { .product-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 768px)  { .product-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1024px) { .product-grid { grid-template-columns: repeat(4, 1fr); } }
@media (min-width: 1280px) { .product-grid { grid-template-columns: repeat(5, 1fr); } }

/* Bento grid (for homepage featured sections) */
.bento-grid {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(180px, auto);
}

.bento-grid .featured-wide {
  grid-column: span 2;
  grid-row: span 2;
}

.bento-grid .featured-tall {
  grid-row: span 2;
}
```

### Breakpoints
```css
--screen-sm:  640px;
--screen-md:  768px;
--screen-lg:  1024px;
--screen-xl:  1280px;
--screen-2xl: 1536px;
```

---

## 13. Transition Timing
```css
--transition-instant: 50ms;
--transition-fast:    150ms;
--transition-base:    200ms;
--transition-slow:    300ms;
--transition-slower:  500ms;
--transition-display: 800ms;

--ease-out:     cubic-bezier(0, 0, 0.2, 1);
--ease-in:      cubic-bezier(0.4, 0, 1, 1);
--ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce:  cubic-bezier(0.68, -0.55, 0.27, 1.55);
--ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## 14. Accessibility Notes

- **Minimum contrast ratio**: 4.5:1 for body text, 3:1 for large text (WCAG AA).
- **Never rely solely on neon glow** for conveying state. Always pair with a border, icon, or text change.
- **Neumorphic elements** must include a visible border (at least `1px solid rgba(...)`) to meet contrast requirements on dark backgrounds.
- **Reduced motion**: Honor `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .neon-flicker,
  .crt-flicker,
  .crt-sweep::before,
  .hero__orb {
    animation: none !important;
  }
}
```
- **Focus indicators**: Use visible 2px cyan ring:
```css
:focus-visible {
  outline: 2px solid var(--neon-cyan-400);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(0, 229, 255, 0.15);
}
```

---

## 15. Design System Summary Table

| Element | Background | Border | Shadow | Radius | Font |
|---------|-----------|--------|--------|--------|------|
| Page body | `#06080F` | -- | -- | -- | Inter 400 |
| Nav bar | `rgba(11,14,24,0.85)` + blur | bottom `--border-base` | `0 4px 30px rgba(0,0,0,0.3)` | 0 | Inter 500 |
| Product card | `--gradient-card` | `--border-base` | `--neumorph-lg` | 16px | Exo 2 600 |
| Card (hover) | same | cyan 0.2 | `--neumorph-xl` + cyan glow | 16px | -- |
| Primary button | `--bg-raised` | cyan 0.3 | `--neumorph-md` + cyan glow | 12px | Inter 600 uppercase |
| Button (pressed) | same | same | `--neumorph-md-pressed` | 12px | -- |
| Buy button | cyan gradient | none | cyan outer glow | 12px | Inter 700 uppercase |
| Input field | `--bg-base` | `--border-base` | `--neumorph-inset` | 12px | Inter 400 |
| Search bar | `--bg-base` | `--border-base` | `--neumorph-inset` | 12px | Inter 400 |
| Hero section | `--gradient-void` | -- | -- | -- | Orbitron 800 |
| Price text | -- | -- | -- | -- | Space Mono 700 |
| Badge | `rgba(color, 0.1)` | `rgba(color, 0.2)` | none | 4px | Electrolize 400 |
| Modal | `--bg-elevated` | `--border-base` | `--neumorph-xl` | 20px | -- |

---

## 16. Competitive Reference Summary

### What Makes G2A, Eneba, and Kinguin Work

**G2A** (g2a.com):
- Dark-mode-first design with orange (`#F05F00`) as primary accent
- Dense product grid maximizes above-the-fold product count
- Aggressive sale badges and discount indicators
- Complex navigation for broad inventory (games, electronics, gift cards)
- Brand color: `#F05F00` (orange), `#737373` (gray), `#F2F8FE` (light blue)

**Eneba** (eneba.com):
- Cleanest UI among gaming marketplaces
- Excellent search with smart filters and regional price tracking
- Dark theme with strong visual hierarchy
- User-friendly localized interface (multi-currency, multi-language)
- Tight seller vetting builds trust
- Prioritizes simplicity over feature density

**Kinguin** (kinguin.com):
- Community-driven with visible seller ratings and reviews
- Price comparison tools surfaced prominently
- Transparent tiered seller system
- Straightforward checkout (no dark patterns)
- Strong trust signals in the UI

**Key Takeaways for Epinera:**
1. Dark mode is table stakes for gaming marketplaces
2. Dense product grids (4-5 columns on desktop) with clear pricing
3. Trust signals (seller ratings, verified badges) must be prominent
4. Regional price awareness and smart search/filters are expected
5. Sale urgency (countdown timers, flash deals) drives conversions
6. Clean, fast, uncluttered checkout wins over feature bloat
7. Platform badges (Steam, PlayStation, Xbox, Nintendo) need instant recognition

---

*This design system fuses the retro-futuristic aesthetic of 80s cyberpunk (neon glows, scanlines, glitch effects, geometric typography) with the tactile depth of dark-mode neumorphism (soft dual-shadows, raised/inset states) to create a distinctive, immersive gaming marketplace experience. Every value provided is implementation-ready for CSS or Tailwind CSS configuration.*
