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
            className="w-full max-w-7xl mx-auto mt-auto mb-0 p-4 md:p-6 rounded-xl bg-black/50 backdrop-blur-md border border-yellow-500 shadow-lg"
          >
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-12 items-end">

              {/* 1. Transaction (Širina: 2/12) */}
              <div className="lg:col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-200">
                  {t("propertyType")}
                </label>
                <div className="relative">
                  <select
                    name="transaction"
                    value={form.transaction}
                    onChange={handleChange}
                    className="w-full px-3 py-3 rounded-md bg-black text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
                  >
                    <option className="bg-black text-white" value="prodaja">
                      {t("sale")}
                    </option>
                    <option className="bg-black text-white" value="izdavanje">
                      {t("rentOption")}
                    </option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400">
                    ▾
                  </span>
                </div>
              </div>

              {/* 2. Type (Širina: 2/12) */}
              <div className="lg:col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-200">
                  {t("propertyType")}
                </label>
                <div className="relative">
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full px-3 py-3 rounded-md bg-black text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
                  >
                    <option className="bg-black text-white" value="stan">
                      {t("apartment")}
                    </option>
                    <option className="bg-black text-white" value="kuca">
                      {t("house")}
                    </option>
                    <option className="bg-black text-white" value="poslovni">
                      {t("office")}
                    </option>
                    <option className="bg-black text-white" value="parcela">
                      {t("parcele")}
                    </option>
                    <option className="bg-black text-white" value="objekat-odmor">
                      {t("obejakatOdmor")}
                    </option>
                    <option className="bg-black text-white" value="garaza">
                      {t("garaza")}
                    </option>
                    <option className="bg-black text-white" value="soba">
                      {t("sobe")}
                    </option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400">
                    ▾
                  </span>
                </div>
              </div>

              {/* 3. Area / Površina (Širina: 2/12) */}
              <div className="lg:col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-200">
                  {t("povrsina")}
                </label>
                <div className="relative">
                  <select
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    className="w-full px-3 py-3 rounded-md bg-black text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
                  >
                    <option className="bg-black text-white" value="all">
                      {t("svePovrsine")}
                    </option>
                    <option className="bg-black text-white" value="garsonjera">
                      Garsonjera
                    </option>
                    <option className="bg-black text-white" value="jednosoban">
                      Jednosoban
                    </option>
                    <option className="bg-black text-white" value="dvosoban">
                      Dvosoban
                    </option>
                    <option className="bg-black text-white" value="trosoban">
                      Trosoban
                    </option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400">
                    ▾
                  </span>
                </div>
              </div>
              <div className="lg:col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-200">
                  Kvart
                </label>
                <div className="relative">
                  <select
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    className="w-full px-3 py-3 rounded-md bg-black text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
                  >
                    <option className="bg-black text-white" value="all">
                      Svi kvartovi
                    </option>
                    <option className="bg-black text-white" value="grbavica">
                      Grbavica
                    </option>
                    <option className="bg-black text-white" value="sajmiste">
                      Sajmiste
                    </option>
                    <option className="bg-black text-white" value="liman">
                      Liman
                    </option>
                    <option className="bg-black text-white" value="adice">
                      Adice
                    </option>
                    <option className="bg-black text-white" value="telep">
                      Telep
                    </option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400">
                    ▾
                  </span>
                </div>
              </div>

              {/* 4. Price From (Širina: 2/12) */}
              <div className="lg:col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-200">
                  {t("cenaOd")}
                </label>
                <input
                  type="number"
                  name="priceFrom"
                  placeholder="€ min"
                  value={form.priceFrom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md bg-black text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
                  min={0}
                  step={1000}
                />
              </div>

              {/* 5. Price To (Širina: 2/12) */}
              <div className="lg:col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-200">
                  {t("cenaDo")}
                </label>
                <input
                  type="number"
                  name="priceTo"
                  placeholder="€ max"
                  value={form.priceTo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md bg-black text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
                  min={0}
                  step={1000}
                />
              </div>

              {/* 6. Submit Button (Širina: 2/12) */}
              <div className="md:col-span-2 lg:col-span-2 ">
                <button
                  type="submit"
                  className="w-full h-[46px] flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
                    />
                  </svg>
                  {t("pretraga") || "Pretraga"}
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
