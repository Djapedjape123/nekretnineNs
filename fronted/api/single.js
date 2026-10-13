// Vercel funkcija: za /single/:id vraća index.html sa pravim og tagovima oglasa.
// WhatsApp/Viber/Facebook vide sliku oglasa, a posetioci normalno dobijaju React sajt.

const API = 'https://api.serbesnekretnine.com'
const SITE = 'https://www.serbesnekretnine.com'
const LOGO = `${SITE}/serbes.jpg`

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : [])

// prva prava slika oglasa (preskače safeporter default.jpg)
const getImage = (oglas) => {
  const url = toArray(oglas?.slike?.slika)
    .map(s => s?.url)
    .find(u => u && !/default\.jpg$/i.test(u))
  return url || LOGO
}

// zameni content="..." u <meta property="og:..."> ili <meta name="twitter:...">
const setMeta = (html, attr, key, value) => {
  const re = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`, 'i')
  return re.test(html)
    ? html.replace(re, `$1${escapeHtml(value)}$2`)
    : html.replace('</head>', `  <meta ${attr}="${key}" content="${escapeHtml(value)}" />\n</head>`)
}

export default async function handler(req, res) {
  const id = String(req.query.id || '').replace(/[^0-9A-Za-z_-]/g, '')

  // 1) uzmi index.html iz istog Vercel deploy-a
  let html
  try {
    const r = await fetch(`${SITE}/index.html`)
    html = await r.text()
  } catch {
    res.status(502).send('Greška pri učitavanju stranice.')
    return
  }

  // 2) uzmi oglas sa backenda; ako ne uspe, vrati običan index.html (logo)
  try {
    const r = await fetch(`${API}/oglasi/${encodeURIComponent(id)}`)
    if (r.ok) {
      const oglas = await r.json()

      const title = oglas.naslov || 'Serbes Nekretnine'
      const description = [
        oglas.vrstaponude,
        oglas.vrstanekretnine,
        [oglas.mesto, oglas.naselje].filter(Boolean).join(', '),
        oglas.kvadratura_int ? `${oglas.kvadratura_int} m²` : '',
        oglas.cena ? `${oglas.cena} €` : ''
      ].filter(Boolean).join(' • ')
      const image = getImage(oglas)
      const url = `${SITE}/single/${id}`

      html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`)
      html = setMeta(html, 'name', 'description', description)
      html = setMeta(html, 'property', 'og:type', 'article')
      html = setMeta(html, 'property', 'og:title', title)
      html = setMeta(html, 'property', 'og:description', description)
      html = setMeta(html, 'property', 'og:image', image)
      html = setMeta(html, 'property', 'og:url', url)
      html = setMeta(html, 'name', 'twitter:title', title)
      html = setMeta(html, 'name', 'twitter:description', description)
      html = setMeta(html, 'name', 'twitter:image', image)
    }
  } catch {
    // API ne radi → ostaje originalni index.html sa logom
  }

  // Vercel čuva odgovor 10 min, pa backend ne dobija zahtev za svaku posetu
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400')
  res.status(200).send(html)
}