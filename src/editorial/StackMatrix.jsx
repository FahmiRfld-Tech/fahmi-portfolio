import { useState } from 'react'
import { ArrowDownRight } from 'lucide-react'
import content from '../content.json'

const skills = {
  React: ['web', 'cireundeu', 'Antarmuka portal dan CMS Digitalisasi Cireundeu. React juga dipakai untuk demo web AI Video Clipper.', 'Portal and CMS interface for Cireundeu. React also powers the AI Video Clipper web demo.'],
  TypeScript: ['web', 'hallo-batam', 'Edge Function Hallo Batam AI dan pengembangan full-stack Digitalisasi Cireundeu.', 'Hallo Batam AI’s Edge Function and full-stack development for Cireundeu.'],
  JavaScript: ['web', 'hallo-batam', 'Interaksi percakapan, galeri, dan navigasi pada frontend Hallo Batam AI.', 'Chat, gallery, and navigation interactions in the Hallo Batam AI frontend.'],
  Supabase: ['data', 'hallo-batam', 'Edge Function dan penyimpanan data Hallo Batam AI, serta backend portal dan CMS Cireundeu.', 'Edge Functions and data storage for Hallo Batam AI, and the Cireundeu portal and CMS backend.'],
  PostgreSQL: ['data', 'hallo-batam', 'Penyimpanan dan seleksi dokumen terverifikasi di Hallo Batam AI. Rancangan pgvector ditampilkan terpisah di diagram arsitektur.', 'Verified document storage and selection for Hallo Batam AI. The architecture diagram shows the pgvector design separately.'],
  Laravel: ['web', null, 'Kompetensi backend PHP yang tercantum di profil.', 'A PHP backend skill listed in the profile.'],
  'Django REST': ['web', 'lab', 'API prototipe Batam RAG Backend, yang memakai ChromaDB dan FastEmbed untuk pencarian semantik.', 'The Batam RAG Backend prototype API uses ChromaDB and FastEmbed for semantic search.'],
  Python: ['web', 'lab', 'Pipeline desktop AI Video Clipper dan prototipe Batam RAG Backend berbasis Django REST.', 'The AI Video Clipper desktop pipeline and the Django REST-based Batam RAG Backend prototype.'],
  RAG: ['data', 'hallo-batam', 'Hallo Batam AI mengambil sumber terverifikasi sebelum membuat jawaban. Prototipe Batam RAG Backend mengeksplorasi pencarian semantik dengan FastEmbed dan ChromaDB.', 'Hallo Batam AI retrieves verified sources before generating a response. The Batam RAG Backend prototype explores semantic search with FastEmbed and ChromaDB.'],
  Unity: ['media', null, 'Kompetensi pengembangan multimedia interaktif dan 3D yang tercantum di profil.', 'An interactive multimedia and 3D development skill listed in the profile.'],
  'C#': ['media', null, 'Bahasa pemrograman yang tercantum dalam kompetensi multimedia dan Unity.', 'A programming language listed alongside multimedia and Unity skills.'],
  'UI/UX': ['media', 'experience', 'Perencanaan produk dan prototipe antarmuka dalam pengalaman GEMASTIK Smart City.', 'Product planning and interface prototyping through GEMASTIK Smart City.'],
  'Motion Graphics': ['media', 'experience', 'Kompetensi multimedia visual. Lihat peran Strategis Multimedia & Digital Lepas untuk konteks pengalaman.', 'A visual multimedia skill. The Freelance Multimedia & Digital Strategist role provides the experience context.'],
  'Video Editing': ['media', 'lab', 'AI Video Clipper mengotomasi sebagian alur penyuntingan, mulai dari transkrip hingga ekspor klip vertikal.', 'AI Video Clipper automates parts of the editing workflow, from transcript to vertical clip export.'],
}
const labels = {
  web: ['Web / Backend', 'Web / Backend'],
  data: ['AI / Data', 'AI / Data'],
  media: ['Multimedia / 3D', 'Multimedia / 3D'],
}

export default function StackMatrix({ lang }) {
  const [selected, setSelected] = useState('RAG')
  const [hovered, setHovered] = useState(null)
  const active = hovered ?? selected
  const [category, anchor, idCopy, enCopy] = skills[active]
  return (
    <div className="stack-matrix" aria-label={lang ? 'Interactive stack matrix' : 'Matriks teknologi interaktif'}>
      <ul className="stack-legend" aria-label={lang ? 'Technology categories' : 'Kategori teknologi'}>
        {Object.keys(labels).map(key => <li key={key} data-category={key}><i aria-hidden="true" /> {labels[key][lang]}</li>)}
      </ul>
      <div className="stack-options">
        {content.stack.flatMap(group => group.items).map(skill => (
          <button key={skill} type="button" className="stack-skill" data-category={skills[skill][0]}
            aria-pressed={selected === skill} aria-controls="stack-context" data-active={active === skill}
            onClick={() => { setSelected(skill); setHovered(null) }}
            onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(skill) }}
            onPointerLeave={() => setHovered(null)}>
            <i aria-hidden="true" />{skill}
          </button>
        ))}
      </div>
      <div id="stack-context" className="stack-context" data-category={category}>
        <div role="status"><p className="workbench-label">{active} / {labels[category][lang]}</p><p>{lang ? enCopy : idCopy}</p></div>
        {anchor && <a className="text-link" href={'#' + anchor}>{lang ? 'View related work' : 'Lihat karya terkait'} <ArrowDownRight size={15} aria-hidden="true" /></a>}
      </div>
    </div>
  )
}
