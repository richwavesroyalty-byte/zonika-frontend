import React, { useState, useEffect } from 'react';
import { 
  Radio, Cpu, Activity, Play, Square, CheckCircle2,
  Boxes, ArrowLeftRight, AlertTriangle, Plus,
  Printer, BarChart3, Settings, ShieldAlert, Building2,
  Trash2, Truck, PackageCheck, Zap, ClipboardList, Warehouse, Store, MapPin,
  Lock, Mail, LogOut, Shield, TrendingUp, TrendingDown, Sparkles
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

  useEffect(() => {
    if (currentUser) {
      if (currentUser.roleKey === 'muelle') {
        setActiveTab('muelle');
        setSelectedWarehouse('Muelle de Carga & Despachos');
      } else if (currentUser.roleKey === 'bodega') {
        setActiveTab('inventory');
        setSelectedWarehouse('Madefront Ferretería');
      } else {
        setActiveTab('dashboard');
        setSelectedWarehouse('Muelle de Carga & Despachos');
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

  const [tags, setTags] = useState([
    { id: 1, epc: 'E280689400004001F82B', item: 'Lector Biométrico ZKTeco', ant: 'Muelle - Puerta Principal', rssi: '-54 dBm', time: 'Hace 2s' },
  ]);

  // Datos simulados de rendimiento de ventas para la IA y métricas del Admin
  const [productSalesPerformance] = useState([
    { id: 'INV-001', name: 'Lector Biométrico ZKTeco', category: 'Seguridad', velocity: 'Alta', percentage: 88, trend: 'up', statusColor: 'bg-emerald-500' },
    { id: 'BOD-501', name: 'Taladro Percutor Industrial 800W', category: 'Herramientas', velocity: 'Alta', percentage: 76, trend: 'up', statusColor: 'bg-emerald-500' },
    { id: 'INV-002', name: 'Cámara IP Domo 4K', category: 'CCTV', velocity: 'Media', percentage: 45, trend: 'stable', statusColor: 'bg-cyan-500' },
    { id: 'BOD-502', name: 'Etiqueta RFID UHF Zebra', category: 'Insumos', velocity: 'Baja (Estancado)', percentage: 15, trend: 'down', statusColor: 'bg-amber-500' },
  ]);

  const [muelleForm, setMuelleForm] = useState({ ordenCompra: '', placaCamion: '', transportadora: '', proveedor: '' });
  const [muelleItems, setMuelleItems] = useState([
    { id: 1, sku: 'INV-001', name: 'Lector Biométrico ZKTeco', expected: 50, read: 0, status: 'Pendiente' },
    { id: 2, sku: 'INV-002', name: 'Cámara IP Domo 4K', expected: 20, read: 0, status: 'Pendiente' },
    { id: 3, sku: 'INV-003', name: 'Etiqueta RFID UHF Zebra', expected: 500, read: 0, status: 'Pendiente' },
  ]);

  const [newProduct, setNewProduct] = useState({ id: '', name: '', category: 'Herramientas', stock: '', location: '' });
  const [newMovement, setNewMovement] = useState({ type: 'ENTRADA', item: '', qty: 1 });

  const [encoderForm, setEncoderForm] = useState({
    sku: 'INV-005',
    productName: 'Cerradura Inteligente Biométrica',
    quantity: 10,
    targetWarehouse: 'Madefront Ferretería',
    locationDetail: 'Estante D4',
    generatedEpc: 'E28068940000' + Math.floor(10000000 + Math.random() * 90000000)
  });

  const [encodedHistory, setEncodedHistory] = useState(() => {
    const saved = localStorage.getItem('zonika_encoded_history');
    return saved ? JSON.parse(saved) : [
      { id: 'ENC-901', sku: 'INV-001', name: 'Lector Biométrico ZKTeco', qty: 45, epc: 'E280689400004001F82B', location: 'Madefront Ferretería - Estante A1', time: 'Hace 1 hora', operator: 'Carlos Mendoza' }
    ];
  });

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
    localStorage.setItem('zonika_encoded_history', JSON.stringify(encodedHistory));
  }, [encodedHistory]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const hasAccess = (moduleKey) => {
    if (!currentUser) return false;
    if (currentUser.roleKey === 'admin') return true;

    const rolePermissions = {
      muelle: ['muelle', 'historial_muelle', 'monitor'],
      bodega: ['inventory', 'add-product', 'movements', 'encoder', 'monitor']
    };

    return rolePermissions[currentUser.roleKey]?.includes(moduleKey) || false;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    const usersList = [
      { email: 'admin@zonika.com', pass: 'admin123', name: 'Carlos Mendoza', role: 'Administrador (Gerente)', roleKey: 'admin' },
      { email: 'muelle@zonika.com', pass: 'muelle123', name: 'Juan Pérez', role: 'Operador de Muelle', roleKey: 'muelle' },
      { email: 'bodega@zonika.com', pass: 'bodega123', name: 'Sonia Gómez', role: 'Encargada de Inventario', roleKey: 'bodega' },
    ];

    const match = usersList.find(u => u.email.toLowerCase() === loginForm.email.toLowerCase() && u.pass === loginForm.password);

    if (match) {
      setCurrentUser(match);
      showNotification(`👋 ¡Bienvenido de nuevo, ${match.name}!`);
    } else {
      setLoginError('Credenciales incorrectas. Revisa el correo y la contraseña.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('zonika_current_user');
    showNotification('🔒 Sesión cerrada correctamente.');
  };

  const handleDeleteMuelleRecord = (id) => {
    if (currentUser.roleKey !== 'admin') {
      alert('⚠️ Solo el Administrador tiene autorización para eliminar registros.');
      return;
    }
    if (window.confirm(`¿Estás seguro de eliminar el registro ${id}?`)) {
      setMuelleHistorial(prev => prev.filter(item => item.id !== id));
      showNotification('🗑️ Registro eliminado correctamente.');
    }
  };

  const handleDeleteInventoryItem = (id, warehouseType) => {
    if (currentUser.roleKey !== 'admin') {
      alert('⚠️ Solo el Administrador tiene autorización para eliminar productos.');
      return;
    }
    if (window.confirm(`¿Estás seguro de eliminar el SKU ${id}?`)) {
      if (warehouseType === 'madefront') {
        setInventoryMadefront(prev => prev.filter(item => item.id !== id));
      } else {
        setInventoryBodega(prev => prev.filter(item => item.id !== id));
      }
      showNotification('🗑️ Producto eliminado.');
    }
  };

  const handleDeleteMovement = (id) => {
    if (currentUser.roleKey !== 'admin') {
      alert('⚠️ Solo el Administrador tiene autorización.');
      return;
    }
    setMovements(prev => prev.filter(item => item.id !== id));
    showNotification('🗑️ Movimiento eliminado.');
  };

  const handleDeleteEncodedItem = (id) => {
    if (currentUser.roleKey !== 'admin') {
      alert('⚠️ Solo el Administrador tiene autorización.');
      return;
    }
    setEncodedHistory(prev => prev.filter(item => item.id !== id));
    showNotification('🗑️ Lote eliminado.');
  };

  const handleWarehouseChange = (e) => {
    const selected = e.target.value;
    setSelectedWarehouse(selected);

    if (selected.includes('Madefront') || selected.includes('Bodega')) {
      if (hasAccess('inventory')) {
        setActiveTab('inventory');
        setInventorySubTab(selected.includes('Madefront') ? 'madefront' : 'bodega');
      }
    } else if (selected.includes('Muelle')) {
      if (hasAccess('muelle')) {
        setActiveTab('muelle');
      }
    }
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
    showNotification(`¡Movimiento registrado!`);
  };

  const handleMuelleScan = () => {
    setMuelleItems(prev => prev.map(item => ({ ...item, read: item.expected, status: 'Completo ✓' })));
    showNotification('📡 ¡Escaneo RFID de muelle completado!');
  };

  const handleRegisterTruckEntry = async (e) => {
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
      totalItems: totalQtyRead,
      operator: currentUser.name
    };
    setMuelleHistorial(prev => [newRecord, ...prev]);

    setInventoryMadefront(prevInv => prevInv.map(invItem => {
      const match = muelleItems.find(m => m.sku === invItem.id);
      if (match && match.read > 0) {
        return { ...invItem, stock: Number(invItem.stock) + Number(match.read), rfidTagged: Number(invItem.rfidTagged) + Number(match.read) };
      }
      return invItem;
    }));

    setMuelleForm({ ordenCompra: '', placaCamion: '', transportadora: '', proveedor: '' });
    setMuelleItems(prev => prev.map(i => ({ ...i, read: 0, status: 'Pendiente' })));
    showNotification('✅ ¡Ingreso de camión confirmado!');
  };

  const handleSimulateTruckEntryInHistory = () => {
    const simulatedTruck = {
      id: 'REC-' + Math.floor(100 + Math.random() * 900),
      ordenCompra: 'PO-77312',
      placaCamion: 'SGT-332',
      transportadora: 'TCC Carga',
      proveedor: 'Ferretería Industrial',
      timestamp: new Date().toLocaleString(),
      totalItems: 272,
      operator: currentUser.name
    };
    setMuelleHistorial(prev => [simulatedTruck, ...prev]);
    showNotification(`🚚 ¡Simulacro registrado en historial!`);
  };

  const handleRunAuditSimulation = () => {
    setDiscrepancies([
      { id: 'DISC-101', sku: 'INV-002', item: 'Cámara IP Domo 4K', expected: 12, rfidCount: 10, diff: -2, location: 'Madefront Ferretería - Estante B3', cause: 'Posible extravío' }
    ]);
    showNotification('🛰️ Auditoría completada.');
  };

  const handleEncodeAndPrint = (e) => {
    e.preventDefault();
    const newItem = {
      id: encoderForm.sku,
      epc: encoderForm.generatedEpc,
      name: encoderForm.productName,
      category: 'General',
      stock: parseInt(encoderForm.quantity),
      rfidTagged: parseInt(encoderForm.quantity),
      location: `${encoderForm.targetWarehouse} - ${encoderForm.locationDetail}`,
      status: 'Optimal'
    };

    if (encoderForm.targetWarehouse === 'Madefront Ferretería') {
      setInventoryMadefront(prev => [newItem, ...prev]);
    } else {
      setInventoryBodega(prev => [newItem, ...prev]);
    }

    setEncodedHistory(prev => [{
      id: 'ENC-' + Math.floor(100 + Math.random() * 900),
      sku: encoderForm.sku,
      name: encoderForm.productName,
      qty: parseInt(encoderForm.quantity),
      epc: encoderForm.generatedEpc,
      location: `${encoderForm.targetWarehouse} - ${encoderForm.locationDetail}`,
      time: 'Justo ahora',
      operator: currentUser.name
    }, ...prev]);

    showNotification(`🖨️ ¡${encoderForm.quantity} Tags codificados!`);
  };

  const totalStockMadefront = inventoryMadefront.reduce((acc, item) => acc + Number(item.stock), 0);
  const totalStockBodega = inventoryBodega.reduce((acc, item) => acc + Number(item.stock), 0);

  if (!currentUser) {
    return (
      <div className="flex h-screen w-screen bg-[#0B1120] text-slate-100 font-sans items-center justify-center p-4">
        {notification && (
          <div className="fixed top-5 right-5 z-50 bg-cyan-500 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-cyan-300 animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span>{notification}</span>
          </div>
        )}
        <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-500"></div>
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-[#1E293B] border border-slate-700/80 rounded-2xl flex items-center justify-center p-3 shadow-inner mx-auto">
              <img src={logoIsotipo} alt="Zonika Isotipo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-black text-2xl text-white tracking-widest leading-none">ZONIKA</h1>
              <p className="text-xs text-cyan-400 font-bold tracking-widest uppercase mt-1">RFID ENTERPRISE</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs font-semibold text-center">
                {loginError}
              </div>
            )}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input type="email" value={loginForm.email} onChange={(e)=>setLoginForm({...loginForm, email: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-semibold" required />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input type="password" value={loginForm.password} onChange={(e)=>setLoginForm({...loginForm, password: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-semibold" required />
              </div>
            </div>
            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg transition-all uppercase tracking-wider flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" /> Iniciar Sesión
            </button>
          </form>

          <div className="border-t border-slate-800/80 pt-5 space-y-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Cuentas con Permisos Filtrados:</p>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => setLoginForm({ email: 'admin@zonika.com', password: 'admin123' })} className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-[10px] font-bold text-center">Admin (Todo)</button>
              <button type="button" onClick={() => setLoginForm({ email: 'muelle@zonika.com', password: 'muelle123' })} className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-[10px] font-bold text-center">Muelle</button>
              <button type="button" onClick={() => setLoginForm({ email: 'bodega@zonika.com', password: 'bodega123' })} className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-[10px] font-bold text-center">Bodega</button>
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

      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between p-4 z-10 shrink-0 select-none">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 mb-5 border-b border-slate-800/80">
            <div className="w-14 h-14 bg-[#1E293B] border border-slate-700/80 rounded-2xl flex items-center justify-center p-2 shadow-inner overflow-hidden shrink-0">
              <img src={logoIsotipo} alt="Zonika Isotipo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-black text-xl text-white tracking-widest leading-none">ZONIKA</h1>
              <p className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase mt-1">RFID ENTERPRISE</p>
            </div>
          </div>

          <div className="mb-6 px-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Sede / Almacén Activo</label>
            <div className="flex items-center gap-2 bg-[#1E293B] border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200">
              <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <select value={selectedWarehouse} onChange={handleWarehouseChange} className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer">
                <option value="Madefront Ferretería" className="bg-slate-900">Madefront Ferretería</option>
                <option value="Bodega Principal" className="bg-slate-900">Bodega Principal</option>
                <option value="Muelle de Carga & Despachos" className="bg-slate-900">Muelle de Carga & Despachos</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-290px)] pr-1">
            <div>
              <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Operación & Stock</p>
              <nav className="space-y-1">
                {hasAccess('dashboard') && (
                  <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'dashboard' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg' : 'text-slate-300 hover:bg-slate-800'}`}>
                    <Activity className="w-4 h-4" /> Panel General
                  </button>
                )}
                {hasAccess('inventory') && (
                  <button onClick={() => setActiveTab('inventory')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'inventory' || activeTab === 'add-product' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg' : 'text-slate-300 hover:bg-slate-800'}`}>
                    <Boxes className="w-4 h-4" /> Stock e Inventarios
                  </button>
                )}
                {hasAccess('muelle') && (
                  <button onClick={() => setActiveTab('muelle')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'muelle' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg' : 'text-slate-300 hover:bg-slate-800'}`}>
                    <Truck className="w-4 h-4" /> Recepción en Muelle
                  </button>
                )}
                {hasAccess('historial_muelle') && (
                  <button onClick={() => setActiveTab('historial_muelle')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'historial_muelle' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg' : 'text-slate-300 hover:bg-slate-800'}`}>
                    <ClipboardList className="w-4 h-4" /> Historial de Muelle
                  </button>
                )}
                {hasAccess('movements') && (
                  <button onClick={() => setActiveTab('movements')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'movements' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg' : 'text-slate-300 hover:bg-slate-800'}`}>
                    <ArrowLeftRight className="w-4 h-4" /> Entradas y Salidas
                  </button>
                )}
                {hasAccess('audits') && (
                  <button onClick={() => setActiveTab('audits')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'audits' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg' : 'text-slate-300 hover:bg-slate-800'}`}>
                    <ShieldAlert className="w-4 h-4" /> Auditorías & Cuadres
                  </button>
                )}
              </nav>
            </div>

            {(hasAccess('encoder') || hasAccess('monitor') || hasAccess('hardware')) && (
              <div>
                <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Herramientas RFID</p>
                <nav className="space-y-1">
                  {hasAccess('encoder') && (
                    <button onClick={() => setActiveTab('encoder')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'encoder' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg' : 'text-slate-300 hover:bg-slate-800'}`}>
                      <Printer className="w-4 h-4" /> Grabación / Impresión Tag
                    </button>
                  )}
                  {hasAccess('monitor') && (
                    <button onClick={() => setActiveTab('monitor')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'monitor' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg' : 'text-slate-300 hover:bg-slate-800'}`}>
                      <Radio className="w-4 h-4" /> Monitor de Tags (EPC)
                    </button>
                  )}
                  {hasAccess('hardware') && (
                    <button onClick={() => setActiveTab('hardware')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'hardware' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg' : 'text-slate-300 hover:bg-slate-800'}`}>
                      <Cpu className="w-4 h-4" /> Hardware & Antenas
                    </button>
                  )}
                </nav>
              </div>
            )}

            {(hasAccess('reports') || hasAccess('settings')) && (
              <div>
                <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Sistema & Analítica</p>
                <nav className="space-y-1">
                  {hasAccess('reports') && (
                    <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'reports' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg' : 'text-slate-300 hover:bg-slate-800'}`}>
                      <BarChart3 className="w-4 h-4" /> Reportes & Exportación
                    </button>
                  )}
                  {hasAccess('settings') && (
                    <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'settings' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg' : 'text-slate-300 hover:bg-slate-800'}`}>
                      <Settings className="w-4 h-4" /> Configuración ERP
                    </button>
                  )}
                </nav>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-3 px-2 space-y-2">
          <div className="flex items-center justify-between bg-[#1E293B] border border-slate-700/80 p-2.5 rounded-xl">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-xs shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[9px] text-cyan-400 font-bold uppercase">{currentUser.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} title="Cerrar Sesión" className="text-slate-400 hover:text-red-400 p-1 rounded-lg transition-colors shrink-0">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#0B1120]">
        <header className="h-16 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-20 shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ESTADO:</span>
            <span className="flex items-center gap-2 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Servidor Middleware Activo
            </span>
          </div>

          <button onClick={() => { setIsReading(!isReading); showNotification(!isReading ? '📡 Escaneo RFID activo...' : '⏹️ Escaneo detenido.'); }} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg ${isReading ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-emerald-500 text-slate-950'}`}>
            {isReading ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {isReading ? 'DETENER ESCANEO' : 'INICIAR CONTEO RFID'}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          
          {/* DASHBOARD CON TABLA DE ROTACIÓN Y ALERTAS DE IA */}
          {activeTab === 'dashboard' && hasAccess('dashboard') && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Panel General de Inventarios</h2>
                <p className="text-slate-400 text-xs mt-1 font-medium">Supervisión gerencial del stock, rotación de ventas y analítica predictiva.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-md space-y-2">
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-cyan-400" /> Stock Madefront Ferretería
                  </p>
                  <p className="text-4xl font-black text-white">{totalStockMadefront} <span className="text-xs font-normal text-slate-400">unidades</span></p>
                  <span className="text-[10px] text-emerald-400 block font-semibold uppercase">{inventoryMadefront.length} referencias activas</span>
                </div>

                <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-md space-y-2">
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Warehouse className="w-3.5 h-3.5 text-cyan-400" /> Stock Bodega Principal
                  </p>
                  <p className="text-4xl font-black text-cyan-400">{totalStockBodega} <span className="text-xs font-normal text-slate-400">unidades</span></p>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">{inventoryBodega.length} referencias activas</span>
                </div>

                <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-md space-y-2">
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" /> Movimientos Registrados
                  </p>
                  <p className="text-4xl font-black text-cyan-400">{movements.length}</p>
                  <span className="text-[10px] text-emerald-400 block font-semibold uppercase">Auditoría al día</span>
                </div>

                <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-md space-y-2">
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Discrepancias RFID
                  </p>
                  <p className="text-4xl font-black text-amber-400">{discrepancies.length}</p>
                  <span className="text-[10px] text-amber-400 block font-semibold uppercase">Requieren revisión</span>
                </div>
              </div>

              {/* NUEVA SECCIÓN: TABLA DE ROTACIÓN Y RENDIMIENTO DE VENTAS CON BARRAS DE COLORES (IA READY) */}
              <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Rendimiento de Ventas & Rotación de Productos</h3>
                      <p className="text-[11px] text-slate-400">Analítica de velocidad de salida y demanda para la toma de decisiones gerenciales.</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Zonika AI Ready
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-900/40">
                        <th className="py-3 px-4">SKU / Producto</th>
                        <th className="py-3 px-4">Categoría</th>
                        <th className="py-3 px-4">Demanda / Velocidad</th>
                        <th className="py-3 px-4 w-52">Porcentaje de Venta / Rotación</th>
                        <th className="py-3 px-4 text-center">Tendencia IA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200 font-medium">
                      {productSalesPerformance.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-white">
                            <span className="font-mono text-cyan-400 mr-2">{item.id}</span> {item.name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">{item.category}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                              item.velocity === 'Alta' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                              item.velocity === 'Media' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' :
                              'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}>
                              {item.velocity}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-mono font-bold text-slate-300">
                                <span>{item.percentage}% del objetivo</span>
                              </div>
                              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/60">
                                <div 
                                  className={`h-full rounded-full ${item.statusColor} transition-all duration-500`} 
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {item.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-400 mx-auto" title="Tendencia al alza" />}
                            {item.trend === 'stable' && <Activity className="w-4 h-4 text-cyan-400 mx-auto" title="Demanda estable" />}
                            {item.trend === 'down' && <TrendingDown className="w-4 h-4 text-amber-400 mx-auto" title="Baja rotación / Alerta" />}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ALERTA PREDICTIVA DE IA SIMULADA */}
                <div className="bg-gradient-to-r from-amber-500/10 via-cyan-500/5 to-emerald-500/10 border border-cyan-500/30 p-4 rounded-xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white flex items-center gap-2">
                      Zonika AI — Análisis Predictivo de Stock:
                    </p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      El producto <strong className="text-amber-400">Etiqueta RFID UHF Zebra (BOD-502)</strong> presenta baja rotación (18%). Se recomienda programar una campaña de promoción o reasignar stock antes de generar sobrecostos de almacenamiento en la Bodega Principal.
                    </p>
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-cyan-400" /> Últimos Movimientos en Sistema
                  </h3>
                  <div className="space-y-2.5">
                    {movements.slice(0, 3).map((m) => (
                      <div key={m.id} className="flex justify-between items-center bg-[#0F172A] border border-slate-800 p-3 rounded-xl text-xs">
                        <div>
                          <span className="text-white font-semibold block">{m.item}</span>
                          <span className="text-[10px] text-slate-400">Por: {m.user} • {m.time}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${m.type === 'ENTRADA' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                          {m.type} ({m.qty})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Truck className="w-4 h-4 text-cyan-400" /> Estado del Sistema RFID & Antenas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-[#0F172A] border border-slate-800 p-3 rounded-xl text-xs">
                      <span className="text-slate-300 font-semibold">Lector Fijo Zebra FX9600 (Muelle)</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">ONLINE</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#0F172A] border border-slate-800 p-3 rounded-xl text-xs">
                      <span className="text-slate-300 font-semibold">Colector Chainway C66 (Handheld)</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">ONLINE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MUELLE */}
          {activeTab === 'muelle' && hasAccess('muelle') && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Muelle de Carga & Despacho — Recepción de Camiones</h2>
                <p className="text-slate-400 text-xs mt-1 font-medium">Registro de ingresos de camiones, órdenes de compra y lectura RFID masiva en tiempo real.</p>
              </div>

              <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-cyan-400" /> Datos del Transporte y Proveedor
                </h3>
                <form onSubmit={handleRegisterTruckEntry} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Orden de Compra (PO)</label>
                    <input type="text" placeholder="Ej. PO-98210" value={muelleForm.ordenCompra} onChange={(e)=>setMuelleForm({...muelleForm, ordenCompra: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400" required />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Placa del Camión</label>
                    <input type="text" placeholder="Ej. SGT-442" value={muelleForm.placaCamion} onChange={(e)=>setMuelleForm({...muelleForm, placaCamion: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400" required />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Transportadora</label>
                    <input type="text" placeholder="Ej. TCC / Deprisa" value={muelleForm.transportadora} onChange={(e)=>setMuelleForm({...muelleForm, transportadora: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Proveedor</label>
                    <input type="text" placeholder="Ej. Ferretería Mayorista SAS" value={muelleForm.proveedor} onChange={(e)=>setMuelleForm({...muelleForm, proveedor: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400" />
                  </div>

                  <div className="md:col-span-4 flex justify-end gap-3 pt-2">
                    <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Confirmar Ingreso de Mercancía al Stock
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-cyan-400" /> Mercancía Detectada por Antena RFID (Muelle)
                  </h3>
                  <button type="button" onClick={handleMuelleScan} className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs px-4 py-2 rounded-xl transition-all">
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
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${item.read === item.expected && item.expected > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : item.read > 0 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                              {item.read === item.expected && item.expected > 0 ? 'Completo ✓' : item.read > 0 ? 'Parcial' : item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button type="button" onClick={() => {
                              const qty = prompt(`Actualizar cantidad leída para ${item.name}:`, item.read);
                              if (qty !== null && !isNaN(qty)) {
                                const val = parseInt(qty);
                                setMuelleItems(muelleItems.map(i => i.id === item.id ? { ...i, read: val, status: val === i.expected ? 'Completo ✓' : 'Ajustado Manual' } : i));
                                showNotification(`Cantidad de ${item.name} ajustada a ${val}`);
                              }
                            }} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors">
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
          {activeTab === 'historial_muelle' && hasAccess('historial_muelle') && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Historial de Recepciones en Muelle</h2>
                  <p className="text-slate-400 text-xs mt-1 font-medium">Registro detallado de todos los camiones procesados e ingresados al inventario.</p>
                </div>
                <button 
                  onClick={handleSimulateTruckEntryInHistory} 
                  className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <Truck className="w-4 h-4" /> 🚚 Simular Entrada de Camión RFID
                </button>
              </div>

              <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-cyan-400" /> Registro Histórico de Entradas
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">Total Registros: {muelleHistorial.length}</span>
                </div>

                {muelleHistorial.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">No hay recepciones registradas aún.</div>
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
                          <th className="py-3 px-4 text-center">Total Ítems</th>
                          <th className="py-3 px-4">Operador</th>
                          <th className="py-3 px-4">Fecha y Hora</th>
                          <th className="py-3 px-4 text-center">Acciones</th>
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
                            <td className="py-3.5 px-4 text-slate-300 font-semibold">{rec.operator || 'Operador'}</td>
                            <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{rec.timestamp}</td>
                            <td className="py-3.5 px-4 text-center">
                              <button 
                                onClick={() => handleDeleteMuelleRecord(rec.id)}
                                title="Eliminar registro"
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-xl border border-red-500/30 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* INVENTARIOS */}
          {activeTab === 'inventory' && hasAccess('inventory') && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Control de Stock e Inventarios</h2>
                  <p className="text-slate-400 text-xs mt-1 font-medium">Gestión separada por ubicación física para mayor precisión.</p>
                </div>
                <button onClick={() => setActiveTab('add-product')} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg">
                  <Plus className="w-4 h-4" /> Registrar Nuevo Producto
                </button>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setInventorySubTab('madefront')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${inventorySubTab === 'madefront' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'bg-[#1E293B] text-slate-300 border border-slate-700 hover:bg-slate-800'}`}>
                  <Store className="w-4 h-4" /> Madefront Ferretería ({inventoryMadefront.length} ítems)
                </button>
                <button onClick={() => setInventorySubTab('bodega')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${inventorySubTab === 'bodega' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'bg-[#1E293B] text-slate-300 border border-slate-700 hover:bg-slate-800'}`}>
                  <Warehouse className="w-4 h-4" /> Bodega Principal ({inventoryBodega.length} ítems)
                </button>
              </div>

              <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 bg-slate-900/50 border-b border-slate-700 flex justify-between items-center">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{inventorySubTab === 'madefront' ? '📍 Ubicación Activa: Madefront Ferretería' : '📍 Ubicación Activa: Bodega Principal'}</span>
                  <span className="text-xs text-slate-400 font-mono">Total Registros: {inventorySubTab === 'madefront' ? inventoryMadefront.length : inventoryBodega.length}</span>
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
                        <th className="py-3 px-4 text-center">Acciones</th>
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
                          <td className="py-3.5 px-4 text-center">
                            <button 
                              onClick={() => handleDeleteInventoryItem(item.id, inventorySubTab)}
                              title="Eliminar producto"
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-xl border border-red-500/30 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
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

          {activeTab === 'add-product' && hasAccess('inventory') && (
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

          {/* MOVIMIENTOS */}
          {activeTab === 'movements' && hasAccess('movements') && (
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
                        <th className="py-3 px-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
                      {movements.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{m.id}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${m.type === 'ENTRADA' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>{m.type}</span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-white">{m.item}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-white">{m.qty}</td>
                          <td className="py-3.5 px-4 text-slate-300 font-semibold">{m.user}</td>
                          <td className="py-3.5 px-4 text-slate-500">{m.time}</td>
                          <td className="py-3.5 px-4 text-center">
                            <button 
                              onClick={() => handleDeleteMovement(m.id)}
                              title="Eliminar movimiento"
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-xl border border-red-500/30 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
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

          {/* AUDITORÍAS & DISCREPANCIAS */}
          {activeTab === 'audits' && hasAccess('audits') && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Auditorías & Discrepancias RFID</h2>
                  <p className="text-slate-400 text-xs mt-1 font-medium">Comparativa automática entre el stock teórico del ERP y el conteo físico con ubicación exacta.</p>
                </div>
                <button onClick={handleRunAuditSimulation} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all">
                  <Zap className="w-4 h-4" /> 🛰️ Ejecutar Conteo / Auditoría RFID
                </button>
              </div>

              <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" /> Registro de Discrepancias por Ubicación
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">Total Alertas: {discrepancies.length}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">ID Auditoría</th>
                        <th className="py-3 px-4">SKU / Producto</th>
                        <th className="py-3 px-4">📍 Ubicación Exacta</th>
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
                          <td className="py-3.5 px-4 font-semibold text-white">{d.sku} - {d.item}</td>
                          <td className="py-3.5 px-4 text-cyan-300 font-bold">
                            <div className="flex items-center gap-1.5 bg-[#0F172A] border border-slate-800 px-3 py-2 rounded-xl">
                              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span>{d.location}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-slate-300">{d.expected}</td>
                          <td className="py-3.5 px-4 text-center text-cyan-400 font-bold">{d.rfidCount}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-2.5 py-1 rounded-md font-black ${d.diff < 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>
                              {d.diff > 0 ? `+${d.diff}` : d.diff}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">{d.cause}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MÓDULO GRABACIÓN / IMPRESIÓN DE TAGS */}
          {activeTab === 'encoder' && hasAccess('encoder') && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Grabación e Impresión de Tags RFID</h2>
                <p className="text-slate-400 text-xs mt-1 font-medium">Estación de codificación de chips EPC y generación de etiquetas UHF para nuevos artículos.</p>
              </div>

              <div className="bg-[#1E293B] border border-slate-700/60 p-8 rounded-2xl shadow-xl space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-700/80 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Generador & Codificador EPC Class 1 Gen 2</h3>
                    <p className="text-xs text-slate-400">Los datos ingresados se grabarán en la etiqueta física y alimentarán el stock del almacén seleccionado.</p>
                  </div>
                </div>

                <form onSubmit={handleEncodeAndPrint} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">SKU / Código del Producto</label>
                      <input type="text" value={encoderForm.sku} onChange={(e)=>setEncoderForm({...encoderForm, sku: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono font-bold" required />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Nombre del Producto</label>
                      <input type="text" value={encoderForm.productName} onChange={(e)=>setEncoderForm({...encoderForm, productName: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-semibold" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Cantidad de Tags a Imprimir</label>
                      <input type="number" min="1" value={encoderForm.quantity} onChange={(e)=>setEncoderForm({...encoderForm, quantity: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-bold" required />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Almacén Destino</label>
                      <select value={encoderForm.targetWarehouse} onChange={(e)=>setEncoderForm({...encoderForm, targetWarehouse: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-bold cursor-pointer">
                        <option value="Madefront Ferretería">Madefront Ferretería</option>
                        <option value="Bodega Principal">Bodega Principal</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Ubicación / Estante</label>
                      <input type="text" value={encoderForm.locationDetail} onChange={(e)=>setEncoderForm({...encoderForm, locationDetail: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400" required />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Código EPC Hexadecimal Autogenerado (Chip UHF)</label>
                    <div className="flex gap-2">
                      <input type="text" value={encoderForm.generatedEpc} readOnly className="w-full bg-[#0F172A]/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-cyan-400 font-mono font-bold select-all" />
                      <button type="button" onClick={()=>setEncoderForm({...encoderForm, generatedEpc: 'E28068940000' + Math.floor(10000000 + Math.random() * 90000000)})} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 rounded-xl border border-slate-700 shrink-0 transition-colors">Regenerar EPC</button>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 uppercase tracking-wider">
                      <Printer className="w-4 h-4" /> Grabar Chip EPC e Imprimir Etiqueta
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-cyan-400" /> Historial de Tags Codificados en esta Sesión
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">Total Registros: {encodedHistory.length}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">ID Lote</th>
                        <th className="py-3 px-4">SKU / Producto</th>
                        <th className="py-3 px-4">Código EPC</th>
                        <th className="py-3 px-4 text-center">Cantidad</th>
                        <th className="py-3 px-4">Ubicación Destino</th>
                        <th className="py-3 px-4">Operador</th>
                        <th className="py-3 px-4">Momento</th>
                        <th className="py-3 px-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200 font-medium">
                      {encodedHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{item.id}</td>
                          <td className="py-3.5 px-4 font-semibold text-white">{item.sku} - {item.name}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{item.epc}</td>
                          <td className="py-3.5 px-4 text-center font-black text-cyan-400">{item.qty}</td>
                          <td className="py-3.5 px-4 text-slate-300">{item.location}</td>
                          <td className="py-3.5 px-4 text-slate-300 font-semibold">{item.operator || 'Operador'}</td>
                          <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{item.time}</td>
                          <td className="py-3.5 px-4 text-center">
                            <button 
                              onClick={() => handleDeleteEncodedItem(item.id)}
                              title="Eliminar registro de codificación"
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-xl border border-red-500/30 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
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

          {activeTab === 'monitor' && hasAccess('monitor') && (
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

          {activeTab === 'hardware' && hasAccess('hardware') && (
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

          {activeTab === 'reports' && hasAccess('reports') && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <h2 className="text-2xl font-black text-white tracking-tight">Reportes & Exportación</h2>
              <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl">
                <p className="text-xs text-slate-400">Exporta historiales de inventario y lecturas RFID a Excel o CSV.</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && hasAccess('settings') && (
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