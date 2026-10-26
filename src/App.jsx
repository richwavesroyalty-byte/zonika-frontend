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

// Importación de Vistas Modulares
import DashboardView from './views/DashboardView';
import InventoryView from './views/InventoryView';
import MuelleView from './views/MuelleView';
import MovementsView from './views/MovementsView';
import EncoderView from './views/EncoderView';
import MuelleHistorialView from './views/MuelleHistorialView';
import ReportsView from './views/ReportsView';

export default function ZonikaApp() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('zonika_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isReading, setIsReading] = useState(false);
  const [inventorySubTab, setInventorySubTab] = useState('madefront');
  const [notification, setNotification] = useState(null);

  const [liveActivityFlow, setLiveActivityFlow] = useState([15, 28, 42, 35, 60, 50, 75]);

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
    ];
  });

  const [discrepancies] = useState([
    { id: 'DISC-101', sku: 'INV-002', item: 'Cámara IP Domo 4K', expected: 12, rfidCount: 10, diff: -2, location: 'Madefront Ferretería - Estante B3', cause: 'Posible extravío' },
  ]);

  const [muelleForm, setMuelleForm] = useState({ ordenCompra: '', placaCamion: '', transportadora: '', proveedor: '' });
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
      setCurrentUser({ name: 'Carlos Mendoza', role: 'Administrador (Gerente)', roleKey: 'admin' });
    } else if (roleType === 'muelle') {
      setCurrentUser({ name: 'Juan Pérez', role: 'Operador de Muelle', roleKey: 'muelle' });
    } else if (roleType === 'bodega') {
      setCurrentUser({ name: 'Sonia Gómez', role: 'Encargada de Bodega', roleKey: 'bodega' });
    }
    showNotification('🚀 ¡Acceso rápido concedido!');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('zonika_current_user');
    showNotification('🔒 Sesión cerrada.');
  };

  // CONTROL DE ACCESO RBAC (Administrador tiene acceso total absoluto)
  const hasAccess = (moduleKey) => {
    if (!currentUser) return false;
    if (currentUser.roleKey === 'admin') return true; 

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
    showNotification('¡Movimiento registrado con éxito!');
  };

  const handleRegisterTruckEntry = (e) => {
    e.preventDefault();
    if (!muelleForm.ordenCompra || !muelleForm.placaCamion) return;
    const newRecord = {
      id: 'REC-' + Math.floor(100 + Math.random() * 900),
      ordenCompra: muelleForm.ordenCompra,
      placaCamion: muelleForm.placaCamion,
      transportadora: muelleForm.transportadora || 'N/A',
      proveedor: muelleForm.proveedor || 'N/A',
      timestamp: new Date().toLocaleString(),
      totalItems: 150,
      operator: currentUser.name
    };
    setMuelleHistorial([newRecord, ...muelleHistorial]);
    setMuelleForm({ ordenCompra: '', placaCamion: '', transportadora: '', proveedor: '' });
    showNotification('✅ ¡Ingreso de camión confirmado y registrado!');
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
            <input type="email" placeholder="admin@zonika.com" value={loginForm.email} onChange={(e)=>setLoginForm({...loginForm, email: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500" required />
            <input type="password" placeholder="••••••••" value={loginForm.password} onChange={(e)=>setLoginForm({...loginForm, password: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500" required />
            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs py-3.5 rounded-xl uppercase tracking-wider shadow-lg transition-all">Iniciar Sesión</button>
          </form>

          <div className="border-t border-slate-800 pt-4 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Acceso Rápido con 1 Clic:</p>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => handleQuickLogin('admin')} className="bg-[#1E293B] hover:bg-cyan-500/25 border border-slate-700 text-slate-300 p-2.5 rounded-xl text-[10px] font-bold text-center transition-all">🔑 Admin</button>
              <button type="button" onClick={() => handleQuickLogin('muelle')} className="bg-[#1E293B] hover:bg-cyan-500/25 border border-slate-700 text-slate-300 p-2.5 rounded-xl text-[10px] font-bold text-center transition-all">🚚 Muelle</button>
              <button type="button" onClick={() => handleQuickLogin('bodega')} className="bg-[#1E293B] hover:bg-cyan-500/25 border border-slate-700 text-slate-300 p-2.5 rounded-xl text-[10px] font-bold text-center transition-all">📦 Bodega</button>
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

      {/* Sidebar con Permisos RBAC Integrados */}
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
          {/* Enrutador de Vistas Modulares */}
          {activeTab === 'dashboard' && (
            <DashboardView 
              totalStockMadefront={totalStockMadefront}
              totalStockBodega={totalStockBodega}
              movementsLength={movements.length}
              discrepanciesLength={discrepancies.length}
              inventoryMadefrontLength={inventoryMadefront.length}
              inventoryBodegaLength={inventoryBodega.length}
              liveActivityFlow={liveActivityFlow}
              isReading={isReading}
              showNotification={showNotification}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView 
              inventorySubTab={inventorySubTab}
              setInventorySubTab={setInventorySubTab}
              inventoryMadefront={inventoryMadefront}
              inventoryBodega={inventoryBodega}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'add-product' && (
            <div className="space-y-6 max-w-2xl mx-auto bg-[#1E293B] border border-slate-700/60 p-8 rounded-2xl shadow-xl">
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Registrar Nuevo Producto</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <input type="text" placeholder="SKU (Ej. INV-005)" value={newProduct.id} onChange={(e)=>setNewProduct({...newProduct, id: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white" required />
                <input type="text" placeholder="Nombre del Artículo" value={newProduct.name} onChange={(e)=>setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white" required />
                <input type="number" placeholder="Stock Inicial" value={newProduct.stock} onChange={(e)=>setNewProduct({...newProduct, stock: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white" required />
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs py-3.5 rounded-xl uppercase">Guardar Producto</button>
                  <button type="button" onClick={() => setActiveTab('inventory')} className="bg-slate-800 text-slate-300 font-bold text-xs px-6 py-3.5 rounded-xl">Cancelar</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'muelle' && (
            <MuelleView 
              muelleForm={muelleForm}
              setMuelleForm={setMuelleForm}
              handleRegisterTruckEntry={handleRegisterTruckEntry}
            />
          )}

          {activeTab === 'historial_muelle' && (
            <MuelleHistorialView 
              muelleHistorial={muelleHistorial}
              setMuelleHistorial={setMuelleHistorial}
              currentUser={currentUser}
              showNotification={showNotification}
            />
          )}

          {activeTab === 'movements' && (
            <MovementsView 
              newMovement={newMovement}
              setNewMovement={setNewMovement}
              handleAddMovement={handleAddMovement}
              movements={movements}
            />
          )}

          {activeTab === 'encoder' && <EncoderView />}

          {activeTab === 'reports' && (
            <ReportsView 
              muelleHistorial={muelleHistorial}
              showNotification={showNotification}
            />
          )}
        </div>
      </main>
    </div>
  );
}