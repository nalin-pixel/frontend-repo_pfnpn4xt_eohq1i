import { useEffect, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ProductDetail({ productId, onBack }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [email, setEmail] = useState('')
  const [checkingOut, setCheckingOut] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      const res = await fetch(`${BACKEND}/api/products/${productId}`)
      if (res.ok) {
        const data = await res.json()
        setProduct(data)
      }
      setLoading(false)
    }
    if (productId) run()
  }, [productId])

  const buy = async () => {
    if (!email) {
      alert('Bitte E-Mail für die Zustellung eingeben.')
      return
    }
    setCheckingOut(true)
    try {
      const body = {
        buyer_email: email,
        items: [{ product_id: productId, quantity: qty }],
        provider: 'stripe'
      }
      const res = await fetch(`${BACKEND}/api/checkout/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      setResult(data)
      if (data.url) {
        // In real Stripe flow, redirect to Checkout
        window.location.href = data.url
      }
    } catch (e) {
      console.error(e)
      alert('Checkout fehlgeschlagen.')
    } finally {
      setCheckingOut(false)
    }
  }

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-16">Laden...</div>
  if (!product) return <div className="max-w-4xl mx-auto px-6 py-16">Produkt nicht gefunden.</div>

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <button onClick={onBack} className="text-sm text-slate-600 hover:text-slate-900">← Zurück</button>
      <div className="mt-6 grid md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-video rounded-xl bg-slate-100 overflow-hidden">
            {product.preview_media_url ? (
              <img src={product.preview_media_url} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">Kein Preview</div>
            )}
          </div>
          {product.description && (
            <div className="prose max-w-none mt-6">
              <h3 className="text-lg font-semibold">Beschreibung</h3>
              <p className="text-slate-700 whitespace-pre-wrap">{product.description}</p>
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">{product.title}</h1>
          <p className="mt-2 text-slate-600">Kategorie: {product.category || 'Allgemein'}</p>
          <p className="mt-4 text-3xl font-semibold">${product.price} <span className="text-base font-normal text-slate-500">{product.currency.toUpperCase()}</span></p>

          <div className="mt-6 space-y-3">
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-Mail für Download-Link" className="w-full px-3 py-2 border rounded-lg" />
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-600">Menge</label>
              <input type="number" min={1} value={qty} onChange={e=>setQty(parseInt(e.target.value||'1'))} className="w-20 px-3 py-2 border rounded-lg" />
            </div>
            <button disabled={checkingOut} onClick={buy} className="w-full px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-60">
              {checkingOut ? 'Wird verarbeitet...' : 'Jetzt kaufen'}
            </button>
            {result && result.demo && (
              <div className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                Demo-Kauf erfolgreich! Öffne deinen Download-Bereich.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
