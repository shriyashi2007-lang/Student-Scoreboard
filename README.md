# Student Scoreboard

An accessible, responsive student performance dashboard built with React and Vite, without runtime UI or chart dependencies.

## Run

Use Node.js 22.12+ (or a version supported by Vite 8).

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. For production, run `npm run build`; use `npm run preview` to preview the build. Run `npm run lint` to check source code.

## Features

Five hash-linked pages: Dashboard, Students, Analytics, Leaderboard, and About & Settings. Supports adding, editing, deletion with five-second undo, search, status filters, sorting, charts, keyboard and touch carousel controls, CSV import/export, reduced motion, and configurable pass marks.

Eight sample students load on first use. Existing `scoreboard_students` records are preserved. An empty classroom stays empty until students are added or samples are reset. Records and preferences are saved in this browser's local storage; export a CSV for a portable backup. If browser storage is blocked or full, changes remain available for the current session but may not survive a refresh.

CSV requires `Name,Marks` and optionally `Class,Roll`. Quoted fields, escaped quotes and line breaks are supported. Import appends records after validating every row. Duplicate names are allowed; unique internal IDs distinguish students. Grades use fixed thresholds (A+: 90, A: 80, B: 70, C: 60, D: 40); the configurable pass mark changes pass/fail status independently.

## Source

- `src/components/`: reusable forms, accessible dialogs, charts, carousel, counters, podium and icons
- `src/pages/`: five dashboard pages
- `src/hooks/`: persistence and hash navigation
- `src/utils/`: grading, statistics, seed data and CSV handling
- `src/styles/`: responsive palette, layouts and reduced-motion styles

All calculations are derived from current student records. This academic project demonstrates React hooks, state management, validation, accessible interaction and CSS/SVG data visualization.
