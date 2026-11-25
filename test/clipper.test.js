import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { clipSrt, findClips, normalizeCues, parseSrt, subtitleTime } from '../src/clipper/selection.js'

const transcript = readFileSync(new URL('../public/clipper/sample.srt', import.meta.url), 'utf8')
const cues = parseSrt(transcript, 25)

test('returns ranked sample clips backed by non-overlapping transcript windows', () => {
  const clips = findClips(cues)
  assert.equal(cues.length, 7)
  assert.equal(clips.length, 2)
  assert.ok(clips.every(clip => clip.start >= 0 && clip.end <= 25 && clip.end - clip.start <= 30))
  assert.ok(clips[0].score >= clips[1].score)
  assert.ok(clips[0].start >= clips[1].end || clips[1].start >= clips[0].end)
  assert.ok(clips.some(clip => clip.title.includes('?')))
})

test('accepts Indonesian reaction cues and skips promotional transcript windows', () => {
  const rows = [
    { start: 0, end: 4, text: 'Kenapa kameranya mati?' },
    { start: 4, end: 9, text: 'Waduh, kabelnya putus.' },
    { start: 40, end: 49, text: 'Wow, ini kode referral.' },
  ]
  const clips = findClips(rows)
  assert.equal(clips.length, 1)
  assert.equal(clips[0].title, rows[0].text)
})

test('filters invalid timestamps and clamps overlapping cues to the media duration', () => {
  const rows = normalizeCues([
    { start: 5, end: 13, text: ' first\r\n last ' },
    { start: -1, end: 3, text: 'zero' },
    { start: null, end: 3, text: 'ignored' },
    { start: 30, end: 32, text: 'ignored' },
  ], 10)
  assert.deepEqual(rows, [{ start: 0, end: 3, text: 'zero' }, { start: 5, end: 10, text: 'first last' }])
  assert.deepEqual(parseSrt('1\n00:99:00,000 --> 00:99:01,000\nignored', 20), [])
})

test('exports subtitles relative to the selected clip and clips boundary cues', () => {
  const exported = clipSrt(cues, { start: 4, end: 8 })
  assert.match(exported, /00:00:00,000 --> 00:00:02,190/)
  assert.match(exported, /00:00:02,750 --> 00:00:04,000/)
  assert.doesNotMatch(exported, /Wow/)
  assert.equal(subtitleTime(59.9999), '00:01:00,000')
})
