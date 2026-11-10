# Third-party notices

The Truephase AI website is built with the open-source and freely licensed
software below. Each is used under its own licence, reproduced or linked here
as those licences require. The production bundle strips licence banners, so
this file is the notice.

## Runtime (shipped to the browser)

| Package | Version | Licence | Copyright |
| --- | --- | --- | --- |
| Next.js (`next`) | 16.3.8 | MIT | Copyright (c) 2025 Vercel, Inc. |
| React (`react`, `react-dom`, `scheduler`) | 19.2.0 | MIT | Copyright (c) Meta Platforms, Inc. and affiliates |
| GSAP (`gsap`, `@gsap/react`) | 3.15.0 / 2.1.2 | GSAP Standard "no charge" License, https://gsap.com/standard-license | Copyright (c) 2008-2026 GreenSock / Webflow. All rights reserved. |
| Lenis (`lenis`) | 1.3.26 | MIT | Copyright (c) 2024 darkroom.engineering |

Next.js bundles small MIT, ISC, BSD-3-Clause, 0BSD and Apache-2.0 helpers
(`styled-jsx`, `@swc/helpers`, `nanoid`, `picocolors`, `source-map-js`,
`tslib`, `detect-libc`, `baseline-browser-mapping`) and `caniuse-lite` data
(CC-BY-4.0). Their notices are in `node_modules/<package>/LICENSE`.

## Fonts

Served from this domain, subset at build time by `next/font`.

| Font | Licence | Copyright |
| --- | --- | --- |
| Anton | SIL Open Font License 1.1 | Copyright 2020 The Anton Project Authors (https://github.com/googlefonts/AntonFont.git) |
| Inter | SIL Open Font License 1.1 | Copyright 2016 The Inter Project Authors (https://github.com/rsms/inter) |
| JetBrains Mono | SIL Open Font License 1.1 | Copyright 2020 The JetBrains Mono Project Authors (https://github.com/JetBrains/JetBrainsMono) |

The OFL text is in `blender/fonts/OFL.txt`. Anton is also embedded in the
rendered hero video, which the OFL permits.

## Build-time only (not shipped)

Tailwind CSS (MIT), PostCSS (MIT), Autoprefixer (MIT), TypeScript (Apache-2.0),
ESLint (MIT), `eslint-config-next` (MIT), `@types/*` (MIT), lightningcss
(MPL-2.0, unmodified), axe-core (MPL-2.0, unmodified). Platform binaries for
`sharp` link LGPL-3.0 libvips dynamically and are unmodified.

## MIT licence text

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions: The above copyright
notice and this permission notice shall be included in all copies or
substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS",
WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR
THE USE OR OTHER DEALINGS IN THE SOFTWARE.
