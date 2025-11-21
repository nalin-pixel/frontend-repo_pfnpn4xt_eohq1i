import { useEffect, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function SellerAnalytics() {
  const [sellerId, setSellerId] = useState('')
  const [summary, setSummary] = useState(null)
  const [top, setTop] = useState([])
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    if (!sellerId) { setError('Bitte Verkäufer-ID eingeben.'); return }
    setError('')
    setLoading(true)
    try {
      const [sRes, tRes, rRes] = await Promise.all([
        fetch(`${BACKEND}/api/seller/analytics?seller_id=${encodeURIComponent(sellerId)}`),
        fetch(`${BACKEND}/api/seller/analytics/top-products?seller_id=${encodeURIComponent(sellerId)}`),
        fetch(`${BACKEND}/api/seller/analytics/recent-sales?seller_id=${encodeURIComponent(sellerId)}`)
      ])
      const s = await sRes.json()
      const t = await tRes.json()
      const r = await rRes.json()
      setSummary(s)
      setTop(t.top || [])
      setSales(r.sales || [])
    } catch (e) {
      setError('Fehler beim Laden der Analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // no auto load
  }, [])

  return (
    <section id="analytics" className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Seller Analytics</h2>
          <p className="text-slate-600">Umsatz, Verkäufe, Views und Top-Produkte</p>
        </div>
        <div className="flex items-center gap-2">
          <input value={sellerId} onChange={e=>setSellerId(e.target.value)} placeholder="Verkäufer-ID" className="px-3 py-2 border rounded-lg" />
          <button onClick={load} className="px-4 py-2 rounded-lg bg-slate-900 text-white">Laden</button>
        </div>
      </div>

      {error && <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">{error}</div>}

      {loading && <div className="mt-6 text-slate-600">Laden...</div>}

      {summary && !loading && (
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border bg-white"><p className="text-slate-500 text-sm">Umsatz</p><p className="text-2xl font-semibold">${summary.revenue?.toFixed?.(2) ?? summary.revenue}</p></div>
          <div className="p-4 rounded-xl border bg-white"><p className="text-slate-500 text-sm">Verkäufe</p><p className="text-2xl font-semibold">{summary.sales}</p></div>
          <div className="p-4 rounded-xl border bg-white"><p className="text-slate-500 text-sm">Views</p><p className="text-2xl font-semibold">{summary.views}</p></div>
          <div className="p-4 rounded-xl border bg-white"><p className="text-slate-500 text-sm">Conversion</p><p className="text-2xl font-semibold">{summary.conversion_rate}%</p></div>
        </div>
      )}

      {top.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold">Top Produkte</h3>
          <div className="mt-3 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {top.map(p => (
              <div key={p.id} className="p-4 border rounded-xl bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{p.title}</p>
                    <p className="text-slate-600 text-sm">{p.category || 'Allgemein'} • ${p.price} {p.currency?.toUpperCase?.()}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-slate-100">{p.status}</span>
                </div>
                <div className="mt-3 flex gap-6 text-sm text-slate-700">
                  <span>Sales: <b>{p.sales}</b></span>
                  <span>Views: <b>{p.views}</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sales.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold">Neueste Verkäufe</h3>
          <div className="mt-3 border rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2">Produkt</th>
                  <th className="px-4 py-2">Käufer</th>
                  <th className="px-4 py-2">Preis</th>
                  <th className="px-4 py-2">Währung</th>
                  <th className="px-4 py-2">Purchase ID</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">{s.title}</td>
                    <td className="px-4 py-2">{s.buyer_email}</td>
                    <td className="px-4 py-2">${s.price}</td>
                    <td className="px-4 py-2">{s.currency?.toUpperCase?.()}</td>
                    <td className="px-4 py-2 text-slate-500">{s.purchase_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
