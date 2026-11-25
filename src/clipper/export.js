const recorderTypes = [
  'video/mp4;codecs=avc1.42001f,mp4a.40.2',
  'video/webm;codecs=vp8,opus',
  'video/webm',
]

function mediaEvent(video, event, signal) {
  return new Promise((resolve, reject) => {
    const dispose = () => {
      video.removeEventListener(event, ready)
      video.removeEventListener('error', failed)
      signal.removeEventListener('abort', failed)
    }
    const ready = () => { dispose(); resolve() }
    const failed = () => { dispose(); reject(new Error('media')) }
    if (signal.aborted) return failed()
    video.addEventListener(event, ready, { once: true })
    video.addEventListener('error', failed, { once: true })
    signal.addEventListener('abort', failed, { once: true })
  })
}

export async function exportClip(url, { start, end }, layout, signal, onProgress) {
  if (typeof MediaRecorder === 'undefined' || !HTMLCanvasElement.prototype.captureStream) throw new Error('unsupported')
  const mimeType = recorderTypes.find(type => MediaRecorder.isTypeSupported(type))
  if (!mimeType) throw new Error('unsupported')

  const video = document.createElement('video')
  const canvas = document.createElement('canvas')
  const context = new AudioContext()
  let frame
  let stream
  let recordedMs = 0
  try {
    await context.resume()
    video.playsInline = true
    video.preload = 'auto'
    const loaded = mediaEvent(video, 'loadeddata', signal)
    video.src = url
    await loaded
    if (start > 0) {
      const seeked = mediaEvent(video, 'seeked', signal)
      video.currentTime = start
      await seeked
    }

    canvas.width = 720
    canvas.height = 1280
    const graphics = canvas.getContext('2d')
    const destination = context.createMediaStreamDestination()
    context.createMediaElementSource(video).connect(destination)
    stream = canvas.captureStream(24)
    destination.stream.getAudioTracks().forEach(track => stream.addTrack(track))
    const scale = (layout === 'fill' ? Math.max : Math.min)(canvas.width / video.videoWidth, canvas.height / video.videoHeight)
    const w = video.videoWidth * scale
    const h = video.videoHeight * scale
    function draw() {
      graphics.fillStyle = '#101119'
      graphics.fillRect(0, 0, canvas.width, canvas.height)
      graphics.drawImage(video, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h)
    }

    draw()
    const output = new Promise((resolve, reject) => {
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2600000 })
      const chunks = []
      let startedAt
      const stop = () => {
        cancelAnimationFrame(frame)
        video.pause()
        if (recorder.state !== 'inactive') {
          recordedMs = performance.now() - startedAt
          recorder.stop()
        }
      }
      signal.addEventListener('abort', stop, { once: true })
      recorder.ondataavailable = ({ data }) => { if (data.size) chunks.push(data) }
      recorder.onerror = () => { stop(); reject(new Error('recording')) }
      recorder.onstop = () => {
        signal.removeEventListener('abort', stop)
        if (signal.aborted || !chunks.length) reject(new Error('recording'))
        else resolve({ blob: new Blob(chunks, { type: recorder.mimeType }), extension: mimeType.startsWith('video/mp4') ? 'mp4' : 'webm' })
      }
      function tick() {
        draw()
        onProgress(Math.min(100, Math.round((video.currentTime - start) / (end - start) * 100)))
        if (signal.aborted || video.ended || video.currentTime >= end) stop()
        else frame = requestAnimationFrame(tick)
      }
      if (signal.aborted) return reject(new Error('recording'))
      startedAt = performance.now()
      recorder.start(250)
      video.play().then(tick, () => { stop(); reject(new Error('playback')) })
    })
    const result = await output
    if (result.extension === 'webm') {
      const { default: fixDuration } = await import('fix-webm-duration')
      result.blob = await fixDuration(result.blob, recordedMs, undefined, { logger: false })
    }
    return result
  } finally {
    cancelAnimationFrame(frame)
    stream?.getTracks().forEach(track => track.stop())
    video.removeAttribute('src')
    video.load()
    await context.close()
  }
}
