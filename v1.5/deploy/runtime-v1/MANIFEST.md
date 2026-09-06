# For Us V1.5 runtime bundle manifest

This directory contains a **secret-free, byte-verified deployment bundle** for the first private V1.5 deployment.

## Canonical reconstruction order

Concatenate these files in this exact order, with no separators or added newlines:

```text
part00.b64
part01.b64
part02.b64
part03a.b64
part03b.b64
part04.b64
part05.b64
part06a.b64
part06b.b64
part07.b64
```

Expected reconstructed Base64 size: **73,428 bytes**

Expected decoded ZIP size: **55,070 bytes**

Expected ZIP SHA-256:

```text
5605c5af27f66df0c9487eb85f06d68079970dbd04342d26777033ca8ee7b2a3
```

The bundle was reconstructed and tested before publication; `unzip -t` reported no errors.

## Example reconstruction

From the repository root on `v1.5-foundation`:

```sh
cd v1.5/deploy/runtime-v1
cat part00.b64 part01.b64 part02.b64 part03a.b64 part03b.b64 part04.b64 part05.b64 part06a.b64 part06b.b64 part07.b64 > /tmp/for-us-runtime.b64
wc -c /tmp/for-us-runtime.b64
base64 -d /tmp/for-us-runtime.b64 > /tmp/for-us-runtime.zip
wc -c /tmp/for-us-runtime.zip
printf '%s  %s\n' '5605c5af27f66df0c9487eb85f06d68079970dbd04342d26777033ca8ee7b2a3' '/tmp/for-us-runtime.zip' | sha256sum -c -
unzip -t /tmp/for-us-runtime.zip
```

Do **not** extract into the live application directory until the byte counts, SHA-256, and ZIP integrity check all pass.

## Production destinations

- application: `/opt/for-us`
- Python venv: `/opt/for-us/.venv`
- SQLite data: `/var/lib/for-us/for-us.db`
- private media: `/var/lib/for-us/media`
- protected runtime environment: `/etc/for-us/for-us-api.env`
- FastAPI loopback bind: `127.0.0.1:8650`
- public origin: `https://forus-date.duckdns.org`

The runtime environment remains outside GitHub. Never copy production secrets into this repository or into the frontend bundle.

## Gate after deployment

The first deployment should stop after application build, tests, service health, HTTPS health, and Google sign-in verification. **Do not enable the Hermes webhook yet.** Hermes is a separate post-auth integration gate.
