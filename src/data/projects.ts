const worker = "https://philipbodenbach.github.io/werkWorker/";

export const projects = {
  de: [
    {
      eyebrow: "Inference · Rust",
      title: "Werk1112",
      description: "Lokale Modelle betreiben und über eine gemeinsame CLI und HTTP API nutzen. Werk1112 verbindet Inferenz, Modellverwaltung und verschiedene Runtimes.",
      image: "/projects/werk1112.svg",
      imageAlt: "Werk1112 Schriftzug",
      href: "https://philipbodenbach.github.io/werk1112/",
      linkLabel: "Projektseite öffnen",
      secondaryLink: { href: "https://github.com/philipbodenbach/werk1112", label: "Quellcode auf GitHub" },
    },
    {
      eyebrow: "Agent Engine · Rust",
      title: "WerkWorker",
      description: "Eine lokale Agent Engine mit interaktivem Terminal, Werkzeugen und nachvollziehbaren Freigaben. WerkWorker verbindet Modelle mit Aufgaben im eigenen Arbeitsverzeichnis.",
      image: "/projects/werkworker.svg",
      imageAlt: "WerkWorker Schriftzug in Cyan, Blau, Violett und Pink",
      href: `${worker}de/`,
      linkLabel: "Projektseite öffnen",
      secondaryLink: { href: "https://github.com/philipbodenbach/werkWorker", label: "Quellcode auf GitHub" },
    },
  ],
  en: [
    {
      eyebrow: "Inference · Rust",
      title: "Werk1112",
      description: "Run local models through a shared CLI and HTTP API. Werk1112 brings together inference, model management and multiple runtimes.",
      image: "/projects/werk1112.svg",
      imageAlt: "Werk1112 wordmark",
      href: "https://philipbodenbach.github.io/werk1112/",
      linkLabel: "Open project page",
      secondaryLink: { href: "https://github.com/philipbodenbach/werk1112", label: "Source on GitHub" },
    },
    {
      eyebrow: "Agent Engine · Rust",
      title: "WerkWorker",
      description: "A local agent engine with an interactive terminal, tools and explicit approvals. WerkWorker connects models to tasks in your own workspace.",
      image: "/projects/werkworker.svg",
      imageAlt: "WerkWorker wordmark in cyan, blue, violet and pink",
      href: worker,
      linkLabel: "Open project page",
      secondaryLink: { href: "https://github.com/philipbodenbach/werkWorker", label: "Source on GitHub" },
    },
  ],
} as const;
