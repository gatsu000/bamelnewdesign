# Seven Review Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Resolve the seven confirmed code-review findings while preserving the existing UI and primary Node deployment.

**Architecture:** GSAP remains for the production story, while Lenis and the global smooth-scroll wrapper are removed. Express remains the primary quote service and PHP remains a contract-aligned fallback; both deployment paths receive equivalent browser security headers. Frontend pointer/global-state fixes preserve behavior without unnecessary React renders or leaked globals.

**Tech Stack:** React 19, Vite 7, Framer Motion, GSAP, Express 5, Nodemailer, PHP, Apache.

---

### Task 1: Repair animation dependencies

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/App.jsx`
- Delete: `src/components/SmoothScroll.jsx`
- Modify: `README.md`

1. Preserve the existing failing `npm run build` output as the red check.
2. Restore `gsap` to dependencies and remove the `SmoothScroll` import/render from `App.jsx`.
3. Delete the now-unused Lenis integration and update the documented stack.
4. Run `npm install` and `npm run build`; expect a successful production build.

### Task 2: Remove tracked credentials

**Files:**
- Delete: `.mcp.json`
- Modify: `.gitignore`
- Create: `.mcp.example.json`

1. Confirm the exposed Hostinger and 21st.dev key patterns exist in tracked files.
2. Ignore `.mcp.json`, remove the tracked secret-bearing file, and add a safe example using environment placeholders.
3. Search tracked files for the exposed values and `21st_sk_`; expect no matches.
4. Record that external key rotation cannot be performed from the repository.

### Task 3: Align and harden quote APIs

**Files:**
- Modify: `server/index.js`
- Modify: `public/api/quote.php`
- Modify: `README.md`
- Modify: `DEPLOYMENT.md`

1. Exercise existing Node validation and record current responses.
2. Keep the five-per-fifteen-minute policy, make trusted-proxy configuration explicit, and ensure cleanup timers do not hold process shutdown.
3. Make PHP rate bucket updates atomic with locked read-modify-write behavior.
4. Align documented Node-primary and PHP-fallback behavior, including the PHP fallback's delivery limitations.
5. Run Node API smoke tests and `php -l` plus PHP endpoint checks when PHP is installed.

### Task 4: Add equivalent CSP headers

**Files:**
- Modify: `server/index.js`
- Modify: `public/.htaccess`

1. Confirm CSP is absent from current responses/configuration.
2. Add a policy allowing local scripts, fonts, images, API connections, and required inline styles while blocking objects and external framing.
3. Verify the Node response header and inspect the Apache directive for policy parity.

### Task 5: Remove frontend render churn and global leakage

**Files:**
- Modify: `src/components/Magnet.jsx`
- Modify: `src/components/TextileScene.jsx`

1. Replace `Magnet` pointer-driven React state with RAF-batched direct transform updates scoped to the component.
2. Preserve reduced-motion, disabled, fine-pointer, reset, and transition behavior.
3. Save the prior `window.THREE` value before Vanta initialization and restore or remove it during cleanup.
4. Run LSP diagnostics, the production build, and browser checks of the home-page CTA and Vanta scene.

### Task 6: Final verification

**Files:**
- Inspect all changed files.

1. Run LSP diagnostics on every changed JavaScript/JSX file.
2. Run `npm audit --omit=dev` and `npm run build`.
3. Start the production server and smoke-test `/api/health`, invalid `/api/quote`, and CSP headers.
4. Run real-browser checks at mobile and desktop widths for the home page and quote form.
5. Confirm `git diff` contains only intended changes and report any unavailable verification tools.
