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
import DiscrepancyView from './views/DiscrepancyView';

// Importación de Datos Iniciales
import { 
  initialInventoryMadefront, 
  initialInventoryBodega, 
  initialMovements, 
  initialMuelleHistorial 
} from './data/initialState';

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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notification, setNotification] = useState(null);

  // Estado para Modal de Eliminación con Trazabilidad
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteReason, setDeleteReason] = useState('Daño físico / Mermas');
  const [deleteDescription, setDeleteDescription] = useState('');

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
    return saved ? JSON.parse(saved) : initialInventoryMadefront;
  });

  const [inventoryBodega, setInventoryBodega] = useState(() => {
    const saved = localStorage.getItem('zonika_inv_bodega');
    return saved ? JSON.parse(saved) : initialInventoryBodega;
  });

  const [movements, setMovements] = useState(() => {
    const saved = localStorage.getItem('zonika_movements');
    return saved ? JSON.parse(saved) : initialMovements;
  });

  const [muelleHistorial, setMuelleHistorial] = useState(() => {
    const saved = localStorage.getItem('zonika_muelle_historial');
    return saved ? JSON.parse(saved) : initialMuelleHistorial;
  });

  // Historial de eliminados inalterable
  const [deletedHistory, setDeletedHistory] = useState(() => {
    const saved = localStorage.getItem('zonika_deleted_history');
    return saved ? JSON.parse(saved) : [
      {
        id: 'DEL-991',
        sku: 'INV-999',
        name: 'Lector Antiguo Dañado',
        category: 'Seguridad',
        location: 'Madefront Ferretería',
        reason: 'Daño físico irreversible',
        description: 'Equipo golpeado durante maniobra de descarga en estante A1.',
        user: 'Carlos Mendoza (Admin)',
        timestamp: '24/10/2026, 10:30:15 a.m.'
      }
    ];
  });

  // Discrepancias (incluyendo muelle y auditoría)
  const [discrepancies, setDiscrepancies] = useState(() => {
    const saved = localStorage.getItem('zonika_discrepancies');
    return saved ? JSON.parse(saved) : [
      { id: 'DISC-101', sku: 'INV-002', item: 'Cámara IP Domo 4K', expected: 12, rfidCount: 10, diff: -2, location: 'Madefront Ferretería - Estante B3', cause: 'Posible extravío / Sin etiqueta RFID' },
    ];
  });

  const [muelleForm, setMuelleForm] = useState({ ordenCompra: '', placaCamion: '', transportadora: '', proveedor: '' });
  const [newProduct, setNewProduct] = useState({ id: '', name: '', category: 'Herramientas', stock: '', location: '' });
  const [newMovement, setNewMovement] = useState({ 
    type: 'ENTRADA', 
    item: '', 
    qty: 1, 
    reason: 'Reposición de Proveedor', 
    description: '' 
  });

  const handleGoToAddProduct = () => {
    const defaultCat = selectedCategory !== 'all' ? selectedCategory : 'Herramientas';
    setNewProduct({ id: '', name: '', category: defaultCat, stock: '', location: '' });
    setActiveTab('add-product');
  };

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

  useEffect(() => {
    localStorage.setItem('zonika_deleted_history', JSON.stringify(deletedHistory));
  }, [deletedHistory]);

  useEffect(() => {
    localStorage.setItem('zonika_discrepancies', JSON.stringify(discrepancies));
  }, [discrepancies]);

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

  const hasAccess = (moduleKey) => {
    if (!currentUser) return false;
    if (currentUser.roleKey === 'admin') return true; 

    const rolePermissions = {
      muelle: ['muelle', 'historial_muelle', 'monitor'],
      bodega: ['inventory', 'add-product', 'movements', 'encoder', 'monitor', 'discrepancies']
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
    showNotification('¡Producto registrado con éxito en su categoría!');
  };

  const initiateDeleteProduct = (item, warehouseType) => {
    setItemToDelete({ item, warehouseType });
    setDeleteReason('Daño físico / Mermas');
    setDeleteDescription('');
    setDeleteModalOpen(true);
  };

  const confirmDeleteProduct = (e) => {
    e.preventDefault();
    if (!itemToDelete) return;

    const { item, warehouseType } = itemToDelete;

    if (warehouseType === 'madefront') {
      setInventoryMadefront(prev => prev.filter(p => p.id !== item.id));
    } else {
      setInventoryBodega(prev => prev.filter(p => p.id !== item.id));
    }

    const deleteRecord = {
      id: 'DEL-' + Math.floor(1000 + Math.random() * 9000),
      sku: item.id,
      name: item.name,
      category: item.category || 'General',
      location: item.location || (warehouseType === 'madefront' ? 'Madefront Ferretería' : 'Bodega Principal'),
      reason: deleteReason,
      description: deleteDescription || 'Sin descripción detallada proporcionada.',
      user: currentUser ? currentUser.name : 'Sistema',
      timestamp: new Date().toLocaleString()
    };

    setDeletedHistory(prev => [deleteRecord, ...prev]);
    setDeleteModalOpen(false);
    setItemToDelete(null);
    showNotification('🗑️ Producto eliminado y registrado en Discrepancias & Historial (Inalterable)');
  };

  const handleReportMuelleDiscrepancy = (discData) => {
    const newDisc = {
      id: 'DISC-' + Math.floor(100 + Math.random() * 900),
      sku: discData.sku,
      item: discData.name,
      expected: discData.expected,
      rfidCount: discData.read,
      diff: discData.read - discData.expected,
      location: `Muelle - PO: ${discData.ordenCompra || 'N/A'} (Placa: ${discData.placaCamion || 'N/A'})`,
      cause: `${discData.reason}: ${discData.description} (Reportado por ${currentUser ? currentUser.name : 'Operador'})`
    };
    setDiscrepancies(prev => [newDisc, ...prev]);
    showNotification('⚠️ Discrepancia de muelle registrada con trazabilidad en Discrepancias.');
  };

  const handleAddMovement = (e) => {
    e.preventDefault();
    if (!newMovement.item) return;
    const mov = {
      id: 'MOV-' + Math.floor(100 + Math.random() * 900),
      type: newMovement.type,
      item: newMovement.item,
      qty: parseInt(newMovement.qty),
      reason: newMovement.reason || 'Reposición de Proveedor',
      description: newMovement.description || 'Sin descripción detallada.',
      user: currentUser ? currentUser.name : 'Sistema',
      time: new Date().toLocaleString()
    };
    setMovements([mov, ...movements]);
    setNewMovement({ type: 'ENTRADA', item: '', qty: 1, reason: 'Reposición de Proveedor', description: '' });
    showNotification('🔒 ¡Movimiento registrado con trazabilidad de auditoría!');
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
    <div className="flex h-screen w-screen bg-[#0B1120] text-slate-100 font-sans overflow-hidden relative">
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-cyan-500 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-cyan-300 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Modal de Trazabilidad y Eliminación Inalterable */}
      {deleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleIn">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Autorización de Baja y Trazabilidad</h3>
              </div>
              <button onClick={() => setDeleteModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#0F172A] border border-slate-800 p-3 rounded-xl text-xs space-y-1">
              <p className="text-slate-400">Producto a eliminar:</p>
              <p className="font-bold text-white text-sm">{itemToDelete.item.name} <span className="text-cyan-400 font-mono">({itemToDelete.item.id})</span></p>
              <p className="text-[10px] text-slate-400">Ubicación: {itemToDelete.item.location}</p>
            </div>

            <form onSubmit={confirmDeleteProduct} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Motivo Principal de Baja</label>
                <select 
                  value={deleteReason} 
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-700 p-2.5 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="Daño físico / Mermas">Daño físico / Mermas</option>
                  <option value="Extravío o hurto">Extravío o hurto</option>
                  <option value="Obsolescencia o caducidad">Obsolescencia o caducidad</option>
                  <option value="Error de ingreso en sistema">Error de ingreso en sistema</option>
                  <option value="Traslado externo definitivo">Traslado externo definitivo</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Descripción Detallada (Justificación obligatoria)</label>
                <textarea 
                  rows="3"
                  placeholder="Explique el porqué y para qué se retira este registro del inventario activo..."
                  value={deleteDescription}
                  onChange={(e) => setDeleteDescription(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-700 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                  required
                ></textarea>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-[10px] text-amber-300 font-medium flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>Aviso: Este registro quedará guardado permanentemente en el Historial Inalterable de Discrepancias y no podrá ser borrado por ningún usuario.</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs py-3 rounded-xl uppercase tracking-wider transition-all shadow-lg">
                  Confirmar Baja Definitiva
                </button>
                <button type="button" onClick={() => setDeleteModalOpen(false)} className="bg-slate-800 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl hover:bg-slate-700">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
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
            {(hasAccess('discrepancies') || currentUser.roleKey === 'admin') && (
              <button onClick={() => setActiveTab('discrepancies')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs ${activeTab === 'discrepancies' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}>
                <AlertTriangle className="w-4 h-4" /> Discrepancias & Historial
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
              setActiveTab={handleGoToAddProduct}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onDeleteProduct={initiateDeleteProduct}
            />
          )}

          {activeTab === 'add-product' && (
            <div className="space-y-6 max-w-2xl mx-auto bg-[#1E293B] border border-slate-700/60 p-8 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-700/80 pb-3">
                <h2 className="text-xl font-black text-white uppercase tracking-wider">Registrar Nuevo Producto</h2>
                <span className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full font-bold">
                  Categoría: {newProduct.category}
                </span>
              </div>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">SKU del Producto</label>
                  <input type="text" placeholder="Ej. INV-005" value={newProduct.id} onChange={(e)=>setNewProduct({...newProduct, id: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500" required />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Nombre del Artículo</label>
                  <input type="text" placeholder="Nombre descriptivo..." value={newProduct.name} onChange={(e)=>setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500" required />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Categoría (Sincronizada)</label>
                  <select 
                    value={newProduct.category} 
                    onChange={(e)=>setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="Herramientas">Herramientas</option>
                    <option value="Seguridad">Seguridad</option>
                    <option value="CCTV">CCTV</option>
                    <option value="Insumos">Insumos</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Stock Inicial</label>
                  <input type="number" placeholder="Cantidad..." value={newProduct.stock} onChange={(e)=>setNewProduct({...newProduct, stock: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500" required />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs py-3.5 rounded-xl uppercase tracking-wider">Guardar Producto</button>
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
              onReportDiscrepancy={handleReportMuelleDiscrepancy}
              showNotification={showNotification}
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

          {activeTab === 'discrepancies' && (
            <DiscrepancyView 
              discrepancies={discrepancies}
              deletedHistory={deletedHistory}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView 
              showNotification={showNotification}
            />
          )}
        </div>
      </main>
    </div>
  );
}