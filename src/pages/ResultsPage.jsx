import React from 'react'
import { useLocation } from 'react-router-dom'
import NavBar from '../components/NavBar'

export default function ResultsPage() {
  const { state } = useLocation()
  const properties = state?.properties || []

  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-gray-900 p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Rezultati pretrage</h1>
        
        {properties.length === 0 ? (
          <p className="text-gray-400">Nema pronađenih nekretnina.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <div key={prop.id} className="bg-black border border-yellow-600/20 rounded-lg overflow-hidden hover:shadow-lg transition">
                <img src={prop.image} alt={prop.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-bold text-yellow-400">{prop.title}</h2>
                  <p className="text-gray-400">{prop.location}</p>
                  <p className="text-2xl font-bold text-yellow-500 mt-2">{prop.price}€</p>
                  <p className="text-gray-300 text-sm mt-2">{prop.description}</p>
                  <button className="mt-4 w-full bg-yellow-500 text-black py-2 rounded font-semibold hover:bg-yellow-600 transition">
                    Više informacija
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}