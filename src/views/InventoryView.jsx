import React, { useState } from 'react';
import { Boxes, Plus, Search, Filter, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function InventoryView({
  inventorySubTab,
  setInventorySubTab,
  inventoryMadefront,
  inventoryBodega,
  setActiveTab,
  showNotification
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const currentList = inventorySubTab === 'madefront' ? inventoryMadefront : inventoryBodega;

  // Filtrar por búsqueda y categoría
  const filteredList = currentList.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.epc.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Cabecera y Botón de Nuevo Producto */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Control de Stock e Inventarios Inteligentes</h2>
          <p className="text-slate-400 text-xs mt-1 font-medium">Gestión avanzada por ubicación física y lectura masiva de chips EPC RFID.</p>
        </div>
        <button 
          onClick={() => setActiveTab('add-product')} 
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-lg transition-all uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" /> Registrar Nuevo Producto
        </button>
      </div>

      {/* Pestañas de Almacén y Barra de Filtros */}
      <div className="bg-[#1E293B] border border-slate-700/60 p-4 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => setInventorySubTab('madefront')} 
              className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${inventorySubTab === 'madefront' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-[#0F172A] text-slate-300 border border-slate-800'}`}
            >
              🏪 Madefront Ferretería ({inventoryMadefront.length})
            </button>
            <button 
              onClick={() => setInventorySubTab('bodega')} 
              className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${inventorySubTab === 'bodega' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-[#0F172A] text-slate-300 border border-slate-800'}`}
            >
              🏭 Bodega Principal ({inventoryBodega.length})
            </button>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {/* Buscador */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar SKU, EPC o Nombre..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Selector de Categoría */}
            <div className="relative">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#0F172A] border border-slate-700 text-xs font-bold text-slate-300 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="all">Todas las Categorías</option>
                <option value="Herramientas">Herramientas</option>
                <option value="Seguridad">Seguridad</option>
                <option value="CCTV">CCTV</option>
                <option value="Insumos">Insumos</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Inventario Avanzada */}
      <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase bg-slate-900/40 tracking-wider">
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Código RFID (EPC)</th>
                <th className="py-3.5 px-4">Producto & Categoría</th>
                <th className="py-3.5 px-4 text-center">Stock Actual</th>
                <th className="py-3.5 px-4 text-center">Tags RFID Sincronizados</th>
                <th className="py-3.5 px-4">Ubicación Física</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
              {filteredList.length > 0 ? (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{item.id}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{item.epc}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white block">{item.name}</span>
                      <span className="text-[10px] text-cyan-400 font-medium">{item.category}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-black text-white text-sm">{item.stock}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-400">{item.rfidTagged || item.stock} un</td>
                    <td className="py-3.5 px-4 text-slate-300">{item.location}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${item.status === 'Optimal' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                        {item.status === 'Optimal' ? '🟢 Óptimo' : '⚠️ Stock Bajo'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 text-xs font-medium">
                    No se encontraron productos que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}