import React, { useState, useEffect } from 'react';
import { 
  Radio, Cpu, Activity, Play, Square, CheckCircle2,
  Boxes, ArrowLeftRight, AlertTriangle, Plus,
  Printer, BarChart3, Settings, ShieldAlert, Building2,
  Trash2, Truck, PackageCheck, Zap, ClipboardList, Warehouse, Store, MapPin,
  Lock, Mail, LogOut, Shield, TrendingUp, TrendingDown, Sparkles, Download, FileText,
  Calendar, Clock, UserCheck, AlertOctagon, Filter, X, Eye, RefreshCw
} from 'lucide-react';
import logoIsotipo from './assets/Logo Isotipo.png';

export default function ZonikaApp() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('zonika_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isReading, setIsReading] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState('Muelle de Carga & Despachos');
  const [inventorySubTab, setInventorySubTab] = useState('madefront');
  const [notification, setNotification] = useState(null);

  const [liveActivityFlow, setLiveActivityFlow] = useState([15, 28, 42, 35, 60, 50, 75]);
  const [selectedOperatorDate, setSelectedOperatorDate] = useState('2026-10-24');
  const [selectedOperatorDetails, setSelectedOperatorDetails] = useState(null);

  const [reportDateRange, setReportDateRange] = useState('month');
  const [reportWarehouseFilter, setReportWarehouseFilter] = useState('all');

  useEffect(() => {
    let interval;
    if (isReading) {
      interval = setInterval(() => {
        setLiveActivityFlow(prev => {
          const nextVal = Math.floor(40 + Math.random() * 60);
          return [...prev.slice(1), nextVal];
        });
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isReading]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.roleKey === 'muelle') {
        setActiveTab('muelle');
        setSelectedWarehouse('Muelle de Carga & Despachos');
      } else if (currentUser.roleKey === 'bodega') {
        setActiveTab('inventory');
        setSelectedWarehouse('Madefront Ferretería');
      } else {
        if (activeTab === 'login') setActiveTab('dashboard');
      }
    }
  }, [currentUser]);

  const [inventoryMadefront, setInventoryMadefront] = useState(() => {
    const saved = localStorage.getItem('zonika_inv_madefront');
    return saved ? JSON.parse(saved) : [
      { id: 'INV-001', epc: 'E280689400004001F82B', name: 'Lector Biométrico ZKTeco', category: 'Seguridad', stock: 45, rfidTagged: 45, location: 'Madefront Ferretería - Estante A1', status: 'Optimal' },
      { id: 'INV-002', epc: 'E280689400004001F82C', name: 'Cámara IP Domo 4K', category: 'CCTV', stock: 12, rfidTagged: 10, location: 'Madefront Ferretería - Estante B3', status: 'Low' },
    ];
  });

  const [inventoryBodega, setInventoryBodega] = useState(() => {
    const saved = localStorage.getItem('zonika_inv_bodega');
    return saved ? JSON.parse(saved) : [
      { id: 'BOD-501', epc: 'E280689400005009A11F', name: 'Taladro Percutor Industrial 800W', category: 'Herramientas', stock: 120, rfidTagged: 1200, location: 'Bodega Principal - Pasillo 3', status: 'Optimal' },
      { id: 'BOD-502', epc: 'E280689400005009A120', name: 'Etiqueta RFID UHF Zebra', category: 'Insumos', stock: 1200, rfidTagged: 1200, location: 'Bodega Principal - Caja 05', status: 'Optimal' },
    ];
  });

  const [movements, setMovements] = useState(() => {
    const saved = localStorage.getItem('zonika_movements');
    return saved ? JSON.parse(saved) : [
      { id: 'MOV-501', type: 'ENTRADA', item: 'Lector Biométrico ZKTeco', qty: 15, user: 'Carlos Mendoza (Admin)', time: 'Hace 10 min' },
      { id: 'MOV-502', type: 'SALIDA', item: 'Cámara IP Domo 4K', qty: 2, user: 'Juan Pérez (Muelle)', time: 'Hace 45 min' },
    ];
  });

  const [muelleHistorial, setMuelleHistorial] = useState(() => {
    const saved = localStorage.getItem('zonika_muelle_historial');
    return saved ? JSON.parse(saved) : [
      { id: 'REC-892', ordenCompra: 'PO-44102', placaCamion: 'SGT-881', transportadora: 'TCC Carga', proveedor: 'Ferretería Mayorista SAS', timestamp: '23/10/2026, 09:15:22 a.m.', totalItems: 250, operator: 'Juan Pérez' },
      { id: 'REC-304', ordenCompra: 'PO-98210', placaCamion: 'WXYZ-12', transportadora: 'Deprisa Logística', proveedor: 'Seguridad Global Andina', timestamp: '23/10/2026, 02:40:10 p.m.', totalItems: 50, operator: 'Carlos Mendoza' },
    ];
  });

  const [discrepancies, setDiscrepancies] = useState([
    { id: 'DISC-101', sku: 'INV-002', item: 'Cámara IP Domo 4K', expected: 12, rfidCount: 10, diff: -2, location: 'Madefront Ferretería - Estante B3', cause: 'Posible extravío / Sin etiqueta RFID' },
  ]);

  const historicalOperatorData = {
    '2026-10-24': [
      { 
        id: 'OP-01', name: 'Juan Pérez', role: 'Operador de Muelle', tasksCompleted: 42, efficiency: '96%', status: 'Excelente',
        hourlyLog: [
          { time: '08:15 a.m.', type: 'Recepción Muelle', detail: 'Ingreso Camión SGT-881 (250 ítems)', location: 'Muelle de Carga' },
          { time: '09:40 a.m.', type: 'Escaneo RFID', detail: 'Validación de 18 Cámaras Domo 4K', location: 'Muelle de Carga' },
          { time: '11:10 a.m.', type: 'Despacho Stock', detail: 'Salida de 2 unidades Cámara IP Domo 4K', location: 'Bodega Principal' },
        ]
      },
      { 
        id: 'OP-02', name: 'Sonia Gómez', role: 'Encargada de Inventario', tasksCompleted: 38, efficiency: '92%', status: 'Óptimo',
        hourlyLog: [
          { time: '08:30 a.m.', type: 'Codificación RFID', detail: 'Grabar y pegar 45 tags para Lectores ZKTeco', location: 'Madefront Ferretería' },
        ]
      },
      { 
        id: 'OP-03', name: 'Carlos Mendoza', role: 'Administrador (Gerente)', tasksCompleted: 65, efficiency: '99%', status: 'Sobresaliente',
        hourlyLog: [
          { time: '07:45 a.m.', type: 'Apertura Sistema', detail: 'Verificación Middleware y Antenas RFID', location: 'General' },
        ]
      }
    ]
  };

  const currentOperatorsList = historicalOperatorData[selectedOperatorDate] || [];

  const [cycleTimes] = useState([
    { truckId: 'REC-892', plate: 'SGT-881', provider: 'Ferretería Mayorista SAS', arrivalTime: '09:00 a.m.', scanTime: '09:15 a.m.', leadTime: '15 Minutos', status: 'Rápido' },
    { truckId: 'REC-304', plate: 'WXYZ-12', provider: 'Seguridad Global Andina', arrivalTime: '02:00 p.m.', scanTime: '02:40 p.m.', leadTime: '40 Minutos', status: 'Revisión Manual' },
  ]);

  const [stockoutForecast] = useState([
    { sku: 'INV-002', name: 'Cámara IP Domo 4K', currentStock: 12, dailyConsumption: 3, daysLeft: 4, risk: 'CRÍTICO (Reordenar ya)' },
    { sku: 'INV-001', name: 'Lector Biométrico ZKTeco', currentStock: 45, dailyConsumption: 5, daysLeft: 9, risk: 'Moderado' },
  ]);

  const [muelleForm, setMuelleForm] = useState({ ordenCompra: '', placaCamion: '', transportadora: '', proveedor: '' });
  const [muelleItems, setMuelleItems] = useState([
    { id: 1, sku: 'INV-001', name: 'Lector Biométrico ZKTeco', expected: 50, read: 0, status: 'Pendiente' },
    { id: 2, sku: 'INV-002', name: 'Cámara IP Domo 4K', expected: 20, read: 0, status: 'Pendiente' },
  ]);

  const [newProduct, setNewProduct] = useState({ id: '', name: '', category: 'Herramientas', stock: '', location: '' });
  const [newMovement, setNewMovement] = useState({ type: 'ENTRADA', item: '', qty: 1 });

  useEffect(() => {
    localStorage.setItem('zonika_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('zonika_inv_madefront', JSON.stringify(inventoryMadefront));
  }, [inventoryMadefront]);

  useEffect(() => {
    localStorage.setItem('zonika_inv_bodega', JSON.stringify(inventoryBodega));
  }, [inventoryBodega]);

  useEffect(() => {
    localStorage.setItem('zonika_movements', JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem('zonika_muelle_historial', JSON.stringify(muelleHistorial));
  }, [muelleHistorial]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    const email = loginForm.email.toLowerCase();
    const pass = loginForm.password;

    let matchedUser = null;
    if (email === 'admin@zonika.com' && pass === 'admin123') {
      matchedUser = { name: 'Carlos Mendoza', role: 'Administrador (Gerente)', roleKey: 'admin' };
    } else if (email === 'muelle@zonika.com' && pass === 'muelle123') {
      matchedUser = { name: 'Juan Pérez', role: 'Operador de Muelle', roleKey: 'muelle' };
    } else if (email === 'bodega@zonika.com' && pass === 'bodega123') {
      matchedUser = { name: 'Sonia Gómez', role: 'Encargada de Bodega', roleKey: 'bodega' };
    }

    if (matchedUser) {
      setCurrentUser(matchedUser);
      showNotification(`👋 ¡Bienvenido, ${matchedUser.name}!`);
    } else {
      setLoginError('Credenciales incorrectas. Usa los botones de acceso rápido.');
    }
  };

  const handleQuickLogin = (roleType) => {
    if (roleType === 'admin') {
      setLoginForm({ email: 'admin@zonika.com', password: 'admin123' });
      setCurrentUser({ name: 'Carlos Mendoza', role: 'Administrador (Gerente)', roleKey: 'admin' });
    } else if (roleType === 'muelle') {
      setLoginForm({ email: 'muelle@zonika.com', password: 'muelle123' });
      setCurrentUser({ name: 'Juan Pérez', role: 'Operador de Muelle', roleKey: 'muelle' });
    } else if (roleType === 'bodega') {
      setLoginForm({ email: 'bodega@zonika.com', password: 'bodega123' });
      setCurrentUser({ name: 'Sonia Gómez', role: 'Encargada de Bodega', roleKey: 'bodega' });
    }
    showNotification('🚀 ¡Acceso rápido concedido!');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('zonika_current_user');
    showNotification('🔒 Sesión cerrada.');
  };

  const hasAccess = (moduleKey) => {
    if (!currentUser) return false;
    if (currentUser.roleKey === 'admin') return true; // Administrador tiene acceso absoluto a todo

    const rolePermissions = {
      muelle: ['muelle', 'historial_muelle', 'monitor'],
      bodega: ['inventory', 'add-product', 'movements', 'encoder', 'monitor']
    };

    return rolePermissions[currentUser.roleKey]?.includes(moduleKey) || false;
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.id || !newProduct.name || !newProduct.stock) return;
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
    showNotification('¡Producto registrado con éxito!');
  };

  const handleAddMovement = (e) => {
    e.preventDefault();
    if (!newMovement.item) return;
    const mov = {
      id: 'MOV-' + Math.floor(100 + Math.random() * 900),
      type: newMovement.type,
      item: newMovement.item,
      qty: parseInt(newMovement.qty),
      user: currentUser.name,
      time: 'Justo ahora'
    };
    setMovements([mov, ...movements]);
    setNewMovement({ type: 'ENTRADA', item: '', qty: 1 });
    showNotification(`¡Movimiento registrado con éxito!`);
  };

  const handleRegisterTruckEntry = (e) => {
    e.preventDefault();
    if (!muelleForm.ordenCompra || !muelleForm.placaCamion) return;
    const totalQtyRead = muelleItems.reduce((acc, item) => acc + Number(item.read), 0);
    const newRecord = {
      id: 'REC-' + Math.floor(100 + Math.random() * 900),
      ordenCompra: muelleForm.ordenCompra,
      placaCamion: muelleForm.placaCamion,
      transportadora: muelleForm.transportadora || 'N/A',
      proveedor: muelleForm.proveedor || 'N/A',
      timestamp: new Date().toLocaleString(),
      totalItems: totalQtyRead || 150,
      operator: currentUser.name
    };
    setMuelleHistorial([newRecord, ...muelleHistorial]);
    setMuelleForm({ ordenCompra: '', placaCamion: '', transportadora: '', proveedor: '' });
    showNotification('✅ ¡Ingreso de camión confirmado y registrado en historial!');
  };

  const totalStockMadefront = inventoryMadefront.reduce((acc, item) => acc + Number(item.stock), 0);
  const totalStockBodega = inventoryBodega.reduce((acc, item) => acc + Number(item.stock), 0);

  if (!currentUser) {
    return (
      <div className="flex h-screen w-screen bg-[#0B1120] text-slate-100 font-sans items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-[#1E293B] border border-slate-700 rounded-2xl flex items-center justify-center p-3 mx-auto shadow-inner">
              <img src={logoIsotipo} alt="Zonika" className="w-full h-full object-contain" />
            </div>
            <h1 className="font-black text-2xl text-white tracking-wider">ZONIKA RFID</h1>
            <p className="text-slate-400 text-xs">Sistema de Gestión Logística Enterprise</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && <p className="text-red-400 text-xs text-center font-bold bg-red-500/10 p-2 rounded-xl border border-red-500/20">{loginError}</p>}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Correo Electrónico</label>
              <input type="email" placeholder="admin@zonika.com" value={loginForm.email} onChange={(e)=>setLoginForm({...loginForm, email: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contraseña</label>
              <input type="password" placeholder="••••••••" value={loginForm.password} onChange={(e)=>setLoginForm({...loginForm, password: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500" required />
            </div>
            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs py-3.5 rounded-xl uppercase tracking-wider shadow-lg transition-all">Iniciar Sesión</button>
          </form>

          {/* Botones de Acceso Rápido con 1 Clic */}
          <div className="border-t border-slate-800 pt-4 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Acceso Rápido con 1 Clic:</p>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => handleQuickLogin('admin')} className="bg-[#1E293B] hover:bg-cyan-500/20 hover:text-cyan-400 border border-slate-700 text-slate-300 p-2.5 rounded-xl text-[10px] font-bold text-center transition-all">🔑 Admin</button>
              <button type="button" onClick={() => handleQuickLogin('muelle')} className="bg-[#1E293B] hover:bg-cyan-500/20 hover:text-cyan-400 border border-slate-700 text-slate-300 p-2.5 rounded-xl text-[10px] font-bold text-center transition-all">🚚 Muelle</button>
              <button type="button" onClick={() => handleQuickLogin('bodega')} className="bg-[#1E293B] hover:bg-cyan-500/20 hover:text-cyan-400 border border-slate-700 text-slate-300 p-2.5 rounded-xl text-[10px] font-bold text-center transition-all">📦 Bodega</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-[#0B1120] text-slate-100 font-sans overflow-hidden">
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-cyan-500 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-cyan-300 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Modal Desglose Operador */}
      {selectedOperatorDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white">{selectedOperatorDetails.name} — Desglose</h3>
              <button onClick={() => setSelectedOperatorDetails(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedOperatorDetails.hourlyLog.map((l, i) => (
                <div key={i} className="bg-[#1E293B] p-3 rounded-xl text-xs space-y-1">
                  <span className="text-cyan-400 font-mono font-bold">{l.time} - {l.type}</span>
                  <p className="text-slate-300">{l.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Completo con Permisos */}
      <aside className="w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between p-4 z-10 shrink-0">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 mb-5 border-b border-slate-800">
            <img src={logoIsotipo} alt="Zonika" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="font-black text-lg text-white tracking-wider">ZONIKA</h1>
              <span className="text-[10px] text-cyan-400 font-semibold">{currentUser.name}</span>
            </div>
          </div>
          <nav className="space-y-1">
            {hasAccess('dashboard') && (
              <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs ${activeTab === 'dashboard' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}>
                <Activity className="w-4 h-4" /> Panel General
              </button>
            )}
            {hasAccess('inventory') && (
              <button onClick={() => setActiveTab('inventory')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs ${activeTab === 'inventory' || activeTab === 'add-product' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}>
                <Boxes className="w-4 h-4" /> Stock e Inventarios
              </button>
            )}
            {hasAccess('muelle') && (
              <button onClick={() => setActiveTab('muelle')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs ${activeTab === 'muelle' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}>
                <Truck className="w-4 h-4" /> Recepción en Muelle
              </button>
            )}
            {hasAccess('historial_muelle') && (
              <button onClick={() => setActiveTab('historial_muelle')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs ${activeTab === 'historial_muelle' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}>
                <ClipboardList className="w-4 h-4" /> Historial de Muelle
              </button>
            )}
            {hasAccess('movements') && (
              <button onClick={() => setActiveTab('movements')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs ${activeTab === 'movements' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}>
                <ArrowLeftRight className="w-4 h-4" /> Entradas y Salidas
              </button>
            )}
            {hasAccess('encoder') && (
              <button onClick={() => setActiveTab('encoder')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs ${activeTab === 'encoder' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}>
                <Printer className="w-4 h-4" /> Grabación / Impresión Tag
              </button>
            )}
            {hasAccess('reports') && (
              <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs ${activeTab === 'reports' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}>
                <BarChart3 className="w-4 h-4" /> Reportes & Analítica
              </button>
            )}
          </nav>
        </div>
        <button onClick={handleLogout} className="text-red-400 text-xs font-bold flex items-center gap-2 p-2 hover:bg-slate-800 rounded-xl transition-colors">
          <LogOut className="w-4 h-4" /> Cerrar Sesión
        </button>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#0B1120]">
        <header className="h-16 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-20">
          <span className="flex items-center gap-2 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Servidor Middleware Activo
          </span>
          <button onClick={() => { setIsReading(!isReading); showNotification(!isReading ? '📡 Escaneo RFID activo...' : '⏹️ Escaneo detenido.'); }} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg ${isReading ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-emerald-500 text-slate-950'}`}>
            {isReading ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {isReading ? 'DETENER ESCANEO' : 'INICIAR CONTEO RFID'}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          
          {/* DASHBOARD COMMAND CENTER */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-6xl mx-auto pb-12">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Centro de Control General (Command Center)</h2>
                <p className="text-slate-400 text-xs mt-1 font-medium">Supervisión gerencial en tiempo real de antenas, stock, flujos RFID y alertas de mermas.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-md space-y-2">
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Stock Madefront</p>
                  <p className="text-4xl font-black text-white">{totalStockMadefront} <span className="text-xs font-normal text-slate-400">unidades</span></p>
                  <span className="text-[10px] text-emerald-400 block font-semibold uppercase">{inventoryMadefront.length} referencias</span>
                </div>
                <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-md space-y-2">
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Stock Bodega</p>
                  <p className="text-4xl font-black text-cyan-400">{totalStockBodega} <span className="text-xs font-normal text-slate-400">unidades</span></p>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">{inventoryBodega.length} referencias</span>
                </div>
                <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-md space-y-2">
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Movimientos</p>
                  <p className="text-4xl font-black text-cyan-400">{movements.length}</p>
                  <span className="text-[10px] text-emerald-400 block font-semibold uppercase">Auditoría al día</span>
                </div>
                <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-md space-y-2">
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Discrepancias</p>
                  <p className="text-4xl font-black text-amber-400">{discrepancies.length}</p>
                  <span className="text-[10px] text-amber-400 block font-semibold uppercase">Requieren revisión</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Radio className="w-4 h-4 text-cyan-400 animate-pulse" /> Flujo de Lecturas RFID por Minuto (En Vivo)
                    </h3>
                    <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2.5 py-1 rounded-full font-bold">
                      {isReading ? '🔴 Transmitiendo' : '⏸️ En Pausa'}
                    </span>
                  </div>
                  <div className="h-36 flex items-end gap-3 pt-6 px-2 bg-[#0F172A] border border-slate-800 rounded-xl">
                    {liveActivityFlow.map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <span className="text-[9px] font-mono text-cyan-400">{val}</span>
                        <div className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-md transition-all duration-500" style={{ height: `${val}%` }}></div>
                        <span className="text-[9px] text-slate-500 font-mono">m{idx+1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4 flex flex-col justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" /> Estado de Antenas & Hardware
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-[#0F172A] border border-slate-800 p-3 rounded-xl text-xs">
                      <div>
                        <span className="text-white font-bold block">Zebra FX9600 (Muelle)</span>
                        <span className="text-[10px] text-slate-400">IP: 192.168.1.150</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">ONLINE</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#0F172A] border border-slate-800 p-3 rounded-xl text-xs">
                      <div>
                        <span className="text-white font-bold block">Chainway C66 (Handheld)</span>
                        <span className="text-[10px] text-slate-400">Modo: Móvil RFID</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">ONLINE</span>
                    </div>
                    <button onClick={() => showNotification('🔄 Conexión con middleware restablecida.')} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold p-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all">
                      <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Reiniciar Enlace Hardware
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INVENTARIOS */}
          {activeTab === 'inventory' && (
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
          )}

          {activeTab === 'add-product' && (
            <div className="space-y-6 max-w-2xl mx-auto bg-[#1E293B] border border-slate-700/60 p-8 rounded-2xl shadow-xl">
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Registrar Nuevo Producto</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <input type="text" placeholder="SKU (Ej. INV-005)" value={newProduct.id} onChange={(e)=>setNewProduct({...newProduct, id: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500" required />
                <input type="text" placeholder="Nombre del Artículo" value={newProduct.name} onChange={(e)=>setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500" required />
                <input type="number" placeholder="Stock Inicial" value={newProduct.stock} onChange={(e)=>setNewProduct({...newProduct, stock: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500" required />
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs py-3.5 rounded-xl uppercase tracking-wider">Guardar Producto</button>
                  <button type="button" onClick={() => setActiveTab('inventory')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-6 py-3.5 rounded-xl">Cancelar</button>
                </div>
              </form>
            </div>
          )}

          {/* RECEPCIÓN EN MUELLE */}
          {activeTab === 'muelle' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Muelle de Carga & Despacho — Recepción de Camiones</h2>
                <p className="text-slate-400 text-xs mt-1 font-medium">Registro de ingresos de camiones, órdenes de compra y lectura RFID masiva en tiempo real.</p>
              </div>

              <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Datos del Transporte y Proveedor</h3>
                <form onSubmit={handleRegisterTruckEntry} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input type="text" placeholder="Orden de Compra (PO)" value={muelleForm.ordenCompra} onChange={(e)=>setMuelleForm({...muelleForm, ordenCompra: e.target.value})} className="bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500" required />
                  <input type="text" placeholder="Placa del Camión" value={muelleForm.placaCamion} onChange={(e)=>setMuelleForm({...muelleForm, placaCamion: e.target.value})} className="bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500" required />
                  <input type="text" placeholder="Transportadora" value={muelleForm.transportadora} onChange={(e)=>setMuelleForm({...muelleForm, transportadora: e.target.value})} className="bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500" />
                  <input type="text" placeholder="Proveedor" value={muelleForm.proveedor} onChange={(e)=>setMuelleForm({...muelleForm, proveedor: e.target.value})} className="bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500" />
                  <div className="md:col-span-4 flex justify-end">
                    <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl shadow-lg uppercase tracking-wider transition-all">Confirmar Ingreso de Mercancía al Stock</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* HISTORIAL DE MUELLE */}
          {activeTab === 'historial_muelle' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Historial de Recepciones en Muelle</h2>
                  <p className="text-slate-400 text-xs mt-1 font-medium">Registro detallado de todos los camiones procesados.</p>
                </div>
                <button onClick={() => {
                  const sim = { id: 'REC-' + Math.floor(100+Math.random()*900), ordenCompra: 'PO-77312', placaCamion: 'SGT-332', transportadora: 'TCC Carga', proveedor: 'Ferretería Industrial', timestamp: new Date().toLocaleString(), totalItems: 272, operator: currentUser.name };
                  setMuelleHistorial([sim, ...muelleHistorial]);
                  showNotification('🚚 ¡Simulacro registrado!');
                }} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all">🚚 Simular Entrada de Camión RFID</button>
              </div>

              <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-6 shadow-xl overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">ID Recepción</th>
                      <th className="py-3 px-4">Orden Compra</th>
                      <th className="py-3 px-4">Placa Camión</th>
                      <th className="py-3 px-4">Transportadora</th>
                      <th className="py-3 px-4">Proveedor</th>
                      <th className="py-3 px-4 text-center">Total Ítems</th>
                      <th className="py-3 px-4">Operador</th>
                      <th className="py-3 px-4">Fecha y Hora</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {muelleHistorial.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{rec.id}</td>
                        <td className="py-3.5 px-4 font-mono font-semibold">{rec.ordenCompra}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-400">{rec.placaCamion}</td>
                        <td className="py-3.5 px-4 text-slate-300">{rec.transportadora}</td>
                        <td className="py-3.5 px-4 text-slate-300">{rec.proveedor}</td>
                        <td className="py-3.5 px-4 text-center font-black text-cyan-400">{rec.totalItems}</td>
                        <td className="py-3.5 px-4 text-slate-300">{rec.operator}</td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{rec.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MOVIMIENTOS */}
          {activeTab === 'movements' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <h2 className="text-2xl font-black text-white tracking-tight">Registro de Entradas y Salidas</h2>
              <form onSubmit={handleAddMovement} className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl flex gap-4 items-end shadow-xl">
                <select value={newMovement.type} onChange={(e)=>setNewMovement({...newMovement, type: e.target.value})} className="bg-[#0F172A] border border-slate-700 p-3 rounded-xl text-xs font-bold text-white focus:outline-none">
                  <option value="ENTRADA">ENTRADA</option>
                  <option value="SALIDA">SALIDA</option>
                </select>
                <input type="text" placeholder="Artículo" value={newMovement.item} onChange={(e)=>setNewMovement({...newMovement, item: e.target.value})} className="flex-1 bg-[#0F172A] border border-slate-700 p-3 rounded-xl text-xs text-white focus:outline-none" required />
                <input type="number" min="1" value={newMovement.qty} onChange={(e)=>setNewMovement({...newMovement, qty: e.target.value})} className="w-28 bg-[#0F172A] border border-slate-700 p-3 rounded-xl text-xs text-center text-white focus:outline-none" required />
                <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all">Registrar</button>
              </form>

              <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase bg-slate-900/40">
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
                        <td className="py-3.5 px-4"><span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${m.type === 'ENTRADA' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{m.type}</span></td>
                        <td className="py-3.5 px-4 font-semibold text-white">{m.item}</td>
                        <td className="py-3.5 px-4 text-center font-bold">{m.qty}</td>
                        <td className="py-3.5 px-4 text-slate-300">{m.user}</td>
                        <td className="py-3.5 px-4 text-slate-500">{m.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* GRABACIÓN TAGS */}
          {activeTab === 'encoder' && (
            <div className="space-y-6 max-w-5xl mx-auto bg-[#1E293B] border border-slate-700/60 p-8 rounded-2xl shadow-xl">
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Grabación e Impresión de Tags RFID</h2>
              <p className="text-xs text-slate-400">Codificación de chips EPC y generación de etiquetas UHF industriales.</p>
            </div>
          )}

          {/* REPORTES & ANALÍTICA */}
          {activeTab === 'reports' && (
            <div className="space-y-8 max-w-6xl mx-auto pb-12">
              <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Centro de Reportes & Analítica Gerencial</h2>
                  <p className="text-slate-400 text-xs mt-1 font-medium">Informe consolidado con inteligencia artificial, mermas, tiempos de ciclo y pronósticos.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => showNotification('📊 Exportando a Excel...')} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all">Exportar Excel</button>
                  <button onClick={() => showNotification('📄 Exportando a PDF...')} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all">Exportar PDF</button>
                </div>
              </div>

              {/* Tiempos de Ciclo Logístico (Lead Time) en Muelle */}
              <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-700/80 pb-3">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Tiempos de Ciclo Logístico en Muelle (Lead Time)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 uppercase text-[10px]">
                        <th className="py-3 px-4">ID Recepción</th>
                        <th className="py-3 px-4">Placa Camión</th>
                        <th className="py-3 px-4">Proveedor</th>
                        <th className="py-3 px-4 text-center">Hora de Llegada</th>
                        <th className="py-3 px-4 text-center">Escaneo de Cierre</th>
                        <th className="py-3 px-4 text-center">Tiempo Total (Lead Time)</th>
                        <th className="py-3 px-4 text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {cycleTimes.map((c, i) => (
                        <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{c.truckId}</td>
                          <td className="py-3.5 px-4 font-bold text-emerald-400">{c.plate}</td>
                          <td className="py-3.5 px-4 text-slate-300">{c.provider}</td>
                          <td className="py-3.5 px-4 text-center font-mono text-slate-400">{c.arrivalTime}</td>
                          <td className="py-3.5 px-4 text-center font-mono text-cyan-400">{c.scanTime}</td>
                          <td className="py-3.5 px-4 text-center font-black text-white">{c.leadTime}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${c.status === 'Rápido' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{c.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Productividad y Pronóstico */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-700/80 pb-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-400" /> Productividad por Operador
                    </h3>
                  </div>
                  <div className="space-y-2.5">
                    {currentOperatorsList.map((op) => (
                      <div key={op.id} onClick={() => setSelectedOperatorDetails(op)} className="flex justify-between items-center bg-[#0F172A] hover:bg-slate-800 border border-slate-800 p-3 rounded-xl text-xs cursor-pointer transition-all">
                        <div>
                          <span className="text-white font-semibold block">{op.name}</span>
                          <span className="text-[10px] text-slate-400">{op.role} • {op.tasksCompleted} tareas</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400">{op.efficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-700/80 pb-3">
                    <TrendingDown className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Pronóstico de Quiebre de Stock (AI)</h3>
                  </div>
                  <div className="space-y-2.5">
                    {stockoutForecast.map((s, idx) => (
                      <div key={idx} className="bg-[#0F172A] border border-slate-800 p-3 rounded-xl text-xs space-y-1">
                        <div className="flex justify-between font-bold">
                          <span className="text-cyan-400">{s.sku} - {s.name}</span>
                          <span className="text-amber-400">{s.daysLeft} días restantes</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Stock actual: {s.currentStock} un | Consumo diario: {s.dailyConsumption} un</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}