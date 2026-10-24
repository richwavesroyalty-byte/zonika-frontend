import React, { useState, useEffect } from 'react';
import { 
  Radio, Cpu, Activity, Play, Square, CheckCircle2,
  Boxes, ArrowLeftRight, AlertTriangle, Plus,
  Printer, BarChart3, Settings, ShieldAlert, Building2,
  Trash2, Truck, PackageCheck, Zap, ClipboardList, Warehouse, Store, MapPin,
  Lock, Mail, LogOut, Shield
} from 'lucide-react';
import logoIsotipo from './assets/Logo Isotipo.png';

export default function ZonikaApp() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('zonika_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('muelle');
  const [isReading, setIsReading] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState('Muelle de Carga & Despachos');
  const [inventorySubTab, setInventorySubTab] = useState('madefront');
  const [notification, setNotification] = useState(null);

  // Redirección estricta al iniciar sesión según rol
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

  // --- CONTROL ESTRICTO DE ACCESO (RBAC) ---
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
      { email: 'admin@zonika.com', pass: 'admin123', name: 'Carlos Mendoza', role: 'Administrador', roleKey: 'admin' },
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
      showNotification('🗑️ Registro eliminado.');
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

  // 1. PANTALLA LOGIN
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
              <button type="button" onClick={() => setLoginForm({ email: 'admin@zonika.com', password: 'admin123' })} className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-[10px] font-bold text-center">Admin</button>
              <button type="button" onClick={() => setLoginForm({ email: 'muelle@zonika.com', password: 'muelle123' })} className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-[10px] font-bold text-center">Muelle</button>
              <button type="button" onClick={() => setLoginForm({ email: 'bodega@zonika.com', password: 'bodega123' })} className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-[10px] font-bold text-center">Bodega</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. APLICACIÓN PRINCIPAL
  return (
    <div className="flex h-screen w-screen bg-[#0B1120] text-slate-100 font-sans overflow-hidden">
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-cyan-500 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-cyan-300 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Sidebar con Permisos Estrictos */}
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
                {currentUser.roleKey === 'muelle' ? (
                  <option value="Muelle de Carga & Despachos" className="bg-slate-900">Muelle de Carga & Despachos</option>
                ) : currentUser.roleKey === 'bodega' ? (
                  <>
                    <option value="Madefront Ferretería" className="bg-slate-900">Madefront Ferretería</option>
                    <option value="Bodega Principal" className="bg-slate-900">Bodega Principal</option>
                  </>
                ) : (
                  <>
                    <option value="Madefront Ferretería" className="bg-slate-900">Madefront Ferretería</option>
                    <option value="Bodega Principal" className="bg-slate-900">Bodega Principal</option>
                    <option value="Muelle de Carga & Despachos" className="bg-slate-900">Muelle de Carga & Despachos</option>
                  </>
                )}
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
          {activeTab === 'dashboard' && hasAccess('dashboard') && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <h2 className="text-2xl font-black text-white tracking-tight">Panel General</h2>
              {/* Contenido Dashboard */}
            </div>
          )}

          {activeTab === 'muelle' && hasAccess('muelle') && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Muelle de Carga & Despacho — Recepción de Camiones</h2>
                <p className="text-slate-400 text-xs mt-1">Registro de ingresos de camiones y lectura RFID masiva.</p>
              </div>
              <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
                <form onSubmit={handleRegisterTruckEntry} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Orden de Compra (PO)</label>
                    <input type="text" value={muelleForm.ordenCompra} onChange={(e)=>setMuelleForm({...muelleForm, ordenCompra: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white" required />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Placa del Camión</label>
                    <input type="text" value={muelleForm.placaCamion} onChange={(e)=>setMuelleForm({...muelleForm, placaCamion: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white" required />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Transportadora</label>
                    <input type="text" value={muelleForm.transportadora} onChange={(e)=>setMuelleForm({...muelleForm, transportadora: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Proveedor</label>
                    <input type="text" value={muelleForm.proveedor} onChange={(e)=>setMuelleForm({...muelleForm, proveedor: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white" />
                  </div>
                  <div className="md:col-span-4 flex justify-end pt-2">
                    <button type="submit" className="bg-cyan-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg">Confirmar Ingreso al Stock</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'historial_muelle' && hasAccess('historial_muelle') && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white tracking-tight">Historial de Recepciones en Muelle</h2>
                <button onClick={handleSimulateTruckEntryInHistory} className="bg-cyan-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg">Simular Entrada RFID</button>
              </div>
              <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-6 shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 uppercase text-[10px]">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">PO</th>
                      <th className="py-3 px-4">Placa</th>
                      <th className="py-3 px-4">Transportadora</th>
                      <th className="py-3 px-4">Operador</th>
                      {currentUser.roleKey === 'admin' && <th className="py-3 px-4 text-center">Acciones</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {muelleHistorial.map((rec) => (
                      <tr key={rec.id}>
                        <td className="py-3.5 px-4 font-bold text-cyan-400">{rec.id}</td>
                        <td className="py-3.5 px-4">{rec.ordenCompra}</td>
                        <td className="py-3.5 px-4 text-emerald-400 font-bold">{rec.placaCamion}</td>
                        <td className="py-3.5 px-4">{rec.transportadora}</td>
                        <td className="py-3.5 px-4 font-semibold">{rec.operator}</td>
                        {currentUser.roleKey === 'admin' && (
                          <td className="py-3.5 px-4 text-center">
                            <button onClick={() => handleDeleteMuelleRecord(rec.id)} className="bg-red-500/10 text-red-400 p-2 rounded-xl border border-red-500/30">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && hasAccess('inventory') && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <h2 className="text-2xl font-black text-white tracking-tight">Control de Stock e Inventarios</h2>
              <div className="flex gap-3">
                <button onClick={() => setInventorySubTab('madefront')} className={`px-5 py-2.5 rounded-xl text-xs font-bold ${inventorySubTab === 'madefront' ? 'bg-cyan-500 text-slate-950' : 'bg-[#1E293B] text-slate-300'}`}>Madefront Ferretería</button>
                <button onClick={() => setInventorySubTab('bodega')} className={`px-5 py-2.5 rounded-xl text-xs font-bold ${inventorySubTab === 'bodega' ? 'bg-cyan-500 text-slate-950' : 'bg-[#1E293B] text-slate-300'}`}>Bodega Principal</button>
              </div>
              <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl p-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 uppercase text-[10px]">
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">Producto</th>
                      <th className="py-3 px-4 text-center">Stock</th>
                      {currentUser.roleKey === 'admin' && <th className="py-3 px-4 text-center">Acciones</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {(inventorySubTab === 'madefront' ? inventoryMadefront : inventoryBodega).map((item) => (
                      <tr key={item.id}>
                        <td className="py-3.5 px-4 font-bold text-cyan-400">{item.id}</td>
                        <td className="py-3.5 px-4 font-semibold">{item.name}</td>
                        <td className="py-3.5 px-4 text-center font-bold">{item.stock}</td>
                        {currentUser.roleKey === 'admin' && (
                          <td className="py-3.5 px-4 text-center">
                            <button onClick={() => handleDeleteInventoryItem(item.id, inventorySubTab)} className="bg-red-500/10 text-red-400 p-2 rounded-xl border border-red-500/30">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'monitor' && hasAccess('monitor') && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <h2 className="text-2xl font-black text-white tracking-tight">Monitor de Lectura de EPCs</h2>
              <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl">
                {tags.map(t => (
                  <div key={t.id} className="flex justify-between bg-[#0F172A] p-4 rounded-xl font-mono text-xs">
                    <span className="text-cyan-400">{t.epc}</span>
                    <span className="text-slate-400">{t.item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}