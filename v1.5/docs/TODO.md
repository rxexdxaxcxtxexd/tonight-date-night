# For Us V1.5 — Remaining TODO

Updated: 2026-09-06

## Current production state

- [x] HTTPS live: `https://forus-date.duckdns.org`
- [x] Google OAuth callback fixed: `https://forus-date.duckdns.org/auth/google/callback`
- [x] Isolated Linux service user `forus` exists
- [x] `/opt/for-us` and `/var/lib/for-us` exist
- [x] `for-us-api.service` skeleton exists but remains intentionally disabled
- [x] Protected production env file exists and Google OAuth credentials were provisioned directly on the VPS
- [x] Allowed identities are Luke + Ava only
- [x] Hermes runtime/profile/cron/API inventory completed
- [x] Hermes webhook intentionally remains disabled

## P0 — Finish deployable source

- [ ] Complete a clean, reproducible V1.5 source snapshot on `v1.5-foundation`
- [ ] Ensure frontend has package metadata, React/Vite source, PWA manifest/service worker, icons, and production build config
- [ ] Ensure backend has FastAPI source, requirements, SQLite store, auth/session layer, private media layer, producer endpoints, and tests
- [ ] Include production env template with no real secrets
- [ ] Include systemd/nginx deployment contract matching the live VPS
- [ ] Run backend tests and frontend/unit/type checks against the exact snapshot being deployed

## P1 — Deploy and verify auth

- [ ] Sync V1.5 source to `/opt/for-us`
- [ ] Create `/opt/for-us/.venv` and install API dependencies
- [ ] Install/build frontend into `/opt/for-us/apps/web/dist`
- [ ] Reconcile `for-us-api.service` with the checked-in service example
- [ ] Confirm API binds only to `127.0.0.1:8650`
- [ ] Start + enable `for-us-api.service`
- [ ] Verify loopback `/health`
- [ ] Verify HTTPS app and API through nginx
- [ ] Verify Google login succeeds for Luke
- [ ] Verify Google login succeeds for Ava
- [ ] Verify a third Google identity is rejected
- [ ] Verify logout/session expiry and secure cookie behavior

## P2 — Hermes integration

- [ ] Create isolated Hermes `forus` profile with empty memory and no inherited platform credentials
- [ ] Create `/home/openclaw/forus/AGENTS.md` integration contract + schemas
- [ ] Install profile-local `forus-date-curator` skill
- [ ] Generate independent `FOR_US_PRODUCER_TOKEN`; do not reuse Hermes API key
- [ ] Configure For Us backend producer publish/update endpoints with strict schemas and `additionalProperties: false`
- [ ] Enable Hermes webhook only after the app endpoints are healthy
- [ ] Configure one HMAC-signed For Us webhook subscription
- [ ] Add weekly Scout → Verify → Curate → Publish cron job
- [ ] Add selected-plan T-3h recheck flow
- [ ] Add conditional Luke notification for actionable changes only
- [ ] Confirm Hermes never receives After Hours answers, intimate matches, keepsake photos, or browser/session auth tokens
- [ ] Run an end-to-end synthetic publication and recheck test

## P3 — Product hardening

- [ ] Feed latest verified producer publication into the live invitation catalog
- [ ] Persist replay/cooldown history and apply it to deterministic curation
- [ ] Replace prototype localStorage photo persistence with authenticated private media routes
- [ ] Accessibility pass: keyboard, focus order, semantics, contrast, large text, reduced motion
- [ ] Re-run production code review after deployment wiring

## P4 — Physical iPhone acceptance

- [ ] Safari login + logout
- [ ] Add to Home Screen / standalone launch
- [ ] PWA shell/offline recovery
- [ ] Active-date refresh recovery
- [ ] Background/app-switch privacy curtain for After Hours
- [ ] 45-minute private-round expiry
- [ ] One-photo upload/view/delete path
- [ ] VoiceOver smoke test
- [ ] Large Text smoke test
- [ ] Confirm no intimate answers survive refresh/session clear

## Definition of done

For Us is private to Luke + Ava, deploys reproducibly from GitHub, Google auth is enforced server-side, Hermes can publish/recheck ordinary date plans through a narrow producer boundary, private intimacy answers never leave the client/private module, and the iPhone PWA passes the acceptance checklist above.
