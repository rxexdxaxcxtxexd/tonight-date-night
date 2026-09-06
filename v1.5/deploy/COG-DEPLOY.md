# COG runbook — first For Us V1.5 deployment

Use this only for the first application deployment. Infrastructure already exists. Do not recreate or replace nginx, DuckDNS, TLS, the `forus` Unix user, `/var/lib/for-us`, or the existing protected OAuth environment unless a validation step proves something is wrong.

## Known live state

- public origin: `https://forus-date.duckdns.org`
- Google callback: `https://forus-date.duckdns.org/auth/google/callback`
- service user/group: `forus:forus`
- app destination: `/opt/for-us`
- data destination: `/var/lib/for-us`
- env file: `/etc/for-us/for-us-api.env`
- service: `for-us-api.service` (currently disabled/stopped on purpose)
- API bind: `127.0.0.1:8650`
- OAuth credentials are already present in the protected env file; never print them
- Hermes webhook remains disabled

## Deployment procedure

1. Fetch/checkout `rxexdxaxcxtxexd/tonight-date-night` branch `v1.5-foundation` into a temporary root-owned staging directory.
2. Reconstruct `v1.5/deploy/runtime-v1` exactly according to `MANIFEST.md`.
3. Require all of these gates before extraction:
   - Base64 size = `73428`
   - decoded ZIP size = `55070`
   - SHA-256 = `5605c5af27f66df0c9487eb85f06d68079970dbd04342d26777033ca8ee7b2a3`
   - `unzip -t` passes
4. Extract the ZIP into a new temporary staging directory. Verify at minimum these files exist:
   - `apps/api/app/main.py`
   - `apps/api/app/auth.py`
   - `apps/api/requirements.txt`
   - `apps/web/package.json`
   - `apps/web/src/App.tsx`
   - `apps/web/vite.config.ts`
   - `deploy/for-us-api.service.example`
5. Scan the staged application for obvious secret material before promoting it. It should contain placeholders only, never the live OAuth secret, session secret, or producer token.
6. Preserve any existing `/opt/for-us` as a timestamped rollback copy if it contains material. Promote the staged application into `/opt/for-us`, owned by `forus:forus` except where root ownership is intentionally needed.
7. Ensure these non-secret runtime values exist in `/etc/for-us/for-us-api.env` without printing any values:
   - `FOR_US_DB_PATH=/var/lib/for-us/for-us.db`
   - `FOR_US_MEDIA_DIR=/var/lib/for-us/media`
   - `FOR_US_PUBLIC_URL=https://forus-date.duckdns.org`
   - `FOR_US_COOKIE_SECURE=true`
   - `GOOGLE_OAUTH_REDIRECT_URI=https://forus-date.duckdns.org/auth/google/callback`
   Also verify the already-provisioned Google Client ID, Google Client Secret, allowed-email configuration, and session secret are non-empty. Never echo, cat, hash, partially reveal, or report secret values.
8. Create `/var/lib/for-us/media` if needed and ensure `/var/lib/for-us` is writable by the `forus` service account but not readable by `openclaw` beyond what the previously approved isolation policy allows.
9. Create `/opt/for-us/.venv` and install `apps/api/requirements.txt`.
10. Run API tests from `/opt/for-us` with `PYTHONPATH=apps/api pytest -q apps/api/tests`. Require all tests to pass.
11. In `/opt/for-us/apps/web`, install frontend dependencies using the package manifest and run the production build. Run the Node tests as well. A build failure is a hard stop; do not start the service.
12. Reconcile the existing `for-us-api.service` with `deploy/for-us-api.service.example`. Critical properties:
   - `User=forus`
   - `Group=forus`
   - `WorkingDirectory=/opt/for-us/apps/api`
   - `EnvironmentFile=/etc/for-us/for-us-api.env`
   - `ExecStart=/opt/for-us/.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8650`
   - writable path limited to `/var/lib/for-us`
13. Confirm nginx serves the frontend from `/opt/for-us/apps/web/dist` and proxies `/api/*` plus `/auth/*` to `127.0.0.1:8650`. Preserve the existing TLS hostname and other Hermes/COG virtual hosts.
14. Run `systemctl daemon-reload`, start `for-us-api.service`, and only enable it after the initial health checks pass.
15. Verify:
   - service is active
   - nothing is listening publicly on port 8650
   - `http://127.0.0.1:8650/health` returns `{"status":"ok"}`
   - `https://forus-date.duckdns.org/` serves the V1.5 frontend
   - unauthenticated `https://forus-date.duckdns.org/api/auth/me` returns 401
   - `/auth/google/start` redirects to Google rather than erroring
16. If all checks pass, enable `for-us-api.service` for boot persistence.
17. Stop. Do not enable the Hermes webhook, create the Hermes `forus` profile, or schedule curator jobs yet.

## Report back

Report only:

- bundle integrity: PASS/FAIL
- API dependency install: PASS/FAIL
- Python tests: PASS/FAIL + count
- frontend dependency install: PASS/FAIL
- Node tests: PASS/FAIL + count
- production frontend build: PASS/FAIL
- service state: active/inactive + enabled/disabled
- loopback health: PASS/FAIL
- HTTPS frontend: PASS/FAIL
- unauthenticated auth gate: PASS/FAIL
- Google redirect initiation: PASS/FAIL
- port 8650 exposure: loopback-only / problem
- isolation/permissions: PASS/FAIL
- any blocker, with relevant non-secret error text

Never report any OAuth secret, session secret, producer token, cookie value, or full protected environment contents.
