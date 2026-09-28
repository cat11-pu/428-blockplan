import assert from "node:assert";
import { routeOf, capacityOf, pruned } from "../blockplan.js";
import { step, close } from "../planrun.js";
import { render } from "../app.js";

const base = {
  budget: 1, direct_n: 2, per_block: 2,
  state: { direct: [0, 0], indirect: [0, 0], doublemap: [], used: 0, nextb: 1, ledger: [], applied: [] },
  events: [{ id: 1, kind: "alloc", count: 1 }],
  full_code: "E_FULL", under_code: "E_UNDER", event_error_code: "E_BAD_EVENT"
};

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("routeOf returns a list", () => {
  assert.ok(Array.isArray(routeOf(1, 2, 2)));
});

check("capacityOf returns a number", () => {
  assert.strictEqual(typeof capacityOf(2, 2), "number");
});

check("pruned returns a list", () => {
  assert.ok(Array.isArray(pruned([[0, [1, 0]]])));
});

check("step returns a state", () => {
  assert.strictEqual(typeof step(base).state, "object");
});

check("render counts events", () => {
  assert.strictEqual(typeof render(base).count_events, "number");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
