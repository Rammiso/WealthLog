# WealthLog Visual Consistency Checklist

Use this checklist to ensure all pages maintain the premium fintech aesthetic.

---

## ✅ Page Structure

### Background
- [ ] Gradient background (from-dark-primary via-dark-secondary to-dark-primary)
- [ ] Grid pattern overlay (linear-gradient with 50px spacing)
- [ ] 2-3 animated gradient orbs (cyan, green, blue)
- [ ] Proper z-index layering (background → content)
- [ ] Pointer-events-none on background elements

### Layout
- [ ] Max-width container (max-w-7xl or appropriate)
- [ ] Consistent padding (px-6, py-20)
- [ ] Relative positioning for z-index control
- [ ] Responsive breakpoints (mobile, tablet, desktop)

---

## ✅ Typography

### Headings
- [ ] Font: font-secondary (Poppins)
- [ ] Sizes: text-4xl to text-6xl
- [ ] Weight: font-bold
- [ ] Accent color: text-neon-green or text-neon-cyan
- [ ] Line height: leading-tight

### Body Text
- [ ] Color: text-gray-400
- [ ] Line height: leading-relaxed
- [ ] Font size: text-base to text-xl
- [ ] Max width for readability

### Labels & Metadata
- [ ] Font: font-mono
- [ ] Transform: uppercase
- [ ] Tracking: tracking-wider or tracking-widest
- [ ] Size: text-xs or text-sm
- [ ] Color: text-gray-400 or text-gray-500

### Financial Data
- [ ] Font: font-mono
- [ ] Weight: font-bold
- [ ] Color: text-neon-green, text-neon-cyan, or text-neon-blue
- [ ] Size: text-2xl to text-5xl

---

## ✅ Components

### Cards
- [ ] Class: glass
- [ ] Backdrop blur: backdrop-blur-xl
- [ ] Border: border-neon-cyan/30 or border-neon-green/20
- [ ] Padding: p-6 to p-12
- [ ] Rounded: rounded-xl or rounded-2xl
- [ ] Hover effects (if interactive)

### Buttons
- [ ] Primary: bg-neon-gradient
- [ ] Secondary: border-2 border-neon-cyan
- [ ] Font: font-mono
- [ ] Transform: uppercase
- [ ] Tracking: tracking-wider
- [ ] Padding: px-6 py-2 (or larger)
- [ ] Rounded: rounded-lg
- [ ] Shadow: shadow-neon-cyan
- [ ] Hover: scale-105 or shimmer effect

### Inputs
- [ ] Background: bg-dark-secondary/50
- [ ] Border: border-gray-700/50
- [ ] Font: font-mono
- [ ] Focus: border-neon-cyan with glow
- [ ] Label: uppercase, tracking-wider
- [ ] Error: text-red-400 with bullet point

### Badges
- [ ] Background: bg-neon-{color}/10
- [ ] Border: border-neon-{color}/20
- [ ] Font: font-mono
- [ ] Transform: uppercase
- [ ] Tracking: tracking-wider
- [ ] Icon included
- [ ] Rounded: rounded-full
- [ ] Padding: px-4 py-2

---

## ✅ Colors

### Primary Palette
- [ ] Neon Green (#39ff14) - Success, growth, positive
- [ ] Neon Cyan (#00ffff) - Technology, focus, primary
- [ ] Neon Blue (#00d4ff) - Information, secondary

### Backgrounds
- [ ] Dark Primary (#0a0a0a) - Base
- [ ] Dark Secondary (#1a1a1a) - Elevated
- [ ] Dark Tertiary (#0f0f0f) - Cards

### Text
- [ ] White (#ffffff) - Headings
- [ ] Gray 100 - Primary text
- [ ] Gray 300 - Secondary text
- [ ] Gray 400 - Tertiary text
- [ ] Gray 500 - Metadata

### Opacity Levels
- [ ] /5 - Background orbs
- [ ] /10 - Badge backgrounds
- [ ] /20 - Borders, subtle effects
- [ ] /30 - Prominent borders
- [ ] /50 - Dividers, inactive states

---

## ✅ Effects

### Glassmorphism
- [ ] backdrop-filter: blur(16px)
- [ ] background: rgba(0, 0, 0, 0.3)
- [ ] border: 1px solid rgba(255, 255, 255, 0.1)

### Neon Glow
- [ ] box-shadow with color and opacity
- [ ] Multiple shadow layers for depth
- [ ] Hover intensification

### Grid Pattern
- [ ] Linear gradient with 1px lines
- [ ] 50px x 50px spacing
- [ ] 2-3% opacity
- [ ] Covers full container

### Gradient Orbs
- [ ] Large size (w-96 h-96)
- [ ] Positioned off-screen (-top-40, -right-40)
- [ ] blur-3xl
- [ ] animate-pulse
- [ ] Staggered delays

### Shimmer
- [ ] Gradient background (green → cyan → green)
- [ ] bg-[length:200%_100%]
- [ ] Opacity 0 → 20% on hover
- [ ] Absolute positioning
- [ ] z-index below text

---

## ✅ Animations

### Page Load
- [ ] Fade up: opacity 0 → 1, y: 20 → 0
- [ ] Duration: 0.5-0.8s
- [ ] Staggered delays (0.1s increments)

### Hover States
- [ ] Scale: 1.02-1.05
- [ ] Duration: 200-300ms
- [ ] Smooth easing
- [ ] Color transitions

### Focus States
- [ ] Border color change
- [ ] Glow effect
- [ ] Background lightening
- [ ] Label color change

### Loading States
- [ ] Spinner animation
- [ ] Text change
- [ ] Disabled state
- [ ] Opacity reduction

---

## ✅ Spacing

### Vertical Rhythm
- [ ] Section padding: py-20
- [ ] Card padding: p-6 to p-12
- [ ] Form spacing: space-y-6
- [ ] Grid gaps: gap-6 to gap-12

### Horizontal Spacing
- [ ] Container padding: px-6
- [ ] Button padding: px-6 to px-10
- [ ] Input padding: px-4
- [ ] Badge padding: px-4

### Margins
- [ ] Heading bottom: mb-4 to mb-8
- [ ] Paragraph bottom: mb-6 to mb-8
- [ ] Section separation: mb-12 to mb-20

---

## ✅ Icons

### Style
- [ ] Lucide React library
- [ ] Consistent stroke width
- [ ] Size: w-4 h-4 to w-6 h-6
- [ ] Color matches context

### Usage
- [ ] Financial icons for money concepts
- [ ] Action icons for buttons
- [ ] Status icons for states
- [ ] UI icons for inputs

### Positioning
- [ ] Absolute for input icons
- [ ] Inline for badges
- [ ] Flex for buttons
- [ ] Centered for cards

---

## ✅ Responsive Design

### Mobile (< 768px)
- [ ] Single column layouts
- [ ] Stacked navigation
- [ ] Full-width buttons
- [ ] Readable font sizes (min 14px)
- [ ] Touch-friendly targets (min 44px)

### Tablet (768px - 1024px)
- [ ] 2-column grids
- [ ] Adjusted spacing
- [ ] Responsive typography
- [ ] Optimized images

### Desktop (> 1024px)
- [ ] 3-4 column grids
- [ ] Full feature visibility
- [ ] Hover effects active
- [ ] Optimal line lengths

---

## ✅ Accessibility

### Contrast
- [ ] Text: 4.5:1 minimum
- [ ] Large text: 3:1 minimum
- [ ] Neon on dark: high contrast
- [ ] Error states: clear visibility

### Focus
- [ ] Visible focus indicators
- [ ] Keyboard navigation support
- [ ] Logical tab order
- [ ] Skip links where needed

### Semantics
- [ ] Proper heading hierarchy
- [ ] ARIA labels on icons
- [ ] Alt text on images
- [ ] Form labels associated

---

## ✅ Performance

### Optimization
- [ ] CSS transitions over JS
- [ ] Efficient selectors
- [ ] Minimal re-renders
- [ ] Lazy loading images

### Loading
- [ ] Loading states shown
- [ ] Skeleton screens (optional)
- [ ] Progressive enhancement
- [ ] Error boundaries

---

## ✅ Business Language

### Terminology
- [ ] "Platform" not "app"
- [ ] "Access" not "login"
- [ ] "Capital" not "money"
- [ ] "Assets" not "funds"
- [ ] "Analytics" not "reports"
- [ ] "Portfolio" not "accounts"
- [ ] "Intelligence" not "insights"

### Tone
- [ ] Professional
- [ ] Confident
- [ ] Data-driven
- [ ] Technical but clear
- [ ] Business-appropriate

---

## ✅ Code Quality

### Structure
- [ ] Component-based
- [ ] Reusable patterns
- [ ] Props validation
- [ ] Clean imports

### Naming
- [ ] Descriptive variables
- [ ] Consistent conventions
- [ ] Clear function names
- [ ] Semantic classes

### Comments
- [ ] Complex logic explained
- [ ] Section markers
- [ ] TODO items tracked
- [ ] Props documented

---

## 🎯 Quick Visual Audit

Walk through each page and verify:

1. **First Impression** (3 seconds)
   - [ ] Looks premium and professional
   - [ ] Cyber-fintech aesthetic clear
   - [ ] Brand colors visible
   - [ ] Layout feels intentional

2. **Typography** (10 seconds)
   - [ ] Hierarchy is clear
   - [ ] Monospace used appropriately
   - [ ] Uppercase labels consistent
   - [ ] Readable at all sizes

3. **Colors** (10 seconds)
   - [ ] Neon accents strategic
   - [ ] Not overwhelming
   - [ ] Consistent usage
   - [ ] Proper contrast

4. **Motion** (20 seconds)
   - [ ] Smooth animations
   - [ ] No jank or lag
   - [ ] Purposeful movement
   - [ ] Consistent timing

5. **Consistency** (30 seconds)
   - [ ] Matches other pages
   - [ ] Same component styles
   - [ ] Unified spacing
   - [ ] Cohesive feel

---

## 📋 Page-Specific Checks

### Homepage
- [ ] Hero section impactful
- [ ] Dashboard preview animated
- [ ] Stats section professional
- [ ] Features/FAQs integrated

### Features Page
- [ ] Grid layout clean
- [ ] Cards hover nicely
- [ ] Icons meaningful
- [ ] Copy business-focused

### FAQs Page
- [ ] Accordion smooth
- [ ] Icons present
- [ ] Answers professional
- [ ] Background consistent

### Login Page
- [ ] Image panel premium
- [ ] Form card elevated
- [ ] Inputs glow on focus
- [ ] CTAs prominent

### Register Page
- [ ] Progress clear
- [ ] Multi-step smooth
- [ ] Success state celebratory
- [ ] Copy professional

### Navbar
- [ ] Glassmorphism on scroll
- [ ] Links animated
- [ ] Logo refined
- [ ] Mobile menu smooth

---

Use this checklist during development and before deployment to ensure visual consistency and premium quality across the entire platform.
