import React, { useState, useEffect } from 'react';
import { Boxes, Plus, Search, Filter, AlertTriangle, CheckCircle2, Trash2, ArrowRightLeft, Shield, Tag, Download, Radar, X, Activity, Package, Eye, Unlock } from 'lucide-react';

export default function InventoryView({
  inventorySubTab,
  setInventorySubTab,
  inventoryMadefront,
  setInventoryMadefront,
  inventoryBodega,
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
  
  // ==========================================
  // ESTADOS: Modal Radar
  // ==========================================
  const [radarModalOpen, setRadarModalOpen] = useState(false);
  const [itemToFind, setItemToFind] = useState(null);
  const [rssiSignal, setRssiSignal] = useState(0);

  // ==========================================
  // ESTADOS: Modal Crear Kit / Paletizar
  // ==========================================
  const [selectedItems, setSelectedItems] = useState([]);
  const [kitModalOpen, setKitModalOpen] = useState(false);
  const [kitForm, setKitForm] = useState({ name: '', epc: '', destination: 'Zona de Despacho (Muelle)' });

  // ==========================================
  // ESTADOS: Gestión de Pallets (Guardado Local)
  // ==========================================
  const [pallets, setPallets] = useState(() => {
    const saved = localStorage.getItem('zonika_pallets');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [palletDetailsOpen, setPalletDetailsOpen] = useState(false);
  const [selectedPallet, setSelectedPallet] = useState(null);

  useEffect(() => {
    localStorage.setItem('zonika_pallets', JSON.stringify(pallets));
  }, [pallets]);

  // ==========================================
  // SELECTORES Y FILTROS PRINCIPALES
  // ==========================================
  const isPalletsTab = inventorySubTab === 'pallets';
  const currentList = inventorySubTab === 'madefront' ? inventoryMadefront : inventoryBodega;
  
  let currentWarehouseTitle = '';
  if (inventorySubTab === 'madefront') currentWarehouseTitle = 'Madefront Ferretería';
  else if (inventorySubTab === 'bodega') currentWarehouseTitle = 'Bodega Principal';
  else if (inventorySubTab === 'pallets') currentWarehouseTitle = 'Pallets y Kits Agrupados';

  // Filtrado de la lista individual
  const filteredList = currentList.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.epc.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtrado de la lista de Pallets
  const filteredPallets = pallets.filter(pallet => 
    pallet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pallet.epc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pallet.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTabChange = (tab) => {
    setInventorySubTab(tab);
    setSelectedItems([]); // Limpiar selección al cambiar de pestaña
  };

  // ==========================================
  // LÓGICA: Selección Múltiple y Creación de Kit
  // ==========================================
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

    // REUBICACIÓN / DESCUENTO LÓGICO DEL STOCK EN EL ALMACÉN DE ORIGEN
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

    if (inventorySubTab === 'madefront' && setInventoryMadefront) {
      setInventoryMadefront(prev => updateInventoryStock(prev));
    } else if (inventorySubTab === 'bodega' && setInventoryBodega) {
      setInventoryBodega(prev => updateInventoryStock(prev));
    }

    if (showNotification) {
      showNotification(`📦 ¡Kit "${kitForm.name}" creado, redirigido a "${kitForm.destination}" y stock reubicado!`);
    }
    
    setKitModalOpen(false);
    setSelectedItems([]);
    setKitForm({ name: '', epc: '', destination: 'Zona de Despacho (Muelle)' });
    setInventorySubTab('pallets'); // Redirigir a la vista de pallets para verlo
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

      if (palletToRestore.originWarehouse === 'madefront' && setInventoryMadefront) {
        setInventoryMadefront(prev => restoreStock(prev));
      } else if (palletToRestore.originWarehouse === 'bodega' && setInventoryBodega) {
        setInventoryBodega(prev => restoreStock(prev));
      }
    }

    setPallets(pallets.filter(p => p.id !== palletId));
    if (showNotification) showNotification(`🔓 Pallet desarmado. Los productos han retornado al inventario activo de origen.`);
  };

  const handleOpenPalletDetails = (pallet) => {
    setSelectedPallet(pallet);
    setPalletDetailsOpen(true);
  };

  // ==========================================
  // LÓGICA: Radar
  // ==========================================
  useEffect(() => {
    let interval;
    if (radarModalOpen) {
      interval = setInterval(() => {
        setRssiSignal(prev => {
          const newSignal = prev + (Math.random() > 0.5 ? 15 : -10);
          return Math.max(10, Math.min(100, newSignal));
        });
      }, 800);
    } else {
      setRssiSignal(0);
    }
    return () => clearInterval(interval);
  }, [radarModalOpen]);

  const handleOpenRadar = (item) => {
    setItemToFind(item);
    setRssiSignal(20);
    setRadarModalOpen(true);
  };

  const getRadarStatus = () => {
    if (rssiSignal > 80) return { color: 'text-emerald-400', bg: 'bg-emerald-400', text: '¡Muy Cerca!' };
    if (rssiSignal > 40) return { color: 'text-amber-400', bg: 'bg-amber-400', text: 'Acercándose...' };
    return { color: 'text-rose-400', bg: 'bg-rose-400', text: 'Señal Débil' };
  };
  const radarStatus = getRadarStatus();

  // ==========================================
  // LÓGICA: Exportar Excel (Dinámico para Items o Pallets)
  // ==========================================
  const handleExportExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let filename = "";

    if (isPalletsTab) {
      const headers = ["ID Pallet", "EPC Maestro", "Nombre", "Destino", "Total Items", "Fecha Creacion"];
      const rows = filteredPallets.map(p => [
        p.id, p.epc, `"${p.name}"`, `"${p.destination}"`, p.items.length, `"${p.createdAt}"`
      ]);
      csvContent += [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      filename = `Pallets_Agrupados_${new Date().toISOString().slice(0,10)}.csv`;
    } else {
      const warehouseCode = inventorySubTab === 'madefront' ? 'Madefront_Ferreteria' : 'Bodega_Principal';
      const headers = ["SKU", "EPC RFID", "Nombre Producto", "Categoria", "Stock Actual", "Stock Minimo", "Tags RFID Sinc.", "Ubicacion Fisica", "Estado"];
      const rows = filteredList.map(item => [
        item.id, item.epc, `"${item.name}"`, item.category, item.stock, item.minStock || 5, item.rfidTagged || item.stock, `"${item.location}"`,
        Number(item.stock) <= (item.minStock || 5) ? "Stock Bajo" : "Optimo"
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

    if (showNotification) showNotification(`📊 ¡Datos de ${currentWarehouseTitle} exportados a Excel con éxito!`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 relative">
      
      {/* MODAL: RADAR */}
      {radarModalOpen && itemToFind && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
               <div className={`w-64 h-64 rounded-full border-4 ${radarStatus.color.replace('text', 'border')} animate-ping`}></div>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 relative z-10">
              <div className="flex items-center gap-2 text-cyan-400">
                <Radar className={`w-5 h-5 ${rssiSignal > 50 ? 'animate-pulse' : ''}`} />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Búsqueda Activa</h3>
              </div>
              <button onClick={() => setRadarModalOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="text-center space-y-2 relative z-10">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Buscando EPC:</p>
              <p className="font-mono text-cyan-400 font-bold text-sm bg-[#1E293B] py-2 px-4 rounded-xl border border-slate-700 mx-auto w-fit break-all">{itemToFind.epc}</p>
              <p className="text-white font-semibold text-sm mt-2">{itemToFind.name}</p>
              <p className="text-[10px] text-slate-500">Última ubicación conocida: {itemToFind.location}</p>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-slate-400">Intensidad (RSSI)</span>
                <span className={`text-xl font-black ${radarStatus.color}`}>{Math.round(rssiSignal)}%</span>
              </div>
              <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div className={`h-full ${radarStatus.bg} transition-all duration-300 ease-out`} style={{ width: `${rssiSignal}%` }}></div>
              </div>
              <div className="flex justify-center items-center gap-2 mt-2">
                <Activity className={`w-4 h-4 ${radarStatus.color} animate-pulse`} />
                <span className={`text-xs font-bold uppercase tracking-widest ${radarStatus.color}`}>{radarStatus.text}</span>
              </div>
            </div>
            <button onClick={() => setRadarModalOpen(false)} className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3.5 rounded-xl uppercase tracking-wider transition-all relative z-10">
              Detener Búsqueda
            </button>
          </div>
        </div>
      )}

      {/* MODAL: DETALLES DEL PALLET */}
      {palletDetailsOpen && selectedPallet && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2 text-indigo-400">
                <Package className="w-5 h-5" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Contenido del Kit / Pallet</h3>
              </div>
              <button onClick={() => setPalletDetailsOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-[#0F172A] border border-slate-800 p-4 rounded-xl text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-700/50 pb-2"><span className="text-slate-400">Nombre:</span> <span className="font-bold text-white">{selectedPallet.name}</span></div>
              <div className="flex justify-between border-b border-slate-700/50 pb-2"><span className="text-slate-400">EPC Maestro:</span> <span className="font-mono text-cyan-400">{selectedPallet.epc}</span></div>
              <div className="flex justify-between border-b border-slate-700/50 pb-2"><span className="text-slate-400">Destino / Trazabilidad:</span> <span className="font-bold text-indigo-400">{selectedPallet.destination}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Total Ítems:</span> <span className="font-black text-white">{selectedPallet.items.length} unidades</span></div>
            </div>
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Productos Agrupados</h4>
              <div className="max-h-48 overflow-y-auto bg-[#0F172A] border border-slate-800 rounded-xl p-2 space-y-1">
                {selectedPallet.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-xs text-slate-300 border-b border-slate-800/50 p-2 last:border-0">
                    <div>
                      <span className="font-semibold text-white block">{item.name}</span>
                      <span className="text-[10px] text-slate-400">Stock Agrupado: {item.stock}</span>
                    </div>
                    <span className="font-mono text-cyan-500 shrink-0">{item.id}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setPalletDetailsOpen(false)} className="w-full mt-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 rounded-xl uppercase transition-all">
              Cerrar Detalles
            </button>
          </div>
        </div>
      )}

      {/* MODAL: CREAR KIT / PALETIZAR */}
      {kitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2 text-indigo-400">
                <Package className="w-5 h-5" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Empaquetar / Paletizar</h3>
              </div>
              <button onClick={() => setKitModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-[#0F172A] border border-slate-800 p-3 rounded-xl text-xs space-y-1">
              <p className="text-slate-400">Has seleccionado <strong className="text-indigo-400">{selectedItems.length}</strong> producto(s) para agrupar bajo una única etiqueta RFID maestra.</p>
            </div>
            <form onSubmit={handleCreateKit} className="space-y-4 pt-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Nombre del Kit / Pallet</label>
                <input 
                  type="text" placeholder="Ej. Pallet Ferretería 01" value={kitForm.name}
                  onChange={(e) => setKitForm({...kitForm, name: e.target.value})}
                  className="w-full bg-[#0F172A] border border-slate-700 p-3 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500" required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Código EPC Maestro</label>
                  <input 
                    type="text" placeholder="E2806894..." value={kitForm.epc}
                    onChange={(e) => setKitForm({...kitForm, epc: e.target.value})}
                    className="w-full bg-[#0F172A] border border-slate-700 p-3 rounded-xl text-xs font-mono font-bold text-indigo-400 focus:outline-none focus:border-indigo-500" required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Destino del Pallet</label>
                  <select 
                    value={kitForm.destination}
                    onChange={(e) => setKitForm({...kitForm, destination: e.target.value})}
                    className="w-full bg-[#0F172A] border border-slate-700 p-3 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Zona de Despacho (Muelle)">Zona de Despacho</option>
                    <option value="Tránsito a Cliente Externo">Cliente Externo</option>
                    <option value="Bodega de Respaldo">Bodega de Respaldo</option>
                    <option value="Área de Cuarentena">Área de Cuarentena</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs py-3 rounded-xl uppercase tracking-wider transition-all shadow-lg">Vincular y Guardar</button>
                <button type="button" onClick={() => setKitModalOpen(false)} className="bg-slate-800 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl hover:bg-slate-700 transition-colors">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HEADER E INTERFAZ PRINCIPAL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Control de Stock e Inventarios Inteligentes</h2>
          <p className="text-slate-400 text-xs mt-1 font-medium">Gestión avanzada por ubicación física, lectura RFID, umbrales mínimos y trazabilidad 360° en <strong className="text-cyan-400">{currentWarehouseTitle}</strong>.</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Botón Paletizar (Solo visible si NO estamos en la pestaña de Pallets) */}
          {!isPalletsTab && (
            <button 
              type="button"
              onClick={() => selectedItems.length > 0 ? setKitModalOpen(true) : showNotification("⚠️ Selecciona al menos un producto de la tabla con las casillas.")}
              className={`flex items-center gap-1.5 font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm ${selectedItems.length > 0 ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-500/20' : 'bg-[#0F172A] border border-slate-700 text-slate-500 cursor-not-allowed'}`}
              title="Agrupar productos seleccionados en un Pallet/Kit RFID"
            >
              <Package className="w-3.5 h-3.5" /> 
              Paletizar {selectedItems.length > 0 && `(${selectedItems.length})`}
            </button>
          )}

          <button 
            type="button"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Exportar Excel
          </button>

          {!isPalletsTab && (
            <button 
              type="button"
              onClick={setActiveTab} 
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-lg transition-all uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" /> Registrar Nuevo Producto
            </button>
          )}
        </div>
      </div>

      {/* BARRA DE PESTAÑAS Y BÚSQUEDA */}
      <div className="bg-[#1E293B] border border-slate-700/60 p-4 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          
          {/* 3 Pestañas */}
          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            <button 
              type="button"
              onClick={() => handleTabChange('madefront')} 
              className={`flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${inventorySubTab === 'madefront' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-[#0F172A] text-slate-300 border border-slate-800 hover:bg-slate-800'}`}
            >
              🏪 Madefront Ferretería ({inventoryMadefront.length})
            </button>
            <button 
              type="button"
              onClick={() => handleTabChange('bodega')} 
              className={`flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${inventorySubTab === 'bodega' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-[#0F172A] text-slate-300 border border-slate-800 hover:bg-slate-800'}`}
            >
              🏭 Bodega Principal ({inventoryBodega.length})
            </button>
            <button 
              type="button"
              onClick={() => handleTabChange('pallets')} 
              className={`flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${inventorySubTab === 'pallets' ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' : 'bg-[#0F172A] text-slate-300 border border-slate-800 hover:bg-slate-800'}`}
            >
              📦 Pallets y Kits ({pallets.length})
            </button>
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar por EPC, Nombre o Destino..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Ocultar filtro de categorías si estamos en la vista de pallets */}
            {!isPalletsTab && (
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
            )}
          </div>
        </div>
      </div>

      {/* TABLA PRINCIPAL DINÁMICA */}
      <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* CABECERAS DINÁMICAS */}
            <thead>
              {isPalletsTab ? (
                <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase bg-slate-900/40 tracking-wider">
                  <th className="py-3.5 px-4">ID Kit / EPC Maestro</th>
                  <th className="py-3.5 px-4">Nombre del Kit</th>
                  <th className="py-3.5 px-4 text-center">Cant. Ítems</th>
                  <th className="py-3.5 px-4">Destino Actual</th>
                  <th className="py-3.5 px-4">Fecha Creación</th>
                  <th className="py-3.5 px-4 text-center">Acciones</th>
                </tr>
              ) : (
                <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase bg-slate-900/40 tracking-wider">
                  <th className="py-3.5 px-4 w-10 text-center">
                    <input 
                      type="checkbox" 
                      checked={filteredList.length > 0 && selectedItems.length === filteredList.length}
                      onChange={handleToggleAll}
                      className="w-4 h-4 rounded border-slate-600 bg-[#0F172A] text-cyan-500 focus:ring-cyan-500 cursor-pointer accent-cyan-500"
                    />
                  </th>
                  <th className="py-3.5 px-2">SKU / EPC (Trazabilidad)</th>
                  <th className="py-3.5 px-4">Producto & Categoría</th>
                  <th className="py-3.5 px-4 text-center">Stock Actual (Mín)</th>
                  <th className="py-3.5 px-4 text-center">Tags RFID Sinc.</th>
                  <th className="py-3.5 px-4">Ubicación Física</th>
                  <th className="py-3.5 px-4 text-center">Estado Dinámico</th>
                  <th className="py-3.5 px-4 text-center">Acciones Enterprise</th>
                </tr>
              )}
            </thead>

            {/* CUERPO DINÁMICO */}
            <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
              
              {/* RENDERIZADO SI ESTAMOS EN LA PESTAÑA PALLETS */}
              {isPalletsTab ? (
                filteredPallets.length > 0 ? (
                  filteredPallets.map((pallet) => (
                    <tr key={pallet.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-indigo-400 block text-left">{pallet.id}</span>
                        <span className="font-mono text-slate-400 text-[10px] block">{pallet.epc}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">{pallet.name}</td>
                      <td className="py-3.5 px-4 text-center font-black text-cyan-400 text-sm">{pallet.items.length} un</td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2.5 py-1 rounded-md text-[10px] font-bold">
                          {pallet.destination}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[10px]">{pallet.createdAt}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          <button 
                            type="button"
                            onClick={() => handleOpenPalletDetails(pallet)} 
                            className="p-2 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 rounded-xl transition-all"
                            title="Ver detalles y contenido del pallet"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleUnpackPallet(pallet.id)} 
                            className="p-2 bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 rounded-xl transition-all"
                            title="Desarmar Pallet (Los ítems volverán a ser individuales)"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 text-xs font-medium">No hay pallets o kits agrupados registrados.</td>
                  </tr>
                )
              ) : (
                
                /* RENDERIZADO SI ESTAMOS EN INVENTARIO NORMAL (Madefront / Bodega) */
                filteredList.length > 0 ? (
                  filteredList.map((item) => {
                    const min = item.minStock || 5;
                    const isLow = Number(item.stock) <= min;
                    const isSelected = selectedItems.some(i => i.id === item.id);
                    
                    return (
                      <tr key={item.id + item.epc} className={`transition-colors ${isSelected ? 'bg-indigo-500/10' : 'hover:bg-slate-800/50'}`}>
                        <td className="py-3.5 px-4 text-center">
                          <input 
                            type="checkbox" checked={isSelected} onChange={() => handleToggleItem(item)}
                            className="w-4 h-4 rounded border-slate-600 bg-[#0F172A] text-cyan-500 focus:ring-cyan-500 cursor-pointer accent-cyan-500"
                          />
                        </td>
                        <td className="py-3.5 px-2">
                          <button 
                            type="button" onClick={() => onOpenTraceability(item)}
                            className="font-mono font-bold text-cyan-400 hover:underline block text-left" title="Clic para ver Trazabilidad 360°"
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
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            <button 
                              type="button" onClick={() => handleOpenRadar(item)} 
                              className="p-2 bg-amber-500/10 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 rounded-xl transition-all" title="Modo Radar (Búsqueda Activa RFID)"
                            >
                              <Radar className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              type="button" onClick={() => onTransferProduct(item, inventorySubTab)} 
                              className="p-2 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 rounded-xl transition-all" title="Transferir entre almacenes"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              type="button" onClick={() => onRecodeProduct(item)} 
                              className="p-2 bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-400 border border-indigo-500/30 rounded-xl transition-all" title="Re-codificar Tag RFID (Re-encoding)"
                            >
                              <Tag className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              type="button" onClick={() => onDeleteProduct(item, inventorySubTab)} 
                              className="p-2 bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 rounded-xl transition-all" title="Eliminar con trazabilidad inalterable"
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
                    <td colSpan="8" className="py-8 text-center text-slate-400 text-xs font-medium">No se encontraron productos en esta sede que coincidan con la búsqueda.</td>
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