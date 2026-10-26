export interface TechnicalReport {
  label: string;
  title: string;
  intro: string;
  summary: { label: string; value: string; note: string }[];
  method: { title: string; steps: { title: string; text: string }[] };
  groups: {
    title: string;
    rows: { label: string; value: string }[];
    note: string;
  }[];
  checks: { title: string; paragraphs: string[] };
  requests: { title: string; note: string; headings: string[]; rows: string[][] };
  evidence: {
    title: string;
    open: string;
    images: { src: string; width: number; height: number; title: string; alt: string; caption: string }[];
  };
  artifact: { title: string; text: string; sha256: string };
  download: { label: string; href: string; note: string };
}
