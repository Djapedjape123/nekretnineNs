import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async' // <--- NOVI IMPORT
import backgroundImage from '../assets/probaB.webp'
import { t } from '../i1n8'
import TopPonudePage from './TopPonudePage'
import UslugePage from './UslugePage'
import PonudeNudimo2 from './PonudeNudimo2'
import PonudeNudimo from './PonudeNudimo'
import ONama from './Onama'

function HomePage() {
  const navigate = useNavigate()

  // State za otvaranje/zatvaranje pretrage na mobilnom
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const [form, setForm] = useState({
    transaction: 'Prodaja',
    type: 'Stan',
    priceFrom: '',
    priceTo: '',
    brojsoba: 'all',
    kvart: 'all',
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
      {/* --- SEO START --- */}
      <Helmet>
        <title>Serbes Nekretnine | Prodaja i Izdavanje Stanova Novi Sad</title>
        <meta 
          name="description" 
          content="Pronađite idealan stan, kuću ili poslovni prostor u Novom Sadu. Najbolja ponuda nekretnina za prodaju i izdavanje. Sigurna kupovina uz Serbes Nekretnine." 
        />
        <meta name="keywords" content="nekretnine novi sad, prodaja stanova, izdavanje stanova, stanovi novi sad, kuce novi sad, agencija za nekretnine" />
        
        {/* Open Graph / Facebook / Viber */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Serbes Nekretnine | Vaš partner za nekretnine" />
        <meta property="og:description" content="Velika ponuda stanova i kuća u Novom Sadu. Pogledajte našu ponudu." />
        <meta property="og:image" content="https://serbesnekretnine.rs/serbes.jpg" /> {/* ZAMENI SA PRAVIM URL-OM KAD DEPLOJUJES */}
        <meta property="og:url" content="https://serbesnekretnine.rs/" />

        {/* Strukturirani podaci (Schema.org) za Google */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": "Serbes Nekretnine",
            "image": "https://serbesnekretnine.rs/serbes.jpg",
            "description": "Agencija za posredovanje u prometu nekretnina u Novom Sadu.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Novi Sad",
              "addressRegion": "Vojvodina",
              "addressCountry": "RS"
            },
            "priceRange": "$$"
          })}
        </script>
      </Helmet>
      {/* --- SEO END --- */}

      {/* HERO SECTION */}
      <section
        className="relative min-h-screen flex flex-col"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* HERO CONTENT */}
        <div className="relative z-10 flex-1 flex flex-col mt-14 text-white px-4 pt-6">
          
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-md">
              {t('heroTitle')}
            </h1>

            <p className="mt-4 text-xl md:text-xl text-white font-bold max-w-2xl">
              {t('heroSubtitle')}
            </p>

            {/* --- NOVO: DUGME KOJE SE VIDI SAMO NA MOBILNOM (md:hidden) --- */}
            {/* Ako forma NIJE otvorena, prikazi dugme */}
            {!mobileSearchOpen && (
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="mt-8 md:hidden px-8 py-4 bg-yellow-500 text-black text-lg font-bold rounded-full shadow-[0_0_20px_rgba(234,179,8,0.6)] animate-bounce"
              >
                🔍 {t("pretrazi") || "Pretraži nekretnine"}
              </button>
            )}
          </div>

          {/* SEARCH FORM CARD */}
          {/* LOGIKA PRIKAZIVANJA:
               - Na mobilnom: Ako je mobileSearchOpen true -> 'block', inace 'hidden'
               - Na desktopu (md): Uvek 'md:block' (ponistava hidden)
          */}
          <form
            onSubmit={handleSubmit}
            className={`
              relative w-full max-w-7xl mx-auto mt-auto mb-0 p-4 md:p-6 rounded-xl 
              bg-black/80 backdrop-blur-md border border-yellow-500 shadow-lg 
              transition-all duration-300 ease-in-out
              ${mobileSearchOpen ? 'block' : 'hidden'} md:block
            `}
          >
            
            {/* --- NOVO: Dugme za zatvaranje forme (samo na mobilnom) --- */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white md:hidden p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-12 items-end">

              {/* 1. Transaction (Širina: 2/12) */}
              <div className="lg:col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-200">
                  {t("vrstaPunude")}
                </label>
                <div className="relative">
                  <select
                    name="transaction"
                    value={form.transaction}
                    onChange={handleChange}
                    className="w-full px-3 py-3 rounded-md bg-black text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
                  >
                    <option className="bg-black text-white" value="Prodaja">
                      {t("sales")}
                    </option>
                    <option className="bg-black text-white" value="Izdavanje">
                      {t("rent")}
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
                    <option className="bg-black text-white" value="Stan">
                      {t("stanovi")}
                    </option>
                    <option className="bg-black text-white" value="Kuća">
                      {t("kuce")}
                    </option>
                    <option className="bg-black text-white" value="Poslovni prostor">
                      {t("poslovniProstor")}
                    </option>
                    <option className="bg-black text-white" value="Parcela">
                      {t("parcele")}
                    </option>
                    <option className="bg-black text-white" value="Lokal">
                      {t("Lokal")}
                    </option>
                    <option className="bg-black text-white" value="Ugostiteljski objekat">
                      {t("ugostiteljski")}
                    </option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400">
                    ▾
                  </span>
                </div>
              </div>

              {/* 3. Broj soba (Širina: 2/12) */}
              <div className="lg:col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-200">
                  {t("brojSoba")}
                </label>
                <div className="relative">
                  <select
                    name="brojsoba"
                    value={form.brojsoba}
                    onChange={handleChange}
                    className="w-full px-3 py-3 rounded-md bg-black text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
                  >
                    <option className="bg-black text-white" value="all">
                      {t("Sve")}
                    </option>
                    <option className="bg-black text-white" value="0.5">
                      {t('garsonjera')}
                    </option>
                    <option className="bg-black text-white" value="1">
                      {t('jednosoban')}
                    </option>
                    <option className="bg-black text-white" value="1.5">
                      {t('jednoiposoban')}
                    </option>
                    <option className="bg-black text-white" value="2">
                      {t('dvosoban')}
                    </option>
                    <option className="bg-black text-white" value="2.5">
                      {t('dvoiposoban')}
                    </option>
                    <option className="bg-black text-white" value="3">
                      {t('trosoban')}
                    </option>
                    <option className="bg-black text-white" value="3.5">
                      {t('trosiposoban')}
                    </option>
                    <option className="bg-black text-white" value="4">
                      {t('cetvorosoban')}
                    </option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400">
                    ▾
                  </span>
                </div>
              </div>

              {/* 4. Sekcija za Kvart */}
              <div className="lg:col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-200">
                  {t('location')}
                </label>
                <div className="relative">
                  <select
                    name="kvart"
                    value={form.kvart}
                    onChange={handleChange}
                    className="w-full px-3 py-3 rounded-md bg-black text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
                  >
                    <option className="bg-black text-white" value="all">Sve</option>
                    <option className="bg-black text-white" value="Grbavica">Grbavica</option>
                    <option className="bg-black text-white" value="Sajmiste">Sajmiste</option>
                    <option className="bg-black text-white" value="Adice">Adice</option>
                    <option className="bg-black text-white" value="Telep">Telep</option>
                    <option className="bg-black text-white" value="Novo naselje">Novo naselje</option>
                    <option className="bg-black text-white" value="Liman I">Liman 1</option>
                    <option className="bg-black text-white" value="Liman II">Liman 2</option>
                    <option className="bg-black text-white" value="Liman III">Liman 3</option>
                    <option className="bg-black text-white" value="Liman IV">Liman 4</option>
                    <option className="bg-black text-white" value="Detelinara">Detelinara</option>
                    <option className="bg-black text-white" value="Nova detelinara">Nova detelinara</option>
                    <option className="bg-black text-white" value="Centar">Centar</option>
                    <option className="bg-black text-white" value="Podbara">Podbara</option>
                    <option className="bg-black text-white" value="Salajka">Salajka</option>
                    <option className="bg-black text-white" value="Rotkvarija">Rotkvarija</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400">
                    ▾
                  </span>
                </div>
              </div>

              {/* 5. Price From */}
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

              {/* 6. Price To */}
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

              {/* Dugme: Detaljnija pretraga */}
              <div className="md:col-span-2 lg:col-span-2 lg:col-start-9">
                <Link
                  to="/searchmore"
                  className="w-full h-[46px] flex items-center justify-center px-4 py-2 rounded-md bg-gray-800 text-yellow-500 border border-gray-600 hover:bg-gray-700 hover:border-yellow-500 transition font-medium"
                >
                  {t("deteljnaPPredraga")}
                </Link>
              </div>

              {/* 7. Submit Button */}
              <div className="md:col-span-2 lg:col-span-2">
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
                  {t("pretrazi") || "Pretraga"}
                </button>
              </div>

            </div>
          </form>

        </div>
      </section>

      {/* OSTALE SEKCIJE */}
      <div className="relative z-10">
        <TopPonudePage />
      </div>
      <div className="relative z-10">
        <UslugePage/>
      </div>
      <div className="relative z-10">
        <PonudeNudimo/>
      </div>
      <div className="relative z-10">
        <PonudeNudimo2/>
      </div>
      <div className="relative z-10">
        <ONama />
      </div>
    </div>
  )
}

export default HomePage