# Anton-Regular.woff2

The Latin subset of **Anton** — the exact file `next/font/google` serves for
`--font-display`, lifted out of `.next/static/media/` so the Blender pipeline
does not depend on a build directory that gets deleted.

Blender's FreeType loads woff2 directly, so the 3D labels are set in the same
font file the page is set in, rather than a lookalike.

Anton is licensed under the SIL Open Font License 1.1.

Re-copy it if the font subset ever changes:

```bash
grep -o 'url("[^"]*")' '.next/dev/static/chunks/'*anton*.css   # find the Latin subset
```
