const express = require("express");
const cors = require("cors");
const xml2js = require("xml2js");
const fs = require("fs");

const parser = new xml2js.Parser();

fs.readFile("oglasi.xml", (err, data) => {
  parser.parseString(data, (err, result) => {
    oglasi = result.OGLASI.oglas;
    console.log("JEDAN OGLAS:", JSON.stringify(oglasi[0], null, 2));
  });
});

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
app.get("/oglasi/search", (req, res) => {
  console.log("QUERY:", req.query);
  const {
    transaction,  // vrstaponude
    type,         // vrstanekretnine
    brojsoba,     // broj soba
    kvart,        // naselje
    priceFrom,
    priceTo
  } = req.query;

  const results = oglasi.filter(o => {
    // UVEK UZIMAMO PRVI ELEMENT IZ NIZA
    const vrstePonude = (o.vrstaponude?.[0] || "").toLowerCase();
    const vrsteNekretnine = (o.vrstanekretnine?.[0] || "").toLowerCase();
    const brojSoba = String(o.brojsoba?.[0] || "").toLowerCase();
    const naselje = (o.naselje?.[0] || "").toLowerCase();
    const cena = Number(o.cena?.[0] || 0);

    if (transaction && transaction !== "" &&
        vrstePonude !== transaction.toLowerCase()) return false;

    if (type && type !== "" &&
        vrsteNekretnine !== type.toLowerCase()) return false;

    if (brojsoba && brojsoba !== "all" &&
        brojSoba !== brojsoba.toLowerCase()) return false;

    if (kvart && kvart !== "" &&
        !naselje.includes(kvart.toLowerCase())) return false;

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

