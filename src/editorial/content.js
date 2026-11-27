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

export const labMeta = {
  clipper: ['AI Terapan · Multimedia', 'Applied AI · Multimedia'],
  quran: ['EdTech · Prototipe Web 3D', 'EdTech · 3D Web Prototype'],
  rag: ['Backend · Pencarian Semantik', 'Backend · Semantic Search'],
  promptgate: ['Keamanan & Keandalan AI · Middleware', 'AI Security & Reliability · Middleware'],
}
