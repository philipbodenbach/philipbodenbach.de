# Tetris measurement provenance

`werkworker-tetris.json` contains an explicit selection of measurements from the
local WerkWorker session identified in `run.session_id` and `run.run_id`. Only
that session was used. This JSON contains no raw conversation, original prompt,
environment values or full database. Both translations and the JSON endpoint
import this file. The user-supplied prompt and reference image are documented
separately in the article's `brief` section. Future measurements should use the
same explicit selection approach.

## Session counters

- `total_ms`: persisted wall time of the agent run, including model and tool time.
  The terminal completion event is recorded 1 ms later than this counter; the
  report uses the counter, not a recomputed duration. Timestamps use Europe/Berlin.
- `steps`: iterations of the agent loop (52), distinct from the high-level task
  plan (2), model request attempts (54), and tool invocations (45).
- Input/output tokens sum reported request usage, including repeated context.
  Interrupted requests may not report usage. This is not a unique prompt length.
- `estimated_input_tokens`: last agent context estimate. The agent budget and
  output reserve are separate from the inference backend's context capacity.
- `last_context_omitted_messages`: messages omitted/represented in the last
  context snapshot (98), not the number of compaction operations.
- Tool outcomes describe execution of a tool, not the success of tests or a
  subprocess. The 10 process calls comprise 6 zero exits, 3 nonzero exits and
  1 rejected launch, already included in the 45 tool calls.
- The final syntax check succeeded. The final behavior script copied selected
  functions, logged `Assertion failed: rotateCW`, and still exited 0 because
  `console.assert` did not terminate it. Its success message and the run's
  `completed` status do not establish passing behavior tests. This assertion is
  also not, by itself, proof of a rotation defect in the actual game.

Counter meanings were checked against WerkWorker's metrics updates and context
display and Werk1112's observability and top UI implementation.

## Screenshots

The supplied original files `Screenshot 2026-10-26 144456.png` (WerkWorker) and
`Screenshot 2026-10-26 144522.png` (Werk top) are copied unchanged to
`public/lab/tetris/werkworker-session.png` and `werk-top.png`. Capture times are
taken from their filenames, interpreted in Europe/Berlin, and are after the run.

The Werk top fields and 16 request rows were manually transcribed from that
snapshot. Values have the precision shown in the UI. `01:09:57` is server uptime,
not experiment duration. Memory is a snapshot, not a peak. Decode ranges cover
only the visible rows, not the complete run. The requested GPU layer count is
configuration, not a measurement. The idle output/cache counters do not describe
total run usage. The screenshots are evidence, not a full performance trace.

## Artifact

The byte count, line count and SHA-256 fingerprint were calculated from the
original `werkWorkerTest/index.html` and compared with the byte-identical
`werkWorker/docs/experiments/tetris/index.html`. Documentation work does not
change the generated game or turn the original checks into a new benchmark.
