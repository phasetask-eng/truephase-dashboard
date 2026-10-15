# Hero loop pipeline

Every step runs headless through Blender's own Python (`/Applications/Blender.app/Contents/MacOS/Blender -b ... --python <script> -- <args>`), except the compositing pass, which uses the system `python3` with Pillow. There is no `ffmpeg` on the machine — step 6 uses the one Blender bundles.

| Step | Script | What it does |
|---|---|---|
| 1 | `01_build_animation.py IN.blend OUT.blend` | Writes the whole loop: 7 rings on a 6-slot stack, ring flight (slide out → tip → rise → close on top), stack drops, Rubik twist, tower lean, inner-face accent slot, world-height alpha fade. Every pose is a pure function of phase, so the loop seam is exact rather than tuned. |
| 2 | `02_service_labels.py IN.blend OUT.blend [font.woff2]` | Sets the seven short service labels into the blocks — one ring per service, on the half-face each block turns toward the camera. Each text object is a **child of its block**, so it inherits every transform. |
| 3 | `03_frame_camera.py IN.blend OUT.blend W H MARGIN` | Fits the camera so every block corner across the whole loop is inside the frame. |
| 4 | `04_qc.py FILE.blend` | Seam, ring integrity, collisions (SAT), twist discipline, one material per slot, sway returns to zero. Every number must be 0. |
| 5 | `05_render_frames.py FILE.blend OUTDIR N` | Renders N evenly spaced RGBA PNGs across the loop. ~3.5 s/frame at 1000². |
| 6 | `06_encode_video.py` | `composite` (python3): frames onto `--bg-page` `#efefed`. `encode` (Blender): PNGs → WebM (VP9) + MP4 (H.264). |

Outputs: `public/hero-tower.webm`, `public/hero-tower.mp4`, `public/hero-tower-still.webp` (frame 1 — poster and reduced-motion still).

## Two things that will bite

**The page colour is baked into the video.** If `--bg-page` changes, re-run step 6.

**Order faces by where they ARE, not where they POINT.** A block's face normal sits 46.5° off the block's own axis while the face itself sits only 12.5° off it. Sorting by normal interleaves neighbouring blocks and shuffles the service name into the wrong order; sorting by position keeps it readable. Step 2 asserts the readable blocks come out consecutive.

## Why four printable faces, and only the middle two used

Each block shows a shallow V of two flat faces, so a ring has twelve — but they alternate. Half sit on the outside of a ridge and face you; half form the *valley* between two blocks and are nearly edge-on. Measured against this camera the six nominally camera-facing ones run 52.9°, 85.8°, 7.1°, 25.8°, 67.2° and 34.2° off-axis, so only four blocks turn a usable face to the camera at all, at 53°, 7°, 26° and 34°.

A label takes the **middle one or two** of those four — the 7° face alone, or 7° plus 26° when it needs a second block. The outer faces stay blank, so the type reads as a mark on the object rather than a name chopped into syllables.

## The labels

| Ring | Service | Label | Blocks |
|---|---|---|---|
| graphite | AI Receptionist | `VOICE AI` | 2 — `VOICE` `AI` |
| ash | Appointment Scheduler | `BOOKING` | 1 |
| yellow | Review Management | `REVIEW MANAGEMENT` | 2 — `REVIEW`, `MANAGE`/`MENT` |
| mint | Task Automation | `AUTOMATION` | 2 — `AUTO` `MATION` |
| smoke | Web design & brand identity | `WEB DESIGN` | 2 — `WEB` `DESIGN` |
| white | AI video for social | `AI VIDEO` | 2 — `AI` `VIDEO` |
| mint | Chatbots | `CHATBOT` | 1 |

Twelve text objects in total. An assertion checks each row reconstructs its label exactly (ignoring spaces and the one line break) and that no label spans more than two blocks.

`MANAGEMENT` is the only word too long for a face: ten characters at the common cap height come to **120% of the flat width**. Shrinking it to fit made it a quarter smaller than every other label *and* ran it onto the bevel, so it is set over two lines instead and keeps the common cap height. The script asserts the guard never has to shrink anything.

## Typography

`blender/fonts/Anton-Regular.woff2` is **the exact file `next/font` serves** for `--font-display`, copied out of `.next/static/media/` so the pipeline does not depend on a build directory. Blender's FreeType loads woff2 directly, so the 3D labels are set in the same font file the page is — not a lookalike. Brand parameters come with it: uppercase, the single 400 weight, and the `-0.03em` tracking the display roles use (applied as Blender's `space_character = 0.881`).

**Cap height is fixed, width is not.** Fitting each fragment to the face width is what made the old lettering uneven — a two-letter piece set nearly twice the height of a six-letter one. Anton's cap is a constant 0.506em, so one size gives every label on every ring the same cap height (0.150 units, 24% of the face). Width is only a guard at 82%; with the two-line split nothing trips it — the widest single-line label, `CHATBOT`, lands at 75%.

Ink colour is picked per ring by **WCAG contrast**, not a lightness guess — the smoke ring flips the naive test and takes white at 5.4:1. Every other ring is 14–20:1.
