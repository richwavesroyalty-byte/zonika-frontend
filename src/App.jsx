import React, { useState } from 'react';
import { 
  Radio, Cpu, Activity, Play, Square, RefreshCw, CheckCircle2,
  Boxes, ArrowLeftRight, AlertTriangle, Search, Filter, Plus,
  Printer, BarChart3, Settings, ShieldAlert, Building2,
  FileSpreadsheet, ArrowUpRight, ArrowDownLeft, Trash2, Check, Download, Truck, PackageCheck, Zap, ClipboardList, Warehouse, Store
} from 'lucide-react';
import logo from './assets/Logo Zonika.png';

export default function ZonikaApp() {
  const [activeTab, setActiveTab] = useState('muelle');
  const [isReading, setIsReading] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState('Muelle de Carga & Despachos');
  const [inventorySubTab, setInventorySubTab] = useState('madefront'); // 'madefront' o 'bodega'
  const [notification, setNotification] = useState(null);

  // 1. Inventario exclusivo de Madefront Ferretería
  const [inventoryMadefront, setInventoryMadefront] = useState([
    { id: 'INV-001', epc: 'E280689400004001F82B', name: 'Lector Biométrico ZKTeco', category: 'Seguridad', stock: 45, rfidTagged: 45, location: 'Madefront Ferretería - Estante A1', status: 'Optimal' },
    { id: 'INV-002', epc: 'E280689400004001F82C', name: 'Cámara IP Domo 4K', category: 'CCTV', stock: 12, rfidTagged: 10, location: 'Madefront Ferretería - Estante B3', status: 'Low' },
  ]);

  // 2. Inventario exclusivo de Bodega Principal
  const [inventoryBodega, setInventoryBodega] = useState([
    { id: 'BOD-501', epc: 'E280689400005009A11F', name: 'Taladro Percutor Industrial 800W', category: 'Herramientas', stock: 120, rfidTagged: 1200, location: 'Bodega Principal - Pasillo 3', status: 'Optimal' },
    { id: 'BOD-502', epc: 'E280689400005009A120', name: 'Etiqueta RFID UHF Zebra', category: 'Insumos', stock: 1200, rfidTagged: 1200, location: 'Bodega Principal - Caja 05', status: 'Optimal' },
  ]);

  // Movimientos
  const [movements, setMovements] = useState([
    { id: 'MOV-501', type: 'ENTRADA', item: 'Lector Biométrico ZKTeco', qty: 15, user: 'Operador', time: 'Hace 10 min' },
    { id: 'MOV-502', type: 'SALIDA', item: 'Cámara IP Domo 4K', qty: 2, user: 'Operador Muelle', time: 'Hace 45 min' },
  ]);

  // Historial de Recepciones de Muelle
  const [muelleHistorial, setMuelleHistorial] = useState([]);

  // Auditorías y discrepancias
  const [discrepancies, setDiscrepancies] = useState([
    { id: 'DISC-101', sku: 'INV-002', item: 'Cámara IP Domo 4K', expected: 12, rfidCount: 10, diff: -2, cause: 'Posible extravío / Sin etiqueta RFID' },
  ]);

  // Monitor de Tags
  const [tags, setTags] = useState([
    { id: 1, epc: 'E280689400004001F82B', item: 'Lector Biométrico ZKTeco', ant: 'Muelle - Puerta Principal', rssi: '-54 dBm', time: 'Hace 2s' },
  ]);

  // Estado para el Muelle de Carga & Despacho (Camiones)
  const [muelleForm, setMuelleForm] = useState({
    ordenCompra: '',
    placaCamion: '',
    transportadora: '',
    proveedor: '',
  });

  const [muelleItems, setMuelleItems] = useState([
    { id: 1, sku: 'INV-001', name: 'Lector Biométrico ZKTeco', expected: 50, read: 0, status: 'Pendiente' },
    { id: 2, sku: 'INV-002', name: 'Cámara IP Domo 4K', expected: 20, read: 0, status: 'Pendiente' },
    { id: 3, sku: 'INV-003', name: 'Etiqueta RFID UHF Zebra', expected: 500, read: 0, status: 'Pendiente' },
  ]);

  // Formularios
  const [newProduct, setNewProduct] = useState({ id: '', name: '', category: 'Herramientas', stock: '', location: '' });
  const [newMovement, setNewMovement] = useState({ type: 'ENTRADA', item: '', qty: 1 });

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Selector superior independiente (Solo cambia el contexto de sede sin alterar la pestaña activa)
  const handleWarehouseChange = (e) => {
    const selected = e.target.value;
    setSelectedWarehouse(selected);
    showNotification(`📍 Sede activa cambiada a: ${selected}`);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.id || !newProduct.name || !newProduct.stock) {
      alert('Por favor completa los campos obligatorios');
      return;
    }
    const item = {
      ...newProduct,
      epc: 'E28068940000' + Math.floor(10000000 + Math.random() * 90000000),
      rfidTagged: parseInt(newProduct.stock),
      status: 'Optimal',
      location: inventorySubTab === 'madefront' ? 'Madefront Ferretería' : 'Bodega Principal'
    };

    if (inventorySubTab === 'madefront') {
      setInventoryMadefront([item, ...inventoryMadefront]);
    } else {
      setInventoryBodega([item, ...inventoryBodega]);
    }

    setNewProduct({ id: '', name: '', category: 'Herramientas', stock: '', location: '' });
    setActiveTab('inventory');
    showNotification('¡Producto registrado y vinculado a la ubicación seleccionada!');
  };

  const handleAddMovement = (e) => {
    e.preventDefault();
    if (!newMovement.item) {
      alert('Escribe el nombre del ítem');
      return;
    }
    const mov = {
      id: 'MOV-' + Math.floor(100 + Math.random() * 900),
      type: newMovement.type,
      item: newMovement.item,
      qty: parseInt(newMovement.qty),
      user: 'Operador Activo',
      time: 'Justo ahora'
    };
    setMovements([mov, ...movements]);
    setNewMovement({ type: 'ENTRADA', item: '', qty: 1 });
    showNotification(`¡Movimiento de ${newMovement.type} registrado correctamente!`);
  };

  // Simulación de escaneo RFID masivo en muelle
  const handleMuelleScan = () => {
    setMuelleItems(prev => prev.map(item => ({
      ...item,
      read: item.expected,
      status: 'Completo ✓'
    })));
    showNotification('📡 ¡Antenas RFID escanearon el camión con éxito en tiempo real!');
  };

  // Registro oficial y almacenamiento en Historial de Muelle
  const handleRegisterTruckEntry = async (e) => {
    e.preventDefault();
    if (!muelleForm.ordenCompra || !muelleForm.placaCamion) {
      alert('Por favor ingresa la Orden de Compra (PO) y la Placa del Camión.');
      return;
    }

    const totalQtyRead = muelleItems.reduce((acc, item) => acc + Number(item.read), 0);

    if (totalQtyRead === 0) {
      alert('No hay artículos leídos por RFID. Ejecute el escaneo o ajuste las cantidades antes de confirmar.');
      return;
    }

    const newRecord = {
      id: 'REC-' + Math.floor(100 + Math.random() * 900),
      ordenCompra: muelleForm.ordenCompra,
      placaCamion: muelleForm.placaCamion,
      transportadora: muelleForm.transportadora || 'N/A',
      proveedor: muelleForm.proveedor || 'N/A',
      timestamp: new Date().toLocaleString(),
      totalItems: totalQtyRead
    };
    setMuelleHistorial(prev => [newRecord, ...prev]);

    // Sumar stock a Madefront Ferretería por defecto al recibir en muelle
    setInventoryMadefront(prevInv => prevInv.map(invItem => {
      const match = muelleItems.find(m => m.sku === invItem.id);
      if (match && match.read > 0) {
        return {
          ...invItem,
          stock: Number(invItem.stock) + Number(match.read),
          rfidTagged: Number(invItem.rfidTagged) + Number(match.read)
        };
      }
      return invItem;
    }));

    const newMov = {
      id: 'MOV-' + Math.floor(1000 + Math.random() * 9000),
      type: 'ENTRADA',
      item: `Recepción Camión PO: ${muelleForm.ordenCompra} (${muelleForm.placaCamion})`,
      qty: totalQtyRead,
      user: 'Operador Muelle',
      time: 'Justo ahora'
    };
    setMovements(prev => [newMov, ...prev]);

    try {
      await fetch('https://zonika-backend.onrender.com/api/muelle-recepcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...muelleForm, items: muelleItems, timestamp: new Date() })
      });
    } catch (err) {}

    showNotification('✅ ¡Ingreso confirmado y registrado con éxito en tiempo real!');
    setMuelleForm({ ordenCompra: '', placaCamion: '', transportadora: '', proveedor: '' });
    setMuelleItems(prev => prev.map(i => ({ ...i, read: 0, status: 'Pendiente' })));
  };

  return (
    <div className="flex h-screen w-screen bg-[#0B1120] text-slate-100 font-sans overflow-hidden">
      
      {/* Notificación flotante */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-cyan-500 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-cyan-300 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Sidebar / Menú Lateral Dark Minimalist */}
      <aside className="w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between p-4 z-10 shrink-0 select-none">
        <div>
          {/* Logo y Encabezado */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-slate-800/80">
            <div className="w-10 h-10 bg-[#1E293B] border border-slate-700 rounded-xl flex items-center justify-center p-1 shadow-inner overflow-hidden">
              <img src={logo} alt="Zonika Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-black text-lg text-white tracking-wide leading-none">ZONIKA</h1>
              <p className="text-[10px] text-cyan-400 font-semibold tracking-widest uppercase mt-0.5">RFID Enterprise</p>
            </div>
          </div>

          {/* Sede Activa (Selector Superior Independiente) */}
          <div className="mb-6 px-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Sede / Almacén Activo
            </label>
            <div className="flex items-center gap-2 bg-[#1E293B] border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200">
              <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <select 
                value={selectedWarehouse}
                onChange={handleWarehouseChange}
                className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="Madefront Ferretería" className="bg-slate-900">Madefront Ferretería</option>
                <option value="Bodega Principal" className="bg-slate-900">Bodega Principal</option>
                <option value="Muelle de Carga & Despachos" className="bg-slate-900">Muelle de Carga & Despachos</option>
              </select>
            </div>
          </div>

          {/* Navegación por Menú Lateral */}
          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-230px)] pr-1">
            <div>
              <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Operación & Stock</p>
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab('muelle')} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    activeTab === 'muelle' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Truck className="w-4 h-4" /> Muelle de Carga & Despacho
                </button>
                <button 
                  onClick={() => setActiveTab('historial_muelle')} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    activeTab === 'historial_muelle' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <ClipboardList className="w-4 h-4" /> Historial de Muelle
                </button>
                <button 
                  onClick={() => setActiveTab('dashboard')} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    activeTab === 'dashboard' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Activity className="w-4 h-4" /> Panel General
                </button>
                <button 
                  onClick={() => setActiveTab('inventory')} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    activeTab === 'inventory' || activeTab === 'add-product' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Boxes className="w-4 h-4" /> Stock e Inventarios
                </button>
                <button 
                  onClick={() => setActiveTab('movements')} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    activeTab === 'movements' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <ArrowLeftRight className="w-4 h-4" /> Entradas y Salidas
                </button>
                <button 
                  onClick={() => setActiveTab('audits')} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    activeTab === 'audits' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" /> Auditorías & Cuadres
                </button>
              </nav>
            </div>

            <div>
              <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Herramientas RFID</p>
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab('encoder')} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    activeTab === 'encoder' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Printer className="w-4 h-4" /> Grabación / Impresión Tag
                </button>
                <button 
                  onClick={() => setActiveTab('monitor')} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    activeTab === 'monitor' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Radio className="w-4 h-4" /> Monitor de Tags (EPC)
                </button>
                <button 
                  onClick={() => setActiveTab('hardware')} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    activeTab === 'hardware' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Cpu className="w-4 h-4" /> Hardware & Antenas
                </button>
              </nav>
            </div>

            <div>
              <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Sistema & Analítica</p>
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab('reports')} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    activeTab === 'reports' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" /> Reportes & Exportación
                </button>
                <button 
                  onClick={() => setActiveTab('settings')} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    activeTab === 'settings' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4" /> Configuración ERP
                </button>
              </nav>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-3 px-2">
          <p className="text-[11px] font-bold text-slate-300">Zonika Intelligent Inventory</p>
          <p className="text-[10px] text-slate-500">Zonika Suite v1.0</p>
        </div>
      </aside>

      {/* Contenido Central */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0B1120]">
        
        {/* Barra Superior */}
        <header className="h-16 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-20 shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ESTADO:</span>
            <span className="flex items-center gap-2 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Servidor Middleware Activo
            </span>
          </div>

          <button 
            onClick={() => {
              const nextState = !isReading;
              setIsReading(nextState);
              showNotification(nextState ? '📡 Escaneo RFID activo simulando lectura...' : '⏹️ Escaneo RFID detenido.');
            }} 
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg ${
              isReading ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 animate-pulse' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isReading ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {isReading ? 'DETENER ESCANEO' : 'INICIAR CONTEO RFID'}
          </button>
        </header>

        {/* Zona Dinámica */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* MUELLE DE CARGA & DESPACHO */}
          {activeTab === 'muelle' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Muelle de Carga & Despacho — Recepción de Camiones</h2>
                <p className="text-slate-400 text-xs mt-1 font-medium">Registro de ingresos de camiones, órdenes de compra y lectura RFID masiva en tiempo real. (Sede actual: {selectedWarehouse})</p>
              </div>

              {/* Formulario de Ingreso de Camión */}
              <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-cyan-400" /> Datos del Transporte y Proveedor
                </h3>
                <form onSubmit={handleRegisterTruckEntry} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Orden de Compra (PO)</label>
                    <input 
                      type="text" 
                      placeholder="Ej. PO-98210" 
                      value={muelleForm.ordenCompra} 
                      onChange={(e)=>setMuelleForm({...muelleForm, ordenCompra: e.target.value})} 
                      className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400" 
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Placa del Camión</label>
                    <input 
                      type="text" 
                      placeholder="Ej. SGT-442" 
                      value={muelleForm.placaCamion} 
                      onChange={(e)=>setMuelleForm({...muelleForm, placaCamion: e.target.value})} 
                      className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400" 
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Transportadora</label>
                    <input 
                      type="text" 
                      placeholder="Ej. TCC / Deprisa" 
                      value={muelleForm.transportadora} 
                      onChange={(e)=>setMuelleForm({...muelleForm, transportadora: e.target.value})} 
                      className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400" 
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Proveedor</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Ferretería Mayorista SAS" 
                      value={muelleForm.proveedor} 
                      onChange={(e)=>setMuelleForm({...muelleForm, proveedor: e.target.value})} 
                      className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400" 
                    />
                  </div>

                  <div className="md:col-span-4 flex justify-end gap-3 pt-2">
                    <button 
                      type="submit" 
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Confirmar Ingreso de Mercancía al Stock
                    </button>
                  </div>
                </form>
              </div>

              {/* Tabla de Artículos Esperados vs Leídos por RFID en el Muelle */}
              <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-cyan-400" /> Mercancía Detectada por Antena RFID (Muelle)
                  </h3>
                  <button 
                    type="button" 
                    onClick={handleMuelleScan} 
                    className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs px-4 py-2 rounded-xl transition-all"
                  >
                    <Zap className="w-4 h-4" /> Simular Escaneo RFID Masivo
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">SKU</th>
                        <th className="py-3 px-4">Producto</th>
                        <th className="py-3 px-4 text-center">Esperado (PO)</th>
                        <th className="py-3 px-4 text-center">RFID Leído</th>
                        <th className="py-3 px-4 text-center">Estado</th>
                        <th className="py-3 px-4 text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200 font-medium">
                      {muelleItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{item.sku}</td>
                          <td className="py-3.5 px-4 font-semibold text-white">{item.name}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-slate-300">{item.expected}</td>
                          <td className="py-3.5 px-4 text-center font-black text-cyan-400 text-sm">{item.read}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                              item.read === item.expected && item.expected > 0
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                : item.read > 0 
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>
                              {item.read === item.expected && item.expected > 0 ? 'Completo ✓' : item.read > 0 ? 'Parcial' : item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button 
                              type="button"
                              onClick={() => {
                                const qty = prompt(`Actualizar cantidad leída para ${item.name}:`, item.read);
                                if (qty !== null && !isNaN(qty)) {
                                  const val = parseInt(qty);
                                  setMuelleItems(muelleItems.map(i => i.id === item.id ? {
                                    ...i, 
                                    read: val,
                                    status: val === i.expected ? 'Completo ✓' : 'Ajustado Manual'
                                  } : i));
                                  showNotification(`Cantidad de ${item.name} ajustada a ${val}`);
                                }
                              }} 
                              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                            >
                              Ajustar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* HISTORIAL DE MUELLE */}
          {activeTab === 'historial_muelle' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Historial de Recepciones en Muelle</h2>
                <p className="text-slate-400 text-xs mt-1 font-medium">Registro detallado de todos los camiones procesados e ingresados al inventario.</p>
              </div>

              <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-cyan-400" /> Registro Histórico de Entradas
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">Total Registros: {muelleHistorial.length}</span>
                </div>

                {muelleHistorial.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No hay recepciones registradas aún. Ingresa un camión desde el Muelle de Carga para ver el historial real.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-400 uppercase text-[10px] tracking-wider">
                          <th className="py-3 px-4">ID Recepción</th>
                          <th className="py-3 px-4">Orden Compra (PO)</th>
                          <th className="py-3 px-4">Placa Camión</th>
                          <th className="py-3 px-4">Transportadora</th>
                          <th className="py-3 px-4">Proveedor</th>
                          <th className="py-3 px-4 text-center">Total Ítems Leídos</th>
                          <th className="py-3 px-4">Fecha y Hora</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-200 font-medium">
                        {muelleHistorial.map((rec) => (
                          <tr key={rec.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{rec.id}</td>
                            <td className="py-3.5 px-4 font-mono font-semibold text-white">{rec.ordenCompra}</td>
                            <td className="py-3.5 px-4 font-bold text-emerald-400">{rec.placaCamion}</td>
                            <td className="py-3.5 px-4 text-slate-300">{rec.transportadora}</td>
                            <td className="py-3.5 px-4 text-slate-300">{rec.proveedor}</td>
                            <td className="py-3.5 px-4 text-center font-black text-cyan-400 text-sm">{rec.totalItems}</td>
                            <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{rec.timestamp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Panel General de Inventarios</h2>
                <p className="text-slate-400 text-xs mt-1 font-medium">Supervisión en tiempo real (Sede activa: {selectedWarehouse}).</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-md">
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Total Productos Ferretería</p>
                  <p className="text-4xl font-black text-white mt-2">{inventoryMadefront.length}</p>
                  <span className="text-[10px] text-emerald-400 mt-1 block font-semibold uppercase">Vinculados a RFID</span>
                </div>
                <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-md">
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Total Productos Bodega</p>
                  <p className="text-4xl font-black text-cyan-400 mt-2">{inventoryBodega.length}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block font-semibold uppercase">Almacén Principal</span>
                </div>
                <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-md">
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Movimientos</p>
                  <p className="text-4xl font-black text-cyan-400 mt-2">{movements.length}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block font-semibold uppercase">Auditoría al día</span>
                </div>
                <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-md">
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Discrepancias</p>
                  <p className="text-4xl font-black text-amber-400 mt-2">{discrepancies.length}</p>
                  <span className="text-[10px] text-amber-400 mt-1 block font-semibold uppercase">Requieren revisión</span>
                </div>
              </div>
            </div>
          )}

          {/* INVENTARIO SEPARADO */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Control de Stock e Inventarios</h2>
                  <p className="text-slate-400 text-xs mt-1 font-medium">Gestión separada por ubicación física para mayor precisión. (Contexto: {selectedWarehouse})</p>
                </div>
                <button onClick={() => setActiveTab('add-product')} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg">
                  <Plus className="w-4 h-4" /> Registrar Nuevo Producto
                </button>
              </div>

              {/* Botones de alternancia: Ferretería vs Bodega */}
              <div className="flex gap-3">
                <button 
                  onClick={() => setInventorySubTab('madefront')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    inventorySubTab === 'madefront' 
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                      : 'bg-[#1E293B] text-slate-300 border border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <Store className="w-4 h-4" /> Madefront Ferretería ({inventoryMadefront.length} ítems)
                </button>
                <button 
                  onClick={() => setInventorySubTab('bodega')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    inventorySubTab === 'bodega' 
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                      : 'bg-[#1E293B] text-slate-300 border border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <Warehouse className="w-4 h-4" /> Bodega Principal ({inventoryBodega.length} ítems)
                </button>
              </div>

              <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 bg-slate-900/50 border-b border-slate-700 flex justify-between items-center">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    {inventorySubTab === 'madefront' ? '📍 Ubicación Activa: Madefront Ferretería' : '📍 Ubicación Activa: Bodega Principal'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Total Registros: {inventorySubTab === 'madefront' ? inventoryMadefront.length : inventoryBodega.length}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-wider bg-slate-900/30">
                        <th className="py-3 px-4">SKU</th>
                        <th className="py-3 px-4">Código RFID (EPC)</th>
                        <th className="py-3 px-4">Producto</th>
                        <th className="py-3 px-4">Categoría</th>
                        <th className="py-3 px-4 text-center">Stock</th>
                        <th className="py-3 px-4">Ubicación Detallada</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
                      {(inventorySubTab === 'madefront' ? inventoryMadefront : inventoryBodega).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{item.id}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-400">{item.epc}</td>
                          <td className="py-3.5 px-4 font-semibold text-white">{item.name}</td>
                          <td className="py-3.5 px-4 text-slate-400">{item.category}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-white">{item.stock}</td>
                          <td className="py-3.5 px-4 text-slate-400">{item.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* AGREGAR PRODUCTO */}
          {activeTab === 'add-product' && (
            <div className="space-y-6 max-w-2xl mx-auto bg-[#1E293B] border border-slate-700/60 p-8 rounded-2xl shadow-xl">
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Registrar Nuevo Producto en Inventario</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">SKU / Código</label>
                  <input type="text" placeholder="Ej. INV-005" value={newProduct.id} onChange={(e)=>setNewProduct({...newProduct, id: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400" required />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Nombre del Artículo</label>
                  <input type="text" placeholder="Ej. Taladro Percutor" value={newProduct.name} onChange={(e)=>setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400" required />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Cantidad Inicial (Stock)</label>
                  <input type="number" placeholder="Ej. 25" value={newProduct.stock} onChange={(e)=>setNewProduct({...newProduct, stock: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400" required />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Ubicación Específica</label>
                  <input type="text" placeholder="Ej. Estante C2" value={newProduct.location} onChange={(e)=>setNewProduct({...newProduct, location: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400" />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={()=>setActiveTab('inventory')} className="px-5 py-2.5 text-xs font-bold bg-slate-800 text-slate-300 rounded-xl">Cancelar</button>
                  <button type="submit" className="px-5 py-2.5 text-xs font-bold bg-cyan-500 text-slate-950 rounded-xl shadow-lg shadow-cyan-500/20">Guardar en {inventorySubTab === 'madefront' ? 'Madefront' : 'Bodega'}</button>
                </div>
              </form>
            </div>
          )}

          {/* ENTRADAS Y SALIDAS */}
          {activeTab === 'movements' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Registro de Entradas y Salidas</h2>
                <p className="text-slate-400 text-xs mt-1 font-medium">Control de despachos y recepciones de mercancía.</p>
              </div>

              <form onSubmit={handleAddMovement} className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-xl flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Tipo</label>
                  <select value={newMovement.type} onChange={(e)=>setNewMovement({...newMovement, type: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 p-2.5 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-cyan-400">
                    <option value="ENTRADA">ENTRADA (Recepción)</option>
                    <option value="SALIDA">SALIDA (Despacho)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Artículo</label>
                  <input type="text" placeholder="Nombre del producto" value={newMovement.item} onChange={(e)=>setNewMovement({...newMovement, item: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400" required />
                </div>
                <div className="w-24">
                  <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Cantidad</label>
                  <input type="number" min="1" value={newMovement.qty} onChange={(e)=>setNewMovement({...newMovement, qty: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 p-2.5 rounded-xl text-xs text-center text-white focus:outline-none focus:border-cyan-400" required />
                </div>
                <button type="submit" className="bg-cyan-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg hover:bg-cyan-400">Registrar</button>
              </form>

              <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-wider bg-slate-900/40">
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">Tipo</th>
                        <th className="py-3 px-4">Artículo</th>
                        <th className="py-3 px-4 text-center">Cantidad</th>
                        <th className="py-3 px-4">Usuario</th>
                        <th className="py-3 px-4">Hora</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
                      {movements.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{m.id}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${m.type === 'ENTRADA' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                              {m.type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-white">{m.item}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-white">{m.qty}</td>
                          <td className="py-3.5 px-4 text-slate-400">{m.user}</td>
                          <td className="py-3.5 px-4 text-slate-500">{m.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* OTRAS PESTAÑAS */}
          {activeTab === 'audits' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <h2 className="text-2xl font-black text-white tracking-tight">Auditorías & Discrepancias</h2>
              <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">ID Auditoría</th>
                        <th className="py-3 px-4">Producto</th>
                        <th className="py-3 px-4 text-center">Teórico</th>
                        <th className="py-3 px-4 text-center">RFID Contado</th>
                        <th className="py-3 px-4 text-center">Diferencia</th>
                        <th className="py-3 px-4">Causa Estimada</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200 font-medium">
                      {discrepancies.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-cyan-400 font-bold">{d.id}</td>
                          <td className="py-3.5 px-4 font-semibold text-white">{d.item}</td>
                          <td className="py-3.5 px-4 text-center font-bold">{d.expected}</td>
                          <td className="py-3.5 px-4 text-center text-cyan-400 font-bold">{d.rfidCount}</td>
                          <td className="py-3.5 px-4 text-center text-amber-400 font-black">{d.diff}</td>
                          <td className="py-3.5 px-4 text-slate-400">{d.cause}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'monitor' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <h2 className="text-2xl font-black text-white tracking-tight">Monitor de Lectura de EPCs</h2>
              <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl">
                <div className="space-y-2">
                  {tags.map((t) => (
                    <div key={t.id} className="flex justify-between items-center bg-[#0F172A] border border-slate-800 p-4 rounded-xl font-mono text-xs">
                      <div>
                        <span className="text-cyan-400 font-bold block">{t.epc}</span>
                        <span className="text-slate-400 text-[11px]">{t.item}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 font-semibold block">{t.ant}</span>
                        <span className="text-slate-500 text-[10px]">{t.rssi} | {t.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hardware' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <h2 className="text-2xl font-black text-white tracking-tight">Hardware & Antenas Conectadas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs uppercase text-white">Lector Fijo Zebra FX9600</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30 font-bold">ONLINE</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">IP: 192.168.1.150 | Antenas: 4 Activas</p>
                </div>
                <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs uppercase text-white">Colector Chainway C66</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30 font-bold">ONLINE</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">IP: 192.168.1.182 | Modo: Handheld RFID</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'encoder' && (
            <div className="space-y-6 max-w-2xl mx-auto bg-[#1E293B] border border-slate-700/60 p-8 rounded-2xl shadow-xl">
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Grabación e Impresión de Tags RFID</h2>
              <p className="text-xs text-slate-400">Generación y escritura masiva de códigos EPC en etiquetas UHF.</p>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <h2 className="text-2xl font-black text-white tracking-tight">Reportes & Exportación</h2>
              <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl">
                <p className="text-xs text-slate-400">Exporta historiales de inventario y lecturas RFID a Excel o CSV.</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl mx-auto bg-[#1E293B] border border-slate-700/60 p-8 rounded-2xl shadow-xl">
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Configuración ERP y Middleware</h2>
              <p className="text-xs text-slate-400">Parámetros de conexión con antenas y servicios en Render.</p>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}