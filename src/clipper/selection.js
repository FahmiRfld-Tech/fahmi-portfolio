// The v3 desktop lean_analysis.py ranks transcript windows by reaction words,
// punctuation and context, then media.py removes overlaps and duplicate titles.
const reactions = /\b(?:aduh|astaga|panik|lucu|ketawa|hahaha|wkwk|gila|anjir|waduh|buset|ternyata|kenapa|clutch|menang|kalah|serius|wow|what|why|laugh|funny|crazy)\b/gi
const greeting = /^(?:wabarakatuh|warahmatullahi|assalamualaikum)[.!?]?$/i
const promotion = /jangan lupa subscribe|selamat datang|sponsor|kode referral/i
const sentenceEnd = /[.!?]["”]?$/

function reactionCount(text) {
  return [...text.matchAll(reactions)].length
}

function hook(text) {
  const sentences = text.split(/(?<=[.!?,])\s+/)
    .filter(row => row.length <= 54 && row.split(/\s+/).length >= 3 && row.split(/\s+/).length <= 10)
  const questions = sentences.filter(row => row.includes('?'))
  const pool = questions.length ? questions : sentences
  const title = pool.sort((a, b) => reactionCount(b) - reactionCount(a)
    || Number(b.endsWith('?')) - Number(a.endsWith('?'))
    || Math.abs(a.split(/\s+/).length - 9) - Math.abs(b.split(/\s+/).length - 9))[0] ?? text
  return title.length <= 64 ? title : title.slice(0, 63).replace(/\s+\S*$/, '') + '…'
}

export function normalizeCues(rows, duration) {
  return rows.flatMap(({ start, end, text }) => {
    if (!Number.isFinite(start) || !Number.isFinite(end) || !text?.trim()) return []
    const from = Math.max(0, start)
    const to = Math.min(end, duration)
    return to > from ? [{ start: from, end: to, text: text.replace(/\s+/g, ' ').trim() }] : []
  }).sort((a, b) => a.start - b.start || a.end - b.end)
}

const timePattern = /^(\d{1,3}):(\d{2}):(\d{2})[,.](\d{3})$/

function parseTime(value) {
  const parts = timePattern.exec(value.trim())
  if (!parts || Number(parts[2]) >= 60 || Number(parts[3]) >= 60) return NaN
  return Number(parts[1]) * 3600 + Number(parts[2]) * 60 + Number(parts[3]) + Number(parts[4]) / 1000
}

export function parseSrt(text, duration) {
  const rows = text.replace(/^\uFEFF/, '').replaceAll('\r', '').trim().split(/\n\s*\n/)
  return normalizeCues(rows.flatMap(row => {
    const lines = row.split('\n')
    const timing = lines.findIndex(line => line.includes('-->'))
    if (timing < 0) return []
    const [from, to] = lines[timing].split('-->')
    return [{ start: parseTime(from), end: parseTime(to), text: lines.slice(timing + 1).join(' ').replace(/<[^>]*>/g, '') }]
  }), duration)
}

export function findClips(cues, { min = 6, max = 14, target = 12, limit = 4 } = {}) {
  const candidates = []
  for (let i = 0; i < cues.length; i++) {
    const first = cues[i]
    if (greeting.test(first.text)) continue
    let text = ''
    let best
    for (let j = i; j < cues.length && cues[j].start < first.start + max; j++) {
      const row = cues[j]
      const duration = row.end - first.start
      if (duration > max) continue
      text = [text, row.text].filter(Boolean).join(' ')
      if (duration < min) continue
      const hits = reactionCount(text)
      if (!hits || promotion.test(text)) continue
      const question = text.slice(0, 160).includes('?')
      const ending = sentenceEnd.test(text)
      const score = Math.min(91, 69 + Math.min(15, hits * 3) + (ending ? 3 : 0) + (question ? 2 : 0))
      if (score < 74) continue
      const distance = Math.abs(duration - target)
      if (!best || score > best.score || (score === best.score && distance < best.distance)) {
        best = { start: first.start, end: row.end, title: hook(text), score, question, hits, distance }
      }
    }
    if (best) candidates.push(best)
  }
  const chosen = []
  const titles = new Set()
  for (const clip of candidates.sort((a, b) => b.score - a.score || a.start - b.start)) {
    const titleKey = clip.title.toLowerCase().replace(/[^\p{L}\d]+/gu, ' ').trim()
    if (titles.has(titleKey) || chosen.some(c => clip.start < c.end && clip.end > c.start)) continue
    titles.add(titleKey)
    chosen.push(clip)
    if (chosen.length >= limit) break
  }
  return chosen
}

export function subtitleTime(seconds, separator = ',') {
  const milliseconds = Math.round(Math.max(0, seconds) * 1000)
  const fields = [Math.floor(milliseconds / 3600000), Math.floor(milliseconds / 60000) % 60, Math.floor(milliseconds / 1000) % 60]
  return fields.map(value => String(value).padStart(2, '0')).join(':') + separator + String(milliseconds % 1000).padStart(3, '0')
}

export function clipSrt(cues, { start, end }) {
  return cues.filter(cue => cue.start < end && cue.end > start)
    .map((cue, i) => [
      i + 1,
      subtitleTime(Math.max(0, cue.start - start)) + ' --> ' + subtitleTime(Math.min(end, cue.end) - start),
      cue.text,
    ].join('\n')).join('\n\n')
}

export function clock(seconds) {
  const whole = Math.floor(Math.max(0, seconds))
  return String(Math.floor(whole / 60)).padStart(2, '0') + ':' + String(whole % 60).padStart(2, '0')
}
