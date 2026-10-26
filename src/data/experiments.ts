import type { Locale } from "../i18n/home";
import type { PAGE_PAIRS } from "../lib/seo";

interface ExperimentCopy {
  title: string;
  description: string;
  imageAlt: string;
  intro: string;
  facts: { label: string; value: string }[];
  sections: { title: string; text: string }[];
}
export interface Experiment {
  slug: string;
  pageKey: keyof typeof PAGE_PAIRS;
  date: string;
  image: string;
  socialImage: string;
  video: string;
  demoUrl: string;
  sourceUrl: string;
  tags: string[];
  copy: Record<Locale, ExperimentCopy>;
}

export const experiments: Experiment[] = [{
  slug: "werkworker-tetris",
  pageKey: "tetris",
  date: "2026-10-26",
  image: "/lab/tetris/poster.webp",
  socialImage: "/lab/tetris/social.png",
  video: "/lab/tetris/gameplay.mp4",
  demoUrl: "https://philipbodenbach.github.io/werkWorker/experiments/tetris/",
  sourceUrl: "https://github.com/philipbodenbach/werkWorker/blob/main/docs/experiments/tetris/index.html",
  tags: ["werkWorker", "Werk1112", "HTML Canvas"],
  copy: {
    de: {
      title: "Tetris auf kariertem Papier.",
      description: "Ein lokaler Coding-Agent baut ein Tetris-Spiel: Buntstift-Optik, Filmkorn und synthetischer Sound – in einer einzigen HTML-Datei. Entstanden mit werkWorker und Werk1112.",
      imageAlt: "Tetris-Spiel mit farbigen, schraffierten Steinen auf kariertem Papier",
      intro: "Wie sieht ein kleines Browser-Spiel aus, das mit einem lokalen Modell und einem Coding-Agent entsteht? Dieser Versuch mit werkWorker und Werk1112 liefert ein spielbares Tetris im Skizzenbuch-Stil.",
      facts: [
        { label: "Agent", value: "werkWorker · coding-basic" },
        { label: "Inferenz", value: "Werk1112 · llama.cpp · CUDA" },
        { label: "Modellkennung", value: "qwen3.8-27b-ud-q4_k_xl" },
        { label: "Ergebnis", value: "Eine HTML-Datei · Canvas · Web Audio" },
      ],
      sections: [
        { title: "Das Ergebnis", text: "Das Spiel kombiniert schraffierte Spielsteine, kariertes Papier und animiertes Filmkorn. Vorschau, Punktestand, Level, Pause, Soundeffekte und zuschaltbare Musik sind in der HTML-Datei enthalten. Grafik und Ton entstehen im Browser; externe Bibliotheken oder ein Backend werden zum Spielen nicht benötigt." },
        { title: "Ein dokumentierter Einzelversuch", text: "Die Zuordnung von Modell, Runtime und Agent-Profil stammt aus den Aufnahmen der Sitzung. Das Gameplay-Video zeigt einen kurzen Ausschnitt des Ergebnisses. Der vollständige ursprüngliche Prompt und das komplette Sitzungsprotokoll sind hier nicht dokumentiert; der Versuch ist kein Modellvergleich oder Benchmark." },
        { title: "Originalzustand und Grenzen", text: "Die veröffentlichte Demo ist eine unveränderte Kopie des erzeugten HTML-Artefakts. Sie ist auf Desktop und Tastatur ausgelegt und hat keine Touch-Steuerung. Die feste Spielfeldgröße kann auf kleinen Bildschirmen abgeschnitten werden. Das Artefakt dokumentiert diesen Stand einschließlich möglicher Spiellogik- und Darstellungsfehler." },
      ],
    },
    en: {
      title: "Tetris on graph paper.",
      description: "A local coding agent builds Tetris: coloured-pencil graphics, film grain and synthesised audio, all in one HTML file. Created with werkWorker and Werk1112.",
      imageAlt: "Tetris with colourful, pencil-hatched blocks on graph paper",
      intro: "What does a small browser game built with a local model and a coding agent look like? This experiment with werkWorker and Werk1112 produced a playable Tetris with a sketchbook aesthetic.",
      facts: [
        { label: "Agent", value: "werkWorker · coding-basic" },
        { label: "Inference", value: "Werk1112 · llama.cpp · CUDA" },
        { label: "Model identifier", value: "qwen3.8-27b-ud-q4_k_xl" },
        { label: "Output", value: "One HTML file · Canvas · Web Audio" },
      ],
      sections: [
        { title: "The result", text: "The game combines pencil-hatched blocks, graph paper and animated film grain. A piece preview, score, levels, pause, sound effects and optional music are all included in the HTML file. Graphics and audio are generated in the browser; playing requires no external libraries or backend." },
        { title: "A documented individual experiment", text: "The model, runtime and agent profile are identified from the session screenshots. The gameplay recording shows a short excerpt of the result. The full original prompt and complete session transcript are not documented here; this is not a model comparison or benchmark." },
        { title: "Original output and limitations", text: "The published demo is an unchanged copy of the generated HTML artifact. It targets desktop keyboard input and has no touch controls. Its fixed playfield may be clipped on small screens. The artifact preserves this state, including possible gameplay and rendering bugs." },
      ],
    },
  },
}];

export function experimentPath(experiment: Experiment, locale: Locale) {
  return `${locale === "en" ? "/en" : ""}/lab/${experiment.slug}/`;
}
