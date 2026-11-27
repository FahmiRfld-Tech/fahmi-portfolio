import test from 'node:test'
import assert from 'node:assert/strict'
import { audioEnergy, findSilenceSnap, frameMs, hookResult, rawBoundary, resolveSegmentIds, smoothCenters, timestamp, waveformStart } from '../src/editorial/clipper-pipeline.js'

test('resolves model-selected IDs to indexed integer milliseconds', () => {
  assert.deepEqual(resolveSegmentIds(hookResult), { start: 263860, end: 294620, ids: ['SEG-15', 'SEG-16'] })
  assert.equal(timestamp(294620), '04:54.620')
})

test('rejects unknown IDs, reverse ranges, malformed output, and model timestamps', () => {
  for (const value of [null, [], { ...hookResult, start_seg: 'SEG-99' }, { ...hookResult, start_seg: 'SEG-17' },
    { ...hookResult, start_ms: 42 }, { ...hookResult, hallucination_guard: 'BYPASS' }]) {
    assert.equal(resolveSegmentIds(value), null)
  }
})

test('places the cut 180 ms into a safe 300 ms gap around the boundary', () => {
  const gap = findSilenceSnap(audioEnergy, waveformStart, frameMs, rawBoundary)
  assert.equal(gap.cut - rawBoundary, 180)
  assert.equal(gap.duration, 300)
  assert.ok(gap.cut > gap.start && gap.cut < gap.start + gap.duration)
  assert.equal(findSilenceSnap(Array(12).fill(0.04), 0, 20, 90), null)
  assert.equal(findSilenceSnap(Array(13).fill(0.04), 0, 20, 130).cut, 130)
})

test('suppresses sub-dead-zone jitter and converges on larger face movement', () => {
  const frames = [100, 103, ...Array(30).fill(170)]
  const trace = smoothCenters(frames)
  assert.equal(trace[1], 100)
  assert.ok(trace[2] > 100 && trace[2] < 170)
  assert.ok(trace.at(-1) >= 166 && trace.at(-1) <= 170)
})
