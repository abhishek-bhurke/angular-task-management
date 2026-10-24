# Taskflow — Angular 20 Task Management Assessment

A responsive task-management application built to match the supplied technical assessment. It includes task CRUD, title search, status/priority filtering, overdue identification, dashboard statistics, Reactive Forms, routing, loading/error feedback, and automated tests.

## Requirements
- Angular 20, standalone components, strict TypeScript
- Reactive Forms with required/minimum-length validation
- Signals-based store with derived dashboard statistics and immutable updates
- Mock API service separated from UI components
- Routes: `/tasks`, `/tasks/new`, `/tasks/:id/edit`, default redirect, and 404
- Responsive layout, accessible labels, focus-visible styling, empty/loading/error states
- Service, store, form validation, and component tests

## Prerequisites
- Node.js compatible with Angular 20 (use a current supported LTS release)
- npm

## Setup and run
```bash
npm install
npm start
```
Open the local URL printed by Angular CLI (typically `http://localhost:4200`).

## Build and tests
```bash
npm run build
npm test
```
The test command launches Karma in a browser. Ensure Chrome/Chromium is available, or adjust the Karma launcher for your environment.

## Architecture
- `src/app/models/task.model.ts`: domain types, labels, overdue calculation.
- `src/app/data/task-api.service.ts`: mock API adapter. This is the only layer that owns mock persistence and CRUD operations.
- `src/app/state/task.store.ts`: single source of truth using Angular Signals. It coordinates the API, exposes loading/saving/error/notice signals, performs immutable updates, and derives summary counts.
- `src/app/pages/task-list.component.ts`: list, filters, search, summary and delete confirmation.
- `src/app/pages/task-form.component.ts`: shared create/edit Reactive Form.
- `src/app/app.routes.ts`: route definitions and fallback.
- `src/app/**/*.spec.ts`: automated behavior tests.

Data flows from the API adapter to the store, then into components through signals. Components invoke store methods rather than calling the API directly.

## State management choice
Signals keep this small application's state and derived values easy to inspect without introducing NgRx boilerplate. The store is injectable and acts as a single source of truth. RxJS remains useful at the API boundary for asynchronous operations and finalization.

## Assumptions and trade-offs
- The assignment allows a mock service, so data is held in memory and resets when the page reloads. No real server is required.
- Delete confirmation uses the browser's native confirmation dialog to prioritize core functionality over a custom modal.
- The task list is small; client-side filtering is appropriate.
- Search is immediate rather than debounced because the data set is local and small.
- The mock API adds small delays to make loading/saving states visible.
- No authentication or multi-user persistence is in scope.

## What to improve before production
- Replace the mock adapter with typed `HttpClient` requests and environment-based API configuration.
- Add server-side validation, authentication/authorization, persistence, pagination, and request cancellation.
- Add robust logging/telemetry, retry policy where appropriate, and centralized error mapping.
- Replace native confirm with an accessible custom dialog and add end-to-end tests.
- Add a CI pipeline for linting, unit tests, accessibility checks, and production builds.

## Scaling to thousands of tasks
Use server-side filtering, sorting, and pagination rather than downloading every task. Add indexed database fields for status, priority, and due date; request only required fields; debounce search; cache stable reference data; and use virtual scrolling if a large number of rows must be rendered.

## Known limitations
- The mock service is in-memory only.
- This ZIP is a source project; dependencies are not included. Run `npm install` before starting.
- Test execution depends on a supported local browser and Angular CLI toolchain.

## AI/tooling declaration
This starter project was generated with assistance from an AI coding assistant. Review, run, test, and understand the code before submitting it as an assessment. Update this declaration to accurately describe any additional tools, templates, or copied code used.
