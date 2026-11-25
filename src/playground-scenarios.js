export const scenarios = [
  {
    id: 'food',
    match: /\b(?:kuliner|makan(?:an)?|hidangan|sea[ -]?food|eat(?:ing)?|food|cuisine|restaurants?|restoran|dining|crab|udang|kepiting)\b/ui,
    label: ['Cari kuliner', 'Find local food'],
    prompt: ['Di mana bisa makan hidangan laut di Batam?', 'Where can I eat seafood in Batam?'],
    answer: [
      'Untuk mencari kuliner lokal, mulai dari kawasan Nagoya atau Batam Centre. Kalau ingin makan hidangan laut, cek menu, lokasi, dan kisaran harga langsung ke tempatnya sebelum datang.',
      'Try Nagoya or Batam Centre as starting points for local food. If you are looking for seafood, check the menu, location, and prices directly with the restaurant before visiting.',
    ],
  },
  {
    id: 'day',
    match: /\b(?:itinerar(?:y|ies)|sehari|(?:satu|1) hari|one[ -]day|single day|day trip|rute(?: wisata| perjalanan)?|jadwal wisata|travel plan|sightseeing route)\b/ui,
    label: ['Rencana sehari', 'Plan a day'],
    prompt: ['Buat itinerary satu hari di Batam.', 'Plan a one-day Batam itinerary.'],
    answer: [
      'Mulai dengan sarapan di area kota, pilih satu kunjungan ke kawasan Barelang, lalu tutup hari dengan kuliner. Sisakan waktu untuk perjalanan darat dan sesuaikan rutenya dengan lokasi penginapan.',
      'Start with breakfast in the city, choose one stop in the Barelang area, and end the day with a meal. Leave time for road travel and adjust the route around where you are staying.',
    ],
  },
  {
    id: 'coast',
    match: /\b(?:pantai|bahari|pesisir|laut|beach(?:es)?|coast(?:al)?|seaside|nongsa)\b/ui,
    label: ['Jelajahi pantai', 'Explore beaches'],
    prompt: ['Pantai mana yang cocok untuk sore hari di Batam?', 'Which Batam beach is good for an afternoon visit?'],
    answer: [
      'Coba mulai dari kawasan Nongsa untuk suasana pesisir. Pilih satu pantai dan sisakan waktu untuk perjalanan dari penginapan. Periksa akses dan kondisi setempat sebelum berangkat.',
      'Start around Nongsa for a coastal outing. Pick one beach and leave time to travel from your accommodation. Check local access and conditions before leaving.',
    ],
  },
]

export const fallback = [
  'Pertanyaan itu di luar cakupan simulasi. Coba salah satu topik di atas: kuliner, pantai, atau rencana sehari di Batam.',
  'That question is outside this simulation. Try one of the topics above: local food, beaches, or a day in Batam.',
]

export function matchScenario(question) {
  const normalized = question.normalize('NFKC').trim()
  return scenarios.find(scenario => scenario.match.test(normalized))
}
