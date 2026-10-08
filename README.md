# LOST & FOUND
*Every object has a story. Some stories should remain lost.*

First-person mystery prototype built with Three.js + Vite. Night-shift clerk at a railway station Lost & Found; seven shifts, four endings.

## Run (VS Code)
1. Install Node.js 18+. Open this folder in VS Code, open a terminal.
2. `npm install`  3. `npm run dev` and open the printed URL. Production build: `npm run build`.

## Controls
WASD move · Shift sprint · Mouse look · E / Left click interact · F flashlight · I inventory · Tab evidence board · Esc pause.

## Structure
`src/world` scene and item models · `src/story` shift data and endings · `src/save` local saves/settings · `src/audio` procedural audio · `src/main.js` game flow and UI.

## Not yet implemented
Additional locations, NPC dialogue trees, security cameras, full 15-case set, resolution picker, key rebinding. Gameplay was not browser-tested.
