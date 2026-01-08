const express = require("express");
const cors = require("cors");
const fs = require("fs");
const xml2js = require("xml2js");

const app = express();
app.use(cors());

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

// ================== TOP PONUDE (bilo koje N oglasa, default 3) ==================
// ================== TOP PONUDE (N najskupljih, default 3) ==================
app.get("/oglasi/topponude", (req, res) => {
  const count = Math.max(1, parseInt(req.query.count, 10) || 3);

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
      const digitsOnly = raw.replace(/[^0-9]/g, ""); // npr. "1.200.000" -> "1200000"
      return digitsOnly === "" ? 0 : parseInt(digitsOnly, 10);
    };

    const formatPrice = (num) => {
      try {
        return new Intl.NumberFormat('de-DE').format(num) + ' €';
      } catch {
        return String(num) + ' €';
      }
    };

    // Dodaj privremeno _priceNum, sortiraj opadajuće i uzmi prvih N
    const top = oglasi
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

// ================== FILTER ==================
app.get("/oglasi/filter", (req, res) => {
  const {
    transaction,
    type,
    area,
    location,
    priceFrom,
    priceTo
  } = req.query;

  const results = oglasi.filter(o => {
    const lokacija = (o.lokacija || "").toLowerCase();
    const vrsta = (o.vrstanekretnine || "").toLowerCase();
    const trans = (o.vrstaponude || "").toLowerCase();
    const sobe = (o.sobnost || "").toLowerCase();
    const cena = Number(o.cena || 0);

    if (transaction && trans !== transaction.toLowerCase()) return false;

    if (type && vrsta !== type.toLowerCase()) return false;

    if (area && area !== "all" && sobe !== area.toLowerCase()) return false;

    if (location && !lokacija.includes(location.toLowerCase())) return false;

    if (priceFrom && cena < Number(priceFrom)) return false;

    if (priceTo && cena > Number(priceTo)) return false;

    return true;
  });

  res.json(results);
});





const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server pokrenut na http://localhost:${PORT}`);
});
