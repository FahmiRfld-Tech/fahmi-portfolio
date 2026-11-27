export const transcript = [
  { id: 'SEG-14', start: 252180, end: 263860, copy: ['Awalnya semua orang mengira kameranya rusak.', 'At first, everyone thought the camera was broken.'] },
  { id: 'SEG-15', start: 263860, end: 280320, copy: ['Yang mengejutkan, masalahnya bukan ada di sensor.', 'The surprise was that the sensor was fine.'] },
  { id: 'SEG-16', start: 280320, end: 294620, copy: ['Satu kabel longgar mengubah seluruh hasil pengujian.', 'One loose cable changed the entire test result.'] },
  { id: 'SEG-17', start: 294620, end: 298140, copy: ['Mari bandingkan kedua rekaman.', 'Let’s compare the two recordings.'] },
]

export const hookResult = {
  start_seg: 'SEG-15',
  end_seg: 'SEG-16',
  hallucination_guard: 'ID_LOCKED',
}

export function resolveSegmentIds(output) {
  const fields = ['start_seg', 'end_seg', 'hallucination_guard']
  if (output === null || typeof output !== 'object' || Array.isArray(output)) return null
  if (Object.keys(output).length !== fields.length || !fields.every(field => Object.hasOwn(output, field))
    || output.hallucination_guard !== 'ID_LOCKED') return null
  const first = transcript.findIndex(segment => segment.id === output.start_seg)
  const last = transcript.findIndex(segment => segment.id === output.end_seg)
  if (first < 0 || last < first) return null
  return { start: transcript[first].start, end: transcript[last].end, ids: transcript.slice(first, last + 1).map(row => row.id) }
}

export const rawBoundary = 294440
export const frameMs = 20
export const waveformStart = 293980
const speech = [0.51, 0.73, 0.44, 0.83, 0.62, 0.40, 0.78, 0.53, 0.9, 0.47, 0.70]
export const audioEnergy = Array.from({ length: 52 }, (_, i) =>
  i >= 29 && i < 44 ? [0.07, 0.04, 0.08, 0.05][i % 4] : speech[i % speech.length])

export function findSilenceSnap(energy, origin, hop, raw, threshold = 0.12, minGap = 250) {
  let start = null
  let best = null
  for (let index = 0; index <= energy.length; index++) {
    const time = origin + index * hop
    if (energy[index] < threshold) {
      start ??= time
    } else if (start !== null) {
      const duration = time - start
      if (duration > minGap) {
        // Find the first interior frame near a voiced edge or keep a cut already in the gap.
        const inset = Math.min(3 * hop, Math.floor(duration / 2))
        const cut = Math.min(time - inset, Math.max(start + inset, raw))
        if (!best || Math.abs(cut - raw) < Math.abs(best.cut - raw)) best = { start, duration, cut }
      }
      start = null
    }
  }
  return best
}

export const alpha = 0.18
export const deadZone = 4
export const faceSamples = [96, 151, 148, 156, 152, 163, 158, 171, 167, 177, 174, 180, 177, 179, 181, 178, 182, 179, 181, 180]

export function smoothCenters(centers) {
  return centers.reduce((track, center) => {
    const previous = track.at(-1) ?? center
    const delta = center - previous
    track.push(Math.abs(delta) <= deadZone ? previous : previous + alpha * delta)
    return track
  }, [])
}

export function timestamp(ms) {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor(ms / 1000) % 60
  return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0') + '.' + String(ms % 1000).padStart(3, '0')
}
