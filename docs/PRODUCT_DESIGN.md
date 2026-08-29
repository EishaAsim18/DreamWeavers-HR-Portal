# DreamWeavers HRMS
## Complete Product Design Document

| Field | Value |
|---|---|
| **Version** | 1.0 |
| **Status** | Awaiting approval before development |
| **Audience** | Product, Design, Engineering, QA |
| **Brand** | DreamWeavers — Slate Teal `#4A7C92`, Ink `#1A1A1B`, White canvas |

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Information Architecture](#2-information-architecture)
3. [User Flow](#3-user-flow)
4. [Admin User Journey](#4-admin-user-journey)
5. [Employee User Journey](#5-employee-user-journey)
6. [Navigation Structure](#6-navigation-structure)
7. [Sidebar Structure](#7-sidebar-structure)
8. [Dashboard Layout](#8-dashboard-layout)
9. [Every Page Layout](#9-every-page-layout)
10. [Component Hierarchy](#10-component-hierarchy)
11. [Reusable Components](#11-reusable-components)
12. [Design System](#12-design-system)
13. [Color Palette](#13-color-palette)
14. [Typography](#14-typography)
15. [Spacing System](#15-spacing-system)
16. [Border Radius](#16-border-radius)
17. [Shadows](#17-shadows)
18. [Icons](#18-icons)
19. [Animation Guidelines](#19-animation-guidelines)
20. [Transition Guidelines](#20-transition-guidelines)
21. [Responsive Strategy](#21-responsive-strategy)
22. [Mobile Layout](#22-mobile-layout)
23. [Tablet Layout](#23-tablet-layout)
24. [Desktop Layout](#24-desktop-layout)
25. [Accessibility Guidelines](#25-accessibility-guidelines)
26. [Dark Theme](#26-dark-theme)
27. [Light Theme](#27-light-theme)
28. [Design Tokens](#28-design-tokens)
29. [Interaction Principles](#29-interaction-principles)
30. [UX Improvements](#30-ux-improvements)
31. [Loading States](#31-loading-states)
32. [Empty States](#32-empty-states)
33. [Error States](#33-error-states)
34. [Notification System](#34-notification-system)
35. [Command Palette (Ctrl + K)](#35-command-palette-ctrl--k)
36. [Global Search](#36-global-search)
37. [AI Assistant Layout](#37-ai-assistant-layout)
38. [Meet Dreams Layout](#38-meet-dreams-layout)
39. [Task Workflow](#39-task-workflow)
40. [Calendar Workflow](#40-calendar-workflow)
41. [Attendance Workflow](#41-attendance-workflow)
42. [Approval Workflow](#42-approval-workflow)
43. [File Upload UX](#43-file-upload-ux)
44. [Reports UX](#44-reports-ux)
45. [Future Scalability Considerations](#45-future-scalability-considerations)

---

## 1. Product Vision

DreamWeavers HRMS is the **operating system for how people work together** inside a company. It replaces fragmented tools — HRIS, task trackers, calendars, chat, video, document storage, reporting — with one premium, calm, fast application that employees open every morning and keep open all day.

**North star:** *"Work should feel as refined as the tools we choose in our personal lives."*

### Core Beliefs

| Belief | Expression in Product |
|---|---|
| One surface, many modes | HR, productivity, and communication share one shell |
| Context over navigation | Command palette, search, and AI surface what users need |
| Respect attention | Notifications are actionable, grouped, and deferrable |
| Trust through clarity | Approvals, attendance, and documents show state, actor, and timestamp |
| Premium is restraint | One accent color, generous whitespace, motion with purpose |

### Primary Personas

- **Admin / HR Lead** — configures org, manages employees, runs reports, owns compliance
- **Manager** — approves requests, monitors team attendance, assigns work, runs meetings
- **Employee** — daily tasks, clock in/out, calendar, chat, documents, AI help
- **Executive (future)** — read-only dashboards, high-level reports

### Differentiators

- Bento-style dashboard that adapts to role
- Meet Dreams: chat + voice + video in one thread
- Gemini AI as contextual copilot, not a floating gimmick
- n8n automations visible to admins, invisible to employees

---

## 2. Information Architecture

```
DreamWeavers HRMS
│
├── Public (unauthenticated)
│   ├── Login
│   ├── Forgot Password
│   ├── Reset Password
│   └── Accept Invite
│
└── Application (authenticated)
    │
    ├── Home
    │   └── Dashboard
    │
    ├── People
    │   ├── Employees
    │   │   ├── Directory (list)
    │   │   ├── Employee Profile
    │   │   └── Onboarding Pipeline
    │   └── Teams
    │       ├── Team Directory
    │       └── Team Space
    │
    ├── Work
    │   ├── Tasks
    │   │   ├── My Tasks
    │   │   ├── Projects
    │   │   └── Task Detail
    │   ├── Calendar
    │   │   ├── Month / Week / Day
    │   │   └── Event Detail
    │   └── Meet Dreams
    │       ├── Conversations (DM + channels)
    │       ├── Call / Meeting Room
    │       └── Meeting History
    │
    ├── HR
    │   ├── Attendance
    │   │   ├── My Attendance
    │   │   ├── Team Attendance (manager+)
    │   │   └── Attendance Reports
    │   └── Documents
    │       ├── Library
    │       ├── Shared with Me
    │       ├── Team Folders
    │       └── Document Viewer
    │
    ├── Insights
    │   └── Reports
    │       ├── Report Gallery
    │       ├── Report Builder
    │       └── Scheduled Reports
    │
    ├── System
    │   ├── Notifications (inbox)
    │   ├── Automations (n8n status)
    │   └── Settings
    │       ├── Organization
    │       ├── Departments & Roles
    │       ├── Integrations
    │       ├── Notification Preferences
    │       └── Audit Log
    │
    └── Account
        └── Profile
```

### Global Overlays (not routes)

- Command Palette (`Ctrl/Cmd + K`)
- Global Search
- AI Assistant panel
- Notification drawer
- Quick actions (clock in, new task, schedule meeting)

---

## 3. User Flow

### First-time Org Setup (Admin)

```
Invite email → Accept Invite → Set password → Org wizard
  → Company profile → Departments → Import employees (optional)
  → Default roles → Enable modules → Land on Admin Dashboard
```

### Daily Employee Flow

```
Login → Dashboard (personalized bento)
  → Clock in (attendance widget OR command palette)
  → Check tasks / calendar
  → Meet Dreams chat for standup
  → Complete tasks, upload documents
  → Clock out → Review notifications
```

### Manager Approval Flow

```
Notification: "Leave request from Alex"
  → Click → Approval drawer
  → Review details + team calendar overlay
  → Approve / Reject + note
  → Employee notified → Calendar updated → n8n optional follow-up
```

### Hire to Productive Flow

```
HR creates employee → Invite sent → Employee onboarded
  → n8n: onboarding task list created
  → Documents assigned → Team space auto-joined
  → First-day calendar events appear
```

---

## 4. Admin User Journey

| Stage | Goal | Key Screens | Emotional Target |
|---|---|---|---|
| Setup | Configure org | Settings → Organization, Roles | Confident, in control |
| Populate | Add employees | Employees → Directory → Add / Import | Efficient |
| Govern | Policies & access | Settings → Roles, Audit Log | Secure, transparent |
| Monitor | Org health | Dashboard (admin bento), Reports | Informed at a glance |
| Automate | Reduce manual work | Automations, Integrations | Powerful but simple |
| Maintain | Ongoing HR ops | Attendance reports, Documents | Routine feels effortless |

**Admin dashboard priorities:** headcount, attendance summary, pending approvals, recent hires, automation health, document expiry alerts.

**Mental model:** *Control center* — dense information acceptable if scannable.

---

## 5. Employee User Journey

| Stage | Goal | Key Screens | Emotional Target |
|---|---|---|---|
| Arrive | Orient for the day | Dashboard, Calendar widget | Calm, clear priorities |
| Check in | Record attendance | Attendance or dashboard widget | One tap, done |
| Execute | Do work | Tasks, Meet Dreams, Documents | Focused |
| Collaborate | Sync with team | Teams, Meet Dreams, Calendar | Connected |
| Resolve | Handle requests | Notifications, AI Assistant | Fast answers |
| Close | End day | Clock out, review tomorrow | Satisfying closure |

**Mental model:** *My workspace* — personal first; org-wide data read-only unless role allows.

---

## 6. Navigation Structure

### Three-Tier Model

| Tier | Location | Purpose |
|---|---|---|
| Primary | Floating sidebar | Module switching |
| Secondary | In-page tabs / sub-nav | Views within module |
| Tertiary | Breadcrumbs + context header | Depth within entity |

### Rules

- Maximum 2 clicks to any top-level module
- Entity detail opens in main canvas (not modal) except quick previews
- Back navigation preserves scroll and filter state
- Active module highlighted in sidebar; sub-view in page tabs
- Mobile: bottom tab bar + hamburger for overflow

---

## 7. Sidebar Structure

**Floating sidebar** — 12px inset, rounded container, soft shadow, 98% opacity surface.

```
┌─────────────────────────┐
│  [DW Monogram]          │
│  DreamWeavers           │
├─────────────────────────┤
│  ⌘K  Quick search       │
├─────────────────────────┤
│  ◈  Dashboard           │
│  ◈  Employees           │  ← Admin/HR only
│  ◈  Attendance          │
│  ◈  Tasks               │
│  ◈  Calendar            │
│  ◈  Teams               │
│  ◈  Meet Dreams    ●3   │
│  ◈  Documents           │
│  ◈  Reports             │  ← Manager+
├─────────────────────────┤
│  ◈  Automations         │  ← Admin only
│  ◈  Settings            │
├─────────────────────────┤
│  [Avatar] Name          │  → Profile
│  ◈ Notifications        │
│  ✦ AI Assistant         │
└─────────────────────────┘
```

| Property | Value |
|---|---|
| Expanded width | 240px |
| Collapsed width | 64px |
| Pin/collapse | Bottom toggle, state persisted per user |

---

## 8. Dashboard Layout

**Bento grid** — role-aware widgets on `surface-canvas` background.

### Admin / HR Dashboard

```
┌──────────────────────────────────────────────────────────────────┐
│  Glass Navbar: Greeting · Date · [Clock In] [+ New ▾] · 🔔 · AI │
├──────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐ │
│  │ Headcount   │ │ Present     │ │ Pending     │ │ New Hires  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘ │
│  ┌────────────────────────────┐ ┌─────────────────────────────┐ │
│  │ Attendance Trend           │ │ Approval Queue              │ │
│  └────────────────────────────┘ └─────────────────────────────┘ │
│  ┌────────────────────────────┐ ┌─────────────────────────────┐ │
│  │ Upcoming Events            │ │ Document Expiry Alerts      │ │
│  └────────────────────────────┘ └─────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

### Employee Dashboard

```
┌──────────────────────────────────────────────────────────────────┐
│  Good morning, Sarah · Tue, Jul 7                                │
├──────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ │
│  │ Attendance       │ │ Today's Tasks    │ │ Calendar Today   │ │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘ │
│  ┌──────────────────────────────┐ ┌────────────────────────────┐│
│  │ My Tasks                     │ │ Meet Dreams Recent         ││
│  └──────────────────────────────┘ └────────────────────────────┘│
│  ┌──────────────────────────────┐                               │
│  │ Leave Balance + Quick Request│                               │
│  └──────────────────────────────┘                               │
└──────────────────────────────────────────────────────────────────┘
```

Each widget has independent skeleton, empty, and error states.

---

## 9. Every Page Layout

**Standard page anatomy:**

```
[Floating Sidebar] | [Main Column]
                     ├─ Glass Navbar (sticky, 56px)
                     ├─ Page Header (title, description, actions)
                     ├─ Optional Filter Bar
                     ├─ Content Area
                     └─ Optional Right Panel (360px)
```

### Authentication

| Page | Layout |
|---|---|
| Login | Split: left 50% brand panel; right 50% form card |
| Forgot Password | Same shell; email field + submit |
| Reset Password | Password + confirm with strength indicator |
| Accept Invite | Name + password; shows org name and inviter |

### Employee Management

| Page | Layout |
|---|---|
| Directory | Header + filter bar + premium data table + pagination |
| Employee Profile | Left 320px profile card; right tabbed content |
| Add Employee | 480px slide-over from right |
| Onboarding Pipeline | Kanban: Invited → In Progress → Complete |

### Attendance

| Page | Layout |
|---|---|
| My Attendance | Today status card + monthly heatmap + stats |
| Team Attendance | Date picker + filters + team table |
| Detail | Drawer: punch timeline, correction form |

### Tasks

| Page | Layout |
|---|---|
| My Tasks | List / Board / Calendar switcher + filters |
| Projects | Card grid with progress ring and avatars |
| Project Detail | Header + view switcher + tasks |
| Task Detail | Main content + right panel (assignee, dates, activity) |

### Calendar

| Page | Layout |
|---|---|
| Main | Left mini-month (240px) + calendar grid |
| Event Detail | Popover (quick) or side panel (detailed) |
| Create Event | 480px modal with attendees picker |

### Teams

| Page | Layout |
|---|---|
| Directory | Searchable card grid |
| Team Space | Left nav (240px) + main feed/tasks content |

### Documents

| Page | Layout |
|---|---|
| Library | Folder tree (240px) + file table/grid |
| Viewer | Full-width with toolbar (download, share, versions, AI) |
| Shared with Me | Flat table by shared date |

### Notifications

| Page | Layout |
|---|---|
| Inbox | Tabs: All, Approvals, Tasks, Mentions, System |
| Drawer | 400px from right; last 20 items + "View all" |

### Settings

| Page | Layout |
|---|---|
| Shell | Left settings nav (200px) + content pane |
| Sub-pages | Section cards, sticky save bar on edit |

### Profile

| Page | Layout |
|---|---|
| My Profile | Two-column editable; tabs: Personal, Security, Preferences, Sessions |

---

## 10. Component Hierarchy

```
App
└── AppShell
    ├── FloatingSidebar
    │   ├── SidebarLogo
    │   ├── SidebarSearchTrigger
    │   ├── SidebarNav → SidebarNavItem[]
    │   └── SidebarFooter (UserMenu, CollapseToggle)
    │
    ├── MainLayout
    │   ├── GlassNavbar (Breadcrumbs, Actions, NotificationTrigger, AITrigger)
    │   ├── PageContainer
    │   │   ├── PageHeader
    │   │   ├── FilterBar (optional)
    │   │   └── PageContent → [Module composition]
    │   └── RightPanel (AI, Approval, Preview, Activity)
    │
    └── GlobalOverlays
        ├── CommandPalette
        ├── GlobalSearchModal
        ├── ToastViewport
        ├── ConfirmDialog
        └── FullScreenLoader (auth only)
```

---

## 11. Reusable Components

### Shell & Navigation
`AppShell`, `FloatingSidebar`, `GlassNavbar`, `PageHeader`, `PageContainer`, `Breadcrumbs`, `RightPanel`, `SlideOver`, `Modal`, `BottomSheet`

### Data Display
`DataTable`, `StatCard`, `BentoGrid`, `BentoWidget`, `EmptyState`, `StatusBadge`, `Avatar`, `AvatarStack`, `UserCell`, `Timeline`, `ActivityFeed`, `ProgressRing`, `CalendarHeatmap`

### Forms & Input
`FormField`, `TextInput`, `Select`, `Combobox`, `DatePicker`, `DateRangePicker`, `FileUpload`, `RichTextEditor`, `SearchInput`

### Feedback
`Skeleton`, `SkeletonTable`, `Toast`, `Alert`, `InlineError`, `ErrorBoundary`

### Actions
`Button`, `IconButton`, `DropdownMenu`, `ContextMenu`, `ConfirmButton`

### Communication
`CommentThread`, `MessageBubble`, `MessageComposer`, `TypingIndicator`, `PresenceDot`, `NotificationItem`, `CallControls`

### Specialized
`CommandPalette`, `GlobalSearch`, `ApprovalCard`, `AttendanceClock`, `TaskBoard`, `FolderTree`, `VideoTile`

**Rule:** No duplicate components — use `UserCell` everywhere, not separate employee/team variants.

---

## 12. Design System

**Name:** DreamWeavers Design System (DWDS)

**Foundation:** shadcn/ui primitives, fully restyled

| Principle | Description |
|---|---|
| Restraint | Brand teal on ≤15% of any screen |
| Hierarchy through weight | Bold primary, light secondary (logo pattern) |
| Consistency | One table, form, and empty state pattern |
| Motion as feedback | Not decoration |
| Accessible by default | Not retrofitted |

**Component states:** default, hover, active, focus-visible, disabled, loading

---

## 13. Color Palette

### Brand Core

| Name | Hex | Usage |
|---|---|---|
| Brand Primary | `#4A7C92` | Primary buttons, active nav, focus rings |
| Brand Primary Hover | `#3D6779` | Hover |
| Brand Primary Active | `#325A68` | Pressed |
| Brand Primary Muted | `#E8F0F3` | Selected rows, tags |
| Brand Primary Subtle | `#F0F5F7` | Section backgrounds |
| Brand On-Primary | `#FFFFFF` | Text on brand surfaces |

### Neutrals (Light)

| Name | Hex | Usage |
|---|---|---|
| Ink Primary | `#1A1A1B` | Headings |
| Ink Secondary | `#52525B` | Body |
| Ink Tertiary | `#A1A1AA` | Meta, placeholders |
| Surface Canvas | `#FAFAFA` | App background |
| Surface Base | `#FFFFFF` | Cards, sidebar |
| Surface Sunken | `#F4F4F5` | Table headers |
| Border Default | `#E4E4E7` | Dividers |
| Border Strong | `#D4D4D8` | Emphasis |

### Semantic

| Name | Hex | Usage |
|---|---|---|
| Success | `#16A34A` | Approved, present |
| Success Muted | `#DCFCE7` | Backgrounds |
| Warning | `#CA8A04` | Pending, late |
| Warning Muted | `#FEF9C3` | Backgrounds |
| Danger | `#DC2626` | Rejected, error |
| Danger Muted | `#FEE2E2` | Backgrounds |
| Info | `#4A7C92` | Same as brand |

---

## 14. Typography

**Primary:** Geist Sans  
**Monospace:** Geist Mono  
**Fallback:** `Geist Sans, Inter, -apple-system, BlinkMacSystemFont, sans-serif`

| Token | Size | Weight | Usage |
|---|---|---|---|
| display-lg | 36px | 600 | Auth headlines |
| display-sm | 28px | 600 | Dashboard greeting |
| heading-lg | 24px | 600 | Page titles |
| heading-md | 18px | 600 | Section headers |
| heading-sm | 15px | 600 | Card titles |
| body-lg | 15px | 400 | Primary body |
| body-md | 14px | 400 | Default UI |
| body-sm | 13px | 400 | Secondary |
| label-md | 13px | 500 | Form labels |
| label-sm | 12px | 500 | Badges |
| caption | 12px | 400 | Timestamps |
| overline | 11px | 500 | Section overlines (0.08em tracking) |

All tables, stats, and clocks use `tabular-nums`.

---

## 15. Spacing System

**Base unit:** 4px

| Token | Value |
|---|---|
| space-1 | 4px |
| space-2 | 8px |
| space-3 | 12px |
| space-4 | 16px |
| space-5 | 20px |
| space-6 | 24px |
| space-8 | 32px |
| space-10 | 40px |
| space-12 | 48px |
| space-16 | 64px |

| Context | Spacing |
|---|---|
| Page padding | 24px desktop, 16px mobile |
| Card padding | 20px |
| Form field gap | 16px |
| Section gap | 32px |
| Bento grid gap | 16px |

---

## 16. Border Radius

| Token | Value | Usage |
|---|---|---|
| radius-sm | 4px | Badges |
| radius-md | 6px | Inputs, buttons |
| radius-lg | 8px | Cards, dropdowns |
| radius-xl | 12px | Modals, sidebar, bento widgets |
| radius-2xl | 16px | Auth cards |
| radius-full | 9999px | Avatars, pills |

---

## 17. Shadows

| Token | Value | Usage |
|---|---|---|
| shadow-xs | `0 1px 2px rgba(26,26,27,0.04)` | Inputs |
| shadow-sm | `0 1px 3px rgba(26,26,27,0.06)` | Cards |
| shadow-md | `0 4px 12px rgba(26,26,27,0.08)` | Sidebar, dropdowns |
| shadow-lg | `0 8px 24px rgba(26,26,27,0.10)` | Modals, command palette |
| shadow-xl | `0 16px 48px rgba(26,26,27,0.12)` | Full-screen overlays |

Hover lift: cards add `shadow-md` at 150ms — no scale on data cards.

---

## 18. Icons

**Library:** Lucide Icons  
**Stroke:** 1.5px default; 2px active nav  
**Custom:** DreamWeavers monogram only

| Context | Size |
|---|---|
| Inline | 16px |
| Nav / buttons | 18px |
| Empty states | 48px, ink-tertiary |

Active nav: icon in `brand-primary-subtle` container, brand primary color.

---

## 19. Animation Guidelines

**Engine:** Framer Motion (implementation phase)

| Animation | Duration | Easing |
|---|---|---|
| Micro-interactions | 100ms | ease-out |
| Button hover | 120ms | ease |
| Panel slide | 200ms | cubic-bezier(0.32, 0.72, 0, 1) |
| Modal enter | 180ms | spring (400, 30) |
| Page content enter | 150ms | fade + 8px Y |
| List stagger | 30ms/item | max 10 items |
| Skeleton shimmer | 1.5s | linear loop |
| Toast | 200ms / 150ms | ease-out / ease-in |

Respect `prefers-reduced-motion` — instant or opacity-only ≤100ms.

---

## 20. Transition Guidelines

| Transition | Behavior |
|---|---|
| Route change | Content fades 150ms; shell persists |
| Panel open/close | Slide + backdrop 200ms; focus trapped |
| Tab switch | Instant swap; underline slides 120ms |
| Sidebar collapse | Width 200ms; labels fade 150ms delay |
| Theme switch | 200ms on color properties |
| Data loading | Skeleton → content crossfade 100ms |

---

## 21. Responsive Strategy

| Breakpoint | Width | Strategy |
|---|---|---|
| mobile | < 640px | Bottom nav, stacked, bottom sheets |
| tablet | 640–1024px | Collapsed sidebar, 2-col bento |
| desktop | 1024–1440px | Full layout |
| wide | > 1440px | Max-width 1440px centered |

Tables → card list or horizontal scroll with sticky first column on mobile.

---

## 22. Mobile Layout

```
┌─────────────────────────┐
│ Glass Navbar (compact)  │
├─────────────────────────┤
│   Main Content          │
├─────────────────────────┤
│ 🏠  ✓  💬  📅  ☰       │
└─────────────────────────┘
```

- Sidebar → off-canvas drawer
- Command palette → full-screen search
- AI → full-screen bottom sheet
- Clock in/out → FAB bottom-right
- Touch targets: minimum 44×44px

---

## 23. Tablet Layout

- Sidebar collapsed (64px) by default
- Bento: 2 columns
- Meet Dreams: 2 columns (list + thread)
- Tables: horizontal scroll
- Right panels: overlay slide-over

---

## 24. Desktop Layout

- Sidebar expanded (240px), 12px inset
- Content max 1440px centered
- Right panel push layout, 360px
- Meet Dreams: full three-column
- Dashboard: 4-col stats, 2-col charts
- Tables: full features (resize, reorder, pin)

---

## 25. Accessibility Guidelines

**Target:** WCAG 2.1 AA

| Area | Requirement |
|---|---|
| Contrast | 4.5:1 body; 3:1 large text |
| Focus | 2px brand primary ring, 2px offset |
| Keyboard | Full navigation; no traps except modals |
| Screen readers | Semantic HTML; ARIA on icon buttons; live regions |
| Motion | prefers-reduced-motion honored |
| Forms | Visible labels; aria-describedby on errors |
| Skip link | "Skip to main content" first focusable |

---

## 26. Dark Theme

| Token | Light | Dark |
|---|---|---|
| Surface Canvas | `#FAFAFA` | `#0F0F10` |
| Surface Base | `#FFFFFF` | `#18181B` |
| Surface Sunken | `#F4F4F5` | `#27272A` |
| Ink Primary | `#1A1A1B` | `#FAFAFA` |
| Ink Secondary | `#52525B` | `#A1A1AA` |
| Border Default | `#E4E4E7` | `#3F3F46` |
| Brand Primary | `#4A7C92` | `#5B8FA3` |

Glass navbar: 80% opacity + 12px blur. Elevation via border brightness + shadow.

---

## 27. Light Theme

Default theme. `#FAFAFA` canvas, white cards, brand teal accents.

- Glass navbar: white 85% opacity, 16px blur
- Active states: `brand-primary-muted`
- Feel: Apple × Vercel — airy, confident, minimal

Preference: System / Light / Dark in Profile → Preferences.

---

## 28. Design Tokens

```
--dw-color-{category}-{variant}
--dw-font-{size}
--dw-space-{n}
--dw-radius-{size}
--dw-shadow-{size}
--dw-motion-{duration}-{easing}
--dw-z-{layer}
```

### Z-Index Scale

| Token | Value | Usage |
|---|---|---|
| z-base | 0 | Content |
| z-sticky | 10 | Navbar, table headers |
| z-sidebar | 20 | Floating sidebar |
| z-dropdown | 30 | Menus |
| z-drawer | 40 | Slide-overs |
| z-modal | 50 | Modals, command palette |
| z-toast | 60 | Toasts |
| z-tooltip | 70 | Tooltips |

---

## 29. Interaction Principles

1. One primary action per screen
2. Progressive disclosure — details in panels
3. Optimistic feedback with silent reconciliation
4. Undo over confirm where safe
5. Context preservation on back navigation
6. Direct manipulation (drag tasks, files, widgets)
7. Keyboard first — command palette for all actions
8. Unsaved changes guard on forms
9. Every entity shows status + last updated
10. No dead ends — empty states always have a CTA

---

## 30. UX Improvements

| Typical HRMS Problem | DreamWeavers Solution |
|---|---|
| Separate chat and HR apps | Meet Dreams with HR context inline |
| Approvals lost in email | Dashboard queue + one-click drawer actions |
| Attendance buried | Dashboard widget + command palette |
| Reports need IT | Plain-language builder + AI narration |
| Bolt-on AI | Context-aware panel that can prefill forms |
| Admin template overload | Role-aware UI hides admin from employees |
| Spreadsheet tables | Premium tables with avatars, pills, hover actions |

---

## 31. Loading States

1. **Initial page:** skeleton matching final layout
2. **Refetch:** inline skeleton rows
3. **Button action:** spinner in button, width preserved
4. **Background refresh:** 2px top progress bar (Linear-style)
5. **Upload:** progress bar in file row
6. **Route:** previous content at 60% opacity until skeleton (100ms max)

Debounce skeleton for loads <200ms.

---

## 32. Empty States

**Anatomy:** overline + heading + description + primary CTA

No clip-art. Optional monogram watermark at 3% opacity.

| Context | Heading | CTA |
|---|---|---|
| No tasks | No tasks yet | Create task |
| No employees | Build your team | Add employee |
| No documents | Your library is empty | Upload document |
| No meetings | No conversations yet | Start a conversation |
| No notifications | You're all caught up | — |
| No search results | No results for '{query}' | Clear filters |

---

## 33. Error States

| Level | Pattern |
|---|---|
| Field validation | Inline below field, danger color |
| Form submit | Toast + form preserved |
| Widget failure | Card error + Retry; other widgets unaffected |
| Page failure | Heading + Retry + support link |
| 404 | Not found + command palette hint |
| 403 | No access message |
| Offline | Persistent banner below navbar |
| Session expired | Non-dismissable modal → Login |

User copy: what happened + what to do. Support error ID in toast footer.

---

## 34. Notification System

### Channels
In-app drawer, inbox page, email (configurable), browser push (Phase 2)

### Categories
Approvals, Tasks, Mentions, Attendance, Documents, Meetings, System, Automation

### Drawer (400px)
- Grouped: Today, Yesterday, Earlier
- Inline quick actions: Approve / View / Dismiss
- "Mark all read" in header

### Preferences
Per-category: In-app / Email / None

---

## 35. Command Palette (Ctrl + K)

- Centered modal, 560px, shadow-lg, radius-xl
- Auto-focused search input
- Grouped results: Recent → Navigation → Actions → People → AI

### Prefixes
- `>` actions only
- `@` people only
- `/` navigation only
- `Ask:` routes to AI panel

### Footer hints
`↑↓ Navigate · Enter Select · Esc Close`

Mobile: full-screen variant.

---

## 36. Global Search

- Trigger: navbar search or `/` (when not in input)
- Modal: 640px with tabs (All, People, Tasks, Documents, Messages)
- Results: icon, title, module badge, highlighted excerpt, timestamp
- Recent searches when empty (max 10)

---

## 37. AI Assistant Layout

**360px right panel** — Gemini-powered contextual copilot.

```
┌─────────────────────────────┐
│ ✦ DreamWeavers AI      [×] │
│ Context: Tasks · Project X  │
├─────────────────────────────┤
│  [Conversation thread]      │
├─────────────────────────────┤
│ Suggested prompt chips      │
├─────────────────────────────┤
│ [Ask anything…        ] [↑] │
└─────────────────────────────┘
```

- Opens from sidebar, navbar, or command palette
- Action buttons prefill forms — never auto-submit
- Typing indicator while loading
- Context-aware suggested prompts per page

---

## 38. Meet Dreams Layout

**Chat + Audio + Video** — WhatsApp Desktop × Slack channels.

### Three-Column Desktop

```
┌──────────┬─────────────────────┬──────────────┐
│ Conv List│   Message Thread    │  Members /   │
│  280px   │      (fluid)        │  Info  280px │
└──────────┴─────────────────────┴──────────────┘
```

### Features
- DMs, team channels, meeting rooms
- Header: audio call, video call, search, info toggle
- Message types: text, file, image, system, embeds
- Composer: multi-line, attach, Enter to send

### Calls
- Incoming: centered modal with Accept / Decline
- Active video: grid with speaker highlight (brand primary border)
- Controls: mute, camera, screen share, participants, leave
- Audio-only: compact bar with waveform animation

---

## 39. Task Workflow

### States
`Backlog → Todo → In Progress → In Review → Done` (+ `Cancelled`)

### Creation
Command palette, project inline add, AI panel, n8n automation

### Board
Drag between columns = optimistic status change

### Priority Dots
Urgent (danger), High (warning), Medium (brand), Low (tertiary)

---

## 40. Calendar Workflow

### Views
Month → Week → Day → Agenda

### Event Types
Meeting, Task deadline, Leave, Company event, Personal

### Creation
Click slot or button → modal → attendees → optional Meet Dreams link

### Integration
Task deadlines as dots; approved leave on team calendar; meetings auto-sync

---

## 41. Attendance Workflow

### Employee
Dashboard widget → Clock In → toast confirmation → Clock Out at end of day

### Manager
Team table with status pills: Present, Absent, Late, On Leave, Half Day

### Corrections
Employee submits → manager approves via approval workflow

---

## 42. Approval Workflow

### Types
Leave, attendance corrections, document access

### Manager Entry Points
1. Dashboard widget
2. Notification drawer
3. Module approvals list

### Drawer Contents
Request details, team calendar mini overlay, optional note, Approve / Reject

### Outcomes
Approved → calendar updated, n8n triggered, employee notified  
Rejected → note included, employee can resubmit

---

## 43. File Upload UX

### Triggers
Drag onto Documents, Upload button, attach in tasks/chat/profile

### Flow
Validate → progress row → crossfade to file row → toast on success → Retry on failure

### Drag Overlay
Dashed brand primary border, subtle brand background, "Drop files to upload"

### Defaults
25MB max; PDF, DOCX, XLSX, PNG, JPG, CSV

---

## 44. Reports UX

### Gallery
Card grid by category: HR, Attendance, Tasks, Custom

### Builder Steps
1. Data source
2. Fields
3. Filters
4. Visualization (Table, Bar, Line, Pie, Number)
5. Preview → Save / Export / Schedule

### Export
CSV, PDF with download toast

### AI
"Explain this report" opens narration in right panel

---

## 45. Future Scalability Considerations

### Product
- Multi-org / holding company switcher
- Custom fields on employees and tasks
- n8n workflow marketplace
- Native mobile apps (API-first)
- White-label via token overrides

### Design
- Widget registry for dashboard extensibility
- Command palette plugin commands
- Virtual scrolling on all long lists
- i18n from day one; RTL planned
- High contrast as third theme option

---

## Approval Gate

This document must be approved before any implementation begins.

**Confirm:**
- [ ] Information architecture
- [ ] Navigation and sidebar model
- [ ] Meet Dreams layout
- [ ] Bento dashboard approach
- [ ] Color palette and typography
- [ ] MVP module priority

---

*DreamWeavers HRMS — Product Design Document v1.0*
