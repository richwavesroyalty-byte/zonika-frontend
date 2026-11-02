import React, { useState } from 'react';
import { Truck, Radio, Play, Square, CheckCircle2, AlertTriangle, RefreshCw, X, ShieldAlert } from 'lucide-react';

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

  // Estado para el Modal de Discrepancias en Muelle
  const [discModalOpen, setDiscModalOpen] = useState(false);
  const [selectedItemForDisc, setSelectedItemForDisc] = useState(null);
  const [discReason, setDiscReason] = useState('Faltante físico en entrega');
  const [discDescription, setDiscDescription] = useState('');

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

  const openDiscModal = (item) => {
    setSelectedItemForDisc(item);
    setDiscReason('Faltante físico en entrega');
    setDiscDescription('');
    setDiscModalOpen(true);
  };

  const submitDiscrepancyReport = (e) => {
    e.preventDefault();
    if (!selectedItemForDisc) return;

    if (onReportDiscrepancy) {
      onReportDiscrepancy({
        ...selectedItemForDisc,
        ordenCompra: muelleForm.ordenCompra,
        placaCamion: muelleForm.placaCamion,
        reason: discReason,
        description: discDescription
      });
    }

    setDiscModalOpen(false);
    setSelectedItemForDisc(null);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 relative">
      {/* Modal de Reporte de Discrepancia en Muelle */}
      {discModalOpen && selectedItemForDisc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleIn">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Reportar Discrepancia de Muelle</h3>
              </div>
              <button onClick={() => setDiscModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#0F172A] border border-slate-800 p-3 rounded-xl text-xs space-y-1">
              <p className="text-slate-400">Artículo con diferencia:</p>
              <p className="font-bold text-white text-sm">{selectedItemForDisc.name} <span className="text-cyan-400 font-mono">({selectedItemForDisc.sku})</span></p>
              <p className="text-[10px] text-slate-400">Esperado: <strong className="text-white">{selectedItemForDisc.expected} un</strong> | Leído RFID: <strong className="text-amber-400">{selectedItemForDisc.read} un</strong> (Faltante: {selectedItemForDisc.read - selectedItemForDisc.expected} un)</p>
            </div>

            <form onSubmit={submitDiscrepancyReport} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Motivo de Discrepancia</label>
                <select 
                  value={discReason} 
                  onChange={(e) => setDiscReason(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-700 p-2.5 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="Faltante físico en entrega">Faltante físico en entrega</option>
                  <option value="Caja dañada / Merma en tránsito">Caja dañada / Merma en tránsito</option>
                  <option value="Tag RFID ilegible / ausente">Tag RFID ilegible / ausente</option>
                  <option value="Excedente de mercancía">Excedente de mercancía</option>
                  <option value="Error en Orden de Compra">Error en Orden de Compra</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Descripción y Observaciones</label>
                <textarea 
                  rows="3"
                  placeholder="Detalle el estado del cargamento, número de precinto o novedad del transportador..."
                  value={discDescription}
                  onChange={(e) => setDiscDescription(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-700 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                ></textarea>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 p-2.5 rounded-xl text-[10px] text-cyan-300 font-medium flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                <span>Este reporte se enlazará automáticamente al módulo de Discrepancias & Historial para la auditoría gerencial.</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3 rounded-xl uppercase tracking-wider transition-all shadow-lg">
                  Registrar Discrepancia
                </button>
                <button type="button" onClick={() => setDiscModalOpen(false)} className="bg-slate-800 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl hover:bg-slate-700">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Muelle de Carga & Despacho — Recepción de Camiones</h2>
        <p className="text-slate-400 text-xs mt-1 font-medium">Registro de ingresos de transporte, órdenes de compra y validación masiva de mercancía mediante antenas RFID fijas.</p>
      </div>

      {/* Formulario de Registro de Transporte */}
      <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-700/80 pb-3">
          <Truck className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Datos del Proveedor y Logística de Transporte</h3>
        </div>

        <form onSubmit={handleRegisterTruckEntry} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Orden de Compra (PO)</label>
            <input 
              type="text" 
              placeholder="Ej. PO-44102" 
              value={muelleForm.ordenCompra} 
              onChange={(e)=>setMuelleForm({...muelleForm, ordenCompra: e.target.value})} 
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" 
              required 
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Placa del Camión</label>
            <input 
              type="text" 
              placeholder="Ej. SGT-881" 
              value={muelleForm.placaCamion} 
              onChange={(e)=>setMuelleForm({...muelleForm, placaCamion: e.target.value})} 
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-bold font-mono" 
              required 
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Transportadora</label>
            <input 
              type="text" 
              placeholder="Ej. TCC Carga" 
              value={muelleForm.transportadora} 
              onChange={(e)=>setMuelleForm({...muelleForm, transportadora: e.target.value})} 
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500" 
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Proveedor / Remitente</label>
            <input 
              type="text" 
              placeholder="Ej. Ferretería Mayorista SAS" 
              value={muelleForm.proveedor} 
              onChange={(e)=>setMuelleForm({...muelleForm, proveedor: e.target.value})} 
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500" 
            />
          </div>
          <div className="md:col-span-4 flex justify-end pt-2">
            <button 
              type="submit" 
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl shadow-lg uppercase tracking-wider transition-all"
            >
              Confirmar Ingreso de Mercancía al Stock Central
            </button>
          </div>
        </form>
      </div>

      {/* Monitor en Vivo de Recepción en Muelle por Antena RFID */}
      <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-700/80 pb-3">
          <div className="flex items-center gap-3">
            <Radio className={`w-5 h-5 text-cyan-400 ${muelleReading ? 'animate-pulse' : ''}`} />
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Antena RFID Zonal (Puerta de Muelle Principal)</h3>
              <p className="text-[10px] text-slate-400">Escaneo de palets y cajas al cruzar el portal de recepción</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleSimulateAntennaRead}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md ${muelleReading ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'}`}
          >
            {muelleReading ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {muelleReading ? 'Detener Antena Muelle' : 'Iniciar Escaneo RFID Muelle'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-900/30">
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Artículo</th>
                <th className="py-3 px-4 text-center">Esperado (PO)</th>
                <th className="py-3 px-4 text-center">Leído (RFID)</th>
                <th className="py-3 px-4 text-center">Estado de Recepción</th>
                <th className="py-3 px-4 text-center">Acción / Auditoría</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {muelleItems.map((item) => {
                const hasDiscrepancy = item.read < item.expected;
                return (
                  <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{item.sku}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">{item.name}</td>
                    <td className="py-3.5 px-4 text-center font-bold">{item.expected} un</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-400">{item.read} un</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${item.status === 'Completado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                        {item.status === 'Completado' ? '✅ Completado' : '⏳ En Revisión'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {hasDiscrepancy ? (
                        <button 
                          onClick={() => openDiscModal(item)}
                          className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1.5 mx-auto"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" /> Reportar Discrepancia
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-medium">Sin novedad</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}