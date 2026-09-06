# For Us V1.5 — Deployment checkpoint

Saved: 2026-09-06

## Confirmed external state

- Public URL: `https://forus-date.duckdns.org`
- Google OAuth redirect: `https://forus-date.duckdns.org/auth/google/callback`
- VPS infrastructure exists: isolated `forus` user, `/opt/for-us`, `/var/lib/for-us`, nginx HTTPS, and `for-us-api.service` skeleton.
- Service remains intentionally disabled until deployable code lands.
- Protected server env is provisioned and passed validation; Google OAuth credentials are not stored in GitHub.
- Hermes webhook remains intentionally disabled until the app endpoint is verified end-to-end.

## Local source checkpoint

Authoritative working tree during this checkpoint: `/mnt/data/for-us-v1.5-live/for-us-v1.5/`.

It contains the React/Vite PWA, FastAPI API, Google OIDC/session code, private-media layer, SQLite storage, Hermes producer boundary, schemas, tests, docs, First Album archive, and deployment examples.

## Test checkpoint

Executed against the local working tree immediately before saving this checkpoint:

- Python: `24 passed`
- Node: `4 passed`

No production service has been started from this snapshot yet.

## Current execution priority

1. Finish a clean reproducible source snapshot on `v1.5-foundation`.
2. Reconcile production env names/systemd contract with COG's live `/etc/for-us/for-us-api.env` convention.
3. Build React/Vite production output and rerun tests/type checks.
4. Hand COG a deterministic deployment sequence for `/opt/for-us`.
5. Start service and validate Google login for both allowed accounts plus rejection of a third account.
6. Only then enable the isolated Hermes `forus` profile/webhook path.

See `docs/TODO.md` for the full remaining checklist.
