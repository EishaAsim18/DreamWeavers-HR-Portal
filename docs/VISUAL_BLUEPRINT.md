# DreamWeavers HRMS
# Visual Blueprint & Design Language Guide

| Field | Value |
|---|---|
| **Version** | 1.0 |
| **Status** | Awaiting approval before development |
| **Authors** | Lead Product Designer, Creative Director, Senior UI/UX Engineer |
| **Companion docs** | [PRODUCT_DESIGN.md](./PRODUCT_DESIGN.md) · [UI_GUIDELINES.md](./UI_GUIDELINES.md) |

---

## Document Purpose

This is the **complete visual blueprint** for DreamWeavers HRMS. A senior frontend engineer should be able to build the entire UI from this document alone — no design questions required.

**Contains:**
- Design language foundation (Sections 1–50)
- Screen-by-screen specifications with wireframes
- Interaction, motion, responsive, and accessibility specs per screen
- Consolidated Design Language Guide (final section)

**Does not contain:** Implementation code, React components, or API definitions.

---

# PART I — DESIGN LANGUAGE FOUNDATION

---

## 1. Overall Visual Identity

DreamWeavers HRMS presents as a **quietly luxurious workspace** — the visual equivalent of a well-designed studio office. Not flashy. Not corporate-gray. Not startup-neon.

### Identity Pillars

| Pillar | Visual Expression |
|---|---|
| **Precision** | Sharp grid alignment, consistent 4px spacing, geometric logo echoed in UI radius |
| **Calm** | `#FAFAFA` canvas, muted teal accent, no visual noise |
| **Depth** | Layered surfaces via soft shadows and glass — not flat, not skeuomorphic |
| **Humanity** | Avatars, presence dots, warm micro-copy — enterprise without coldness |
| **Speed** | Instant skeleton placeholders, 150ms transitions — UI feels responsive before data arrives |

### Visual Metaphor

*"Weaving"* — threads of HR, work, and communication interlacing. Expressed through:
- Subtle diagonal line patterns at 2% opacity in brand panel backgrounds
- Interlocking geometric shapes in empty state watermarks
- Connected dot patterns in loading states (optional, very subtle)

### Competitive Position (Visual)

| Reference | What We Take | What We Avoid |
|---|---|---|
| Linear | Sidebar precision, command palette, muted palette | Issue-tracker density |
| Vercel | Glass nav, deployment-style status pills | Developer-centric jargon UI |
| Notion | Clean page headers, content-first | Block editor complexity |
| Stripe | Table quality, dashboard stat cards | Payment-form patterns everywhere |
| Slack/Discord | Chat column structure | Purple branding, emoji-heavy chrome |
| WhatsApp Desktop | Conversation list + thread | Green branding, bubble roundness excess |
| Apple | Typography hierarchy, whitespace | iOS-specific patterns |
| Arc Browser | Floating sidebar, soft corners | Browser chrome metaphors |

---

## 2. Design Philosophy

### The DreamWeavers Principle

> **"Premium is what you remove, not what you add."**

### Ten Commandments

1. **One accent color** — `#4A7C92` carries all brand weight
2. **Weight over color** — hierarchy via font weight and size, not hue variety
3. **Whitespace is a component** — treat empty space as intentional layout
4. **Motion confirms, never decorates** — if removing animation loses no meaning, remove it
5. **Consistency beats creativity** — one table, one form, one modal pattern globally
6. **Role-aware density** — admin views may be denser; employee views stay airy
7. **Content leads chrome** — navigation recedes; data and actions advance
8. **States are designed** — loading, empty, error are first-class screens, not afterthoughts
9. **Touch and pointer parity** — every hover state has a focus/keyboard equivalent
10. **Dark mode is native** — not an inverted light theme; designed independently

---

## 3. Mood Board

### Keywords
`Slate morning light` · `Matte paper` · `Brushed steel` · `Quiet confidence` · `Studio desk` · `Fog over water` · `Japanese minimal office`

### Visual References (Descriptive)

| Mood Element | Description | Application |
|---|---|---|
| **Morning fog palette** | Cool grey-white with teal undertone | Canvas backgrounds, subtle gradients |
| **Matte stationery** | Uncoated paper white, soft shadow | Cards, modals |
| **Architect's desk** | Clean lines, metal accent, organized tools | Sidebar, toolbar |
| **Gallery wall** | One bold piece (brand teal), white walls | Accent usage ≤15% |
| **Soft window light** | Diffused, no harsh highlights | Glass navbar, overlays |
| **Watch mechanism** | Precise, mechanical motion | Micro-interactions, 120ms hovers |

### Material Qualities

- **Surfaces:** Matte, never glossy (except glass nav blur layer)
- **Shadows:** Diffused, low contrast — like paper floating 2mm above desk
- **Borders:** Hairline (`1px`), low contrast — structure without cages
- **Text:** Crisp, high contrast ink on white — never washed out grey body text

### Emotional Target by Module

| Module | Emotion |
|---|---|
| Dashboard | Oriented, in control |
| Employees | Professional, trustworthy |
| Attendance | Quick, factual |
| Tasks | Focused, actionable |
| Calendar | Structured, spacious |
| Meet Dreams | Warm, connected |
| Documents | Organized, secure |
| AI Assistant | Intelligent, calm |
| Reports | Clear, authoritative |

---

## 4. Branding Guidelines

### Primary Brand: DreamWeavers

| Attribute | Specification |
|---|---|
| Brand name | **DreamWeavers** (camelCase in UI, never DREAMWEAvers mid-sentence) |
| Product name | **DreamWeavers HRMS** (first mention), **DreamWeavers** (subsequent) |
| Tagline | *"Where work comes together"* (login panel, marketing) |
| Voice | Professional, warm, concise — never corporate jargon |

### Color Ownership

| Color | Owner | Usage |
|---|---|---|
| `#4A7C92` Slate Teal | DreamWeavers primary | Actions, active states, brand moments |
| `#1A1A1B` Ink | DreamWeavers text | All primary text, logo "W" |
| `#FFFFFF` / `#FAFAFA` | Canvas | Backgrounds |

### Co-branding Rules

- Third-party integrations (Gemini, n8n) appear as **neutral grey badges** in Settings — never their brand colors in main UI
- "Powered by Gemini" in AI panel footer only, `caption` size, `ink-tertiary`

---

## 5. DreamWeavers Brand Usage

### In-App Brand Touchpoints

| Location | Treatment |
|---|---|
| Sidebar header | Monogram 32px + "DreamWeavers" `heading-sm` |
| Auth left panel | Full logo centered, 48px monogram height |
| Email templates | Full logo top-center, brand teal header line |
| Favicon | Monogram only |
| Loading screen | Monogram + subtle pulse animation |
| 404/500 pages | Monogram watermark + message |

### Brand Teal Usage Budget (per screen)

| Element | Max instances |
|---|---|
| Primary CTA button | 1 |
| Active nav item | 1 |
| Focus rings | As needed (system) |
| Links in body | Unlimited but styled subtle |
| Decorative fills | 0 |

---

## 6. Meet Dreams Branding

**Meet Dreams** is the communication sub-brand — chat, audio, video.

### Identity

| Attribute | Value |
|---|---|
| Module name | **Meet Dreams** (never "Meetings" or "Chat" alone in nav) |
| Sub-tagline | *"Connect. Call. Collaborate."* |
| Accent | Inherits DreamWeavers `#4A7C92` — no separate color |
| Icon | Custom wave/dream mark (MVP: Lucide `Sparkles` + `Video` composite) |

### Visual Differentiation (within brand)

Meet Dreams uses **slightly warmer interaction feedback** without new colors:
- Message send button: brand primary (same as global)
- Own message bubble: `brand-primary-muted` background
- Other message bubble: `surface-sunken` background
- Call active state: subtle `brand-primary` glow on avatar ring (2px, 20% opacity)
- Voice waveform: animated bars in `brand-primary`, 3 bars, 120ms stagger

### Meet Dreams ≠ Separate App

No separate color scheme. No separate sidebar. Meet Dreams lives inside the DreamWeavers shell — unified, not siloed.

---

## 7. Logo Placement Rules

### Clear Space

Minimum clear space around logo = **height of the "D" monogram** on all sides.

### Size Minimums

| Context | Min Size |
|---|---|
| Sidebar monogram | 28px |
| Auth panel full logo | 120px width |
| Email header | 100px width |
| Favicon | 16px (monogram only) |

### Placement Matrix

| Surface | Logo | Allowed |
|---|---|---|
| Floating sidebar top | Monogram + wordmark | ✅ |
| Glass navbar | None (breadcrumb space) | ❌ No logo in navbar |
| Page content | None | ❌ |
| Auth brand panel | Full logo centered | ✅ |
| Footer | None | ❌ |
| Empty states | Watermark monogram 3% opacity | ✅ Optional |
| Meet Dreams header | Module name text only | ❌ No logo |

### Don'ts

- Never rotate logo
- Never apply gradient to logo
- Never use logo on `brand-primary` solid background (insufficient contrast on teal "D")
- Never animate logo except loading pulse (opacity 0.6 → 1.0, 2s loop)

---

## 8. Color Psychology

### Brand Primary — `#4A7C92` (Slate Teal)

| Association | Why it fits HRMS |
|---|---|
| Trust, stability | HR handles sensitive data |
| Calm competence | Reduces anxiety around approvals, attendance |
| Modern professionalism | Not old corporate blue, not playful green |
| Clarity | Cool tone aids focus on data |

**Use for:** Primary actions, active navigation, progress, links, focus rings.

### Ink — `#1A1A1B`

| Association | Application |
|---|---|
| Authority, readability | Headings, primary text |
| Premium contrast | Sharp against white — Apple-like |

### Canvas — `#FAFAFA`

| Association | Application |
|---|---|
| Openness, breathing room | Reduces eye strain for all-day use |
| Neutrality | Content and data stand forward |

### Semantic Colors

| Color | Psychology | Strict Usage |
|---|---|---|
| Success `#16A34A` | Completion, approval | Approved, present, done |
| Warning `#CA8A04` | Attention, not alarm | Pending, late, expiring |
| Danger `#DC2626` | Stop, critical | Rejected, absent, delete |
| Never use semantic colors decoratively | — | — |

---

## 9. Background Styles

### Layer System

```
Layer 0: App Canvas     #FAFAFA (light) / #0F0F10 (dark)
Layer 1: Base Surface   #FFFFFF / #18181B
Layer 2: Sunken         #F4F4F5 / #27272A
Layer 3: Overlay        rgba white 85% / rgba #18181B 80%
```

### Background Types

| Type | CSS Concept | Usage |
|---|---|---|
| **Solid canvas** | `surface-canvas` | Main app background |
| **Solid base** | `surface-base` | Cards, sidebar, modals |
| **Subtle tint** | `brand-primary-subtle` `#F0F5F7` | Selected states, widget accents |
| **Brand panel** | Canvas + geometric pattern | Auth left panel |
| **Glass** | Base at 85% + blur 16px | Navbar, overlays |
| **Scrim** | `#1A1A1B` at 40% | Modal backdrop |

### Geometric Pattern (Auth / Marketing Only)

```
Diagonal lines, 1px, #4A7C92 at 4% opacity
Spacing: 24px grid
Angle: 45°
Never on functional app screens
```

### Background Don'ts

- No full-page gradients in app UI
- No photographic backgrounds in authenticated views
- No animated backgrounds except Meet Dreams voice waveform and loading pulse

---

## 10. Glassmorphism Guidelines

Glass effects are **restricted** to prevent overuse.

### Approved Glass Surfaces

| Surface | Background | Blur | Border |
|---|---|---|---|
| Glass Navbar | white 85% / `#18181B` 80% | 16px / 12px dark | 1px bottom `border-default` |
| Command palette backdrop | black 40% | none | — |
| Floating sidebar | **NOT glass** — solid `surface-base` at 98% opacity | none | none |
| Modal backdrop | black 40% | none | — |
| Toast | solid ink `#1A1A1B` 95% | 8px optional | none |

### Glass Recipe (Light)

```
background: rgba(255, 255, 255, 0.85);
backdrop-filter: blur(16px) saturate(180%);
-webkit-backdrop-filter: blur(16px) saturate(180%);
border-bottom: 1px solid rgba(228, 228, 231, 0.6);
```

### Glass Recipe (Dark)

```
background: rgba(24, 24, 27, 0.80);
backdrop-filter: blur(12px) saturate(150%);
border-bottom: 1px solid rgba(63, 63, 70, 0.5);
```

### Rules

- Maximum **one** glass layer visible at a time (navbar OR overlay, not both competing)
- Fallback for browsers without `backdrop-filter`: solid `surface-base` at 100%
- Never glass on data tables or form fields — readability first

---

## 11. Gradient Guidelines

Gradients are **rare**. Used only in approved contexts.

### Approved Gradients

| Name | Definition | Usage |
|---|---|---|
| **Brand fade** | `#4A7C92` → `#4A7C92` at 0% opacity, top to bottom | Auth panel bottom fade overlay |
| **Skeleton shimmer** | `#F4F4F5` → `#FFFFFF` → `#F4F4F5` | Loading skeleton animation |
| **Chart fill** | `#4A7C92` at 30% → `#4A7C92` at 0% | Area chart fill only |
| **Avatar ring (call)** | `#4A7C92` → `#5B8FA3` | Active video call speaker ring |

### Prohibited

- Gradient buttons
- Gradient sidebar backgrounds
- Gradient text
- Multi-color gradients (rainbow)
- Animated gradient backgrounds

---

## 12. Illustration Style

DreamWeavers uses **no traditional illustrations** in the product UI.

### Instead: Typographic Empty States

| Element | Style |
|---|---|
| Primary | `heading-md`, ink primary, centered |
| Secondary | `body-md`, ink secondary, max-width 360px |
| Optional watermark | Monogram SVG at 3% opacity, 120px, centered behind text |
| Optional icon | Single Lucide icon, 48px, `ink-tertiary`, above heading |

### Future Illustration Direction (if added later)

- Line art only, 1.5px stroke matching Lucide
- Colors: ink primary + brand primary only
- Geometric, abstract — no cartoon people
- Style reference: Vercel empty states, Linear onboarding art

---

## 13. Icon Style

| Property | Value |
|---|---|
| Library | Lucide Icons |
| Default stroke | 1.5px |
| Active nav stroke | 2px |
| Style | Outlined only — no filled icons except status dots |
| Color | Inherits text color — never multicolor |

### Icon Sizing

| Context | Size | Container |
|---|---|---|
| Inline text | 16px | none |
| Button / nav | 18px | 36px square for active nav |
| Toolbar | 18px | 32px hit area |
| Empty state | 48px | none |
| Stat widget | 20px | 36px rounded-lg, `brand-primary-subtle` bg |
| Meet Dreams call controls | 22px | 44px circle button |

### Module Icons (Sidebar)

| Module | Lucide Icon |
|---|---|
| Dashboard | `LayoutDashboard` |
| Employees | `Users` |
| Attendance | `Clock` |
| Tasks | `CheckSquare` |
| Calendar | `Calendar` |
| Teams | `Network` |
| Meet Dreams | `Sparkles` |
| Documents | `FolderOpen` |
| Reports | `BarChart3` |
| Automations | `Workflow` |
| Settings | `Settings` |
| Notifications | `Bell` |
| AI Assistant | `Wand2` |

---

## 14. Card Design

### Standard Card

```
┌─────────────────────────────────────┐  ← radius-lg (8px)
│  Card Title              [···]      │  ← heading-sm, 20px padding top
│  Optional description               │  ← body-sm, ink-secondary
│                                     │
│  Content area                       │
│                                     │
└─────────────────────────────────────┘  ← 20px padding bottom
Border: 1px border-default
Shadow: shadow-sm
Background: surface-base
```

### Interactive Card (project, team)

- Hover: `shadow-sm` → `shadow-md`, 150ms ease
- No scale transform
- Cursor: pointer
- Focus: 2px brand focus ring on card container

### Stat Card (Dashboard)

```
┌──────────────────┐
│ [icon]  LABEL    │  ← overline, ink-tertiary
│ 247              │  ← display-sm or heading-lg, tabular-nums
│ +12 this month   │  ← caption, success or ink-tertiary
└──────────────────┘
Min height: 120px
Radius: radius-xl (12px)
```

### Card Variants

| Variant | Border | Shadow | Use |
|---|---|---|---|
| Default | yes | sm | General content |
| Elevated | yes | md | Featured content |
| Flat | yes | none | Nested inside other cards |
| Widget | yes | sm | Bento dashboard, radius-xl |

---

## 15. Widget Design

Bento dashboard widgets extend card design with specific anatomy.

### Widget Anatomy

```
┌─────────────────────────────────────────┐
│ Widget Title              View all →    │  ← heading-sm + ghost link body-sm
├─────────────────────────────────────────┤
│                                         │
│  Widget body (chart / list / stat)      │
│                                         │
│                                         │
└─────────────────────────────────────────┘
Padding: 20px
Radius: radius-xl (12px)
Min-height: 120px (stat) / 240px (chart/list)
Gap between widgets: 16px
```

### Widget Types

| Type | Body Content | Min Height |
|---|---|---|
| Stat | Large number + delta | 120px |
| Chart | SVG/Canvas chart, no chrome | 280px |
| List | Max 5 rows, avatar + text + meta | 240px |
| Action | CTA button prominent (Clock In) | 160px |
| Progress | Progress bar + label | 120px |

### Widget States

| State | Visual |
|---|---|
| Loading | Skeleton matching widget shape |
| Empty | Centered caption + small CTA |
| Error | `caption` danger text + Retry ghost button |
| Loaded | Normal |

---

## 16. Dashboard Visual Layout

See Screen Blueprint **SB-01 Dashboard** in Part II.

### Grid Specification

```
Desktop (≥1024px):
  Row 1: 4 equal stat cards, 16px gap
  Row 2: 2 widgets at 50% width each, 16px gap
  Row 3: 2 widgets at 50% width each, 16px gap

Tablet (640–1023px):
  Row 1: 2×2 stat cards
  Row 2+: Full width widgets stacked

Mobile (<640px):
  All single column, 16px gap
```

### Dashboard Greeting Header

```
Good morning, Sarah          ← display-sm or heading-lg
Tuesday, July 7, 2026         ← body-md, ink-secondary
```

Positioned in PageHeader area, not in navbar.

---

## 17. Sidebar Design

### Dimensions

| State | Width | Content |
|---|---|---|
| Expanded | 240px | Icon + label + badge |
| Collapsed | 64px | Icon only, tooltip on hover |

### Position & Style

```
Position: fixed
Top: 12px, Left: 12px, Bottom: 12px
Radius: radius-xl (12px)
Background: surface-base at 98% opacity
Shadow: shadow-md
Z-index: 20
```

### Nav Item Anatomy

```
Height: 40px
Padding: 0 12px
Radius: radius-md (6px)
Gap between icon and label: 12px
Icon: 18px
Label: body-md, weight 500
Badge: pill, brand-primary bg, white text, 18px min-height
```

### Nav Item States

| State | Background | Text | Icon |
|---|---|---|---|
| Default | transparent | ink-secondary | ink-secondary |
| Hover | surface-sunken | ink-primary | ink-primary |
| Active | brand-primary-muted | brand-primary | brand-primary, 2px stroke |
| Focus | + 2px focus ring | — | — |

### Sidebar Animation

- Expand/collapse: width 240px ↔ 64px over 200ms, ease-spring
- Labels: opacity 0 → 1 over 150ms, 50ms delay on expand; reverse on collapse
- Main content margin adjusts simultaneously

---

## 18. Navbar Design

### Glass Navbar Specification

```
Height: 56px
Position: sticky, top: 0
Z-index: 10
Padding: 0 24px
Glass: see Section 10
```

### Layout (Left → Right)

```
[Breadcrumbs]  [flex-grow]  [Search trigger]  [Primary action?]  [Bell]  [AI ✦]
```

| Element | Spec |
|---|---|
| Breadcrumbs | body-sm, ink-tertiary, separator `/`, last item ink-primary |
| Search trigger | Ghost button, 32px, search icon + "Search…" + `⌘K` kbd hint |
| Bell | IconButton 36px, dot badge 8px danger for unread |
| AI trigger | IconButton 36px, Sparkles icon, brand-primary on hover |

### Navbar on Mobile

- Hide breadcrumbs (show page title only, `heading-sm`, truncated)
- Search becomes icon only
- Primary action becomes icon or moves to FAB

---

## 19. Button Styles

### Variant Matrix

| Variant | BG | Text | Border | Height |
|---|---|---|---|---|
| Primary | brand-primary | white | none | 36px |
| Primary hover | brand-primary-hover | white | none | — |
| Primary active | brand-primary-active | white | none | scale 0.98, 100ms |
| Secondary | transparent | ink-primary | 1px border-default | 36px |
| Ghost | transparent | ink-secondary | none | 36px |
| Danger | danger | white | none | 36px |
| Danger outline | transparent | danger | 1px danger 30% | 36px |

### Sizes

| Size | Height | H-Padding | Font |
|---|---|---|---|
| sm | 32px | 12px | label-sm |
| md | 36px | 16px | label-md |
| lg | 40px | 20px | body-md |

### Icon Buttons

```
Size: 36×36px (md), 32×32px (sm)
Radius: radius-md
Hover: surface-sunken background
Focus: 2px brand ring
```

### Button Press Animation

```
Active/press: transform scale(0.98), 100ms ease-out
Release: scale(1.0), 100ms ease-out
Loading: label → spinner, opacity crossfade 100ms, width locked
```

### Rules

- **One** primary button visible per PageHeader
- Destructive actions never styled as primary
- Disabled: 50% opacity, cursor not-allowed, no hover

---

## 20. Form Design

### Field Stack

```
Label          ← label-md, ink-primary, 4px margin bottom
[ Input      ] ← 36px height, radius-md
Hint text      ← caption, ink-tertiary, 4px margin top
Error text     ← caption, danger, 4px margin top
```

Vertical gap between fields: **16px**  
Gap between sections: **32px**

### Input Spec

```
Height: 36px (single line), min 80px (textarea)
Padding: 0 12px
Border: 1px border-default
Radius: radius-md
Font: body-md
Background: surface-base
```

### Input States

| State | Border | Ring | Background |
|---|---|---|---|
| Default | border-default | none | surface-base |
| Hover | border-strong | none | surface-base |
| Focus | border-focus | 2px brand 20% opacity | surface-base |
| Error | danger | 2px danger 20% | danger-muted 20% |
| Disabled | border-default | none | surface-sunken, 50% text |

### Form Layout Patterns

| Pattern | Max Width | Use |
|---|---|---|
| Single column | 480px | Settings, profile |
| Two column | 640px | Name pairs, date ranges |
| Slide-over form | 480px panel | Quick create (employee, task) |
| Modal form | 480px modal | Event create, confirm |

---

## 21. Modal Design

### Standard Modal

```
Backdrop: black 40%, fade in 150ms
Container:
  Width: 480px (default), 560px (wide)
  Max-height: 85vh
  Radius: radius-xl
  Shadow: shadow-lg
  Background: surface-base
  Padding: 24px

Header: heading-md + close IconButton (top-right)
Body: 16px below header
Footer: border-top, 16px padding-top, buttons right-aligned
  Order: [Cancel ghost] [Primary]
```

### Modal Animation

```
Enter: opacity 0→1 (150ms) + scale 0.96→1.0 (180ms spring)
Exit: opacity 1→0 (120ms) + scale 1.0→0.98 (120ms)
Backdrop: opacity 0→1 (150ms)
Focus: trap inside modal; focus first input or primary button
```

### Modal Variants

| Variant | Width | Use |
|---|---|---|
| Standard | 480px | Forms, confirmations |
| Wide | 560px | Command palette |
| Full-screen (mobile) | 100vw | Command palette, search on mobile |

---

## 22. Table Design

See Screen Blueprints for module-specific tables.

### Table Chrome

```
Toolbar height: 48px
  Left: Search input 240px + filter chips
  Right: Column toggle + Export ghost button

Header row:
  Height: 40px
  Background: surface-sunken
  Font: label-sm, ink-secondary, uppercase optional
  Border-bottom: 1px border-strong

Body row:
  Min-height: 48px (52px with avatar)
  Font: body-md
  Border-bottom: 1px border-default

Footer:
  Height: 48px
  Left: "Showing 1–25 of 247"
  Right: Page size select + pagination arrows
```

### Row Interactions

| Interaction | Behavior |
|---|---|
| Hover | Background → surface-sunken; inline actions fade in (opacity 0→1, 120ms) |
| Selected | Background → brand-primary-muted |
| Focus (keyboard) | 2px inset brand ring |
| Click row | Navigate to detail OR open drawer (module-specific) |

---

## 23. Kanban Design

Used in: Tasks (board view), Employee Onboarding pipeline.

### Column Spec

```
Width: 280px (fixed)
Gap between columns: 16px
Header: heading-sm + count badge (surface-sunken pill)
Background: surface-sunken at 50% opacity
Radius: radius-lg
Padding: 12px
Min-height: 400px
```

### Task Card (Kanban)

```
┌─────────────────────────┐
│ ● Priority dot          │
│ Task title (2 lines max)│  ← heading-sm truncated
│ [avatar] Jul 8  [label] │  ← caption row
└─────────────────────────┘
Padding: 12px
Radius: radius-lg
Shadow: shadow-sm
Background: surface-base
Margin-bottom: 8px
```

### Drag Behavior

```
Pickup: shadow-sm → shadow-md, scale 1.02, 150ms spring
Drag: cursor grabbing, card follows pointer with 2px offset
Drop zone: column border → brand-primary 2px dashed
Drop: scale 1.0, shadow-sm, 200ms spring
Other cards: reflow with 200ms layout animation
```

---

## 24. Calendar Design

### Month View Grid

```
Cell min-height: 100px (desktop), 60px (tablet)
Header row: day abbreviations, label-sm, ink-tertiary, 40px height
Date number: body-sm, ink-secondary; today → brand-primary circle 28px
Event pill: height 22px, radius-full, brand-primary-muted bg, caption text, truncated
Max pills per cell: 3 + "+N more" caption
```

### Event Colors (by type)

| Type | Pill Background | Left Border |
|---|---|---|
| Meeting | brand-primary-muted | 3px brand-primary |
| Task deadline | warning-muted | 3px warning |
| Leave | success-muted | 3px success |
| Company event | surface-sunken | 3px ink-tertiary |
| Personal | brand-primary-subtle | 3px brand-primary at 50% |

### Week/Day View

- Hour grid: 60px per hour
- Current time indicator: 1px danger line + dot
- Event block: radius-md, 4px left border, 8px padding

---

## 25. Chat Design

Meet Dreams message thread.

### Message Bubble Spec

| Sender | Background | Text | Radius |
|---|---|---|---|
| Self | brand-primary-muted | ink-primary | 12px 12px 4px 12px |
| Other | surface-sunken | ink-primary | 12px 12px 12px 4px |
| System | transparent | ink-tertiary, caption, centered | none |

```
Max width: 70% of thread
Padding: 10px 14px
Gap between messages same sender: 4px
Gap between different senders: 16px
Timestamp: caption, ink-tertiary, shown on hover or always on last in group
```

### Composer

```
Height: auto, min 44px, max 120px (4 lines)
Border-top: 1px border-default
Padding: 12px 16px
Background: surface-base
Attach icon left, send button right (brand primary circle 36px)
```

---

## 26. Audio Call Screen

### Incoming Call Modal

```
┌─────────────────────────────────┐
│                                 │
│         [Avatar 80px]           │
│         Sarah Chen              │  ← heading-md
│         Audio call…             │  ← body-sm, ink-secondary
│                                 │
│    [Decline]      [Accept]      │
│     red circle    green circle  │
│      56px          56px         │
└─────────────────────────────────┘
Width: 360px
Radius: radius-2xl
Shadow: shadow-xl
Backdrop: black 60%
Animation: scale 0.9→1.0 spring + ring pulse on avatar
```

### Active Audio Bar

```
┌──────────────────────────────────────────────────────────┐
│ [avatar 32px] Sarah Chen  ● Connected  [waveform] [···] │
└──────────────────────────────────────────────────────────┘
Height: 56px
Position: top of message thread (below header)
Background: brand-primary-subtle
Waveform: 3 bars, brand-primary, animated height 4–16px, 120ms stagger loop
```

---

## 27. Video Call Screen

### Layout (In-Thread Full Replace)

```
┌──────────────────────────────────────────────────────────┐
│  Meeting: Weekly Standup          [Grid] [Chat] [···]  │  ← 48px header
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│   │  Participant │  │  Participant │  │  Participant │    │
│   │    Tile      │  │    Tile      │  │    Tile      │    │
│   └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                          │
├──────────────────────────────────────────────────────────┤
│        [Mic]  [Cam]  [Share]  [People]  [Leave]         │  ← 64px control bar
└──────────────────────────────────────────────────────────┘
```

### Video Tile

```
Radius: radius-lg
Background: #1A1A1B (video off state)
Name label: caption, bottom-left, white on black 60% pill
Active speaker: 2px border brand-primary, subtle glow shadow
Self view: 160×120px, bottom-right, radius-lg, 16px inset
```

### Control Bar Buttons

```
Size: 44px circle
Default: surface-sunken (dark: #27272A)
Active/off: danger background (mic muted, cam off)
Leave: danger filled, pill shape 80×44px "Leave"
Hover: brightness 110%, 120ms
```

### Video Transition

```
Enter: thread content slides up fades out (200ms)
       video grid fades in scale 0.98→1.0 (250ms)
Exit: reverse
PiP mode: video shrinks to 240×160 bottom-right corner, 300ms spring
```

---

## 28. AI Assistant Design

### Panel Specification

```
Width: 360px
Position: right panel, push layout desktop
Background: surface-base
Border-left: 1px border-default
Z-index: 40
```

### Panel Header

```
✦ DreamWeavers AI          [×]
Context: Tasks · Project Alpha   ← caption, brand-primary pill, dismissible
Height: 56px
Border-bottom: 1px border-default
```

### Message Bubbles

| Role | Style |
|---|---|
| User | Right-aligned, surface-sunken, radius-xl, body-md |
| AI | Left-aligned, no bubble bg, body-md, markdown rendered |
| AI action | Inline button chips below AI text (secondary style) |

### Suggested Prompts

```
Chip: height 32px, radius-full, border 1px border-default
Hover: brand-primary-muted bg
Font: body-sm
Max visible: 3 chips, horizontal scroll if more
```

### Input Area

```
Textarea: min 44px, max 120px
Send button: 36px circle, brand-primary, arrow icon
Placeholder: "Ask anything about your work…"
Loading: 3-dot pulse typing indicator, brand-primary, left-aligned
```

---

## 29. Empty States

### Anatomy (Universal)

```
        [Icon 48px, ink-tertiary]        ← optional

        OVERLINE LABEL                   ← overline, ink-tertiary, 0.08em tracking

        Primary heading                  ← heading-md, ink-primary

        Supporting description text      ← body-md, ink-secondary, max 360px

        [ Primary CTA Button ]           ← optional
        Secondary text link              ← optional
```

Vertical spacing: 12px between elements. Centered horizontally and vertically in container.

### Per-Module Empty Copy

| Module | Heading | CTA |
|---|---|---|
| Tasks | No tasks yet | Create task |
| Employees | Build your team | Add employee |
| Documents | Your library is empty | Upload files |
| Meet Dreams | Start a conversation | New message |
| Notifications | You're all caught up | (none — success variant) |
| Reports | No reports yet | Create report |
| Search | No results for "{query}" | Clear search |

---

## 30. Loading Screens

### App Initial Load (Auth Check)

```
Full viewport, surface-canvas background
Center: Monogram 48px
Below: subtle pulse opacity 0.5→1.0, 2s ease-in-out loop
No text (feels faster)
Max display: 3s before showing error
```

### Route Transition

```
Previous content: opacity 1→0.6, 100ms
Skeleton: opacity 0→1, 100ms, replaces content
Never show blank white screen
```

### Inline Loading

| Context | Pattern |
|---|---|
| Button | Spinner 16px replaces label |
| Widget | Skeleton card |
| Table | 5 skeleton rows |
| Chat | Typing indicator dots |
| AI | Typing indicator dots |
| Upload | Progress bar 0–100% |

---

## 31. Skeleton Screens

### Skeleton Element Spec

```
Background: surface-sunken
Shimmer: linear-gradient 90deg, surface-sunken → surface-base → surface-sunken
Animation: translateX -100%→100%, 1.5s linear infinite
Radius: match target element
```

### Skeleton Shapes

| Target | Skeleton Shape |
|---|---|
| Text line | height 14px, width 60–80% random |
| Heading | height 24px, width 40% |
| Avatar | circle, match target size |
| Stat number | height 36px, width 80px |
| Table row | full width, height 48px |
| Chart | full widget area, radius-lg |
| Button | height 36px, width 100px |

### Rules

- Skeleton layout must **pixel-match** loaded layout — zero layout shift
- Debounce: don't show skeleton if load < 200ms
- Crossfade skeleton→content: 100ms opacity

---

## 32. Error Pages

### 404

```
Center layout, max-width 480px
Monogram watermark 3% opacity behind
Heading: "Page not found" — heading-lg
Body: "This page doesn't exist or was moved." — body-md, ink-secondary
Actions: [Open command palette] secondary + [Go to Dashboard] primary
```

### 403

```
Heading: "Access restricted"
Body: "You don't have permission to view this."
Action: [Go back] ghost
```

### 500

```
Heading: "Something went wrong"
Body: "We've logged the issue. Try again in a moment."
Error ID: caption, ink-tertiary, monospace
Actions: [Retry] primary + [Contact support] ghost link
```

### Offline Banner

```
Position: below navbar, full width, 40px height
Background: warning-muted
Text: body-sm, warning color
Icon: WifiOff 16px
Persistent until connection restored
```

---

## 33. Success Animations

Used sparingly — confirmation moments only.

| Moment | Animation |
|---|---|
| Task completed | Checkbox: scale 0→1.2→1.0, 300ms spring + strikethrough fade 200ms |
| Approved | Green checkmark circle draw SVG stroke, 400ms |
| Clock in | Subtle ripple from button center, brand-primary 20% opacity, 600ms fade |
| File uploaded | Progress bar fills → checkmark morph, 300ms |
| Toast success | Slide in + subtle bounce at rest, 200ms spring |

**Never** full-screen success animations. **Never** confetti (too casual for enterprise).

---

## 34. Notification Design

### In-App Drawer

```
Width: 400px
Position: slide from right, below navbar
Max-height: calc(100vh - 56px)
Background: surface-base
Border-left: 1px border-default
Shadow: shadow-lg
```

### Notification Item

```
┌────────────────────────────────────────┐
│ [icon 36px container]  Title text      │
│                        Description     │
│                        2m ago  [Act]   │
└────────────────────────────────────────┘
Padding: 12px 16px
Unread: brand-primary 8px dot left edge OR bold title
Hover: surface-sunken
Height: auto, min 64px
```

### Category Icon Colors

| Category | Icon | Container BG |
|---|---|---|
| Approval | CheckCircle | brand-primary-muted |
| Task | CheckSquare | brand-primary-muted |
| Mention | AtSign | brand-primary-muted |
| Attendance | Clock | warning-muted |
| Document | File | surface-sunken |
| Meeting | Video | brand-primary-muted |
| System | Info | surface-sunken |

---

## 35. Toast Design

```
Position: bottom-right, 24px from edges
Width: 360px max
Padding: 12px 16px
Radius: radius-lg
Shadow: shadow-lg
Background: ink-primary (#1A1A1B)
Text: white, body-sm
Z-index: 60
```

### Variants

| Variant | Left accent |
|---|---|
| Default | none |
| Success | 3px left border success |
| Warning | 3px left border warning |
| Error | 3px left border danger |

### Animation

```
Enter: translateY(16px)→0 + opacity 0→1, 200ms spring
Exit: translateY(0)→8px + opacity 1→0, 150ms ease-in
Auto-dismiss: 5s (8s if action button present)
Stack: max 3 visible, older collapse upward
```

---

## 36. Dropdown Design

```
Min-width: 180px
Max-height: 320px, scroll if overflow
Padding: 4px
Radius: radius-lg
Shadow: shadow-md
Background: surface-base
Border: 1px border-default
Z-index: 30
```

### Menu Item

```
Height: 36px
Padding: 0 8px
Radius: radius-md
Font: body-md
Hover: surface-sunken
Active/selected: brand-primary-muted + brand-primary text
Icon: 16px, 8px gap before label
Destructive item: danger text, hover danger-muted bg
Keyboard: arrow keys navigate, Enter selects, Esc closes
```

### Animation

```
Open: opacity 0→1 + scale 0.96→1.0, 120ms ease-out
Origin: top-left (or bottom-left for drop-up)
Close: reverse 100ms
```

---

## 37. Context Menu Design

Same visual spec as Dropdown (Section 36) with differences:

| Property | Context Menu | Dropdown |
|---|---|---|
| Trigger | Right-click | Click chevron/button |
| Position | Cursor coordinates | Anchor to trigger |
| Submenu | Arrow right indicator, flyout on hover 200ms delay | Same |
| Checkbox items | Check icon left when active | Same |
| Separator | 1px border-default, 4px vertical margin | Same |

---

## 38. Search Interface

### Navbar Search Trigger

```
Ghost button, height 32px
Content: Search icon + "Search…" + kbd badge "⌘K"
Width: 200px (desktop), icon-only (mobile)
Hover: surface-sunken bg
```

### Global Search Modal

```
Width: 640px
Max-height: 520px
Radius: radius-xl
Shadow: shadow-lg

Structure:
  Input row: 48px, large search icon, placeholder "Search everything…"
  Tabs: All | People | Tasks | Documents | Messages
  Results: scrollable, max 400px
  Footer: keyboard hints
```

### Search Result Row

```
Height: 56px
Padding: 8px 16px
Icon/avatar left, title + module badge + excerpt with highlight
Hover: brand-primary-muted
Highlight match: brand-primary background at 20%, semibold
```

---

## 39. Command Palette

```
Width: 560px
Max-height: 420px
Radius: radius-xl
Shadow: shadow-lg
Centered viewport

Input: 48px height, border-bottom 1px border-default
Results: grouped with overline section headers
Active item: brand-primary-muted bg
Footer bar: 36px, surface-sunken, keyboard hint captions
```

### Result Groups (in order)

1. Recent
2. Navigation
3. Actions
4. People
5. AI

### Prefix Filters

| Prefix | Filters to |
|---|---|
| `>` | Actions |
| `@` | People |
| `/` | Navigation |
| `Ask:` | AI query |

---

## 40. Profile Design

### Layout

```
Two-column desktop:
  Left 320px: Profile card (sticky)
  Right fluid: Tabbed content

Profile card:
  Avatar 96px, radius-full
  Name: heading-lg
  Role + department: body-sm, ink-secondary
  Status badge
  Contact info list: icon + text, body-sm
  Edit profile button: secondary, full width
```

### Tabs

```
Personal | Employment | Security | Preferences | Sessions
Tab height: 40px
Active tab: brand-primary bottom border 2px
```

---

## 41. Employee Card Design

Used in: directory card view, team members, search results.

```
┌────────────────────────────┐
│  [Avatar 48px]             │
│  Full Name                 │  ← heading-sm
│  Job Title                 │  ← body-sm, ink-secondary
│  Department · Status badge │
│  [Email] [Chat] [Profile]  │  ← icon buttons, hover reveal
└────────────────────────────┘
Padding: 16px
Radius: radius-lg
Border: 1px border-default
Shadow: shadow-sm
Hover: shadow-md, 150ms
Min-width: 240px
```

---

## 42. Charts

### Style Guide

| Property | Value |
|---|---|
| Primary data color | brand-primary `#4A7C92` |
| Secondary series | ink-tertiary, warning, success (max 4 series) |
| Grid lines | 1px border-default, horizontal only |
| Axis labels | caption, ink-tertiary |
| Tooltip | surface-base card, shadow-md, radius-md, body-sm |
| Area fill | brand-primary at 20% → 0% gradient |
| Bar radius | 4px top corners |
| Animation on load | draw 600ms ease-out, stagger bars 30ms |
| Donut center | heading-md stat value |

### Chart Types by Context

| Widget | Chart Type |
|---|---|
| Attendance trend | Area chart, 7/30 day toggle |
| Headcount | Line chart |
| Task completion | Donut |
| Department breakdown | Horizontal bar |
| Report builder | User-selected |

---

## 43. Reports

### Report Gallery

Card grid matching Project cards — title, description, last run caption, schedule badge.

### Report Builder

Step indicator top: 1 → 2 → 3 → 4 → 5, circles connected by line, active step brand-primary fill.

### Report Preview

```
Filter chips row below header
Chart area: 60% height
Data table below: toggle show/hide, collapsed by default on mobile
Export buttons: ghost, top-right — CSV, PDF
AI explain button: ghost with Wand2 icon
```

---

## 44. Typography Hierarchy

### Page Level

| Level | Token | Example |
|---|---|---|
| L1 Page title | heading-lg | Employee Directory |
| L2 Section title | heading-md | Personal Information |
| L3 Card title | heading-sm | Attendance Summary |
| L4 Label | label-md | Email address |
| L5 Body | body-md | Description text |
| L6 Meta | caption | Last updated 2h ago |
| L7 Overline | overline | APPROVALS |

### Weight Rules

- One `heading-lg` per page maximum
- Never skip levels (no heading-sm directly under heading-lg without heading-md)
- Bold (`600`) for headings only; body stays `400` or `500`
- ALL CAPS only for overlines and optional table headers

---

## 45. Spacing Rules

**Base unit: 4px.** All spacing must be multiples of 4.

| Context | Token | Value |
|---|---|---|
| Inline icon gap | space-2 | 8px |
| Form field gap | space-4 | 16px |
| Card padding | space-5 | 20px |
| Page padding | space-6 | 24px |
| Section gap | space-8 | 32px |
| Page header → content | space-6 | 24px |
| Bento grid gap | space-4 | 16px |
| Sidebar inset | space-3 | 12px |

---

## 46. Shadows

| Token | Value | Use |
|---|---|---|
| shadow-xs | `0 1px 2px rgba(26,26,27,0.04)` | Inputs |
| shadow-sm | `0 1px 3px rgba(26,26,27,0.06)` | Cards |
| shadow-md | `0 4px 12px rgba(26,26,27,0.08)` | Sidebar, dropdowns |
| shadow-lg | `0 8px 24px rgba(26,26,27,0.10)` | Modals, drawers |
| shadow-xl | `0 16px 48px rgba(26,26,27,0.12)` | Incoming call modal |

Dark mode: replace rgba(26,26,27,×) with rgba(0,0,0,0.4).

---

## 47. Border Radius

| Token | Value | Use |
|---|---|---|
| radius-sm | 4px | Badges |
| radius-md | 6px | Inputs, buttons, nav items |
| radius-lg | 8px | Cards, video tiles |
| radius-xl | 12px | Sidebar, modals, bento widgets |
| radius-2xl | 16px | Auth card, call modal |
| radius-full | 9999px | Avatars, pills, dots |

---

## 48. Motion System

### Duration Scale

| Token | Value | Use |
|---|---|---|
| instant | 0ms | Data swaps |
| fast | 100ms | Press, toggle |
| normal | 150ms | Hover, fade |
| slow | 200ms | Panel slide, sidebar |
| slower | 300ms | Video transition, PiP |
| chart | 600ms | Chart draw |

### Easing Curves

| Token | Value | Use |
|---|---|---|
| ease-default | cubic-bezier(0.4, 0, 0.2, 1) | General |
| ease-out | cubic-bezier(0, 0, 0.2, 1) | Enter |
| ease-in | cubic-bezier(0.4, 0, 1, 1) | Exit |
| ease-spring | cubic-bezier(0.32, 0.72, 0, 1) | Panels, modals |
| spring-bounce | stiffness 400, damping 30 | Modals, success |

---

## 49. Animation Principles

1. **Subtle** — user feels speed, not spectacle
2. **Directional** — panels slide from their origin edge
3. **Consistent** — same duration for same action type everywhere
4. **Interruptible** — user input cancels in-progress animation
5. **Reduced motion** — `prefers-reduced-motion` → instant or 100ms opacity only
6. **GPU-friendly** — animate `transform` and `opacity` only, not `width`/`height` where avoidable (except sidebar)
7. **No animation on data** — table sort/filter is instant

---

## 50. Transition Principles

| Transition | Rule |
|---|---|
| Route change | Content fades 150ms; shell persists |
| Panel open | Slide 200ms from edge + backdrop fade |
| Panel close | Reverse, 150ms (slightly faster exit) |
| Tab switch | Instant swap; indicator slides 120ms |
| Theme toggle | Colors transition 200ms |
| Modal | Scale + fade enter; fade exit |
| Toast | Slide up enter; fade down exit |
| List items | Stagger 30ms, max 10 items |
| Skeleton → content | Crossfade 100ms, no layout shift |

---

# PART II — SCREEN BLUEPRINTS

Each screen follows this template:
**Purpose · Wireframe · Visual Hierarchy · Component Placement · Spacing · Interactions · Hover · Focus · Animation · Transition · Responsive · Accessibility**

---

## SB-00: Authentication Screens

### SB-00a: Login

**Purpose:** Authenticate returning users quickly with minimal friction.

**Wireframe:**
```
┌──────────────────────────┬──────────────────────────┐
│                          │                          │
│   [Geometric pattern]    │    ┌────────────────┐    │
│                          │    │ Sign in        │    │
│      [DW Logo]           │    │ Email          │    │
│                          │    │ Password       │    │
│  Where work comes        │    │ [Sign in]      │    │
│  together.               │    │ Forgot password│    │
│                          │    └────────────────┘    │
│                          │                          │
└──────────────────────────┴──────────────────────────┘
```

**Visual Hierarchy:** L1 Sign in → L4 Labels → Primary CTA  
**Component Placement:** Form card centered in right column, max 400px  
**Spacing:** Card padding 32px; fields 16px apart  
**Interactions:** Enter submits; password show/hide toggle  
**Hover:** Primary button → brand-primary-hover  
**Focus:** First field on mount; tab order top-to-bottom  
**Animation:** Page fade-in 200ms; card scale 0.98→1.0 spring  
**Transition:** Redirect fade to dashboard 150ms  
**Responsive:** Stack to single column; hide brand panel on mobile, show mini logo above form  
**Accessibility:** Labels linked; error announcements; autocomplete attributes

---

### SB-00b: Accept Invite

Same layout as login. Fields: Full name, Password, Confirm password. Shows org name + inviter above form (`body-sm`, ink-secondary).

---

## SB-01: Dashboard

**Purpose:** Role-aware orientation — surface what matters today in one glance.

**Wireframe (Employee):**
```
[Sidebar] │ [Navbar: Search · Bell · AI]
          │ Good morning, Sarah · Jul 7
          │ ┌─────────┐ ┌─────────┐ ┌─────────┐
          │ │Clock In │ │Tasks 3  │ │Calendar │
          │ └─────────┘ └─────────┘ └─────────┘
          │ ┌──────────────────┐ ┌──────────────┐
          │ │ My Tasks         │ │ Meet Dreams  │
          │ └──────────────────┘ └──────────────┘
          │ ┌──────────────────┐
          │ │ Leave Balance    │
          │ └──────────────────┘
```

**Visual Hierarchy:** Greeting L1 → Stat widgets L3 → List widgets L3  
**Spacing:** Page pad 24px; bento gap 16px; greeting to grid 24px  
**Interactions:** Widget "View all" navigates; Clock In triggers attendance API  
**Hover:** Stat cards → shadow-md lift  
**Focus:** Tab through widgets and CTAs in reading order  
**Animation:** Widgets stagger fade-up 30ms delay; chart draw 600ms  
**Responsive:** 4→2→1 columns; Clock In becomes FAB on mobile  
**Accessibility:** Stat values aria-live on update; widgets are landmark regions

---

## SB-02: Employee Directory

**Purpose:** Find, filter, and manage all employees.

**Wireframe:**
```
[Sidebar] │ [Navbar]
          │ Employee Directory          [+ Add Employee]
          │ Manage your organization's team members
          │ [Search___] [Dept ▾] [Status ▾] [Role ▾]
          │ ┌──────────────────────────────────────────┐
          │ │ □  Employee      Dept     Status   ···  │
          │ │ □  [AV] Alex     Eng      Active   ···  │
          │ │ □  [AV] Jordan   HR       Active   ···  │
          │ └──────────────────────────────────────────┘
          │ Showing 1-25 of 247          [< 1 2 3 >]
```

**Hover:** Row → sunken bg; actions appear right  
**Focus:** Row focusable; Enter opens profile  
**Animation:** Rows fade-in stagger 20ms on load  
**Responsive:** Table → card list on mobile  
**Accessibility:** Sortable headers aria-sort; checkbox select-all

---

## SB-03: Employee Profile

**Purpose:** Single source of truth for one employee.

**Wireframe:**
```
[Sidebar] │ [Navbar]
          │ ← Employees / Alex Chen
          │ ┌────────────┐ ┌─────────────────────────────┐
          │ │ [AV 96px]  │ │ Overview│Employment│Docs│... │
          │ │ Alex Chen  │ │                             │
          │ │ Engineer   │ │  Content tab panel          │
          │ │ [Edit]     │ │                             │
          │ └────────────┘ └─────────────────────────────┘
```

**Spacing:** Left card 320px; gap 24px; tab panel pad 24px  
**Interactions:** Tab switch instant; Edit opens inline or slide-over  
**Responsive:** Single column stack; tabs scroll horizontal on mobile

---

## SB-04: My Attendance

**Purpose:** Clock in/out and review personal attendance history.

**Wireframe:**
```
          │ My Attendance
          │ ┌─────────────────────────────────────┐
          │ │  Today: Not clocked in              │
          │ │         [ Clock In ]                │
          │ └─────────────────────────────────────┘
          │ ┌─────────┐ ┌─────────┐ ┌─────────┐
          │ │ 22 days │ │ 176 hrs │ │ 98%     │
          │ │ present │ │ worked  │ │ rate    │
          │ └─────────┘ └─────────┘ └─────────┘
          │ [Calendar heatmap month view        ]
```

**Animation:** Clock In → ripple + toast slide; status card crossfade  
**Accessibility:** Clock button aria-label includes current state

---

## SB-05: Team Attendance

**Purpose:** Manager view of team presence today.

**Wireframe:** Standard table — Employee, Status pill, Check In, Check Out, Hours, Actions  
**Hover:** Row → correction approve inline for managers  
**Responsive:** Card list with status pill prominent on mobile

---

## SB-06: Tasks — List View

**Purpose:** View and manage tasks grouped by due date.

**Wireframe:**
```
          │ Tasks                    [+ New Task]
          │ [List│Board│Calendar]  [Filter ▾] [Sort ▾]
          │ OVERDUE
          │ □ Fix login bug      ● High   Jul 5   [AV]
          │ TODAY
          │ □ Review PR          ● Med    Jul 7   [AV]
```

**Interactions:** Checkbox complete → optimistic strikethrough animation  
**Hover:** Row actions: edit, delete, move  
**Focus:** Arrow keys move between rows

---

## SB-07: Tasks — Board View

See Section 23 Kanban Design. Full-width horizontal scroll columns.

---

## SB-08: Task Detail

**Purpose:** Full task context — description, subtasks, comments, attachments.

**Wireframe:**
```
          │ ← Back to Project
          │ □ Task title (editable inline)
          │ Description rich text area
          │ Subtasks checklist
          │ Comments thread
          │                    │ Assignee [AV]
          │                    │ Due date
          │                    │ Priority ●
          │                    │ Labels
          │                    │ Attachments
          │                    │ Activity
```

**Spacing:** Main 65%; right panel 360px  
**Animation:** Comment post → slide in from bottom 150ms

---

## SB-09: Calendar

**Purpose:** View and manage events across month/week/day.

**Wireframe:**
```
          │ Calendar              [+ New Event]
          │ [Month│Week│Day│Agenda]
          │ ┌──────┬───────────────────────────────┐
          │ │ Mini │  Mon  Tue  Wed  Thu  Fri     │
          │ │ month│  [event pills in grid]      │
          │ └──────┴───────────────────────────────┘
```

**Interactions:** Click slot → create modal; drag event → reschedule confirm  
**Animation:** Month switch slide horizontal 200ms  
**Accessibility:** Grid role; events aria-label with time + title

---

## SB-10: Teams Directory

**Purpose:** Browse and access team spaces.

**Wireframe:** 3-column card grid — team name, description, member avatars stack, lead name  
**Hover:** Card shadow-md  
**Click:** Navigate to team space

---

## SB-11: Team Space

**Purpose:** Team hub — feed, members, shared tasks and docs.

**Wireframe:**
```
          │ Engineering Team
          │ [Feed│Members│Tasks│Documents]
          │ ┌─────────────────────────────────────┐
          │ │ Post composer                       │
          │ │ Feed items…                         │
          │ └─────────────────────────────────────┘
```

---

## SB-12: Meet Dreams — Full Layout

**Purpose:** Unified chat, audio, and video communication.

**Wireframe:**
```
[Sidebar] │ ┌──────────┬─────────────────────┬──────────────┐
          │ │ SEARCH   │ Sarah Chen    📞 📹 │ Members (8)  │
          │ │ DMs      │                     │ ────────────  │
          │ │ ● Sarah  │ Message bubbles   │ [AV] Alex    │
          │ │   Tom    │                     │ [AV] Jordan  │
          │ │ Channels │                     │ Pinned items │
          │ │ # general│ [Compose message  ] │ Files        │
          │ └──────────┴─────────────────────┴──────────────┘
```

**Visual Hierarchy:** Active conversation bold in list → Thread header → Messages → Composer  
**Spacing:** Col1 280px; Col3 280px toggleable; composer 44px min  
**Hover:** Conversation row → sunken; message → show timestamp  
**Focus:** Composer always reachable via keyboard shortcut  
**Animation:** New message slide-up 150ms; conversation switch crossfade 100ms  
**Responsive:** Mobile: list OR thread OR info (stack navigation)  
**Accessibility:** Message list aria-live polite; call buttons labeled

---

## SB-13: Documents Library

**Purpose:** Organize, upload, and access files.

**Wireframe:**
```
          │ Documents                 [Upload]
          │ ┌─────────┬───────────────────────────────┐
          │ │ Folders │ Name      Modified   Size  ··· │
          │ │ ▶ HR    │ Policy.pdf Jul 1     2MB  ··· │
          │ │ ▶ Legal │                               │
          │ └─────────┴───────────────────────────────┘
```

**Interactions:** Drag file → drop overlay; double-click → viewer  
**Animation:** Upload progress bar; row appears with fade-in  
**Empty:** "Your library is empty" + Upload CTA

---

## SB-14: Document Viewer

**Purpose:** Read documents with version history and AI summary.

**Wireframe:** Top toolbar (back, title, download, share, versions, AI summarize) + full-width viewer area  
**Responsive:** Toolbar collapses to overflow menu on mobile

---

## SB-15: Reports Gallery & Builder

See Section 43. Step wizard for builder; card grid for gallery.

---

## SB-16: Notifications Inbox

**Purpose:** Full notification history with filtering.

**Wireframe:**
```
          │ Notifications            [Mark all read]
          │ [All│Approvals│Tasks│Mentions│System]
          │ TODAY
          │ [icon] Leave request approved     2h
          │ YESTERDAY
          │ [icon] Task assigned to you       1d
```

**Hover:** Item → sunken; quick action buttons appear  
**Animation:** Mark read → unread dot fades 150ms

---

## SB-17: Settings

**Purpose:** Org and personal configuration.

**Wireframe:**
```
          │ ┌─────────────┬───────────────────────────────┐
          │ │ Organization│ Organization Settings         │
          │ │ People      │                               │
          │ │ Security    │  Form sections…               │
          │ │ Integrations│                               │
          │ │ Preferences │         [Save changes]        │
          │ └─────────────┴───────────────────────────────┘
```

**Spacing:** Settings nav 200px; content pad 24px; sticky save bar 56px bottom

---

## SB-18: Profile

See Section 40. Two-column with tabs.

---

## SB-19: AI Assistant Panel

See Section 28. Opens as right panel overlaying any screen.

---

## SB-20: Command Palette & Global Search

See Sections 39 and 38. Modal overlays on any screen.

---

## SB-21: Approval Drawer

**Purpose:** Review and act on pending approvals.

**Wireframe:**
```
                    ┌─────────────────────────┐
                    │ Leave Request · Pending │
                    │ From: Alex Chen         │
                    │ Dates: Jul 14-18        │
                    │ Reason: …               │
                    │ [mini calendar overlay] │
                    │ Note: [________]        │
                    │ [Reject]    [Approve ✓] │
                    └─────────────────────────┘
```

**Animation:** Slide in from right 200ms  
**Approve:** Success animation (checkmark draw 400ms) → drawer closes

---

## SB-22: Automations Hub

**Purpose:** Admin visibility into n8n workflow status.

**Wireframe:** Card grid — workflow name, status pill (Active/Paused/Error), last run, success rate bar  
**Hover:** Card → shadow-md  
**Click:** Drawer with run log

---

# PART III — DESIGN LANGUAGE GUIDE (CONSOLIDATED)

---

## Quick Reference

| Property | Value |
|---|---|
| Brand primary | `#4A7C92` |
| Ink | `#1A1A1B` |
| Canvas | `#FAFAFA` |
| Font | Geist Sans |
| Base radius | 8px (`radius-lg`) |
| Card/widget radius | 12px (`radius-xl`) |
| Default shadow | `shadow-sm` |
| Sidebar | 240px floating, 12px inset |
| Navbar | 56px glass |
| Right panel | 360px |
| Page padding | 24px |
| Max content | 1440px |
| Default transition | 150ms |
| Panel transition | 200ms |
| Brand budget | ≤15% of screen |

---

## Component Decision Tree

```
Need user action?
  ├─ Primary action → Primary Button (one per screen)
  ├─ Secondary → Secondary or Ghost Button
  └─ Destructive → Danger Outline → Confirm Dialog

Need to show data?
  ├─ Tabular → DataTable
  ├─ Cards → Standard Card or Employee Card
  ├─ Stats → Stat Card / Bento Widget
  └─ Visual → Chart (Section 42)

Need user input?
  ├─ Quick → Slide-over (480px)
  ├─ Complex → Full page form
  └─ Confirm → Modal (480px)

Need feedback?
  ├─ Async result → Toast
  ├─ Inline error → Field error text
  ├─ Page failure → Error page
  └─ Loading → Skeleton (never spinner alone)
```

---

## Motion Quick Reference

| Action | Duration | Easing |
|---|---|---|
| Hover | 120ms | ease |
| Press | 100ms | ease-out |
| Page content | 150ms | fade + Y8 |
| Panel | 200ms | spring |
| Modal | 180ms | spring |
| Toast | 200ms | spring |
| Sidebar | 200ms | spring |
| Chart | 600ms | ease-out |
| Skeleton shimmer | 1500ms | linear loop |

---

## Approval Checklist (Design Sign-Off)

- [ ] Visual identity aligns with DreamWeavers logo
- [ ] Meet Dreams differentiated but on-brand
- [ ] All 22 screen blueprints reviewed
- [ ] Motion system approved (subtle, premium)
- [ ] Glassmorphism limited to navbar only
- [ ] Accessibility checklist embedded per screen
- [ ] Responsive behavior defined for all screens
- [ ] Dark theme tokens confirmed
- [ ] Ready for Phase 0 implementation

---

## Document Index

| Part | Contents |
|---|---|
| Part I §1–50 | Design language foundation |
| Part II SB-00–22 | Screen-by-screen blueprints |
| Part III | Consolidated design language guide |

**Related documents:**
- [PRODUCT_DESIGN.md](./PRODUCT_DESIGN.md) — Product flows, IA, journeys
- [UI_GUIDELINES.md](./UI_GUIDELINES.md) — Token reference, component specs

---

*DreamWeavers HRMS — Visual Blueprint v1.0*  
*Awaiting approval before development begins.*
