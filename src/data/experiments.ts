import type { Locale } from "../i18n/home";
import type { PAGE_PAIRS } from "../lib/seo";
import type { TechnicalReport } from "./technical";
import { tetrisTechnical } from "./tetris-technical";

interface ExperimentCopy {
  title: string;
  description: string;
  imageAlt: string;
  intro: string;
  facts: { label: string; value: string }[];
  sections: { title: string; text: string }[];
}
export interface ExperimentBrief {
  prompt: string;
  promptLanguage: Locale;
  image: { src: string; width: number; height: number };
  links: { href: string; label: Record<Locale, string> }[];
  copy: Record<Locale, {
    label: string;
    title: string;
    intro: string;
    promptLabel: string;
    imageAlt: string;
    imageCaption: string;
    imageOpen: string;
  }>;
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
  brief?: ExperimentBrief;
  technical?: Record<Locale, TechnicalReport>;
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
  tags: ["WerkWorker", "Werk1112", "HTML Canvas"],
  brief: {
    prompt: "Build me a Retro Tetris game with film grain effects. The grain effect needs to be rolling when playing. Include game sound, optional music, and great graphic effects + movement. Use the referenced image.",
    promptLanguage: "en",
    image: { src: "/lab/tetris/reference.jpg", width: 677, height: 680 },
    links: [
      {
        href: "https://miaai-lab.github.io/Retro-Tetris-Fable-vs-Astra/",
        label: { de: "Originalexperiment von Mia AI", en: "Original experiment by Mia AI" },
      },
      {
        href: "https://x.com/MiaAI_lab/status/2097242701624148399?s=20",
        label: { de: "X-Post zum Originalexperiment", en: "X post about the original experiment" },
      },
    ],
    copy: {
      de: {
        label: "Ausgangspunkt",
        title: "Prompt und Referenz.",
        intro: "Ausgangspunkt für diesen Versuch ist das Retro-Tetris-Experiment von Mia AI. Hier wird die Aufgabe mit WerkWorker und Werk1112 umgesetzt.",
        promptLabel: "Originalprompt · Englisch",
        imageAlt: "Referenzbild: mit Buntstiften gezeichnetes Tetris auf gealtertem kariertem Papier, mit Spielsteinen, Vorschau, Punktestand und Level",
        imageCaption: "Referenzbild zum Prompt · 677 × 680 Pixel",
        imageOpen: "Referenzbild in Originalgröße öffnen",
      },
      en: {
        label: "Starting point",
        title: "Prompt and reference.",
        intro: "This run takes Mia AI’s Retro Tetris experiment as its starting point. Here, the task is implemented using WerkWorker and Werk1112.",
        promptLabel: "Original prompt · English",
        imageAlt: "Reference image: coloured-pencil Tetris on aged graph paper, with blocks, a next-piece preview, score and level",
        imageCaption: "Reference image for the prompt · 677 × 680 pixels",
        imageOpen: "Open the reference image at full size",
      },
    },
  },
  technical: { de: tetrisTechnical("de"), en: tetrisTechnical("en") },
  copy: {
    de: {
      title: "Tetris auf kariertem Papier.",
      description: "Ein lokaler Coding-Agent baut ein Tetris-Spiel: Buntstift-Optik, Filmkorn und synthetischer Sound – in einer einzigen HTML-Datei. Entstanden mit WerkWorker und Werk1112.",
      imageAlt: "Tetris-Spiel mit farbigen, schraffierten Steinen auf kariertem Papier",
      intro: "Wie sieht ein kleines Browser-Spiel aus, das mit einem lokalen Modell und einem Coding-Agent entsteht? Dieser Versuch mit WerkWorker und Werk1112 liefert ein spielbares Tetris im Skizzenbuch-Stil.",
      facts: [
        { label: "Agent", value: "WerkWorker · coding-basic" },
        { label: "Inferenz", value: "Werk1112 · llama.cpp · CUDA" },
        { label: "Modellkennung", value: "qwen3.8-27b-ud-q4_k_xl" },
        { label: "Ergebnis", value: "Eine HTML-Datei · Canvas · Web Audio" },
      ],
      sections: [
        { title: "Das Ergebnis", text: "Das Spiel kombiniert schraffierte Spielsteine, kariertes Papier und animiertes Filmkorn. Vorschau, Punktestand, Level, Pause, Soundeffekte und zuschaltbare Musik sind in der HTML-Datei enthalten. Grafik und Ton entstehen im Browser; externe Bibliotheken oder ein Backend werden zum Spielen nicht benötigt." },
        { title: "Ein dokumentierter Einzelversuch", text: "Die technische Dokumentation verbindet Messwerte aus der gespeicherten WerkWorker-Sitzung mit den Originalaufnahmen von WerkWorker und Werk top. Prompt und Referenzbild sind oben dokumentiert; das Gameplay-Video zeigt einen kurzen Ausschnitt des Ergebnisses. Das komplette Sitzungsprotokoll wird hier nicht veröffentlicht. Der Versuch ist kein Modellvergleich oder Benchmark." },
        { title: "Originalzustand und Grenzen", text: "Die veröffentlichte Demo ist eine unveränderte Kopie des erzeugten HTML-Artefakts. Sie ist auf Desktop und Tastatur ausgelegt und hat keine Touch-Steuerung. Die feste Spielfeldgröße kann auf kleinen Bildschirmen abgeschnitten werden. Das Artefakt dokumentiert diesen Stand einschließlich möglicher Spiellogik- und Darstellungsfehler." },
      ],
    },
    en: {
      title: "Tetris on graph paper.",
      description: "A local coding agent builds Tetris: coloured-pencil graphics, film grain and synthesised audio, all in one HTML file. Created with WerkWorker and Werk1112.",
      imageAlt: "Tetris with colourful, pencil-hatched blocks on graph paper",
      intro: "What does a small browser game built with a local model and a coding agent look like? This experiment with WerkWorker and Werk1112 produced a playable Tetris with a sketchbook aesthetic.",
      facts: [
        { label: "Agent", value: "WerkWorker · coding-basic" },
        { label: "Inference", value: "Werk1112 · llama.cpp · CUDA" },
        { label: "Model identifier", value: "qwen3.8-27b-ud-q4_k_xl" },
        { label: "Output", value: "One HTML file · Canvas · Web Audio" },
      ],
      sections: [
        { title: "The result", text: "The game combines pencil-hatched blocks, graph paper and animated film grain. A piece preview, score, levels, pause, sound effects and optional music are all included in the HTML file. Graphics and audio are generated in the browser; playing requires no external libraries or backend." },
        { title: "A documented individual experiment", text: "The technical documentation combines measurements from the saved WerkWorker session with the original WerkWorker and Werk top screenshots. The prompt and reference image are documented above; the gameplay recording shows a short excerpt of the result. The complete session transcript is not published here. This is not a model comparison or benchmark." },
        { title: "Original output and limitations", text: "The published demo is an unchanged copy of the generated HTML artifact. It targets desktop keyboard input and has no touch controls. Its fixed playfield may be clipped on small screens. The artifact preserves this state, including possible gameplay and rendering bugs." },
      ],
    },
  },
}];

export function experimentPath(experiment: Experiment, locale: Locale) {
  return `${locale === "en" ? "/en" : ""}/lab/${experiment.slug}/`;
}
