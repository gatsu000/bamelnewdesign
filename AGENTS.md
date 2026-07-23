# PROJECT KNOWLEDGE BASE

**Generated:** 2026-07-20
**Commit:** a5d1707
**Branch:** master

## OVERVIEW

B2B corporate site for a Diyarbakır-based textile production/finishing company. React 19 + Vite 7 SPA, deployed as static files to Hostinger Apache. Turkish UI, single-page bundle, no backend in production.

## STRUCTURE

```
.
├── src/
│   ├── App.jsx              # ALL routes, pages, and most components (one file, ~136 lines)
│   ├── data.js              # services[], processSteps[], faqs[] — content source of truth
│   ├── main.jsx             # Entry: BrowserRouter + StrictMode
│   ├── styles.css           # Single stylesheet, CSS vars in :root, no Tailwind/modules
│   ├── components/
│   │   └── CustomCursor.jsx # DEAD — never imported. Safe to delete with `gsap` dep.
│   └── hooks/               # EMPTY directory
├── server/index.js          # DEV-ONLY Express: GET /api/health, POST /api/quote
├── public/
│   ├── .htaccess            # Apache SPA rewrite + security headers + cache + gzip + HTTPS
│   └── favicon.svg
├── design-system/bamel-enerji/MASTER.md  # STALE — describes a different palette/typography than styles.css. Do NOT trust as source of truth.
├── index.html               # Static shell, font preconnects live in styles.css
├── vite.config.js           # Plugin-react only; /api proxied to :8787 in dev
└── package.json
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add a route / page | `src/App.jsx` | Pattern: define `function MyPage()`, add `<Route>` in `App()` |
| Edit a service card or detail | `src/data.js` (`services[]`) + `ServiceCard`/`ServiceDetail` in App.jsx | slug drives `/hizmetler/:slug` |
| Change brand color / font | `src/styles.css` `:root` vars (`--ink`, `--paper`, `--copper`, ...) | `design-system/MASTER.md` is NOT authoritative |
| Modify teklif (quote) form | `Quote` in App.jsx + `POST /api/quote` in server/index.js | 2-step form, client validation in `next()` and `submit()` |
| Page transition behavior | `PageTransition` in App.jsx (line ~40) | `mode="popLayout"`, instant scroll on route change |
| Build/deploy | `package.json` scripts (`postbuild` copies .htaccess → dist/) | Target: Hostinger `public_html/` |
| Add deployment automation | `.github/` (currently EMPTY) | No workflows exist yet |

## CODE MAP

Key symbols (from LSP, `src/App.jsx`):

| Symbol | Type | Line | Role |
|--------|------|------|------|
| `App` | Function | 17 | Root component: Header + PageTransition(Routes) + Footer |
| `PageTransition` | Function | 40 | `AnimatePresence mode="popLayout"`, instant scroll-to-top on pathname change |
| `Header` | Function | 63 | Sticky nav + mobile menu (`AnimatePresence` on mobile-nav) |
| `MotionSection` | Function | 75 | Section wrapper, `whileInView` + `viewport={{ once:true, amount:.16 }}` |
| `Home` | Function | 83 | Hero (`WeaveField`) + services grid + process + FAQ + CTA |
| `WeaveField` | Function | 96 | Animated hero visual: floating cards + 18-cell pulse grid |
| `ServiceCard` / `ServiceDetail` | Function | 101 / 112 | Service grid item + `/hizmetler/:slug` detail |
| `Services`, `Quality`, `Gallery`, `Contact`, `Quote`, `NotFound` | Function | 110–132 | Route components |
| `Quote.submit` | Function | 126 | POSTs to `/api/quote`, manual validation, no schema lib |
| `reveal` | Constant | 15 | Shared motion variant `{ opacity, y:20 }` |

`src/data.js` exports: `services` (6 items), `processSteps` (4), `faqs` (4).
`server/index.js` exports: nothing (standalone Express app, port `process.env.PORT || 8787`).

## CONVENTIONS

- **Compressed one-liner JSX style** in App.jsx: chained ternaries, multiple JSX elements per line, single-line `if (!x) return <Y/>`. Match this density when editing — do not expand to verbose multi-line without reason.
- **Turkish strings hardcoded**, no i18n. Copy lives inline in JSX or in `data.js`.
- **`prefers-reduced-motion` respected everywhere** via `useReducedMotion()` — every motion component checks `reduced` and disables transforms/animations when set.
- **CSS**: single `styles.css`, design tokens in `:root`. No CSS modules, no Tailwind, no CSS-in-JS. BEM-ish class names (`service-card-next`, `cta-next`, `hero-next` — the `-next` suffix is the current visual generation).
- **Icons**: `lucide-react` only. No emoji as icon (enforced by `design-system/MASTER.md` anti-patterns, still applies).
- **Routing**: `react-router-dom` v7, `BrowserRouter` in `main.jsx`, `NavLink` for active state, `useParams` for service detail.
- **Forms**: manual `useState` + controlled inputs, manual validation in handler. No form library.

## ANTI-PATTERNS (THIS PROJECT)

- **NEVER** trust `design-system/bamel-enerji/MASTER.md` for color/typography decisions — it describes a navy/blue + Poppins/Open Sans system that was never implemented. Real palette is copper/paper + Manrope/Newsreader/DM Mono in `src/styles.css`.
- **NEVER** commit secrets. `.mcp.json` currently contains a hardcoded Hostinger API token — this is a known leak, not a pattern to follow. New MCP config or `.env*` must use env vars (`.mcp.json` should be gitignored or templated).
- **NEVER** assume `server/index.js` runs in production. README explicitly marks API as "development only". Production is static-only on Apache — `/api/quote` will 404 unless a serverless/CGI handler is added.
- **NEVER** use `as any` / `@ts-ignore` (project is JS, but if adding TS, no suppression).
- **NEVER** use `AnimatePresence mode="wait"` for top-level page transitions — it serializes exit+enter and was the root cause of the slow-transition bug (fixed in a5d1707). Use `mode="popLayout"` + short opacity-only crossfade.
- **NEVER** use `behavior: 'smooth'` on route-change scroll — `window.scrollTo(0, 0)` (positional form) ignores CSS `scroll-behavior` and is instant.

## UNIQUE STYLES

- `-next` suffix on class names (`hero-next`, `cta-next`, `footer-next`, `service-card-next`, `gallery-next`) marks the current visual redesign generation. Older non-suffixed classes should not be added.
- `Eyebrow` component pattern: small uppercase label with a leading `<i />` accent dot.
- `MotionSection` wraps every page section; in-view animation is the default (not opt-in).
- `WeaveField` is a hand-built animated hero (no library beyond framer-motion) — 18-cell breathing grid + 2 floating cards. Reduced-motion users see a static version.
- `Bamel-Enerji-Web-Sitesi-Strateji-Raporu.md` is a strategy audit (Turkish), not code — read for product/marketing context only.

## COMMANDS

```bash
npm install              # install deps
npm run dev              # Vite dev server on :5173 (frontend only)
npm run server           # Express API on :8787 (run separately for local API)
npm run build            # vite build + postbuild (copies public/.htaccess → dist/)
npm run preview          # serve the production build locally
npm run deploy:hostinger # build + echo upload instructions
npm run deploy:check     # build + ls dist/
```

Dev with API requires **two terminals**: `npm run server` (:8787) + `npm run dev` (:5173). Vite proxies `/api/*` → `localhost:8787`.

## NOTES

- **Dead weight**: `gsap` (only used by `CustomCursor.jsx` which is never imported), `lenis` (used nowhere). Removing both + `CustomCursor.jsx` shrinks the bundle noticeably. Safe cleanup, not yet done.
- **No tests, no linter config, no CI** (`.github/` is empty). TypeScript LSP is installed but project is `.jsx`/`.js`.
- **No code splitting**: all routes in one bundle (~390 KB / 125 KB gzip). Transitions are fast because everything is already downloaded; first load is heavier than necessary.
- **Images are Unsplash placeholders** — README's pre-launch checklist requires replacing with real production photos before going live.
- **Form `/api/quote` returns 202 with a generic Turkish acknowledgment** — there is no persistence, no email, no CRM. The endpoint exists to satisfy the fetch; real handling is a TODO.
- **CRLF**: git warns `LF will be replaced by CRLF` on Windows checkouts. Existing files are LF; do not normalize piecemeal.
- **`dist/` is gitignored** — production build is not version-controlled, regenerate with `npm run build`.
