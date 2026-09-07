# For Us V1.5 — First production deployment

Date: 2026-09-06

## Result

Deployment completed successfully after `hotfix-001`.

- Bundle integrity: PASS
- API dependency install: PASS
- Python tests: 24 passed
- Frontend dependency install: PASS
- Node tests: 4 passed
- Production frontend build (`tsc -b && vite build`): PASS
- `for-us-api.service`: active + enabled
- Loopback health: PASS (`127.0.0.1:8650`)
- HTTPS frontend: PASS (`https://forus-date.duckdns.org/`)
- Unauthenticated auth gate: PASS (`/api/auth/me` -> 401)
- Google redirect initiation: PASS (`/auth/google/start` -> Google)
- Port 8650 exposure: loopback-only
- Isolation/permissions: PASS

## Deployment deviation

After promotion, nginx initially returned 500 because `/opt/for-us` was mode `700`, preventing the `www-data` worker from traversing to `apps/web/dist` despite group membership. `/opt/for-us` was restored to mode `750`. Private data and environment isolation were not weakened:

- `/var/lib/for-us`: `700 forus:forus`
- `/etc/for-us/for-us-api.env`: `600 root:root`
- `/etc/for-us`: `750 root:forus`

`openclaw` remains unable to read the private data directory or protected environment file.

## Intentionally not enabled yet

- Hermes webhook
- Hermes `forus` profile
- Hermes curator jobs
- `FOR_US_PRODUCER_TOKEN`

Because `FOR_US_PRODUCER_TOKEN` remains unset, `/api/agent/*` and `/api/producer/*` correctly fail closed rather than accept producer traffic.

## Next gate

Perform live browser authentication verification:

1. Luke Google account signs in successfully.
2. Ava Google account signs in successfully.
3. A third/unapproved Google account is rejected.
4. Logout/session persistence and secure-cookie behavior are verified.

Only after this auth gate passes should Hermes integration begin.
