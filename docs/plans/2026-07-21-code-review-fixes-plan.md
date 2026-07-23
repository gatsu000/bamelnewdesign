# Code Review Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the code quality, security, accessibility, and SEO improvements identified during the codebase review.

**Architecture:** We will clean up unused dependencies, install necessary libraries for form management and SEO, optimize font loading by moving it to the HTML layer, fix `useReducedMotion` across shared components, secure the backend email template from HTML injection, and perform a major refactor of the `Quote.jsx` form to use `react-hook-form` with `zod`.

**Tech Stack:** React 19, Vite, Framer Motion, React Hook Form, Zod, React Helmet Async, Express (dev server).

---

### Task 1: Add Dependencies & Cleanup

**Files:**
- Modify: `package.json`
- Delete: `src/components/CustomCursor.jsx`

**Step 1: Install required packages and remove unused ones**

Run: `npm install react-hook-form @hookform/resolvers zod react-helmet-async && npm uninstall gsap lenis`
Expected: Packages installed and uninstalled successfully.

**Step 2: Delete dead component**

Run: `Remove-Item src/components/CustomCursor.jsx` (on Windows pwsh)
Expected: File deleted.

**Step 3: Run build to verify it passes**

Run: `npm run build`
Expected: Build passes without missing dependency errors.

**Step 4: Commit**

```bash
git add package.json package-lock.json
git rm src/components/CustomCursor.jsx
git commit -m "chore: add react-hook-form and seo deps, remove unused gsap/lenis"
```

---

### Task 2: Performance Optimization (Fonts)

**Files:**
- Modify: `src/styles.css`
- Modify: `index.html`

**Step 1: Move font loading to HTML**

In `src/styles.css`, remove line 1: `@import url('https://fonts.googleapis.com/css2?family=DM+Mono...');`

In `index.html`, add inside `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet">
```

**Step 2: Run build to verify**

Run: `npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/styles.css index.html
git commit -m "perf: move google fonts to index.html to prevent render-blocking"
```

---

### Task 3: Accessibility & Motion Fixes

**Files:**
- Modify: `src/components/shared.jsx`

**Step 1: Apply `useReducedMotion` to `ServiceCard` and `Faq`**

In `src/components/shared.jsx`:
- Import `useReducedMotion` if not already fully imported in all components.
- In `ServiceCard`, add `const reduced = useReducedMotion()` and use `initial={reduced ? false : { opacity:0, y:18 }}`.
- In `Faq`, add `const reduced = useReducedMotion()` and update `initial={{ opacity:0,height:0 }}` to `initial={reduced ? false : { opacity:0,height:0 }}` and disable `animate` heights conditionally.

**Step 2: Verify components compile**

Run: `npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/components/shared.jsx
git commit -m "fix(a11y): apply useReducedMotion to ServiceCard and Faq"
```

---

### Task 4: SEO Integration

**Files:**
- Modify: `src/main.jsx`
- Modify: `src/App.jsx`

**Step 1: Wrap app in HelmetProvider**

In `src/main.jsx`, wrap `<App />` with `<HelmetProvider>`.

**Step 2: Add Helmet tags to Routes**

In `src/App.jsx`, add `<Helmet><title>Page Title - Bamel Enerji</title></Helmet>` to `Home`, `Services`, `Quote`, `Quality`, `Gallery`, `Contact`.

**Step 3: Verify build**

Run: `npm run build`
Expected: Build passes.

**Step 4: Commit**

```bash
git add src/main.jsx src/App.jsx
git commit -m "feat(seo): add react-helmet-async provider and page titles"
```

---

### Task 5: Backend Validation & Security

**Files:**
- Modify: `server/index.js`

**Step 1: Update API endpoint validation**

In `server/index.js`:
- Include `sample` and `privacy` in `request.body` destructuring.
- Add them to the email payload.
- Update `parseInt(process.env.SMTP_PORT || '465')` to `parseInt(process.env.SMTP_PORT, 10) || 465`.

**Step 2: Escape HTML**

In `server/index.js`, create a simple `escapeHtml` function and apply it to `details`, `name`, `company`.

**Step 3: Verify server starts**

Run: `node server/index.js`
Expected: Server starts on port 8787 without syntax errors.

**Step 4: Commit**

```bash
git add server/index.js
git commit -m "fix(api): secure email template and add missing fields"
```

---

### Task 6: Form Refactor

**Files:**
- Modify: `src/pages/Quote.jsx`

**Step 1: Implement Zod Schema & Hook Form**

In `src/pages/Quote.jsx`, define a `zod` schema matching the fields (`name`, `company`, `email`, `phone`, `services`, `quantity`, `details`, `sample`, `privacy`).
Replace the manual `useState` form with `useForm({ resolver: zodResolver(schema) })`.

**Step 2: Multiline Refactor & Motion Fix**

Refactor the render tree to map to `react-hook-form`'s `register`. Fix the `x: -10` step animation to use `useReducedMotion`.

**Step 3: Verify build**

Run: `npm run build`
Expected: Build passes.

**Step 4: Commit**

```bash
git add src/pages/Quote.jsx
git commit -m "refactor(form): use react-hook-form and zod for quote validation"
```
