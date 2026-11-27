export const domain = 'Multimodal AI · Multimedia Systems · 2026'

export const architecture = [
  {
    label: ['Indeks segmen antirekaan', 'Anti-hallucination segment indexing'],
    copy: [
      'LLM menilai pasangan ID segmen transkrip dalam skema JSON ketat. Validator menolak ID asing, urutan terbalik, dan timestamp mentah. Batas waktu berasal dari indeks transkrip dalam milidetik. Pada input bertanda waktu per kata, rentang mengikuti kata pertama dan terakhir.',
      'The LLM ranks transcript segment IDs in a strict JSON schema. A validator rejects unknown IDs, reversed ranges, and raw timestamps. The transcript index supplies the boundary milliseconds. On word-timestamped input, the span follows the first and last words.',
    ],
  },
  {
    label: ['VAD silence-snapping dan GOP', 'VAD silence-snapping and GOP-aware cuts'],
    copy: [
      'Geser batas ke bagian dalam jeda suara lebih dari 250 ms. Untuk stream-copy, pilih keyframe yang masih berada dalam jeda. Jika tidak ada keyframe yang cocok, encode ulang tepi GOP agar titik potong audio tetap akurat.',
      'Move the boundary into a speech gap longer than 250 ms. For stream-copy, use a keyframe inside that gap. If none fits, re-encode the GOP edge to preserve the audio-aligned cut.',
    ],
  },
  {
    label: ['Reframing 9:16 dengan EMA', 'EMA-smoothed 9:16 reframing'],
    copy: [
      'Pusat crop mengikuti posisi pembicara dengan EMA dan zona toleransi untuk menahan getaran kecil. Saat tidak ada wajah, keluaran vertikal mempertahankan seluruh gambar 16:9 di atas latar blur.',
      'The crop center follows the speaker through an EMA and dead zone that ignore small jitters. With zero faces, the vertical output preserves the complete 16:9 image over a blurred backdrop.',
    ],
  },
]

export const impact = [
  { value: ['2 jam → <4 mnt', '2 hr → <4 min'], label: ['Target waktu rough-cut', 'Rough-cut target'] },
  { value: ['0 timestamp rekaan', '0 invented timestamps'], label: ['Pada contoh pemetaan ID', 'In the ID-mapping fixture'] },
  { value: ['Local-first', 'Local-first'], label: ['Windows lokal · Web Worker', 'Local Windows · Web Worker'] },
]
