import measurements from "../../../data/measurements/werkworker-tetris.json";

export function GET() {
  return new Response(`${JSON.stringify(measurements, null, 2)}\n`, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
