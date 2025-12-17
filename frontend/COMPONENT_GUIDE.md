# WealthLog Component Usage Guide

Quick reference for using the enhanced UI components consistently across the platform.

---

## 🎨 UI Components

### Badge
**Purpose:** Category labels, status indicators, feature tags

```jsx
import Badge from "../Components/ui/Badge";
import { Activity } from "lucide-react";

<Badge icon={Activity} variant="green">
  Financial Intelligence Platform
</Badge>

<Badge icon={Shield} variant="cyan">
  Secure Access
</Badge>
```

**Variants:**
- `green` - Growth, success, active features
- `cyan` - Technology, analytics, primary info  
- `blue` - Secondary information

**Props:**
- `icon` - Lucide icon component
- `variant` - Color scheme
- `className` - Additional styles

---

### StatCard
**Purpose:** Display key metrics, KPIs, financial data

```jsx
import StatCard from "../Components/ui/StatCard";
import { TrendingUp } from "lucide-react";

<StatCard 
  value="99.9%" 
  label="Uptime SLA" 
  icon={TrendingUp}
  color="neon-green" 
/>
```

**Colors:**
- `neon-green` - Positive metrics, growth
- `neon-cyan` - Technical metrics, data
- `neon-blue` - Secondary metrics

**Props:**
- `value` - Metric value (string/number)
- `label` - Descriptive label
- `icon` - Optional icon
- `color` - Color scheme

---

### Card
**Purpose:** Container for content sections

```jsx
import Card from "../Components/ui/Card";

<Card className="p-8" hover={true}>
  {/* Content */}
</Card>
```

**Features:**
- Glassmorphism effect
- Neon border glow on hover
- Smooth transitions
- Backdrop blur

**Props:**
- `hover` - Enable hover effects (default: true)
- `className` - Additional styles

---

### Button
**Purpose:** Primary actions, CTAs, form submissions

```jsx
import Button from "../Components/ui/Button";

<Button variant="primary" className="w-full">
  <span className="font-mono uppercase tracking-wider">
    Access Platform
  </span>
</Button>
```

**Variants:**
- `primary` - Main actions (gradient background)
- `secondary` - Alternative actions (outlined)
- `ghost` - Tertiary actions (transparent)

**Best Practices:**
- Use monospace font for text
- Apply uppercase with tracking
- Add shimmer effect for premium feel:
  ```jsx
  <Button variant="primary" className="relative overflow-hidden group">
    <span className="relative z-10 font-mono uppercase tracking-wider">
      Text
    </span>
    <div className="absolute inset-0 bg-gradient-to-r from-neon-green via-neon-cyan to-neon-green opacity-0 group-hover:opacity-20 transition-opacity bg-[length:200%_100%]"></div>
  </Button>
  ```

---

### Input
**Purpose:** Form fields with enhanced focus states

```jsx
import Input from "../Components/ui/Input";
import { Mail } from "lucide-react";

<div className="relative">
  <Mail className="absolute left-3 top-[42px] w-5 h-5 text-gray-400" />
  <Input
    label="Email Address"
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    placeholder="Enter your email"
    error={errors.email}
    className="pl-12"
  />
</div>
```

**Features:**
- Monospace font
- Animated label color on focus
- Glow effect on focus
- Professional error states
- Icon support

**Props:**
- `label` - Field label (auto-uppercase)
- `type` - Input type
- `name` - Field name
- `value` - Current value
- `onChange` - Change handler
- `placeholder` - Placeholder text
- `error` - Error message
- `className` - Additional styles

---

## 🎨 Styling Patterns

### Glassmorphism
```jsx
<div className="glass backdrop-blur-xl border border-neon-cyan/30">
  {/* Content */}
</div>
```

### Neon Glow
```jsx
<div className="shadow-neon-cyan border border-neon-cyan/20">
  {/* Content */}
</div>
```

### Grid Pattern Background
```jsx
<div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
```

### Gradient Orbs
```jsx
<div className="absolute -top-40 -right-40 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl animate-pulse"></div>
```

### Shimmer Effect
```jsx
<div className="relative overflow-hidden group">
  <span className="relative z-10">Text</span>
  <div className="absolute inset-0 bg-gradient-to-r from-neon-green via-neon-cyan to-neon-green opacity-0 group-hover:opacity-20 transition-opacity bg-[length:200%_100%]"></div>
</div>
```

---

## 🎯 Typography Patterns

### Headings
```jsx
<h1 className="text-4xl font-bold font-secondary">
  Main Headline
  <span className="text-neon-green">Accent Text</span>
</h1>
```

### Body Text
```jsx
<p className="text-gray-400 leading-relaxed">
  Regular paragraph text
</p>
```

### Monospace Labels
```jsx
<span className="text-xs font-mono uppercase tracking-wider text-gray-400">
  Label Text
</span>
```

### Financial Data
```jsx
<div className="text-3xl font-bold font-mono text-neon-green">
  ETB 125,450
</div>
```

---

## 🎨 Color Usage

### Success / Growth
```jsx
className="text-neon-green border-neon-green/20 bg-neon-green/10"
```

### Technology / Data
```jsx
className="text-neon-cyan border-neon-cyan/20 bg-neon-cyan/10"
```

### Information
```jsx
className="text-neon-blue border-neon-blue/20 bg-neon-blue/10"
```

### Neutral
```jsx
className="text-gray-400 border-gray-700/50 bg-dark-secondary/50"
```

---

## ✨ Animation Patterns

### Fade Up on Mount
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* Content */}
</motion.div>
```

### Hover Lift
```jsx
<motion.div
  whileHover={{ y: -2 }}
  transition={{ duration: 0.2 }}
>
  {/* Content */}
</motion.div>
```

### Scale on Hover
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.98 }}
>
  {/* Content */}
</motion.button>
```

### Staggered Children
```jsx
{items.map((item, index) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    {/* Content */}
  </motion.div>
))}
```

---

## 📱 Responsive Patterns

### Mobile-First Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>
```

### Conditional Rendering
```jsx
<div className="hidden lg:block">
  {/* Desktop only */}
</div>

<div className="lg:hidden">
  {/* Mobile only */}
</div>
```

### Responsive Text
```jsx
<h1 className="text-3xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>
```

---

## 🔧 Form Patterns

### Form Container
```jsx
<form onSubmit={handleSubmit} className="space-y-6">
  {/* Fields */}
</form>
```

### Input with Icon
```jsx
<div className="relative">
  <Icon className="absolute left-3 top-[42px] w-5 h-5 text-gray-400" />
  <Input
    label="Label"
    name="field"
    value={value}
    onChange={handleChange}
    className="pl-12"
  />
</div>
```

### Password Toggle
```jsx
<div className="relative">
  <Lock className="absolute left-3 top-[42px] w-5 h-5 text-gray-400" />
  <Input
    type={showPassword ? "text" : "password"}
    name="password"
    className="pl-12 pr-12"
  />
  <motion.button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-[42px] text-gray-400 hover:text-neon-cyan transition-colors"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </motion.button>
</div>
```

### Loading Button
```jsx
<Button type="submit" disabled={isLoading}>
  {isLoading ? (
    <div className="flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-dark-primary border-t-transparent rounded-full animate-spin mr-2"></div>
      <span className="font-mono">Processing...</span>
    </div>
  ) : (
    <span className="font-mono uppercase tracking-wider">Submit</span>
  )}
</Button>
```

---

## 🎯 Best Practices

### Do's ✅
- Use monospace fonts for financial data
- Apply uppercase + tracking to labels
- Add shimmer effects to primary CTAs
- Use grid patterns for backgrounds
- Maintain consistent spacing (space-y-6, gap-6)
- Apply glassmorphism to elevated surfaces
- Use semantic color meanings

### Don'ts ❌
- Don't overuse neon colors
- Don't mix font families randomly
- Don't create heavy animations
- Don't use casual language
- Don't skip loading states
- Don't ignore error handling
- Don't break the grid system

---

## 📚 Icon Library

Using Lucide React icons consistently:

**Financial:**
- `TrendingUp` - Growth, gains
- `DollarSign` - Money, revenue
- `Wallet` - Assets, accounts
- `PieChart` - Allocation
- `BarChart3` - Analytics

**Actions:**
- `ArrowRight` - Forward, continue
- `ArrowLeft` - Back, return
- `CheckCircle` - Success, complete
- `Sparkles` - New, special

**UI:**
- `Eye` / `EyeOff` - Password toggle
- `Mail` - Email
- `Lock` - Password, security
- `User` - Profile
- `Chrome` - Google auth

**Status:**
- `Shield` - Security
- `Activity` - Real-time
- `Target` - Goals
- `Zap` - Fast, powerful

---

## 🚀 Quick Start Template

```jsx
import { motion } from "framer-motion";
import { Icon } from "lucide-react";
import Card from "../Components/ui/Card";
import Button from "../Components/ui/Button";
import Badge from "../Components/ui/Badge";

export default function MyPage() {
  return (
    <main className="min-h-screen py-20 px-6 bg-gradient-to-b from-dark-primary via-dark-secondary to-dark-primary relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge icon={Icon} variant="green">
            Category
          </Badge>
          
          <h1 className="text-5xl font-bold mb-6 mt-4">
            Page Title
            <span className="text-neon-green">Accent</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-8">
            Description text
          </p>

          <Card className="p-8">
            {/* Card content */}
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
```

---

This guide ensures consistent implementation of the futuristic fintech design system across all pages and features.
