import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

function SearchPage() {
  const location = useLocation()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  // Convert URL params to object
  const params = new URLSearchParams(location.search)
  const query = Object.fromEntries(params.entries())

  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true)

        // Send parameters to backend — adjust URL if needed
        const res = await fetch("http://localhost:5000/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(query),
        })

        const data = await res.json()
        setResults(data)
      } catch (err) {
        console.error("Error loading search results:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [location.search])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Rezultati pretrage</h1>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="h-12 w-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* No Results */}
      {!loading && results.length === 0 && (
        <div className="text-center py-20 text-gray-400 text-xl">
          Nema pronađenih oglasa za zadate filtere.
        </div>
      )}

      {/* Results List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading &&
          results.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-4"
            >
              <img
                src={item.slika}
                alt="Nekretnina"
                className="rounded-lg w-full h-56 object-cover mb-4"
              />

              <h2 className="text-xl font-semibold mb-2">
                {item.tipNekretnine} – {item.lokacija}
              </h2>

              <p className="text-gray-600">
                <strong>Cena:</strong> {item.cena} €
              </p>
              <p className="text-gray-600">
                <strong>Površina:</strong> {item.povrsina} m²
              </p>
              <p className="text-gray-600">
                <strong>Sobnost:</strong> {item.sobe}
              </p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default SearchPage

