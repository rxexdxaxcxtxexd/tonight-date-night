# For Us V1.5 — Implementation Status

## Implemented now

### Core date experience
- Mobile-first Play Object UI foundation
- Budget-first occasion setup with hard ceilings
- Time / home-out / energy constraints
- For You, Together, and Surprise Us modes
- Surprise Us one-choice draw
- Maximum-surprise versus full-detail disclosure
- Three-slot diversified discovery
- Selected invitation reveal with practical facts and fallback
- One-stage-at-a-time active date playback
- Active-plan restoration after refresh for offline continuity
- Optional stage prompts
- Luke-only Backstage checklist shell
- Keepsakes with one sentence, one optional photo, and replay preference
- First Album archive entry

### Together mode
- Same-device pass-the-phone date matching
- Ava reacts privately, then Luke receives the same shortlist
- Not tonight / Maybe / Yes reactions
- Only mutual Yes + Yes invitations are revealed
- Maybe and No never surface to the other person
- No-match is treated as a valid result with no winner/loser framing
- Together-round answers are component memory only and are never persisted

### Private lane
- Flirty / Closer / Spicy / Late Night ceilings
- Lower of the two private ceilings always wins
- 32 prototype discussion prompts, eight per tier; human editorial review remains a release gate
- Eight-card balanced private round generated from eligible tiers
- Only mutual Yes + Yes discussion openings surface
- Maybe never becomes a match
- No intimate-answer persistence
- Visibility privacy curtain when the app backgrounds
- 45-minute session expiry clears private answers
- Explicit clear-and-leave action throughout

### PWA / offline foundation
- Web app manifest
- iPhone/Home Screen metadata
- 192px and 512px app icons
- Service worker with navigation fallback and runtime static-asset caching
- Selected active plan and current stage restored from general local persistence
- After Hours and Together private answers excluded from persistence

### Backend foundation
- FastAPI occasion -> choice -> plan -> reveal -> keepsake vertical slice
- Server-side budget/time/location/energy eligibility
- SQLite application storage replacing in-memory-only state
- Typed JSON record persistence for occasions, plans, and keepsakes
- Private-media abstraction for a future authenticated photo route
- Restricted producer publication endpoint guarded by a server-side token
- Publication freshness, fallback, evidence, and mandatory-cost validation
- Latest-publication retrieval for the producer control plane
- Photo re-encoding, max dimension, randomized keys, and EXIF/GPS removal
- Invalid images and path-like media keys rejected

## Automated checks in latest local review
- Backend / date engine / storage / media / producer publication: **15 pytest tests passed**
- Node private-round + Together overlap: **4 tests passed**
- TypeScript source type-check passed using temporary React/Framer shims because npm package installation was unavailable in that environment
- Service worker syntax passed
- Manifest JSON parse passed

## Next implementation block
1. Auth/session skeleton and resource-level authorization contracts, with account values left blank until Luke and Ava are connected
2. Authenticated private photo upload/download routes using the completed media abstraction
3. Convert latest verified producer publication into the live invitation catalog
4. Add replay/cooldown history to deterministic curation
5. Accessibility / keyboard / VoiceOver-focused review
6. Full React production build and browser automation once dependencies can be installed
7. Physical iPhone PWA/offline/privacy-curtain QA
8. Connect prepared Hermes skills/jobs after the actual installation is available

## Deferred until environment connection
- OS/VPS deployment details
- HTTPS/domain decisions
- Actual Google OAuth client configuration
- Luke and Ava allowlist values
- Hermes/Hermex credentials and runtime integration