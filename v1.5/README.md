# For Us V1.5

Private, mobile-first date experience app for two people. The product goal is to make planning feel like a recurring gift: budget-first discovery, three materially different options, staged surprise, low-friction date playback, keepsakes, and an optional private intimacy lane.

## Status

This is the implementation scaffold created before final infrastructure integration. The original vinyl app is preserved unchanged as the First Album archive.

## Architecture

- `apps/web` — React + TypeScript PWA shell
- `apps/api` — FastAPI private API
- `schemas` — application and Hermes publishing contracts
- `content/fixtures` — non-sensitive prototype content
- `archive/first-album` — original app archive
- `scripts` — deterministic validation utilities
- `docs` — implementation plan and decision log

## Privacy principles

- Intimate private answers never go to Hermes or external model providers.
- Unmatched private answers are session-only and are not persisted.
- Shared plans, preferences, and approved keepsakes belong in private application storage.
- No secrets or personal profile data belong in the public repository or client bundle.

## Current implementation snapshot

The scaffold includes the core date loop, Together pass-the-phone matching, PWA/offline foundation, SQLite persistence, sanitized private-media storage abstraction, and the optional Flirty/Closer/Spicy/Late Night lane. See `docs/implementation-status.md` and `docs/code-review.md` for current gates and deferred environment work.

## Desktop / new-session handoff

Resume this project rather than restarting discovery. The north star is delight, excitement, love, and care. It is a private product for Luke and Ava, not a public SaaS product. The interface should feel like a premium tactile Play Object; Hermes is an invisible producer backstage, not a chatbot in the girlfriend-facing experience.

Hard constraints already decided: budget is selected before discovery and is a hard ceiling; childcare is excluded from date budget; typical dates start around Creve Coeur and run about 3–4 hours or less; weeknight drive target is roughly 30 minutes; preparation should normally be <=30 minutes; at-home dates have equal status with outings; one optional photo per completed date; Google calendar access should be narrow; Together and After Hours initially use pass-the-phone on one device.

Do not send private intimacy answers, intimacy ceilings, rejected topics, or inferred sexual preferences to Hermes. Only mutual Yes + Yes overlaps surface. Maybe is never treated as Yes. No relationship score, compatibility score, sexual reward mechanics, or pressure mechanics.

Continue autonomously on implementation and testing. Remaining integration items requiring Luke are Google auth/allowlist values for Luke and Ava, deployment/HTTPS environment, GitHub integration (now connected), and the actual Hermes installation/runtime. Do not block unrelated engineering work on those items.