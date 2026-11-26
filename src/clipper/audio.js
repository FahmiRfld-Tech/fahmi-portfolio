export async function decodeSpeech(file) {
  const source = new AudioContext()
  try {
    const decoded = await source.decodeAudioData(await file.arrayBuffer())
    const frames = Math.max(1, Math.ceil(decoded.duration * 16000))
    const offline = new OfflineAudioContext(1, frames, 16000)
    const buffer = offline.createBufferSource()
    buffer.buffer = decoded
    buffer.connect(offline.destination)
    buffer.start()
    return (await offline.startRendering()).getChannelData(0)
  } finally {
    await source.close()
  }
}

export function transcribeSpeech(worker, pcm, language, notify, signal) {
  return new Promise((resolve, reject) => {
    const dispose = () => {
      worker.removeEventListener('message', message)
      worker.removeEventListener('error', failed)
      signal.removeEventListener('abort', aborted)
    }
    const failed = () => {
      dispose()
      reject(new Error('transcription'))
    }
    const aborted = () => {
      dispose()
      reject(new DOMException('Canceled', 'AbortError'))
    }
    const message = ({ data }) => {
      if (data.kind === 'done') {
        dispose()
        resolve(data.chunks)
      } else if (data.kind === 'failed') failed()
      else notify(data)
    }
    if (signal.aborted) return aborted()
    worker.addEventListener('message', message)
    worker.addEventListener('error', failed)
    signal.addEventListener('abort', aborted, { once: true })
    worker.postMessage({ pcm, language }, [pcm.buffer])
  })
}
