import React, { useState, useEffect } from 'react';
import { 
  Radio, Cpu, Activity, Play, Square, CheckCircle2,
  Boxes, ArrowLeftRight, AlertTriangle, Plus,
  Printer, BarChart3, Settings, ShieldAlert, Building2,
  Trash2, Truck, PackageCheck, Zap, ClipboardList, Warehouse, Store, MapPin,
  Lock, Mail, LogOut, Shield, TrendingUp, TrendingDown, Sparkles, Download, FileText,
  Calendar, Clock, UserCheck, AlertOctagon, Filter, X, Eye, RefreshCw, Tag, Menu
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
import ConfigurationView from './views/ConfigurationView';

// Importación de Datos Iniciales
import { 
  initialInventoryMadefront, 
  initialInventoryBodega, 
  initialMovements, 
  initialMuelleHistorial 
} from './data/initialState';

export default function ZonikaApp() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('zonika_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isReading, setIsReading] = useState(false);
  const [inventorySubTab, setInventorySubTab] = useState('madefront');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notification, setNotification] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modales
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteReason, setDeleteReason] = useState('Daño físico / Mermas');
  const [deleteDescription, setDeleteDescription] = useState('');

  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [itemToTransfer, setItemToTransfer] = useState(null);

  const [traceModalOpen, setTraceModalOpen] = useState(false);
  const [itemToTrace, setItemToTrace] = useState(null);

  const [recodeModalOpen, setRecodeModalOpen] = useState(false);
  const [itemToRecode, setItemToRecode] = useState(null);
  const [newEpcValue, setNewEpcValue] = useState('');

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
    try {
      const saved = localStorage.getItem('zonika_inv_madefront');
      return saved ? JSON.parse(saved) : (initialInventoryMadefront || []).map(item => ({ ...item, minStock: 5 }));
    } catch {
      return initialInventoryMadefront || [];
    }
  });

  const [inventoryBodega, setInventoryBodega] = useState(() => {
    try {
      const saved = localStorage.getItem('zonika_inv_bodega');
      return saved ? JSON.parse(saved) : (initialInventoryBodega || []).map(item => ({ ...item, minStock: 10 }));
    } catch {
      return initialInventoryBodega || [];
    }
  });

  const [movements, setMovements] = useState(() => {
    try {
      const saved = localStorage.getItem('zonika_movements');
      return saved ? JSON.parse(saved) : initialMovements || [];
    } catch {
      return initialMovements || [];
    }
  });

  const [muelleHistorial, setMuelleHistorial] = useState(() => {
    try {
      const saved = localStorage.getItem('zonika_muelle_historial');
      return saved ? JSON.parse(saved) : initialMuelleHistorial || [];
    } catch {
      return initialMuelleHistorial || [];
    }
  });

  const [deletedHistory, setDeletedHistory] = useState(() => {
    try {
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
    } catch {
      return [];
    }
  });

  const [discrepancies, setDiscrepancies] = useState(() => {
    try {
      const saved = localStorage.getItem('zonika_discrepancies');
      return saved ? JSON.parse(saved) : [
        { id: 'DISC-101', sku: 'INV-002', item: 'Cámara IP Domo 4K', expected: 12, rfidCount: 10, diff: -2, location: 'Madefront Ferretería - Estante B3', cause: 'Posible extravío / Sin etiqueta RFID' },
      ];
    } catch {
      return [];
    }
  });

  const [muelleForm, setMuelleForm] = useState({ ordenCompra: '', placaCamion: '', transportadora: '', proveedor: '' });
  const [newProduct, setNewProduct] = useState({ id: '', name: '', category: 'Herramientas', stock: '', location: '', minStock: 5 });
  const [newMovement, setNewMovement] = useState({ type: 'ENTRADA', item: '', qty: 1, reason: 'Reposición de Proveedor', description: '' });

  useEffect(() => { localStorage.setItem('zonika_current_user', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('zonika_inv_madefront', JSON.stringify(inventoryMadefront)); }, [inventoryMadefront]);
  useEffect(() => { localStorage.setItem('zonika_inv_bodega', JSON.stringify(inventoryBodega)); }, [inventoryBodega]);
  useEffect(() => { localStorage.setItem('zonika_movements', JSON.stringify(movements)); }, [movements]);
  useEffect(() => { localStorage.setItem('zonika_muelle_historial', JSON.stringify(muelleHistorial)); }, [muelleHistorial]);
  useEffect(() => { localStorage.setItem('zonika_deleted_history', JSON.stringify(deletedHistory)); }, [deletedHistory]);
  useEffect(() => { localStorage.setItem('zonika_discrepancies', JSON.stringify(discrepancies)); }, [discrepancies]);

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
    if (email === 'admin@zonika.com' && pass === 'admin123') matchedUser = { name: 'Carlos Mendoza', role: 'Administrador (Gerente)', roleKey: 'admin' };
    else if (email === 'muelle@zonika.com' && pass === 'muelle123') matchedUser = { name: 'Juan Pérez', role: 'Operador de Muelle', roleKey: 'muelle' };
    else if (email === 'bodega@zonika.com' && pass === 'bodega123') matchedUser = { name: 'Sonia Gómez', role: 'Encargada de Bodega', roleKey: 'bodega' };

    if (matchedUser) {
      setCurrentUser(matchedUser);
      showNotification(`👋 ¡Bienvenido, ${matchedUser.name}!`);
    } else {
      setLoginError('Credenciales incorrectas. Usa los botones de acceso rápido.');
    }
  };

  const handleQuickLogin = (roleType) => {
    if (roleType === 'admin') setCurrentUser({ name: 'Carlos Mendoza', role: 'Administrador (Gerente)', roleKey: 'admin' });
    else if (roleType === 'muelle') setCurrentUser({ name: 'Juan Pérez', role: 'Operador de Muelle', roleKey: 'muelle' });
    else if (roleType === 'bodega') setCurrentUser({ name: 'Sonia Gómez', role: 'Encargada de Bodega', roleKey: 'bodega' });
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

  const handleGoToAddProduct = () => {
    const defaultCat = selectedCategory !== 'all' ? selectedCategory : 'Herramientas';
    setNewProduct({ id: '', name: '', category: defaultCat, stock: '', location: '', minStock: 5 });
    setActiveTab('add-product');
    setMobileMenuOpen(false);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.id || !newProduct.name || !newProduct.stock) return;
    const item = {
      ...newProduct,
      epc: 'E28068940000' + Math.floor(10000000 + Math.random() * 90000000),
      rfidTagged: parseInt(newProduct.stock),
      minStock: parseInt(newProduct.minStock) || 5,
      location: inventorySubTab === 'madefront' ? 'Madefront Ferretería' : 'Bodega Principal'
    };
    if (inventorySubTab === 'madefront') setInventoryMadefront([item, ...inventoryMadefront]);
    else setInventoryBodega([item, ...inventoryBodega]);
    
    setNewProduct({ id: '', name: '', category: 'Herramientas', stock: '', location: '', minStock: 5 });
    setActiveTab('inventory');
    showNotification('¡Producto registrado con éxito!');
  };

  const initiateTransfer = (item, currentWarehouse) => {
    setItemToTransfer({ item, currentWarehouse });
    setTransferModalOpen(true);
  };

  const confirmTransfer = (targetWarehouse) => {
    if (!itemToTransfer || !itemToTransfer.item) return;
    
    const { item, currentWarehouse } = itemToTransfer;

    if (currentWarehouse === 'madefront' && targetWarehouse === 'bodega') {
      setInventoryMadefront(prev => prev.filter(p => p.id !== item.id));
      setInventoryBodega(prev => [{ ...item, location: 'Bodega Principal' }, ...prev]);
    } else if (currentWarehouse === 'bodega' && targetWarehouse === 'madefront') {
      setInventoryBodega(prev => prev.filter(p => p.id !== item.id));
      setInventoryMadefront(prev => [{ ...item, location: 'Madefront Ferretería' }, ...prev]);
    }

    const mov = {
      id: 'MOV-' + Math.floor(100 + Math.random() * 900),
      type: 'TRANSFERENCIA',
      item: item.name,
      qty: parseInt(item.stock),
      reason: 'Transferencia Inter-Almacén',
      description: `Traslado de ${currentWarehouse === 'madefront' ? 'Madefront Ferretería' : 'Bodega Principal'} a ${targetWarehouse === 'madefront' ? 'Madefront Ferretería' : 'Bodega Principal'}`,
      user: currentUser ? currentUser.name : 'Sistema',
      time: new Date().toLocaleString()
    };
    
    setMovements(prev => [mov, ...prev]);
    setTransferModalOpen(false);
    setItemToTransfer(null);
    showNotification('🔄 ¡Transferencia entre almacenes completada!');
  };

  const openTraceability = (item) => {
    setItemToTrace(item);
    setTraceModalOpen(true);
  };

  const openRecodeModal = (item) => {
    setItemToRecode(item);
    setNewEpcValue(item.epc || '');
    setRecodeModalOpen(true);
  };

  const confirmRecode = (e) => {
    e.preventDefault();
    if (!itemToRecode || !newEpcValue) return;

    const updateList = (list) => list.map(p => p.id === itemToRecode.id ? { ...p, epc: newEpcValue } : p);
    setInventoryMadefront(updateList);
    setInventoryBodega(updateList);

    setRecodeModalOpen(false);
    setItemToRecode(null);
    setNewEpcValue('');
    showNotification('🏷️ ¡Tag RFID (EPC) re-codificado correctamente!');
  };

  const initiateDeleteProduct = (item, warehouseType) => {
    setItemToDelete({ item, warehouseType });
    setDeleteReason('Daño físico / Mermas');
    setDeleteDescription('');
    setDeleteModalOpen(true);
  };

  const confirmDeleteProduct = (e) => {
    e.preventDefault();
    if (!itemToDelete || !itemToDelete.item) return;

    const { item, warehouseType } = itemToDelete;

    if (warehouseType === 'madefront') setInventoryMadefront(prev => prev.filter(p => p.id !== item.id));
    else setInventoryBodega(prev => prev.filter(p => p.id !== item.id));

    const deleteRecord = {
      id: 'DEL-' + Math.floor(1000 + Math.random() * 9000),
      sku: item.id,
      name: item.name,
      category: item.category || 'General',
      location: item.location || (warehouseType === 'madefront' ? 'Madefront Ferretería' : 'Bodega Principal'),
      reason: deleteReason,
      description: deleteDescription || 'Sin descripción.',
      user: currentUser ? currentUser.name : 'Sistema',
      timestamp: new Date().toLocaleString()
    };

    setDeletedHistory(prev => [deleteRecord, ...prev]);
    setDeleteModalOpen(false);
    setItemToDelete(null);
    showNotification('🗑️ Producto eliminado y registrado en Discrepancias.');
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
      cause: `${discData.reason}: ${discData.description}`
    };
    setDiscrepancies(prev => [newDisc, ...prev]);
    showNotification('⚠️ Discrepancia de muelle registrada.');
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
      description: newMovement.description || 'Sin descripción.',
      user: currentUser ? currentUser.name : 'Sistema',
      time: new Date().toLocaleString()
    };
    setMovements([mov, ...movements]);
    setNewMovement({ type: 'ENTRADA', item: '', qty: 1, reason: 'Reposición de Proveedor', description: '' });
    showNotification('🔒 ¡Movimiento registrado!');
  };

  const handleRegisterTruckEntry = (e, currentItemsFromMuelle) => {
    if (e) e.preventDefault();
    if (!muelleForm.ordenCompra || !muelleForm.placaCamion) return;

    const itemsToRegister = currentItemsFromMuelle && currentItemsFromMuelle.length > 0 
      ? currentItemsFromMuelle 
      : [
          { sku: 'INV-001', name: 'Lector Biométrico ZKTeco', expected: 50, read: 45 },
          { sku: 'INV-002', name: 'Cámara IP Domo 4K', expected: 20, read: 20 },
          { sku: 'INV-003', name: 'Etiqueta RFID UHF Zebra', expected: 500, read: 500 }
        ];

    const totalRealUnits = itemsToRegister.reduce((acc, item) => acc + Number(item.read || item.expected || 0), 0);

    const newRecord = {
      id: 'REC-' + Math.floor(100 + Math.random() * 900),
      ordenCompra: muelleForm.ordenCompra,
      placaCamion: muelleForm.placaCamion,
      transportadora: muelleForm.transportadora || 'N/A',
      proveedor: muelleForm.proveedor || 'N/A',
      timestamp: new Date().toLocaleString(),
      totalItems: totalRealUnits,
      operator: currentUser ? currentUser.name : 'Admin',
      itemsAudited: itemsToRegister.map(i => ({
        sku: i.sku || i.id,
        name: i.name,
        expected: i.expected,
        read: i.read || i.expected,
        status: (Number(i.read || i.expected) >= Number(i.expected)) ? 'Completado' : 'En revisión'
      }))
    };

    setMuelleHistorial([newRecord, ...muelleHistorial]);
    setMuelleForm({ ordenCompra: '', placaCamion: '', transportadora: '', proveedor: '' });
    showNotification(`✅ Ingreso registrado con éxito (${totalRealUnits} unidades validadas).`);
  };

  const totalStockMadefront = inventoryMadefront.reduce((acc, item) => acc + Number(item.stock || 0), 0);
  const totalStockBodega = inventoryBodega.reduce((acc, item) => acc + Number(item.stock || 0), 0);

  const getNavButtonClass = (tabKey) => {
    const isActive = activeTab === tabKey || (tabKey === 'inventory' && activeTab === 'add-product');
    if (isActive) {
      return 'w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl font-black text-xs transition-all bg-gradient-to-r from-cyan-500/20 to-cyan-400/10 border-2 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.4)]';
    }
    return 'w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl font-black text-xs transition-all text-slate-400 hover:text-white hover:bg-slate-900/60 border-2 border-transparent';
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-[100dvh] w-full bg-[#030508] text-slate-100 font-sans items-center justify-center p-4 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:32px_32px]">
        <div className="w-full max-w-md bg-[#05070E] border-2 border-cyan-400/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.25)] space-y-6 backdrop-blur-xl">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-[#020408] border-2 border-cyan-400 rounded-2xl flex items-center justify-center p-3 mx-auto shadow-[0_0_25px_rgba(0,240,255,0.4)]">
              <img src={logoIsotipo} alt="Zonika" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
            </div>
            <h1 className="font-black text-2xl text-white tracking-widest drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]">ZONIKA RFID</h1>
            <p className="text-cyan-400 font-mono text-xs uppercase tracking-wider">Sistema de Gestión Logística Enterprise</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && <p className="text-rose-400 text-xs text-center font-bold bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">{loginError}</p>}
            <input type="email" placeholder="admin@zonika.com" value={loginForm.email} onChange={(e)=>setLoginForm({...loginForm, email: e.target.value})} className="w-full bg-[#020408] border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-400 transition-all font-mono" required />
            <input type="password" placeholder="••••••••" value={loginForm.password} onChange={(e)=>setLoginForm({...loginForm, password: e.target.value})} className="w-full bg-[#020408] border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-400 transition-all font-mono" required />
            <button type="submit" className="w-full bg-[#00f0ff] hover:bg-cyan-300 text-black font-black text-xs py-3.5 rounded-xl uppercase tracking-widest shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all">Iniciar Sesión</button>
          </form>

          <div className="border-t border-slate-800/80 pt-4 space-y-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center font-mono">Acceso Rápido:</p>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => handleQuickLogin('admin')} className="bg-[#020408] hover:bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 p-2.5 rounded-xl text-[10px] font-mono font-bold text-center transition-all shadow-[0_0_10px_rgba(0,240,255,0.15)]">🔑 Admin</button>
              <button type="button" onClick={() => handleQuickLogin('muelle')} className="bg-[#020408] hover:bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 p-2.5 rounded-xl text-[10px] font-mono font-bold text-center transition-all shadow-[0_0_10px_rgba(0,240,255,0.15)]">🚚 Muelle</button>
              <button type="button" onClick={() => handleQuickLogin('bodega')} className="bg-[#020408] hover:bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 p-2.5 rounded-xl text-[10px] font-mono font-bold text-center transition-all shadow-[0_0_10px_rgba(0,240,255,0.15)]">📦 Bodega</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] w-full bg-[#030508] text-slate-100 font-sans relative overflow-x-hidden bg-[linear-gradient(to_right,#0c1322_1px,transparent_1px),linear-gradient(to_bottom,#0c1322_1px,transparent_1px)] bg-[size:36px_36px]">
      
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-[#00f0ff] text-black font-black px-5 py-3.5 rounded-2xl shadow-[0_0_35px_rgba(0,240,255,0.8)] flex items-center gap-2 border-2 border-white animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-mono uppercase tracking-wider">{notification}</span>
        </div>
      )}

      {/* MODALES GLOBALES */}
      {deleteModalOpen && itemToDelete?.item && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#05070E] border-2 border-rose-500 rounded-3xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(255,42,109,0.4)] space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Autorización de Baja Definitiva</h3>
              </div>
              <button onClick={() => setDeleteModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-[#020408] border border-slate-800 p-3 rounded-xl text-xs space-y-1">
              <p className="text-slate-400">Producto a eliminar:</p>
              <p className="font-bold text-white text-sm">{itemToDelete.item.name} <span className="text-cyan-400 font-mono">({itemToDelete.item.id})</span></p>
              <p className="text-[10px] text-slate-400">Ubicación: {itemToDelete.item.location}</p>
            </div>
            <form onSubmit={confirmDeleteProduct} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Motivo Principal</label>
                <select value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} className="w-full bg-[#020408] border border-slate-800 p-2.5 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-rose-500 cursor-pointer">
                  <option value="Daño físico / Mermas">Daño físico / Mermas</option>
                  <option value="Extravío o hurto">Extravío o hurto</option>
                  <option value="Obsolescencia o caducidad">Obsolescencia o caducidad</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Descripción</label>
                <textarea rows="3" placeholder="Detalle la causa..." value={deleteDescription} onChange={(e) => setDeleteDescription(e.target.value)} className="w-full bg-[#020408] border border-slate-800 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500" required></textarea>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs py-3 rounded-xl uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,42,109,0.5)]">Confirmar Baja</button>
                <button type="button" onClick={() => setDeleteModalOpen(false)} className="bg-slate-800 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {transferModalOpen && itemToTransfer?.item && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#05070E] border-2 border-cyan-400 rounded-3xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(0,240,255,0.3)] space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <ArrowLeftRight className="w-5 h-5" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Transferencia Inter-Almacén</h3>
              </div>
              <button onClick={() => setTransferModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-[#020408] border border-slate-800 p-3 rounded-xl text-xs space-y-1">
              <p className="text-slate-400">Artículo seleccionado:</p>
              <p className="font-bold text-white text-sm">{itemToTransfer.item.name} <span className="text-cyan-400 font-mono">({itemToTransfer.item.id})</span></p>
              <p className="text-[10px] text-slate-400">Ubicación actual: <strong className="text-amber-400">{itemToTransfer.currentWarehouse === 'madefront' ? 'Madefront Ferretería' : 'Bodega Principal'}</strong></p>
              <p className="text-[10px] text-slate-400">Stock disponible: <strong className="text-white">{itemToTransfer.item.stock} un</strong></p>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-slate-300 font-bold">Seleccione el almacén de destino:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {itemToTransfer.currentWarehouse === 'madefront' ? (
                  <button onClick={() => confirmTransfer('bodega')} className="p-3 bg-[#00f0ff] hover:bg-cyan-300 text-black font-black text-xs rounded-xl text-center transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] uppercase">
                    🏭 Enviar a Bodega
                  </button>
                ) : (
                  <button onClick={() => confirmTransfer('madefront')} className="p-3 bg-[#00f0ff] hover:bg-cyan-300 text-black font-black text-xs rounded-xl text-center transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] uppercase">
                    🏪 Enviar a Madefront
                  </button>
                )}
                <button onClick={() => setTransferModalOpen(false)} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {traceModalOpen && itemToTrace && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#05070E] border-2 border-cyan-400 rounded-3xl p-6 max-w-lg w-full shadow-[0_0_50px_rgba(0,240,255,0.3)] space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Shield className="w-5 h-5" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Trazabilidad 360° — Línea de Tiempo</h3>
              </div>
              <button onClick={() => setTraceModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-[#020408] border border-slate-800 p-4 rounded-2xl text-xs space-y-2">
              <div className="flex justify-between"><span className="text-slate-400 font-bold">SKU:</span><span className="font-mono font-bold text-cyan-400">{itemToTrace.id}</span></div>
              <div className="flex justify-between"><span className="text-slate-400 font-bold">Producto:</span><span className="font-semibold text-white">{itemToTrace.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400 font-bold">Código EPC RFID:</span><span className="font-mono text-emerald-400 text-[11px]">{itemToTrace.epc}</span></div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setTraceModalOpen(false)} className="bg-slate-800 text-slate-200 font-bold text-xs px-6 py-2.5 rounded-xl">Cerrar Trazabilidad</button>
            </div>
          </div>
        </div>
      )}

      {recodeModalOpen && itemToRecode && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#05070E] border-2 border-cyan-400 rounded-3xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(0,240,255,0.3)] space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Tag className="w-5 h-5" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Re-codificación de Tag RFID</h3>
              </div>
              <button onClick={() => setRecodeModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-[#020408] border border-slate-800 p-3 rounded-xl text-xs space-y-1">
              <p className="text-slate-400">Producto seleccionado:</p>
              <p className="font-bold text-white text-sm">{itemToRecode.name} <span className="text-cyan-400 font-mono">({itemToRecode.id})</span></p>
            </div>
            <form onSubmit={confirmRecode} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Nuevo Código EPC RFID</label>
                <input type="text" value={newEpcValue} onChange={(e) => setNewEpcValue(e.target.value)} className="w-full bg-[#020408] border border-slate-800 p-3 rounded-xl text-xs font-mono font-bold text-cyan-400 focus:outline-none focus:border-cyan-400" required />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-[#00f0ff] hover:bg-cyan-300 text-black font-black text-xs py-3 rounded-xl uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.3)]">Actualizar Tag EPC</button>
                <button type="button" onClick={() => setRecodeModalOpen(false)} className="bg-slate-800 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#05070E] border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0 transition-transform duration-300 ease-in-out pt-16 md:pt-4 overflow-y-auto ${mobileMenuOpen ? 'translate-x-0 pointer-events-auto shadow-2xl' : '-translate-x-full pointer-events-none md:pointer-events-auto md:translate-x-0'}`}>
        <div>
          <div className="flex items-center justify-between px-2 py-4 mb-5 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/50 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                <img src={logoIsotipo} alt="Zonika" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="font-black text-lg text-white tracking-widest drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">ZONIKA</h1>
                <span className="text-[10px] text-cyan-400 font-mono font-semibold">{currentUser.name}</span>
              </div>
            </div>
            <button type="button" onClick={() => setMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white p-2">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {hasAccess('dashboard') && (
              <button type="button" onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} className={getNavButtonClass('dashboard')}>
                <Activity className="w-4 h-4" /> Panel General
              </button>
            )}
            {hasAccess('inventory') && (
              <button type="button" onClick={() => { setActiveTab('inventory'); setMobileMenuOpen(false); }} className={getNavButtonClass('inventory')}>
                <Boxes className="w-4 h-4" /> Stock e Inventarios
              </button>
            )}
            {hasAccess('muelle') && (
              <button type="button" onClick={() => { setActiveTab('muelle'); setMobileMenuOpen(false); }} className={getNavButtonClass('muelle')}>
                <Truck className="w-4 h-4" /> Recepción en Muelle
              </button>
            )}
            {hasAccess('historial_muelle') && (
              <button type="button" onClick={() => { setActiveTab('historial_muelle'); setMobileMenuOpen(false); }} className={getNavButtonClass('historial_muelle')}>
                <ClipboardList className="w-4 h-4" /> Historial de Muelle
              </button>
            )}
            {hasAccess('movements') && (
              <button type="button" onClick={() => { setActiveTab('movements'); setMobileMenuOpen(false); }} className={getNavButtonClass('movements')}>
                <ArrowLeftRight className="w-4 h-4" /> Entradas y Salidas
              </button>
            )}
            {hasAccess('encoder') && (
              <button type="button" onClick={() => { setActiveTab('encoder'); setMobileMenuOpen(false); }} className={getNavButtonClass('encoder')}>
                <Printer className="w-4 h-4" /> Grabación / Impresión Tag
              </button>
            )}
            {(hasAccess('discrepancies') || currentUser.roleKey === 'admin') && (
              <button type="button" onClick={() => { setActiveTab('discrepancies'); setMobileMenuOpen(false); }} className={getNavButtonClass('discrepancies')}>
                <AlertTriangle className="w-4 h-4" /> Discrepancias & Historial
              </button>
            )}
            {hasAccess('reports') && (
              <button type="button" onClick={() => { setActiveTab('reports'); setMobileMenuOpen(false); }} className={getNavButtonClass('reports')}>
                <BarChart3 className="w-4 h-4" /> Reportes & Analítica
              </button>
            )}
            {currentUser.roleKey === 'admin' && (
              <button type="button" onClick={() => { setActiveTab('configuration'); setMobileMenuOpen(false); }} className={getNavButtonClass('configuration')}>
                <Settings className="w-4 h-4" /> Configuración y HW
              </button>
            )}
          </nav>
        </div>

        <button type="button" onClick={handleLogout} className="text-rose-400 hover:text-rose-300 border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)] text-xs font-bold flex items-center justify-center gap-2 p-3 rounded-2xl transition-all mt-4">
          <LogOut className="w-4 h-4" /> Cerrar Sesión
        </button>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#030508] min-h-[100dvh]">
        <header className="h-16 bg-[#05070E]/80 border-b border-slate-800/80 flex items-center justify-between px-4 sm:px-8 shrink-0 z-20 sticky top-0 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 bg-slate-900 text-cyan-400 rounded-xl">
              <Menu className="w-5 h-5" />
            </button>
            <span className="hidden sm:flex items-center gap-2 text-xs bg-emerald-500/10 text-emerald-400 border-2 border-emerald-400/80 px-4 py-1.5 rounded-full font-mono font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <Activity className="w-4 h-4 text-emerald-400" />
              Servidor Middleware Activo
            </span>
          </div>

          <button type="button" onClick={() => { setIsReading(!isReading); showNotification(!isReading ? '📡 Escaneo RFID activo...' : '⏹️ Escaneo detenido.'); }} className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${isReading ? 'bg-amber-400 text-black shadow-[0_0_25px_rgba(251,191,36,0.7)] animate-pulse' : 'bg-[#00f0ff] hover:bg-cyan-300 text-black shadow-[0_0_20px_rgba(0,240,255,0.7)]'}`}>
            {isReading ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isReading ? 'DETENER ESCANEO' : 'ESCANEAR'}</span>
          </button>
        </header>

        <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView 
              totalStockMadefront={totalStockMadefront} totalStockBodega={totalStockBodega}
              movementsLength={movements.length} discrepanciesLength={discrepancies.length}
              inventoryMadefrontLength={inventoryMadefront.length} inventoryBodegaLength={inventoryBodega.length}
              liveActivityFlow={liveActivityFlow} isReading={isReading} showNotification={showNotification}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView 
              inventorySubTab={inventorySubTab} setInventorySubTab={setInventorySubTab}
              inventoryMadefront={inventoryMadefront} setInventoryMadefront={setInventoryMadefront}
              inventoryBodega={inventoryBodega} setInventoryBodega={setInventoryBodega}
              setActiveTab={handleGoToAddProduct} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
              onDeleteProduct={initiateDeleteProduct} onTransferProduct={initiateTransfer}
              onOpenTraceability={openTraceability} onRecodeProduct={openRecodeModal} showNotification={showNotification}
            />
          )}

          {activeTab === 'add-product' && (
            <div className="space-y-6 max-w-2xl mx-auto bg-[#05070E] border-2 border-cyan-400 p-6 sm:p-8 rounded-3xl shadow-[0_0_35px_rgba(0,240,255,0.2)]">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h2 className="text-xl font-black text-white uppercase tracking-wider">Registrar Nuevo Producto</h2>
                <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 px-3 py-1 rounded-full font-bold">Categoría: {newProduct.category}</span>
              </div>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">SKU del Producto</label>
                  <input type="text" placeholder="Ej. INV-005" value={newProduct.id} onChange={(e)=>setNewProduct({...newProduct, id: e.target.value})} className="w-full bg-[#020408] border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-400" required />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Nombre del Artículo</label>
                  <input type="text" placeholder="Nombre descriptivo..." value={newProduct.name} onChange={(e)=>setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-[#020408] border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-400" required />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Categoría</label>
                  <select value={newProduct.category} onChange={(e)=>setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-[#020408] border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white font-bold focus:outline-none focus:border-cyan-400 cursor-pointer">
                    <option value="Herramientas">Herramientas</option><option value="Seguridad">Seguridad</option><option value="CCTV">CCTV</option><option value="Insumos">Insumos</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Stock Inicial</label>
                    <input type="number" placeholder="Cantidad..." value={newProduct.stock} onChange={(e)=>setNewProduct({...newProduct, stock: e.target.value})} className="w-full bg-[#020408] border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-400" required />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Umbral Stock Mínimo</label>
                    <input type="number" placeholder="Mínimo..." value={newProduct.minStock} onChange={(e)=>setNewProduct({...newProduct, minStock: e.target.value})} className="w-full bg-[#020408] border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-400" required />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-[#00f0ff] hover:bg-cyan-300 text-black font-black text-xs py-3.5 rounded-xl uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)]">Guardar Producto</button>
                  <button type="button" onClick={() => setActiveTab('inventory')} className="bg-slate-800 text-slate-300 font-bold text-xs px-6 py-3.5 rounded-xl">Cancelar</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'muelle' && <MuelleView muelleForm={muelleForm} setMuelleForm={setMuelleForm} handleRegisterTruckEntry={handleRegisterTruckEntry} onReportDiscrepancy={handleReportMuelleDiscrepancy} showNotification={showNotification} />}
          {activeTab === 'historial_muelle' && <MuelleHistorialView muelleHistorial={muelleHistorial} setMuelleHistorial={setMuelleHistorial} currentUser={currentUser} showNotification={showNotification} />}
          {activeTab === 'movements' && <MovementsView newMovement={newMovement} setNewMovement={setNewMovement} handleAddMovement={handleAddMovement} movements={movements} />}
          {activeTab === 'encoder' && <EncoderView />}
          {activeTab === 'discrepancies' && <DiscrepancyView discrepancies={discrepancies} deletedHistory={deletedHistory} />}
          {activeTab === 'reports' && <ReportsView showNotification={showNotification} />}
          {activeTab === 'configuration' && currentUser?.roleKey === 'admin' && <ConfigurationView inventoryMadefront={inventoryMadefront} inventoryBodega={inventoryBodega} showNotification={showNotification} />}
        </div>
      </main>
    </div>
  );
}