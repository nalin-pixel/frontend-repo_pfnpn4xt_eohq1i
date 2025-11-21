import { useEffect, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Downloads() {
  const [email, setEmail] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchDownloads = async () => {
    if (!email) return
    setLoading(true)
    const res = await fetch(`${BACKEND}/api/me/downloads?email=${encodeURIComponent(email)}`)
    const data = await res.json()
    setItems(data.downloads || [])
    setLoading(false)
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-semibold text-slate-900">Meine Downloads</h2>
      <p className="text-slate-600">Gib die E-Mail ein, die du beim Kauf verwendet hast.</p>
      <div className="mt-4 flex gap-2">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-Mail" className="px-3 py-2 border rounded-lg flex-1" />
        <button onClick={fetchDownloads} className="px-4 py-2 rounded-lg bg-slate-900 text-white">Anzeigen</button>
      </div>

      {loading ? (
        <p className="mt-6 text-slate-600">Laden...</p>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {items.map((d, i) => (
            <a key={i} href={d.download_url} className="border rounded-lg p-4 hover:bg-slate-50">
              <div className="font-medium text-slate-900">{d.title}</div>
              <div className="text-sm text-slate-600">Produkt-ID: {d.product_id}</div>
              <div className="mt-2 text-sm text-blue-600">Download</div>
            </a>
          ))}
          {items.length === 0 && (
            <p className="text-slate-600">Keine Downloads gefunden.</p>
          )}
        </div>
      )}
    </section>
  )
}
