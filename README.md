# philipbodenbach.de

Personal website built with Astro and Tailwind. German is served at `/`, English
at `/en/`. The shared `SiteLayout.astro` provides the header, footer, language
switch and persistent light/dark preference for the homepage and Lab.

## Development and verification

```sh
npm run dev -- --background
npm run build
npm run seo:audit
```

Stop the development server with `npm run astro -- dev stop`.

## Projects and Lab

- Project teasers: `src/data/projects.ts`.
- Experiment metadata and German/English copy: `src/data/experiments.ts`.
- Shared Lab labels: `src/i18n/lab.ts`.
- Teaser components: `TeaserCard.astro` and `LabTeaser.astro`.
- Lab overview: `/lab/` and `/en/lab/`.
- First experiment: `/lab/werkworker-tetris/` and `/en/lab/werkworker-tetris/`.
- Optional experiment briefs: `ExperimentBrief.astro` renders the `brief` field
  with the verbatim prompt, its language, reference image and source links.
  Surrounding text is translated; the original prompt is preserved in DE/EN.
- Optional technical reports: `ExperimentTechnical.astro` renders the localized
  `technical` field on an experiment (summary metrics, method, measurements,
  check limitations, request details, original evidence and data download).
- `ExperimentSystem.astro` displays an optional `technical.system` profile in
  the article header, before the prompt and result. Put GPU, CPU, physical RAM
  and execution environment here; keep later inventory dates explicit.

To add an experiment, add its metadata and both translations to the experiments
array, its DE/EN route pair to `PAGE_PAIRS` in `site.config.mjs`, and its public
media under `public/lab/`. The dynamic routes and overview use that data. Set the
experiment's `pageKey` to the new route-pair key so canonical URLs, language
switches, hreflang and sitemap entries stay aligned. Supply the actual output,
recorded setup and known limitations; do not invent prompts or measurements.

Playable artifacts belong to the corresponding product repository. Tetris lives
in `werkWorker/docs/experiments/tetris/index.html` and is linked directly on
GitHub Pages. Its original game UI is unchanged. No extra Lab repository or
embedded third-party player is used.

The homepage's project and Lab links expect the WerkWorker Pages site to be
published first. Website implementation and prepared deployment settings can be
reviewed locally before publication; no Git publication is part of preparation.

## Tetris media and X

`public/lab/tetris/` contains the 720×916 web video, poster and share image.
`reference.jpg` is the unchanged 677×680 JPEG supplied with the original Tetris
task, recovered from that session's single image attachment. The article includes
the user-supplied prompt verbatim and credits Mia AI's original experiment and
the accompanying X post. Prompt, image metadata and links live in the experiment's
`brief` field in `src/data/experiments.ts`.
The video is only loaded when requested and never autoplays. `social/werkworker-tetris/`
contains the higher-resolution X upload, DE/EN text drafts and preparation notes.
The `social/` directory is not copied into the public Astro build.

## Tetris measurements

`src/data/measurements/werkworker-tetris.json` is the shared numerical source for
the DE/EN report in `src/data/tetris-technical.ts` and the static download at
`/lab/werkworker-tetris/metrics.json`. The report does not query a session database
at build time. The two original terminal screenshots are in `public/lab/tetris/`.

See `src/data/measurements/README.md` for provenance and counter definitions.
Preserve the distinction between agent steps, model requests, tool calls, process
exit codes, and completed plan steps when adding experiments.

The JSON's `system_snapshot` records the hardware and installed software read
after the experiment. It drives both the DE/EN system cards and version details,
and is included in the same static download. Physical host RAM and memory visible
to WSL are different measurements; the original Werk top snapshot is retained.
