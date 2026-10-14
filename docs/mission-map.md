# Pivot mission and evidence map

Mission: [The Adaptive Agent](https://build.doo.ooo/challenges/adaptive-agent), read in the signed-in browser on October 14, 2026. Goal: notice changed reality and safely revise a multi-step plan. Existing Threshold and Relay Trust submissions are separate.

| Criterion | Working evidence | Release requirement |
|---|---|---|
| Multi-step plan and persisted observe/revise loop | `src/runner.js`, `src/store.js`, Node/SQLite restart test | Local build and hosted adapter parity |
| Trigger on contradictory signals, not a timer | Typed stock/ETA events; `findInvalidatedAssumptions`; noise causes zero calls | Event stream and readable trigger |
| Explain every change of mind | Revision records bind triggering event, changed facts, old/new plan, prior effects and reason | Browser revision diff |
| Two original plans that would fail | Stock loss and ETA delay, same event stream and common safe action gateway | Side-by-side comparison report |
| Contain failed adaptation | Injected expensive replacement is refused; no corresponding effects | Recorded failure run |
| Actual AI | Two genuine DeepSeek proposals per scenario; four calls, 3363 reported tokens | Sanitized recorded evidence and explicit live/replay labels |
| Public repository/live demo | Local source and hosted preview are being prepared | Exact pushed commit and anonymous published URL |
| 90-second walkthrough | Actual continuous capture, `public/walkthrough.mp4`, 90.70 seconds; full decoding and sampled frames checked | Publish the reviewed MP4 with explicit deterministic/recorded-AI scope |
| Architecture + <=300-word thesis | `docs/architecture.md`, `docs/thesis.md` | Public links in entry notes |

Rubric: clarity 25, depth 25, demo 20, failure thinking 15, thesis 15. The main screen shows change over time. The baseline uses the same constraints; its blocked result is not presented as a successful blind delivery. Synthetic effects are persistent but are not real purchases or deliveries.
