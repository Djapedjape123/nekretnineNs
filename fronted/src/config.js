// ...existing code...
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001'
// ...existing code...

// app.get("/oglasi/topponude", (req, res) => {
//   const requested = Math.max(1, parseInt(req.query.count, 10) || 5);
//   const count = Math.min(requested, 5); // limit 5

//   getOglasi((err, oglasi) => {
//     if (err) {
//       return res.status(500).json({ error: "Greška pri čitanju fajla" });
//     }

//     if (!Array.isArray(oglasi) || oglasi.length === 0) {
//       return res.json([]);
//     }

//     // Parsiraj numerički deo cene (uklanja tačke, zareze, razmake, € itd.)
//     const parsePrice = (o) => {
//       const raw = (o.cena ?? o.price ?? "").toString();
//       const digitsOnly = raw.replace(/[^0-9]/g, "");
//       return digitsOnly === "" ? 0 : parseInt(digitsOnly, 10);
//     };

//     const formatPrice = (num) => {
//       try {
//         return new Intl.NumberFormat('de-DE').format(num) + ' €';
//       } catch {
//         return String(num) + ' €';
//       }
//     };

//     // Filtriraj oglase čiji naslov počinje sa "Lux" (naslov ili title), case-insensitive
//     const filtered = oglasi.filter(o => {
//       const title = (o.naslov ?? o.title ?? '').toString();
//       return /^Lux/i.test(title);
//     });

//     if (!filtered.length) return res.json([]);

//     // Sortiraj po ceni (opadajuće) i uzmi do 'count' elemenata
//     const top = filtered
//       .map(o => ({ ...o, _priceNum: parsePrice(o) }))
//       .sort((a, b) => b._priceNum - a._priceNum)
//       .slice(0, count)
//       .map(o => ({
//         id: o.id ?? String(o.code ?? Date.now()),
//         title: o.naslov ?? o.title ?? '',
//         priceRaw: o._priceNum,
//         price: formatPrice(o._priceNum),
//         image: (o.slike && o.slike.slika && o.slike.slika[0] && o.slike.slika[0].url) ? o.slike.slika[0].url : (o.image || ''),
//         location: [o.mesto, o.naselje, o.grad].filter(Boolean).join(', ') || (o.location || '')
//       }));

//     res.json(top);
//   });
// });