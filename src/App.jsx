import Hero from './components/Hero'
import Catalog from './components/Catalog'
import CTA from './components/CTA'
import ProductDetail from './components/ProductDetail'
import SellerDashboard from './components/SellerDashboard'
import Downloads from './components/Downloads'
import { useEffect, useState } from 'react'

function App() {
  const [route, setRoute] = useState(window.location.hash || '#/')
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  let content = (
    <>
      <Hero />
      <Catalog />
      <CTA />
      <SellerDashboard />
      <Downloads />
    </>
  )

  if (route.startsWith('#/product/')) {
    const id = route.replace('#/product/', '')
    content = <ProductDetail productId={id} onBack={() => (window.location.hash = '#/')} />
  } else if (route === '#/downloads') {
    content = <Downloads />
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#/" className="font-semibold text-slate-900">TikTok Effects Market</a>
          <nav className="flex items-center gap-4 text-sm">
            <a href="#catalog" className="text-slate-600 hover:text-slate-900">Katalog</a>
            <a href="#seller" className="text-slate-600 hover:text-slate-900">Verkäufer</a>
            <a href="#/downloads" className="text-slate-600 hover:text-slate-900">Meine Downloads</a>
            <a href="/test" className="px-3 py-1.5 rounded-lg bg-slate-900 text-white">Backend Test</a>
          </nav>
        </div>
      </header>
      <main>
        {content}
      </main>
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-slate-500">
          © {new Date().getFullYear()} TikTok Effects Market. Alle Rechte vorbehalten.
        </div>
      </footer>
    </div>
  )
}

export default App
