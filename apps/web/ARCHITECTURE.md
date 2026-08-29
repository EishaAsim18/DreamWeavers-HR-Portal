# DreamWeavers HRMS — Frontend Architecture

**Phase 1: Foundation** — Complete  
**Location:** `apps/web`

---

## Quick Start

```bash
cd apps/web
npm install
npm run dev
```

**Mock login:** `admin@dreamweavers.com` / `password123`  
Or use **Dev login** on the sign-in page.

**Keyboard shortcuts:**
- `Ctrl/Cmd + K` — Command palette
- `/` — Global search

---

## Folder Structure

```
apps/web/src/
├── app/                          # Application bootstrap
│   ├── App.tsx
│   ├── providers/
│   │   └── app-providers.tsx     # Provider composition root
│   ├── router/
│   │   ├── routes.tsx            # React Router config
│   │   └── guards.tsx            # Protected + role routes
│   └── pages/
│       ├── login-page.tsx        # Mock auth (infrastructure)
│       └── foundation-stub.tsx   # Route placeholder (not features)
│
├── features/                     # Feature slices (Phase 2+)
│   └── README.md
│
├── shared/
│   ├── api/
│   │   ├── client.ts             # API client abstraction
│   │   └── mock/                 # Mock implementations
│   ├── components/
│   │   ├── layouts/              # AppShell, Sidebar, Navbar, etc.
│   │   ├── ui/                   # Design system primitives
│   │   ├── feedback/             # Error boundary, loaders
│   │   └── overlays/             # Command palette, drawers, modals
│   ├── constants/                # Routes, nav, roles, config
│   ├── contexts/                 # Auth, theme, shell state
│   ├── data/mock/                # Mock data fixtures
│   ├── hooks/                    # Shared hooks
│   ├── lib/                      # utils, query client
│   └── types/                    # Shared TypeScript types
│
└── styles/
    ├── tokens.css                # DWDS CSS custom properties
    └── globals.css               # Tailwind + global styles
```

---

## Architecture Decisions

| Concern | Implementation |
|---|---|
| **Feature organization** | Vertical slices under `features/` (Phase 2) |
| **Shared UI** | `shared/components` — layouts + ui primitives |
| **Business logic** | Hooks + TanStack Query (no fetch in components) |
| **Auth** | Mock JWT session in localStorage |
| **RBAC** | `RoleRoute` + permission checks on nav items |
| **Theme** | CSS variables + `class="dark"` on `<html>` |
| **Overlays** | Single `OverlayProvider` — one panel at a time |
| **Toasts** | Sonner |
| **Modals** | Radix Dialog + `ModalProvider` |
| **Drawers** | Vaul (mobile bottom sheet, desktop right sheet) |
| **Command palette** | cmdk |
| **Animation** | Framer Motion on layout + page enter |

---

## Layout Components

| Component | Responsibility |
|---|---|
| `AppShell` | Sidebar + main + global overlays |
| `Sidebar` | Floating nav, role-filtered items, collapse |
| `Navbar` | Glass header, search, notifications, AI |
| `MainLayout` | Content area with sidebar offset animation |
| `PageContainer` | Max-width page padding wrapper |
| `PageHeader` | Title + description + actions |

---

## Context Providers (nested order)

```
ErrorBoundary
└── QueryClientProvider
    └── ThemeProvider
        └── AuthProvider
            └── LoadingProvider
                └── SidebarProvider
                    └── OverlayProvider
                        └── ModalProvider
                            └── TooltipProvider
                                └── RouterProvider
                                └── Toaster
```

---

## Routing

- **Public:** `/login`
- **Protected:** All routes under `/` wrapped in `ProtectedRoute` + `AppShell`
- **Role-gated:** Employees, Reports, Automations use `RoleRoute`

Route constants: `shared/constants/routes.ts`

---

## Mock API Layer

Swap mock imports in `shared/api/mock/` for real fetch calls when backend is ready.

| Mock | File |
|---|---|
| Auth | `auth.mock.ts` |
| Notifications | `notifications.mock.ts` |
| Search + AI | `search.mock.ts` |

---

## Phase 2 Checklist

- [ ] Implement Dashboard feature slice
- [ ] Replace `FoundationStub` with real pages
- [ ] Connect real API endpoints
- [ ] Add Zod schemas in shared package
- [ ] Code-split feature routes

---

*DreamWeavers HRMS — Frontend Foundation v1.0*
