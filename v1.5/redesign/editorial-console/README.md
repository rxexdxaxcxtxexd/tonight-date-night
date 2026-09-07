# Editorial Console redesign

Branch: `v1.5-editorial-console`

This is the V1.5 visual redesign overlay for the live For Us application. It intentionally preserves the existing product architecture, auth boundary, private After Hours behavior, date filtering logic, pass-the-phone matching, and keepsake logic while replacing the visual language and tightening selected copy.

## Creative direction

The system follows the approved mix:

- 60% refined editorial design
- 25% tactile Braun / hi-fi control language
- 10% boutique-hotel / concierge ephemera
- 5% retro digital / night-drive accent

The core visual split is deliberate:

- **Setting the date:** tactile warm-machine console, physical controls, precise labels, inset surfaces, operational clarity.
- **Experiencing the date:** open editorial layouts, oversized serif typography, numbered story structure, itinerary/concierge rules and metadata.
- **After Hours:** a separate restrained night-drive register so the private lane feels distinct without becoming a different product.

## Palette

- paper / warm ivory: `#efe8dc`
- secondary paper: `#e4dacd`
- console surface: `#d9cfc2`
- espresso ink: `#2b211d`
- oxblood: `#64252d`
- muted plum: `#654957`
- night espresso: `#241b18`
- cream: `#f8f1e8`

Chrome/metal is intentionally implied through borders, highlights, inset shadows, and neutral gray-beige surfaces rather than literal reflective gradients.

## Typography

No external font dependency is required. The redesign uses a high-quality system/editorial fallback stack:

- editorial: Iowan Old Style / Palatino / Baskerville / Georgia
- system UI: Apple / Helvetica Neue / Arial

This avoids a remote font privacy/dependency while keeping the art direction intact on iPhone.

## Files

- `apps/web/src/App.tsx` — copy and hierarchy refinements plus unchanged application behavior
- `apps/web/src/styles.css` — full redesign system across auth, home, discovery, Together, reveal, active date, keepsakes, backstage, After Hours, navigation, and accessibility states

These are **overlay files**, not a standalone app copy. They are meant to replace the same two files in the verified production source tree.

## Design decisions worth reviewing

1. Home uses a warm tactile control object rather than a card dashboard.
2. Discovery drops the generic card-deck feel in favor of an editorial numbered list.
3. Date detail becomes a magazine-like reveal with a large issue number and restrained itinerary metadata.
4. Active date mode strips down to one editorial stage at a time.
5. Keepsakes are treated as archive objects rather than social-feed cards.
6. Backstage stays operational and quiet.
7. After Hours becomes near-black espresso with oxblood accents; no pink romantic styling.
8. Motion stays in Framer Motion but the visual system is designed to work with restrained transitions and `prefers-reduced-motion`.

## Safety / deployment

Do not deploy this branch over production until:

- exact `npm test` passes
- exact `npm run build` (`tsc -b && vite build`) passes
- mobile visual smoke test passes at 390px width
- Google auth flow remains untouched and healthy
- private After Hours state/persistence behavior remains unchanged

The current production version remains the rollback target until the redesign is accepted.
