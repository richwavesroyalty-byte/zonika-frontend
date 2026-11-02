import React, { useState, useEffect } from 'react';
import { Settings, Radar, Cpu, RefreshCw, Terminal, CheckCircle2, ShieldAlert, Activity, Wifi, HardDrive, Zap, X } from 'lucide-react';

export default function ConfigurationView({
  inventoryMadefront,
  inventoryBodega,
  showNotification
}) {
  // Estado para el buscador y el radar centralizado
  const [selectedEpc, setSelectedEpc] = useState('');
  const [radarActive, setRadarActive] = useState(false);
  const [rssiSignal, setRssiSignal] = useState(0);

  // Estados de simulación de Hardware
  const [hardwareStatus, setHardwareStatus] = useState({
    zebra: { status: 'Online', latency: '14ms', txPower: '30 dBm' },
    chainway: { status: 'Sincronizado', battery: '88%', lastSync: 'Hace 2 min' }
  });
  const [isRestarting, setIsRestarting] = useState(null);

  // Unificar todo el inventario global para que el admin pueda buscar cualquier producto
  const allProducts = [...inventoryMadefront, ...inventoryBodega];

  // Simulación de la señal de radar cuando está activo
  useEffect(() => {
    let interval;
    if (radarActive) {
      interval = setInterval(() => {
        setRssiSignal(prev => {
          const newSignal = prev + (Math.random() > 0.5 ? 12 : -8);
          return Math.max(15, Math.min(100, newSignal));
        });
      }, 700);
    } else {
      setRssiSignal(0);
    }
    return () => clearInterval(interval);
  }, [radarActive]);

  const handleStartRadar = (e) => {
    e.preventDefault();
    if (!selectedEpc) {
      if (showNotification) showNotification("⚠️ Por favor selecciona un producto o EPC para iniciar el radar.");
      return;
    }
    setRssiSignal(30);
    setRadarActive(true);
  };

  // Simular reinicio o comandos de hardware
  const handleHardwareAction = (device, action) => {
    setIsRestarting(device);
    setTimeout(() => {
      setIsRestarting(null);
      if (showNotification) {
        showNotification(`⚙️ Dispositivo [${device.toUpperCase()}] ejecutó comando: ${action} con éxito.`);
      }
    }, 1200);
  };

  const getRadarStatus = () => {
    if (rssiSignal > 80) return { color: 'text-emerald-400', bg: 'bg-emerald-400', text: '¡Muy Cerca del Tag!' };
    if (rssiSignal > 40) return { color: 'text-amber-400', bg: 'bg-amber-400', text: 'Acercándose al objetivo...' };
    return { color: 'text-rose-400', bg: 'bg-rose-400', text: 'Buscando señal RSSI...' };
  };

  const radarStatus = getRadarStatus();
  const targetProduct = allProducts.find(p => p.epc === selectedEpc);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Encabezado de la Vista */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-cyan-400" /> Panel de Configuración y Hardware (Admin)
          </h2>
          <p className="text-slate-400 text-xs mt-1 font-medium">
            Gestión centralizada de dispositivos IoT, antenas UHF, parámetros del middleware y Búsqueda Activa (Modo Radar).
          </p>
        </div>
        <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" /> Acceso Restringido: Administrador
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SECCIÓN 1: MODO RADAR CENTRALIZADO (Ocupa 2 columnas) */}
        <div className="lg:col-span-2 bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
            <Radar className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Búsqueda Activa por Proximidad (Modo Radar)</h3>
              <p className="text-[10px] text-slate-400">Selecciona un activo RFID para triangular su posición exacta en las instalaciones.</p>
            </div>
          </div>

          <form onSubmit={handleStartRadar} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">Seleccionar Producto o EPC Global</label>
              <select 
                value={selectedEpc}
                onChange={(e) => setSelectedEpc(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-700 text-xs font-bold text-white p-3 rounded-xl focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="">-- Selecciona un ítem del inventario general --</option>
                {allProducts.map((item, idx) => (
                  <option key={idx} value={item.epc}>
                    {item.name} (SKU: {item.id}) - EPC: {item.epc}
                  </option>
                ))}
              </select>
            </div>

            <button 
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3.5 rounded-xl uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Radar className="w-4 h-4" /> Iniciar Varita / Radar de Proximidad
            </button>
          </form>

          {/* Interfaz visual del Radar Activo */}
          {radarActive && targetProduct && (
            <div className="bg-[#0F172A] border border-amber-500/40 rounded-2xl p-6 relative overflow-hidden space-y-4 shadow-2xl">
              <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
                <div className="w-72 h-72 rounded-full border-4 border-amber-400 animate-ping"></div>
              </div>

              <div className="flex justify-between items-center relative z-10">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 block">Objetivo Enlace Activo</span>
                  <h4 className="text-sm font-bold text-white">{targetProduct.name}</h4>
                  <span className="font-mono text-xs text-slate-400">{targetProduct.epc}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setRadarActive(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-xs font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 relative z-10">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-slate-400">Intensidad de Señal (RSSI)</span>
                  <span className={`text-2xl font-black ${radarStatus.color}`}>{Math.round(rssiSignal)}%</span>
                </div>
                <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                  <div className={`h-full ${radarStatus.bg} transition-all duration-300`} style={{ width: `${rssiSignal}%` }}></div>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <Activity className={`w-4 h-4 ${radarStatus.color} animate-pulse`} />
                  <span className={`text-xs font-bold uppercase tracking-wider ${radarStatus.color}`}>{radarStatus.text}</span>
                </div>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-[10px] text-slate-300 flex justify-between items-center relative z-10">
                <span>📍 Ubicación Registrada: <strong>{targetProduct.location}</strong></span>
                <span className="text-cyan-400 font-mono">ID: {targetProduct.id}</span>
              </div>
            </div>
          )}
        </div>

        {/* SECCIÓN 2: CONTROL DE HARDWARE IOT (1 columna) */}
        <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Estado de Hardware</h3>
              <p className="text-[10px] text-slate-400">Lectores y Antenas conectadas al Middleware.</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Tarjeta Zebra FX9600 */}
            <div className="bg-[#0F172A] border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" /> Zebra FX9600 (Muelle)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">IP: 192.168.1.150</span>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                  Online
                </span>
              </div>
              <div className="text-[10px] text-slate-400 flex justify-between border-t border-slate-800 pt-2">
                <span>Latencia: {hardwareStatus.zebra.latency}</span>
                <span>Tx: {hardwareStatus.zebra.txPower}</span>
              </div>
              <button 
                type="button"
                disabled={isRestarting === 'zebra'}
                onClick={() => handleHardwareAction('zebra', 'Reiniciar Antena y Limpiar Caché')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-[10px] py-2 rounded-lg transition-all flex items-center justify-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isRestarting === 'zebra' ? 'animate-spin' : ''}`} /> 
                {isRestarting === 'zebra' ? 'Reiniciando...' : 'Reiniciar Antena'}
              </button>
            </div>

            {/* Tarjeta Chainway C66 */}
            <div className="bg-[#0F172A] border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-cyan-400" /> Chainway C66 (Handheld)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Sede: Madefront / Bodega</span>
                </div>
                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                  Activo
                </span>
              </div>
              <div className="text-[10px] text-slate-400 flex justify-between border-t border-slate-800 pt-2">
                <span>Batería: {hardwareStatus.chainway.battery}</span>
                <span>Últ. Sinc: {hardwareStatus.chainway.lastSync}</span>
              </div>
              <button 
                type="button"
                disabled={isRestarting === 'chainway'}
                onClick={() => handleHardwareAction('chainway', 'Forzar Sincronización de Base de Datos Local')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-indigo-400 font-bold text-[10px] py-2 rounded-lg transition-all flex items-center justify-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isRestarting === 'chainway' ? 'animate-spin' : ''}`} /> 
                {isRestarting === 'chainway' ? 'Sincronizando...' : 'Forzar Sincronización'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}