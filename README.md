# Ink Ridge

Darren Ye's portfolio, styled as a Chinese ink-wash painting. Layers of sumi-e mountains recede behind the page, scrolling walks you into the range, and dragging across the paper lays down ink that bleeds along a slow current.

![The hero: Darren Ye above ink-wash ridges and a red sun](docs/screenshot.png)

## Running it

```sh
npm install
npm run dev        # local dev server
npm test           # unit tests
npm run build      # typecheck and production build into dist/
```

## Editing the content

Everything a visitor reads about the work is in [`src/content/projects.ts`](src/content/projects.ts): the three album leaves (name, Chinese title, pinyin, summary, stack, link), the four treasures and the contact link. The hero and section headings are in `index.html`.

## How the scene works

| Piece | File | What it does |
|---|---|---|
| Stage | `src/scene/stage.ts` | Renderer, camera, resize and the render loop. Skips frames in a hidden tab. |
| Ridges | `src/scene/ridgeProfile.ts`, `src/scene/ridges.ts` | Eight strips whose top edges follow layered sine noise. Each layer back sits higher and wider. |
| Ink wash | `src/scene/shaders/ridge.frag.glsl` | Ink pools at the ridge line and washes into mist below it, with dry-brush streaks. A layer fades out as the camera passes through it. |
| Atmosphere | `src/scene/atmosphere.ts` | The seal-red sun and the mist bands between layers. |
| Camera | `src/scene/cameraPath.ts`, `src/scene/cameraRig.ts` | Maps scroll progress to a walk 34 units into the range; the pointer leans the view. On phones the camera lifts so the ridges clear the stacked hero text. |
| Ink trail | `src/ink/flow.ts`, `src/ink/inkCanvas.ts` | A 2D canvas of drops carried by a flow field. Each drop spreads and fades over about 80 frames. |

Without WebGL the canvas is hidden and the page is still complete. With reduced motion turned on, the scene is drawn as a still that follows the scroll and the ink trail is off.

## Built with

TypeScript, three.js, Vite, Vitest, GitHub Actions. Deployed on Vercel.
