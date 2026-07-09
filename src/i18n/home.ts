const siteUrl = "https://www.philipbodenbach.de";

const alternateLinks = [
  { hreflang: "de", href: `${siteUrl}/` },
  { hreflang: "en", href: `${siteUrl}/en/` },
  { hreflang: "x-default", href: `${siteUrl}/` },
];

const technologies = [
  "PHP",
  "JavaScript",
  "TypeScript",
  "React",
  "Astro",
  "Rust",
  "MySQL",
  "PostgreSQL",
  "Redis",
  "Docker",
  "Linux",
  "REST APIs",
];

export const homeContent = {
  de: {
    lang: "de",
    homeHref: "/",
    canonicalUrl: `${siteUrl}/`,
    ogLocale: "de_DE",
    alternateLinks,
    seo: {
      title:
        "Philip Bodenbach | Freelance Software Engineer & Software Architect",
      description:
        "Individuelle Software, Webanwendungen und Backend-Systeme. Seit 1997 in der Softwareentwicklung, seit 2007 freiberuflich.",
    },
    themeToggle: {
      activateDark: "Dark Mode aktivieren",
      activateLight: "Light Mode aktivieren",
    },
    logoAriaLabel: "Philip Bodenbach Startseite",
    languageSwitch: {
      href: "/en/",
      label: "EN",
      hreflang: "en",
      ariaLabel: "English version",
    },
    headerContactLabel: "Kontakt",
    navigationLabel: "Hauptnavigation",
    navigation: [
      { href: "#ueber-mich", label: "Über mich" },
      { href: "#referenzen", label: "Referenzen" },
      { href: "#leistungen", label: "Leistungen" },
      { href: "#technologien", label: "Technologien" },
      { href: "#projekte", label: "Projekte" },
      { href: "#kontakt", label: "Kontakt" },
    ],
    hero: {
      eyebrow: "Freelance Software Engineer & Software Architect",
      title: "Philip Bodenbach",
      description: [
        "Individuelle Software, Webanwendungen und Backend-Systeme.",
        "Seit 1997 in der Softwareentwicklung, seit 2007 freiberuflich.",
      ],
      primaryCta: "Projekt anfragen",
      secondaryCta: "Leistungen ansehen",
    },
    focus: {
      label: "Schwerpunkte",
      workLabel: "Arbeit",
      workText:
        "Planung, Entwicklung und langfristige Begleitung von Softwareprojekten.",
      focusLabel: "Fokus",
      focusText:
        "Wartbare Architekturen, stabile Backends, klare Schnittstellen.",
    },
    about: {
      label: "Über mich",
      heading: "Erfahrung für langfristig tragfähige Software.",
      paragraphs: [
        "Ich bin freiberuflicher Software Engineer, Software Architect und Full Stack Web Developer aus Deutschland. Meine Arbeit reicht von individueller Softwareentwicklung und modernen Webanwendungen bis zu Backend-Systemen, APIs und technischer Beratung.",
        "Seit vielen Jahren unterstütze ich Softwareprojekte in Planung, Architektur, Umsetzung und Wartung. Im Mittelpunkt stehen verständliche technische Entscheidungen, saubere Schnittstellen und Lösungen, die auch nach der ersten Veröffentlichung gut weiterentwickelt werden können.",
      ],
    },
    references: {
      label: "Referenzen",
      heading: "Ausgewählte Kunden- und Projektumfelder.",
      description:
        "Auswahl von Unternehmen und Organisationen, für die ich im Rahmen freiberuflicher Projekte tätig war.",
      linkAriaLabel: "{name} Website öffnen",
    },
    services: {
      label: "Leistungen",
      heading: "Softwareentwicklung, Architektur und technische Umsetzung.",
      items: [
        "Individuelle Softwareentwicklung",
        "Webanwendungen",
        "Backend-Systeme",
        "API-Entwicklung",
        "Softwarearchitektur",
        "Technische Beratung",
        "Wartung und Weiterentwicklung bestehender Systeme",
      ],
    },
    technologies: {
      label: "Technologien",
      heading: "Bewährte Werkzeuge für Web, Backend und Betrieb.",
      items: technologies,
    },
    projects: {
      label: "Projekte / Open Source",
      heading: "Werk1112",
      description:
        "Werk1112 ist ein local-first Inference Router für moderne KI-Modelle, geschrieben in Rust. Das Projekt stellt eine stabile CLI und eine OpenAI-kompatible HTTP API bereit und richtet sich an lokale Workflows mit modernen Modell-Runtimes.",
      githubLabel: "Werk1112 auf GitHub",
      projectPageLabel: "Projektseite öffnen",
    },
    contact: {
      label: "Kontakt",
      heading: "Direkter Kontakt für Softwareprojekte.",
      links: [
        {
          label: "Website",
          href: "https://www.philipbodenbach.de",
          text: "www.philipbodenbach.de",
        },
        {
          label: "E-Mail",
          href: "mailto:info@philipbodenbach.de",
          text: "info@philipbodenbach.de",
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/philip-bodenbach",
          text: "Philip Bodenbach",
        },
        {
          label: "GitHub",
          href: "https://github.com/philipbodenbach",
          text: "github.com/philipbodenbach",
        },
      ],
    },
    footer: {
      ariaLabel: "Footer",
      links: [
        { href: "https://github.com/philipbodenbach", label: "GitHub Profil" },
        {
          href: "https://www.linkedin.com/in/philip-bodenbach",
          label: "LinkedIn",
        },
        {
          href: "https://github.com/philipbodenbach/werk1112",
          label: "Werk1112 auf GitHub",
        },
        {
          href: "https://philipbodenbach.github.io/werk1112/",
          label: "Werk1112 Projektseite",
        },
        { href: "/impressum/", label: "Impressum" },
        { href: "/datenschutz/", label: "Datenschutz" },
        { href: "/sitemap.xml", label: "Sitemap" },
      ],
      copyrightRole: "Freelance Software Engineer & Software Architect.",
    },
    schema: {
      jobTitle: [
        "Freelance Software Engineer",
        "Software Architect",
        "Full Stack Web Developer",
      ],
      knowsAbout: [
        "Softwareentwicklung",
        "Softwarearchitektur",
        "Webanwendungen",
        "Backend-Systeme",
        "API-Entwicklung",
        "Full Stack Web Development",
        "Langfristige Wartung",
      ],
    },
  },
  en: {
    lang: "en",
    homeHref: "/en/",
    canonicalUrl: `${siteUrl}/en/`,
    ogLocale: "en_US",
    alternateLinks,
    seo: {
      title:
        "Philip Bodenbach | Freelance Software Engineer & Software Architect",
      description:
        "Custom software, web applications and backend systems. Software development since 1997, freelance since 2007.",
    },
    themeToggle: {
      activateDark: "Activate dark mode",
      activateLight: "Activate light mode",
    },
    logoAriaLabel: "Philip Bodenbach home page",
    languageSwitch: {
      href: "/",
      label: "DE",
      hreflang: "de",
      ariaLabel: "German version",
    },
    headerContactLabel: "Contact",
    navigationLabel: "Main navigation",
    navigation: [
      { href: "#ueber-mich", label: "About" },
      { href: "#referenzen", label: "References" },
      { href: "#leistungen", label: "Services" },
      { href: "#technologien", label: "Technologies" },
      { href: "#projekte", label: "Projects" },
      { href: "#kontakt", label: "Contact" },
    ],
    hero: {
      eyebrow: "Freelance Software Engineer & Software Architect",
      title: "Philip Bodenbach",
      description: [
        "Custom software, web applications and backend systems.",
        "Software development since 1997.",
        "Freelance since 2007.",
      ],
      primaryCta: "Start a project",
      secondaryCta: "View services",
    },
    focus: {
      label: "Focus",
      workLabel: "Work",
      workText:
        "Planning, development and long-term support for software projects.",
      focusLabel: "Focus",
      focusText:
        "Maintainable architectures. Stable backends. Clear interfaces.",
    },
    about: {
      label: "About",
      heading: "Experience for software built to last.",
      paragraphs: [
        "I am a freelance software engineer, software architect and full stack web developer based in Germany.",
        "My work ranges from custom software development and modern web applications to backend systems, APIs and technical consulting.",
        "For many years I have supported software projects in planning, architecture, implementation and maintenance.",
        "My focus is on clear technical decisions, clean interfaces and software that continues to evolve long after its first release.",
      ],
    },
    references: {
      label: "References",
      heading: "Selected companies and project environments.",
      description:
        "Selected companies and project environments I have worked with as part of freelance projects.",
      linkAriaLabel: "Open {name} website",
    },
    services: {
      label: "Services",
      heading:
        "Software development, architecture and technical implementation.",
      items: [
        "Custom software development",
        "Web applications",
        "Backend systems",
        "API development",
        "Software architecture",
        "Technical consulting",
        "Maintenance and further development of existing systems",
      ],
    },
    technologies: {
      label: "Technologies",
      heading: "Proven tools for web, backend and operations.",
      items: technologies,
    },
    projects: {
      label: "Projects / Open Source",
      heading: "Werk1112",
      description:
        "A local-first inference router for modern AI models written in Rust.",
      githubLabel: "Werk1112 on GitHub",
      projectPageLabel: "Open project page",
    },
    contact: {
      label: "Contact",
      heading: "Direct contact for software projects.",
      links: [
        {
          label: "Website",
          href: "https://www.philipbodenbach.de",
          text: "www.philipbodenbach.de",
        },
        {
          label: "E-Mail",
          href: "mailto:info@philipbodenbach.de",
          text: "info@philipbodenbach.de",
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/philip-bodenbach",
          text: "Philip Bodenbach",
        },
        {
          label: "GitHub",
          href: "https://github.com/philipbodenbach",
          text: "github.com/philipbodenbach",
        },
      ],
    },
    footer: {
      ariaLabel: "Footer",
      links: [
        { href: "https://github.com/philipbodenbach", label: "GitHub Profile" },
        {
          href: "https://www.linkedin.com/in/philip-bodenbach",
          label: "LinkedIn",
        },
        {
          href: "https://github.com/philipbodenbach/werk1112",
          label: "Werk1112 on GitHub",
        },
        {
          href: "https://philipbodenbach.github.io/werk1112/",
          label: "Werk1112 project page",
        },
        { href: "/en/imprint/", label: "Imprint" },
        { href: "/en/privacy/", label: "Privacy Policy" },
        { href: "/sitemap.xml", label: "Sitemap" },
      ],
      copyrightRole: "Freelance Software Engineer & Software Architect.",
    },
    schema: {
      jobTitle: [
        "Freelance Software Engineer",
        "Software Architect",
        "Full Stack Web Developer",
      ],
      knowsAbout: [
        "Software development",
        "Software architecture",
        "Web applications",
        "Backend systems",
        "API development",
        "Full stack web development",
        "Long-term maintenance",
      ],
    },
  },
} as const;

export type Locale = keyof typeof homeContent;
export type HomeContent = (typeof homeContent)[Locale];
