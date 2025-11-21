import { useEffect, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Catalog() {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (q) params.append('q', q)
    if (category) params.append('category', category)
    const res = await fetch(`${BACKEND}/api/products?${params.toString()}`)
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  return (
    <section id="catalog" className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Product catalog</h2>
          <p className="text-slate-600">Search and filter digital products</p>
        </div>
        <div className="flex gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." className="px-3 py-2 border rounded-lg" />
          <select value={category} onChange={e=>setCategory(e.target.value)} className="px-3 py-2 border rounded-lg">
            <option value="">All categories</option>
            <option value="design">Design</option>
            <option value="code">Code</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
          </select>
          <button onClick={fetchProducts} className="px-4 py-2 rounded-lg bg-slate-900 text-white">Apply</button>
        </div>
      </div>

      {loading ? (
        <p className="mt-8 text-slate-600">Loading...</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-slate-600">No products found.</p>
      ) : (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(p => (
            <a key={p.id} href={`#/product/${p.id}`} className="group border rounded-xl p-4 hover:shadow-sm transition bg-white">
              <div className="aspect-video rounded-lg bg-slate-100 overflow-hidden">
                {p.preview_media_url ? (
                  <img src={p.preview_media_url} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">No preview</div>
                )}
              </div>
              <div className="mt-3">
                <h3 className="font-semibold text-slate-900 group-hover:underline">{p.title}</h3>
                <p className="text-slate-600 text-sm line-clamp-2">{p.description}</p>
                <p className="mt-2 font-medium">${p.price}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
