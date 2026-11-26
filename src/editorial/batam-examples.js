const tourism = ['Dispar Batam', 'https://disbudpar.batam.go.id/wisata-kuliner/']

export const batamExamples = [
  {
    icon: 'beach',
    prompt: ['Rekomendasikan pantai tenang di Nongsa', 'Recommend a quiet beach in Nongsa'],
    short: ['Pantai Nongsa', 'Nongsa Beach'],
    answer: [
      'Pantai Nongsa bisa jadi pilihan. BP Batam mencatat pantai berpasir putih ini menghadap Singapura.',
      'Nongsa Beach is worth considering. BP Batam describes it as a white-sand beach facing Singapore.',
    ],
    limit: [
      'Data keramaian terkini belum tersedia. Cek kondisi setempat sebelum berangkat.',
      'Current crowd levels are unavailable. Check local conditions before visiting.',
    ],
    chunk: [
      'Pantai Nongsa · Pantai berpasir putih dengan pemandangan ke arah Singapura.',
      'Nongsa Beach · White-sand beach with views toward Singapore.',
    ],
    sources: [
      ['BP Batam', 'https://bpbatam.go.id/tentang-batam/destinasi-wisata/'],
      ['Dispar Batam', 'https://disbudpar.batam.go.id/2021/01/23/wali-kota-promosikan-pulau-terluar-ke-menteri-parekraf/'],
    ],
    score: '0.914',
    latency: 142,
  },
  {
    icon: 'food',
    prompt: ['Tempat seafood malam dekat Nagoya?', 'Late-night seafood near Nagoya?'],
    short: ['Seafood Nagoya', 'Nagoya seafood'],
    answer: [
      'Mulai dari direktori kuliner Dispar Batam, lalu cek pilihan di sekitar Nagoya sesuai lokasi penginapan.',
      'Start with the Batam tourism office’s food directory, then check options around Nagoya near your accommodation.',
    ],
    limit: [
      'Jam buka malam belum terverifikasi. Hubungi restoran sebelum berangkat.',
      'Late-night hours are unverified. Call the restaurant before going.',
    ],
    chunk: [
      'Wisata Kuliner · Direktori kuliner dari Dinas Kebudayaan dan Pariwisata Kota Batam.',
      'Culinary tourism · Directory from the Batam Culture and Tourism Office.',
    ],
    sources: [tourism],
    score: '0.887',
    latency: 157,
  },
  {
    icon: 'ferry',
    prompt: ['Jadwal ferry Batam ke Singapura?', 'Batam to Singapore ferry schedule?'],
    short: ['Feri Singapura', 'Singapore ferry'],
    answer: [
      'Terminal Internasional Batam Centre melayani tujuan Singapura. Cek keberangkatan sesuai tanggal langsung di operator feri.',
      'Batam Centre International Ferry Terminal serves Singapore. Check departures for your travel date directly with the ferry operator.',
    ],
    limit: [
      'Jadwal dan ketersediaan tiket real-time belum tersedia di sini.',
      'Live departure times and ticket availability are unavailable here.',
    ],
    chunk: [
      'Batam Centre · Terminal penumpang internasional yang melayani Singapura dan Malaysia.',
      'Batam Centre · International passenger terminal serving Singapore and Malaysia.',
    ],
    sources: [['BP Batam', 'https://batamport.bpbatam.go.id/batam-centre/']],
    score: '0.932',
    latency: 149,
  },
]
