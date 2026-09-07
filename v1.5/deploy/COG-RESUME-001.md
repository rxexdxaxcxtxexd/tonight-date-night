# COG resume runbook — frontend build hotfix

The first deployment stopped correctly at the production frontend build gate because TypeScript could not resolve the side-effect CSS import.

## Source fixes now present on `v1.5-foundation`

Apply these two files from the repository to the staged/live source tree before rerunning gates:

1. `v1.5/deploy/hotfix-001/apps/web/src/vite-env.d.ts`
   - exact contents: `/// <reference types="vite/client" />`
   - fixes TypeScript/Vite client asset declarations, including side-effect CSS imports

2. `v1.5/deploy/hotfix-001/apps/web/package.json`
   - keeps `build` as `tsc -b && vite build`
   - aligns `test` with the actual test suite: `node --test tests/*.test.mjs`

Do not weaken or bypass the TypeScript build gate.

## Resume procedure

1. Fetch the latest `v1.5-foundation` branch.
2. Copy the two hotfix files above into:
   - `/opt/for-us/apps/web/src/vite-env.d.ts`
   - `/opt/for-us/apps/web/package.json`
3. In `/opt/for-us/apps/web`, run:
   - `npm install`
   - `npm test`
   - `npm run build`
4. If any command fails, hard stop and report the non-secret error text.
5. If the frontend tests and production build pass, resume `v1.5/deploy/COG-DEPLOY.md` at the service-reconciliation/start step.
6. Verify loopback health, HTTPS frontend, unauthenticated auth gate, Google redirect initiation, loopback-only port 8650, and isolation/permissions.
7. Enable `for-us-api.service` only if all health gates pass.
8. Stop before Hermes setup. Do not enable the Hermes webhook, create the `forus` profile, or schedule jobs yet.

## Report back

Return the same PASS/FAIL matrix used in `COG-DEPLOY.md`, with particular attention to:

- Node tests
- production frontend build
- service state
- loopback health
- HTTPS frontend
- unauthenticated auth gate
- Google redirect initiation
- port 8650 exposure
- isolation/permissions

Never print or reveal any OAuth secret, session secret, producer token, cookie, or protected environment value.
