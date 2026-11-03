import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Trash2, ArrowLeftRight, Tag, Download, X, Package, Eye, Unlock
} from 'lucide-react';

export default function InventoryView({
  inventorySubTab,
  setInventorySubTab,
  inventoryMadefront = [],
  setInventoryMadefront,
  inventoryBodega = [],
  setInventoryBodega,
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

  // ESTADO MODAL PALETIZAR / CREAR KIT
  const [selectedItems, setSelectedItems] = useState([]);
  const [kitModalOpen, setKitModalOpen] = useState(false);
  const [kitForm, setKitForm] = useState({ name: '', epc: '', destination: 'Zona de Despacho (Muelle)' });

  // ESTADO PALLETS
  const [pallets, setPallets] = useState(() => {
    try {
      const saved = localStorage.getItem('zonika_pallets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [palletDetailsOpen, setPalletDetailsOpen] = useState(false);
  const [selectedPallet, setSelectedPallet] = useState(null);

  useEffect(() => {
    localStorage.setItem('zonika_pallets', JSON.stringify(pallets));
  }, [pallets]);

  const isPalletsTab = inventorySubTab === 'pallets';
  const currentList = inventorySubTab === 'madefront' ? inventoryMadefront : inventoryBodega;
  
  let currentWarehouseTitle = '';
  if (inventorySubTab === 'madefront') currentWarehouseTitle = 'Madefront Ferretería';
  else if (inventorySubTab === 'bodega') currentWarehouseTitle = 'Bodega Principal';
  else if (inventorySubTab === 'pallets') currentWarehouseTitle = 'Pallets y Kits Agrupados';

  const filteredList = currentList.filter(item => {
    const matchesSearch = 
      (item.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.epc || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredPallets = pallets.filter(pallet => 
    (pallet.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pallet.epc || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pallet.destination || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTabChange = (tab) => {
    setInventorySubTab(tab);
    setSelectedItems([]);
  };

  const handleToggleItem = (item) => {
    setSelectedItems(prev => 
      prev.find(i => i.id === item.id) 
        ? prev.filter(i => i.id !== item.id) 
        : [...prev, item]
    );
  };

  const handleToggleAll = () => {
    if (selectedItems.length === filteredList.length) {
      setSelectedItems([]); 
    } else {
      setSelectedItems([...filteredList]); 
    }
  };

  const handleCreateKit = (e) => {
    e.preventDefault();
    if (selectedItems.length === 0 || !kitForm.name || !kitForm.epc) return;

    const newPallet = {
      id: 'PAL-' + Math.floor(1000 + Math.random() * 9000),
      name: kitForm.name,
      epc: kitForm.epc,
      destination: kitForm.destination,
      originWarehouse: inventorySubTab,
      items: selectedItems,
      createdAt: new Date().toLocaleString()
    };

    setPallets([newPallet, ...pallets]);

    const updateInventoryStock = (list) => {
      return list.map(invItem => {
        const foundInKit = selectedItems.find(kitItem => kitItem.id === invItem.id);
        if (foundInKit) {
          const newStock = Math.max(0, Number(invItem.stock) - Number(foundInKit.stock));
          return { ...invItem, stock: newStock, rfidTagged: newStock };
        }
        return invItem;
      });
    };

    if (inventorySubTab === 'madefront' && typeof setInventoryMadefront === 'function') {
      setInventoryMadefront(prev => updateInventoryStock(prev));
    } else if (inventorySubTab === 'bodega' && typeof setInventoryBodega === 'function') {
      setInventoryBodega(prev => updateInventoryStock(prev));
    }

    if (typeof showNotification === 'function') {
      showNotification(`📦 ¡Kit Maestro "${kitForm.name}" agrupado!`);
    }
    
    setKitModalOpen(false);
    setSelectedItems([]);
    setKitForm({ name: '', epc: '', destination: 'Zona de Despacho (Muelle)' });
    setInventorySubTab('pallets');
  };

  const handleUnpackPallet = (palletId) => {
    const palletToRestore = pallets.find(p => p.id === palletId);
    if (palletToRestore && palletToRestore.items) {
      const restoreStock = (list) => {
        return list.map(invItem => {
          const found = palletToRestore.items.find(i => i.id === invItem.id);
          if (found) {
            const restoredStock = Number(invItem.stock) + Number(found.stock);
            return { ...invItem, stock: restoredStock, rfidTagged: restoredStock };
          }
          return invItem;
        });
      };

      if (palletToRestore.originWarehouse === 'madefront' && typeof setInventoryMadefront === 'function') {
        setInventoryMadefront(prev => restoreStock(prev));
      } else if (palletToRestore.originWarehouse === 'bodega' && typeof setInventoryBodega === 'function') {
        setInventoryBodega(prev => restoreStock(prev));
      }
    }

    setPallets(pallets.filter(p => p.id !== palletId));
    if (typeof showNotification === 'function') {
      showNotification(`🔓 Pallet desarmado. Stock restaurado.`);
    }
  };

  const handleExportExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let filename = "";

    if (isPalletsTab) {
      const headers = ["ID Pallet", "EPC Maestro", "Nombre", "Destino", "Total Items", "Fecha Creacion"];
      const rows = filteredPallets.map(p => [
        p.id, p.epc, `"${p.name}"`, `"${p.destination}"`, p.items.length, `"${p.createdAt}"`
      ]);
      csvContent += [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      filename = `Pallets_${new Date().toISOString().slice(0,10)}.csv`;
    } else {
      const warehouseCode = inventorySubTab === 'madefront' ? 'Madefront' : 'Bodega';
      const headers = ["SKU", "EPC RFID", "Nombre Producto", "Categoria", "Stock Actual", "Ubicacion"];
      const rows = filteredList.map(item => [
        item.id, item.epc, `"${item.name}"`, item.category, item.stock, `"${item.location}"`
      ]);
      csvContent += [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      filename = `Inventario_${warehouseCode}_${new Date().toISOString().slice(0,10)}.csv`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 relative">
      
      {/* MODAL PALETIZAR / CREAR KIT MAESTRO */}
      {kitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#05070E] border-2 border-[#00f0ff] rounded-3xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(0,240,255,0.4)] space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-[#00f0ff]">
                <Package className="w-5 h-5" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Crear Pallet / Kit Agrupado</h3>
              </div>
              <button onClick={() => setKitModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <p className="text-xs text-slate-400">Seleccionados: <strong className="text-white">{selectedItems.length} productos</strong></p>

            <form onSubmit={handleCreateKit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Nombre del Kit / Pallet</label>
                <input type="text" placeholder="Ej. Pallet Herramientas Despacho 01" value={kitForm.name} onChange={(e) => setKitForm({...kitForm, name: e.target.value})} className="w-full bg-[#020408] border border-slate-800 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-[#00f0ff]" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Código EPC Maestro (Tag Contenedor)</label>
                <input type="text" placeholder="E280000..." value={kitForm.epc} onChange={(e) => setKitForm({...kitForm, epc: e.target.value})} className="w-full bg-[#020408] border border-slate-800 p-2.5 rounded-xl text-xs font-mono text-[#00f0ff] focus:outline-none focus:border-[#00f0ff]" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Destino Inicial</label>
                <input type="text" value={kitForm.destination} onChange={(e) => setKitForm({...kitForm, destination: e.target.value})} className="w-full bg-[#020408] border border-slate-800 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-[#00f0ff]" required />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-gradient-to-r from-cyan-500/20 to-cyan-400/10 border-2 border-[#00f0ff] text-[#00f0ff] font-black text-xs py-3 rounded-xl uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)]">Guardar y Paletizar</button>
                <button type="button" onClick={() => setKitModalOpen(false)} className="bg-slate-800 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALLES DE PALLET */}
      {palletDetailsOpen && selectedPallet && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#05070E] border-2 border-[#00f0ff] rounded-3xl p-6 max-w-lg w-full shadow-[0_0_40px_rgba(0,240,255,0.3)] space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-[#00f0ff]">
                <Package className="w-5 h-5" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Contenido del Pallet Maestro</h3>
              </div>
              <button onClick={() => setPalletDetailsOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-[#020408] border border-slate-800 p-4 rounded-xl text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-400">Nombre:</span> <span className="font-bold text-white">{selectedPallet.name}</span></div>
              <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-400">EPC Maestro:</span> <span className="font-mono text-[#00f0ff]">{selectedPallet.epc}</span></div>
              <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-400">Destino:</span> <span className="font-bold text-[#00f0ff]">{selectedPallet.destination}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Total Ítems:</span> <span className="font-black text-white">{selectedPallet.items?.length || 0} unidades</span></div>
            </div>
            <button onClick={() => setPalletDetailsOpen(false)} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 rounded-xl uppercase transition-all">
              Cerrar Detalles
            </button>
          </div>
        </div>
      )}

      {/* HEADER PRINCIPAL DE INVENTARIO */}
      <div className="bg-[#05070E] border-2 border-cyan-400/50 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-wide">Control de Stock e Inventarios Inteligentes</h2>
          <p className="text-slate-400 text-xs mt-1 font-medium">Gestión por ubicación física, lectura RFID y trazabilidad en <strong className="text-[#00f0ff]">{currentWarehouseTitle}</strong>.</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {!isPalletsTab && (
            <button 
              type="button"
              onClick={() => {
                if (selectedItems.length > 0) setKitModalOpen(true);
                else if (typeof showNotification === 'function') showNotification("⚠️ Selecciona al menos un producto.");
              }}
              className={`flex items-center gap-1.5 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all ${selectedItems.length > 0 ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-400/10 border-2 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.4)]' : 'bg-[#020408] border border-slate-800/80 text-slate-500 cursor-not-allowed'}`}
            >
              <Package className="w-3.5 h-3.5" /> 
              Paletizar {selectedItems.length > 0 && `(${selectedItems.length})`}
            </button>
          )}

          <button 
            type="button"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 bg-[#020408] hover:bg-cyan-500/20 text-[#00f0ff] border border-cyan-400/50 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            <Download className="w-3.5 h-3.5" /> Exportar Excel
          </button>

          {!isPalletsTab && (
            <button 
              type="button"
              onClick={() => { if(typeof setActiveTab === 'function') setActiveTab('add-product'); }} 
              className="flex items-center gap-2 bg-[#00f0ff] hover:bg-cyan-300 text-black font-black text-xs px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.6)] transition-all uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" /> Registrar Nuevo Producto
            </button>
          )}
        </div>
      </div>

      {/* BARRA DE PESTAÑAS Y BUSCADOR */}
      <div className="bg-[#05070E] border-2 border-slate-800/90 p-4 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            <button 
              type="button"
              onClick={() => handleTabChange('madefront')} 
              className={`flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${inventorySubTab === 'madefront' ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-400/10 border-2 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.4)]' : 'bg-[#020408] text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-900/60'}`}
            >
              🏪 Madefront Ferretería ({inventoryMadefront.length})
            </button>
            <button 
              type="button"
              onClick={() => handleTabChange('bodega')} 
              className={`flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${inventorySubTab === 'bodega' ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-400/10 border-2 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.4)]' : 'bg-[#020408] text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-900/60'}`}
            >
              🏭 Bodega Principal ({inventoryBodega.length})
            </button>
            <button 
              type="button"
              onClick={() => handleTabChange('pallets')} 
              className={`flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${inventorySubTab === 'pallets' ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-400/10 border-2 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.4)]' : 'bg-[#020408] text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-900/60'}`}
            >
              📦 Pallets y Kits ({pallets.length})
            </button>
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar por EPC, Nombre..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#020408] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00f0ff] font-mono"
              />
            </div>

            {!isPalletsTab && (
              <select 
                value={selectedCategory}
                onChange={(e) => { if(typeof setSelectedCategory === 'function') setSelectedCategory(e.target.value); }}
                className="bg-[#020408] border border-slate-800 text-xs font-bold text-slate-300 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#00f0ff] cursor-pointer"
              >
                <option value="all">Todas las Categorías</option>
                <option value="Herramientas">Herramientas</option>
                <option value="Seguridad">Seguridad</option>
                <option value="CCTV">CCTV</option>
                <option value="Insumos">Insumos</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* TABLA PRINCIPAL DE REGISTROS */}
      <div className="bg-[#05070E] border-2 border-slate-800/90 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(0,240,255,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {isPalletsTab ? (
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase bg-[#020408] tracking-wider font-mono">
                  <th className="py-3.5 px-4">ID Kit / EPC Maestro</th>
                  <th className="py-3.5 px-4">Nombre del Kit</th>
                  <th className="py-3.5 px-4 text-center">Cant. Ítems</th>
                  <th className="py-3.5 px-4">Destino Actual</th>
                  <th className="py-3.5 px-4">Fecha Creación</th>
                  <th className="py-3.5 px-4 text-center">Acciones</th>
                </tr>
              ) : (
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase bg-[#020408] tracking-wider font-mono">
                  <th className="py-3.5 px-4 w-10 text-center">
                    <input 
                      type="checkbox" 
                      checked={filteredList.length > 0 && selectedItems.length === filteredList.length}
                      onChange={handleToggleAll}
                      className="w-4 h-4 rounded border-slate-700 bg-[#020408] text-cyan-400 focus:ring-cyan-400 cursor-pointer accent-cyan-400"
                    />
                  </th>
                  <th className="py-3.5 px-2">SKU / EPC (Trazabilidad)</th>
                  <th className="py-3.5 px-4">Producto & Categoría</th>
                  <th className="py-3.5 px-4 text-center">Stock Actual (Mín)</th>
                  <th className="py-3.5 px-4 text-center">Tags RFID Sinc.</th>
                  <th className="py-3.5 px-4">Ubicación Física</th>
                  <th className="py-3.5 px-4 text-center">Estado Dinámico</th>
                  <th className="py-3.5 px-4 text-center whitespace-nowrap">Acciones Enterprise</th>
                </tr>
              )}
            </thead>

            <tbody className="divide-y divide-slate-800/80 text-xs text-slate-200">
              {isPalletsTab ? (
                filteredPallets.length > 0 ? (
                  filteredPallets.map((pallet) => (
                    <tr key={pallet.id} className="hover:bg-[#020408]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#00f0ff] block text-left">{pallet.id}</span>
                        <span className="font-mono text-slate-400 text-[10px] block">{pallet.epc}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">{pallet.name}</td>
                      <td className="py-3.5 px-4 text-center font-black text-cyan-400 text-sm">{pallet.items?.length || 0} un</td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2.5 py-1 rounded-md text-[10px] font-bold">
                          {pallet.destination}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[10px]">{pallet.createdAt}</td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            type="button"
                            onClick={() => { setSelectedPallet(pallet); setPalletDetailsOpen(true); }} 
                            className="p-2 bg-cyan-500/10 text-cyan-400 border border-cyan-400/30 rounded-xl hover:bg-cyan-500/20"
                            title="Ver Contenido del Pallet"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleUnpackPallet(pallet.id)} 
                            className="p-2 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl hover:bg-rose-500/20"
                            title="Desarmar y Retornar al Inventario"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 text-xs font-medium">No hay pallets agrupados.</td>
                  </tr>
                )
              ) : (
                filteredList.length > 0 ? (
                  filteredList.map((item) => {
                    const min = item.minStock || 5;
                    const isLow = Number(item.stock) <= min;
                    const isSelected = selectedItems.some(i => i.id === item.id);
                    
                    return (
                      <tr key={item.id + item.epc} className={`transition-colors ${isSelected ? 'bg-cyan-500/10' : 'hover:bg-[#020408]/60'}`}>
                        <td className="py-3.5 px-4 text-center">
                          <input 
                            type="checkbox" checked={isSelected} onChange={() => handleToggleItem(item)}
                            className="w-4 h-4 rounded border-slate-700 bg-[#020408] text-cyan-400 focus:ring-cyan-400 cursor-pointer accent-cyan-400"
                          />
                        </td>
                        <td className="py-3.5 px-2">
                          <button 
                            type="button" 
                            onClick={() => { if (typeof onOpenTraceability === 'function') onOpenTraceability(item); }}
                            className="font-mono font-bold text-[#00f0ff] hover:underline block text-left"
                          >
                            {item.id}
                          </button>
                          <span className="font-mono text-slate-400 text-[10px] block">{item.epc}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-white block">{item.name}</span>
                          <span className="text-[10px] text-cyan-300 font-medium">{item.category}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-black text-white text-sm">
                          {item.stock} <span className="text-[10px] text-slate-400 font-normal">({min})</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-400">{item.rfidTagged || item.stock} un</td>
                        <td className="py-3.5 px-4 text-slate-300">{item.location}</td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${!isLow ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-amber-500/10 text-amber-400 border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]'}`}>
                            {!isLow ? '🟢 Óptimo' : '⚠️ Stock Bajo'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              type="button" 
                              onClick={() => { if (typeof onTransferProduct === 'function') onTransferProduct(item, inventorySubTab); }} 
                              className="p-2 bg-cyan-500/10 hover:bg-cyan-500/25 text-[#00f0ff] border border-cyan-400/50 rounded-xl transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)]" 
                              title="Transferir entre almacenes"
                            >
                              <ArrowLeftRight className="w-3.5 h-3.5" />
                            </button>

                            <button 
                              type="button" 
                              onClick={() => { if (typeof onRecodeProduct === 'function') onRecodeProduct(item); }} 
                              className="p-2 bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-400/50 rounded-xl transition-all shadow-[0_0_10px_rgba(129,140,248,0.2)]" 
                              title="Re-codificar Tag RFID"
                            >
                              <Tag className="w-3.5 h-3.5" />
                            </button>

                            <button 
                              type="button" 
                              onClick={() => { if (typeof onDeleteProduct === 'function') onDeleteProduct(item, inventorySubTab); }} 
                              className="p-2 bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/50 rounded-xl transition-all shadow-[0_0_10px_rgba(244,63,94,0.2)]" 
                              title="Eliminar con trazabilidad"
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
                    <td colSpan="8" className="py-8 text-center text-slate-400 text-xs font-medium">No se encontraron productos.</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}