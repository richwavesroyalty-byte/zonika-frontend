import React, { useState } from 'react';
import { Boxes, Plus, Search, Filter, AlertTriangle, CheckCircle2, Trash2, ArrowRightLeft, Shield, Tag, Download } from 'lucide-react';

export default function InventoryView({
  inventorySubTab,
  setInventorySubTab,
  inventoryMadefront,
  inventoryBodega,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  onDeleteProduct,
  onTransferProduct,
  onOpenTraceability,
  onRecodeProduct,
  showNotification
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const currentList = inventorySubTab === 'madefront' ? inventoryMadefront : inventoryBodega;
  const currentWarehouseTitle = inventorySubTab === 'madefront' ? 'Madefront Ferretería' : 'Bodega Principal';

  const filteredList = currentList.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.epc.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Función de Exportación a Excel dinámica según la sede activa
  const handleExportExcel = () => {
    const warehouseCode = inventorySubTab === 'madefront' ? 'Madefront_Ferreteria' : 'Bodega_Principal';
    const headers = ["SKU", "EPC RFID", "Nombre Producto", "Categoria", "Stock Actual", "Stock Minimo", "Tags RFID Sinc.", "Ubicacion Fisica", "Estado"];
    const rows = filteredList.map(item => [
      item.id,
      item.epc,
      `"${item.name}"`,
      item.category,
      item.stock,
      item.minStock || 5,
      item.rfidTagged || item.stock,
      `"${item.location}"`,
      Number(item.stock) <= (item.minStock || 5) ? "Stock Bajo" : "Optimo"
    ]);

    let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Inventario_${warehouseCode}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (showNotification) {
      showNotification(`📊 ¡Inventario de ${currentWarehouseTitle} exportado a Excel con éxito!`);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Control de Stock e Inventarios Inteligentes</h2>
          <p className="text-slate-400 text-xs mt-1 font-medium">Gestión avanzada por ubicación física, lectura RFID, umbrales mínimos y trazabilidad 360° en <strong className="text-cyan-400">{currentWarehouseTitle}</strong>.</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* Botón Exportar Excel Compacto en la esquina */}
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm"
            title={`Exportar inventario de ${currentWarehouseTitle} a Excel`}
          >
            <Download className="w-3.5 h-3.5" /> Exportar Excel
          </button>

          {/* Botón Registrar Nuevo Producto */}
          <button 
            onClick={setActiveTab} 
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-lg transition-all uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" /> Registrar Nuevo Producto
          </button>
        </div>
      </div>

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

      <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase bg-slate-900/40 tracking-wider">
                <th className="py-3.5 px-4">SKU / EPC (Trazabilidad)</th>
                <th className="py-3.5 px-4">Producto & Categoría</th>
                <th className="py-3.5 px-4 text-center">Stock Actual (Mín)</th>
                <th className="py-3.5 px-4 text-center">Tags RFID Sinc.</th>
                <th className="py-3.5 px-4">Ubicación Física</th>
                <th className="py-3.5 px-4 text-center">Estado Dinámico</th>
                <th className="py-3.5 px-4 text-center">Acciones Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
              {filteredList.length > 0 ? (
                filteredList.map((item) => {
                  const min = item.minStock || 5;
                  const isLow = Number(item.stock) <= min;
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <button 
                          onClick={() => onOpenTraceability(item)}
                          className="font-mono font-bold text-cyan-400 hover:underline block text-left"
                          title="Clic para ver Trazabilidad 360°"
                        >
                          {item.id}
                        </button>
                        <span className="font-mono text-slate-400 text-[10px] block">{item.epc}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white block">{item.name}</span>
                        <span className="text-[10px] text-cyan-400 font-medium">{item.category}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-black text-white text-sm">
                        {item.stock} <span className="text-[10px] text-slate-400 font-normal">({min})</span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-400">{item.rfidTagged || item.stock} un</td>
                      <td className="py-3.5 px-4 text-slate-300">{item.location}</td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border ${!isLow ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                          {!isLow ? '🟢 Óptimo' : '⚠️ Stock Bajo'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Transferencia Inter-Almacén */}
                          <button 
                            onClick={() => onTransferProduct(item, inventorySubTab)} 
                            className="p-2 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 rounded-xl transition-all"
                            title="Transferir entre almacenes"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </button>
                          {/* Re-codificación EPC RFID */}
                          <button 
                            onClick={() => onRecodeProduct(item)} 
                            className="p-2 bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-400 border border-indigo-500/30 rounded-xl transition-all"
                            title="Re-codificar Tag RFID (Re-encoding)"
                          >
                            <Tag className="w-3.5 h-3.5" />
                          </button>
                          {/* Baja con Trazabilidad */}
                          <button 
                            onClick={() => onDeleteProduct(item, inventorySubTab)} 
                            className="p-2 bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 rounded-xl transition-all"
                            title="Eliminar con trazabilidad inalterable"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 text-xs font-medium">
                    No se encontraron productos en esta sede que coincidan con la búsqueda.
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