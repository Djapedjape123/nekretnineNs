import React, { useEffect, useRef, useState } from 'react'
import { FaHandshake , FaClock, FaGraduationCap, FaEye } from 'react-icons/fa'
import { MdAccountCircle } from "react-icons/md";
import { t } from '../i1n8'

const services = [
  {
    icon: <FaHandshake />,
    titleKey: 'services.items.0.title',
    descKey: 'services.items.0.desc',
  },
  {
     icon: <FaGraduationCap />,
    
    titleKey: 'services.items.1.title',
    descKey: 'services.items.1.desc',
  },
  {
    icon: <MdAccountCircle />,
    titleKey: 'services.items.2.title',
    descKey: 'services.items.2.desc',
  },
  {
    icon: <FaEye />,
    titleKey: 'services.items.3.title',
    descKey: 'services.items.3.desc',
  },
]

function UslugePage() {
  const refs = useRef([])
  const [visible, setVisible] = useState([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((v) => [...v, parseInt(entry.target.dataset.index)])
          }
        });
      },
      { threshold: 0.2 }
    )

    refs.current.forEach((ref) => ref && observer.observe(ref))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative py-24 bg-gradient-to-b from-gray-50 to-yellow-50/30 overflow-hidden">
      {/* Dekorativna pozadina */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4">
            {t('services.heading')}
          </h2>
          <div className="w-24 h-1.5 bg-yellow-400 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              ref={(el) => (refs.current[index] = el)}
              data-index={index}
              className={`group relative bg-white p-8 rounded-[2rem] border border-gray-300 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 ease-out ${
                visible.includes(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Ikona u krugu koji prati temu teksta */}
              <div className="mb-6 relative">
                <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-500 group-hover:bg-yellow-400 group-hover:text-white transition-colors duration-500 shadow-inner">
                  {React.cloneElement(service.icon, { size: 32 })}
                </div>
                {/* Mali dekorativni krug iza ikone */}
                <div className="absolute -z-10 top-2 -left-2 w-16 h-16 bg-yellow-100 rounded-2xl group-hover:rotate-12 transition-transform duration-500"></div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-yellow-600 transition-colors">
                {t(service.titleKey)}
              </h3>
              
              <p className="text-gray-600 leading-relaxed text-sm">
                {t(service.descKey)}
              </p>

              {/* Suptilna linija na dnu kartice koja se širi na hover */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-yellow-400 group-hover:w-1/2 transition-all duration-500 rounded-t-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UslugePage