import { useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const CATEGORIES = [
  'Presets', 'Overlays', 'SFX', 'LUTs', 'Transitions', 'Editing-Packs', 'Fonts', 'Templates', 'Other'
]

export default function SellerDashboard() {
  const [form, setForm] = useState({
    seller_id: '',
    title: '',
    description: '',
    price: 5,
    currency: 'usd',
    category: 'Presets',
    tags: '',
    preview_media_url: '',
    file_storage_key: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const change = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setMessage('')
    if (!form.seller_id) { setMessage('Bitte Verkäufer-ID angeben.'); return }
    if (!form.title) { setMessage('Bitte Titel angeben.'); return }
    setLoading(true)
    try {
      const body = {
        seller_id: form.seller_id,
        title: form.title,
        description: form.description || undefined,
        price: Number(form.price),
        currency: form.currency,
        category: form.category,
        tags: form.tags ? form.tags.split(',').map(t=>t.trim()).filter(Boolean) : [],
        preview_media_url: form.preview_media_url || undefined,
        file_storage_key: form.file_storage_key || undefined,
      }
      const res = await fetch(`${BACKEND}/api/seller/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (res.ok) {
        setMessage(`Erstellt! Produkt-ID: ${data.id}`)
      } else {
        setMessage(`Fehler: ${data.detail || 'Unbekannter Fehler'}`)
      }
    } catch (e) {
      setMessage('Fehler beim Erstellen des Produkts.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="seller" className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-semibold text-slate-900">Verkäuferbereich</h2>
      <p className="text-slate-600">Lade deine TikTok-Editing-Assets hoch: Presets, Overlays, SFX, LUTs, Transitions u.v.m.</p>

      <form onSubmit={submit} className="mt-6 grid gap-4">
        <input value={form.seller_id} onChange={e=>change('seller_id', e.target.value)} placeholder="Verkäufer-ID (deine User-ID)" className="px-3 py-2 border rounded-lg" />
        <input value={form.title} onChange={e=>change('title', e.target.value)} placeholder="Titel des Produkts" className="px-3 py-2 border rounded-lg" />
        <textarea value={form.description} onChange={e=>change('description', e.target.value)} placeholder="Beschreibung" className="px-3 py-2 border rounded-lg min-h-[100px]" />

        <div className="grid grid-cols-2 gap-3">
          <input type="number" step="0.01" value={form.price} onChange={e=>change('price', e.target.value)} placeholder="Preis" className="px-3 py-2 border rounded-lg" />
          <select value={form.currency} onChange={e=>change('currency', e.target.value)} className="px-3 py-2 border rounded-lg">
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="gbp">GBP</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select value={form.category} onChange={e=>change('category', e.target.value)} className="px-3 py-2 border rounded-lg">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input value={form.tags} onChange={e=>change('tags', e.target.value)} placeholder="Tags, kommasepariert (z.B. tiktok, velocity, edit)" className="px-3 py-2 border rounded-lg" />
        </div>

        <input value={form.preview_media_url} onChange={e=>change('preview_media_url', e.target.value)} placeholder="Vorschau-Bild/Video URL" className="px-3 py-2 border rounded-lg" />
        <input value={form.file_storage_key} onChange={e=>change('file_storage_key', e.target.value)} placeholder="Datei-Storage-Key (z.B. s3://bucket/key.zip)" className="px-3 py-2 border rounded-lg" />

        <button disabled={loading} className="px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-60">
          {loading ? 'Wird gespeichert...' : 'Produkt erstellen'}
        </button>

        {message && (
          <div className="text-sm mt-2 p-3 rounded border bg-slate-50 text-slate-800">{message}</div>
        )}
      </form>

      <div className="mt-8 text-sm text-slate-600">
        Hinweis: Datei-Uploads sind demnächst mit gesicherten, zeitlich begrenzten Download-Links verfügbar. Bis dahin kannst du einen Storage-Key/URL angeben.
      </div>
    </section>
  )
}
