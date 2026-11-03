import React, { useState } from 'react';
import { Truck, Radio, Play, Square, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export default function MuelleView({ 
  muelleForm, 
  setMuelleForm, 
  handleRegisterTruckEntry, 
  onReportDiscrepancy,
  showNotification 
}) {
  const [muelleReading, setMuelleReading] = useState(false);
  const [muelleItems, setMuelleItems] = useState([
    { id: 1, sku: 'INV-001', name: 'Lector Biométrico ZKTeco', expected: 50, read: 45, status: 'En revisión' },
    { id: 2, sku: 'INV-002', name: 'Cámara IP Domo 4K', expected: 20, read: 20, status: 'Completado' },
    { id: 3, sku: 'INV-003', name: 'Etiqueta RFID UHF Zebra', expected: 500, read: 500, status: 'Completado' },
  ]);

  const handleSimulateAntennaRead = () => {
    setMuelleReading(!muelleReading);
    if (!muelleReading) {
      if (showNotification) showNotification('📡 Antena Zebra FX9600 (Muelle) transmitiendo... Leyendo tags UHF.');
      setTimeout(() => {
        setMuelleItems(prev => prev.map(item => item.sku === 'INV-001' ? { ...item, read: 50, status: 'Completado' } : item));
        if (showNotification) showNotification('✅ ¡Lote de camión verificado al 100% por RFID!');
      }, 2500);
    } else {
      if (showNotification) showNotification('⏹️ Lectura de muelle pausada.');
    }
  };

  const handleReportClick = (item) => {
    if (typeof onReportDiscrepancy === 'function') {
      onReportDiscrepancy({
        sku: item.sku,
        name: item.name,
        expected: item.expected,
        read: item.read,
        ordenCompra: muelleForm.ordenCompra || 'PO-General',
        placaCamion: muelleForm.placaCamion || 'SGT-000',
        reason: 'Diferencia detectada en recepción de muelle',
        description: `Se esperaban ${item.expected} unidades y la antena registró ${item.read} unidades.`
      });
    }

    setMuelleItems(prev => prev.filter(i => i.id !== item.id));

    if (showNotification) {
      showNotification(`⚠️ SKU ${item.sku} reportado y movido a Discrepancias.`);
    }
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    if (typeof handleRegisterTruckEntry === 'function') {
      handleRegisterTruckEntry(e, muelleItems);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Muelle de Carga & Despacho — Recepción de Camiones</h2>
        <p className="text-slate-400 text-xs mt-1 font-medium">Registro de ingresos de transporte, órdenes de compra y validación masiva de mercancía mediante antenas RFID fijas.</p>
      </div>

      {/* FORMULARIO DE TRANSPORTE - ESTILO BLACK OLED */}
      <div className="bg-[#05070E] border-2 border-cyan-400/50 p-6 rounded-3xl shadow-[0_0_30px_rgba(0,240,255,0.15)] space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <Truck className="w-5 h-5 text-[#00f0ff]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Datos del Proveedor y Logística de Transporte</h3>
        </div>

        <form onSubmit={onSubmitForm} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Orden de Compra (PO)</label>
              <input 
                type="text" 
                placeholder="Ej. PO-44102"
                value={muelleForm.ordenCompra}
                onChange={(e) => setMuelleForm({...muelleForm, ordenCompra: e.target.value})}
                className="w-full bg-[#020408] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00f0ff] font-mono"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Placa del Camión</label>
              <input 
                type="text" 
                placeholder="Ej. SGT-881"
                value={muelleForm.placaCamion}
                onChange={(e) => setMuelleForm({...muelleForm, placaCamion: e.target.value})}
                className="w-full bg-[#020408] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00f0ff] font-mono"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Transportadora</label>
              <input 
                type="text" 
                placeholder="Ej. TCC Carga"
                value={muelleForm.transportadora}
                onChange={(e) => setMuelleForm({...muelleForm, transportadora: e.target.value})}
                className="w-full bg-[#020408] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00f0ff]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Proveedor / Remitente</label>
              <input 
                type="text" 
                placeholder="Ej. Ferretería Mayorista SAS"
                value={muelleForm.proveedor}
                onChange={(e) => setMuelleForm({...muelleForm, proveedor: e.target.value})}
                className="w-full bg-[#020408] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00f0ff]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              className="w-full sm:w-auto bg-[#00f0ff] hover:bg-cyan-300 text-black font-black text-xs px-6 py-3 rounded-xl uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.6)] transition-all"
            >
              Confirmar Ingreso de Mercancía al Stock Central
            </button>
          </div>
        </form>
      </div>

      {/* MONITOR EN VIVO */}
      <div className="bg-[#05070E] border-2 border-slate-800/90 p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <Radio className={`w-5 h-5 text-[#00f0ff] ${muelleReading ? 'animate-pulse' : ''}`} />
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Antena RFID Zonal (Puerta de Muelle Principal)</h3>
              <p className="text-[10px] text-slate-400">Escaneo de palets y cajas al cruzar el portal de recepción</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={handleSimulateAntennaRead}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md ${muelleReading ? 'bg-amber-400 text-slate-950 animate-pulse shadow-[0_0_20px_rgba(251,191,36,0.6)]' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'}`}
          >
            {muelleReading ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {muelleReading ? 'Detener Antena Muelle' : 'Iniciar Escaneo RFID Muelle'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-[#020408]">
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Artículo</th>
                <th className="py-3 px-4 text-center">Esperado (PO)</th>
                <th className="py-3 px-4 text-center">Leído (RFID)</th>
                <th className="py-3 px-4 text-center">Estado de Recepción</th>
                <th className="py-3 px-4 text-center">Acción / Auditoría</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {muelleItems.length > 0 ? (
                muelleItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#020408]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#00f0ff]">{item.sku}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">{item.name}</td>
                    <td className="py-3.5 px-4 text-center font-bold">{item.expected} un</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-400">{item.read} un</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${item.status === 'Completado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                        {item.status === 'Completado' ? '✅ Completado' : '⏳ En Revisión'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button 
                        type="button"
                        onClick={() => handleReportClick(item)}
                        className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl font-bold text-[10px] transition-all shadow-[0_0_10px_rgba(245,158,11,0.15)] flex items-center gap-1.5 mx-auto"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" /> Reportar Discrepancia
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 text-xs font-medium">
                    ✨ Todos los ítems del muelle han sido verificados o reportados. No hay pendientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}