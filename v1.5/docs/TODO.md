# For Us V1.5 — Remaining TODO

Updated: 2026-09-06

## Current production state

- [x] HTTPS live: `https://forus-date.duckdns.org`
- [x] Google OAuth callback fixed: `https://forus-date.duckdns.org/auth/google/callback`
- [x] Isolated Linux service user `forus` exists
- [x] `/opt/for-us` and `/var/lib/for-us` exist
- [x] Protected production env file exists and Google OAuth credentials were provisioned directly on the VPS
- [x] Allowed identities are Luke + Ava only
- [x] Hermes runtime/profile/cron/API inventory completed
- [x] Hermes webhook intentionally remains disabled
- [x] First VPS deployment attempt completed through the production-build gate
- [x] Runtime-v1 bundle integrity passed on VPS
- [x] API dependency install passed on VPS
- [x] Python tests passed on VPS: 24/24
- [x] Frontend dependency install passed on VPS
- [x] Node test suite passed when run with `node --test`
- [x] First production build failure isolated to missing Vite client type declaration; service correctly remained stopped/disabled
- [x] Hotfix committed: `deploy/hotfix-001/apps/web/src/vite-env.d.ts`
- [x] Frontend `test` script aligned to `node --test tests/*.test.mjs`
- [x] COG resume runbook committed: `deploy/COG-RESUME-001.md`

## P0 — Finish deployable source

- [x] Produce a clean, secret-free V1.5 deployment snapshot on `v1.5-foundation` under `deploy/runtime-v1`
- [x] Byte-verify the deployment bundle: Base64 `73428` bytes, ZIP `55070` bytes, SHA-256 `5605c5af27f66df0c9487eb85f06d68079970dbd04342d26777033ca8ee7b2a3`
- [x] Add `deploy/runtime-v1/MANIFEST.md` with deterministic reconstruction/integrity gates
- [x] Ensure frontend bundle has package metadata, React/Vite source, PWA manifest/service worker, icons, and production build config
- [x] Ensure backend bundle has FastAPI source, requirements, SQLite store, auth/session layer, private media layer, producer endpoints, and tests
- [x] Include production env template with no real secrets
- [x] Include systemd/nginx deployment contract matching the live VPS
- [x] Run current backend tests: 24/24 passing
- [x] Run current Node logic tests: 4/4 passing locally
- [x] Compile Python source and parse JSON schemas/fixtures successfully
- [ ] Re-run `npm test` and `npm run build` on VPS with hotfix-001 applied; this is the current hard gate

## P1 — Deploy and verify auth

- [x] Commit `deploy/COG-DEPLOY.md` with the first-deployment runbook and rollback/secret-safety gates
- [x] Reconstruct + verify runtime bundle on the VPS
- [x] Sync V1.5 source to `/opt/for-us`
- [x] Ensure non-secret runtime paths/cookie settings are present in `/etc/for-us/for-us-api.env`
- [x] Create `/opt/for-us/.venv` and install API dependencies
- [x] Run Python tests on the exact VPS deployment
- [x] Install frontend dependencies
- [ ] Re-run Node tests using the corrected `npm test`
- [ ] Build frontend into `/opt/for-us/apps/web/dist`
- [ ] Reconcile `for-us-api.service` with the checked-in service example
- [ ] Confirm API binds only to `127.0.0.1:8650`
- [ ] Start + enable `for-us-api.service` only after tests/build pass
- [ ] Verify loopback `/health`
- [ ] Verify HTTPS app and API through nginx
- [ ] Verify unauthenticated `/api/auth/me` returns 401
- [ ] Verify `/auth/google/start` initiates Google OIDC correctly
- [ ] Verify Google login succeeds for Luke
- [ ] Verify Google login succeeds for Ava
- [ ] Verify a third Google identity is rejected
- [ ] Verify logout/session expiry and secure cookie behavior

## P2 — Hermes integration

- [ ] Create isolated Hermes `forus` profile with empty memory and no inherited platform credentials
- [ ] Create `/home/openclaw/forus/AGENTS.md` integration contract + schemas
- [ ] Install profile-local `forus-date-curator` skill
- [ ] Generate independent `FOR_US_PRODUCER_TOKEN`; do not reuse Hermes API key
- [x] For Us backend producer publish/update endpoints exist with strict application validation
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
- [ ] Lock frontend dependency versions/package lock after the first known-good production build
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
