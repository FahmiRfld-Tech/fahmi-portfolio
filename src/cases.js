export const caseStudies = {
  batam: [
    {
      label: ['Masalah', 'Problem'],
      copy: ['Informasi wisata Batam tersebar di banyak situs, sehingga rekomendasi sulit diperiksa.', 'Batam travel information is scattered across sites, making recommendations hard to verify.'],
    },
    {
      label: ['Kontribusi Fahmi', 'Fahmi’s contribution'],
      copy: ['Saya memperbaiki cara chat menampilkan rujukan resmi dan mengoreksi informasi destinasi.', 'I improved how the chat presents official references and corrected destination information.'],
      evidence: { href: 'https://github.com/FahmiRfld-Tech/wisatabatam/commit/02d2abb2cd4d4e766349f45b124d8cda0ff09ac5', label: ['Lihat commit', 'View commit'] },
    },
    {
      label: ['Keputusan teknis', 'Technical decision'],
      copy: ['Supabase mengambil dokumen PostgreSQL yang sudah diperiksa sebelum OpenAI menyusun jawaban. Pengguna dapat memeriksa rujukan dari jawaban tersebut.', 'Supabase retrieves reviewed PostgreSQL documents before OpenAI generates a response, allowing users to check the references behind the answer.'],
    },
    {
      label: ['Bukti fitur', 'Feature in use'],
      copy: ['Saat ditanya tentang pantai tenang di Nongsa, aplikasi menyarankan destinasi, menautkan sumber, dan menjelaskan saat sumber belum bisa memastikan keramaian.', 'Asked about quiet beaches in Nongsa, the live app recommends places, links to sources, and flags when the sources cannot establish how busy a beach is.'],
    },
  ],
  clipper: [
    {
      label: ['Masalah', 'Problem'],
      copy: ['Meninjau video panjang dan menyiapkan cuplikan vertikal membutuhkan banyak langkah manual.', 'Reviewing long videos and preparing vertical clips takes several manual steps.'],
    },
    {
      label: ['Alur aplikasi desktop', 'Desktop workflow'],
      copy: ['Versi Windows mentranskrip video dengan Whisper, menilai kandidat lewat Ollama, dan merender cuplikan lewat FFmpeg. Antrean lokal menyimpan progres pekerjaan.', 'The Windows version transcribes with Whisper, ranks candidates with Ollama, and renders clips with FFmpeg. A local queue tracks job progress.'],
    },
    {
      label: ['Demo interaktif', 'Interactive demo'],
      copy: ['Versi web menjalankan Whisper Tiny di browser, memakai heuristik transkrip dari versi desktop, dan menghasilkan video 9:16 serta SRT. Video milik pengunjung tetap di perangkat.', 'The web version runs Whisper Tiny locally, applies transcript heuristics adapted from the desktop version, and exports 9:16 video plus SRT. Uploaded video stays on the visitor’s device.'],
    },
  ],
  cireundeu: [
    {
      label: ['Masalah', 'Problem'],
      copy: ['Warga perlu cara memperkenalkan destinasi dan mengelola informasi usaha.', 'Residents needed a way to showcase destinations and manage business information.'],
    },
    {
      label: ['Kontribusi Fahmi', 'Fahmi’s contribution'],
      copy: ['Saya memimpin tim lintas fungsi beranggotakan 13 orang dan berperan sebagai full-stack developer. Portal memakai React, TypeScript, dan Supabase.', 'I led a cross-functional team of 13 and worked as a full-stack developer. The portal uses React, TypeScript, and Supabase.'],
    },
    {
      label: ['Hasil', 'Outcome'],
      copy: ['Pengunjung bisa menelusuri informasi wisata dan usaha lokal di portal publik. Dashboard dirancang untuk membantu pengelola UMKM memperbarui konten dan aset.', 'Visitors can browse tourism and local business information on the public portal. The dashboard is designed to help business owners update content and assets.'],
    },
  ],
  quran: [
    {
      label: ['Tujuan', 'Goal'],
      copy: ['Membantu pengguna mengikuti latihan hafalan dan melihat perkembangan belajar.', 'Help learners follow a memorization routine and see their progress.'],
    },
    {
      label: ['Prototipe web', 'Web prototype'],
      copy: ['Tampilan publik menyediakan bacaan Al-Qur’an dan halaman Perjalanan dengan pilihan pembelajaran seperti Al-Fatihah.', 'The public interface provides Qur’an reading and a Journeys page with learning paths such as Al-Fatihah.'],
    },
    {
      label: ['Konsep yang didokumentasikan', 'Documented concept'],
      copy: ['GitHub mendokumentasikan gagasan memory palace 3D, hafalan Juz 30, dan visualisasi progres.', 'GitHub documents the 3D memory palace, Juz 30 memorization, and progress visualization concepts.'],
    },
  ],
  rag: [
    {
      label: ['Tujuan', 'Goal'],
      copy: ['Menguji cara menemukan dokumen yang relevan untuk pertanyaan pariwisata.', 'Explore how to retrieve relevant documents for travel questions.'],
    },
    {
      label: ['Arsitektur', 'Architecture'],
      copy: ['Django REST menerima pertanyaan, lalu FastEmbed dan ChromaDB mendukung pencarian kemiripan dokumen. Repositori memuat kode dan utilitas ingest.', 'Django REST handles requests, with FastEmbed and ChromaDB supporting document similarity search. The repository includes the implementation and ingestion tools.'],
    },
    {
      label: ['Status', 'Status'],
      copy: ['Ini prototipe backend terpisah. Aplikasi Hallo Batam AI yang tersedia untuk publik menggunakan Supabase sebagai endpoint chat.', 'This is a separate backend prototype. The public Hallo Batam AI app uses a Supabase chat endpoint.'],
    },
  ],
}
