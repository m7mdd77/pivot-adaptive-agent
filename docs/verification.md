# Verification — October 14, 2026

- JavaScript syntax checks and fixture arithmetic passed.
- 36 automated tests passed, including persistent recovery, baseline fairness, invalidation, committed-work preservation, stale context, operator pause, goal/authority forgery, model failures, concurrent receipt replay and D1 compare-and-swap compatibility.
- Actual local Node runtime: 101 API assertions passed.
- Actual built Cloudflare Worker with local D1: 101 API assertions passed. This is a local runtime result, not public deployment proof.
- Genuine DeepSeek: four calls; 1604 stock-run tokens + 1759 ETA-run tokens = 3363 reported tokens. Both achieved the unchanged goal with $264 cost and arrival at minute 100. Audit chains passed. The ETA run compensated its prior reservation exactly once.
- Browser verified stock-loss and ETA-delay flows. The ETA run showed retained original receipt, explicit cancellation and replacement. Responsive/failure browser evidence is recorded in the handoff after checks finish.
- TypeScript check, locked hosted dependency install, Drizzle migration generation, Worker build and local migration application passed. The supplied installer hit a Windows npm wrapper lookup error; invoking the installed npm CLI directly completed the same locked installation.

- Actual continuous user-selected tab recording recovered and transcoded to `public/walkthrough.mp4`: 90.70 seconds, H.264, 584×672, 20 fps, no audio. Full decoding passed; sampled frames showed only Pivot, including the completed 12-kit/$264/minute-100 result and the $372 refusal with zero effects. No provider calls occurred during this capture; genuine AI evidence is separate. See `recording-verification.md`.
- Browser playback independently confirmed duration 90.7 and no media error. Keyboard Enter expanded and collapsed the adaptive durable trace. Reload restored the actual saved scenario and retained the refused run's receipts/status.
- After packaging the video, all 36 tests and the hosted build passed again. Source-boundary scan checked 186 files with zero matches for the configured provider key and no private runtime paths.

No public Site or source repository has been published for Pivot. No new DOO entry has been submitted. Release publication and final anonymous public verification remain separate gates.
