export const GITHUB = 'https://github.com/FahmiRfld-Tech'
export const LINKEDIN = 'https://www.linkedin.com/in/m-fahmi-rifaldi-ba0653245/'
export const EMAIL = 'fahmirifaldi253@gmail.com'

export const chapters = [
  { id: 'prolog', label: ['Prolog', 'Prologue'] },
  { id: 'hallo-batam', label: ['AI', 'AI'] },
  { id: 'cireundeu', label: ['Komunitas', 'Community'] },
  { id: 'experience', label: ['Perjalanan', 'Journey'] },
  { id: 'lab', label: ['Lab', 'Lab'] },
  { id: 'contact', label: ['Kontak', 'Contact'] },
]

export function chapterNumber(id) {
  return String(chapters.findIndex(chapter => chapter.id === id) + 1).padStart(2, '0')
}

export const projectActions = {
  batam: ['Buka aplikasi asli', 'Open the live app'],
  clipper: ['Coba demo', 'Try the demo'],
  cireundeu: ['Buka portal', 'Explore the portal'],
  quran: ['Lihat prototipe', 'Explore the prototype'],
  rag: ['Baca kode', 'Read the code'],
  promptgate: ['Lihat repositori', 'View repository'],
}

export const insights = [
  ['Arahan klien yang masih terbuka perlu diterjemahkan menjadi keputusan yang bisa diuji. Kebiasaan itu saya bawa saat merumuskan kebutuhan produk.', 'An open-ended client brief needs to become a set of decisions we can test. I bring that habit to defining product requirements.'],
  ['Memimpin 13 orang melatih saya menjelaskan keputusan teknis lewat dampaknya terhadap kerja tim dan kebutuhan pengelola portal.', 'Leading 13 people taught me to explain technical decisions through their effects on the team and the needs of portal administrators.'],
  ['Mendampingi lebih dari 300 praktikan di lima mata kuliah komputasi melatih saya menjelaskan cara mereproduksi masalah dan alasan di balik perbaikannya.', 'Mentoring more than 300 students across five computing courses taught me to explain how to reproduce a problem and why a fix works.'],
  ['Mengelola asrama mengasah cara saya memprioritaskan masalah, menentukan siapa yang menanganinya, dan memastikan tindak lanjut terdokumentasi.', 'Managing a residence sharpened how I prioritize issues, assign ownership, and document follow-through.'],
  ['Advokasi melatih saya memeriksa asumsi dengan mendengar pengalaman orang yang langsung terdampak.', 'Advocacy taught me to check my assumptions by listening to the people directly affected.'],
  ['Mengkoordinasikan acara mengasah cara saya menyusun dependensi, mengenali risiko, dan merencanakan cadangan sebelum hari pelaksanaan.', 'Coordinating an event sharpened how I map dependencies, identify risks, and prepare contingencies before launch day.'],
]

export const labMeta = {
  clipper: ['AI Terapan · Multimedia', 'Applied AI · Multimedia'],
  quran: ['EdTech · Prototipe Web 3D', 'EdTech · 3D Web Prototype'],
  rag: ['Backend · Pencarian Semantik', 'Backend · Semantic Search'],
  promptgate: ['Keamanan & Keandalan AI · Middleware', 'AI Security & Reliability · Middleware'],
}
