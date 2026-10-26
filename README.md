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
The video is only loaded when requested and never autoplays. `social/werkworker-tetris/`
contains the higher-resolution X upload, DE/EN text drafts and preparation notes.
The `social/` directory is not copied into the public Astro build.
