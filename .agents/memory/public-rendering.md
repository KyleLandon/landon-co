---
name: Public rendering boundaries
description: Why marketing pages and authenticated application routes have separate rendering entry points
---

Preserve complete public HTML and an auth-independent marketing experience when changing routing or build tools.

**Why:** The user approved pre-rendering the marketing pages without changing their design, while keeping dashboards client-rendered and pricing unlisted. Waiting for Clerk had unnecessarily delayed public content.

**How to apply:** New public pages must have build-time HTML and route-specific metadata. Keep private data out of generated files. Include public chunk styles in the initial HTML, not only after hydration, and keep initial animation states from hiding content when JavaScript is unavailable.