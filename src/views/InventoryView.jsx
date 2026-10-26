import React from 'react';
import { Boxes, Plus } from 'lucide-react';

export default function InventoryView({
  inventorySubTab,
  setInventorySubTab,
  inventoryMadefront,
  inventoryBodega,
  setActiveTab
}) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Control de Stock e Inventarios</h2>
          <p className="text-slate-400 text-xs mt-1 font-medium">Gestión separada por ubicación física y lectura RFID.</p>
        </div>
        <button onClick={() => setActiveTab('add-product')} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all">
          <Plus className="w-4 h-4" /> Registrar Nuevo Producto
        </button>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setInventorySubTab('madefront')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${inventorySubTab === 'madefront' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-[#1E293B] text-slate-300'}`}>Madefront Ferretería</button>
        <button onClick={() => setInventorySubTab('bodega')} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${inventorySubTab === 'bodega' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-[#1E293B] text-slate-300'}`}>Bodega Principal</button>
      </div>

      <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase bg-slate-900/30">
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Código RFID (EPC)</th>
              <th className="py-3 px-4">Producto</th>
              <th className="py-3 px-4 text-center">Stock</th>
              <th className="py-3 px-4">Ubicación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
            {(inventorySubTab === 'madefront' ? inventoryMadefront : inventoryBodega).map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{item.id}</td>
                <td className="py-3.5 px-4 font-mono text-slate-400">{item.epc}</td>
                <td className="py-3.5 px-4 font-semibold text-white">{item.name}</td>
                <td className="py-3.5 px-4 text-center font-bold text-white">{item.stock}</td>
                <td className="py-3.5 px-4 text-slate-400">{item.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}