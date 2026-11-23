# The scroll cube — pipeline

The section under the hero: a 3×3 cube of 26 separate cubies plus a core cross, exploded at frame 1 and perfectly assembled at frame 144. On the site, `CubeScroll` scrubs the frame index to scroll position, so scroll *is* the assembly and scrolling up takes it apart again along the same paths.

Source: `blender/truephase_cube.blend` (every piece is its own keyframed object). Regenerate from scratch with:

| Step | Script | What it does |
|---|---|---|
| 1 | `01_build_cube.py OUT.blend [frames] [seed]` | Geometry (cubies, rounded inset tiles, core), Truephase materials, lights, camera, and the assembly: centres first onto the core, then edges, then corners. Launches are sampled with an oriented-box collision test over **every frame** of the flight, so no piece ever passes through another. |
| 2 | `02_frame_camera.py IN OUT 1000 1000 0.02` | Fits the camera to the whole scrub — the exploded cloud sets the frame, the assembled cube ends up ~49% of its width. |
| 3 | `03_qc.py FILE.blend` | Final lattice exact, zero interpenetration, no piece ever moves away from home once launched. All must be 0. |
| 4 | `04_render_frames.py FILE.blend OUTDIR 144` | RGBA frames, ~2 s each at 1000². |
| 5 | `05_encode_frames.py OUTDIR public/cube 80` | One WebP per frame composited onto `--bg-page`; `f-000` is the exploded poster, `f-still` the assembled cube for reduced motion. |

## Things that bit while building this

- **Nested launch shells.** Starts are measured from the cube's centre (centres 2.0–2.5, edges 2.9–3.5, corners 3.8–4.5), not from each piece's home — otherwise a centre flies inward through a shell where an edge is still parked.
- **Launch within ~50° of the home ray.** Wider, and a piece has to cross the seat of a neighbour that arrives before it.
- **The tumble ends at 72% of the flight and the sideways bow is exactly zero from 70%.** The lattice gap is 0.045; a cubie 8° off-axis 0.04 from its seat clips neighbours.
- **No depth cap.** Three home rays point almost straight at the lens; a cap on how close a launch may come rejected every direction in their cone and the sampler never returned.
