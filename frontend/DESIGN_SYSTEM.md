# WealthLog Design System

## Overview
A futuristic fintech design system inspired by business, economics, and financial markets. Built with a cyber-neon aesthetic that communicates professionalism, precision, and data-driven intelligence.

---

## Color System

### Primary Brand Colors
- **Neon Green** (`#39ff14`) - Growth, profit, success, positive momentum
- **Neon Cyan** (`#00ffff`) - Data, analytics, technology, primary actions
- **Neon Blue** (`#00d4ff`) - Information, insights, secondary actions

### Dark Theme Foundation
- **Dark Primary** (`#0a0a0a`) - Main background
- **Dark Secondary** (`#1a1a1a`) - Elevated surfaces
- **Dark Tertiary** (`#0f0f0f`) - Card backgrounds

### Semantic Colors
- **Success** → Neon Green (gains, confirmations, completed actions)
- **Info** → Neon Cyan (analytics, tips, insights)
- **Warning** → Yellow/Amber (risks, limits, attention areas)
- **Error** → Red (losses, failures, destructive actions)

### Usage Guidelines
- Use Neon Green for financial growth, positive metrics, and success states
- Use Neon Cyan for data visualization, primary CTAs, and technology features
- Use Neon Blue for secondary information and supporting elements
- Maintain high contrast ratios for accessibility (WCAG AA minimum)
- Apply colors intentionally - avoid overwhelming users with too many neon elements

---

## Typography

### Font Families
- **Primary**: Inter - Used for body text, UI elements, and general content
- **Secondary**: Poppins - Used for headings and emphasis
- **Monospace**: JetBrains Mono / System Mono - Used for numbers, financial data, stats, labels

### Typography Hierarchy
```
H1: 4xl-7xl (48-72px) - Hero headlines
H2: 3xl-5xl (36-48px) - Section headers
H3: xl-2xl (20-24px) - Card titles, subsections
Body: base-lg (16-18px) - Paragraph text
Small: sm-xs (12-14px) - Labels, captions, metadata
```

### Usage Guidelines
- Use monospace fonts for all financial data (amounts, percentages, IDs)
- Apply uppercase + tracking for labels and badges
- Maintain clear hierarchy with size and weight
- Use font-mono class for technical/financial content

---

## Components

### Badge
**Purpose**: Category labels, status indicators, feature tags

**Variants**:
- `green` - Growth, success, active features
- `cyan` - Technology, analytics, primary info
- `blue` - Secondary information

**Usage**:
```jsx
<Badge icon={Activity} variant="green">
  Financial Intelligence Platform
</Badge>
```

### StatCard
**Purpose**: Display key metrics, KPIs, financial data

**Props**:
- `value` - The metric value (use monospace)
- `label` - Descriptive label (uppercase)
- `icon` - Optional icon component
- `color` - neon-green | neon-cyan | neon-blue

**Usage**:
```jsx
<StatCard 
  value="99.9%" 
  label="Uptime SLA" 
  icon={Activity}
  color="neon-green" 
/>
```

### Card
**Purpose**: Container for content sections, features, information blocks

**Features**:
- Glassmorphism effect (backdrop-blur)
- Neon border glow on hover
- Smooth transitions
- Elevation through borders and shadows

### Button
**Variants**:
- `primary` - Main actions (neon gradient background)
- `secondary` - Alternative actions (outlined with neon border)
- `ghost` - Tertiary actions (transparent)

---

## Iconography

### Icon Style
- Line-based, minimal stroke icons (Lucide React)
- Consistent 4-6px stroke width
- 16-24px standard sizes

### Business & Economics Icons
Use icons that communicate financial concepts:
- `TrendingUp` - Growth, performance, gains
- `BarChart3` - Analytics, data, insights
- `Target` - Goals, objectives, planning
- `Shield` - Security, protection, trust
- `Wallet` - Assets, accounts, money
- `Activity` - Real-time, monitoring, live data
- `DollarSign` - Revenue, capital, financial
- `PieChart` - Allocation, distribution, portfolio

---

## Terminology

### Business Language
Replace casual terms with professional financial language:

❌ Avoid:
- "Track your money"
- "Save more"
- "Budget better"

✅ Use:
- "Optimize cash flow"
- "Accelerate capital growth"
- "Manage asset allocation"
- "Monitor financial performance"
- "Control liabilities"
- "Maximize returns"

### Key Terms
- **Assets** - Not "money" or "funds"
- **Liabilities** - Not "expenses" or "bills"
- **Cash Flow** - Not "income and expenses"
- **Capital** - Not "savings"
- **Performance** - Not "progress"
- **Analytics** - Not "reports"
- **Portfolio** - Not "accounts"
- **ROI** - Return on Investment
- **Allocation** - Distribution of assets

---

## Visual Effects

### Glassmorphism
```css
.glass {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Neon Glow
```css
.shadow-neon-cyan {
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5), 
              0 0 20px rgba(0, 255, 255, 0.3);
}
```

### Grid Pattern Background
```css
background: linear-gradient(
  rgba(0,255,255,0.03) 1px, 
  transparent 1px
),
linear-gradient(
  90deg, 
  rgba(0,255,255,0.03) 1px, 
  transparent 1px
);
background-size: 50px 50px;
```

### Hover States
- Subtle scale (1.01-1.02)
- Border color intensification
- Shadow enhancement
- Smooth transitions (300ms)

---

## Animation Guidelines

### Motion Principles
- **Purposeful** - Animations should guide attention
- **Subtle** - Avoid distracting movements
- **Smooth** - Use easing functions (ease-in-out)
- **Fast** - Keep durations under 500ms

### Common Animations
- **Fade Up**: Initial page load (opacity + translateY)
- **Float**: Floating elements (subtle Y-axis movement)
- **Pulse**: Background glows (opacity oscillation)
- **Scale**: Hover interactions (1.02x scale)
- **Rotate**: Accordion chevrons (180deg)

---

## Layout Patterns

### Hero Section
- Large headline with neon accent color
- Descriptive subheading (gray-400)
- Primary + Secondary CTAs
- Trust indicators (badges, stats)
- Visual preview (dashboard mockup)

### Feature Grid
- 3-column grid on desktop
- Card-based layout
- Icon + Title + Description + Metric
- Hover effects for interactivity

### Stats Section
- 4-column grid
- Large monospace numbers
- Icon + Value + Label structure
- Uppercase labels with tracking

### FAQ Accordion
- Expandable cards
- Smooth height transitions
- Icon indicators
- Professional Q&A format

---

## Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile Considerations
- Stack columns vertically
- Maintain readable font sizes (16px minimum)
- Touch-friendly targets (44px minimum)
- Simplified navigation (hamburger menu)

---

## Accessibility

### Contrast
- Maintain WCAG AA standards (4.5:1 for text)
- Neon colors on dark backgrounds provide high contrast
- Use gray-400 for secondary text (sufficient contrast)

### Focus States
- Visible focus indicators
- Keyboard navigation support
- Logical tab order

### Screen Readers
- Semantic HTML structure
- ARIA labels where needed
- Alt text for images

---

## Best Practices

### Do's ✅
- Use monospace fonts for all financial data
- Apply business terminology consistently
- Maintain visual hierarchy with size and color
- Use glassmorphism for elevated surfaces
- Add subtle animations for polish
- Keep neon effects controlled and intentional

### Don'ts ❌
- Don't overuse neon colors (causes visual fatigue)
- Don't use casual or playful language
- Don't create heavy, distracting animations
- Don't sacrifice readability for aesthetics
- Don't mix too many color variants in one view

---

## Future Considerations

### Light Mode (Future)
- Maintain structural consistency
- Adapt color intensities
- Preserve brand identity
- Ensure accessibility standards

### Backend Integration
- Components are stateless where possible
- Easy to connect to APIs
- Separated presentation from logic
- Ready for real data

---

## Resources

### Design Inspiration
- Fintech dashboards (Stripe, Plaid, Robinhood)
- Market analytics platforms (Bloomberg Terminal)
- Business intelligence tools (Tableau, Power BI)
- Cyberpunk aesthetics (controlled application)

### Tools
- Tailwind CSS - Utility-first styling
- Framer Motion - Animation library
- Lucide React - Icon library
- React Router - Navigation
