
import { Outlet } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import Footer from './components/Footer'


function App() {
  

  return (
    <>
      <NavBar />
      <Outlet/>
      <Footer />
    </>
  )
}

export default App


function normalize(x) {
  if (!x) return "";
  return String(x).trim().toLowerCase();
}

function num(x) {
  if (x === null || x === undefined || x === "") return NaN;
  const n = Number(String(x).replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}


function applyFilters(oglasi, filters) {
  const wantPonuda = normalize(filters.ponuda);
  const wantVrsta  = normalize(filters.vrsta);
  const wantSobe   = normalize(filters.sobe);

  const minCena = filters.cenaOd !== "" ? Number(filters.cenaOd) : null;
  const maxCena = filters.cenaDo !== "" ? Number(filters.cenaDo) : null;

  return oglasi.filter((o) => {
    const oPonuda = normalize(o.vrstaponude);
    const oVrsta  = normalize(o.vrstanekretnine);
    const oSobe   = normalize(o.sobe);           // iz XML JSON-a
    const oCena   = num(o.cena);

    // filtriranje ponude
    if (wantPonuda !== "sve" && wantPonuda !== "" && oPonuda !== wantPonuda) {
      return false;
    }

    // filtriranje vrste nekretnine
    if (wantVrsta !== "sve" && wantVrsta !== "" && oVrsta !== wantVrsta) {
      return false;
    }

    // filtriranje broja soba
    if (wantSobe !== "sve" && wantSobe !== "") {
      if (oSobe !== wantSobe) return false;
    }

    // filtriranje cene (min)
    if (minCena !== null && !Number.isNaN(oCena) && oCena < minCena) {
      return false;
    }

    // filtriranje cene (max)
    if (maxCena !== null && !Number.isNaN(oCena) && oCena > maxCena) {
      return false;
    }

    return true;
  });
}
