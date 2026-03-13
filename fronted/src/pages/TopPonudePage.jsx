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

  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const minSwipeDistance = 50 

  useEffect(() => {
    fetch(`${API_BASE}/oglasi/topponude?count=5`)
      .then(res => res.json())
      .then(data => setItems(data || []))
      .catch(() => setItems([]))
  }, [])

  const viewDetails = async (item) => {
    const rawId = item.id ?? item.code ?? ''
    const id = encodeURIComponent(rawId)

    try {
      const res = await fetch(`${API_BASE}/oglasi/${id}`)
      if (!res.ok) {
        return navigate(`/single/${id}`, { state: { item } })
      }
      const full = await res.json()
      navigate(`/single/${id}`, { state: { item: full } })
    } catch (e) {
      navigate(`/single/${id}`, { state: { item } })
    }
  }

  // AUTO SLIDE - MODERAN PRISTUP (Resetuje se kad korisnik prebaci)
  useEffect(() => {
    if (paused || items.length === 0) return

    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % items.length)
    }, 3000)

    return () => clearInterval(timerRef.current)
  }, [paused, items, index]) // DODAT INDEX: Kada se promeni slajd, tajmer kreće od nule!

  const prev = () => setIndex(i => (i - 1 + items.length) % items.length)
  const next = () => setIndex(i => (i + 1) % items.length)

  const onTouchStart = (e) => {
    setTouchEnd(null) 
    setTouchStart(e.targetTouches[0].clientX) 
    setPaused(true) 
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX) 
  }

  const onTouchEnd = () => {
    setPaused(false) 
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) next() 
    if (isRightSwipe) prev() 
  }

  if (!items.length) return null

  return (
    <section
      className="py-10 md:py-14 bg-gradient-to-b from-black via-gray-900 to-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-yellow-500 mb-8 md:mb-10 tracking-wide drop-shadow-lg">
        {t('topPonude')}
      </h2>

      <div 
        className="relative max-w-5xl mx-auto overflow-hidden px-2 md:px-0 group"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* TRACK - Glatkija tranzicija (duration-700 ease-in-out) */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map(item => (
            <div key={item.id} className="min-w-full px-2 md:px-4 flex justify-center cursor-grab active:cursor-grabbing">
              <div 
                className="bg-black/80 border border-yellow-500/50 rounded-2xl max-w-xl w-full overflow-hidden shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(234,179,8,0.4)] transition-shadow duration-500"
                onClick={() => viewDetails(item)}
              >
                <img
                  src={item.image || '/placeholder.jpg'}
                  alt={item.title}
                  className="h-56 md:h-72 w-full object-cover pointer-events-none" 
                />

                <div className="p-5 md:p-6 text-center text-white relative bg-gradient-to-t from-black/90 to-transparent">
                  <h3 className="text-xl md:text-2xl font-bold line-clamp-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm md:text-base mt-1 line-clamp-1">{item.location}</p>
                  <p className="text-yellow-400 text-xl md:text-2xl font-bold mt-2 md:mt-3">
                    {item.price}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); 
                      viewDetails(item);
                    }}
                    className="mt-4 md:mt-5 px-6 py-2.5 bg-yellow-500 text-black text-sm md:text-base font-bold rounded-lg hover:bg-yellow-400 hover:scale-105 transition-all duration-300 shadow-md"
                  >
                    {t('details')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MODERNE STRELICE - Vidljive stalno, poluprovidno staklo */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-md border border-white/10 text-yellow-400 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full hover:bg-black/50 hover:scale-110 transition-all duration-300 shadow-lg z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>

        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-md border border-white/10 text-yellow-400 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full hover:bg-black/50 hover:scale-110 transition-all duration-300 shadow-lg z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>

      </div>

      {/* MODERNE TAČKICE */}
      <div className="flex justify-center gap-2 md:gap-3 mt-8">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-500 ${
              i === index ? 'bg-yellow-400 w-6 md:w-8 scale-110 shadow-[0_0_10px_rgba(234,179,8,0.8)]' : 'bg-gray-500/50 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  )
}

export default TopPonudePage