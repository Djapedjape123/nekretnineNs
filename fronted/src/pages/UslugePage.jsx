import React, { useEffect, useRef, useState } from 'react'
import { FaDollarSign, FaClock, FaGraduationCap, FaEye } from 'react-icons/fa'
import { t } from '../i1n8'

const services = [
  {
    icon: <FaDollarSign size={40} className="text-yellow-500 mb-4" />,
    titleKey: 'services.items.0.title',
    descKey: 'services.items.0.desc',
    from: 'left'
  },
  {
    icon: <FaClock size={40} className="text-yellow-500 mb-4" />,
    titleKey: 'services.items.1.title',
    descKey: 'services.items.1.desc',
    from: 'right'
  },
  {
    icon: <FaGraduationCap size={40} className="text-yellow-500 mb-4" />,
    titleKey: 'services.items.2.title',
    descKey: 'services.items.2.desc',
    from: 'left'
  },
  {
    icon: <FaEye size={40} className="text-yellow-500 mb-4" />,
    titleKey: 'services.items.3.title',
    descKey: 'services.items.3.desc',
    from: 'right'
  },
]

function UslugePage() {
  const refs = useRef([])
  const [visible, setVisible] = useState([])

  useEffect(() => {
    refs.current = refs.current.slice(0, services.length)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((v) => [...v, parseInt(entry.target.dataset.index)])
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.3 }
    )

    refs.current.forEach((ref) => ref && observer.observe(ref))
  }, [])

  return (
    <section className="bg-gradient-to-b from-white to-yellow-100 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-yellow-400 mb-12">
          {t('services.heading')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              ref={(el) => (refs.current[index] = el)}
              data-index={index}
              className={`flex flex-col items-center text-center p-6
                transition-all duration-700 ease-out font-serif
                ${
                  visible.includes(index)
                    ? 'opacity-100 translate-x-0'
                    : service.from === 'left'
                    ? '-translate-x-20 opacity-0'
                    : 'translate-x-20 opacity-0'
                }`}
            >
              {service.icon}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t(service.titleKey)}
              </h3>
              <p className="text-gray-600">{t(service.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UslugePage
