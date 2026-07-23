# Design Doc: Code Review Fixes
**Date:** 2026-07-21
**Topic:** Code Review Fixes for Bamel Enerji React SPA

## Overview
This document outlines the architectural and code quality improvements identified during the code review, specifically targeting the frontend form logic, backend validation, accessibility, performance, and SEO.

## 1. Dependencies & Cleanup
- **Add:** `react-hook-form`, `@hookform/resolvers`, `zod`, `react-helmet-async`.
- **Remove:** Unused dependencies `gsap` and `lenis`.
- **Delete:** `src/components/CustomCursor.jsx`.

## 2. Form Refactor & Backend Validation
- **Frontend (`Quote.jsx`):** Refactor to use `react-hook-form` and `zod`. This standardizes validation logic, removes complex manual state updates, and improves readability by splitting the extremely dense one-liner form handler into a clean hook-based architecture.
- **Backend (`server/index.js`):** 
  - Add missing `sample` and `privacy` fields to the request validation.
  - Implement basic HTML escaping for the `details` field (and other user inputs) to mitigate HTML Injection risks in the Nodemailer template.
  - Fix `SMTP_PORT` parsing by explicitly using `parseInt(process.env.SMTP_PORT, 10)`.

## 3. Accessibility & Motion
- **Issue:** Several components ignore the `useReducedMotion()` hook.
- **Fix:** Update `ServiceCard` and `Faq` in `src/components/shared.jsx`, and the form step transitions in `Quote.jsx` to respect `prefers-reduced-motion` and fallback to simple opacity fades.

## 4. Performance Optimization
- **Issue:** Google Fonts are loaded via `@import` in `styles.css`, causing render-blocking issues.
- **Fix:** Move the font imports to `<link rel="preconnect">` and `<link rel="stylesheet">` tags directly in `index.html`.

## 5. SEO Integration
- **Issue:** No dynamic page titles or meta descriptions.
- **Fix:** Wrap the application root in `HelmetProvider`. Add `<Helmet>` blocks to all main page components (`Home`, `Services`, `Quote`, `Gallery`, `Quality`, `Contact`, `ServiceDetail`) to set descriptive Turkish titles and meta tags.
