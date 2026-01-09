import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchMore() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        vrstaponude: 'Prodaja', 
        vrstanekretnine: 'Stan', 
        grad: 'Novi Sad',
        naselje: 'all',
        cena_od: '',
        cena_do: '',
        kvadratura_od: '',
        kvadratura_do: '',
        sprat_od: '',
        sprat_do: '',
        brojsoba_od: '',
        brojsoba_do: '',
        vrstagrejanja: 'all',
        id: '', // Pretraga po ID-u
        attribs: {
            lift: false,
            terasa: false,
            namesten: false,
            parking: false,
        }
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setForm(prev => ({
                ...prev,
                attribs: { ...prev.attribs, [name]: checked }
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleReset = () => {
        window.location.reload();
    };

    const handleSearchById = () => {
        if (!form.id) return;

        const cleanId = form.id.replace('#', '').trim();

        navigate(`/single/${cleanId}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // ⛔ sprečava reload

        const params = new URLSearchParams();

        // osnovni filteri
        if (form.vrstaponude) params.append('transaction', form.vrstaponude.toLowerCase());
        if (form.vrstanekretnine) params.append('type', form.vrstanekretnine.toLowerCase());
        if (form.grad) params.append('city', form.grad);
        if (form.naselje && form.naselje !== 'all') params.append('district', form.naselje);

        // rasponi
        if (form.cena_od) params.append('price_min', form.cena_od);
        if (form.cena_do) params.append('price_max', form.cena_do);
        if (form.kvadratura_od) params.append('area_min', form.kvadratura_od);
        if (form.kvadratura_do) params.append('area_max', form.kvadratura_do);

        // atributi
        Object.entries(form.attribs).forEach(([key, value]) => {
            if (value) params.append(key, '1');
        });

        navigate(`/search?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-yellow-500 border lg:mt-10 text-white p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto bg-black backdrop-blur-xl border border-yellow-600/30 p-6 md:p-10 rounded-2xl shadow-2xl">

                <h2 className="text-2xl font-bold mt-10 mb-8 text-yellow-500 border-b border-yellow-600/20 pb-4">
                    Detaljna Pretraga Nekretnina
                </h2>

                <form className="space-y-8" onSubmit={handleSubmit}>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">Vrsta ponude</label>
                            <select name="vrstaponude" value={form.vrstaponude} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none transition">
                                <option value="Prodaja">Prodaja</option>
                                <option value="Izdavanje">Izdavanje</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">Tip nekretnine</label>
                            <select name="vrstanekretnine" value={form.vrstanekretnine} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none transition">
                                <option value="Stan">Stan</option>
                                <option value="Kuca">Kuća</option>
                                <option value="Poslovni prostor">Poslovni prostor</option>
                                <option value="Parcela">Parcela</option>
                                <option value="Lokal">Lokal</option>
                                <option value="Ugostiteljski">Ugostiteljski</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">Grad</label>
                            <select name="grad" value={form.grad} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none transition">
                                <option value="Novi Sad">Novi Sad</option>
                                <option value="Petrovaradin">Petrovaradin</option>
                                <option value="Sremski Karlovci">Sremski Karlovci</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">Naselje</label>
                            <select name="naselje" value={form.naselje} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none transition">
                                <option value="all">Sva naselja</option>
                                <option value="Bulevar Evrope">Bulevar Evrope</option>
                                <option value="Bulevar Oslobodjenja">Bulevar Oslobođenja</option>
                                <option value="Centar">Centar</option>
                                <option value="Detelinara">Detelinara</option>
                                <option value="Grbavica">Grbavica</option>
                                <option value="Liman1">Liman 1</option>
                                <option value="Liman2">Liman 2</option>
                                <option value="Liman3">Liman 3</option>
                                <option value="Liman4">Liman 4</option>
                                <option value="Novo Naselje">Novo Naselje</option>
                                <option value="Podbara">Podbara</option>
                                <option value="Salajka">Salajka</option>
                                <option value="Telep">Telep</option>
                                <option value="Adice">Adice</option>
                                <option value="Veternik">Veternik</option>
                                <option value="Kamenjar">Kamenjar</option>
                                <option value="Satelit">Satelit</option>
                                <option value="Rumenka">Rumenka</option>
                                <option value="Futog">Futog</option>
                                <option value="Sremska Kamenica">Sremska Kamenica</option>
                                <option value="Stari grad">Stari grad</option>
                                <option value="Banatić">Banatić</option>
                                <option value="Rotkvarija">Rotkvarija</option>
                            </select>
                        </div>
                    </div>

                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-400">Cena (€)</label>
                            <div className="flex gap-2">
                                <input type="number" name="cena_od" placeholder="od" onChange={handleChange} className="w-1/2 bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none" />
                                <input type="number" name="cena_do" placeholder="do" onChange={handleChange} className="w-1/2 bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-400">Kvadratura (m²)</label>
                            <div className="flex gap-2">
                                <input type="number" name="kvadratura_od" placeholder="od" onChange={handleChange} className="w-1/2 bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none" />
                                <input type="number" name="kvadratura_do" placeholder="do" onChange={handleChange} className="w-1/2 bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-400">Sprat</label>
                            <div className="flex gap-2">
                                <select name="sprat_od" onChange={handleChange} className="w-1/2 bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none">
                                    <option value="">od</option>
                                    <option value="Suteren">Suteren</option>
                                    <option value="0">Prizemlje</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                                <select name="sprat_do" onChange={handleChange} className="w-1/2 bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none">
                                    <option value="">do</option>
                                    <option value="Suteren">Suteren</option>
                                    <option value="0">Prizemlje</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-400">Broj soba</label>
                            <div className="flex gap-2">
                                <select name="brojsoba_od" onChange={handleChange} className="w-1/2 bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none">
                                    <option value="">od</option>
                                    <option value="1.0">1.0</option>
                                    <option value="1.5">1.5</option>
                                    <option value="2.0">2.0</option>
                                    <option value="2.5">2.5</option>
                                    <option value="3.0">3.0</option>
                                    <option value="3.5">3.5</option>
                                    <option value="4.0">4.0</option>
                                    <option value="4.5">4.5</option>
                                    <option value="5.0">5.0</option>
                                </select>
                                <select name="brojsoba_do" onChange={handleChange} className="w-1/2 bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none">
                                    <option value="">do</option>
                                    <option value="1.0">1.0</option>
                                    <option value="1.5">1.5</option>
                                    <option value="2.0">2.0</option>
                                    <option value="2.5">2.5</option>
                                    <option value="3.0">3.0</option>
                                    <option value="3.5">3.5</option>
                                    <option value="4.0">4.0</option>
                                    <option value="4.5">4.5</option>
                                    <option value="5.0">5.0</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">Vrsta grejanja</label>
                            <select name="vrstagrejanja" onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none">
                                <option value="all">Sve vrste grejanja</option>
                                <option value="cg">Centralno grejanje</option>
                                <option value="toplotne pumpe">Toplotne pumpe</option>
                                <option value="podno">Podno grejanje</option>
                                <option value="struja">Grejanje na struju</option>
                                <option value="gas">Gasno grejanje</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 flex flex-wrap gap-6 py-4">
                            {['Lift', 'Terasa', 'Namesten', 'Parking'].map((feature) => (
                                <label key={feature} className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name={feature.toLowerCase()}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-gray-800 bg-[#1a1a1a] text-yellow-500 focus:ring-yellow-500 focus:ring-offset-black"
                                    />
                                    <span className="text-gray-300 group-hover:text-yellow-500 transition">{feature}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    
                    <div className="pt-8 border-t border-yellow-600/20 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex gap-4 w-full md:w-auto">
                            <button type="submit" className="flex-1 md:flex-none px-10 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition shadow-lg shadow-yellow-500/20">
                                PRETRAŽI
                            </button>
                            <button type="button" onClick={handleReset} className="flex-1 md:flex-none px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition">
                                ✕ PONIŠTI FILTER
                            </button>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto bg-[#1a1a1a] p-2 rounded-lg border border-gray-800">

                            <button
                                type="button"
                                onClick={handleSearchById}
                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-md transition"
                            >
                                Pretraga po ID-u:
                            </button>

                        

                            <input
                                type="text"
                                name="id"
                                placeholder="#0000"
                                value={form.id}
                                onChange={handleChange}
                                className="bg-black border border-gray-800 rounded md:w-32 p-2 text-yellow-500 focus:border-yellow-500 outline-none"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SearchMore;

