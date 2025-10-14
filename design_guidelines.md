# Design Guidelines: Feel and Grow Rich - Wealth, Worthiness & Personal Development Platform

## Design Approach

**Selected Framework:** Design System Approach with Abundance & Growth Principles

This wealth and personal development application requires stability, trust, and inspiration. Drawing from premium personal development platforms and financial wellness apps, we prioritize:
- Cognitive ease through consistent patterns
- Emotional empowerment through rich, inspiring visuals
- Progress visualization for wealth and worthiness growth
- Clear information hierarchy for transformative assessments

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 210 65% 45% (Rich blue - trust, abundance, stability)
- Primary Hover: 210 70% 38%
- Background: 210 20% 98% (Soft near-white)
- Surface: 0 0% 100% (Pure white cards)
- Text Primary: 210 15% 20% (Soft black)
- Text Secondary: 210 10% 45%
- Success: 150 50% 45% (Growth, prosperity, achievement)
- Warning: 35 80% 55% (Gentle alerts)
- Accent: 280 40% 65% (Purple for wealth and transformation)

**Dark Mode:**
- Primary: 210 60% 55%
- Primary Hover: 210 65% 48%
- Background: 210 15% 12% (Deep calm blue-gray)
- Surface: 210 12% 16% (Elevated cards)
- Text Primary: 210 15% 95%
- Text Secondary: 210 10% 70%
- All form inputs and text fields maintain dark mode consistency

### B. Typography

**Font Stack:**
- Primary: 'Inter' (Google Fonts) - body text, forms, UI elements
- Headings: 'Lexend' (Google Fonts) - optimized for readability, reduces stress

**Scale:**
- H1: text-4xl md:text-5xl font-semibold (page titles)
- H2: text-3xl md:text-4xl font-semibold (section headers)
- H3: text-2xl font-semibold (card titles, step headers)
- H4: text-xl font-medium (subsections)
- Body: text-base leading-relaxed (all content)
- Small: text-sm (helper text, timestamps)

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 4, 6, 8, 12, 16 for consistency
- Component padding: p-6 md:p-8
- Section spacing: space-y-8 md:space-y-12
- Card margins: mb-6 md:mb-8
- Form field gaps: gap-6

**Container System:**
- Max width: max-w-4xl mx-auto for forms/wizards
- Max width: max-w-6xl mx-auto for dashboards
- Full width: w-full for progress indicators and timers

### D. Component Library

**Navigation:**
- Top nav with logo, progress indicator (for wizards), user menu
- Sticky positioning with subtle shadow on scroll
- Mobile: Hamburger menu with slide-in drawer

**Wizard/Multi-Step Forms:**
- Step indicator with circles and connecting lines at top
- Current step highlighted in primary color
- Completed steps with checkmarks
- Card-based content area with soft shadows
- "Back" and "Next/Continue" buttons (Next always primary)
- Save progress indicator in top-right

**Assessment Cards:**
- White/surface background with rounded-xl borders
- Icon at top (use Heroicons via CDN)
- Title, description, estimated time
- Subtle hover lift effect (shadow increase)
- "Start Assessment" button centered

**Feelings Dial:**
- Circular visualization with 6 emotion segments
- Each emotion has distinct hue: Anger (0°), Joy (60°), Fear (180°), Sadness (240°), Guilt (30°), Shame (300°)
- Active selection grows slightly with glow effect
- 90-second timer displayed centrally with ring progress indicator

**Data Visualization:**
- Belief map: Node-link diagram with curved paths
- Triangle shift: Animated triangle with role labels
- Progress charts: Soft bar charts with rounded ends
- Use primary/accent colors for positive metrics

**Forms:**
- All inputs: Consistent dark mode with surface background
- Labels above inputs, text-sm font-medium
- Textarea for long responses with min-height
- Radio/checkbox with custom styling matching theme
- Validation messages in warning color below fields

**Buttons:**
- Primary: bg-primary text-white with hover states
- Secondary: border-2 border-primary text-primary
- Outline on images: backdrop-blur-md bg-white/10 border-white/30 text-white (no additional hover effects)
- Icon buttons: rounded-full p-2 with hover bg
- Sizes: Small (px-4 py-2), Default (px-6 py-3), Large (px-8 py-4)

**Export Panel:**
- Two-column grid on desktop (JSON, Excel options)
- Each with icon, format description, file size estimate
- Download buttons with icons from Heroicons
- Recent exports list with timestamps

**Daily Worksheet:**
- Timer at top (10:00 countdown)
- Sectioned layout with numbered prompts
- Auto-save indicator (subtle, top-right)
- Completion celebration modal on finish

### E. Animations

Use sparingly for purposeful feedback:
- Page transitions: Fade-in only (duration-200)
- Wizard steps: Slide transitions between steps (duration-300)
- Button clicks: Subtle scale-95 on active
- Timer: Smooth progress ring animation
- Success states: Check icon with scale bounce (duration-500)

### Images

**Hero Section (Homepage/Dashboard):**
- Large hero with calming nature imagery (soft-focus forest, serene water, mountain vista)
- Gradient overlay: from-background/80 to-background/40
- Height: min-h-[60vh] on desktop, min-h-[40vh] on mobile
- Centered heading with subtitle
- Primary CTA with outline variant on blur background

**Assessment Cards:**
- Small illustrative icons (120x120px) above each assessment title
- Soft, abstract illustrations representing each tool's purpose
- Use rounded corners (rounded-2xl) to match card style

**Empty States:**
- Friendly illustrations for "No data yet" states
- Encouraging text to begin first assessment
- Dimensions: max 300px width, centered

**Background Patterns:**
- Subtle dot grid pattern on main background (opacity-5)
- Organic flowing shapes behind hero (blur-3xl, opacity-10)

## Accessibility & Quality Standards

- WCAG AA contrast ratios minimum
- Focus rings: ring-2 ring-primary ring-offset-2
- Keyboard navigation fully supported
- Screen reader labels on all interactive elements
- Dark mode consistency across all inputs and surfaces
- Loading states with skeleton screens (pulse animation)
- Error boundaries with helpful recovery messages

## Page-Specific Guidelines

**Intake Wizard:** Clean vertical progression, one question visible at time, progress bar always visible, calming transition between steps

**Belief Mapper:** Canvas-style interface with draggable nodes, connecting lines with labels, zoom controls, "Add Event/Belief" buttons floating right

**Triangle Shift:** Large interactive triangle in center, role labels at vertices, animated transformation showing before/after states

**Six Fears:** Checklist format with expandable descriptions, progress percentage at top, resources linked for each fear

**Hill Overlay:** Principle selector dropdown, micro-action input field, visual hill graphic with selected principle positioned, celebration on completion

All pages maintain consistent header, smooth transitions, and clear next-action buttons to guide users through their wealth and worthiness journey.