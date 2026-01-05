const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

app.get("/oglasi", (req, res) => {
  fs.readFile("oglasi.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Greška pri čitanju JSON fajla" });
    }
    res.json(JSON.parse(data));
  });
});

//probno dizanje servera
app.listen(3001, () => {
  console.log("Server radi na http://localhost:3001");
});
