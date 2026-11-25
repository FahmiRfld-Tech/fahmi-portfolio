# M Fahmi Rifaldi — Engineering Portfolio

A bilingual (ID/EN) portfolio built with React, Vite, Tailwind CSS, Framer Motion, and Lucide. The home page features a real Hallo Batam AI conversation, with supporting case studies, experience, and contact details.

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

- **Cmd+K / Ctrl+K** opens search for sections, projects, language, and contact actions.
- Project images open a dialog with fit-to-screen and original-size views.
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

Open `/clipper/` for the browser adaptation of the Windows AI Video Clipper v3. The web demo starts with a synthetic robot-camera test video and a reference SRT. It also accepts local MP4/WebM files up to 90 seconds and 60 MB. The video stays in the browser.

- The optional multilingual Whisper Tiny worker downloads its model weights from Hugging Face and runs inference on-device with Transformers.js and ONNX Runtime. Importing an SRT or using the included sample is an alternative to model inference.
- Timestamped transcript ranking is adapted from the v3 desktop low-memory path. Its score represents transcript signals, and users can select a clip manually.
- The browser exports 720 × 1280 clips with original audio using Canvas, Web Audio, and MediaRecorder, plus a separate rebased SRT. It uses MP4 where supported and falls back to WebM. Keep the tab open during real-time export.
- The Windows app uses its own Ollama, FFmpeg, YouTube input, and Google Drive workflow. That runtime lives outside this repository.
