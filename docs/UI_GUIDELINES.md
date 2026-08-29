# DreamWeavers HRMS — UI Guidelines

Implementation reference for engineers and designers.  
For product flows, IA, and page layouts see [PRODUCT_DESIGN.md](./PRODUCT_DESIGN.md).

| Field | Value |
|---|---|
| **Version** | 1.0 |
| **Status** | Active |
| **Design system** | DWDS (DreamWeavers Design System) |

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Brand Identity](#2-brand-identity)
3. [Design Tokens](#3-design-tokens)
4. [Color Usage Rules](#4-color-usage-rules)
5. [Typography](#5-typography)
6. [Spacing & Layout](#6-spacing--layout)
7. [Elevation & Surfaces](#7-elevation--surfaces)
8. [Border Radius](#8-border-radius)
9. [Icons](#9-icons)
10. [App Shell](#10-app-shell)
11. [Page Structure](#11-page-structure)
12. [Components](#12-components)
13. [Data Tables](#13-data-tables)
14. [Forms](#14-forms)
15. [Feedback & States](#15-feedback--states)
16. [Motion & Transitions](#16-motion--transitions)
17. [Responsive Rules](#17-responsive-rules)
18. [Light & Dark Theme](#18-light--dark-theme)
19. [Accessibility](#19-accessibility)
20. [Anti-Patterns](#20-anti-patterns)

---

## 1. Design Philosophy

DreamWeavers UI should feel like **Linear × Vercel × Apple** — not Bootstrap, not a generic admin template.

### Principles

| # | Principle | Rule |
|---|---|---|
| 1 | **Restraint** | Brand teal on ≤15% of any screen |
| 2 | **Whitespace** | When unsure, add space — never cram |
| 3 | **Hierarchy by weight** | Bold titles, regular body — not rainbow colors |
| 4 | **One pattern** | One table style, one form style, one empty state |
| 5 | **Motion with purpose** | Animate feedback and spatial change — not decoration |
| 6 | **No inline styles** | Tokens and Tailwind utilities only |
| 7 | **No hardcoded values** | Use design tokens everywhere |

### Visual Signature

- Floating sidebar with soft shadow
- Glass navbar (blur + translucent white/dark)
- Bento dashboard widgets
- Premium data tables with hover actions
- Skeleton loading — never naked spinners on pages
- Typography-driven empty states — no clip-art

---

## 2. Brand Identity

Derived from the DreamWeavers logo: slate teal **D**, ink black **W**, white canvas.

```
Logo geometry → UI geometry
  Rounded "D"  →  radius-lg (8px) default
  Sharp "W"    →  clean edges, no excessive rounding
  Bold DREAM   →  font-semibold headings
  Light WEAVERS → font-normal + tracking-wide overlines
```

### Logo Usage

| Context | Treatment |
|---|---|
| Sidebar expanded | Monogram + "DreamWeavers" wordmark |
| Sidebar collapsed | Monogram only, centered |
| Auth pages | Full logo centered on brand panel |
| Favicon | Monogram on white or transparent |
| Empty states | Monogram watermark at 3% opacity (optional) |

**Do not** stretch, recolor the monogram, or place on busy backgrounds.

---

## 3. Design Tokens

All tokens map to CSS custom properties. Prefix: `--dw-`.

### Colors — Brand

```css
--dw-color-brand-primary:         #4A7C92;
--dw-color-brand-primary-hover:     #3D6779;
--dw-color-brand-primary-active:    #325A68;
--dw-color-brand-primary-muted:     #E8F0F3;
--dw-color-brand-primary-subtle:    #F0F5F7;
--dw-color-brand-on-primary:        #FFFFFF;
```

### Colors — Ink

```css
--dw-color-ink-primary:             #1A1A1B;
--dw-color-ink-secondary:           #52525B;
--dw-color-ink-tertiary:            #A1A1AA;
--dw-color-ink-disabled:            #D4D4D8;
```

### Colors — Surface

```css
--dw-color-surface-canvas:          #FAFAFA;
--dw-color-surface-base:            #FFFFFF;
--dw-color-surface-sunken:          #F4F4F5;
--dw-color-surface-overlay:         rgba(255, 255, 255, 0.85);
```

### Colors — Border

```css
--dw-color-border-default:          #E4E4E7;
--dw-color-border-strong:           #D4D4D8;
--dw-color-border-focus:            #4A7C92;
```

### Colors — Semantic

```css
--dw-color-success:                 #16A34A;
--dw-color-success-muted:           #DCFCE7;
--dw-color-warning:                 #CA8A04;
--dw-color-warning-muted:           #FEF9C3;
--dw-color-danger:                  #DC2626;
--dw-color-danger-muted:            #FEE2E2;
--dw-color-info:                    #4A7C92;
```

### Spacing

```css
--dw-space-1:   4px;
--dw-space-2:   8px;
--dw-space-3:   12px;
--dw-space-4:   16px;
--dw-space-5:   20px;
--dw-space-6:   24px;
--dw-space-8:   32px;
--dw-space-10:  40px;
--dw-space-12:  48px;
--dw-space-16:  64px;
```

### Radius

```css
--dw-radius-sm:    4px;
--dw-radius-md:    6px;
--dw-radius-lg:    8px;
--dw-radius-xl:    12px;
--dw-radius-2xl:   16px;
--dw-radius-full:  9999px;
```

### Shadows

```css
--dw-shadow-xs:  0 1px 2px rgba(26, 26, 27, 0.04);
--dw-shadow-sm:  0 1px 3px rgba(26, 26, 27, 0.06), 0 1px 2px rgba(26, 26, 27, 0.04);
--dw-shadow-md:  0 4px 12px rgba(26, 26, 27, 0.08);
--dw-shadow-lg:  0 8px 24px rgba(26, 26, 27, 0.10);
--dw-shadow-xl:  0 16px 48px rgba(26, 26, 27, 0.12);
```

### Z-Index

```css
--dw-z-base:       0;
--dw-z-sticky:     10;
--dw-z-sidebar:    20;
--dw-z-dropdown:   30;
--dw-z-drawer:     40;
--dw-z-modal:      50;
--dw-z-toast:      60;
--dw-z-tooltip:    70;
```

### Motion

```css
--dw-duration-fast:     100ms;
--dw-duration-normal:   150ms;
--dw-duration-slow:     200ms;
--dw-ease-default:      cubic-bezier(0.4, 0, 0.2, 1);
--dw-ease-out:          cubic-bezier(0, 0, 0.2, 1);
--dw-ease-spring:       cubic-bezier(0.32, 0.72, 0, 1);
```

---

## 4. Color Usage Rules

### Do

- Use `brand-primary` for **one** primary CTA per screen
- Use `brand-primary-muted` for selected nav items and active rows
- Use semantic colors **only** for status (success, warning, danger)
- Use `ink-secondary` for descriptions, never primary ink
- Use `surface-canvas` for app background, `surface-base` for cards

### Do Not

- Use brand primary for large background fills
- Use multiple bright colors on one screen
- Use red/green for non-status decoration
- Use pure `#000000` — always `ink-primary` (`#1A1A1B`)
- Use competing accent colors (no separate blue for links — links are brand primary)

### Status Badge Mapping

| Status | Background | Text |
|---|---|---|
| Active / Present / Approved | `success-muted` | `success` |
| Pending / Late | `warning-muted` | `warning` |
| Rejected / Absent / Error | `danger-muted` | `danger` |
| On Leave / Info | `brand-primary-muted` | `brand-primary` |
| Inactive / Draft | `surface-sunken` | `ink-tertiary` |

---

## 5. Typography

**Font stack:** `Geist Sans, Inter, -apple-system, BlinkMacSystemFont, sans-serif`  
**Mono:** `Geist Mono, ui-monospace, monospace`

### Scale

| Token | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| `display-lg` | 36px | 600 | 1.2 | Auth headlines |
| `display-sm` | 28px | 600 | 1.25 | Dashboard greeting |
| `heading-lg` | 24px | 600 | 1.3 | Page title |
| `heading-md` | 18px | 600 | 1.4 | Section title |
| `heading-sm` | 15px | 600 | 1.4 | Card title |
| `body-lg` | 15px | 400 | 1.6 | Emphasis body |
| `body-md` | 14px | 400 | 1.5 | Default UI text |
| `body-sm` | 13px | 400 | 1.5 | Secondary text |
| `label-md` | 13px | 500 | 1.4 | Form labels |
| `label-sm` | 12px | 500 | 1.4 | Badges, chips |
| `caption` | 12px | 400 | 1.4 | Timestamps |
| `overline` | 11px | 500 | 1.4 | Section labels (tracking: 0.08em) |

### Rules

- Page title: `heading-lg`, one per page
- Card title: `heading-sm`
- Never below 12px for readable content
- Use `tabular-nums` on all numbers, dates, times, tables
- Truncate long text with ellipsis; show full text in tooltip
- Links: `body-md`, `brand-primary`, underline on hover only

---

## 6. Spacing & Layout

### Page Layout

```
┌─────────┬──────────────────────────────────────────┐
│ Sidebar │  Navbar (56px, sticky)                   │
│ 240px   ├──────────────────────────────────────────┤
│ floating│  Page padding: 24px                     │
│ 12px    │  Max content width: 1440px (centered)   │
│ inset   │  Section gap: 32px                      │
└─────────┴──────────────────────────────────────────┘
```

### Spacing Reference

| Element | Padding / Gap |
|---|---|
| Page container | `space-6` (24px) |
| Card internal | `space-5` (20px) |
| Card grid (bento) | `space-4` (16px) gap |
| Form fields | `space-4` (16px) vertical gap |
| Button groups | `space-2` (8px) gap |
| Section headers → content | `space-4` (16px) |
| Sidebar nav items | 40px height, `space-3` horizontal |
| Table cell | `space-3` vertical, `space-4` horizontal |

### Grid

| Context | Columns |
|---|---|
| Dashboard stat row | 4 (desktop), 2 (tablet), 1 (mobile) |
| Bento content row | 2 equal columns |
| Project cards | 3 (desktop), 2 (tablet), 1 (mobile) |
| Team cards | 3 (desktop), 2 (tablet), 1 (mobile) |

---

## 7. Elevation & Surfaces

### Surface Hierarchy

| Level | Token | Use |
|---|---|---|
| 0 — Canvas | `surface-canvas` | App background |
| 1 — Base | `surface-base` + `shadow-sm` | Cards, inputs |
| 2 — Floating | `surface-base` + `shadow-md` | Sidebar, dropdowns |
| 3 — Overlay | `surface-base` + `shadow-lg` | Modals, command palette |
| 4 — Top | `surface-base` + `shadow-xl` | Full-screen overlays |

### Glass Navbar

```css
background: var(--dw-color-surface-overlay);
backdrop-filter: blur(16px);
border-bottom: 1px solid var(--dw-color-border-default);
```

Dark mode: `rgba(24, 24, 27, 0.80)` + `blur(12px)`.

### Floating Sidebar

```css
background: var(--dw-color-surface-base);
border-radius: var(--dw-radius-xl);
box-shadow: var(--dw-shadow-md);
margin: 12px;
opacity: 0.98;
```

---

## 8. Border Radius

| Component | Radius |
|---|---|
| Buttons, inputs | `radius-md` (6px) |
| Cards, dropdowns | `radius-lg` (8px) |
| Modals, sidebar, bento widgets | `radius-xl` (12px) |
| Auth form card | `radius-2xl` (16px) |
| Badges, pills | `radius-full` |
| Avatars | `radius-full` |

**Never** mix radius sizes within the same component group.

---

## 9. Icons

**Library:** Lucide Icons (1.5px stroke default)

| Context | Size | Color |
|---|---|---|
| Inline with text | 16px | Match text color |
| Buttons, nav | 18px | `ink-secondary` default |
| Active nav | 18px | `brand-primary` |
| Empty state | 48px | `ink-tertiary` |
| Stat card icon | 20px in 36px container | `brand-primary` |

### Icon Container (stat cards, active nav)

```
36×36px, radius-lg, background: brand-primary-subtle, icon: brand-primary
```

Icon-only buttons **must** have `aria-label`. Decorative icons: `aria-hidden="true"`.

---

## 10. App Shell

### Floating Sidebar

| Property | Value |
|---|---|
| Expanded width | 240px |
| Collapsed width | 64px |
| Position | Fixed, 12px inset top/left/bottom |
| Z-index | `z-sidebar` (20) |

**Nav item states:**

| State | Background | Text | Icon |
|---|---|---|---|
| Default | transparent | `ink-secondary` | `ink-secondary` |
| Hover | `surface-sunken` | `ink-primary` | `ink-primary` |
| Active | `brand-primary-muted` | `brand-primary` | `brand-primary` |

Unread badge: `brand-primary` pill, white text, min-width 18px, `label-sm`.

### Glass Navbar

| Property | Value |
|---|---|
| Height | 56px |
| Position | Sticky top, `z-sticky` |
| Contents | Breadcrumbs · contextual title · actions · bell · AI trigger |

### Right Panel

| Property | Value |
|---|---|
| Width | 360px default |
| Behavior | Push layout on desktop; overlay on tablet/mobile |
| Z-index | `z-drawer` (40) |
| Use for | AI assistant, approvals, entity preview, activity |

---

## 11. Page Structure

Every authenticated page follows this order:

```
1. GlassNavbar
2. PageHeader
     - Title (heading-lg)
     - Description (body-md, ink-secondary) — optional
     - Primary action (right-aligned)
     - Secondary actions (dropdown or button group)
3. FilterBar — optional, for list/table pages
4. PageContent
5. RightPanel — optional
```

### PageHeader Rules

- **One** primary button (brand primary, filled)
- Secondary actions: ghost or outline buttons
- Destructive actions: never in PageHeader — use row menus or confirm dialogs
- Breadcrumbs above title when depth > 1

### Auth Pages

Split layout 50/50:

| Left | Right |
|---|---|
| Brand panel: logo, tagline, geometric pattern in brand teal at 5% opacity | Centered form card, max-width 400px, `radius-2xl`, `shadow-lg` |

---

## 12. Components

### Buttons

| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| Primary | `brand-primary` | white | none | One per screen |
| Secondary | transparent | `ink-primary` | `border-default` | Secondary actions |
| Ghost | transparent | `ink-secondary` | none | Tertiary, toolbar |
| Danger | `danger` | white | none | Delete, reject |
| Danger outline | transparent | `danger` | `danger` at 30% | Caution actions |

| Size | Height | Padding | Font |
|---|---|---|---|
| sm | 32px | 12px horizontal | `label-sm` |
| md | 36px | 16px horizontal | `label-md` |
| lg | 40px | 20px horizontal | `body-md` |

Loading: spinner replaces label, button width preserved, disabled.

### Cards

```css
background: surface-base;
border: 1px solid border-default;
border-radius: radius-lg;
padding: space-5;
box-shadow: shadow-sm;
```

Hover (interactive cards only): `shadow-md` at 150ms. **No scale transform** on data cards.

### Bento Widget

```css
border-radius: radius-xl;
padding: space-5;
min-height: 120px; /* stat widgets */
min-height: 240px; /* chart/list widgets */
```

Widget header: `heading-sm` title + optional "View all" ghost link (`body-sm`).

### Badges & Pills

Height 22px, padding 8px horizontal, `radius-full`, `label-sm`.

### Avatars

| Size | Dimensions | Use |
|---|---|---|
| xs | 24px | Inline mentions |
| sm | 32px | Table rows |
| md | 40px | Sidebar user, cards |
| lg | 64px | Profile header |
| xl | 96px | Profile page |

Fallback: initials on `brand-primary-muted` background, `brand-primary` text.

### Avatar Stack

Overlap −8px, max 4 visible + "+N" overflow badge.

### Modals

| Property | Value |
|---|---|
| Max width | 480px (forms), 560px (command palette), 640px (search) |
| Radius | `radius-xl` |
| Shadow | `shadow-lg` |
| Backdrop | black 40% opacity |
| Padding | `space-6` |

### Slide-Overs

| Property | Value |
|---|---|
| Width | 480px default |
| Direction | Right |
| Mobile | Bottom sheet, full width |

### Toasts

| Property | Value |
|---|---|
| Position | Bottom-right, 24px inset |
| Width | 360px max |
| Duration | 5s default; 8s with action |
| Z-index | `z-toast` |

Variants: default (dark ink bg), success, warning, danger. Include optional action button and dismiss.

### Command Palette

| Property | Value |
|---|---|
| Width | 560px |
| Max height | 420px |
| Input height | 48px |
| Result row height | 40px |
| Active result | `brand-primary-muted` background |

---

## 13. Data Tables

Premium tables — not spreadsheet clones.

### Structure

```
┌─ Toolbar (search, filters, column toggle, export) ─────────────┐
├─ Header row (surface-sunken bg, label-sm, ink-secondary) ─────┤
├─ Data rows (body-md, 48px min-height) ──────────────────────────┤
├─ Hover row (surface-sunken bg + inline actions fade in) ────────┤
└─ Footer (pagination, row count, page size) ─────────────────────┘
```

### Row Rules

- Avatar + name in first column for people tables
- Status as badge pill, never raw text
- Dates: relative for recent ("2h ago"), absolute for older ("Jul 3, 2026")
- Inline actions appear on row hover (right side): edit, delete, view
- Selected row: `brand-primary-muted` background
- Sticky header on scroll
- Sort indicator: chevron icon, `brand-primary` when active

### Mobile

Switch to card list OR horizontal scroll with sticky first column. Never hide critical columns without access via expand.

---

## 14. Forms

### Field Anatomy

```
Label (label-md, ink-primary)
Input (36px height, radius-md, border-default)
Hint text (caption, ink-tertiary) — optional
Error text (caption, danger) — when invalid
```

### Input States

| State | Border | Background |
|---|---|---|
| Default | `border-default` | `surface-base` |
| Hover | `border-strong` | `surface-base` |
| Focus | `border-focus` + 2px focus ring at 20% brand opacity | `surface-base` |
| Error | `danger` | `danger-muted` at 30% |
| Disabled | `border-default` | `surface-sunken` |

### Form Layout

- Single column default, max-width 480px
- Two columns only for short paired fields (first name / last name)
- Section headings: `heading-md` with `space-8` above
- Sticky save bar at bottom when editing long forms
- Unsaved changes: confirm dialog on navigate away

---

## 15. Feedback & States

### Loading

| Context | Pattern |
|---|---|
| Page first load | Full-page skeleton matching layout |
| Table refresh | Skeleton rows (3–5) |
| Widget | Skeleton card in bento slot |
| Button action | Inline spinner in button |
| Background fetch | 2px top progress bar, brand primary |
| Upload | Progress bar in file row |

Debounce skeleton for requests <200ms.

### Empty States

```
Overline (overline, ink-tertiary)
Heading (heading-md, ink-primary)
Description (body-md, ink-secondary, max-width 360px, centered)
Primary CTA button
```

No illustrations. Optional monogram watermark at 3% opacity behind content.

### Error States

| Level | UI |
|---|---|
| Field | Inline caption below field, danger color |
| Form | Toast (danger) + preserve form data |
| Widget | Error card with message + Retry button |
| Page | Centered: heading + description + Retry + support link |
| Offline | Persistent banner below navbar |

---

## 16. Motion & Transitions

### Duration & Easing

| Interaction | Duration | Easing |
|---|---|---|
| Hover/focus | 120ms | ease |
| Toggle/checkbox | 100ms | ease-out |
| Panel slide | 200ms | spring curve |
| Modal enter | 180ms | spring (stiffness 400, damping 30) |
| Page content enter | 150ms | fade + translateY(8px) |
| Toast | 200ms in, 150ms out | ease-out / ease-in |
| List stagger | 30ms per item | max 10 items |

### Do Not Animate

- Table data updates
- Pagination changes
- Filter toggles
- Number/count changes

### Reduced Motion

When `prefers-reduced-motion: reduce`: all transitions ≤100ms, opacity only, no translate/scale.

---

## 17. Responsive Rules

### Breakpoints

| Name | Min width | Layout |
|---|---|---|
| `sm` | 640px | Mobile adaptations |
| `md` | 768px | — |
| `lg` | 1024px | Desktop layout begins |
| `xl` | 1280px | — |
| `2xl` | 1440px | Max content width |

### Adaptation Summary

| Element | Desktop | Tablet | Mobile |
|---|---|---|---|
| Sidebar | Expanded 240px | Collapsed 64px | Off-canvas drawer |
| Navbar | Full | Full | Compact, hamburger |
| Right panel | Push 360px | Overlay | Bottom sheet |
| Bottom nav | Hidden | Hidden | 5 tabs |
| Command palette | 560px modal | 560px modal | Full screen |
| Bento grid | 4 col | 2 col | 1 col |
| Tables | Full | Horizontal scroll | Card list |
| Touch targets | — | 44px min | 44px min |

---

## 18. Light & Dark Theme

### Light (default)

| Token | Value |
|---|---|
| Canvas | `#FAFAFA` |
| Base | `#FFFFFF` |
| Ink primary | `#1A1A1B` |

### Dark

| Token | Value |
|---|---|
| Canvas | `#0F0F10` |
| Base | `#18181B` |
| Sunken | `#27272A` |
| Ink primary | `#FAFAFA` |
| Ink secondary | `#A1A1AA` |
| Border | `#3F3F46` |
| Brand primary | `#5B8FA3` (lighter for contrast) |
| Shadow | `rgba(0, 0, 0, 0.4)` |

### Theme Switch

- Options: System / Light / Dark
- Location: Profile → Preferences
- Transition: 200ms on color properties only
- Persist per user

Semantic colors in dark mode: use muted background + bright text (not saturated fills).

---

## 19. Accessibility

**Target:** WCAG 2.1 AA

### Checklist (every PR)

- [ ] Color contrast ≥ 4.5:1 for body text
- [ ] Focus ring visible on all interactives
- [ ] All icon buttons have `aria-label`
- [ ] Form fields have associated labels
- [ ] Error messages linked via `aria-describedby`
- [ ] Images/avatars have alt text
- [ ] Tables use `<th scope="col/row">`
- [ ] Modals trap focus and restore on close
- [ ] Toasts use `role="status"` or `aria-live="polite"`
- [ ] Skip-to-content link present
- [ ] `prefers-reduced-motion` respected
- [ ] Keyboard: all actions reachable without mouse

### Focus Ring

```css
outline: 2px solid var(--dw-color-brand-primary);
outline-offset: 2px;
```

---

## 20. Anti-Patterns

**Never do these:**

| Anti-pattern | Why | Instead |
|---|---|---|
| Bootstrap / AdminLTE look | Generic, not premium | Follow DWDS tokens |
| Inline `style={{}}` | Unmaintainable | Tailwind + tokens |
| Hardcoded hex in components | Breaks theming | CSS custom properties |
| Multiple primary buttons | Confuses hierarchy | One primary per screen |
| Centered page spinner | Feels broken | Skeleton layout |
| Clip-art empty states | Cheap | Typography + CTA |
| Duplicate components per module | Unmaintainable | Shared primitives |
| Bright colored sidebar | Overwhelming | White/dark base + teal accent |
| Scale transform on data cards | Distracting | Shadow lift only |
| Raw `<table>` without component | Inconsistent | Shared `DataTable` |
| Modal for full entity detail | Breaks context | Main canvas or slide-over |
| Generic blue links | Off-brand | Brand primary |
| Toast for every action | Noisy | Toast for async results only |
| Animating table rows on sort | Jarring | Instant swap |

---

## Quick Reference Card

```
Brand:     #4A7C92
Ink:       #1A1A1B
Canvas:    #FAFAFA
Font:      Geist Sans
Radius:    8px default, 12px cards/sidebar
Shadow:    Soft, single-layer
Sidebar:   240px floating, 12px inset
Navbar:    56px glass
Panel:     360px right
Page pad:  24px
Max width: 1440px
Motion:    150ms default
```

---

*For workflows, IA, and page-by-page layouts → [PRODUCT_DESIGN.md](./PRODUCT_DESIGN.md)*
