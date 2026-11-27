import { architecture } from './editorial/clipper-story'

export const caseStudies = {
  batam: [
    {
      label: ['Masalah', 'Problem'],
      lead: ['Satu jawaban dengan rujukan yang bisa dibuka', 'One answer with checkable sources'],
      plain: ['Pengunjung bisa menelusuri asal rekomendasi tanpa membuka banyak situs dari awal.', 'Visitors can trace where the recommendation came from without starting their search across several sites.'],
      copy: ['Informasi wisata Batam tersebar di banyak situs, sehingga rekomendasi sulit diperiksa.', 'Batam travel information is scattered across sites, making recommendations hard to verify.'],
    },
    {
      label: ['Kontribusi Fahmi', 'Fahmi’s contribution'],
      lead: ['Kutipan resmi di dalam percakapan', 'Official references inside the chat'],
      plain: ['Pengguna bisa membandingkan jawaban dengan keterangan dari sumbernya langsung.', 'Users can compare the answer with what the original source actually says.'],
      copy: ['Saya memperbarui penyajian kutipan di pesan chat dan mengoreksi entri destinasi yang dirujuk.', 'I updated citation rendering in chat messages and corrected the referenced destination entries.'],
      evidence: { href: 'https://github.com/FahmiRfld-Tech/wisatabatam/commit/02d2abb2cd4d4e766349f45b124d8cda0ff09ac5', label: ['Lihat commit', 'View commit'] },
    },
    {
      label: ['Keputusan teknis', 'Technical decision'],
      lead: ['Filter kawasan sebelum dokumen diperingkat', 'Area filters before document ranking'],
      plain: ['Saat memilih Nongsa, pengunjung mendapat rujukan yang lebih sesuai dengan kawasan itu.', 'Selecting Nongsa keeps the references relevant to that area.'],
      copy: ['Supabase menyaring kawasan dan kategori, lalu memberi peringkat dokumen tsvector dan mereranking nama tempat. JSON grounding menampilkan kutipan serta batas bukti.', 'Supabase filters by area and category, ranks tsvector documents, and reranks place names. Grounded JSON exposes citations and evidence gaps.'],
    },
    {
      label: ['Bukti fitur', 'Feature in use'],
      lead: ['Klaim keramaian hanya jika ada bukti', 'Crowd claims require evidence'],
      plain: ['Jawaban tetap membantu pengunjung memilih tujuan sambil memberi tahu detail yang perlu dicek sendiri.', 'Visitors get a recommendation and know which details they still need to check.'],
      copy: ['Saat ditanya tentang pantai tenang di Nongsa, aplikasi menyarankan destinasi, menautkan sumber, dan menjelaskan saat sumber belum bisa memastikan keramaian.', 'Asked about quiet beaches in Nongsa, the live app recommends places, links to sources, and flags when the sources cannot establish how busy a beach is.'],
    },
  ],
  clipper: [
    {
      label: ['Masalah', 'Problem'],
      lead: ['Klip vertikal dari rekaman panjang', 'Vertical clips from long recordings'],
      plain: ['Editor bisa mulai dari kandidat klip alih-alih menonton ulang seluruh rekaman.', 'Editors can start with clip candidates instead of replaying the entire recording.'],
      copy: ['Meninjau video panjang dan menyiapkan cuplikan vertikal membutuhkan banyak langkah manual.', 'Reviewing long videos and preparing vertical clips takes several manual steps.'],
    },
    {
      label: ['Alur aplikasi desktop', 'Desktop workflow'],
      lead: ['Transkripsi hingga ekspor di komputer sendiri', 'From transcription to export on your own computer'],
      plain: ['Pekerjaan bisa diproses dan dipantau langsung dari komputer editor.', 'Editors can process clips and follow job progress from their own computers.'],
      copy: ['Rilis Windows v3 yang terverifikasi pada 17 November 2026 memakai Whisper untuk transkripsi, Ollama untuk menilai kandidat, dan FFmpeg untuk ekspor. Antrean lokal menyimpan progres pekerjaan.', 'The verified November 17, 2026 Windows v3 release uses Whisper for transcription, Ollama to rank candidates, and FFmpeg for export. A local queue tracks job progress.'],
    },
    {
      label: ['Demo interaktif', 'Interactive demo'],
      lead: ['Video 9:16 dan subtitle dari browser', '9:16 video and subtitles from the browser'],
      plain: ['Editor bisa mencoba alurnya dengan video sendiri tanpa mengunggah file ke server.', 'Editors can try the workflow with their own video without uploading it to a server.'],
      copy: ['Versi web menjalankan Whisper Tiny di browser, memakai heuristik transkrip dari versi desktop, dan menghasilkan video 9:16 serta SRT. Video milik pengunjung tetap di perangkat.', 'The web version runs Whisper Tiny locally, applies transcript heuristics adapted from the desktop version, and exports 9:16 video plus SRT. Uploaded video stays on the visitor’s device.'],
    },
    {
      label: ['Cakupan inspector', 'Inspector scope'],
      lead: ['Tiga tahap yang bisa diperiksa', 'Three stages you can inspect'],
      plain: ['Pengunjung dapat melihat alasan klip dipilih, di mana suara dipotong, dan bagaimana wajah tetap masuk bingkai.', 'Visitors can see why a clip was chosen, where the audio cut lands, and how the face stays in frame.'],
      copy: [
        'Tiga keputusan teknis berikut disimulasikan dengan data contoh. Waktu 2 jam → <4 menit adalah target rough-cut, belum hasil benchmark yang terverifikasi.',
        'The inspector simulates the three technical decisions below with fixtures. Two hours to under four minutes is a rough-cut target, pending a verified benchmark.',
      ],
    },
    ...architecture,
  ],
  cireundeu: [
    {
      label: ['Masalah', 'Problem'],
      lead: ['Informasi wisata dan usaha dalam satu portal', 'Tourism and business information in one portal'],
      plain: ['Pengunjung bisa menemukan tujuan wisata dan mengenal usaha sekitar dari tempat yang sama.', 'Visitors can find destinations and discover nearby businesses in one place.'],
      copy: ['Portal menggabungkan direktori destinasi dan katalog UMKM dalam satu pengalaman publik.', 'The portal combines a destination directory and a small-business catalog in one public experience.'],
    },
    {
      label: ['Kontribusi Fahmi', 'Fahmi’s contribution'],
      lead: ['13 kontributor lintas fungsi', '13 cross-functional contributors'],
      plain: ['Pengembangan perangkat lunak dan pengisian konten bisa berjalan dalam satu jadwal rilis.', 'Software work and content updates can move on the same release schedule.'],
      copy: ['Saya memimpin tim lintas fungsi beranggotakan 13 orang dan berperan sebagai full-stack developer. Portal memakai React, TypeScript, dan Supabase.', 'I led a cross-functional team of 13 and worked as a full-stack developer. The portal uses React, TypeScript, and Supabase.'],
    },
    {
      label: ['Hasil', 'Outcome'],
      lead: ['Katalog yang bisa diperbarui pengelola', 'A catalog operators can update'],
      plain: ['Perubahan informasi produk tidak selalu membutuhkan bantuan developer.', 'Product details can change without a developer having to edit the site.'],
      copy: ['Pengunjung bisa menelusuri informasi wisata dan usaha lokal di portal publik. Dashboard dirancang untuk membantu pengelola UMKM memperbarui konten dan aset.', 'Visitors can browse tourism and local business information on the public portal. The dashboard is designed to help business owners update content and assets.'],
    },
  ],
  quran: [
    {
      label: ['Tujuan', 'Goal'],
      lead: ['Latihan hafalan dengan arah yang jelas', 'Memorization practice with a clear path'],
      plain: ['Pelajar bisa menentukan materi yang ingin dilatih selanjutnya.', 'Learners can choose what to practice next.'],
      copy: ['Membantu pengguna mengikuti latihan hafalan dan melihat perkembangan belajar.', 'Help learners follow a memorization routine and see their progress.'],
    },
    {
      label: ['Prototipe web', 'Web prototype'],
      lead: ['Jalur belajar yang bisa langsung dicoba', 'A learning path visitors can try'],
      plain: ['Pengunjung bisa membuka contoh jalur belajar sebelum mendalami konsep 3D.', 'Visitors can try a sample learning path before exploring the 3D concept.'],
      copy: ['Tampilan publik menyediakan bacaan Al-Qur’an dan halaman Perjalanan dengan pilihan pembelajaran seperti Al-Fatihah.', 'The public interface provides Qur’an reading and a Journeys page with learning paths such as Al-Fatihah.'],
    },
    {
      label: ['Konsep yang didokumentasikan', 'Documented concept'],
      lead: ['Peta hafalan Juz 30 berbasis ruang', 'A spatial map for Juz 30 memorization'],
      plain: ['Tempat dalam peta berfungsi sebagai pengingat urutan materi.', 'Places on the map act as cues for the order of the material.'],
      copy: ['GitHub mendokumentasikan gagasan memory palace 3D, hafalan Juz 30, dan visualisasi progres.', 'GitHub documents the 3D memory palace, Juz 30 memorization, and progress visualization concepts.'],
    },
  ],
  rag: [
    {
      label: ['Tujuan', 'Goal'],
      lead: ['Uji pencarian tanpa mengganggu aplikasi publik', 'Test retrieval independently of the public app'],
      plain: ['Eksperimen bisa berjalan tanpa mengubah jawaban yang dilihat wisatawan.', 'Experiments can run without changing what travelers see.'],
      copy: ['Menguji cara menemukan dokumen yang relevan untuk pertanyaan pariwisata.', 'Explore how to retrieve relevant documents for travel questions.'],
    },
    {
      label: ['Arsitektur', 'Architecture'],
      lead: ['Pencarian dokumen dengan FastEmbed dan ChromaDB', 'Document retrieval with FastEmbed and ChromaDB'],
      plain: ['Pertanyaan bisa menemukan dokumen terkait meski susunan katanya berbeda.', 'Questions can find related documents even when the wording differs.'],
      copy: ['Django REST menerima pertanyaan, lalu FastEmbed dan ChromaDB mendukung pencarian kemiripan dokumen. Repositori memuat kode dan utilitas ingest.', 'Django REST handles requests, with FastEmbed and ChromaDB supporting document similarity search. The repository includes the implementation and ingestion tools.'],
    },
    {
      label: ['Status', 'Status'],
      lead: ['Jalur eksperimen terpisah dari produksi', 'A separate track for experiments'],
      plain: ['Demo wisata tetap memakai layanan yang sama saat prototipe diuji.', 'The travel demo keeps using the same service while the prototype is tested.'],
      copy: ['Ini prototipe backend terpisah. Aplikasi Hallo Batam AI yang tersedia untuk publik menggunakan Supabase sebagai endpoint chat.', 'This is a separate backend prototype. The public Hallo Batam AI app uses a Supabase chat endpoint.'],
    },
  ],
  promptgate: [
    {
      label: ['Penyaringan input', 'Input screening'],
      lead: ['Risiko terukur per aturan', 'Explainable rule-based risk scoring'],
      copy: ['Aturan memberi skor pada pola pengambilalihan instruksi, permintaan pengungkapan system prompt, delimiter role, dan Base64 yang berisi pola serupa.', 'Rules score instruction overrides, system-prompt disclosure requests, role delimiters, and Base64 carrying matching signatures.'],
      plain: ['Aplikasi bisa menjelaskan alasan sebuah pesan dihentikan.', 'The app can explain why it stopped a message.'],
    },
    {
      label: ['Redaksi PII', 'PII redaction'],
      lead: ['Data asli tersimpan lokal per permintaan', 'Original values stay local to each request'],
      copy: ['Redaktor menyamarkan pola NIK, nomor HP Indonesia, email, dan kartu pembayaran. Pipeline menyimpan pasangan token dan nilai asli di vault per permintaan.', 'The redactor masks NIK, Indonesian mobile numbers, email addresses, and payment-card candidates. The pipeline keeps token-to-value mappings in a request-scoped vault.'],
      plain: ['Layanan eksternal menerima token pengganti; aplikasi bisa memulihkan nilai asli untuk penerima lokal yang berwenang.', 'External services receive placeholders. The app can restore original values for authorized local recipients.'],
    },
    {
      label: ['Keandalan output', 'Output reliability'],
      lead: ['Perbaikan sintaks dengan log yang bisa diaudit', 'Syntax repair with an auditable log'],
      copy: ['Pemindaian berbasis struktur memperbaiki pembungkus, koma akhir, kutip kunci, dan kurung penutup. Parser menolak JSON ambigu atau tetap tidak valid.', 'A structure-aware scanner repairs wrappers, trailing commas, key quotes, and missing closers. The parser rejects ambiguous or still-invalid JSON.'],
      plain: ['Aplikasi mendapat data yang bisa dibaca dan daftar perubahan untuk diperiksa sebelum menggunakan hasilnya.', 'The app gets readable data and a change log to inspect before using the result.'],
    },
  ],
}
