const fs = require("fs");
const xml2js = require("xml2js");

const parser = new xml2js.Parser({
  explicitArray: false, // liste gde je samo jedan element postaju objekti
  mergeAttrs: true,     // atributi ulaze direktno u objekat
  trim: true,
  normalizeTags: true
});

// 1) Učitaj XML fajl
fs.readFile("oglasi.xml", "utf8", (err, xmlData) => {
  if (err) {
    console.error("Greška pri čitanju fajla:", err);
    return;
  }

  // 2) Pretvori XML u JS objekat
  parser.parseString(xmlData, (err, result) => {
    if (err) {
      console.error("Greška pri parsiranju XML-a:", err);
      return;
    }

    // 3) Pristup korenu
    const root = result.oglasi;

    console.log("📌 Poslednja izmena:", root.last_modify);
    console.log("📌 Naziv agencije:", root.agency.agency_name);
    console.log("--------------------------------------------");

    // 4) Lista oglasa
    const oglasi = root.oglas;

    // Ako je samo jedan oglas, pretvori u niz
    const oglasiArray = Array.isArray(oglasi) ? oglasi : [oglasi];

    oglasiArray.forEach((oglas) => {
      console.log("🏠 Oglas:", oglas.naslov);
      console.log("   ID:", oglas.id);
      console.log("   Kvadratura:", oglas.kvadratura);
      console.log("   Cena:", oglas.cena);
      console.log("   Naselje:", oglas.naselje);
      console.log("   Grad:", oglas.grad);

      // --- SLIKE ---
      if (oglas.slike && oglas.slike.slika) {
        const slike = Array.isArray(oglas.slike.slika)
          ? oglas.slike.slika
          : [oglas.slike.slika];

        console.log("   📸 Slike (ukupno):", slike.length);
        slike.forEach((sl, i) =>
          console.log(`      [${i + 1}] ${sl.url}`)
        );
      }

      // --- ATRIBUTI ---
      if (oglas.attribs && oglas.attribs.attrib) {
        const atributi = Array.isArray(oglas.attribs.attrib)
          ? oglas.attribs.attrib
          : [oglas.attribs.attrib];

        console.log("   🔧 Atributi:");
        atributi.forEach((at) =>
          console.log(`      ${at.name}: ${at.value}`)
        );
      }

      console.log("--------------------------------------------");
    });
  });
});
