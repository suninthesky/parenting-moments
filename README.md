# Parenting Moments

>Build your confidence and skills with real-life parenting scenarios.

A "vibe coding" experiment using Cursor AI to rapidly protoype and build a tool to help **build confidence and skills with real-life parenting scenarios**. Both server-driven and fully client-side approaches were rapidly explored - see [`prompts.md`](/prompts.md) for more details. Please note as this is protoype/exploratory software so there may be bugs.

## `/htmx-version` (Legacy, Server-Driven Prototype)

- **Stack:** Node.js (Express/Fastify), HTMX, Tailwind CSS, Playwright for E2E tests.
- **Features:**  
  - Server-rendered HTML for each scenario and outcome.
  - State persisted on the client (localStorage) for progress, mood, and patience.
  - Mobile-optimized UI with status bars and a scenario timer.
  - Automated E2E tests for scenario flow and UI.
- **Status:**  
  - Demonstrates rapid prototyping and progressive enhancement.

## `/vue-version` (Final, Fully Client-Side SPA)

- **Stack:** Vue 3, Pinia, Vite, Tailwind CSS, Playwright for E2E tests.
- **Features:**  
  - All logic, state, and scenarios are client-side (no backend required).
  - Modern SPA architecture with reusable components.
  - Mobile-first, accessible UI.
  - Scenario timer, status bars, and actionable feedback.
  - State and progress persisted in localStorage.
  - Easily extensible and ready for static hosting.
- **Deployment:**  
  - The `/vue-version` app is built and served from the `/docs` folder for GitHub Pages.
  - [Demo available here](https://www.suninthesky.co.uk/parenting-moments/).
