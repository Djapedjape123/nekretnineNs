import React from 'react'
import backgroundImage from '../assets/pozadina.jpg'
import SearchPage from './SearchPega'
import { t } from '../i1n8'


function HomePage() {
  return (
    <div className="">

      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* HERO CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          {t('heroTitle')}
        </h1>

        <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl">
          {t('heroSubtitle')}
        </p>
       
      </div>

      {/* SEARCH */}
      <div className="relative z-10">
        <SearchPage />
      </div>
    </div>
  )
}

export default HomePage
