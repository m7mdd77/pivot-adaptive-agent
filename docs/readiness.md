# Submission readiness — October 15, 2026

Status: build and public release complete. Competition entry was submitted and verified on October 15, 2026.

| Official requirement | Verified artifact |
|---|---|
| Public source that runs from a clean checkout | https://github.com/m7mdd77/pivot-adaptive-agent ; clean release source passed 50 tests |
| Anonymous live demo | https://pivot-adaptive-agent.choggyacc.chatgpt.site ; publicly reachable |
| At least two adaptive scenarios | Stock loss and ETA delay; both delivered 12 kits for $264 at minute 100 |
| Explain changes while retaining context | Old/new supplier, cost, deadline, trigger, retained receipts and decision history |
| Durable plan/observe/revise loop | Shared pure core, local SQLite, hosted D1 with revision comparisons |
| Real AI | Two genuine public scenario calls plus a genuine browser call; details in release.md and evidence/public-live-ai.json |
| Failure containment | $372 replacement refused against the fixed $270 cap; zero corresponding effects |
| Continuous walkthrough | /walkthrough.mp4 ; reviewed 90.70-second actual UI recording |
| Architecture | architecture.md, including plan/execute/observe/re-evaluate flow |
| Two-year thesis <=300 words | thesis.md ; 169 words |
| AI tools, decisions and scope notes | submission-notes.md ; 1874 characters |

The official challenge brief and rubric were rechecked on October 15. Public demo, GitHub, architecture, thesis, failure document and video all returned HTTP 200. The video matched its reviewed SHA-256. The public backend passed 101 assertions without paid inference; the full automated suite passed 50 tests. The October 15 UI follow-up also preserved an expanded decision-history panel through supplier updates and completed execution.

The video records deterministic planning; genuine public AI verification was collected separately. All inventory, suppliers, clocks and fulfillment effects are simulated. Live AI currently needs this PC awake and connected; no provider credential is deployed. Failed or unsafe inference pauses the run and applies no automatic fulfillment action.

After explicit user authorization, the reviewed repository, live demo, video and notes were submitted. DOO displayed “Entry saved” and changed the form to “Update your entry.” See evidence/submission-confirmation.json.
