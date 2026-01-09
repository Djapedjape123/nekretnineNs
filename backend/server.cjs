const express = require("express");
const cors = require("cors");
const xml2js = require("xml2js");
const fs = require("fs");

const parser = new xml2js.Parser();

fs.readFile("oglasi.xml", (err, data) => {
  parser.parseString(data, (err, result) => {
    oglasi = result.OGLASI.oglas;
    // console.log("JEDAN OGLAS:", JSON.stringify(oglasi[0], null, 2));
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
    lift,
    terasa,
    namesten,
    parking
  } = req.query;

  getOglasi((err, oglasi) => {
    if (err) {
      return res.status(500).json({ error: "Greška pri čitanju fajla" });
    }

    const results = oglasi.filter(o => {
      const ponuda = (o.vrstaponude || "").toLowerCase();
      const tip = (o.vrstanekretnine || "").toLowerCase();
      const g = (o.mesto || "").toLowerCase();
      const n = (o.naselje || "").toLowerCase();
      const grejanje = (o.vrstagrejanja || "").toLowerCase();

      const cena = Number(o.cena || 0);
      const kvadrat = Number(o.kvadratura_int || 0);
      const sobe = Number(o.brojsoba || 0);

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

      if (vrstagrejanja && vrstagrejanja !== "all" &&
          grejanje !== vrstagrejanja.toLowerCase()) return false;

      /*if (lift === "1" && !hasAttrib(o, "lift")) return false;
      if (terasa === "1" && !hasAttrib(o, "terasa")) return false;
      if (namesten === "1" && !hasAttrib(o, "namešten")) return false;
      if (parking === "1" && !hasAttrib(o, "parking")) return false;*/

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

