import measurements from "./measurements/werkworker-tetris.json";
import type { Locale } from "../i18n/home";
import type { TechnicalReport } from "./technical";

// Both translations and the downloadable JSON use the same measured numbers.
export function tetrisTechnical(locale: Locale): TechnicalReport {
  const de = locale === "de";
  const { run, werk_top_snapshot: top, verification, artifact } = measurements;
  const m = run.metrics;
  const n = (value: number, digits = 0) => new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits, maximumFractionDigits: digits,
  }).format(value);
  const seconds = (ms: number) => `${n(ms / 1000, 3)} s`;
  const time = (iso: string) => new Intl.DateTimeFormat(locale, {
    timeZone: run.timezone, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).format(new Date(iso));
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: run.timezone }).format(new Date(run.started_at));
  const duration = `${Math.floor(m.total_ms / 60000)} min ${Math.floor(m.total_ms / 1000) % 60} s`;
  const range = (values: number[], digits: number) => `${n(Math.min(...values), digits)}–${n(Math.max(...values), digits)}`;
  const decode = range(top.visible_requests.map(r => r.decode_tokens_per_second), 1);
  const elapsed = range(top.visible_requests.map(r => r.elapsed_seconds), 2);
  const uptime = new Date(top.server_uptime_seconds * 1000).toISOString().slice(11, 19);
  const pair = (used: number, capacity: number) => `${n(used, 1)} / ${n(capacity, 1)} GiB`;
  const toolRows = Object.entries(run.tool_counts).sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, value: n(count) }));
  const interrupted = Object.values(run.attempt_error_counts).reduce((a, b) => a + b, 0);
  const status = `${run.tool_outcomes.succeeded} succeeded · ${run.tool_outcomes.failed} failed`;

  return {
    label: de ? "Technische Dokumentation" : "Technical documentation",
    title: de ? "Ein Lauf, in Zahlen." : "One run, in numbers.",
    intro: de
      ? `Der Lauf vom ${date} ist über die lokale WerkWorker-Sitzung und die beiden Terminal-Aufnahmen dokumentiert. Die Sitzungsdaten liefern die Gesamtwerte; Werk top ergänzt eine spätere Momentaufnahme der Inferenz.`
      : `The run on ${date} is documented by the local WerkWorker session and both terminal screenshots. The session provides the totals; Werk top adds a later snapshot of inference activity.`,
    summary: [
      { label: de ? "Gesamtlaufzeit" : "Total run time", value: duration, note: de ? "Vom Start bis zum Abschluss des Agent-Laufs" : "From agent run start to completion" },
      { label: de ? "Agent-Schritte" : "Agent steps", value: n(m.steps), note: de ? `${run.plan_steps} übergeordnete Schritte im Aufgabenplan` : `${run.plan_steps} high-level steps in the task plan` },
      { label: de ? "Modellanfragen" : "Model requests", value: n(m.model_requests), note: de ? "Einschließlich unterbrochener Versuche" : "Including interrupted attempts" },
      { label: de ? "Tool-Aufrufe" : "Tool calls", value: n(m.tool_invocations), note: de ? `${Object.keys(run.tool_counts).length} verschiedene Werkzeuge im Einsatz` : `${Object.keys(run.tool_counts).length} different tools used` },
    ],
    method: {
      title: de ? "Aufbau und Ablauf" : "Setup and workflow",
      steps: de ? [
        { title: "Aufgabe und Referenz", text: "Ein einzelnes HTML-Spiel im Skizzenbuch-Stil mit kariertem Papier, Filmkorn und Sound. Die Sitzung enthält ein Referenzbild mit 677 × 680 Pixeln. Prompt und Referenzbild sind oben im Versuchsbericht dokumentiert." },
        { title: "Lokaler Agent und Inferenz", text: `WerkWorker v0.1.0 arbeitet mit dem Profil ${run.configuration.profile} im Continuous-Modus. Werk1112 stellt ${run.configuration.model} über ${top.runtime} und ${top.device_backend} bereit. WerkWorker meldet ${top.inference_slots} Inferenz-Slots und ${run.child_sessions} Subagenten; Reasoning steht auf „Server default: Off“.` },
        { title: "Implementieren und nacharbeiten", text: `Der Aufgabenplan umfasst ${run.plan_steps} Schritte: Spiel bauen und prüfen. In ${m.steps} Agent-Schritten werden Dateien geschrieben, gelesen und bearbeitet sowie Prozesse ausgeführt. Die ${m.model_requests} Modellanfragen und ${m.tool_invocations} Tool-Aufrufe sind eigene Zähler und entsprechen nicht der Anzahl der Planschritte.` },
        { title: "Das technische Ergebnis", text: "Eine eigenständige HTML-Datei enthält CSS und JavaScript. Canvas 2D zeichnet ein 10 × 20-Feld mit 36-Pixel-Zellen; CSS erzeugt das Papier, ein weiterer Canvas das Filmkorn. Web Audio synthetisiert Soundeffekte und Musik. Das Spiel lädt keine externen Bibliotheken und benötigt keinen Server für die Spiellogik." },
      ] : [
        { title: "Task and reference", text: "A single-file HTML game with a sketchbook look, graph paper, film grain and sound. The session contains one reference image at 677 × 680 pixels. The prompt and reference image are documented above in this report." },
        { title: "Local agent and inference", text: `WerkWorker v0.1.0 uses the ${run.configuration.profile} profile in continuous mode. Werk1112 serves ${run.configuration.model} through ${top.runtime} and ${top.device_backend}. WerkWorker reports ${top.inference_slots} inference slots and ${run.child_sessions} subagents; reasoning is set to “Server default: Off”.` },
        { title: "Implementation and iteration", text: `The task plan has ${run.plan_steps} steps: build the game and verify it. Across ${m.steps} agent steps, files are written, read and edited, and processes are run. The ${m.model_requests} model requests and ${m.tool_invocations} tool calls are separate counters, distinct from plan steps.` },
        { title: "The technical output", text: "One self-contained HTML file holds CSS and JavaScript. Canvas 2D draws a 10 × 20 board with 36-pixel cells; CSS creates the paper and a separate canvas renders film grain. Web Audio synthesises effects and music. The game loads no external libraries and needs no server for its game logic." },
      ],
    },
    groups: [
      {
        title: de ? "Laufzeit und Status" : "Timing and status",
        rows: [
          { label: de ? "Start · Europe/Berlin" : "Start · Europe/Berlin", value: time(run.started_at) },
          { label: de ? "Abschluss · Europe/Berlin" : "Completion · Europe/Berlin", value: time(run.completed_at) },
          { label: de ? "Gemessene Laufzeit" : "Measured run time", value: seconds(m.total_ms) },
          { label: de ? "Zeit bis zum ersten Tool" : "Time to first tool", value: seconds(m.first_tool_ms) },
          { label: de ? "Zeit bis zum ersten Text" : "Time to first text", value: seconds(m.first_text_ms) },
          { label: de ? "Wartezeit auf Freigaben" : "Approval wait time", value: seconds(m.approval_wait_ms) },
          { label: de ? "Status des Laufs" : "Run status", value: run.status },
        ],
        note: de ? "Laufzeit laut gespeichertem total_ms-Zähler, einschließlich Modell- und Werkzeuglaufzeiten. Sie umfasst weder die spätere Gameplay-Aufnahme noch die Veröffentlichung." : "Duration comes from the stored total_ms counter, including model and tool time. It excludes the later gameplay recording and publication.",
      },
      {
        title: de ? "Tokens und Agent-Kontext" : "Tokens and agent context",
        rows: [
          { label: de ? "Input-Tokens · Summe" : "Input tokens · total", value: n(m.input_tokens) },
          { label: de ? "Output-Tokens · Summe" : "Output tokens · total", value: n(m.output_tokens) },
          { label: de ? "Agent-Kontextbudget" : "Agent context budget", value: n(run.configuration.context_tokens) },
          { label: de ? "Reserviert für Output" : "Reserved for output", value: n(run.configuration.reserve_output_tokens) },
          { label: de ? "Letzte Kontextschätzung" : "Last context estimate", value: n(m.estimated_input_tokens) },
          { label: de ? "Zuletzt ausgelassene Nachrichten" : "Messages omitted in last context", value: n(run.last_context_omitted_messages) },
        ],
        note: de ? "Die Token-Summen addieren die gemeldete Nutzung der Anfragen: wiederholter Kontext zählt mehrfach; unterbrochene Anfragen können ohne Usage-Meldung bleiben. Output umfasst auch Code und Tool-Aufrufe. Die ausgelassenen Nachrichten sind keine Zählung der Kompaktierungsläufe." : "Token totals add reported usage across requests: repeated context is counted again, and interrupted requests may report no usage. Output includes code and tool calls. Omitted messages are not a count of compaction runs.",
      },
      {
        title: de ? "Verwendete Werkzeuge" : "Tools used",
        rows: [...toolRows, { label: de ? "Tool-Status" : "Tool status", value: status }],
        note: de ? "Der Tool-Status beschreibt die Ausführung des Werkzeugs. Ein erfolgreich ausgeführtes process.run kann trotzdem einen Prozess mit Fehlercode oder fehlgeschlagenen Assertions enthalten." : "Tool status describes tool execution. A successful process.run can still contain a process with a nonzero exit code or failed assertions.",
      },
      {
        title: de ? "Unterbrechungen und Fehler" : "Interruptions and errors",
        rows: [
          { label: de ? "Modellversuche mit Fehler" : "Model attempts with an error", value: n(interrupted) },
          ...Object.entries(run.attempt_error_counts).map(([label, count]) => ({ label, value: n(count) })),
          ...run.tool_failures.map(f => ({ label: f.tool, value: f.code })),
          { label: de ? "Prozesse mit Exit-Code 0" : "Processes with exit code 0", value: n(verification.process_outcomes.exit_zero) },
          { label: de ? "Prozesse mit Fehlercode" : "Processes with nonzero exit code", value: n(verification.process_outcomes.exit_nonzero) },
          { label: de ? "Prozessstart verweigert" : "Process launch denied", value: n(verification.process_outcomes.not_started) },
        ],
        note: de ? "Diese Ereignisse gehören zum dokumentierten Lauf. Die Prozess-Ergebnisse sind eine Untermenge der Tool-Aufrufe und dürfen nicht zusätzlich zur Gesamtzahl gezählt werden." : "These events belong to the documented run. Process outcomes are a subset of tool calls and must not be added to the total.",
      },
      {
        title: de ? "Speicher · Werk top" : "Memory · Werk top",
        rows: [
          { label: de ? "Host inklusive Cache" : "Host including cache", value: pair(top.host_memory_used_including_cache_gib, top.host_memory_capacity_gib) },
          { label: de ? "Host verfügbar" : "Host available", value: `${n(top.host_available_gib, 1)} GiB` },
          { label: "Worker RSS", value: `${n(top.worker_rss_gib, 1)} GiB` },
          { label: "Swap", value: `${n(top.swap_used_gib, 1)} GiB` },
          { label: de ? "GPU-Speicher" : "GPU memory", value: pair(top.gpu_memory_used_gib, top.gpu_memory_capacity_gib) },
          { label: "GPU pressure", value: top.gpu_pressure },
        ],
        note: de ? `Momentaufnahme um ${time(top.observed_at)} Uhr, nach Abschluss des Laufs. Die Werte sind keine Spitzenwerte oder Messreihe. „EMERGENCY“ ist der angezeigte Speicherdruck; daraus folgt kein belegter Speicherabsturz. Das genaue GPU-Modell ist hier nicht erfasst.` : `Snapshot at ${time(top.observed_at)} Europe/Berlin, after the run completed. These are not peaks or a time series. “EMERGENCY” is the displayed memory pressure, not evidence of an out-of-memory crash. The exact GPU model is not recorded here.`,
      },
      {
        title: de ? "Inferenz · Werk top" : "Inference · Werk top",
        rows: [
          { label: de ? "Serverlaufzeit" : "Server uptime", value: uptime },
          { label: de ? "Backend-Kontext · belegt / Kapazität" : "Backend context · used / capacity", value: `${n(top.backend_context_used_tokens)} / ${n(top.backend_context_capacity_tokens)}` },
          { label: de ? "Inferenz-Slots" : "Inference slots", value: n(top.inference_slots) },
          { label: de ? "GPU-Layer · angefordert" : "GPU layers · requested", value: n(top.gpu_layers_requested) },
          { label: de ? "Decode · sichtbare Anfragen" : "Decode · visible requests", value: `${decode} tok/s` },
          { label: de ? "Dauer · sichtbare Anfragen" : "Duration · visible requests", value: `${elapsed} s` },
        ],
        note: de ? `Die Serverlaufzeit ist nicht die Dauer des Experiments. Die Bereiche beziehen sich nur auf die ${top.visible_requests.length} sichtbaren Anfragen, nicht auf den ganzen Lauf. Der Backend-Kontext ist getrennt vom Agent-Kontextbudget; angeforderte GPU-Layer sind keine gemessene Layer-Anzahl.` : `Server uptime is not experiment duration. Ranges cover only the ${top.visible_requests.length} visible requests, not the full run. Backend context is separate from the agent context budget; requested GPU layers are not a measured layer count.`,
      },
    ],
    checks: {
      title: de ? "Was die Prüfungen belegen" : "What the checks establish",
      paragraphs: de ? [
        "Der abschließende Prozess extrahiert das JavaScript aus dem fertigen HTML und meldet einen erfolgreichen Syntaxcheck mit node --check. Die Versuche davor enthalten fehlgeschlagene Extraktionen und einen verweigerten Zugriff auf die temporäre Prüfdatei.",
        `Für die Spiellogik werden ausgewählte Funktionen in Node nachgebaut. Der letzte Prüflauf schreibt „${verification.final_behavioral_check_stderr}“, endet aber mit Exit-Code ${verification.final_behavioral_check_exit_code} und einer Erfolgsmeldung. console.assert beendet diesen Prozess bei einer fehlgeschlagenen Assertion nicht. Damit sind vollständig bestandene Verhaltenstests nicht belegt; die Meldung allein beweist auch keinen Rotationsfehler im Spiel.`,
        "Der Status „completed“ und die markierten Planschritte dokumentieren den Abschluss des Agenten. Es liegt damit kein vollständiger automatisierter Browsertest vor. Video und unveränderte Demo zeigen das Ergebnis; eine umfassende Prüfung der Spielregeln, Audiofunktionen und Animationen lässt sich daraus nicht ableiten.",
      ] : [
        "The final process extracts JavaScript from the completed HTML and reports a successful syntax check with node --check. Earlier attempts include failed extractions and denied access to the temporary check file.",
        `The gameplay checks recreate selected functions in Node. The final check writes “${verification.final_behavioral_check_stderr}” but ends with exit code ${verification.final_behavioral_check_exit_code} and a success message. console.assert does not terminate this process when an assertion fails. This does not establish passing behavioral tests, nor does the message alone prove a rotation bug in the game.`,
        "The “completed” status and checked plan steps record the agent finishing its work. They do not amount to a complete automated browser test. The video and unchanged demo show the output; neither establishes comprehensive verification of game rules, audio and animation.",
      ],
    },
    requests: {
      title: de ? `Die ${top.visible_requests.length} sichtbaren Anfragen im Detail` : `The ${top.visible_requests.length} visible requests in detail`,
      note: de ? "Aus dem Werk-top-Screenshot übertragen, jüngste Anfrage zuerst. Prompt, Cache und Output in Tokens; Decode wie vom Backend angezeigt. Die Tabelle zeigt einen Ausschnitt, keinen vollständigen Trace." : "Transcribed from the Werk top screenshot, newest request first. Prompt, cache and output are token counts; decode is as reported by the backend. This is a subset, not a complete trace.",
      headings: de ? ["Anfrage", "Prompt", "Cache", "Output", "Dauer (s)", "Decode (tok/s)", "Status"] : ["Request", "Prompt", "Cache", "Output", "Time (s)", "Decode (tok/s)", "Status"],
      rows: top.visible_requests.map(r => [`#${r.id}`, n(r.prompt_tokens), n(r.cached_tokens), n(r.output_tokens), n(r.elapsed_seconds, 2), n(r.decode_tokens_per_second, 1), r.state]),
    },
    evidence: {
      title: de ? "Die Aufnahmen zum Lauf" : "Screenshots of the run",
      open: de ? "Originalaufnahme öffnen" : "Open original screenshot",
      images: measurements.evidence.map(e => ({
        src: e.path, width: e.width, height: e.height,
        title: e.id === "worker" ? "WerkWorker" : "Werk1112 · Werk top",
        alt: e.id === "worker"
          ? (de ? `WerkWorker-Terminal mit abgeschlossener Sitzung, ${m.model_requests} Modellanfragen und ${m.tool_invocations} Tool-Aufrufen` : `WerkWorker terminal showing a completed session, ${m.model_requests} model requests and ${m.tool_invocations} tool calls`)
          : (de ? `Werk top mit Modellkennung, Speicherbelegung und den letzten ${top.visible_requests.length} Inferenz-Anfragen` : `Werk top showing model identifier, memory usage and the last ${top.visible_requests.length} inference requests`),
        caption: `${date} · ${time(e.captured_at)} · Europe/Berlin`,
      })),
    },
    artifact: {
      title: de ? "Das dokumentierte Artefakt" : "The documented artifact",
      text: de ? `index.html · ${n(artifact.bytes)} Bytes · ${n(artifact.lines)} Zeilen. Originaldatei und Demo-Datei haben dieselbe SHA-256-Prüfsumme.` : `index.html · ${n(artifact.bytes)} bytes · ${n(artifact.lines)} lines. The original file and demo file share the same SHA-256 checksum.`,
      sha256: artifact.sha256,
    },
    download: {
      label: de ? "Messdaten als JSON herunterladen" : "Download measurements as JSON",
      href: "/lab/werkworker-tetris/metrics.json",
      note: de ? "Ausgewählte Sitzungsmetriken, Prüf-Ergebnisse, übertragene Screenshot-Werte und Prüfsumme. Ohne vollständigen Chatverlauf. Prompt und Referenzbild stehen oben im Versuchsbericht. Dieser Einzelversuch ist kein Modellvergleich oder Benchmark." : "Selected session metrics, check outcomes, transcribed screenshot values and checksum. Excludes the full conversation. The prompt and reference image are documented above in this report. This individual experiment is not a model comparison or benchmark.",
    },
  };
}
