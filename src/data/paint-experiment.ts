import type { Experiment } from "./experiments";
import measurements from "./measurements/werkworker-paint.json";
import { paintTechnical } from "./paint-technical";

const serverCommand = `WERK_LLAMA_ARGS='' werk serve \\
  --backend cuda \\
  --host 127.0.0.1 --port 11434 \\
  --model qwen3.8-27b-ud-q4_k_xl \\
  --preload qwen3.8-27b-ud-q4_k_xl \\
  --parallel 1 --ctx-size 32768 \\
  --gpu-layers 999 --kv-offload true \\
  --flash-attn true --kv-cache-type q8-0 \\
  --batch-size 1024 --ubatch-size 256 \\
  --threads 24 --threads-batch 24`;

export const paintExperiment: Experiment = {
  slug: "werkworker-paint",
  pageKey: "paint",
  date: "2026-11-05",
  image: measurements.artifact.path,
  imageWidth: measurements.artifact.width,
  imageHeight: measurements.artifact.height,
  socialImage: measurements.artifact.path,
  demoUrl: measurements.artifact.path,
  sourceUrl: "/lab/werkworker-paint/metrics.json",
  tags: ["WerkWorker", "jsPaint", "32K · Reasoning High"],
  brief: {
    prompt: measurements.prompt,
    promptLanguage: "en",
    links: [{ href: "https://jspaint.app/", label: { de: "jsPaint öffnen", en: "Open jsPaint" } }],
    commands: [
      {
        label: { de: "Browser-Einstellungen", en: "Browser settings" },
        code: "/effort high\n/browser limits 0 0 600\n/browser perception auto\n/browser on",
      },
      {
        label: { de: "Worker-Konfiguration · neue Sitzung", en: "Worker configuration · new session" },
        code: JSON.stringify({ version: 1, model: measurements.run.configuration.model, profile: "coding-basic", context_tokens: 32768, output_tokens: 4096, reasoning_tier: "high", delegation_level: "off" }, null, 2),
      },
      { label: { de: "Startbefehl für Werk1112", en: "Werk1112 server command" }, code: serverCommand },
    ],
    copy: {
      de: {
        label: "Die Aufgabe", title: "Ein Haus, eine Wiese, ein Himmel.",
        intro: "Der Originalprompt verlangt ein Haus mit brauner Füllung, blauen Fenstern und rotem Dach, dazu Wiese, Himmel, Wolken und Sonne. Ein Referenzbild wurde dem Agenten nicht mitgegeben. Die folgenden Screenshots entstanden während und nach dem Lauf.",
        promptLabel: "Originalprompt des abgeschlossenen Laufs · Englisch",
      },
      en: {
        label: "The task", title: "A house, a meadow, a sky.",
        intro: "The original prompt asks for a house with brown fill, blue windows and a red roof, plus a meadow, sky, clouds and sun. The agent received no reference image. The screenshots below were captured during and after the run.",
        promptLabel: "Original prompt from the completed run · English",
      },
    },
  },
  technical: { de: paintTechnical("de"), en: paintTechnical("en") },
  copy: {
    de: {
      title: "Ein Agent zeichnet ein Haus.",
      description: "Ein lokaler Agent zeichnet in jsPaint. Dokumentierter Versuch mit 32K Kontext und Reasoning High: Originalbilder, Prompt, Ablauf und Messdaten.",
      imageAlt: "jsPaint mit braunem Haus, einem blauen Fenster, rotem Dreiecksdach, grüner Wiese, blauem Himmel, gelber Sonne und zwei weißen Wolken",
      intro: "Ein Haus malen klingt einfach. Für einen Browser-Agenten bedeutet es, Werkzeuge und Farben zu erkennen, Flächen zu begrenzen und jeden Schritt am Bild zu kontrollieren. Dieser Versuch mit WerkWorker und Werk1112 endete nach rund 62 Minuten mit einer kleinen Landschaft in jsPaint.",
      facts: [
        { label: "Agent", value: "WerkWorker v0.2.0 · coding-basic · keine Subagenten" },
        { label: "Inferenz", value: "Werk1112 · llama.cpp · CUDA · 1 Slot" },
        { label: "Modellkennung", value: measurements.run.configuration.model },
        { label: "Budget", value: "32.768 Kontext · 4.096 Ausgabe inkl. 2.048 Reasoning-Tokens" },
        { label: "Ergebnis", value: "Zeichnung in jsPaint · Original-Screenshots" },
      ],
      result: {
        label: "Ergebnisbild öffnen", sourceLabel: "Messdaten (JSON)",
        caption: "Originalaufnahme vom 5. November 2026 · 14:46:58 Uhr · Europe/Berlin",
        description: "Die Zeichnung entstand mit den Malwerkzeugen von jsPaint. Der Screenshot zeigt den unveränderten Endstand samt Oberfläche; es handelt sich nicht um ein nachträglich generiertes Illustrationsbild.",
        title: "Das Original ansehen.",
        instructions: "Das Ergebnisbild lässt sich in voller Auflösung öffnen. Für einen eigenen Versuch stehen oben der tatsächlich verwendete Prompt sowie Browser-, Worker- und Server-Einstellungen. Eine neue Sitzung übernimmt die Projektwerte; dieser Einzelversuch garantiert kein identisches Ergebnis.",
      },
      sections: [
        { title: "Von Farbauswahl zu getrennten Flächen", text: "Frühere Versuche mit 16K Kontext blieben unter anderem in wiederholter Farbauswahl hängen. Im dokumentierten Lauf mit 32K und Reasoning High zog der Agent zunächst eine Horizontlinie und füllte Himmel und Wiese getrennt. Danach folgten Rechteckwerkzeug, braune Füllung, das mit einem geschlossenen Bleistiftpfad gezeichnete rote Dach, Fenster, Sonne und Wolken." },
        { title: "Ein Ergebnis, kein isolierter Modellvergleich", text: "Der Lauf zeigt, dass diese Kombination die Aufgabe bis zu einem sichtbaren Ergebnis ausführen konnte. Kontextbudget und Reasoning wurden gemeinsam verändert; außerdem wurden Worker-Fixes eingespielt und der Prompt um die braune Hausfüllung und blaue Fenster ergänzt. Welcher Anteil auf mehr Reasoning entfällt, lässt sich daraus nicht isolieren." },
        { title: "Was im Original sichtbar bleibt", text: "Das Bild enthält die gewünschten Motive, zeigt aber nur ein blaues Fenster. Eine horizontale Linie läuft durch das braune Haus. Der Bericht bewahrt diese Details und die Abweichung von der reinen UI-Vorgabe: Zur Kontrolle verwendete der Agent zusätzlich JavaScript-Pixelabfragen. Die Aufnahmen wurden nicht retuschiert." },
      ],
    },
    en: {
      title: "An agent draws a house.",
      description: "A local agent draws in jsPaint. A documented run with 32K context and High reasoning: original screenshots, prompt, workflow and measurements.",
      imageAlt: "jsPaint showing a brown house with one blue window, a red triangular roof, green meadow, blue sky, yellow sun and two white clouds",
      intro: "Drawing a house sounds simple. A browser agent has to identify tools and colours, bound regions and check each step against the image. This experiment with WerkWorker and Werk1112 ended after about 62 minutes with a small landscape in jsPaint.",
      facts: [
        { label: "Agent", value: "WerkWorker v0.2.0 · coding-basic · no subagents" },
        { label: "Inference", value: "Werk1112 · llama.cpp · CUDA · 1 slot" },
        { label: "Model identifier", value: measurements.run.configuration.model },
        { label: "Budget", value: "32,768 context · 4,096 output including 2,048 reasoning tokens" },
        { label: "Output", value: "Drawing in jsPaint · original screenshots" },
      ],
      result: {
        label: "Open the result image", sourceLabel: "Measurements (JSON)",
        caption: "Original screenshot from 5 November 2026 · 14:46:58 · Europe/Berlin",
        description: "The drawing was made with jsPaint’s drawing tools. The screenshot preserves the final state and its interface; it is not an illustration generated afterwards.",
        title: "View the original.",
        instructions: "Open the result image at full resolution. The exact prompt and browser, worker and server settings are included above for your own experiment. A new session picks up project settings; this individual run does not guarantee an identical result.",
      },
      sections: [
        { title: "From colour selection to bounded regions", text: "Earlier attempts with 16K context got stuck in loops that included repeated colour selection. In the documented run with 32K and High reasoning, the agent first drew a horizon line and filled the sky and meadow separately. It then used the rectangle tool and brown fill, drew a closed red roof with the pencil, and added the window, sun and clouds." },
        { title: "An outcome, not an isolated model comparison", text: "The run shows that this combination could carry the task through to a visible result. Context capacity and reasoning changed together; worker fixes had also been applied, and the prompt gained brown house fill and blue windows. This does not isolate how much improvement came from reasoning." },
        { title: "What remains visible in the original", text: "The image contains the requested motifs but only one blue window. A horizontal line runs through the brown house. This report preserves those details and the departure from the UI-only instruction: the agent also used JavaScript pixel queries for inspection. The screenshots have not been retouched." },
      ],
    },
  },
};
