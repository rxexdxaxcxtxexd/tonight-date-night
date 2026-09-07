# For Us — Editorial Console V2

Status: active redesign branch; production remains untouched.

## Creative adjustment

V1 was intentionally quiet and typography-led. V2 keeps the same private-club/editorial foundation but increases **chromatic richness, material depth, motion, atmosphere, and moments of delight** without turning the app into a flashy consumer product.

The target is now:

- 45% editorial culture magazine
- 25% tactile Braun / hi-fi object
- 15% boutique-hotel ephemera
- 10% cinematic night atmosphere
- 5% retro signal UI

The core phrase is **warm machine by day, cinematic object by night**.

## Color system

### Foundation
- bone `#F2EADF`
- cream `#FFF7ED`
- paper `#E8DCCD`
- deep paper `#D6C2AA`
- ink `#281D1A`

### Emotional accents
- oxblood `#742633` — primary action / selected state
- wine `#541A27` — depth, press states
- plum `#4B3146` — Together / intimacy-adjacent atmosphere
- rosewood `#99535E` — editorial accent
- signal coral `#FF7B52` — tiny live-state / active markers only
- amber `#D68E32` — practical warning / stage signal
- sage `#7B8C74` — readiness, practical success, backstage

Chrome remains a material treatment, not a theme color.

## Material system

### Console surfaces
Warm putty/taupe housings, inset dividers, soft chrome controls, oxblood selected pills, subtle inner highlight. Hardware details should imply a physical object but never become literal skeuomorphism.

### Editorial surfaces
Paper, grain, large serif type, asymmetry, poster-like color fields, thin rules, reservation-ticket metadata, oversized issue numbers.

### Night surfaces
Deep plum/brown-black backgrounds, coral-to-amber signal light, warm cream text, low-intensity grain. Used only after the date begins and in the private lane.

## Screen treatments

### 1. Home / Date Setup — `PRIVATE CONSOLE`
- oversized editorial question
- warm molded console body
- chrome budget control
- oxblood active budget capsule
- 2×2 constraint instrument grid
- small coral live-fit LEDs
- subtle button light sweep
- ambient color field behind the hardware

Feeling: **beautiful thing on a nightstand**.

### 2. Discovery / Tonight's Edit
- three invitations become three different editorial objects, not identical cards
- familiar-with-a-twist = cream / wine
- adjacent discovery = rose / plum
- wildcard = sage / tobacco
- numbers remain large and collectible
- metadata stays practical and compact

Feeling: **an editor handing you three covers**.

### 3. Together
- overlapping identity discs and subtle plum atmosphere
- reactions stay private and visually quiet
- the mutual-match state gets one focused reveal instead of gamified confetti

Feeling: **private ritual, not voting game**.

### 4. Date Reveal — `EDITORIAL RENDEZVOUS`
- a large abstract/cinematic poster field appears before the title
- oversized issue number inside the poster
- one-line editorial promise embedded in the art
- itinerary metadata rendered like a concierge ticket
- practical readiness shown in a separate sage-tagged module
- strongest chromatic moment before the date begins

Feeling: **the cover story for tonight**.

### 5. Active Date — `NIGHT MODE`
- full screen shifts into deep wine/plum night palette
- glowing stage orb = current state, not decoration
- progress line transitions coral → amber
- one stage only; content gets physically larger and calmer
- active button flips to warm cream for contrast

Feeling: **night-drive dashboard + magazine typography**.

### 6. Keepsakes
- warm editorial archive rather than a generic gallery
- memories alternate paper families very lightly
- First Album gets a dark oxblood/plum cover treatment
- photos should feel like printed inserts rather than app thumbnails

Feeling: **private annual, not camera roll**.

### 7. Luke Backstage
- operational editorial layout
- sage = ready
- amber = needs attention
- no charts, fake metrics, admin-dashboard chrome, or SaaS cards

Feeling: **producer clipboard behind the curtain**.

### 8. After Hours
- deliberately different surface: deep plum / brown-black
- no neon, pornographic visual language, hearts, or gamification
- warm privacy seals and muted peach light only
- mutual yes result remains quiet and consent-forward

Feeling: **private room, not a sex app**.

## Motion system

Motion must imply state, tactility, anticipation, and care.

### Persistent micro-motion
- signal LED breath: 3.2 s, extremely low amplitude
- ambient color field drift: 8 s alternate
- active-stage orb breath: 4.2 s

### Interaction motion
- hardware controls depress 1–2 px and spring back
- selected capsules settle with 180–220 ms material easing
- chrome knob arrives with a 600–700 ms damped settle
- invitation objects lift ~3 px on hover / tactile press inversion on touch

### Reveal motion
1. old screen compresses by ~1.5%
2. paper field fades through warm bone
3. poster color field opens vertically
4. issue number fades/slides 12 px
5. title follows 90 ms later
6. metadata ticket follows 120 ms later

Total: roughly 650–850 ms. Never theatrical.

### Active stage transition
- previous stage falls back 8 px + fades
- progress line advances first
- orb blooms
- next headline resolves upward by 10–12 px

The movement should create a small moment of anticipation before each reveal.

### Reduced motion
Every ambient animation is disabled under `prefers-reduced-motion`. Screen changes keep state hierarchy without simulated camera motion.

## Visual delight rules

Delight comes from:
- tiny active LEDs
- one chrome control, not chrome everywhere
- subtle moving light across the primary button
- collectible issue numbering
- chromatic poster fields unique to each invitation
- night-mode transformation once a date starts
- tactile spring response
- physical-looking reservation/itinerary metadata

Do not use:
- confetti
- generic gradients across every component
- glassmorphism
- sparkle icons
- heart motifs
- random floating blobs
- high-frequency animation
- gratuitous 3D

## Implementation artifact

`apps/web/src/styles-v2.css` contains the first full V2 visual-system implementation against the current React class structure. It is intentionally parallel to the current stylesheet until visual approval. It covers Home, invitation stack, Together, reveal, active date, Keepsakes, Backstage, After Hours, navigation, motion, and reduced-motion behavior.

## Next integration gate

After visual approval:

1. fold the V2 styles into the live redesign stylesheet;
2. add any small markup hooks needed for the poster/console hardware treatments;
3. run TypeScript + Vite build;
4. run Node privacy/Together tests;
5. deploy only to a preview/staging path first;
6. perform iPhone Safari motion/touch QA before production swap.
