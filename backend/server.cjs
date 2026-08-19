const express = require("express");
const cors = require("cors");
const xml2js = require("xml2js");
const fs = require("fs");
const path = require("path");

// processing helper that reads the FTP zip, converts to JSON etc.
const { processOglasi } = require("./processOglasi.cjs");

// run once on startup, then schedule every 10 minutes (600 000 ms).
// this keeps oglasi.json up to date without external cron tools.
processOglasi();
setInterval(processOglasi, 10 * 60 * 1000); // 10 minutes






const parser = new xml2js.Parser();

const xmlPath = path.join(__dirname, "oglasi.xml");
if (fs.existsSync(xmlPath)) {
  fs.readFile(xmlPath, (err, data) => {
    if (err) {
      console.warn("Nije moguće pročitati oglasi.xml:", err.message);
      return;
    }

    parser.parseString(data, (parseErr, result) => {
      if (parseErr) {
        console.warn("Nije moguće parsirati oglasi.xml:", parseErr.message);
        return;
      }

      if (result && result.OGLASI) {
        oglasi = result.OGLASI.oglas;
      }
    });
  });
} else {
  console.log("oglasi.xml ne postoji; koristim oglasi.json kao izvor podataka.");
}




const app = express();
app.set('trust proxy', true);
app.use(cors());

const getPublicBaseUrl = (req) => {
  const envUrl = (process.env.PUBLIC_SITE_URL || process.env.SITE_URL || '').replace(/\/$/, '');
  if (envUrl) return envUrl;

  const forwardedProto = req.headers['x-forwarded-proto'];
  const forwardedHost = req.headers['x-forwarded-host'];
  const protocol = forwardedProto ? String(forwardedProto).split(',')[0] : req.protocol;
  const host = forwardedHost ? String(forwardedHost).split(',')[0] : req.get('host');

  return `${protocol}://${host}`;
};

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const getListingPreviewHtml = (oglas, req) => {
  const title = oglas?.naslov || oglas?.title || 'Nekretnina';
  const image = (() => {
    const img = oglas?.slike?.slika?.[0]?.url || oglas?.image || oglas?.images?.[0] || '';
    return img || 'https://serbesnekretnine.com/serbes.jpg';
  })();

  const description = [
    oglas?.vrstaponude,
    oglas?.vrstanekretnine,
    [oglas?.mesto, oglas?.naselje, oglas?.grad].filter(Boolean).join(', '),
    oglas?.kvadratura_int ? `${oglas.kvadratura_int} m²` : '',
    oglas?.cena ? `${oglas.cena} €` : ''
  ].filter(Boolean).join(' • ');

  const requestUrl = `${getPublicBaseUrl(req)}${req.originalUrl}`;

  return `<!doctype html>
<html lang="sr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(image)}" />
    <meta property="og:url" content="${escapeHtml(requestUrl)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <link rel="canonical" href="${escapeHtml(requestUrl)}" />
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: #0a0a0a;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
      }
      .card {
        width: min(92vw, 700px);
        background: #121212;
        border: 1px solid rgba(251,191,36,0.25);
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 20px 50px rgba(0,0,0,0.45);
      }
      .card img {
        display: block;
        width: 100%;
        height: 360px;
        object-fit: cover;
        background: #1a1a1a;
      }
      .content {
        padding: 20px 22px 24px;
      }
      h1 {
        margin: 0 0 10px;
        font-size: clamp(1.5rem, 2vw, 2.4rem);
        color: #fbbf24;
      }
      p {
        margin: 0;
        color: #d1d5db;
        line-height: 1.5;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" />
      <div class="content">
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(description)}</p>
      </div>
    </div>
  </body>
</html>`;
};

const getOglasi = (callback) => {
  fs.readFile("oglasi.json", "utf8", (err, data) => {
    if (err) return callback(err, null);
    try {
      callback(null, JSON.parse(data));
    } catch (e) {
      callback(e, null);
    }
  });
};

// ================== FILTER ==================
app.get("/oglasi/search", (req, res) => {
  console.log("QUERY:", req.query);
  
  const {
    transaction,  // vrstaponude
    type,         // vrstanekretnine
    city,         // grad
    district,     // naselje
    price_min,
    price_max,
    area_min,
    area_max,
    brojsoba_od,
    brojsoba_do,
    vrstagrejanja, 
    heating,       
    lift,
    terasa,
    namesten,
    parking
  } = req.query;

  // Određujemo šta je zapravo traženo grejanje (bilo da stigne kao 'heating' ili 'vrstagrejanja')
  const trazenoGrejanje = heating || vrstagrejanja;

  getOglasi((err, oglasi) => {
    if (err) {
      return res.status(500).json({ error: "Greška pri čitanju fajla" });
    }

    const results = oglasi.filter(o => {
      // Priprema podataka iz baze/fajla (sve u mala slova)
      const ponuda = (o.vrstaponude || "").toLowerCase();
      const tip = (o.vrstanekretnine || "").toLowerCase();
      const g = (o.mesto || "").toLowerCase();
      const n = (o.naselje || "").toLowerCase();
      // Ovde čitamo grejanje iz oglasa (može biti pod ključem 'vrstagrejanja' ili 'grejanje')
      const grejanjeOglasa = (o.vrstagrejanja || o.grejanje || "").toLowerCase();

      const cena = Number(o.cena || 0);
      const kvadrat = Number(o.kvadratura_int || 0);
      const sobe = Number(o.brojsoba || 0);

      // --- FILTRIRANJE ---

      if (transaction && !ponuda.includes(transaction.toLowerCase())) return false;
      if (type && !tip.includes(type.toLowerCase())) return false;
      if (city && !g.includes(city.toLowerCase())) return false;
      if (district && district !== "all" && !n.includes(district.toLowerCase())) return false;

      if (price_min && cena < Number(price_min)) return false;
      if (price_max && cena > Number(price_max)) return false;

      if (area_min && kvadrat < Number(area_min)) return false;
      if (area_max && kvadrat > Number(area_max)) return false;

      if (brojsoba_od && sobe < Number(brojsoba_od)) return false;
      if (brojsoba_do && sobe > Number(brojsoba_do)) return false;

      
      if (trazenoGrejanje && trazenoGrejanje !== "all") {
          // Koristimo includes umesto strogog poređenja da bi 'gas' našlo i 'Gas' i 'prirodni gas'
          if (!grejanjeOglasa.includes(trazenoGrejanje.toLowerCase())) {
              return false;
          }
      }
      

      if (lift === "1" && !hasAttrib(o, "lift")) return false;
      if (terasa === "1" && !hasAttrib(o, "terasa")) return false;
      if (namesten === "1" && !hasAttrib(o, "namešten")) return false;
      if (parking === "1" && !hasAttrib(o, "parking")) return false;

      return true;
    });

    res.json(results);
  });
});

// ================== PRODAJA ==================
app.get("/oglasi/prodaja", (req, res) => {
  const requestedType = req.query.type?.toLowerCase();

  getOglasi((err, oglasi) => {
    if (err) {
      return res.status(500).json({ error: "Greška pri čitanju fajla" });
    }

    let rezultati = oglasi.filter(
      oglas => oglas.vrstaponude?.toLowerCase() === "prodaja"
    );

    if (requestedType) {
      rezultati = rezultati.filter(oglas =>
        oglas.vrstanekretnine?.toLowerCase().includes(requestedType)
      );
    }

    res.json(rezultati);
  });
});

// ================== IZDAVANJE ==================
app.get("/oglasi/izdavanje", (req, res) => {
  const requestedType = req.query.type?.toLowerCase();

  getOglasi((err, oglasi) => {
    if (err) {
      return res.status(500).json({ error: "Greška pri čitanju fajla" });
    }

    let rezultati = oglasi.filter(
      oglas => oglas.vrstaponude?.toLowerCase() === "izdavanje"
    );

    if (requestedType) {
      rezultati = rezultati.filter(oglas =>
        oglas.vrstanekretnine?.toLowerCase().includes(requestedType)
      );
    }

    res.json(rezultati);
  });
});

// ================== PREVIEW HTML ZA SHARE / OGROMNE META TAGOVE ==================
app.get(['/single/:id', '/oglas/:id'], (req, res) => {
  const { id } = req.params;

  getOglasi((err, oglasi) => {
    if (err) {
      return res.status(500).send('Greška pri učitavanju podataka.');
    }

    const oglas = Array.isArray(oglasi)
      ? oglasi.find(item => String(item.id ?? item.code ?? '') === String(id))
      : null;

    if (!oglas) {
      return res.status(404).send('<!doctype html><html><head><title>Nekretnina nije pronađena</title></head><body><h1>Nekretnina nije pronađena.</h1></body></html>');
    }

    res.type('html').send(getListingPreviewHtml(oglas, req));
  });
});

 app.get("/oglasi/topponude", (req, res) => {
  const requested = Math.max(1, parseInt(req.query.count, 10) || 5);
  const count = Math.min(requested, 5); // limit 5

  getOglasi((err, oglasi) => {
    if (err) {
      return res.status(500).json({ error: "Greška pri čitanju fajla" });
    }

    if (!Array.isArray(oglasi) || oglasi.length === 0) {
      return res.json([]);
    }

    // Parsiraj numerički deo cene (uklanja tačke, zareze, razmake, € itd.)
    const parsePrice = (o) => {
      const raw = (o.cena ?? o.price ?? "").toString();
      const digitsOnly = raw.replace(/[^0-9]/g, "");
      return digitsOnly === "" ? 0 : parseInt(digitsOnly, 10);
    };

    const formatPrice = (num) => {
      try {
        return new Intl.NumberFormat('de-DE').format(num) + ' €';
      } catch {
        return String(num) + ' €';
      }
    };

    // Filtriraj oglase čiji naslov počinje sa "Lux" (naslov ili title), case-insensitive
    const filtered = oglasi.filter(o => {
      const title = (o.naslov ?? o.title ?? '').toString();
      return /^Lux/i.test(title);
    });

    if (!filtered.length) return res.json([]);

    // Sortiraj po ceni (opadajuće) i uzmi do 'count' elemenata
    const top = filtered
      .map(o => ({ ...o, _priceNum: parsePrice(o) }))
      .sort((a, b) => b._priceNum - a._priceNum)
      .slice(0, count)
      .map(o => ({
        id: o.id ?? String(o.code ?? Date.now()),
        title: o.naslov ?? o.title ?? '',
        priceRaw: o._priceNum,
        price: formatPrice(o._priceNum),
        image: (o.slike && o.slike.slika && o.slike.slika[0] && o.slike.slika[0].url) ? o.slike.slika[0].url : (o.image || ''),
        location: [o.mesto, o.naselje, o.grad].filter(Boolean).join(', ') || (o.location || '')
      }));

    res.json(top);
  });
});

// ================== SINGLE OGLAS ==================
app.get('/oglasi/:id', (req, res) => {
  const { id } = req.params;

  getOglasi((err, oglasi) => {
    if (err) return res.status(500).json({ error: 'Greška pri čitanju podataka.' });

    // tražimo po id || code (relaksirano)
    const nekretnina = oglasi.find(item => String(item.id ?? item.code ?? '') === String(id));

    if (!nekretnina) return res.status(404).json({ error: 'Nekretnina nije pronađena.' });

    res.json(nekretnina);
  });
});

// ================== UČITAVANJE IZ XML-a ==================
async function loadXML() {
  const xml = fs.readFileSync("./oglasi.xml", "utf8");
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
      if (err) reject(err);
      else resolve(result.oglasi.oglas || []);
    });
  });
}

// Pomoćna funkcija za proveru atributa
const hasAttrib = (o, needle) => {
  if (!o.attribs || !Array.isArray(o.attribs.attrib)) return false;

  return o.attribs.attrib.some(a =>
    a.value === "da" &&
    a.name.toLowerCase().includes(needle.toLowerCase())
  );
};


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server pokrenut na http://localhost:${PORT}`);
});







