// SinglePage.jsx
import React, { useEffect, useState, useCallback } from 'react'
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

  // safer: avoid direct window access (handle SSR)
  const getProtocol = () => (typeof window !== 'undefined' && window.location && window.location.protocol) ? window.location.protocol : 'https:'

  // robust YouTube embed extractor (supports /shorts/, youtu.be, watch?v=, /embed/)
  const getYoutubeEmbedUrl = useCallback((rawUrl) => {
    if (!rawUrl) return ''
    let url = String(rawUrl).trim()
    if (!url) return ''

    // normalize protocol-less
    if (url.startsWith('//')) url = `${getProtocol()}${url}`
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`

    try {
      const parsed = new URL(url)
      const host = (parsed.hostname || '').toLowerCase()

      // youtu.be/ID
      if (host.includes('youtu.be')) {
        const id = parsed.pathname.replace(/^\/+/, '').split('/')[0]
        if (id) return `https://www.youtube.com/embed/${id}`
      }

      // /shorts/ID
      {
        const m = parsed.pathname.match(/\/shorts\/([A-Za-z0-9_-]{4,})/)
        if (m && m[1]) return `https://www.youtube.com/embed/${m[1]}`
      }

      // watch?v=ID
      {
        const v = parsed.searchParams.get('v')
        if (v) return `https://www.youtube.com/embed/${v}`
      }

      // /embed/ID
      {
        const m = parsed.pathname.match(/\/embed\/([A-Za-z0-9_-]{4,})/)
        if (m && m[1]) return `https://www.youtube.com/embed/${m[1]}`
      }

      // fallback regex (covers many edge cases)
      {
        const m = url.match(/(?:v=|\/embed\/|youtu\.be\/|\/shorts\/)([A-Za-z0-9_-]{4,})/)
        if (m && m[1]) return `https://www.youtube.com/embed/${m[1]}`
      }

      return ''
    } catch (e) {
      // fallback simple regex
      const regex = /(?:v=|\/embed\/|youtu\.be\/|\/shorts\/)([A-Za-z0-9_-]{4,})/
      const m = String(rawUrl).match(regex)
      if (m && m[1]) return `https://www.youtube.com/embed/${m[1]}`
      return ''
    }
  }, [])

  useEffect(() => {
    // Normalize helper used both for prefetch and fetched data
    const normalize = (raw, fallbackId) => {
      const base = raw || {}

      // images: accept different shapes (array, object with slika array, single string)
      let imgs = []
      try {
        if (Array.isArray(base.slike?.slika) && base.slike.slika.length > 0) {
          imgs = base.slike.slika.map(s => (s && s.url) ? String(s.url) : null).filter(Boolean)
        } else if (Array.isArray(base.images) && base.images.length > 0) {
          imgs = base.images.map(String).filter(Boolean)
        } else if (base.image) {
          imgs = [String(base.image)]
        } else if (typeof base.slike === 'object' && base.slike !== null && base.slike.url) {
          imgs = [String(base.slike.url)]
        }
      } catch (e) {
        imgs = []
      }

      if (!imgs.length) imgs = ['/placeholder.jpg']

      // videos: accept string, array, object {url}
      const collectVideoField = (field) => {
        const v = base[field]
        if (v === undefined || v === null) return []
        if (Array.isArray(v)) {
          return v.flat().map(x => (typeof x === 'object' ? (x.url ?? '') : String(x))).filter(Boolean)
        }
        if (typeof v === 'object') {
          // object may be {url: '...'} or nested
          if (v.url) return [String(v.url)]
          // flatten values (rare)
          return Object.values(v).map(String).filter(Boolean)
        }
        // string
        return [String(v)]
      }

      let videos = []
      videos = videos.concat(collectVideoField('video_url'))
      videos = videos.concat(collectVideoField('videotour'))
      videos = videos.concat(collectVideoField('video'))

      // normalize videos: trim + dedupe
      videos = videos.map(s => String(s || '').trim()).filter(Boolean)
      videos = Array.from(new Set(videos))

      // helper to safely read multiple possible keys
      const get = (...keys) => {
        for (const k of keys) {
          if (k in base && base[k] !== undefined && base[k] !== null && String(base[k]).trim() !== '') return base[k]
        }
        return ''
      }

      // equipment/attributes parsing (string with commas or array or object)
      const toArray = (val) => {
        if (!val && val !== 0) return []
        if (Array.isArray(val)) return val.map(String)
        if (typeof val === 'object') {
          // try common patterns
          if (val.attrib) {
            // attrib may be object or array
            if (Array.isArray(val.attrib)) return val.attrib.map(a => a?.name ?? a?.value ?? String(a)).filter(Boolean)
            return [val.attrib.name ?? val.attrib.value ?? String(val.attrib)].filter(Boolean)
          }
          return Object.values(val).flat?.() || Object.values(val).map(String)
        }
        return String(val).split(/[,;|\n]+/).map(s => s.trim()).filter(Boolean)
      }

      const equipment = toArray(get('oprema', 'opremljeno', 'namestenost'))
      const additional = toArray(get('dodatno', 'extra', 'attribs', 'atributi'))
      const characteristics = toArray(get('karakteristike', 'features', 'karakteristike_list'))

      const structured = {
        offerType: get('vrstaponude', 'vrstaponude_text') || '',
        propertyType: get('vrstanekretnine', 'vrstap', 'type') || '',
        subtype: get('podtip', 'podtipnekretnine', 'tip') || '',
        area: get('kvadratura_int', 'kvadratura', 'povrsina') || '',
        yearBuilt: get('godinaizgradnje', 'godina', 'year') || '',
        floor: get('sprat', 'sprat_text') || '',
        floorTotal: get('spratova', 'spratova_total') || '',
        terraceArea: get('povrsinaterase', 'terrace_area') || '',
        roomsCount: get('brojsoba', 'rooms') || '',
        bedrooms: get('brojspavacihsoba', 'spavace') || '',
        bathrooms: get('brojkupatila', 'baths') || '',
        wcCount: get('brojwc', 'wc') || '',
        region: get('regija', 'region') || '',
        city: get('grad', 'mesto', 'naselje') || '',
        furnished: get('namestenost', 'opremljeno') || '',
        idCode: base.id ?? base.code ?? fallbackId ?? '',
        equipment,
        additional,
        characteristics,
        carpentry: get('stolarija', 'stolarija_tip') || '',
        heating: get('vrstagrejanja', 'grejanje') || ''
      }

      return {
        id: base.id ?? base.code ?? fallbackId,
        naslov: base.naslov ?? base.title ?? '',
        opis: base.opis ?? base.description ?? '',
        cena: base.cena ?? base.price ?? '',
        images: imgs,
        image: imgs[0] || '/placeholder.jpg',
        location: [base.mesto, base.naselje, base.grad].filter(Boolean).join(', ') || (base.location || ''),
        rooms: Number(base.brojsoba ?? base.rooms ?? structured.roomsCount ?? 0) || 0,
        baths: Number(base.brojkupatila ?? base.baths ?? structured.bathrooms ?? 0) || 0,
        size: structured.area || base.kvadratura_int || base.kvadratura || 0,
        contactphone: base.contactphone ?? base.brojtelin ?? '',
        video_urls: videos,
        meta: structured
      }
    }

    // immediate prefetch from location.state
    const pre = location.state?.item
    if (pre) {
      try {
        const normalized = normalize(pre, id)
        setProperty(normalized)
        setImages(Array.isArray(normalized.images) ? normalized.images : [normalized.image])
        setCurrentImage(0)
        setLoading(false)
      } catch (e) {
        setError('Greška pri procesiranju podataka (prefetch).')
        setLoading(false)
      }
      return
    }

    if (!id) {
      setError('Neispravan ID.')
      setLoading(false)
      return
    }

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
          setImages(Array.isArray(normalized.images) ? normalized.images : [normalized.image])
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
  }, [id, location.state, getYoutubeEmbedUrl])

  // Slider controls
  const prevImage = () => {
    setCurrentImage(i => {
      const imgs = Array.isArray(images) ? images : [images]
      if (imgs.length === 0) return 0
      return (i <= 0 ? imgs.length - 1 : i - 1)
    })
  }
  const nextImage = () => {
    setCurrentImage(i => {
      const imgs = Array.isArray(images) ? images : [images]
      if (imgs.length === 0) return 0
      return (i >= imgs.length - 1 ? 0 : i + 1)
    })
  }

  const openLightbox = (index = 0) => {
    setLightboxIndex(index || 0)
    setLightboxOpen(true)
  }
  const closeLightbox = () => setLightboxOpen(false)
  const lbPrev = () => {
    setLightboxIndex(i => {
      const imgs = Array.isArray(images) ? images : [images]
      if (imgs.length === 0) return 0
      return (i <= 0 ? imgs.length - 1 : i - 1)
    })
  }
  const lbNext = () => {
    setLightboxIndex(i => {
      const imgs = Array.isArray(images) ? images : [images]
      if (imgs.length === 0) return 0
      return (i >= imgs.length - 1 ? 0 : i + 1)
    })
  }

  // keyboard navigation + block scroll while open
  useEffect(() => {
    if (lightboxOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''

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

  const safeImages = Array.isArray(images) ? images : [images || property.image || '/placeholder.jpg']
  const videoEmbeds = (property.video_urls || []).map(v => {
    try { return getYoutubeEmbedUrl(v) } catch { return '' }
  }).filter(Boolean)

  const meta = property.meta || {}

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6 mt-10">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-yellow-400 mb-6 hover:text-yellow-300">
          <FaArrowLeft /> {t('backToSearch', 'Nazad')}
        </button>

        {/* IMAGE SLIDER */}
        <div className="relative rounded-xl overflow-hidden border border-yellow-600/20 shadow-xl">
          <img
            src={safeImages[currentImage] || property.image}
            alt={property.naslov || ''}
            className="w-full h-[420px] object-cover transition-all duration-500 cursor-pointer"
            onClick={() => openLightbox(currentImage)}
            onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
          />

          <button
            onClick={() => openLightbox(currentImage)}
            className="absolute top-4 right-4 z-20 bg-black/60 p-3 rounded-full text-yellow-400 hover:bg-black/70 transition"
            aria-label="Proširi sliku"
            title="Pogledaj slajder"
          >
            <FaExpand />
          </button>

          {safeImages.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 p-3 rounded-full text-yellow-400 hover:bg-black z-10">‹</button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 p-3 rounded-full text-yellow-400 hover:bg-black z-10">›</button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {safeImages.map((_, i) => (
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

          {/* meta block kept same styling as before (kept concise) */}
          <div className="mt-6 bg-black/30 border border-white/5 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-300">
              <div>
                <div className="text-xs text-gray-400">Tip ponude</div>
                <div className="font-semibold">{meta.offerType || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Tip nekretnine</div>
                <div className="font-semibold">{meta.propertyType || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Površina</div>
                <div className="font-semibold">{meta.area ? `${meta.area} m²` : (property.size ? `${property.size} m²` : '-')}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Godina</div>
                <div className="font-semibold">{meta.yearBuilt || '-'}</div>
              </div>

              <div>
                <div className="text-xs text-gray-400">Sprat</div>
                <div className="font-semibold">{meta.floor || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Spratova</div>
                <div className="font-semibold">{meta.floorTotal || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">ID kod</div>
                <div className="font-semibold">{meta.idCode || property.id || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Grejanje</div>
                <div className="font-semibold">{meta.heating || '-'}</div>
              </div>
            </div>

            {/* chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {(meta.equipment || []).map((it, i) => <span key={`eq-${i}`} className="text-xs px-2 py-1 bg-white/5 rounded border border-white/10">{it}</span>)}
              {(meta.additional || []).map((it, i) => <span key={`ad-${i}`} className="text-xs px-2 py-1 bg-white/5 rounded border border-white/10">{it}</span>)}
              {(meta.characteristics || []).map((it, i) => <span key={`ch-${i}`} className="text-xs px-2 py-1 bg-white/5 rounded border border-white/10">{it}</span>)}
            </div>
          </div>

          <div className="mt-8 flex gap-4 flex-col sm:flex-row">
            <a
              href={`mailto:serbesnekretnine@gmail.com?subject=${encodeURIComponent(`${t('mailSubjectPrefix', 'Zainteresovan za:')} ${property.naslov}`)}`}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-md font-semibold shadow"
            >
              {t('contactBtn', 'Kontakt')}
            </a>

            <a
              href={property.contactphone ? `tel:${property.contactphone}` : 'tel:+38163238564'}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-md font-semibold shadow"
            >
              {t('cta', 'Pozovi')}
            </a>
          </div>
        </div>

        {/* Videos */}
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

        {/* Lightbox */}
        {lightboxOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            onClick={(e) => { if (e.target === e.currentTarget) closeLightbox() }}
          >
            <div className="relative w-full h-full max-w-[1200px] max-h-[96vh] bg-transparent flex flex-col lg:flex-row items-stretch">
              <button onClick={closeLightbox} className="absolute top-4 right-4 z-40 bg-black/40 p-3 rounded-full text-white hover:bg-black/60"><FaTimes /></button>
              <button onClick={lbPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 p-3 rounded-full text-white hover:bg-black/60">‹</button>
              <button onClick={lbNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 p-3 rounded-full text-white hover:bg-black/60">›</button>

              <div className="flex-1 flex items-center justify-center p-4 lg:p-6">
                <img src={safeImages[lightboxIndex] || property.image} alt="" className="max-h-[85vh] w-full object-contain" onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }} />
              </div>

              <div className="w-full lg:w-36 lg:ml-4 flex lg:flex-col gap-2 items-center lg:items-stretch overflow-auto px-4 pb-4">
                <div className="flex lg:hidden gap-2 w-full overflow-x-auto">
                  {safeImages.map((src, i) => (
                    <button key={i} onClick={() => setLightboxIndex(i)} className={`flex-shrink-0 w-24 h-16 rounded overflow-hidden border ${i === lightboxIndex ? 'border-yellow-400' : 'border-white/20'}`}><img src={src} className="w-full h-full object-cover" alt="" /></button>
                  ))}
                </div>
                <div className="hidden lg:flex flex-col gap-2 w-full">
                  {safeImages.map((src, i) => (
                    <button key={i} onClick={() => setLightboxIndex(i)} className={`w-full h-20 rounded overflow-hidden border ${i === lightboxIndex ? 'border-yellow-400' : 'border-white/20'}`}><img src={src} className="w-full h-full object-cover" alt="" /></button>
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
