# AgriConnect Design Brief

## Overview
Agricultural marketplace connecting farmers (sellers), businesses (buyers), and admins. Emphasis: trust, clarity, growth. Organic green palette with modern tech confidence, not rural cliché.

## Visual Direction
**Tone**: Organic growth + professional clarity | **Differentiation**: Living green with soft gradients, breathing card layouts, role-based accent colors | **Intensity**: Balanced — restrained decoration on cards, elevated surfaces for zones

## Color Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Primary (Emerald) | `0.55 0.18 142` | `0.68 0.16 142` | Farmer accent, CTAs, sidebar nav |
| Secondary (Teal) | `0.62 0.11 180` | `0.32 0.08 180` | Business accent, secondary actions |
| Accent (Rich Green) | `0.6 0.19 135` | `0.68 0.18 135` | Highlights, active states |
| Destructive | `0.58 0.25 20` | `0.65 0.24 25` | Delete, cancel, warnings |
| Success | chart-1 (`0.65 0.22 135`) | chart-1 (`0.72 0.21 135`) | Order approved, status positive |
| Neutrals | `0.99–0.88` (bg→border) | `0.14–0.28` (bg→border) | Clean whites, cool grays |

## Typography
- **Display**: General Sans (geometric, modern confidence for headings)
- **Body**: DM Sans (refined readability for content, lists, forms)
- **Mono**: JetBrains Mono (code, transaction IDs, prices)
- **Scale**: 12/14/16/18/20/24/32 — progressive hierarchy

## Structural Zones

| Zone | Treatment | Details |
|------|-----------|---------|
| Header | Elevated card, subtle border-b | Logo, role indicator, user profile. BG: card with soft shadow. |
| Sidebar | Distinct background, role-aware | Emerald for farmer, teal for business, slate for admin. Collapsible on mobile. |
| Main Content | Minimal, breathing | BG: background. Card grids with 12px gap. Each card: card BG, border-border/50, shadow-sm. |
| Footer | Muted, border-t | Minimal—copyright, links. BG: muted/30. |
| Popover/Modal | Elevated with ring focus | Backdrop blur, card surface, subtle shadow. |

## Spacing & Rhythm
- Base unit: 4px | Density: md (12/16/24/32px margins/padding) | Cards: 16px inner, 12px gap | Typography: 1.5–1.6 line height

## Component Patterns
- **Cards**: `card-elevated` utility (shadow-sm + border) with gradient on hover (gradient-primary)
- **Buttons**: Full-width on mobile (sm:w-auto), `transition-smooth` on hover
- **Inputs**: border-input, focus:ring-2 ring-primary/50, rounded-md
- **Badges**: text-xs, badge color per status (success/warning/destructive)
- **Chat bubbles**: Farmer-originated bg-primary/20, business-originated bg-secondary/20. Border-radius: full (32px).

## Motion & Animation
- **Entrance**: fade-in (0.4s), slide-in (0.3s), scale-in (0.3s). Stagger on list items.
- **Interactive**: transition-smooth (0.3s ease-out) on all hover/active
- **Sidebar collapse**: smooth height transition
- **Framer Motion hooks**: useInView for stagger, useSpring for spring physics on modals

## Constraints & Guardrails
- No full-page gradients; gradients only on hero or accent zones
- No neon/glow shadows; stick to soft shadow-sm/shadow-md
- Minimize skew/transform; prefer translate/scale for perf
- Dark mode: intentional—not just inverted. Greens shift to vibrant (saturation ↑), blues cool, neutrals stay cool.

## Signature Detail
Role-based sidebar colors (farmer=emerald, business=teal, admin=slate) create instant visual identity without needing text. Card borders use `border-border/50` (subtle contrast) to breathe without flatness.

## Responsive Breakpoints
- Mobile (sm): Sidebar hidden by default, hamburger nav, full-width cards, stacked layout
- Tablet (md): 2-col card grids, sidebar collapsible
- Desktop (lg): 3–4-col grids, sidebar always visible

## Key Files
- `src/frontend/src/index.css` — OKLCH tokens, @font-face, utilities
- `src/frontend/tailwind.config.js` — custom animations (fade-in, slide-in, scale-in)
- Fonts: `/public/assets/fonts/` (GeneralSans, DMSans, JetBrainsMono)
