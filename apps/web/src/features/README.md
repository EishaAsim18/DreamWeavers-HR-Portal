# Features

Feature modules live here as vertical slices.

```
features/
├── auth/          # Phase 2
├── dashboard/
├── employees/
├── attendance/
├── tasks/
├── calendar/
├── teams/
├── meet-dreams/
├── documents/
├── reports/
├── notifications/
├── settings/
└── profile/
```

Each feature follows:

```
features/{name}/
├── api/           # TanStack Query hooks
├── components/    # Feature UI
├── hooks/         # Business logic
├── schemas/       # Zod (from shared when ready)
└── index.ts       # Public exports
```

**Phase 1:** Foundation only — no feature implementations yet.
