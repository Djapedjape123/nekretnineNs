import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { t } from '../i1n8'

// Mock za prodaju
const MOCK_PROPERTIES = [
  { id: 1, title: 'Luksuzni stan u centru', price: '€75,000', location: 'Beograd, Stari grad', size: 120, rooms: 3, baths: 2, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600' },
  { id: 2, title: 'Moderna vila sa baštom', price: '€150,000', location: 'Beograd, Voždovac', size: 250, rooms: 4, baths: 3, image: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?q=80&w=1600' },
  { id: 3, title: 'Komforan apartman', price: '€45,000', location: 'Beograd, Čukarica', size: 85, rooms: 2, baths: 1, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600' },
  { id: 4, title: 'Kuća sa bazenom', price: '€200,000', location: 'Beograd, Voždovac', size: 300, rooms: 5, baths: 4, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600' },
]

// Mock za izdavanje
const MOCK_RENTALS = [
  { id: 1, title: 'Moderan stan u centru, Beograd', price: '450 €/mesec', location: 'Beograd, Vračar', size: 75, rooms: 2, baths: 1, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { id: 2, title: 'Jednosoban stan blizu fakulteta', price: '320 €/mesec', location: 'Novi Sad, Centar', size: 48, rooms: 1, baths: 1, image: 'https://images.unsplash.com/photo-1560448204-5a3f3d5b1b9f?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { id: 3, title: 'Kuća sa dvorištem za izdavanje', price: '700 €/mesec', location: 'Novi Sad, Petrovaradin', size: 120, rooms: 3, baths: 2, image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { id: 4, title: 'Lux apartman sa pogledom na Dunav', price: '550 €/mesec', location: 'Beograd, Dorćol', size: 65, rooms: 2, baths: 1, image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3' },
]

export default function SearchForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    q: '',
    listingType: 'sale',
    propertyType: 'apartment',
    minPrice: '',
    maxPrice: '',
    rooms: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const numericFromPriceString = (priceStr) => {
    if (!priceStr) return null
    const num = parseInt(priceStr.replace(/[^\d]/g, ''))
    return Number.isFinite(num) ? num : null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // Odaberi odgovarajući set podataka
    const source = formData.listingType === 'rent' ? MOCK_RENTALS : MOCK_PROPERTIES

    let filtered = source

    // filtiraj po tekstu (lokacija / naslov)
    if (formData.q) {
      const q = formData.q.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          (p.location && p.location.toLowerCase().includes(q)) ||
          (p.title && p.title.toLowerCase().includes(q))
      )
    }

    // filtiraj po sobama
    if (formData.rooms) {
      const roomsMin = parseInt(formData.rooms) || 0
      filtered = filtered.filter((p) => (p.rooms || 0) >= roomsMin)
    }

    // filtiraj po ceni ako su numeričke vrednosti dostupne (skeniramo string)
    if (formData.minPrice || formData.maxPrice) {
      const min = formData.minPrice ? parseInt(formData.minPrice) : null
      const max = formData.maxPrice ? parseInt(formData.maxPrice) : null
      filtered = filtered.filter((p) => {
        const val = numericFromPriceString(p.price) // iz mock-a cena može biti string
        if (val == null) return true
        if (min != null && val < min) return false
        if (max != null && val > max) return false
        return true
      })
    }

    // simuliraj loader i preusmeri na odgovarajuću stranicu sa state
    setTimeout(() => {
      const path = formData.listingType === 'rent' ? '/izdavanje' : '/prodaja'
      navigate(path, { state: { properties: filtered, filters: formData } })
      setLoading(false)
    }, 400)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto rounded-3xl p-5 md:p-6 shadow-2xl backdrop-blur-xl bg-gradient-to-br from-black/70 to-black/40 border border-yellow-600/10 transition"
    >
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
       
        <div className="md:col-span-2">
          <label className="text-xs text-gray-400 font-medium">{t('location')}</label>
          <input
            type="text"
            name="q"
            value={formData.q}
            onChange={handleChange}
            placeholder={t('searchLocation')}
            className="mt-2 w-full p-3 rounded-xl bg-black/40 border border-transparent text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition"
          />
        </div>

       
        <div className="md:col-span-1">
          <label className="text-xs text-gray-400 font-medium">{t('idCode')}</label>
          <input
            type="text"
            name="id"
            value={formData.id || ''}
            onChange={handleChange}
            placeholder={t('searchId')}
            className="mt-2 w-full p-3 rounded-xl bg-black/40 border border-transparent text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition"
          />
        </div>

        
        <div className="md:col-span-1">
          <label className="text-xs text-gray-400 font-medium">{t('type')}</label>
          <select
            name="listingType"
            value={formData.listingType}
            onChange={handleChange}
            className="mt-2 w-full p-3 rounded-xl bg-black/40 border border-transparent text-white focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition"
          >
            <option value="sale">{t('sale')}</option>
            <option value="rent">{t('rent')}</option>

          </select>
        </div>

        
        <div className="md:col-span-1">
          <label className="text-xs text-gray-400 font-medium">{t('propertyType')}</label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="mt-2 w-full p-3 rounded-xl bg-black/40 border border-transparent text-white focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition"
          >
            <option value="apartment">{t('apartment')}</option>
            <option value="house">{t('house')}</option>
            <option value="land">{t('land')}</option>
            <option value="office">{t('office')}</option>
            <option value="villa">{t('villa')}</option>

          </select>
        </div>

       
        <div className="md:col-span-1">
          <label className="text-xs text-gray-400 font-medium">{t('rooms')}</label>
          <select
            name="rooms"
            value={formData.rooms}
            onChange={handleChange}
            className="mt-2 w-full p-3 rounded-xl bg-black/40 border border-transparent text-white focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition"
          >
            <option value="">{t('any')}</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>

          </select>
        </div>
      </div>

      
      <div className="mt-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex gap-3 flex-1">
          <input
            type="number"
            name="minPrice"
            value={formData.minPrice}
            onChange={handleChange}
            placeholder={t('minPrice')}
            className="w-1/2 p-3 rounded-xl bg-black/40 border border-transparent text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition"
          />
          <input
            type="number"
            name="maxPrice"
            value={formData.maxPrice}
            onChange={handleChange}
            placeholder={t('maxPrice')}
            className="w-1/2 p-3 rounded-xl bg-black/40 border border-transparent text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-56 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-3 rounded-2xl shadow-xl hover:from-yellow-500 hover:to-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Učitavanje...' : 'Pretraži'}
        </button>
      </div>
    </form>

  )
}
