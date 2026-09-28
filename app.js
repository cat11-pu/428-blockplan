// app.js：渲染结果
import { routeOf, capacityOf, pruned } from "./blockplan.js";
import { step, close } from "./planrun.js";

export function render(spec) {
  const events = spec.events || [];
  const half = Math.ceil(events.length / 2);
  const first = step(spec);
  const closed = close(Object.assign({}, spec, { state: first.state }));
  const r1 = step(Object.assign({}, spec, { events: events.slice(0, half) }));
  const r2 = step(Object.assign({}, spec, { state: r1.state, events: events.slice(half) }));
  const closedTwo = close(Object.assign({}, spec, { state: r2.state }));
  const replay = step(Object.assign({}, spec, { state: closed.state }));
  const wide = step(Object.assign({}, spec, { budget: spec.budget + 2 }));
  const full = step(Object.assign({}, spec, { events: events, budget: events.length + 2 }));
  const fullClosed = close(Object.assign({}, spec, { state: full.state }));
  const fingerprint = function (state) {
    return JSON.stringify({
      direct: state.direct, indirect: state.indirect, doublemap: state.doublemap,
      used: state.used, nextb: state.nextb, ledger: state.ledger, applied: state.applied.length
    });
  };
  const table = function (rows) {
    return (rows || []).slice().sort(function (a, b) { return a[0] - b[0]; })
      .map(function (row) { return [row[0], row[1].slice()]; });
  };
  const plain = function (list) { return (list || []).slice(); };
  return { direct: plain(closed.state.direct), indirect: plain(closed.state.indirect),
           doublemap: table(closed.state.doublemap), used: closed.state.used,
           capacity: capacityOf(spec.direct_n, spec.per_block),
           served_first: first.served, served_wide: wide.served,
           pair_differs: first.served !== wide.served,
           ledger_before: first.ledger_before,
           ledger: (first.ledger || []).map(function (row) { return row.slice(); }),
           catchup_n: closed.catchup, ledger_after: closed.state.ledger.length,
           mid_differs: fingerprint(r2.state) !== fingerprint(first.state),
           closed_equal: fingerprint(closedTwo.state) === fingerprint(closed.state),
           replay_new: replay.served, judged: first.judged, judged_bound: first.judged_bound,
           full_diff: fingerprint(closed.state) === fingerprint(fullClosed.state) ? 0 : 1,
           count_events: events.length,
           tail: routeOf(3, 2, 2)[0] + capacityOf(2, 2) + pruned([[0, [0, 0]]]).length };
}
