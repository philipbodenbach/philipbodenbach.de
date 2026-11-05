import measurements from "./measurements/werkworker-paint.json";
import type { Locale } from "../i18n/home";
import type { TechnicalReport } from "./technical";

export function paintTechnical(locale: Locale): TechnicalReport {
  const de = locale === "de";
  const { run, werk_top_snapshot: top, artifact, server_configuration: server } = measurements;
  const m = run.metrics;
  const n = (value: number, digits = 0) => new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
  const time = (iso: string) => new Intl.DateTimeFormat(locale, { timeZone: run.timezone, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).format(new Date(iso));
  const duration = `${Math.floor(m.total_ms / 60000)} min ${Math.floor(m.total_ms / 1000) % 60} s`;
  const titles: Record<string, [string, string]> = {
    "canvas-progress": ["Himmel und Wiese", "Sky and meadow"],
    "worker-progress": ["WerkWorker während des Zeichnens", "WerkWorker while drawing"],
    "monitor-progress": ["Inferenz während des Laufs", "Inference during the run"],
    worker: ["Abgeschlossener Agent-Lauf", "Completed agent run"],
    monitor: ["Werk top nach dem Abschluss", "Werk top after completion"],
    result: ["Die fertige Zeichnung", "The finished drawing"],
  };
  return {
    label: de ? "Technische Dokumentation" : "Technical documentation",
    title: de ? "64 Modellanfragen bis zum Bild." : "64 model requests to a drawing.",
    intro: de ? "Die gespeicherte Sitzung liefert Ablauf, Tool-Ergebnisse und Token-Summen. Sechs Originalaufnahmen dokumentieren Zwischenstand und Abschluss. Die Werk-top-Werte sind Momentaufnahmen der lokalen Inferenz." : "The saved session provides workflow, tool outcomes and token totals. Six original screenshots document progress and completion. Werk top adds snapshots of local inference.",
    summary: [
      { label: de ? "Gesamtlaufzeit" : "Total run time", value: duration, note: de ? "Vom Start bis zum Abschluss, inklusive Wartezeiten" : "From start to completion, including waits" },
      { label: de ? "Modellanfragen" : "Model requests", value: n(m.model_requests), note: de ? "64 Agent-Schritte · kein Subagent" : "64 agent steps · no subagents" },
      { label: de ? "Tool-Aufrufe" : "Tool calls", value: n(m.tool_invocations), note: de ? "Davon 54 browser.action-Aufrufe" : "Including 54 browser.action calls" },
      { label: de ? "Kontextbudget" : "Context budget", value: n(run.configuration.context_tokens), note: de ? "Reasoning High · 2.048 Tokens innerhalb der Ausgabe" : "High reasoning · 2,048 tokens within the output budget" },
    ],
    method: {
      title: de ? "Aufbau und Ablauf" : "Setup and workflow",
      steps: de ? [
        { title: "Eine Aufgabe ohne Referenzbild", text: "Der englische Prompt beschreibt die Landschaft, die Reihenfolge und die Dach-Geste. Das Modell erhält Beobachtungen aus dem Browser. Die Sitzung startet ohne vom Nutzer angehängtes Bild." },
        { title: "Lokale Inferenz mit mehr Denkbudget", text: "Qwen läuft über Werk1112, llama.cpp und CUDA mit einem Inferenz-Slot. Agent und Server nutzen 32.768 Kontext-Tokens. Von 4.096 reservierten Ausgabe-Tokens sind 2.048 für Reasoning High vorgesehen; das Denkbudget kommt nicht zusätzlich zur Ausgabe hinzu." },
        { title: "Formen, Grenzen und Füllungen", text: "Eine gezogene Horizontlinie trennt Himmel und Wiese vor dem Füllen. Der Hauskörper entsteht mit dem Rechteckwerkzeug. Der Dachpfad kehrt zum Startpunkt zurück und wird anschließend rot gefüllt. Für Sonne und Wolken werden Ellipsen verwendet." },
        { title: "Kontrollieren und abschließen", text: "Der Agent nutzt Aktions-Screenshots und zwei zusätzliche Beobachtungen. Dazu kommen drei lesende JavaScript-Pixelabfragen, von denen zwei erfolgreich sind. Nach dem letzten Bild aktualisiert er den Aufgabenplan und meldet den Abschluss." },
      ] : [
        { title: "A task without a reference image", text: "The English prompt describes the landscape, drawing order and roof gesture. The model receives browser observations. The session starts without a user-supplied image attachment." },
        { title: "Local inference with more reasoning budget", text: "Qwen runs through Werk1112, llama.cpp and CUDA with one inference slot. Both agent and server use 32,768 context tokens. Of the 4,096 reserved output tokens, 2,048 are assigned to High reasoning; they are part of the output allowance, not an extra budget." },
        { title: "Shapes, boundaries and fills", text: "A dragged horizon line separates sky and meadow before filling. The house body uses the rectangle tool. The roof path returns to its starting point and is then filled red. Ellipses are used for the sun and clouds." },
        { title: "Inspection and completion", text: "The agent uses action screenshots and two additional observations. It also makes three read-only JavaScript pixel queries, two of which succeed. After the final image it updates the task plan and reports completion." },
      ],
    },
    groups: [
      {
        title: de ? "Laufzeit und Status" : "Timing and status",
        rows: [
          { label: de ? "Start · Europe/Berlin" : "Start · Europe/Berlin", value: time(run.started_at) },
          { label: de ? "Abschluss · Europe/Berlin" : "Completion · Europe/Berlin", value: time(run.completed_at) },
          { label: de ? "Wartezeit auf Freigaben" : "Approval wait time", value: `${n(m.approval_wait_ms / 1000, 3)} s` },
          { label: de ? "Zeit bis zum ersten Tool" : "Time to first tool", value: `${n(m.first_tool_ms / 1000, 3)} s` },
          { label: de ? "Übergeordnete Planschritte" : "High-level plan steps", value: n(run.plan_steps) },
          { label: "Status", value: run.status },
        ],
        note: de ? "Die Laufzeit stammt aus total_ms. Sie ist unabhängig von der Serverlaufzeit und den später aufgenommenen Screenshots. Der Lauf nutzte den Continuous-Modus." : "Duration comes from total_ms. It is separate from server uptime and the later screenshots. The run used continuous mode.",
      },
      {
        title: de ? "Tokens und Kontext" : "Tokens and context",
        rows: [
          { label: de ? "Input-Tokens · Summe" : "Input tokens · total", value: n(m.input_tokens) },
          { label: de ? "Output-Tokens · Summe" : "Output tokens · total", value: n(m.output_tokens) },
          { label: de ? "Reservierte Ausgabe inkl. Reasoning" : "Reserved output including reasoning", value: n(run.configuration.reserve_output_tokens) },
          { label: de ? "Letzte Kontextschätzung" : "Last context estimate", value: n(m.estimated_input_tokens) },
          { label: de ? "Zuletzt ausgelassene Nachrichten" : "Messages omitted in last context", value: n(run.last_context_omitted_messages) },
        ],
        note: de ? "Token-Summen addieren die gemeldete Nutzung über alle Anfragen; wiederholter Kontext zählt mehrfach. Output umfasst Reasoning, Text und Tool-Aufrufe. 120 ausgelassene Nachrichten bedeuten nicht 120 Kompaktierungsläufe." : "Token totals add reported usage across requests; repeated context is counted repeatedly. Output includes reasoning, text and tool calls. 120 omitted messages does not mean 120 compaction passes.",
      },
      {
        title: de ? "Werkzeuge und Fehler" : "Tools and errors",
        rows: [
          ...Object.entries(run.tool_counts).map(([label, count]) => ({ label, value: n(count) })),
          { label: de ? "Erfolgreich / Validierungsfehler / fehlgeschlagen" : "Succeeded / validation error / failed", value: `${run.tool_outcomes.succeeded} / ${run.tool_outcomes.validation_error} / ${run.tool_outcomes.failed}` },
          { label: de ? "Modellversuche mit Fehler" : "Model attempts with errors", value: "0" },
        ],
        note: de ? "Fünf ungültige Browserziele wurden vor der Ausführung abgewiesen. Eine Pixelabfrage scheiterte. Erfolgreiche Tool-Ausführung allein belegt nicht, dass jeder Teil der Zeichnung korrekt ist." : "Five invalid browser targets were rejected before execution. One pixel query failed. A successful tool call alone does not establish that every part of the drawing is correct.",
      },
      {
        title: de ? "Speicher und Inferenz · Werk top" : "Memory and inference · Werk top",
        rows: [
          { label: de ? "GPU-Speicher · belegt / Kapazität" : "GPU memory · used / capacity", value: `${n(top.gpu_memory_used_gib, 1)} / ${n(top.gpu_memory_capacity_gib, 1)} GiB` },
          { label: "GPU pressure", value: top.gpu_pressure },
          { label: "Worker RSS", value: `${n(top.worker_rss_gib, 1)} GiB` },
          { label: de ? "Host-RAM inkl. Cache" : "Host memory including cache", value: `${n(top.host_memory_used_including_cache_gib, 1)} / ${n(top.host_memory_capacity_gib, 1)} GiB` },
          { label: de ? "Backend-Kontext · belegt / Kapazität" : "Backend context · used / capacity", value: `${n(top.backend_context_used_tokens)} / ${n(top.backend_context_capacity_tokens)}` },
          { label: de ? "Decode · letzte 16 sichtbare Anfragen" : "Decode · last 16 visible requests", value: `${n(32.3, 1)}–${n(33.9, 1)} tok/s` },
        ],
        note: de ? "Momentaufnahme um 14:46:51 Uhr, nach Abschluss. Die Speicherwerte sind keine Spitzenwerte. Der Decode-Bereich stammt aus den 16 sichtbaren Anfragen, nicht aus einem Durchschnitt des gesamten Laufs. Der Monitor zeigt 01:13:58 Serverlaufzeit." : "Snapshot at 14:46:51 Europe/Berlin, after completion. Memory figures are not peaks. The decode range covers the 16 visible requests, not a whole-run average. The monitor shows 01:13:58 of server uptime.",
      },
      {
        title: de ? "Server und Browser" : "Server and browser",
        rows: [
          { label: "Backend", value: `${top.runtime} · ${top.device_backend}` },
          { label: de ? "Inferenz-Slots" : "Inference slots", value: n(server.parallel) },
          { label: "KV cache / Flash attention", value: `${server.kv_cache_type} / on` },
          { label: "Batch / µBatch", value: `${server.batch_size} / ${server.ubatch_size}` },
          { label: "Threads / batch threads", value: `${server.threads} / ${server.threads_batch}` },
          { label: "Browser perception", value: run.configuration.perception },
          { label: de ? "Browseraktionen · verwendet / Budget" : "Browser actions · used / budget", value: `${run.configuration.browser_actions_used} / ${run.configuration.browser_limits.max_actions}` },
        ],
        note: de ? "Startparameter laut bereitgestelltem Serve-Befehl. Browser-Laufzeit und Idle-Limit stehen auf 0, das Aktionsbudget auf 600. Der separate Wiederholungsschutz bleibt aktiv. Browseraktionen und sämtliche Tool-Aufrufe sind unterschiedliche Zähler." : "Launch settings come from the supplied serve command. Browser lifetime and idle limits are 0, with an action budget of 600. The separate repetition guard remains active. Browser actions and total tool calls are different counters.",
      },
    ],
    checks: {
      title: de ? "Ergebnis und Methodengrenzen" : "Outcome and methodological limits",
      paragraphs: de ? [
        "Die Originalbilder zeigen ein Haus mit brauner Füllung, einem blauen Fenster und rotem Dreiecksdach, grüner Wiese, blauem Himmel, Sonne und zwei Wolken. Im Tool-Protokoll ist der geschlossene Bleistiftpfad für das Dach erhalten. Der Nutzer bestätigt, dass der Versuch funktioniert hat.",
        "Der Status completed dokumentiert den Abschluss des Agenten. Die strenge Vorgabe ausschließlich Browser-UI wurde nicht vollständig eingehalten: Drei browser.evaluate-Aufrufe versuchten Canvas-Pixel zu lesen. Diese Skripte zeichneten nicht, waren aber zusätzliche JavaScript-Inspektionen. Zwei Abfragen liefen erfolgreich, eine schlug fehl.",
        "Die Fenster sind im Prompt im Plural verlangt; sichtbar ist ein Fenster. Die Horizontlinie bleibt innerhalb des Hauses sichtbar. Es gibt keine unabhängige automatisierte Prüfung sämtlicher Bildkriterien und keinen kontrollierten Vergleich zwischen Reasoning-Stufen.",
      ] : [
        "The original images show a brown house with one blue window and a red triangular roof, green meadow, blue sky, sun and two clouds. The tool log preserves the closed pencil path used for the roof. The user confirms that the experiment worked.",
        "The completed status records the agent finishing. The strict browser-UI-only instruction was not fully respected: three browser.evaluate calls attempted to read canvas pixels. These scripts did not draw, but they were additional JavaScript inspections. Two queries succeeded and one failed.",
        "The prompt asks for windows in the plural; one window is visible. The horizon line remains visible inside the house. There is no independent automated verification of every image criterion and no controlled comparison between reasoning tiers.",
      ],
    },
    requests: {
      title: de ? "Die letzten 16 sichtbaren Anfragen" : "The last 16 visible requests",
      note: de ? "Aus der abschließenden Werk-top-Aufnahme übertragen. Dies ist ein Ausschnitt, kein vollständiger Trace. Prompt, Cache und Output in Tokens; Zeiten und Decode wie angezeigt." : "Transcribed from the final Werk top screenshot. This is a subset, not a complete trace. Prompt, cache and output are tokens; time and decode values are as displayed.",
      headings: de ? ["Anfrage", "Prompt", "Cache", "Output", "Dauer (s)", "Decode (tok/s)", "Status"] : ["Request", "Prompt", "Cache", "Output", "Time (s)", "Decode (tok/s)", "Status"],
      rows: top.visible_requests.map(r => [`#${r.id}`, n(r.prompt_tokens), n(r.cached_tokens), n(r.output_tokens), n(r.elapsed_seconds, 2), n(r.decode_tokens_per_second, 1), r.state]),
    },
    evidence: {
      title: de ? "Vom Zwischenstand zum Ergebnis" : "From progress to the result",
      open: de ? "Originalaufnahme öffnen" : "Open original screenshot",
      images: measurements.evidence.map(e => ({ src: e.path, width: e.width, height: e.height, title: titles[e.id][de ? 0 : 1], alt: titles[e.id][de ? 0 : 1], caption: `5.11.2026 · ${time(e.captured_at)} · Europe/Berlin` })),
    },
    artifact: {
      title: de ? "Das unveränderte Ergebnisbild" : "The unchanged result image",
      text: de ? `PNG · ${artifact.width} × ${artifact.height} Pixel · ${n(artifact.bytes)} Bytes. Die veröffentlichte Aufnahme ist bytegleich mit dem bereitgestellten Screenshot.` : `PNG · ${artifact.width} × ${artifact.height} pixels · ${n(artifact.bytes)} bytes. The published image is byte-identical to the supplied screenshot.`,
      sha256: artifact.sha256,
    },
    download: {
      label: de ? "Messdaten als JSON herunterladen" : "Download measurements as JSON",
      href: "/lab/werkworker-paint/metrics.json", filename: "werkworker-paint-metrics.json",
      note: de ? "Enthält den Originalprompt, ausgewählte Sitzungsmetriken, Konfiguration, übertragene Monitorwerte und Bild-Prüfsummen. Kein vollständiger Chatverlauf. Ein dokumentierter Einzelversuch, kein Benchmark." : "Includes the original prompt, selected session metrics, configuration, transcribed monitor values and image checksums. No full conversation history. A documented individual experiment, not a benchmark.",
    },
  };
}
