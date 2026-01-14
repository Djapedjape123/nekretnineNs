import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import { FaBed, FaBath, FaArrowLeft, FaExpand, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { t } from '../i1n8'
import { IoMdResize } from "react-icons/io";
import { API_BASE } from '../config'


export default function SinglePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const topRef = useRef(null)

  const [property, setProperty] = useState(null)
  const [images, setImages] = useState([])
  const [currentImage, setCurrentImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // --- HELPERI ---

  const formatPrice = (val) => {
    if (val === undefined || val === null || val === '') return ''
    if (typeof val === 'number') {
      try { return new Intl.NumberFormat('de-DE').format(val) + ' €' } catch { return String(val) + ' €' }
    }
    const s = String(val)
    if (s.includes('€')) return s
    const digits = s.replace(/[^0-9]/g, '')
    if (!digits) return s
    try { return new Intl.NumberFormat('de-DE').format(Number(digits)) + ' €' } catch { return s + ' €' }
  }

  const makeSentence = (raw) => {
    if (!raw && raw !== 0) return ''
    try {
      let s = String(raw).replace(/[_\-]+/g, ' ').replace(/\s+/g, ' ').trim()
      s = s.toLowerCase()
      s = s.charAt(0).toUpperCase() + s.slice(1)
      if (/^da$/i.test(s)) return 'Da'
      if (/^ne$/i.test(s)) return 'Ne'
      return s
    } catch { return String(raw) }
  }

  const getProtocol = () => (typeof window !== 'undefined' && window.location && window.location.protocol) ? window.location.protocol : 'https:'

  const getYoutubeEmbedUrl = useCallback((rawUrl) => {
    if (!rawUrl) return ''
    let url = String(rawUrl).trim()
    if (!url) return ''
    if (url.startsWith('//')) url = `${getProtocol()}${url}`
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`
    try {
      const parsed = new URL(url)
      const host = (parsed.hostname || '').toLowerCase()
      if (host.includes('youtu.be')) {
        const id = parsed.pathname.replace(/^\/+/, '').split('/')[0]
        if (id) return `https://www.youtube.com/embed/${id}`
      }
      const m1 = parsed.pathname.match(/\/shorts\/([A-Za-z0-9_-]{4,})/)
      if (m1 && m1[1]) return `https://www.youtube.com/embed/${m1[1]}`
      const v = parsed.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
      const m2 = parsed.pathname.match(/\/embed\/([A-Za-z0-9_-]{4,})/)
      if (m2 && m2[1]) return `https://www.youtube.com/embed/${m2[1]}`
      return ''
    } catch (e) { return '' }
  }, [])

  // --- LOGIKA NORMALIZACIJE ---
  useEffect(() => {
    const normalize = (raw, fallbackId) => {
      const base = raw || {}
      
      let imgs = []
      try {
        if (Array.isArray(base.slike?.slika) && base.slike.slika.length > 0) {
          imgs = base.slike.slika.map(s => (s && s.url) ? String(s.url) : null).filter(Boolean)
        } else if (Array.isArray(base.images) && base.images.length > 0) {
          imgs = base.images.map(String).filter(Boolean)
        } else if (base.image) {
          imgs = [String(base.image)]
        } else if (typeof base.slike === 'object' && base.slike?.url) {
          imgs = [String(base.slike.url)]
        }
      } catch (e) { imgs = [] }
      if (!imgs.length) imgs = ['/placeholder.jpg']

      let videos = []
      const collectVideo = (field) => {
        const v = base[field]; if(!v) return []
        if(Array.isArray(v)) return v.flat().map(x => (typeof x === 'object' ? x.url : x)).filter(Boolean)
        if(typeof v === 'object') return [v.url].filter(Boolean)
        return [String(v)]
      }
      const allVideos = [...collectVideo('video_url'), ...collectVideo('videotour'), ...collectVideo('video')]
      videos = [...new Set(allVideos)] 

      const get = (...keys) => {
        for (const k of keys) {
          if (k in base && base[k] !== undefined && base[k] !== null && String(base[k]).trim() !== '') return base[k]
        }
        return ''
      }

      const toArray = (val, isAttributeObject = false) => {
        if (!val) return []
        if (isAttributeObject && val.attrib) {
           const list = Array.isArray(val.attrib) ? val.attrib : [val.attrib];
           return list.map(item => {
               const name = item.name ? String(item.name).trim() : '';
               const value = item.value ? String(item.value).trim() : '';
               if (name && value) return `${name}: ${value}`;
               return name || value;
           }).filter(Boolean);
        }
        if (Array.isArray(val)) return val.map(String)
        if (typeof val === 'object') return Object.values(val).map(String)
        return String(val).split(/[,;|\n]+/).map(s => s.trim()).filter(Boolean)
      }

      const equipment = toArray(get('oprema', 'opremljeno'))
      const rawAttribs = get('attribs', 'atributi', 'dodatno', 'extra');
      const additional = toArray(rawAttribs, !!(rawAttribs && rawAttribs.attrib)); 

      const structured = {
        offerType: get('vrstaponude', 'vrstaponude_text') || '',
        propertyType: get('vrstanekretnine', 'type') || '',
        subtype: get('podtip', 'podtipnekretnine') || '',
        area: get('kvadratura_int', 'kvadratura', 'povrsina') || '',
        yearBuilt: get('godinaizgradnje', 'godina') || '',
        floor: get('sprat', 'sprat_text') || '',
        floorTotal: get('spratova', 'spratova_total') || '',
        roomsCount: get('brojsoba', 'rooms') || '',
        bedrooms: get('brojspavacihsoba', 'spavace') || '',
        bathrooms: get('brojkupatila', 'baths') || '',
        wcCount: get('brojwc', 'wc') || '',
        region: get('regija', 'region') || '',
        city: get('grad', 'mesto', 'naselje') || '',
        idCode: base.id ?? base.code ?? fallbackId ?? '',
        equipment,
        additional,
        carpentry: get('stolarija', 'stolarija_tip') || '',
        heating: get('vrstagrejanja', 'grejanje') || '',
        state: get('stanje', 'objectstate') || '',
        // --- NOVI PODACI KOJI SU FALILI ---
        constructionType: get('vrstagradnje') || '',
        ambience: get('ambijent') || '',
        publishedDate: get('daystart') || '',
        lastUpdate: get('lastupdate') || '',
        agentId: get('agentid') || '',
        zipCode: get('ptt') || '',
        country: get('drzava') || '',
        furnishing: get('namestenost') || ''
      }

      return {
        id: structured.idCode,
        naslov: base.naslov ?? base.title ?? '',
        opis: base.opis ?? base.description ?? '',
        cena: base.cena ?? base.price ?? '',
        images: imgs,
        image: imgs[0] || '/placeholder.jpg',
        location: [base.mesto, base.naselje, base.grad].filter(Boolean).join(', ') || (base.location || ''),
        rooms: Number(structured.roomsCount) || 0,
        baths: Number(structured.bathrooms) || 0,
        size: structured.area || 0,
        contactphone: base.contactphone ?? base.brojtelin ?? '',
        video_urls: videos,
        meta: structured
      }
    }

    if (!id) { setError('Neispravan ID.'); setLoading(false); return }
    let cancelled = false
    const fetchProperty = async () => {
      setLoading(true); setError(null);
      try {
        const res = await fetch(`${API_BASE}/oglasi/${encodeURIComponent(id)}`)
        if (!res.ok) throw new Error('Greška')
        const data = await res.json()
        if (!cancelled) {
          const norm = normalize(data, id)
          setProperty(norm)
          setImages(norm.images)
          setLoading(false)
        }
      } catch (err) { if (!cancelled) { setError('Greška'); setLoading(false) } }
    }
    fetchProperty()
    return () => { cancelled = true }
  }, [id, getYoutubeEmbedUrl])

  useEffect(() => {
    if (topRef.current) topRef.current.scrollIntoView({ behavior: 'auto' })
    else window.scrollTo(0,0)
  }, [location.key])

  const prevImage = () => setCurrentImage(i => (i <= 0 ? images.length - 1 : i - 1))
  const nextImage = () => setCurrentImage(i => (i >= images.length - 1 ? 0 : i + 1))
  
  const openLightbox = (index = 0) => { setLightboxIndex(index); setLightboxOpen(true) }
  const closeLightbox = () => setLightboxOpen(false)
  const nextLightbox = (e) => { e?.stopPropagation(); setLightboxIndex(i => (i >= images.length - 1 ? 0 : i + 1)) }
  const prevLightbox = (e) => { e?.stopPropagation(); setLightboxIndex(i => (i <= 0 ? images.length - 1 : i - 1)) }
  
  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e) => {
       if (e.key === 'Escape') closeLightbox()
       if (e.key === 'ArrowRight') nextLightbox()
       if (e.key === 'ArrowLeft') prevLightbox()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, images.length])


  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-bold">Učitavanje...</div>
  if (error || !property) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Nema rezultata</div>

  const safeImages = Array.isArray(images) ? images : [property.image]
  const meta = property.meta || {}

  const infoTable = [
    { label: t('tipPonude', 'Tip ponude'), val: meta.offerType },
    { label: t('cena', 'Cena'), val: formatPrice(property.cena), isPrice: true },
    { label: t('lokacija', 'Lokacija'), val: property.location },
    { label: t('tipNekretnine', 'Tip nekretnine'), val: meta.propertyType },
    { label: t('podtip', 'Podtip'), val: meta.subtype },
    { label: t('povrsina', 'Površina'), val: meta.area ? `${meta.area} m²` : '' }, 
    { label: t('gradnja', 'Vrsta gradnje'), val: meta.constructionType },
    { label: t('ambijent', 'Ambijent'), val: meta.ambience },
    { label: t('stanje', 'Stanje'), val: meta.state },
    { label: t('godina', 'Godina izgradnje'), val: meta.yearBuilt },
    { label: t('sprat', 'Spratnost'), val: meta.floor && meta.floorTotal ? `${meta.floor} / ${meta.floorTotal}` : meta.floor },
    { label: t('sobe', 'Broj soba'), val: meta.roomsCount },
    { label: t('kupatila', 'Broj kupatila'), val: meta.bathrooms },
    { label: t('grejanje', 'Grejanje'), val: meta.heating },
    { label: t('namestenost', 'Nameštenost'), val: meta.furnishing },
    { label: t('objavljeno', 'Objavljeno'), val: meta.publishedDate },
    { label: t('azurirano', 'Poslednja izmena'), val: meta.lastUpdate },
    { label: t('agent', 'ID Agenta'), val: meta.agentId },
    { label: t('id', 'ID oglasa'), val: meta.idCode },
    { label: t('stolarija', 'Stolarija'), val: meta.carpentry },
    { label: t('grad', 'Grad/PTT'), val: meta.zipCode ? `${meta.city} ${meta.zipCode}` : meta.city },
  ].filter(i => i.val && i.val !== '0' && i.val !== '0.0')

  return (
    <div className="min-h-screen bg-black text-white py-12 px-8 mt-10">
      <div className="max-w-5xl mx-auto" ref={topRef}>
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-yellow-400 mb-6 hover:text-yellow-300">
          <FaArrowLeft /> {t('backToSearch', 'Nazad')}
        </button>

        {/* Galerija */}
        <div className="relative rounded-xl overflow-hidden border border-yellow-600/20 shadow-xl bg-gray-900">
          <img
            src={safeImages[currentImage] || property.image}
            alt={property.naslov}
            className="w-full h-[420px] object-cover cursor-pointer"
            onClick={() => openLightbox(currentImage)}
            onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
          />
          <button onClick={() => openLightbox(currentImage)} className="absolute top-4 right-4 z-20 bg-black/60 p-3 rounded-full text-yellow-400 hover:bg-black/70">
            <FaExpand />
          </button>
          {safeImages.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 p-3 rounded-full text-yellow-400 hover:bg-black z-10">‹</button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 p-3 rounded-full text-yellow-400 hover:bg-black z-10">›</button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {safeImages.map((_, i) => (
                  <button key={i} onClick={() => setCurrentImage(i)} className={`w-3 h-3 rounded-full transition ${currentImage === i ? 'bg-yellow-400 scale-110' : 'bg-white/40'}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Detalji */}
        <div className="mt-8 bg-gradient-to-br from-gray-900 to-black border border-yellow-600/10 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h1 className="text-3xl font-extrabold text-yellow-400">{property.naslov}</h1>
            <div className="text-2xl font-bold text-white">{formatPrice(property.cena)}</div>
          </div>
          <div className="flex items-center gap-2 text-gray-300 mt-3">
            <MdLocationOn className="text-yellow-400" />
            <span className='font-bold'>{property.location}</span>
          </div>

          {/* Glavni bedževi */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-gray-300">
            <div className="bg-black/40 p-4 rounded border border-yellow-600/10 flex flex-col items-center justify-center text-center min-h-[110px]">
              <FaBed className="text-yellow-400 text-3xl mb-2" />
              <div className="text-2xl font-bold text-white">{property.rooms}</div>
              <div className="text-sm text-gray-400 mt-1">{t('rooms', 'sobe')}</div>
            </div>
            <div className="bg-black/40 p-4 rounded border border-yellow-600/10 flex flex-col items-center justify-center text-center min-h-[110px]">
              <FaBath className="text-yellow-400 text-3xl mb-2" />
              <div className="text-2xl font-bold text-white">{property.baths}</div>
              <div className="text-sm text-gray-400 mt-1">{t('baths', 'kupatila')}</div>
            </div>
            <div className="bg-black/40 p-4 rounded border border-yellow-600/10 flex flex-col items-center justify-center text-center min-h-[110px]">
              <IoMdResize className="text-yellow-400 text-3xl mb-2" />
              <div className="text-2xl font-bold text-white">{property.size} m²</div>
              <div className="text-sm text-gray-400 mt-1">{t('size', 'kvadratura')}</div>
            </div>
          </div>

          <p className="mt-6 text-gray-300 leading-relaxed whitespace-pre-line">{property.opis}</p>

          <div className="mt-10 space-y-10">
            {/* Tabela sa informacijama */}
            <div>
                 <h3 className="text-xl text-yellow-400 font-bold mb-4 uppercase tracking-wide border-b border-white/10 pb-2">Informacije o nekretnini</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
                     {infoTable.map((item, idx) => (
                         <div key={idx} className="flex flex-col border-b border-white/5 pb-1">
                             <span className="text-gray-500 text-sm uppercase">{item.label}</span>
                             <span className={`text-lg font-medium ${item.isPrice ? 'text-yellow-400' : 'text-white'}`}>{makeSentence(item.val)}</span>
                         </div>
                     ))}
                 </div>
            </div>

            {/* Oprema */}
            {meta.equipment && meta.equipment.length > 0 && (
                <div>
                    <h3 className="text-xl text-yellow-400 font-bold mb-4 uppercase tracking-wide border-b border-white/10 pb-2">{t('oprema', 'Oprema')}</h3>
                    <div className="flex flex-wrap gap-3">
                        {meta.equipment.map((item, i) => (
                            <span key={i} className="px-3 py-1 bg-white/10 text-gray-200 rounded text-base border border-white/10">{makeSentence(item)}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Dodatno (Atributi) */}
            {meta.additional && meta.additional.length > 0 && (
                <div>
                    <h3 className="text-xl text-yellow-400 font-bold mb-4 uppercase tracking-wide border-b border-white/10 pb-2">{t('dodatno', 'Dodatne karakteristike')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {meta.additional.map((item, i) => {
                            const parts = String(item).split(':');
                            const hasValue = parts.length > 1;
                            const label = hasValue ? parts[0] : item;
                            const rawVal = hasValue ? parts[1].trim().toLowerCase() : 'da';
                            const isYes = rawVal === 'da' || rawVal === 'true';
                            const isNo = rawVal === 'ne' || rawVal === 'false';
                            let displayVal = 'Da';
                            let valClass = 'text-yellow-400';
                            if (isNo) { displayVal = 'Ne'; valClass = 'text-gray-500'; }
                            else if (!isYes) { displayVal = makeSentence(rawVal); valClass = 'text-white'; }
                            return (
                                <div key={i} className="flex justify-between items-center bg-black/40 p-3 rounded border border-white/5">
                                    <span className="text-gray-300 font-medium">{makeSentence(label)}</span>
                                    <span className={`font-bold uppercase ${valClass}`}>{displayVal}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
          </div>

          <div className="mt-8 flex gap-4 flex-col sm:flex-row">
            <a href={`mailto:serbesnekretnine@gmail.com?subject=${encodeURIComponent(`Zainteresovan za: ${property.naslov}`)}`} className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-md font-semibold shadow text-center">{t('contactBtn', 'Kontakt')}</a>
            <a href={property.contactphone ? `tel:${property.contactphone}` : 'tel:+381628150586'} className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-md font-semibold shadow text-center">{t('cta', 'Pozovi')}</a>
          </div>
        </div>

        {/* Video sekcija */}
        {property.video_urls && property.video_urls.length > 0 && (
          <div className="mt-8">
             {property.video_urls.map((v, i) => (
               <div key={i} className="mb-6 rounded-xl overflow-hidden border border-yellow-600/20 shadow-xl">
                 <iframe src={getYoutubeEmbedUrl(v)} className="w-full h-[300px] md:h-[500px]" title={`video-${i}`} allowFullScreen />
               </div>
             ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center select-none" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-6 right-6 text-white text-4xl hover:text-yellow-400 transition-colors z-[110]">
            <FaTimes />
          </button>
          {safeImages.length > 1 && (
            <button onClick={prevLightbox} className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white/50 hover:text-yellow-400 text-5xl transition-all z-[110] p-4">
              <FaChevronLeft />
            </button>
          )}
          <div className="relative max-w-[90%] max-h-[90%] flex flex-col items-center">
            <img 
              src={safeImages[lightboxIndex]} 
              alt="" 
              className="max-w-full max-h-[85vh] object-contain shadow-2xl animate-in fade-in zoom-in duration-300" 
              onClick={(e) => e.stopPropagation()} 
            />
            <div className="text-white/60 mt-4 font-medium tracking-widest uppercase text-sm">
              {lightboxIndex + 1} / {safeImages.length}
            </div>
          </div>
          {safeImages.length > 1 && (
            <button onClick={nextLightbox} className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-white/50 hover:text-yellow-400 text-5xl transition-all z-[110] p-4">
              <FaChevronRight />
            </button>
          )}
        </div>
      )}
    </div>
  )
}