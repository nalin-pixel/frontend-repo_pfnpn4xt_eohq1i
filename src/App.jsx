import Hero from './components/Hero'
import Catalog from './components/Catalog'
import CTA from './components/CTA'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="font-semibold text-slate-900">Digital Market</a>
          <nav className="flex items-center gap-4 text-sm">
            <a href="#catalog" className="text-slate-600 hover:text-slate-900">Catalog</a>
            <a href="#seller" className="text-slate-600 hover:text-slate-900">Seller</a>
            <a href="/test" className="px-3 py-1.5 rounded-lg bg-slate-900 text-white">Backend Test</a>
          </nav>
        </div>
      </header>
      <main>
        <Hero />
        <Catalog />
        <CTA />
      </main>
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-slate-500">
          © {new Date().getFullYear()} Digital Market. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default App
