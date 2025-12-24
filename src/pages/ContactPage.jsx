import React, { useState, useEffect } from 'react'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'
import { t } from '../i1n8'


export default function ContactPage() {

    // helper: ako t(key) vrati sam ključ, vrati fallback (srpski tekst)
    const tt = (key, fallback) => {
        try {
            const val = t(key)
            return val === key ? fallback : val
        } catch {
            return fallback
        }
    }

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [message, setMessage] = useState('')
    const [errors, setErrors] = useState({})

    // Animacija ulaska
    const [animateLeft, setAnimateLeft] = useState(false)
    const [animateRight, setAnimateRight] = useState(false)

    useEffect(() => {
        setAnimateLeft(true)
        setAnimateRight(true)
    }, [])

    const validate = () => {
        const e = {}
        if (!name.trim()) e.name = tt('errName', 'Unesite ime')
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) e.email = tt('errEmail', 'Unesite ispravan email')
        if (!message.trim()) e.message = tt('errMessage', 'Unesite poruku')
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = (ev) => {
        ev.preventDefault()
        if (!validate()) return
        const subject = `${tt('mailSubjectPrefix', 'Poruka sa sajta —')} ${name}`
        const body = `Ime: ${name}%0D%0AEmail: ${email}%0D%0ATelefon: ${phone}%0D%0A%0D%0APoruka:%0D%0A${encodeURIComponent(
            message
        )}`
        window.location.href = `mailto:serbesnekretnine@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`
    }

    return (
        <div className="w-screen min-h-screen bg-black text-white py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

                {/* LEVI BLOK - info */}
                <div
                    className={`flex flex-col justify-center gap-6 transform transition duration-6000 ease-out ${
                        animateLeft ? 'translate-x-0 opacity-100' : '-translate-x-60 opacity-0'
                    }`}
                >
                    <div className="rounded-xl p-8 bg-gradient-to-br from-black/60 to-white/2 backdrop-blur-sm border border-yellow-600/20 shadow-xl">
                        <h1 className="text-4xl font-extrabold text-yellow-400 mb-4">{tt('contactTitle', 'Kontakt')}</h1>
                        <p className="text-gray-300 leading-relaxed">
                            {tt(
                                'contactDescription',
                                'Na našem sajtu nalazi se veliki broj nekretnina različitih tipova (stambene nekretnine, poslovne nekretnine, zemljišta...). Na raspolaganju smo Vam za bilo koji oblik saradnje, bez obzira da li ste vlasnik ili tražite da kupite ili iznajmite nekretninu.'
                            )}
                        </p>

                        <div className="mt-6 grid grid-cols-1 gap-3">
                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <MdEmail color='purple' className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                                <div>
                                    <div className="text-sm text-gray-400">{tt('emailLabel', 'Email')}</div>
                                    <a href="mailto:serbesnekretnine@gmail.com" className="text-yellow-400 font-medium">
                                        serbesnekretnine@gmail.com
                                    </a>
                                </div>
                            </div>

                            {/* Telefon */}
                            <div className="flex items-start gap-4">
                                <MdPhone color='blue' className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                                <div>
                                    <div className="text-sm text-gray-400">{tt('phoneLabel', 'Telefon')}</div>
                                    <a href="tel:+38163238564" className="text-yellow-400 font-medium">063 238 564</a>
                                </div>
                            </div>

                            {/* Kancelarija */}
                            <div className="flex items-start  gap-4">
                                <MdLocationOn color='red' className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                                <div>
                                    <div className="text-sm text-gray-400">{tt('officeLabel', 'Kancelarija')}</div>
                                    <div className="text-yellow-400 font-medium">
                                        <a
                                            className="text-blue-500"
                                            href="https://www.google.com/maps/place/%D0%8B%D0%B8%D1%80%D0%BF%D0%B0%D0%BD%D0%BE%D0%B2%D0%B0+37,+%D0%9D%D0%BE%D0%B2%D0%B8+%D0%A1%D0%B0%D0%B4/@45.252208,19.8133722,15z/data=!3m1!4b1!4m6!3m5!1s0x475b10472636dfaf:0x589d543769325f63!8m2!3d45.2521944!4d19.8318262!16s%2Fg%2F11c87_943b?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {tt('officeAddress', 'Ćirpanova 37, 21000, Novi Sad (Južna Bačka)')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DESNI BLOK - form */}
                <div
                    className={`flex items-center mt-5 transform transition duration-1000 ${
                        animateRight ? 'translate-x-0 opacity-100' : 'translate-x-60 opacity-0'
                    }`}
                >
                    <div className="w-full bg-gradient-to-br from-[#0b0b0b]/80 to-[#111111]/60 rounded-xl p-6 shadow-2xl border border-yellow-600/20">
                        <h2 className="text-2xl font-bold text-yellow-400 mb-4">{tt('sendInquiryTitle', 'Pošaljite upit')}</h2>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                            <div>
                                <label className="text-sm text-gray-300">{tt('nameLabel', 'Ime')}</label>
                                <input
                                    className="mt-1 w-full p-3 rounded-md bg-black/60 border border-yellow-600/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={tt('namePlaceholder', 'Vaše ime')}
                                    aria-label={tt('nameLabel', 'Ime')}
                                />
                                {errors.name && <div className="text-xs text-red-400 mt-1">{errors.name}</div>}
                            </div>

                            <div>
                                <label className="text-sm text-gray-300">{tt('emailLabel', 'Email')}</label>
                                <input
                                    type="email"
                                    className="mt-1 w-full p-3 rounded-md bg-black/60 border border-yellow-600/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={tt('emailPlaceholder', 'vaš@email.com')}
                                    aria-label={tt('emailLabel', 'Email')}
                                />
                                {errors.email && <div className="text-xs text-red-400 mt-1">{errors.email}</div>}
                            </div>

                            <div>
                                <label className="text-sm text-gray-300">{tt('phoneLabel', 'Telefon (opciono)')}</label>
                                <input
                                    className="mt-1 w-full p-3 rounded-md bg-black/60 border border-yellow-600/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder={tt('phonePlaceholder', 'Broj telefona')}
                                    aria-label={tt('phoneLabel', 'Telefon')}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-300">{tt('messageLabel', 'Poruka')}</label>
                                <textarea
                                    className="mt-1 w-full p-3 rounded-md bg-black/60 border border-yellow-600/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows="6"
                                    placeholder={tt('messagePlaceholder', 'Vaša poruka...')}
                                    aria-label={tt('messageLabel', 'Poruka')}
                                />
                                {errors.message && <div className="text-xs text-red-400 mt-1">{errors.message}</div>}
                            </div>

                            <div className="flex items-center gap-3 mt-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-3 rounded-md shadow-md hover:from-yellow-500 hover:to-yellow-600 transition"
                                >
                                    {tt('sendButton', 'Pošalji poruku')}
                                </button>

                                <a
                                    href="mailto:serbesnekretnine@gmail.com"
                                    className="inline-flex items-center gap-2 px-4 py-3 border border-yellow-600 rounded-md text-yellow-400 hover:bg-yellow-600/10 transition"
                                >
                                    {tt('writeDirect', 'Pišite direktno')}
                                </a>
                            </div>

                            <p className="text-xs text-gray-400 mt-3">
                                {tt(
                                    'replyNote',
                                    'Odgovorićemo u najkraćem roku. Ako želite, možete nas kontaktirati i preko telefona.'
                                )}
                            </p>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    )
}
