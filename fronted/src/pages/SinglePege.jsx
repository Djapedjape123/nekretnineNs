// SinglePage.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import { FaBed, FaBath, FaArrowLeft } from 'react-icons/fa'
import { t } from '../i1n8'

export default function SinglePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [property, setProperty] = useState(null)
  const [images, setImages] = useState([])
  const [currentImage, setCurrentImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const formatPrice = (val) => {
    if (val === undefined || val === null || val === '') return ''
    if (typeof val === 'number') {
      try {
        return new Intl.NumberFormat('de-DE').format(val) + ' €'
      } catch {
        return String(val) + ' €'
      }
    }
    const s = String(val)
    if (s.includes('€')) return s
    const digits = s.replace(/[^0-9]/g, '')
    if (!digits) return s
    try {
      return new Intl.NumberFormat('de-DE').format(Number(digits)) + ' €'
    } catch {
      return s + ' €'
    }
  }

  useEffect(() => {
    // Normalize helper used both for prefetch and fetched data
    const normalize = (raw, fallbackId) => {
      const base = raw || {}
      const imgs =
        Array.isArray(base.slike?.slika) && base.slike.slika.length > 0
          ? base.slike.slika.map(s => s.url).filter(Boolean)
          : base.images || (base.image ? [base.image] : [])

      return {
        id: base.id ?? base.code ?? fallbackId,
        naslov: base.naslov ?? base.title ?? '',
        opis: base.opis ?? base.description ?? '',
        cena: base.cena ?? base.price ?? '',
        images: imgs.length ? imgs : ['/placeholder.jpg'],
        image: (imgs.length ? imgs[0] : (base.image || '/placeholder.jpg')),
        location: [base.mesto, base.naselje, base.grad].filter(Boolean).join(', ') || (base.location || ''),
        rooms: base.brojsoba ?? base.rooms ?? 0,
        baths: base.brojkupatila ?? base.baths ?? 0,
        size: base.kvadratura_int ?? base.size ?? 0,
        contactphone: base.contactphone ?? '',
        video_url: base.video_url ?? base.videotour ?? ''
      }
    }

    // If navigate passed the item in state, show immediately (prefetch)
    const pre = location.state?.item
    if (pre) {
      const normalized = normalize(pre, id)
      setProperty(normalized)
      setImages(normalized.images || [normalized.image])
      setCurrentImage(0)
      setLoading(false)
      return
    }

    if (!id) return

    let cancelled = false
    const fetchProperty = async () => {
      setLoading(true)
      setError(null)
      setProperty(null)
      setImages([])
      try {
        const res = await fetch(`http://localhost:3001/oglasi/${encodeURIComponent(id)}`)
        if (!res.ok) {
          if (res.status === 404) throw new Error('Nekretnina nije pronađena.')
          throw new Error('Greška pri dohvatu podataka.')
        }
        const data = await res.json()
        if (!cancelled) {
          const normalized = normalize(data, id)
          setProperty(normalized)
          setImages(normalized.images || [normalized.image])
          setCurrentImage(0)
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Greška')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchProperty()
    return () => { cancelled = true }
  }, [id, location.state])

  // Slider controls
  const prevImage = () => {
    if (!images || images.length === 0) return
    setCurrentImage(i => (i === 0 ? images.length - 1 : i - 1))
  }
  const nextImage = () => {
    if (!images || images.length === 0) return
    setCurrentImage(i => (i === images.length - 1 ? 0 : i + 1))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-yellow-400 font-bold text-xl">{t('loading', 'Učitavanje...')}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-xl text-yellow-400 mb-4">{t('noResults', 'Nema rezultata')}</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold">{t('backToSearch', 'Nazad')}</button>
            <button onClick={() => navigate('/')} className="px-4 py-2 border border-white/10 text-white rounded">{t('home', 'Početna')}</button>
          </div>
        </div>
      </div>
    )
  }

  if (!property) return null

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6 mt-10">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-yellow-400 mb-6 hover:text-yellow-300">
          <FaArrowLeft /> {t('backToSearch', 'Nazad')}
        </button>

        {/* IMAGE SLIDER */}
        <div className="relative rounded-xl overflow-hidden border border-yellow-600/20 shadow-xl">
          <img
            src={images[currentImage] || property.image}
            alt={property.naslov}
            className="w-full h-[420px] object-cover transition-all duration-500"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 p-3 rounded-full text-yellow-400 hover:bg-black z-10"
                aria-label="previous image"
              >
                ‹
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 p-3 rounded-full text-yellow-400 hover:bg-black z-10"
                aria-label="next image"
              >
                ›
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-3 h-3 rounded-full transition ${currentImage === i ? 'bg-yellow-400 scale-110' : 'bg-white/40'}`}
                    aria-label={`go to image ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="mt-8 bg-gradient-to-br from-gray-900 to-black border border-yellow-600/10 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-extrabold text-yellow-400">{property.naslov}</h1>
            <div className="text-2xl font-bold text-white">{formatPrice(property.cena)}</div>
          </div>

          <div className="flex items-center gap-2 text-gray-300 mt-3">
            <MdLocationOn className="text-yellow-400" />
            <span>{property.location}</span>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 text-sm text-gray-300">
            <div className="bg-black/40 p-3 rounded border border-yellow-600/10 text-center">
              <FaBed className="text-yellow-400 mb-1 inline-block" />
              <div className="mt-1 font-semibold">{property.rooms}</div>
              <div className="text-xs text-gray-400">{t('rooms', 'sobe')}</div>
            </div>
            <div className="bg-black/40 p-3 rounded border border-yellow-600/10 text-center">
              <FaBath className="text-yellow-400 mb-1 inline-block" />
              <div className="mt-1 font-semibold">{property.baths}</div>
              <div className="text-xs text-gray-400">{t('baths', 'kupatila')}</div>
            </div>
            <div className="bg-black/40 p-3 rounded border border-yellow-600/10 text-center">
              <div className="mt-1 font-semibold">{property.size} m²</div>
              <div className="text-xs text-gray-400">{t('size', 'kvadratura')}</div>
            </div>
          </div>

          <p className="mt-6 text-gray-300 leading-relaxed">{property.opis}</p>

          <div className="mt-8 flex gap-4 flex-col sm:flex-row">
            <a
              href={`mailto:serbesnekretnine@gmail.com?subject=${encodeURIComponent(`${t('mailSubjectPrefix', 'Zainteresovan za:')} ${property.naslov}`)}`}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-md font-semibold shadow hover:from-yellow-500 hover:to-yellow-600 transition"
            >
              {t('contactBtn', 'Kontakt')}
            </a>

            <a
              href={property.contactphone ? `tel:${property.contactphone}` : 'tel:+38163238564'}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-md font-semibold shadow hover:from-yellow-500 hover:to-yellow-600 transition"
            >
              {t('cta', 'Pozovi')}
            </a>
          </div>
        </div>

        {property.video_url && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">{t('videoTour', 'Video tura')}</h3>
            <div className="aspect-video w-full rounded overflow-hidden border border-white/5">
              <iframe title="video-tour" src={property.video_url} className="w-full h-full" allowFullScreen />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
