# Seven Review Fixes Design

## Scope

Resolve the seven confirmed review findings without changing the site's visual direction or primary deployment model.

## Decisions

- Keep GSAP because `ScrollProductionStory` depends on ScrollTrigger.
- Remove Lenis and the global `SmoothScroll` integration. Native scrolling remains the default.
- Keep Express/SMTP as the primary production quote API.
- Keep the PHP endpoint as a static-host fallback with the same request and response contract where the platform permits.
- Keep the existing five-requests-per-fifteen-minutes policy. Harden proxy handling and PHP's concurrent bucket updates.
- Apply equivalent Content Security Policy headers in Express and Apache.
- Preserve the magnetic CTA effect while moving pointer animation out of React render state.
- Restore or remove `window.THREE` during `TextileScene` cleanup.
- Remove tracked MCP credentials, ignore the local config, and provide a sanitized example. Credential rotation remains an external operator action.

## Error Handling

Both quote implementations continue returning JSON with a Turkish `message` and an optional `requestId`. Invalid requests remain `400`, throttled requests remain `429`, unavailable delivery remains `502` or `503`, and accepted requests remain `202`.

## Verification

- Confirm exposed credentials no longer occur in tracked files.
- Confirm missing CSP before the change and required CSP after it.
- Exercise validation and throttling on the Node endpoint.
- Run PHP syntax validation and, when PHP is available, direct endpoint smoke checks.
- Run LSP diagnostics on changed JavaScript and JSX files.
- Run `npm audit --omit=dev` and a production Vite build.
- Exercise the home page and quote flow in a real browser after the production build succeeds.
