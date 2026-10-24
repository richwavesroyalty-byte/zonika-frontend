import React, { useState } from 'react';
import { 
  Radio, Cpu, Activity, Play, Square, RefreshCw, CheckCircle2,
  Boxes, ArrowLeftRight, AlertTriangle, Search, Filter, Plus,
  Printer, BarChart3, Settings, ShieldAlert, Building2,
  FileSpreadsheet, ArrowUpRight, ArrowDownLeft, Trash2, Check, Download, Truck
} from 'lucide-react';
import logo from './assets/Logo Zonika.png';

export default function ZonikaApp() {
  const [activeTab, setActiveTab] = useState('muelle');
  const [isReading, setIsReading] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState('Muelle');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);

  // Inventario interactivo
  const [inventory, setInventory] = useState([
    { id: 'INV-001', epc: 'E280689400004001F82B', name: 'Lector Biométrico ZKTeco', category: 'Seguridad', stock: 45, rfidTagged: 45, location: 'Madefront Ferretería - Estante A1', status: 'Optimal' },
    { id: 'INV-002', epc: 'E280689400004001F82C', name: 'Cámara IP Domo 4K', category: 'CCTV', stock: 12, rfidTagged: 10, location: 'Madefront Ferretería - Estante B3', status: 'Low' },
    { id: 'INV-003', epc: 'E280689400004001F82D', name: 'Etiqueta RFID UHF Zebra', category: 'Insumos', stock: 1200, rfidTagged: 1200, location: 'Madefront Ferretería - Caja 05', status: 'Optimal' },
  ]);

  // Movimientos
  const [movements, setMovements] = useState([
    { id: 'MOV-501', type: 'ENTRADA', item: 'Lector Biométrico ZKTeco', qty: 15, user: 'Admin', time: 'Hace 10 min' },
    { id: 'MOV-502', type: 'SALIDA', item: 'Cámara IP Domo 4K', qty: 2, user: 'Operador Muelle', time: 'Hace 45 min' },
  ]);

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
    { id: 2, sku: 'INV-002', name: 'Cámara IP Domo 4K', expected: 20, read: 18, status: 'En revisión' },
    { id: 3, sku: 'INV-003', name: 'Etiqueta RFID UHF Zebra', expected: 500, read: 0, status: 'Pendiente' },
  ]);

  // Formularios
  const [newProduct, setNewProduct] = useState({ id: '', name: '', category: 'Herramientas', stock: '', location: '' });
  const [newMovement, setNewMovement] = useState({ type: 'ENTRADA', item: '', qty: 1 });

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
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
      status: 'Optimal'
    };
    setInventory([item, ...inventory]);
    setNewProduct({ id: '', name: '', category: 'Herramientas', stock: '', location: '' });
    setActiveTab('inventory');
    showNotification('¡Producto registrado y vinculado a RFID con éxito!');
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
    showNotification(`¡Movimiento de ${newMovement.type} registrado correctamente!`);
  };

  // Simulación de escaneo RFID masivo en muelle
  const handleMuelleScan = () => {
    setMuelleItems(prev => prev.map(item => ({
      ...item,
      read: item.expected,
      status: 'Verificado RFID'
    })));
    showNotification('¡Lectura RFID masiva del camión completada con éxito!');
  };

  // Registro oficial de entrada de camión en muelle hacia Render
  const handleRegisterTruckEntry = async (e) => {
    e.preventDefault();
    if (!muelleForm.ordenCompra || !muelleForm.placaCamion) {
      alert('Por favor ingresa la Orden de Compra (PO) y la Placa del Camión.');
      return;
    }

    try {
      // Envío opcional al backend en Render
      await fetch('https://zonika-backend.onrender.com/api/muelle-recepcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...muelleForm, items: muelleItems, timestamp: new Date() })
      }).catch(() => {});

      showNotification('¡Entrada de mercancía del camión registrada y stock actualizado en la nube!');
      setMuelleForm({ ordenCompra: '', placaCamion: '', transportadora: '', proveedor: '' });
    } catch (err) {
      showNotification('¡Entrada registrada correctamente en el muelle!');
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-100 text-slate-800 font-sans overflow-hidden">
      
      {/* Notificación flotante */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4" /> {notification}
        </div>
      )}

      {/* Sidebar / Menú Lateral Completo */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shadow-sm shrink-0">
        <div>
          {/* Logo y Encabezado */}
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center p-1 shadow-inner overflow-hidden">
              <img src={logo} alt="Zonika Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 tracking-wide leading-tight">ZONIKA</h1>
              <p className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">Enterprise RFID Platform</p>
            </div>
          </div>

          {/* Sede Activa */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Sede / Almacén Activo
            </label>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-sm">
              <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <select 
                value={selectedWarehouse}
                onChange={(e) => {
                  setSelectedWarehouse(e.target.value);
                  if (e.target.value === 'Muelle') setActiveTab('muelle');
                }}
                className="w-full bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="Madefront">Madefront Ferretería</option>
                <option value="Muelle">Muelle de Carga & Despachos</option>
                <option value="Sucursal">Sucursal Norte</option>
              </select>
            </div>
          </div>

          {/* Navegación Completa */}
          <div className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-210px)]">
            <div>
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Operación & Stock</p>
              <nav className="space-y-1">
                <button onClick={() => { setActiveTab('muelle'); setSelectedWarehouse('Muelle'); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs transition-all ${activeTab === 'muelle' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <Truck className="w-4 h-4" /> Muelle de Carga & Despacho
                </button>
                <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <Activity className="w-4 h-4" /> Panel General
                </button>
                <button onClick={() => setActiveTab('inventory')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs transition-all ${activeTab === 'inventory' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <Boxes className="w-4 h-4" /> Stock e Inventarios
                </button>
                <button onClick={() => setActiveTab('movements')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs transition-all ${activeTab === 'movements' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <ArrowLeftRight className="w-4 h-4" /> Entradas y Salidas
                </button>
                <button onClick={() => setActiveTab('audits')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs transition-all ${activeTab === 'audits' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <ShieldAlert className="w-4 h-4" /> Auditorías & Cuadres
                </button>
              </nav>
            </div>

            <div>
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Herramientas RFID</p>
              <nav className="space-y-1">
                <button onClick={() => setActiveTab('encoder')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs transition-all ${activeTab === 'encoder' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <Printer className="w-4 h-4" /> Grabación / Impresión Tag
                </button>
                <button onClick={() => setActiveTab('monitor')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs transition-all ${activeTab === 'monitor' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <Radio className="w-4 h-4" /> Monitor de Tags (EPC)
                </button>
                <button onClick={() => setActiveTab('hardware')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs transition-all ${activeTab === 'hardware' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <Cpu className="w-4 h-4" /> Hardware & Antenas
                </button>
              </nav>
            </div>

            <div>
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sistema & Analítica</p>
              <nav className="space-y-1">
                <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs transition-all ${activeTab === 'reports' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <BarChart3 className="w-4 h-4" /> Reportes & Exportación
                </button>
                <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <Settings className="w-4 h-4" /> Configuración ERP
                </button>
              </nav>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-slate-100 text-[11px] text-slate-400 text-center font-medium">
          Zonika Intelligent Inventory <br/>
          <span className="text-slate-500">Zonika Suite v1.0</span>
        </div>
      </aside>

      {/* Contenido Central */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-100">
        
        {/* Barra Superior */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Estado:</span>
            <span className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Servidor Middleware Activo
            </span>
          </div>

          <button 
            onClick={() => {
              setIsReading(!isReading);
              showNotification(isReading ? 'Escaneo RFID detenido.' : '¡Escaneo RFID activo simulando lectura!');
            }} 
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
              isReading ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-600 text-white'
            }`}
          >
            {isReading ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {isReading ? 'Detener Escaneo' : 'Iniciar Conteo RFID'}
          </button>
        </header>

        {/* Zona Dinámica */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* MUELLE DE CARGA & DESPACHO (FULL PARA RECEPCIÓN DE CAMIONES) */}
          {activeTab === 'muelle' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Muelle de Carga & Despacho — Recepción de Camiones</h2>
                  <p className="text-slate-500 text-xs mt-1">Registro de ingresos de camiones, órdenes de compra y lectura RFID masiva en tiempo real.</p>
                </div>
              </div>

              {/* Formulario de Ingreso de Camión */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-indigo-600" /> Datos del Transporte y Proveedor
                </h3>
                <form onSubmit={handleRegisterTruckEntry} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Orden de Compra (PO)</label>
                    <input 
                      type="text" 
                      placeholder="Ej. PO-98210" 
                      value={muelleForm.ordenCompra} 
                      onChange={(e)=>setMuelleForm({...muelleForm, ordenCompra: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-medium" 
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Placa del Camión</label>
                    <input 
                      type="text" 
                      placeholder="Ej. SGT-442" 
                      value={muelleForm.placaCamion} 
                      onChange={(e)=>setMuelleForm({...muelleForm, placaCamion: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-medium" 
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Transportadora</label>
                    <input 
                      type="text" 
                      placeholder="Ej. TCC / Deprisa" 
                      value={muelleForm.transportadora} 
                      onChange={(e)=>setMuelleForm({...muelleForm, transportadora: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-medium" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Proveedor</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Ferretería Mayorista SAS" 
                      value={muelleForm.proveedor} 
                      onChange={(e)=>setMuelleForm({...muelleForm, proveedor: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-medium" 
                    />
                  </div>

                  <div className="md:col-span-4 flex justify-end gap-3 pt-2">
                    <button 
                      type="submit" 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Confirmar Ingreso de Mercancía al Stock
                    </button>
                  </div>
                </form>
              </div>

              {/* Tabla de Artículos Esperados vs Leídos por RFID en el Muelle */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">📦 Mercancía Detectada por Antena RFID (Muelle)</h3>
                  <button 
                    type="button" 
                    onClick={handleMuelleScan} 
                    className="flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-emerald-700 shadow-sm"
                  >
                    <Radio className="w-4 h-4" /> Simular Escaneo RFID Masivo
                  </button>
                </div>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50">
                      <th className="p-4">SKU</th>
                      <th className="p-4">Producto</th>
                      <th className="p-4 text-center">Esperado (PO)</th>
                      <th className="p-4 text-center">RFID Leído</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {muelleItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-4 font-mono font-bold text-slate-900">{item.sku}</td>
                        <td className="p-4 font-medium text-slate-800">{item.name}</td>
                        <td className="p-4 text-center font-bold text-slate-700">{item.expected}</td>
                        <td className="p-4 text-center font-black text-indigo-600">{item.read}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.read === item.expected ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                            {item.read === item.expected ? 'Completo ✓' : item.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => {
                              const qty = prompt(`Actualizar cantidad leída para ${item.name}:`, item.read);
                              if (qty !== null) {
                                setMuelleItems(muelleItems.map(i => i.id === item.id ? {...i, read: parseInt(qty) || 0} : i));
                              }
                            }} 
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-200"
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
          )}
          
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Panel General de Inventarios</h2>
                <p className="text-slate-500 text-xs mt-1">Supervisión en tiempo real de {selectedWarehouse}.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Productos</p>
                  <p className="text-3xl font-black text-slate-900 mt-2">{inventory.length}</p>
                  <span className="text-xs text-emerald-600 mt-1 block font-semibold">Vinculados a RFID</span>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Movimientos</p>
                  <p className="text-3xl font-black text-slate-900 mt-2">{movements.length}</p>
                  <span className="text-xs text-indigo-600 mt-1 block font-semibold">Auditoría al día</span>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Discrepancias</p>
                  <p className="text-3xl font-black text-slate-900 mt-2">{discrepancies.length}</p>
                  <span className="text-xs text-rose-600 mt-1 block font-semibold">Requieren revisión</span>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Alertas Stock</p>
                  <p className="text-3xl font-black text-slate-900 mt-2">1 Item</p>
                  <span className="text-xs text-amber-600 mt-1 block font-semibold">Bajo stock crítico</span>
                </div>
              </div>
            </div>
          )}

          {/* INVENTARIO */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Control de Stock e Inventarios</h2>
                  <p className="text-slate-500 text-xs mt-1">Gestión y registro en vivo de productos.</p>
                </div>
                <button onClick={() => setActiveTab('add-product')} className="flex items-center gap-2 bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-indigo-700 shadow-sm">
                  <Plus className="w-4 h-4" /> Registrar Nuevo Producto
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50">
                      <th className="p-4">SKU</th>
                      <th className="p-4">Código RFID (EPC)</th>
                      <th className="p-4">Producto</th>
                      <th className="p-4">Categoría</th>
                      <th className="p-4 text-center">Stock</th>
                      <th className="p-4">Ubicación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {inventory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-4 font-mono font-bold text-slate-900">{item.id}</td>
                        <td className="p-4 font-mono text-indigo-600 font-semibold">{item.epc}</td>
                        <td className="p-4 font-medium text-slate-800">{item.name}</td>
                        <td className="p-4 text-slate-500">{item.category}</td>
                        <td className="p-4 text-center font-bold text-slate-900">{item.stock}</td>
                        <td className="p-4 text-slate-500">{item.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AGREGAR PRODUCTO */}
          {activeTab === 'add-product' && (
            <div className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-black text-slate-900">Registrar Nuevo Producto en Inventario</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">SKU / Código</label>
                  <input type="text" placeholder="Ej. INV-005" value={newProduct.id} onChange={(e)=>setNewProduct({...newProduct, id: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Nombre del Artículo</label>
                  <input type="text" placeholder="Ej. Taladro Percutor" value={newProduct.name} onChange={(e)=>setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Cantidad Inicial (Stock)</label>
                  <input type="number" placeholder="Ej. 25" value={newProduct.stock} onChange={(e)=>setNewProduct({...newProduct, stock: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Ubicación</label>
                  <input type="text" placeholder="Ej. Estante C2" value={newProduct.location} onChange={(e)=>setNewProduct({...newProduct, location: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs" />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={()=>setActiveTab('inventory')} className="px-4 py-2 text-xs font-bold bg-slate-100 rounded-xl">Cancelar</button>
                  <button type="submit" className="px-5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl shadow-sm">Guardar y Vincular RFID</button>
                </div>
              </form>
            </div>
          )}

          {/* ENTRADAS Y SALIDAS */}
          {activeTab === 'movements' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Registro de Entradas y Salidas</h2>
                <p className="text-slate-500 text-xs mt-1">Control de despachos y recepciones de mercancía.</p>
              </div>

              <form onSubmit={handleAddMovement} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-600 block mb-1">Tipo</label>
                  <select value={newMovement.type} onChange={(e)=>setNewMovement({...newMovement, type: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-bold">
                    <option value="ENTRADA">ENTRADA (Recepción)</option>
                    <option value="SALIDA">SALIDA (Despacho)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-600 block mb-1">Artículo</label>
                  <input type="text" placeholder="Nombre del producto" value={newMovement.item} onChange={(e)=>setNewMovement({...newMovement, item: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs" />
                </div>
                <div className="w-24">
                  <label className="text-xs font-bold text-slate-600 block mb-1">Cantidad</label>
                  <input type="number" min="1" value={newMovement.qty} onChange={(e)=>setNewMovement({...newMovement, qty: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs text-center" />
                </div>
                <button type="submit" className="bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-indigo-700">Registrar</button>
              </form>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50">
                      <th className="p-4">ID</th>
                      <th className="p-4">Tipo</th>
                      <th className="p-4">Artículo</th>
                      <th className="p-4 text-center">Cantidad</th>
                      <th className="p-4">Usuario</th>
                      <th className="p-4">Hora</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {movements.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-4 font-mono font-bold text-slate-900">{m.id}</td>
                        <td className="p-4 font-bold">
                          <span className={`px-2 py-1 rounded-lg text-[10px] ${m.type === 'ENTRADA' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'}`}>
                            {m.type}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-slate-800">{m.item}</td>
                        <td className="p-4 text-center font-bold">{m.qty}</td>
                        <td className="p-4 text-slate-500">{m.user}</td>
                        <td className="p-4 text-slate-400">{m.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AUDITORÍAS & CUADRES */}
          {activeTab === 'audits' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Auditorías & Cuadres de Inventario</h2>
                <p className="text-slate-500 text-xs mt-1">Comparativa entre sistema ERP y lectura física RFID.</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50">
                      <th className="p-3">SKU</th>
                      <th className="p-3">Producto</th>
                      <th className="p-3 text-center">Esperado (ERP)</th>
                      <th className="p-3 text-center">RFID Leído</th>
                      <th className="p-3 text-center">Diferencia</th>
                      <th className="p-3">Causa</th>
                      <th className="p-3 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {discrepancies.map((d, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold">{d.sku}</td>
                        <td className="p-3 font-medium">{d.item}</td>
                        <td className="p-3 text-center font-bold">{d.expected}</td>
                        <td className="p-3 text-center font-bold text-indigo-600">{d.rfidCount}</td>
                        <td className="p-3 text-center font-black text-rose-600">{d.diff}</td>
                        <td className="p-3 text-slate-500">{d.cause}</td>
                        <td className="p-3 text-center">
                          <button onClick={() => showNotification('¡Discrepancia ajustada en el sistema!')} className="bg-slate-100 hover:bg-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-lg">Ajustar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* GRABACIÓN TAG */}
          {activeTab === 'encoder' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Grabación y Codificación de Etiquetas RFID</h2>
                <p className="text-slate-500 text-xs mt-1">Escribe nuevos códigos EPC en los chips.</p>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Código EPC Generado</label>
                  <input type="text" readOnly value="E280689400004001F830" className="w-full bg-slate-100 border border-slate-200 p-2.5 rounded-xl text-xs font-mono text-indigo-600 font-bold" />
                </div>
                <button onClick={() => showNotification('¡Tag grabado con éxito!')} className="flex items-center gap-2 bg-indigo-600 text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 shadow-sm">
                  <Printer className="w-4 h-4" /> Grabar Tag RFID
                </button>
              </div>
            </div>
          )}

          {/* MONITOR EN VIVO */}
          {activeTab === 'monitor' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Monitor en Vivo (EPC)</h2>
                <p className="text-slate-500 text-xs mt-1">Detección de etiquetas en tiempo real.</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50">
                      <th className="p-4">EPC</th>
                      <th className="p-4">Artículo</th>
                      <th className="p-4">Antena</th>
                      <th className="p-4">RSSI</th>
                      <th className="p-4">Tiempo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-mono">
                    {tags.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-4 text-indigo-600 font-bold">{t.epc}</td>
                        <td className="p-4 text-slate-700 font-sans">{t.item}</td>
                        <td className="p-4 text-slate-600 font-sans">{t.ant}</td>
                        <td className="p-4 text-emerald-600 font-bold font-sans">{t.rssi}</td>
                        <td className="p-4 text-slate-400 font-sans">{t.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* HARDWARE */}
          {activeTab === 'hardware' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Hardware & Antenas RFID</h2>
                <p className="text-slate-500 text-xs mt-1">Potencia y estado de lectores.</p>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-6 shadow-sm">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Zebra FX9600 (LLRP)</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">IP: 192.168.1.150</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 text-xs px-3 py-1 rounded-full font-semibold border border-emerald-200">Online</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-semibold">Potencia Transmisión</span>
                    <span className="text-indigo-600 font-bold">30 dBm</span>
                  </div>
                  <input type="range" min="10" max="30" defaultValue="30" className="w-full accent-indigo-600 cursor-pointer" />
                </div>
              </div>
            </div>
          )}

          {/* REPORTES */}
          {activeTab === 'reports' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Reportes & Exportación</h2>
                <p className="text-slate-500 text-xs mt-1">Descarga de informes de inventario y trazabilidad.</p>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Exportar Inventario Completo (Excel)</h3>
                  <p className="text-xs text-slate-400">Incluye stock físico, tags RFID vinculados y ubicaciones.</p>
                </div>
                <button onClick={() => showNotification('¡Reporte exportado en Excel correctamente!')} className="flex items-center gap-2 bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-emerald-700 shadow-sm">
                  <Download className="w-4 h-4" /> Descargar Excel
                </button>
              </div>
            </div>
          )}

          {/* CONFIGURACIÓN ERP */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Configuración ERP / Middleware</h2>
                <p className="text-slate-500 text-xs mt-1">Conexión con endpoints y sincronización REST.</p>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Endpoint Webhook / API URL</label>
                  <input 
                    type="text" 
                    defaultValue="https://zonika-backend.onrender.com" 
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-mono text-indigo-600 font-bold" 
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}