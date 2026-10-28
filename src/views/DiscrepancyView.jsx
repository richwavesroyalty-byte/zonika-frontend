import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Archive, Clock, FileText } from 'lucide-react';

const initialDiscrepancies = [
  { id: '1', sku: 'ZNK-SKU-001', rfidTag: 'E28011606000002', erpStock: 15, physicalStock: 12, difference: -3, location: 'Bodega A - Pasillo 3' },
  { id: '2', sku: 'ZNK-SKU-045', rfidTag: 'E28011606000045', erpStock: 8, physicalStock: 10, difference: 2, location: 'Bodega B - Estante 2' },
  { id: '3', sku: 'ZNK-SKU-102', rfidTag: 'E28011606000102', erpStock: 25, physicalStock: 20, difference: -5, location: 'Bodega A - Pasillo 1' },
];

const initialHistory = [
  { 
    id: '101', 
    originalId: '3', 
    sku: 'ZNK-SKU-089', 
    rfidTag: 'E28011606000089', 
    difference: -1, 
    notes: 'Ajuste aprobado por gerencia de inventarios', 
    deletedAt: '2026-10-26 16:45:10' 
  }
];

export default function DiscrepancyView() {
  const [activeTab, setActiveTab] = useState('active'); // 'active' o 'history'
  const [discrepancies, setDiscrepancies] = useState(initialDiscrepancies);
  const [history, setHistory] = useState(initialHistory);
  const [auditNote, setAuditNote] = useState('');
  const [selectedItemToArchive, setSelectedItemToArchive] = useState(null);

  // Mover elemento de activo a historial de auditoría
  const handleConfirmArchive = (e) => {
    e.preventDefault();
    if (!selectedItemToArchive) return;

    const archivedRecord = {
      id: Date.now().toString(),
      originalId: selectedItemToArchive.id,
      sku: selectedItemToArchive.sku,
      rfidTag: selectedItemToArchive.rfidTag,
      difference: selectedItemToArchive.difference,
      notes: auditNote || 'Sin notas adicionales',
      deletedAt: new Date().toLocaleString()
    };

    setHistory([archivedRecord, ...history]);
    setDiscrepancies(discrepancies.filter(d => d.id !== selectedItemToArchive.id));
    setSelectedItemToArchive(null);
    setAuditNote('');
  };

  return (
    <div className="space-y-6">
      {/* Cabecera de la Vista */}
      <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            Gestión de Discrepancias & Historial RFID
          </h2>
          <p className="text-slate-400 text-xs mt-1">Control visual de diferencias entre inventario ERP y lectura física RFID.</p>
        </div>
        
        {/* Pestañas de Navegación */}
        <div className="flex bg-[#0F172A] p-1 rounded-xl border border-slate-700">
          <button 
            onClick={() => setActiveTab('active')} 
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'active' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'}`}
          >
            Discrepancias Activas ({discrepancies.length})
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'history' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'}`}
          >
            Historial de Auditoría ({history.length})
          </button>
        </div>
      </div>

      {/* Contenido de la Tabla */}
      <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl shadow-xl overflow-hidden">
        {activeTab === 'active' ? (
          <div className="p-6">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Discrepancias Activas (ERP vs RFID)</h3>
            {discrepancies.length === 0 ? (
              <p className="text-center text-slate-400 py-12 text-xs font-semibold">¡Excelente! No hay discrepancias activas registradas 🎉</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-wider">
                      <th className="pb-3 px-4">SKU / RFID Tag</th>
                      <th className="pb-3 px-4">Ubicación</th>
                      <th className="pb-3 px-4">ERP / Físico</th>
                      <th className="pb-3 px-4">Diferencia</th>
                      <th className="pb-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
                    {discrepancies.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-bold text-white block">{item.sku}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{item.rfidTag}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">{item.location}</td>
                        <td className="py-3 px-4 font-mono font-semibold">{item.erpStock} / {item.physicalStock}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black ${item.difference < 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                            {item.difference}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button 
                            onClick={() => setSelectedItemToArchive(item)}
                            className="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-slate-950 px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all border border-red-500/30"
                          >
                            Archivar / Resolver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Historial de Auditoría (Registros Archivados)</h3>
            {history.length === 0 ? (
              <p className="text-center text-slate-400 py-12 text-xs font-semibold">El historial de auditoría está vacío.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-wider">
                      <th className="pb-3 px-4">SKU / RFID Tag</th>
                      <th className="pb-3 px-4">Diferencia</th>
                      <th className="pb-3 px-4">Notas de Auditoría</th>
                      <th className="pb-3 px-4 text-right">Fecha de Archivo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
                    {history.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-bold text-white block">{record.sku}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{record.rfidTag}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black bg-red-500/10 text-red-400 border border-red-500/20">
                            {record.difference}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">{record.notes}</td>
                        <td className="py-3 px-4 text-right text-slate-400 font-mono text-[10px]">{record.deletedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sub-modal para capturar notas de auditoría al archivar */}
      {selectedItemToArchive && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-[#0F172A] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white uppercase tracking-wider">Archivar Discrepancia</h3>
            <p className="text-xs text-slate-300">SKU: <strong className="text-white font-mono">{selectedItemToArchive.sku}</strong></p>
            <form onSubmit={handleConfirmArchive} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Notas de auditoría o motivo de resolución:</label>
                <textarea 
                  value={auditNote} 
                  onChange={(e) => setAuditNote(e.target.value)}
                  placeholder="Ej. Conteo físico verificado por supervisor..."
                  rows={3}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs py-3 rounded-xl uppercase tracking-wider transition-all">Confirmar y Archivar</button>
                <button type="button" onClick={() => setSelectedItemToArchive(null)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl transition-all">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}