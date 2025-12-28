import React, { useEffect, useState } from 'react'
import { t } from '../i1n8'

const properties = [
  {
    id: 1,
    title: 'Luksuzna vila na Fruškoj gori',
    price: '1.200.000 €',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    location: 'Fruška gora',
  },
  {
    id: 2,
    title: 'Penthouse u centru Novog Sada',
    price: '850.000 €',
    image: 'https://images.unsplash.com/photo-1502673530728-f79b4cab31b1',
    location: 'Novi Sad',
  },
  {
    id: 3,
    title: 'Ekskluzivna vila sa bazenom',
    price: '1.500.000 €',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227',
    location: 'Dedinje',
  },
]

function TopPonudePage() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % properties.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const prev = () =>
    setIndex((index - 1 + properties.length) % properties.length)

  const next = () =>
    setIndex((index + 1) % properties.length)

  return (
    <section className="lg:mt-0 py-10 md:py-14 bg-gradient-to-b from-black via-gray-900 to-white">
      <div className="lg:mt-0 mx-auto px-4">

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-yellow-500 mb-12">
          {t('topPonude')}
        </h2>

        {/* Slider */}
        <div className="relative overflow-hidden">

          {/* Slides */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {properties.map((item) => (
              <div
                key={item.id}
                className="min-w-full h-95 flex justify-center"
              >
                <div className="bg-black/80 backdrop-blur-md border-2 border-yellow-500 rounded-2xl shadow-xl max-w-xl w-full overflow-hidden">

                  {/* Image */}
                  <div className="h-64 md:h-52 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">
                      {item.title}
                    </h3>

                    <p className="text-gray-300 mb-3">
                      {item.location}
                    </p>

                    <p className="text-yellow-400 text-xl font-semibold">
                      {item.price}
                    </p>

                    <button className="mt-5 px-6 py-2 rounded-md bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition">
                      Pogledaj detalje
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-yellow-400 p-3 rounded-full hover:bg-black"
          >
            ‹
          </button>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-yellow-400 p-3 rounded-full hover:bg-black"
          >
            ›
          </button>
        </div>
      </div>
    </section>

  )
}

export default TopPonudePage
