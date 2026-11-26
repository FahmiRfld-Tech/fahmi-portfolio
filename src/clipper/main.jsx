import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowLeft, ArrowRight, Captions, Check, Download, Film, FileUp, Laptop,
  Play, Scissors, ShieldCheck, Sparkles, Square, Upload, Video,
} from 'lucide-react'
import { decodeSpeech, transcribeSpeech } from './audio'
import { exportClip } from './export'
import { clipSrt, clock, findClips, normalizeCues, parseSrt } from './selection'
import './style.css'

const sample = { url: '/clipper/sample.mp4', name: 'Robot camera test.mp4', file: null }
const maxDuration = 90
const maxFileSize = 60 * 1024 * 1024
const word = {
  back: ['Portofolio', 'Portfolio'],
  lead: ['Temukan momen dari transkrip dan ekspor cuplikan vertikal.', 'Find highlights in a transcript and export a vertical clip.'],
  private: ['Video diproses di perangkat ini', 'Your video stays on this device'],
  media: ['Video sumber', 'Source video'],
  replace: ['Pilih video', 'Choose video'],
  sample: ['Pakai contoh', 'Use sample'],
  fileLimits: ['MP4 atau WebM · maks. 90 detik / 60 MB', 'MP4 or WebM · up to 90 seconds / 60 MB'],
  badSize: ['Pilih video dengan ukuran hingga 60 MB.', 'Choose a video up to 60 MB.'],
  badVideo: ['Video tidak bisa diputar. Coba MP4 atau WebM lain.', 'This video cannot be played. Try another MP4 or WebM.'],
  badDuration: ['Pilih video dengan durasi maksimal 90 detik.', 'Choose a video no longer than 90 seconds.'],
  badSrt: ['Belum ada timestamp SRT yang cocok dengan video ini.', 'No valid SRT timestamps overlap this video.'],
  transcript: ['Transkrip', 'Transcript'],
  import: ['Impor SRT', 'Import SRT'],
  transcribe: ['Transkripsi dengan Whisper', 'Transcribe with Whisper'],
  model: ['Pilihan Whisper mengunduh model saat pertama dipakai.', 'Whisper downloads model files on first use.'],
  loading: ['Mengunduh model Whisper…', 'Downloading the Whisper model…'],
  decoding: ['Menyiapkan audio…', 'Preparing audio…'],
  running: ['Whisper sedang membaca audio…', 'Whisper is transcribing the audio…'],
  failed: ['Transkripsi gagal. Coba format video lain atau impor SRT.', 'Transcription failed. Try another video format or import SRT.'],
  noSpeech: ['Whisper tidak menemukan ucapan dengan timestamp.', 'Whisper found no timestamped speech.'],
  sampleSource: ['SRT contoh', 'Sample SRT'],
  local: ['Impor SRT', 'Imported SRT'],
  inference: ['Whisper Tiny', 'Whisper Tiny'],
  scan: ['Cari momen', 'Find highlights'],
  highlights: ['Kandidat cuplikan', 'Clip candidates'],
  reason: ['Pola transkrip', 'Transcript signals'],
  question: ['Pertanyaan', 'Question'],
  reaction: ['Kata reaksi', 'Reaction cues'],
  empty: ['Tambahkan transkrip atau pilih rentang manual.', 'Add a transcript or choose a range manually.'],
  none: ['Belum ada pola transkrip yang lolos. Coba rentang manual.', 'No transcript windows matched. Try choosing a range manually.'],
  manual: ['Rentang manual', 'Manual range'],
  start: ['Mulai (detik)', 'Start (seconds)'],
  end: ['Akhir (detik)', 'End (seconds)'],
  range: ['Masukkan rentang 1–30 detik di dalam durasi video.', 'Enter a range of 1–30 seconds within the video.'],
  apply: ['Pakai rentang', 'Use range'],
  layout: ['Bingkai 9:16', '9:16 framing'],
  fit: ['Utuh', 'Fit'],
  fill: ['Potong tengah', 'Center crop'],
  preview: ['Putar cuplikan', 'Play clip'],
  sourceView: ['Lihat video sumber', 'View source video'],
  export: ['Ekspor video 9:16', 'Export 9:16 video'],
  srt: ['Unduh SRT', 'Download SRT'],
  exporting: ['Mengekspor…', 'Exporting…'],
  output: ['Unduh hasil', 'Download export'],
  exportFail: ['Ekspor gagal di browser ini. Coba Chrome desktop atau perangkat lain.', 'Export failed in this browser. Try desktop Chrome or another device.'],
  cancel: ['Batalkan', 'Cancel'],
  ready: ['Ekspor selesai.', 'Export ready.'],
  note: ['Pemilihan momen memakai heuristik dari Clipper v3. Periksa konteks sebelum dipublikasikan.', 'Highlight selection uses heuristics adapted from Clipper v3. Review the context before publishing.'],
  desktop: ['Alur desktop memproses video panjang dengan Whisper, Ollama dan FFmpeg. Demo web ini fokus pada klip pendek.', 'The desktop workflow handles long video with Whisper, Ollama, and FFmpeg. This web demo focuses on short clips.'],
}

function App() {
  const [lang, setLang] = useState(() => new URLSearchParams(location.search).get('lang') === 'en' ? 1 : 0)
  const [source, setSource] = useState(sample)
  const [duration, setDuration] = useState(0)
  const [cues, setCues] = useState([])
  const [transcriptKind, setTranscriptKind] = useState(null)
  const [speech, setSpeech] = useState('indonesian')
  const [clips, setClips] = useState([])
  const [selected, setSelected] = useState(null)
  const [scanned, setScanned] = useState(false)
  const [manualRange, setManualRange] = useState(['0', ''])
  const [portrait, setPortrait] = useState(false)
  const [layout, setLayout] = useState('fit')
  const [task, setTask] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [result, setResult] = useState(null)
  const video = useRef(null)
  const operation = useRef(null)
  const worker = useRef(null)
  const previewEnd = useRef(null)
  const t = key => word[key][lang]

  useEffect(() => {
    document.documentElement.lang = lang ? 'en' : 'id'
  }, [lang])

  useEffect(() => {
    if (!source.file) return
    return () => URL.revokeObjectURL(source.url)
  }, [source])

  useEffect(() => {
    if (!result) return
    return () => URL.revokeObjectURL(result.url)
  }, [result])

  useEffect(() => () => {
    operation.current?.abort()
    worker.current?.terminate()
  }, [])

  useEffect(() => {
    if (source !== sample || !duration) return
    const controller = new AbortController()
    fetch('/clipper/sample.srt', { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('sample')
        return response.text()
      })
      .then(text => {
        const rows = parseSrt(text, duration)
        const highlights = findClips(rows)
        setCues(rows)
        setTranscriptKind('sampleSource')
        setClips(highlights)
        setSelected(highlights[0] ?? null)
        setScanned(true)
      })
      .catch(() => { if (!controller.signal.aborted) setFeedback('badSrt') })
    return () => controller.abort()
  }, [source, duration])

  function cancel() {
    operation.current?.abort()
    operation.current = null
    if (task && task.kind !== 'exporting') {
      worker.current?.terminate()
      worker.current = null
    }
    setTask(null)
  }

  function load(next) {
    if (source === next) return
    cancel()
    setSource(next)
    setDuration(0)
    setCues([])
    setTranscriptKind(null)
    setClips([])
    setSelected(null)
    setScanned(false)
    setManualRange(['0', ''])
    setPortrait(false)
    setFeedback(null)
    setResult(null)
    previewEnd.current = null
  }

  function uploadVideo(file) {
    if (!file) return
    if (file.size > maxFileSize) { setFeedback('badSize'); return }
    setSpeech('indonesian')
    load({ url: URL.createObjectURL(file), file, name: file.name })
  }

  function readDuration(event) {
    const length = event.currentTarget.duration
    if (!Number.isFinite(length) || length <= 0) { setFeedback('badVideo'); return }
    if (length > maxDuration) { setFeedback('badDuration'); return }
    setDuration(length)
    setManualRange(['0', String(Math.floor(Math.min(length, 12) * 10) / 10)])
  }

  function locate(rows) {
    const next = findClips(rows)
    setClips(next)
    setScanned(true)
    setSelected(next[0] ?? null)
    setResult(null)
  }

  async function importSrt(file) {
    if (!file) return
    try {
      const current = video.current
      if (file.size > 256 * 1024) throw new Error('size')
      const raw = await file.text()
      if (current !== video.current) return
      const rows = parseSrt(raw, duration)
      if (!rows.length) throw new Error('srt')
      setCues(rows)
      setTranscriptKind('local')
      setFeedback(null)
      locate(rows)
    } catch { setFeedback('badSrt') }
  }

  async function runWhisper() {
    if (!duration || task) return
    const controller = new AbortController()
    operation.current = controller
    setTask({ kind: 'decoding' })
    setFeedback(null)
    try {
      const from = source.file ?? await fetch(source.url, { signal: controller.signal }).then(response => response.blob())
      const pcm = await decodeSpeech(from)
      if (controller.signal.aborted) return
      worker.current ??= new Worker(new URL('./asr.worker.js', import.meta.url), { type: 'module' })
      const chunks = await transcribeSpeech(worker.current, pcm, source === sample ? 'english' : speech, update => {
        if (!controller.signal.aborted) setTask({
          kind: update.kind === 'transcribing' ? 'running' : 'loading',
        })
      }, controller.signal)
      const rows = normalizeCues(chunks.map(({ timestamp: [start, end], text }) => ({ start, end: end ?? duration, text })), duration)
      if (!rows.length) { setFeedback('noSpeech'); return }
      setCues(rows)
      setTranscriptKind('inference')
      locate(rows)
    } catch {
      if (!controller.signal.aborted) setFeedback('failed')
    } finally {
      if (operation.current === controller) {
        setTask(null)
        operation.current = null
      }
    }
  }

  function choose(clip) {
    previewEnd.current = null
    video.current.pause()
    video.current.currentTime = clip.start
    setSelected(clip)
    setResult(null)
    setFeedback(null)
  }

  function chooseManual(event) {
    event.preventDefault()
    const [start, end] = manualRange.map(Number)
    if (!Number.isFinite(start) || !Number.isFinite(end) || !manualRange[1] || start < 0 || end > duration || end - start < 1 || end - start > 30) {
      setFeedback('range')
      return
    }
    choose({ start, end, title: lang ? 'Manual clip' : 'Cuplikan manual' })
  }

  function play() {
    setPortrait(true)
    video.current.currentTime = selected.start
    previewEnd.current = selected.end
    video.current.play().catch(() => setFeedback('badVideo'))
  }

  async function renderClip() {
    if (!selected || task) return
    const controller = new AbortController()
    operation.current = controller
    video.current.pause()
    setResult(null)
    setFeedback(null)
    setTask({ kind: 'exporting', progress: 0 })
    try {
      const { blob, extension } = await exportClip(source.url, selected, layout, controller.signal, progress => {
        if (!controller.signal.aborted) setTask({ kind: 'exporting', progress })
      })
      if (controller.signal.aborted) return
      setResult({ url: URL.createObjectURL(blob), name: 'clip-' + clock(selected.start).replace(':', '-') + '.' + extension })
      setFeedback('ready')
    } catch {
      if (!controller.signal.aborted) setFeedback('exportFail')
    } finally {
      if (operation.current === controller) {
        setTask(null)
        operation.current = null
      }
    }
  }

  function downloadSrt() {
    const url = URL.createObjectURL(new Blob([clipSrt(cues, selected) + '\n'], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'clip.srt'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const hasSubtitles = selected && cues.some(cue => cue.start < selected.end && cue.end > selected.start)
  return <>
    <header className="top"><div className="workspace top-content">
      <a href={lang ? "/?lang=en#projects" : "/#projects"}><ArrowLeft size={17} /> {t('back')}</a>
      <div className="locale" aria-label={lang ? 'Language' : 'Bahasa'} role="group">
        <button type="button" aria-pressed={!lang} onClick={() => setLang(0)} aria-label="Bahasa Indonesia">ID</button>
        <button type="button" aria-pressed={!!lang} onClick={() => setLang(1)} aria-label="English">EN</button>
      </div>
    </div></header>
    <main className="workspace">
      <section className="intro" aria-labelledby="page-title">
        <div><h1 id="page-title"><Scissors aria-hidden="true" size={34} /> AI Video Clipper</h1><p>{t('lead')}</p></div>
        <p className="private"><ShieldCheck size={17} /> {t('private')}</p>
      </section>
      <div className="editor">
        <section className="panel monitor" aria-labelledby="monitor-title">
          <div className="panel-header">
            <h2 id="monitor-title"><Video size={17} /> {t('media')}</h2>
            <span className="time" role="status">
              {selected
                ? (lang ? 'Clip ' : 'Klip ') + clock(selected.start) + '–' + clock(selected.end)
                : clock(duration)}
            </span>
          </div>
          <div className={'theater' + (portrait ? ' portrait' : '')}>
            <video key={source.url} ref={video} src={source.url} preload="metadata" playsInline controls
              aria-label={t('media')} style={{ objectFit: portrait ? (layout === 'fill' ? 'cover' : 'contain') : undefined }}
              onLoadedMetadata={readDuration} onError={() => { setDuration(0); setSelected(null); setFeedback('badVideo') }}
              onTimeUpdate={event => {
                if (previewEnd.current != null && event.currentTarget.currentTime >= previewEnd.current) {
                  event.currentTarget.pause()
                  previewEnd.current = null
                }
              }} />
          </div>
          <div className="media-details">
            <span className="source-name"><Film size={16} /> {source.name}</span>
            <div className="actions">
              {(source !== sample) && <button className="plain" type="button" disabled={!!task} onClick={() => load(sample)}>{t('sample')}</button>}
              <label className="button control"><Upload size={16} />{t('replace')}<input type="file" accept="video/mp4,video/webm" disabled={!!task} onChange={event => {
                uploadVideo(event.target.files[0]); event.target.value = ''
              }} /></label>
            </div>
          </div>
          <p className="meta media-limit">{t('fileLimits')}</p>
          <div className="clip-options">
            <fieldset className="layout"><legend>{t('layout')}</legend>
              <button type="button" disabled={!!task} aria-pressed={layout === 'fit'} onClick={() => { setLayout('fit'); setResult(null) }}>{t('fit')}</button>
              <button type="button" disabled={!!task} aria-pressed={layout === 'fill'} onClick={() => { setLayout('fill'); setResult(null) }}>{t('fill')}</button>
            </fieldset>
            <div className="actions">
              {portrait ? <button className="button" type="button" onClick={() => { video.current.pause(); previewEnd.current = null; setPortrait(false) }}>{t('sourceView')}</button>
                : <button className="button" type="button" disabled={!selected || !!task} onClick={play}><Play size={16} /> {t('preview')}</button>}
            </div>
          </div>
          <div className="panel-footer actions">
            <button className="button primary" type="button" disabled={!selected || !!task} onClick={renderClip}>
              <Download size={17} />{t('export')}
            </button>
            <button className="button" type="button" disabled={!hasSubtitles || !!task} onClick={downloadSrt}><Captions size={17} />{t('srt')}</button>
            {result && <a className="button download" href={result.url} download={result.name}><Check size={16} />{t('output')} .{result.name.split('.').at(-1)}</a>}
          </div>
        </section>
        <aside className="sidebar">
          <section className="panel" aria-labelledby="transcript-title">
            <div className="panel-header"><h2 id="transcript-title"><Captions size={18} />{t('transcript')}</h2>
              {!!cues.length && <span className="time">{t(transcriptKind)} · {cues.length}</span>}
            </div>
            <div className="panel-body transcript">
              <div className="actions">
                <button className="button whisper" type="button" disabled={!duration || !!task} onClick={runWhisper}><Sparkles size={16} />{t('transcribe')}</button>
                <label className="button control"><FileUp size={16} />{t('import')}<input type="file" accept=".srt" disabled={!duration || !!task} onChange={event => {
                  importSrt(event.target.files[0]); event.target.value = ''
                }} /></label>
              </div>
              {source !== sample && <label className="speech">{lang ? 'Speech language' : 'Bahasa audio'}
                <select value={speech} onChange={event => setSpeech(event.target.value)} disabled={!!task}>
                  <option value="indonesian">Indonesia</option><option value="english">English</option>
                </select>
              </label>}
              <p className="meta">{t('model')}</p>
              {!!cues.length && <details><summary>{lang ? 'Read timestamped transcript' : 'Baca transkrip bertimestamp'}</summary>
                <ol>{cues.map(({ start, end, text }, index) => <li key={index}><span className="time">{clock(start)}–{clock(end)}</span>{text}</li>)}</ol>
              </details>}
            </div>
          </section>

          <section className="panel highlights" aria-labelledby="highlights-title">
            <div className="panel-header"><h2 id="highlights-title"><Scissors size={17} />{t('highlights')}</h2>
              <button className="plain text-action" type="button" disabled={!cues.length || !!task} onClick={() => locate(cues)}>{t('scan')} <ArrowRight size={14} /></button>
            </div>
            <div className="panel-body">
              {clips.length ? <ol className="candidates">
                {clips.map((clip, index) => <li key={clip.start}>
                  <button type="button" className="clip" aria-pressed={selected === clip} disabled={!!task} onClick={() => choose(clip)}>
                    <span className="clip-number">{String(index + 1).padStart(2, '0')}</span>
                    <span><strong>{clip.title}</strong>
                      <small>{clock(clip.start)}–{clock(clip.end)} · {clip.question ? t('question') : t('reaction')}</small>
                    </span>
                    <span className="fit-score" title={t('reason')}>{clip.score}<span>/100</span></span>
                  </button>
                </li>)}
              </ol> : <p className="meta">{t(scanned ? 'none' : 'empty')}</p>}
              <details className="manual"><summary>{t('manual')}</summary>
                <form onSubmit={chooseManual} className="range">
                  <label>{t('start')}<input type="number" min="0" max={duration} step="0.1" required value={manualRange[0]} onChange={event => setManualRange([event.target.value, manualRange[1]])} /></label>
                  <label>{t('end')}<input type="number" min="0" max={duration} step="0.1" required value={manualRange[1]} onChange={event => setManualRange([manualRange[0], event.target.value])} /></label>
                  <button className="button" disabled={!duration || !!task}>{t('apply')}</button>
                </form>
              </details>
              {clips.length > 0 && <p className="meta note">{t('note')}</p>}
            </div>
          </section>
        </aside>
      </div>
      <div className="feedback" aria-live="polite" aria-atomic="true">
        {task && <div className="task"><p>{t(task.kind)}</p>
          <button type="button" className="button" onClick={cancel}><Square size={14} />{t('cancel')}</button>
          {task.kind === 'exporting' && <progress value={task.progress} max="100" aria-label={t('exporting')} />}
        </div>}
        {!task && feedback && <p>{t(feedback)}</p>}
      </div>
      <footer><Laptop size={17} /> {t('desktop')}</footer>
    </main>
  </>
}

createRoot(document.getElementById('clipper-root')).render(<App />)
