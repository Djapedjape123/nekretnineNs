const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
const xml2js = require("xml2js");

const FTP_ZIP = "/ftp/xml/oglasi.zip";
const TEMP_XML = path.join(__dirname, "temp", "oglasi.xml");
const JSON_PATH = path.join(__dirname, "oglasi.json");
const BACKUP_ZIP = path.join(__dirname, "backup", "last-good.zip");

const parser = new xml2js.Parser({
  explicitArray: false,
  mergeAttrs: true,
  trim: true,
  normalizeTags: true
});

async function processOglasi() {
  try {
    if (!fs.existsSync(FTP_ZIP)) {
      console.log(" ZIP još ne postoji");
      return;
    }

    // unzip
    await fs.createReadStream(FTP_ZIP)
      .pipe(unzipper.Extract({ path: path.dirname(TEMP_XML) }))
      .promise();

    // XML → JSON
    const xmlData = fs.readFileSync(TEMP_XML, "utf8");
    const parsed = await parser.parseStringPromise(xmlData);

    if (!parsed?.oglasi?.oglas) {
      throw new Error("Nevalidan XML (nema <oglas>)");
    }

    const oglasi = parsed.oglasi.oglas;

    // Sačuvaj JSON
    fs.writeFileSync(JSON_PATH, JSON.stringify(oglasi, null, 2));

    // backup ZIP 
    fs.copyFileSync(FTP_ZIP, BACKUP_ZIP);

    console.log("Oglasi uspešno ažurirani");

  } catch (err) {
    console.error("Greška:", err.message);
    console.log(" Zadržavam stari oglasi.json");
  }
}

processOglasi();
