// SinglePage.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import { FaBed, FaBath, FaArrowLeft, FaExpand, FaTimes } from 'react-icons/fa'
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

  // lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

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

  // --- YouTube helper: vrati embed URL ili prazan string (podržava /shorts/, youtu.be, watch?v=, /embed/) ---
  const getYoutubeEmbedUrl = (rawUrl) => {
    if (!rawUrl) return ''
    let url = String(rawUrl).trim()
    if (!url) return ''

    // normalize protocol-less
    if (url.startsWith('//')) url = `${window.location.protocol}${url}`
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`

    try {
      const parsed = new URL(url)
      const host = (parsed.hostname || '').toLowerCase()

      // youtu.be short url
      if (host.includes('youtu.be')) {
        const id = parsed.pathname.replace(/^\/+/, '').split('/')[0]
        if (id) return `https://www.youtube.com/embed/${id}`
      }

      // /shorts/ID
      const shortsMatch = parsed.pathname.match(/\/shorts\/([A-Za-z0-9_-]{6,})/)
      if (shortsMatch && shortsMatch[1]) return `https://www.youtube.com/embed/${shortsMatch[1]}`

      // watch?v=ID
      const v = parsed.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`

      // /embed/ID
      const embedMatch = parsed.pathname.match(/\/embed\/([A-Za-z0-9_-]{6,})/)
      if (embedMatch && embedMatch[1]) return `https://www.youtube.com/embed/${embedMatch[1]}`

      // fallback: regex for common patterns (covers some edge cases)
      const fallback = url.match(/(?:v=|\/embed\/|youtu\.be\/|\/shorts\/)([A-Za-z0-9_-]{6,})/)
      if (fallback && fallback[1]) return `https://www.youtube.com/embed/${fallback[1]}`

      return ''
    } catch (e) {
      // final fallback: regex extraction
      const regex = /(?:v=|\/embed\/|youtu\.be\/|\/shorts\/)([A-Za-z0-9_-]{6,})/
      const m = String(rawUrl).match(regex)
      if (m && m[1]) return `https://www.youtube.com/embed/${m[1]}`
      return ''
    }
  }

  useEffect(() => {
    // Normalize helper used both for prefetch and fetched data
    const normalize = (raw, fallbackId) => {
      const base = raw || {}

      // images: različiti oblici (slike.slika[], images[], image)
      const imgs =
        Array.isArray(base.slike?.slika) && base.slike.slika.length > 0
          ? base.slike.slika.map(s => s.url).filter(Boolean)
          : base.images || (base.image ? [base.image] : [])

      // VIDEO: mogući oblici polja: string, array, object {url}, fields: video_url, videotour, video
      const collectVideoField = (field) => {
        const v = base[field]
        if (!v && v !== '') return []
        if (Array.isArray(v)) return v.flat().filter(Boolean).map(x => (typeof x === 'object' ? (x.url ?? '') : String(x)))
        if (typeof v === 'object') return [(v.url ?? '')].filter(Boolean)
        return v ? [String(v)] : []
      }

      let videos = []
      videos = videos.concat(collectVideoField('video_url'))
      videos = videos.concat(collectVideoField('videotour'))
      videos = videos.concat(collectVideoField('video'))

      // trim, filter empty and dedupe
      videos = videos.map(s => s.trim()).filter(Boolean)
      videos = [...new Set(videos)]

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
        video_urls: videos
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

  // Lightbox controls (re-use prev/next logic)
  const openLightbox = (index = 0) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }
  const closeLightbox = () => {
    setLightboxOpen(false)
  }
  const lbPrev = () => {
    if (!images || images.length === 0) return
    setLightboxIndex(i => (i === 0 ? images.length - 1 : i - 1))
  }
  const lbNext = () => {
    if (!images || images.length === 0) return
    setLightboxIndex(i => (i === images.length - 1 ? 0 : i + 1))
  }

  // keyboard navigation for lightbox + prevent page scroll while open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    const onKey = (e) => {
      if (!lightboxOpen) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') lbPrev()
      if (e.key === 'ArrowRight') lbNext()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightboxOpen, images])

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

  // pripremi embed URL-e za sve video zapise (ako ih ima)
  const videoEmbeds = (property.video_urls || []).map(getYoutubeEmbedUrl).filter(Boolean)

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6 mt-10">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-yellow-400 mb-6 hover:text-yellow-300">
          <FaArrowLeft /> {t('backToSearch', 'Nazad')}
        </button>

        {/* IMAGE SLIDER with expand button */}
        <div className="relative rounded-xl overflow-hidden border border-yellow-600/20 shadow-xl">
          <img
            src={images[currentImage] || property.image}
            alt={property.naslov}
            className="w-full h-[420px] object-cover transition-all duration-500 cursor-pointer"
            onClick={() => openLightbox(currentImage)}
          />

          {/* expand button top-right */}
          <button
            onClick={() => openLightbox(currentImage)}
            className="absolute top-4 right-4 z-20 bg-black/60 p-3 rounded-full text-yellow-400 hover:bg-black/70 transition"
            aria-label="Proširi sliku"
            title="Pogledaj slajder"
          >
            <FaExpand />
          </button>

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

        {/* Video: prikazujemo SAMO ako imamo bar jedan validan embed URL */}
        {videoEmbeds.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">{t('videoTour', 'Video tura')}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videoEmbeds.map((src, i) => (
                <div key={i} className="aspect-video w-full rounded overflow-hidden border border-white/5">
                  <iframe
                    title={`video-tour-${i}`}
                    src={src}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIGHTBOX / FULLSCREEN MODAL */}
        {lightboxOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              // klik na pozadinu zatvara (ali ne klik na sadržaj)
              if (e.target === e.currentTarget) closeLightbox()
            }}
          >
            <div className="relative w-full h-full max-w-[1200px] max-h-[96vh] bg-transparent flex flex-col lg:flex-row items-stretch">
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-40 bg-black/40 p-3 rounded-full text-white hover:bg-black/60"
                aria-label="Zatvori"
              >
                <FaTimes />
              </button>

              {/* Prev */}
              <button
                onClick={lbPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 p-3 rounded-full text-white hover:bg-black/60"
                aria-label="Prethodna"
              >
                ‹
              </button>

              {/* Next */}
              <button
                onClick={lbNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 p-3 rounded-full text-white hover:bg-black/60"
                aria-label="Sledeća"
              >
                ›
              </button>

              {/* Main image area */}
              <div className="flex-1 flex items-center justify-center p-4 lg:p-6">
                <img
                  src={images[lightboxIndex] || property.image}
                  alt={`${property.naslov} - ${lightboxIndex + 1}`}
                  className="max-h-[85vh] w-full object-contain"
                />
              </div>

              {/* Thumbnails: horizontally on small, vertically on large */}
              <div className="w-full lg:w-36 lg:ml-4 flex lg:flex-col gap-2 items-center lg:items-stretch overflow-auto px-4 pb-4">
                {/* On small screens show horizontal strip */}
                <div className="flex lg:hidden gap-2 w-full overflow-x-auto">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxIndex(i)}
                      className={`flex-shrink-0 w-24 h-16 rounded overflow-hidden border ${i === lightboxIndex ? 'border-yellow-400' : 'border-white/20'}`}
                      aria-label={`Prikaži sliku ${i + 1}`}
                    >
                      <img src={src} className="w-full h-full object-cover" alt={`thumb-${i}`} />
                    </button>
                  ))}
                </div>

                {/* On large screens show vertical thumbnails */}
                <div className="hidden lg:flex flex-col gap-2 w-full">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxIndex(i)}
                      className={`w-full h-20 rounded overflow-hidden border ${i === lightboxIndex ? 'border-yellow-400' : 'border-white/20'}`}
                      aria-label={`Prikaži sliku ${i + 1}`}
                    >
                      <img src={src} className="w-full h-full object-cover" alt={`thumb-${i}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
