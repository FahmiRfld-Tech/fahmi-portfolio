import test from 'node:test'
import assert from 'node:assert/strict'
import { matchScenario } from '../src/playground-scenarios.js'

const questions = [
  ['Rekomendasi seafood di Batam?', 'food'],
  ['Di mana bisa makan hidangan laut?', 'food'],
  ['Where can I eat seafood?', 'food'],
  ['Pantai mana yang cocok untuk sore hari?', 'coast'],
  ['Buat itinerary satu hari di Batam', 'day'],
  ['What are some beaches near Nongsa?', 'coast'],
  ['Plan a one-day trip that includes a beach.', 'day'],
  ['Help me search for a JavaScript job.', undefined],
  ['Berapa tarif kereta Jakarta?', undefined],
]

for (const [question, expected] of questions) {
  test(question, () => assert.equal(matchScenario(question)?.id, expected))
}
