# Continuous 90-second walkthrough

The actual capture is now `public/walkthrough.mp4`, verified at 90.70 seconds with successful full decoding. See `recording-verification.md` for the captured sequence and limitations. The timing below is the planning script; the recorded timing differs. For another capture, use the actual app at http://127.0.0.1:3261, open `/record.html` and select only the Pivot tab in the browser sharing picker.

| Time | Show |
|---|---|
| 0–15 s | Fixed quantity, budget and deadline; two initial Supplier A plans |
| 15–30 s | The same stock-loss event reaches both runs; show the invalidated availability assumption |
| 30–50 s | Advance Pivot; explain A -> B, unchanged goal, $264 route and retained evidence |
| 50–65 s | Finish: frozen control safely blocked, Pivot delivers 12 at minute 100; show actual receipts |
| 65–82 s | Prepare expensive-replacement failure, inject event, finish; inspect $372 -> refused with zero effects |
| 82–90 s | State limits: synthetic inventory/effects, heuristic forecasts, local real AI; public recorded model evidence must be labeled |

The actual four-call AI runs are in `public/verified-ai-runs.json`. If inference precedes capture, say it is recorded evidence rather than implying the provider ran during every UI step.
