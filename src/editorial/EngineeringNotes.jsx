import { ArrowUpRight, Database, Filter, GitBranch, Image, ScanSearch, ShieldCheck } from 'lucide-react'
import { External } from './Shared'

export const BATAM_UPGRADE = 'https://github.com/FahmiRfld-Tech/wisatabatam/commit/8d00c80ad07fab9232111d12e1b9a0651e41bb87'
export const BATAM_RAG_NOTES = 'https://github.com/FahmiRfld-Tech/wisatabatam/blob/main/docs/RAG_V2.md'

const fieldDecisions = [
  {
    Icon: Image,
    title: ['Kompresi aset otomatis di browser', 'Automatic asset compression in the browser'],
    copy: ['Browser mengubah ukuran dan mengompresi foto produk sebelum diunggah ke penyimpanan.', 'The browser resizes and compresses product photos before uploading them to storage.'],
    plain: ['Foto yang lebih kecil menghemat kuota dan lebih cepat dimuat di jaringan seluler yang lambat.', 'Smaller photos use less mobile data and load faster on slow connections.'],
  },
  {
    Icon: ShieldCheck,
    title: ['Katalog mandiri dengan validasi CMS', 'Self-service catalogs with CMS validation'],
    copy: ['CMS membatasi akses berdasarkan peran, memvalidasi skema input dan panjang karakter, serta menyediakan tampilan cadangan.', 'The CMS restricts access by role, validates input schemas and character limits, and provides layout fallbacks.'],
    plain: ['Pengelola bisa memperbarui profil budaya dan katalog sendiri tanpa merusak tampilan halaman.', 'Operators can update cultural profiles and catalogs themselves without breaking page layouts.'],
  },
  {
    Icon: GitBranch,
    title: ['Rilis bertahap bersama tim 13 orang', 'Iterative releases with a 13-person team'],
    copy: ['Pada Feb–Jul 2026, sprint dan alur Git menyelaraskan pekerjaan frontend, backend, konten, serta uji penerimaan bersama pelaku UMKM.', 'From Feb–Jul 2026, sprints and a Git workflow coordinated frontend, backend, content, and field acceptance testing with small-business operators.'],
    plain: ['Tim bisa mencoba pembaruan bersama warga sebelum lanjut ke rilis berikutnya.', 'The team could try updates with residents before moving on to the next release.'],
  },
]

export function CireundeuDecisions({ lang }) {
  return <section className="engineering-notes" aria-labelledby="field-engineering">
    <h3 id="field-engineering">{lang ? 'Field engineering decisions' : 'Keputusan engineering di lapangan'}</h3>
    <p className="engineering-caption">{lang ? 'Implementation notes from the project lead.' : 'Catatan implementasi dari penanggung jawab proyek.'}</p>
    <ol className="engineering-grid">
      {fieldDecisions.map(({ Icon, title, copy, plain }, index) => <li key={title[0]} className="glass">
        <p className="eyebrow"><Icon size={16} aria-hidden="true" /> 0{index + 1}</p>
        <h4>{title[lang]}</h4><p>{copy[lang]}</p>
        <p className="plain-translation">{plain[lang]}</p>
      </li>)}
    </ol>
  </section>
}

export function RetrievalComparison({ lang }) {
  return <div className="engineering-comparison">
    <article className="glass">
      <p className="eyebrow">{lang ? 'Conceptual baseline · v1' : 'Baseline konseptual · v1'}</p>
      <h4>{lang ? 'Single-pass vector search' : 'Pencarian vektor satu tahap'}</h4>
      <p>{lang
        ? 'Similarity alone can under-rank exact local names such as Tanjung Memban and Pelabuhan Sekupang. Repeated questions make another model call. The 1.4 s baseline is illustrative.'
        : 'Kemiripan saja bisa menurunkan peringkat nama lokal seperti Tanjung Memban dan Pelabuhan Sekupang. Kueri berulang memanggil model lagi. Baseline 1,4 dtk bersifat ilustratif.'}</p>
      <p className="plain-translation">{lang ? 'An answer can sound relevant while pointing to the wrong place.' : 'Jawaban bisa terdengar relevan tetapi merujuk ke tempat yang keliru.'}</p>
    </article>
    <article className="glass">
      <p className="eyebrow">{lang ? 'Tuned pipeline · v2' : 'Pipeline yang disetel · v2'}</p>
      <h4>{lang ? 'Filtered retrieval + cache' : 'Retrieval terfilter + cache'}</h4>
      <p>{lang
        ? 'Production uses area/category filters, PostgreSQL tsvector with ts_rank_cd, entity reranking, and exact-query caching. The SQL adds pgvector RRF and a ≥0.94 semantic cache for model-matched vectors. <100 ms remains a target.'
        : 'Produksi memakai filter kawasan/kategori, PostgreSQL tsvector dengan ts_rank_cd, reranking entitas, dan cache kueri identik. SQL menyiapkan RRF pgvector dan cache semantik ≥0,94 untuk vektor dari model yang sama. <100 ms masih menjadi target.'}</p>
      <p className="plain-translation">{lang
        ? 'Hybrid RRF can combine exact place-name matches with the meaning of a question. A cache can reuse an eligible previous answer.'
        : 'Hybrid RRF bisa menggabungkan nama tempat yang cocok persis dengan makna pertanyaan. Cache bisa memakai kembali jawaban sebelumnya yang memenuhi syarat.'}</p>
    </article>
  </div>
}

const excerpt = 'SISPEK Disbudpar mencatat Tanjung Memban sebagai destinasi pantai di Nongsa.\nTanjung Memban, Nongsa, Batam.'
const excerptUrl = 'https://sispek.batam.go.id/bydestination/20'

export function GroundingPreview({ lang }) {
  return <section id="batam-xray" tabIndex={-1} className="engineering-notes glass grounding-preview" aria-labelledby="grounding-title">
    <p className="eyebrow"><ScanSearch size={16} aria-hidden="true" /> X-Ray Grounding</p>
    <h3 id="grounding-title">{lang ? 'Inspect the evidence behind the answer' : 'Periksa bukti di balik jawaban'}</h3>
    <div className="grounding-layout">
      <div>
        <p className="eyebrow">{lang ? 'Example answer' : 'Contoh jawaban'}</p>
        <p>{lang ? 'Tanjung Memban Beach is in Nongsa, Batam [1].' : 'Pantai Tanjung Memban berada di Nongsa, Batam [1].'}</p>
        <p className="grounding-gap"><strong>Evidence Gap</strong> · {lang ? 'The source does not report current crowd levels.' : 'Sumber tidak memuat keramaian saat ini.'}</p>
      </div>
      <details className="grounding-drawer">
        <summary><Database size={16} aria-hidden="true" /> [1] SISPEK Disbudpar Batam</summary>
        <p className="engineering-caption">{lang ? 'PostgreSQL excerpt · Indonesian original' : 'Kutipan PostgreSQL · teks asli'}</p>
        <blockquote lang="id">{excerpt}</blockquote>
        <External href={excerptUrl}>{lang ? 'Open official source' : 'Buka sumber resmi'} <ArrowUpRight size={15} aria-hidden="true" /></External>
      </details>
    </div>
  </section>
}

export function ResearchTradeoff({ lang }) {
  return <div className="research-tradeoff">
    <p className="eyebrow"><Filter size={15} aria-hidden="true" /> {lang ? 'Architecture trade-off' : 'Trade-off arsitektur'}</p>
    <dl>
      <div><dt>Python / Django REST</dt><dd>{lang
        ? 'Explicit control over chunking, ranking weights and offline grounding tests. The prototype uses FastEmbed and ChromaDB. BM25 and pgvector RRF are comparison candidates.'
        : 'Kontrol eksplisit atas chunking, bobot peringkat, dan pengujian grounding offline. Prototipe memakai FastEmbed dan ChromaDB. BM25 dan pgvector RRF adalah kandidat pembanding.'}
        <p className="plain-translation">{lang ? 'Test how passages are selected without interrupting the public chat.' : 'Cara sistem memilih potongan dokumen bisa diuji tanpa mengganggu chat publik.'}</p>
      </dd></div>
      <div><dt>PostgreSQL / Supabase</dt><dd>{lang
        ? 'Keeps source filters and ranking in SQL, reducing services to operate. Production uses lexical retrieval and exact-query cache. Semantic caching is prepared in SQL with a <100 ms target.'
        : 'Filter dan pemeringkatan sumber berada di SQL sehingga lebih sedikit layanan yang perlu dikelola. Produksi memakai pencarian leksikal dan cache kueri identik. Cache semantik disiapkan di SQL dengan target <100 ms.'}
        <p className="plain-translation">{lang ? 'An identical question can reuse its answer without another model call.' : 'Pertanyaan yang sama persis bisa memakai jawaban sebelumnya tanpa memanggil AI lagi.'}</p>
      </dd></div>
    </dl>
  </div>
}
