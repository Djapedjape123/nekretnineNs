const fs = require("fs");
const xml2js = require("xml2js");

const parser = new xml2js.Parser({
  explicitArray: false,
  mergeAttrs: true,
  trim: true,
  normalizeTags: true
});

fs.readFile("oglasi.xml", "utf8", (err, xmlData) => {
  if (err) {
    console.error("Greška pri čitanju fajla:", err);
    return;
  }

  parser.parseString(xmlData, (err, result) => {
    if (err) {
      console.error("Greška u XML parsiranju:", err);
      return;
    }

    const oglasi = result.oglasi.oglas;
    const jsonFile = "oglasi.json";

    fs.writeFile(jsonFile, JSON.stringify(oglasi, null, 2), (err) => {
      if (err) {
        console.error("Greška pri snimanju JSON fajla:", err);
        return;
      }
      console.log(`Uspešno konvertovano u ${jsonFile}`);
    });
  });
});
