import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import { FaBed, FaBath, FaArrowLeft } from 'react-icons/fa'
import { t } from '../i1n8'

/*
  SinglePage looks up the item in both Prodaja (sales) and Izdavanje (rentals)
  mock arrays so it will find items coming from either page.
*/

const PROD_LISTINGS = [
  {
    id: 1,
    title: 'Luksuzan porodični stan, Telep',
    price: '145.000 €',
    location: 'Novi Sad, Telep',
    size: 115,
    rooms: 3,
    baths: 2,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Prostran i luksuzno opremljen stan u mirnom delu Telepa. Idealno za porodičan život.',
  },
  {
    id: 2,
    title: 'Moderan penthouse sa terasom',
    price: '299.000 €',
    location: 'Beograd, Vračar',
    size: 180,
    rooms: 4,
    baths: 3,
    image: 'https://images.unsplash.com/photo-1572120360610-d971b9b1a6d6?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Ekskluzivan penthouse sa velikom terasom i pogledom na grad.',
  },
  {
    id: 3,
    title: 'Kuća sa baštom i garažom',
    price: '210.000 €',
    location: 'Novi Sad, Sremska Kamenica',
    size: 220,
    rooms: 5,
    baths: 2,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Prostrana porodična kuća sa uređenom baštom i garažom.',
  },
]

const RENTAL_LISTINGS = [
  {
    id: 1,
    title: 'Moderan stan u centru, Beograd',
    price: '450 €/mesec',
    location: 'Beograd, Vračol',
    size: 75,
    rooms: 2,
    baths: 1,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Lepa lokacija, blizu svih sadržaja.',
  },
]

export default function SinglePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const findById = (list, idNum) => list.find((it) => it.id === idNum)

  const idNum = Number(id)
  const property =
    findById(RENTAL_LISTINGS, idNum) || findById(PROD_LISTINGS, idNum)

  if (!property) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-yellow-400 mb-4">
            {t('noResults')}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-yellow-400 text-black rounded"
          >
            {t('backToSearch')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6 mt-10">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-yellow-400 mb-6 hover:text-yellow-300"
        >
          <FaArrowLeft /> {t('backToSearch')}
        </button>

        {/* Image */}
        <div className="rounded-xl overflow-hidden border border-yellow-600/20 shadow-xl">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-[420px] object-cover"
          />
        </div>

        {/* Content */}
        <div className="mt-8 bg-gradient-to-br from-gray-900 to-black border border-yellow-600/10 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-extrabold text-yellow-400">
              {property.title}
            </h1>
            <div className="text-2xl font-bold text-white">
              {property.price}
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-300 mt-3">
            <MdLocationOn className="text-yellow-400" />
            {property.location}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 text-sm text-gray-300">
            <div className="bg-black/40 p-3 rounded border border-yellow-600/10">
              <FaBed className="text-yellow-400 mb-1" />
              {property.rooms} {t('rooms')}
            </div>
            <div className="bg-black/40 p-3 rounded border border-yellow-600/10">
              <FaBath className="text-yellow-400 mb-1" />
              {property.baths} {t('baths')}
            </div>
            <div className="bg-black/40 p-3 rounded border border-yellow-600/10">
              {property.size} m²
            </div>
          </div>

          <p className="mt-6 text-gray-300 leading-relaxed">
            {property.description}
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href={`mailto:serbesnekretnine@gmail.com?subject=${encodeURIComponent(
                `${t('mailSubjectPrefix')} ${property.title}`
              )}`}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-md font-semibold shadow hover:from-yellow-500 hover:to-yellow-600 transition"
            >
              {t('contactBtn')}
            </a>

            <a
              href="tel:+38163238564"
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-md font-semibold shadow hover:from-yellow-500 hover:to-yellow-600 transition"
            >
              {t('cta')}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
