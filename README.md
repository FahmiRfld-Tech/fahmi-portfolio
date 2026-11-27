# M Fahmi Rifaldi — Engineering Portfolio

A bilingual (ID/EN) portfolio built with React, Vite, Tailwind CSS, Framer Motion, and Lucide. The Editorial Engine opens with a real Hallo Batam AI conversation, followed by the Cireundeu case study, a leadership timeline, and an index of technical explorations.

## Local development

Use Node.js 22 and npm.

```sh
npm ci
npm test
npm run build
npm run preview
```

Vercel builds with Vite and serves `dist/`. The portfolio needs no environment variables or API keys.

## Interactions

- **Cmd+K / Ctrl+K** finds chapters, project demos, the Hallo Batam commit, language, and contact actions.
- The chapter dock follows scroll position and supports direct links, including the existing project and Playground anchors.
- Project images open a dialog with fit-to-screen and original-size views.
- The Batam stage offers an original capture and a portfolio-side demo because the live app blocks framing. The source links and production and vector-retrieval diagrams describe the audited architecture and an optional design path separately.
- The Playground streams local sample answers for food, beaches, and one-day itineraries. Its live app link remains available throughout, and the language used for a reply stays fixed when it begins.
- The OS reduced-motion preference disables streaming animation and reduces interface motion.

## Project imagery

| Asset | Source |
| --- | --- |
| `batam-chat.webp` | [Hallo Batam AI](https://batamtes.vercel.app/), a public chat about beaches in Nongsa |
| `cireundeu.webp` | [Kampung Adat Cireundeu](https://kampungcireundeu.kii.lat/) |
| `quran.webp` | [Sahabat Qur’an](https://sahabatquran-phi.vercel.app/) |
| `rag.webp` | [Batam Django backend public README](https://github.com/FahmiRfld-Tech/wisatabatam-backend.) |

## AI Video Clipper demo

Open `/clipper/` for the browser adaptation of the verified November 17, 2026 Windows AI Video Clipper v3 release. See [release provenance](#clipper-release-provenance) for the exact source reference. The web demo starts with a synthetic robot-camera test video and a reference SRT. It also accepts local MP4/WebM files up to 90 seconds and 60 MB. The video stays in the browser.

- The optional multilingual Whisper Tiny worker downloads its model weights from Hugging Face and runs inference on-device with Transformers.js and ONNX Runtime. Importing an SRT or using the included sample is an alternative to model inference.
- Timestamped transcript ranking is adapted from the v3 desktop low-memory path. Its score represents transcript signals, and users can select a clip manually.
- The browser exports 720 × 1280 clips with original audio using Canvas, Web Audio, and MediaRecorder, plus a separate rebased SRT. It uses MP4 where supported and falls back to WebM. Keep the tab open during real-time export.
- The Windows app uses its own Ollama, FFmpeg, YouTube input, and Google Drive workflow. That runtime lives outside this repository.


### Clipper release provenance

The reference is the November 17, 2026 `AI_Video_Clipper_Final_Source.zip` archive (SHA-256 `cd4cbd6acf6762b9373fe177b91e6b194bd48353a58169a9d276e4ce3c77e6c3`). The archive records 79 passing desktop tests, one skipped face-fixture test, six local MP4 exports, and six verified Drive uploads for a desktop job. These are historical results for the Windows release.

The web selector adapts that archive's `lean_analysis.py` and the non-overlap check in `media.py`, with shorter duration defaults for the browser. The separate resume patch was shipped as source only and had not been tested with the Windows executable or a live Drive upload. MotionKlip was a separate gaming fork labeled source preview.


### Multimodal Pipeline Inspector

Open [chapter 05, AI Video Clipper](https://fahmi-portfolio-sand.vercel.app/#lab-clipper) to explore three design decisions with synthetic data:

- **Hook scoring.** A stored model-output fixture provides only segment IDs. The validator rejects unknown or reversed IDs and extra fields, then looks up the exact integer-millisecond boundaries. The score of 94 is an illustrative model output.
- **VAD and GOP alignment.** The fixture evaluates a 20 ms amplitude envelope and selects a point 180 ms later, inside a 300 ms low-energy gap. The design favors keyframes within the gap for stream-copy and otherwise re-encodes the GOP edge. The inspector does not decode audio or inspect a real bitstream.
- **9:16 reframing.** Scrub prerecorded face coordinates to inspect EMA smoothing (alpha 0.18) with a 4 px dead zone. The no-face fixture displays the full screen feed against a blurred vertical background. The face confidence is illustrative.

The two-hour-to-under-four-minute figure is a workflow target. The public browser demo uses local transcript heuristics and a user-selected fit/fill layout. It does not run the illustrated VAD or computer vision pipeline on visitor videos.

- [Inspector implementation](src/editorial/ClipperInspector.jsx) and [fixture algorithms](src/editorial/clipper-pipeline.js)
- [Browser clipper source](src/clipper) and [inspector commit history](https://github.com/FahmiRfld-Tech/fahmi-portfolio/commits/main/src/editorial/ClipperInspector.jsx)
