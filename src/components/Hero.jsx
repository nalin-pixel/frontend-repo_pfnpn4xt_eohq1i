import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] overflow-hidden bg-white">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Gradient overlay for readability (doesn't block interaction) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/70 to-white/10" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-10">
        <div className="flex flex-col justify-center">
          <span className="inline-flex items-center gap-2 text-sm text-slate-600">
            <span className="inline-block h-2 w-2 rounded-full bg-slate-900" />
            Multi‑Vendor Digital Marketplace
          </span>
          <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight text-slate-900">
            Sell and buy digital products with secure payouts
          </h1>
          <p className="mt-4 text-slate-600 text-lg">
            Clean, minimal, modern UI with Stripe Connect for automated vendor payouts, optional PayPal, and protected downloads.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#catalog" className="px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition">Browse Catalog</a>
            <a href="#seller" className="px-5 py-3 rounded-xl border border-slate-300 text-slate-900 hover:bg-slate-50 transition">Open Seller Dashboard</a>
          </div>
        </div>
      </div>
    </section>
  )
}
