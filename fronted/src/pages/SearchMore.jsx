import React, { useState } from 'react';

function SearchMore() {
    const [form, setForm] = useState({
        vrstaponude: 'Prodaja', 
        vrstanekretnine: 'Stan', 
        grad: 'NOVI SAD',
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-yellow-500 border lg:mt-10 text-white p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto bg-black backdrop-blur-xl border border-yellow-600/30 p-6 md:p-10 rounded-2xl shadow-2xl">

                <h2 className="text-2xl font-bold mt-10 mb-8 text-yellow-500 border-b border-yellow-600/20 pb-4">
                    Detaljna Pretraga Nekretnina
                </h2>

                <form className="space-y-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">Vrsta ponude</label>
                            <select name="vrstaponude" value={form.vrstaponude} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none transition">
                                <option value="Prodaja">Prodaju</option>
                                <option value="Izdavanje">Izdavanje</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">Tip nekretnine</label>
                            <select name="vrstanekretnine" value={form.vrstanekretnine} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none transition">
                                <option value="Stan">Stan</option>
                                <option value="Kuca">Kuća</option>
                                <option value="Poslovni prostor">Poslovni prostor</option>
                                <option value="Zemljiste">Zemljište</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">Grad</label>
                            <select name="grad" value={form.grad} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none transition">
                                <option value="NOVI SAD">Novi Sad</option>
                                <option value="BEOGRAD">Beograd</option>
                                <option value="PETROVARADIN">Petrovaradin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">Naselje</label>
                            <select name="naselje" value={form.naselje} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none transition">
                                <option value="all">Sva naselja</option>
                                <option value="Bulevar Evrope">Bulevar Evrope</option>
                                <option value="Bulevar Oslobodjenja">Bulevar Oslobođenja</option>
                                <option value="Centar">Centar</option>
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
                                    <option value="0">PR</option>
                                    <option value="1">1</option>
                                </select>
                                <select name="sprat_do" onChange={handleChange} className="w-1/2 bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none">
                                    <option value="">do</option>
                                    <option value="8">8</option>
                                    <option value="20">20+</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-400">Broj soba</label>
                            <div className="flex gap-2">
                                <select name="brojsoba_od" onChange={handleChange} className="w-1/2 bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none">
                                    <option value="">od</option>
                                    <option value="1.0">1.0</option>
                                    <option value="3.0">3.0</option>
                                </select>
                                <select name="brojsoba_do" onChange={handleChange} className="w-1/2 bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none">
                                    <option value="">do</option>
                                    <option value="5.0">5.0+</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">Vrsta grejanja</label>
                            <select name="vrstagrejanja" onChange={handleChange} className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus:border-yellow-500 outline-none">
                                <option value="all">Sva grejanja</option>
                                <option value="toplotne pumpe">Toplotne pumpe</option>
                                <option value="cg">Centralno</option>
                                <option value="gas">Gas</option>
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
                            <span className="text-sm text-gray-500 pl-2">Pretraga po ID-u:</span>
                            <input
                                type="text"
                                name="id"
                                placeholder="#0000"
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