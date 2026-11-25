import { env, pipeline } from '@huggingface/transformers'

env.allowLocalModels = false
env.backends.onnx.wasm.numThreads = 1
let model

self.onmessage = async ({ data: { pcm, language } }) => {
  try {
    model ??= pipeline('automatic-speech-recognition', 'onnx-community/whisper-tiny', {
      device: 'wasm',
      dtype: 'q8',
      revision: 'ff4177021cc41f7db950912b73ea4fdf7d01d8e7',
      progress_callback(event) {
        if (event.status === 'progress' && Number.isFinite(event.progress)) {
          self.postMessage({ kind: 'loading', progress: Math.round(event.progress) })
        }
      },
    }).catch(error => {
      model = undefined
      throw error
    })
    const transcribe = await model
    self.postMessage({ kind: 'transcribing' })
    const output = await transcribe(pcm, {
      language, task: 'transcribe', return_timestamps: true, chunk_length_s: 28, stride_length_s: 4,
    })
    self.postMessage({ kind: 'done', chunks: output.chunks ?? [] })
  } catch {
    self.postMessage({ kind: 'failed' })
  }
}
