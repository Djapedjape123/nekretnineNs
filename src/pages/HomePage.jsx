import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import backgroundImage from '../assets/pozadina.jpg'
import { t } from '../i1n8'
import TopPonudePage from './TopPonudePage'
import UslugePage from './UslugePage'
import PonudeNudimo from './PonudeNudimo'
import ONama from './Onama'

function HomePage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    transaction: 'prodaja',
    type: 'stan',
    price: 'all',
    area: 'all',
    location: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    Object.entries(form).forEach(([k, v]) => {
      if (v && v !== 'all') params.set(k, v)
    })
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div>
      {/* HERO SECTION - ima background i overlay, ali ne koristi absolute na rootu */}
      <section
        className="relative min-h-screen flex flex-col"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay samo za hero */}
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

        {/* HERO CONTENT */}
        <div className="relative z-10 flex-1 flex flex-col mt-14 text-white px-4 pt-6">
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-md">
              {t('heroTitle')}
            </h1>

            <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl">
              {t('heroSubtitle')}
            </p>
          </div>

          {/* SEARCH FORM CARD (pri dnu hero sekcije) */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-6xl mx-auto mt-auto mb-0 p-4 md:p-6 rounded-xl bg-black/50 backdrop-blur-md border border-yellow-500 shadow-lg"
          >
            <div className="grid gap-3 grid-cols-1 md:grid-cols-5 items-end">
              <div>
                <label className="">{t('propertyType')}</label>
                <div className="relative">
                  <select
                    name="transaction"
                    value={form.transaction}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md bg-black text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
                    aria-label="Vrsta nekretnine"
                  >
                    <option className="bg-black text-white" value="prodaja">{t('sale')}</option>
                    <option className="bg-black text-white" value="izdavanje">{t('rentOption')}</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400">▾</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="">{t('propertyType')}</label>
                <div className="relative">
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md bg-black text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
                    aria-label="Tip nekretnine"
                  >
                    <option className="bg-black text-white" value="stan">{t('apartment')}</option>
                    <option className="bg-black text-white" value="kuca">{t('house')}</option>
                    <option className="bg-black text-white" value="poslovni">{t('office')}</option>
                    <option className="bg-black text-white" value="parcela">{t('parcele')}</option>
                    <option className="bg-black text-white" value="objekat-odmor">{t('obejakatOdmor')}</option>
                    <option className="bg-black text-white" value="garaza">{t('garaza')}</option>
                    <option className="bg-black text-white" value="soba">{t('sobe')}</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400">▾</span>
                </div>
              </div>

              <div>
                <label className="">{t('cene')}</label>
                <div className="relative">
                  <select
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md bg-black text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
                    aria-label="Cena"
                  >
                    <option className="bg-black text-white" value="all">{t('sveCene')}</option>
                    <option className="bg-black text-white" value="0-50000">Do 50.000$</option>
                    <option className="bg-black text-white" value="50000-100000">50.000$ - 100.000$</option>
                    <option className="bg-black text-white" value="100000-200000">100.000$ - 200.000$</option>
                    <option className="bg-black text-white" value="200000-300000">200.000$ - 300.000$</option>
                    <option className="bg-black text-white" value="300000+">Preko 300.000$</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400">▾</span>
                </div>
              </div>

              <div>
                <label className="">{t('povrsina')}</label>
                <div className="relative">
                  <select
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md bg-black text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
                    aria-label="Površina"
                  >
                    <option className="bg-black text-white" value="all">{t('svePovrsine')}</option>
                    <option className="bg-black text-white" value="<=70">Do 70 m²</option>
                    <option className="bg-black text-white" value="<=100">Do 100 m²</option>
                    <option className="bg-black text-white" value="100-200">100 - 200 m²</option>
                    <option className="bg-black text-white" value=">200">Preko 200 m²</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400">▾</span>
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="sr-only">Lokacija</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  type="text"
                  placeholder="Unesi lokaciju (grad, kvart...)"
                  className="w-full px-3 py-2 rounded-md bg-transparent border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  aria-label="Lokacija"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
                  aria-label="Pretrazi nekretnine"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
                  </svg>
                  Pretraga
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Sekcija sa top ponudama (biće ispod hero i iznad Footera) */}
      <div className="relative z-10">
        <TopPonudePage />
      </div>
      <div className="relative z-10">
        <UslugePage />
      </div>
      <div className="relative z-10">
        <PonudeNudimo />
      </div>
       <div className="relative z-10">
        <ONama />
      </div>
    </div>
  )
}

export default HomePage
