import { useEffect, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function SellerProducts() {
  const [sellerId, setSellerId] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const load = async () => {
    if (!sellerId) { setMessage('Bitte Verkäufer-ID eingeben.'); return }
    setMessage('')
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND}/api/seller/products?seller_id=${encodeURIComponent(sellerId)}`)
      const data = await res.json()
      setItems(data.products || [])
    } catch (e) {
      setMessage('Fehler beim Laden der Produkte')
    } finally {
      setLoading(false)
    }
  }

  const changeStatus = async (id, to) => {
    try {
      await fetch(`${BACKEND}/api/seller/products/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: to })
      })
      load()
    } catch {}
  }

  const remove = async (id) => {
    if (!confirm('Dieses Produkt wirklich dauerhaft löschen?')) return
    try {
      await fetch(`${BACKEND}/api/seller/products/${id}`, { method: 'DELETE' })
      load()
    } catch {}
  }

  useEffect(() => {
    // no auto load
  }, [])

  return (
    <section id="seller-products" className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Meine Produkte</h2>
          <p className="text-slate-600">Status ändern oder entfernen</p>
        </div>
        <div className="flex items-center gap-2">
          <input value={sellerId} onChange={e=>setSellerId(e.target.value)} placeholder="Verkäufer-ID" className="px-3 py-2 border rounded-lg" />
          <button onClick={load} className="px-4 py-2 rounded-lg bg-slate-900 text-white">Laden</button>
        </div>
      </div>

      {message && <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">{message}</div>}

      {loading ? (
        <div className="mt-6 text-slate-600">Laden...</div>
      ) : (
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(p => (
            <div key={p.id} className="p-4 border rounded-xl bg-white">
              <p className="font-medium text-slate-900">{p.title}</p>
              <p className="text-slate-600 text-sm">${p.price} {p.currency?.toUpperCase?.()} • {p.category || 'Allgemein'}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded bg-slate-100">{p.status}</span>
                <button onClick={() => changeStatus(p.id, p.status === 'active' ? 'suspended' : 'active')} className="text-xs px-3 py-1 rounded bg-amber-600 text-white">
                  {p.status === 'active' ? 'Deaktivieren' : 'Aktivieren'}
                </button>
                <button onClick={() => remove(p.id)} className="text-xs px-3 py-1 rounded bg-red-600 text-white ml-auto">Löschen</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
