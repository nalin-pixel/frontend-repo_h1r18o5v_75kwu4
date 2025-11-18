import { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/7m4PRZ7kg6K1jPfF/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 pointer-events-none flex items-center justify-center min-h-[90vh] bg-gradient-to-b from-slate-950/40 via-slate-900/30 to-slate-950/60">
        <div className="text-center px-6">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.35)]">
            AR-Infused Hotel Universe
          </h1>
          <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
            A futuristic sanctuary with immersive AR menus, 3D concierge, and spatial room exploration.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 pointer-events-auto">
            <a href="#ar" className="px-6 py-3 rounded-xl bg-blue-500/80 hover:bg-blue-400 text-white backdrop-blur-md shadow-[0_0_25px_rgba(59,130,246,0.5)] transition">Enter the Experience</a>
            <a href="#menu" className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition">Try AR Menu</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Rooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/rooms`)
        if (!res.ok) throw new Error('failed')
        const data = await res.json()
        setRooms(data)
      } catch (e) {
        // attempt seed then reload
        try {
          await fetch(`${API_BASE}/seed/rooms`, { method: 'POST' })
          const res2 = await fetch(`${API_BASE}/rooms`)
          const data2 = await res2.json()
          setRooms(data2)
        } catch {}
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section id="rooms" className="relative py-20 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">Immersive Room Selector</h2>
        <p className="text-slate-300 mt-2">Explore suites with sunrise/sunset previews and 360° vibes.</p>
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {loading ? (
            <div className="col-span-full text-slate-400">Loading rooms…</div>
          ) : rooms.length === 0 ? (
            <div className="col-span-full text-slate-400">No rooms yet.</div>
          ) : (
            rooms.map((r) => (
              <div key={r._id} className="group rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 overflow-hidden hover:border-blue-500/40 transition">
                <div className="aspect-video rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 mb-4 relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.2),transparent_50%)]" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-xl font-medium">{r.name}</h3>
                    <p className="text-slate-300 text-sm">{r.view} • up to {r.capacity} guests</p>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-300">${'{'}r.price_per_night{'}'}/night</div>
                    <button className="mt-2 px-4 py-2 rounded-lg bg-blue-500/80 hover:bg-blue-400 text-white">Preview 360°</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

function MenuAR() {
  const [dishes, setDishes] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/menu`)
        if (!res.ok) throw new Error('failed')
        setDishes(await res.json())
      } catch (e) {
        try {
          await fetch(`${API_BASE}/seed/dishes`, { method: 'POST' })
          const res2 = await fetch(`${API_BASE}/menu`)
          setDishes(await res2.json())
        } catch {}
      }
    }
    load()
  }, [])

  return (
    <section id="menu" className="py-20 px-6 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-white">AR Smart Menu</h2>
        <p className="text-slate-300 mt-2">Place dishes on your table in AR, inspect layers, and hear from the chef.</p>
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {dishes.map((d) => (
            <div key={d._id} className="rounded-2xl p-5 bg-white/5 border border-white/10 backdrop-blur-xl hover:border-pink-500/40 transition">
              <div className="aspect-square rounded-xl bg-gradient-to-br from-pink-500/20 to-violet-500/10" />
              <h3 className="mt-4 text-white text-lg">{d.name}</h3>
              <p className="text-slate-300 text-sm">{d.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-pink-300">${'{'}d.price{'}'}</span>
                <button className="px-3 py-2 rounded-lg bg-pink-500/80 hover:bg-pink-500 text-white">Place in AR</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Concierge() {
  const [resp, setResp] = useState(null)
  const [loading, setLoading] = useState(false)

  const ask = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/concierge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: 'romantic', dietary: ['dairy'] })
      })
      setResp(await res.json())
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="concierge" className="py-20 px-6 bg-gradient-to-b from-slate-950 to-black">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-white">3D Concierge</h2>
        <p className="text-slate-300 mt-2">Tell us your vibe and we’ll craft a personalized plan.</p>
        <div className="mt-6">
          <button onClick={ask} className="px-6 py-3 rounded-xl bg-teal-500/80 hover:bg-teal-400 text-white shadow-[0_0_25px_rgba(20,184,166,0.5)]">Ask Concierge</button>
        </div>
        {loading && <p className="text-slate-400 mt-4">Thinking…</p>}
        {resp && (
          <div className="mt-8 text-left bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="text-white font-medium">{resp.greeting}</div>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              {resp.suggestions?.map((s, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-slate-200 capitalize">{s.type}</div>
                  <ul className="mt-2 list-disc list-inside text-slate-300 text-sm">
                    {s.items?.map((it) => (
                      <li key={it._id || it.title || it.name}>{it.name || it.title}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function Quote() {
  const [quote, setQuote] = useState(null)

  const getQuote = async () => {
    const today = new Date()
    const tomorrow = new Date(Date.now() + 24*3600*1000)
    const res = await fetch(`${API_BASE}/booking/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        check_in: today.toISOString(),
        check_out: tomorrow.toISOString(),
        guests: 2,
        addons: ['wine', 'flowers']
      })
    })
    setQuote(await res.json())
  }

  useEffect(() => { getQuote() }, [])

  return (
    <section id="booking" className="py-20 px-6 bg-gradient-to-b from-black to-slate-950">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-white">Smart Booking</h2>
        <p className="text-slate-300 mt-2">AI-optimized suggestions for the best time and add-ons.</p>
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl text-left">
          {quote ? (
            <div className="text-slate-200 grid md:grid-cols-2 gap-4">
              <div>
                <div>Nightly rate: <span className="text-white">${'{'}quote.nightly_rate{'}'}</span></div>
                <div>Nights: <span className="text-white">{quote.nights}</span></div>
                {quote.suggestion && <div className="text-emerald-300 mt-2">{quote.suggestion}</div>}
              </div>
              <div>
                <div className="font-medium text-white">Add-ons</div>
                <ul className="text-sm mt-2 list-disc list-inside">
                  {quote.addons?.map((a) => (
                    <li key={a.name}>{a.name}: ${'{'}a.price{'}'}</li>
                  ))}
                </ul>
                <div className="mt-3 text-lg">Total: <span className="text-white">${'{'}quote.total{'}'}</span></div>
              </div>
            </div>
          ) : (
            <div className="text-slate-400">Calculating…</div>
          )}
        </div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/40 selection:text-white">
      <Hero />
      <Rooms />
      <MenuAR />
      <Concierge />
      <Quote />
      <footer className="py-10 text-center text-slate-400 text-sm bg-black/80 border-t border-white/10">
        © AR-Infused Hotel Universe — Futuristic hospitality reimagined.
      </footer>
    </div>
  )
}
