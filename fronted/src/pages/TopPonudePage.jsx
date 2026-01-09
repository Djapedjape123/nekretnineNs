import React, { useEffect, useRef, useState } from 'react'
import { t } from '../i1n8'
import { useNavigate } from 'react-router-dom'
import { API_BASE } from '../config'


function TopPonudePage() {
  const [items, setItems] = useState([])
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)
  const navigate = useNavigate()

  // FETCH TOP 5 (backend vratice do 5 oglasa koji pocinju sa "Lux")
  useEffect(() => {
    fetch(`${API_BASE}/oglasi/topponude?count=5`)
      .then(res => res.json())
      .then(data => setItems(data || []))
      .catch(() => setItems([]))
  }, [])

  // helper: učitaj puni detalj nekretnine pa navigiraj
  const viewDetails = async (item) => {
    const rawId = item.id ?? item.code ?? ''
    const id = encodeURIComponent(rawId)

    try {
      const res = await fetch(`${API_BASE}/oglasi/${id}`)
      if (!res.ok) {
        // fallback: ako fetch ne uspe, ipak pokušaj sa item koji imaš (bar naslov/price)
        return navigate(`/single/${id}`, { state: { item } })
      }
      const full = await res.json()
      // send full object in state so SinglePage može da koristi sve podatke
      navigate(`/single/${id}`, { state: { item: full } })
    } catch (e) {
      // fallback kao iznad
      navigate(`/single/${id}`, { state: { item } })
    }
  }

  // AUTO SLIDE
  useEffect(() => {
    if (paused || items.length === 0) return

    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % items.length)
    }, 3000)

    return () => clearInterval(timerRef.current)
  }, [paused, items])

  const prev = () =>
    setIndex(i => (i - 1 + items.length) % items.length)

  const next = () =>
    setIndex(i => (i + 1) % items.length)

  if (!items.length) return null

  return (
    <section
      className="py-14 bg-gradient-to-b from-black via-gray-900 to-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <h2 className="text-4xl font-extrabold text-center text-yellow-500 mb-10">
        {t('topPonude')}
      </h2>

      <div className="relative max-w-5xl mx-auto overflow-hidden">

        {/* TRACK */}
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map(item => (
            <div key={item.id} className="min-w-full px-4 flex justify-center">
              <div className="bg-black/80 border-2 border-yellow-500 rounded-2xl max-w-xl w-full overflow-hidden shadow-xl">

                <img
                  src={item.image || '/placeholder.jpg'}
                  alt={item.title}
                  className="h-60 w-full object-cover"
                />

                <div className="p-6 text-center text-white">
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="text-gray-400 mt-1">{item.location}</p>
                  <p className="text-yellow-400 text-xl font-semibold mt-3">
                    {item.price}
                  </p>

                  <button
                    onClick={() => viewDetails(item)}
                    className="mt-5 px-6 py-2 bg-yellow-500 text-black font-bold rounded-md hover:bg-yellow-400 transition"
                  >
                    {t('details')}
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CONTROLS */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-yellow-400 p-3 rounded-full"
        >
          ‹
        </button>

        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-yellow-400 p-3 rounded-full"
        >
          ›
        </button>

        {/* DOTS */}
        <div className="flex justify-center gap-3 mt-6">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full ${i === index ? 'bg-yellow-400 scale-125' : 'bg-gray-400'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TopPonudePage
