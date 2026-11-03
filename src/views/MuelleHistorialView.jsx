import React, { useState } from 'react';
import { ClipboardList, Search, Eye, Truck, Calendar, UserCheck } from 'lucide-react';

export default function MuelleHistorialView({ 
  muelleHistorial, 
  setMuelleHistorial, 
  currentUser, 
  showNotification 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [selectedAuditRecord, setSelectedAuditRecord] = useState(null);

  const filteredHistory = muelleHistorial.filter(h => 
    h.ordenCompra.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.placaCamion.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.transportadora.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAuditModal = (record) => {
    setSelectedAuditRecord(record);
    setAuditModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Historial de Recepciones en Muelle</h2>
        <p className="text-slate-400 text-xs mt-1 font-medium">Registro cronológico inalterable de camiones recibidos, placas, transportadoras y validaciones RFID de cierre.</p>
      </div>

      <div className="bg-[#05070E] border-2 border-slate-800/90 p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-[#00f0ff]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Bitácora de Ingresos ({filteredHistory.length})</h3>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por PO, placa o proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#020408] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00f0ff]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-[#020408]">
                <th className="py-3 px-4">ID Registro</th>
                <th className="py-3 px-4">Orden de Compra</th>
                <th className="py-3 px-4">Placa Camión</th>
                <th className="py-3 px-4">Transportadora</th>
                <th className="py-3 px-4">Proveedor</th>
                <th className="py-3 px-4 text-center">Total Ítems</th>
                <th className="py-3 px-4">Operador Asignado</th>
                <th className="py-3 px-4">Fecha y Hora</th>
                <th className="py-3 px-4 text-center">Auditoría</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((record) => (
                  <tr key={record.id} className="hover:bg-[#020408]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#00f0ff]">{record.id}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-white">{record.ordenCompra}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{record.placaCamion}</td>
                    <td className="py-3.5 px-4 text-slate-300">{record.transportadora}</td>
                    <td className="py-3.5 px-4 text-slate-300">{record.proveedor}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-cyan-300">{record.totalItems} un</td>
                    <td className="py-3.5 px-4 text-slate-300">{record.operator || 'Admin'}</td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono">{record.timestamp}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button 
                        type="button"
                        onClick={() => openAuditModal(record)}
                        className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl transition-all shadow-[0_0_10px_rgba(0,240,255,0.15)] mx-auto flex items-center justify-center"
                        title="Ver Auditoría de Lote"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-slate-400 text-xs font-medium">
                    No se encontraron registros en el historial de muelle.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE AUDITORÍA DETALLADA DINÁMICA */}
      {auditModalOpen && selectedAuditRecord && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#05070E] border-2 border-cyan-400 rounded-3xl p-6 max-w-lg w-full shadow-[0_0_50px_rgba(0,240,255,0.3)] space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">Auditoría de Recepción en Muelle</h3>
              <button onClick={() => setAuditModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="bg-[#020408] border border-slate-800 p-4 rounded-xl text-xs space-y-2">
              <div className="flex justify-between"><span className="text-slate-400">ID Registro:</span><span className="font-mono text-cyan-400">{selectedAuditRecord.id}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Orden de Compra (PO):</span><span className="font-bold text-white">{selectedAuditRecord.ordenCompra}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Placa del Camión:</span><span className="font-mono text-emerald-400">{selectedAuditRecord.placaCamion}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Transportadora:</span><span className="text-white">{selectedAuditRecord.transportadora}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Proveedor / Remitente:</span><span className="text-white">{selectedAuditRecord.proveedor}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Operador Responsable:</span><span className="text-white">{selectedAuditRecord.operator || 'Admin'}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Sello Temporal:</span><span className="font-mono text-slate-300">{selectedAuditRecord.timestamp}</span></div>
            </div>
            
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Validación de Ítems RFID en Lote:</p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {selectedAuditRecord.itemsAudited && selectedAuditRecord.itemsAudited.length > 0 ? (
                  selectedAuditRecord.itemsAudited.map((i, idx) => (
                    <div key={idx} className="bg-[#020408] border border-slate-800 p-2.5 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white block">{i.name}</span>
                        <span className="font-mono text-[10px] text-cyan-400">SKU: {i.sku}</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-400">{i.read} / {i.expected} un ({i.status || 'OK'})</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 text-center py-2">Sin ítems detallados en este lote.</p>
                )}
              </div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-400/30 p-3 rounded-xl text-center">
              <p className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">🔒 Bitácora de muelle protegida por políticas de cumplimiento. Este registro es inalterable.</p>
            </div>

            <button onClick={() => setAuditModalOpen(false)} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider">
              Cerrar Auditoría
            </button>
          </div>
        </div>
      )}
    </div>
  );
}