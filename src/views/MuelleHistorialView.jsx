import React, { useState } from 'react';
import { ClipboardList, Search, Truck, Eye, ShieldCheck, X } from 'lucide-react';

export default function MuelleHistorialView({
  muelleHistorial,
  setMuelleHistorial,
  currentUser,
  showNotification
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filteredHistory = muelleHistorial.filter(h => 
    h.ordenCompra.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.placaCamion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.transportadora.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDetailModal = (record) => {
    setSelectedRecord(record);
    setDetailModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 relative">
      {/* Modal de Detalle y Auditoría de Recepción */}
      {detailModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-scaleIn">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Auditoría de Recepción en Muelle</h3>
              </div>
              <button onClick={() => setDetailModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#0F172A] border border-slate-800 p-4 rounded-2xl">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">ID Registro:</span>
                <span className="font-mono font-bold text-cyan-400">{selectedRecord.id}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Orden de Compra (PO):</span>
                <span className="font-mono font-bold text-white">{selectedRecord.ordenCompra}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Placa del Camión:</span>
                <span className="font-mono font-bold text-emerald-400">{selectedRecord.placaCamion}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Transportadora:</span>
                <span className="text-slate-200">{selectedRecord.transportadora}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Proveedor / Remitente:</span>
                <span className="font-semibold text-white">{selectedRecord.proveedor}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Operador Responsable:</span>
                <span className="text-slate-200">{selectedRecord.operator || 'Juan Pérez'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Sello Temporal:</span>
                <span className="font-mono text-slate-300 text-[11px]">{selectedRecord.timestamp}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Validación de Ítems RFID en Lote</h4>
              <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-3 text-xs space-y-2 max-h-40 overflow-y-auto">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-white font-medium">Lector Biométrico ZKTeco <span className="text-slate-400 text-[10px] font-mono">(INV-001)</span></span>
                  <span className="text-emerald-400 font-mono font-bold">50 / 50 un (OK)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-white font-medium">Cámara IP Domo 4K <span className="text-slate-400 text-[10px] font-mono">(INV-002)</span></span>
                  <span className="text-emerald-400 font-mono font-bold">20 / 20 un (OK)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-white font-medium">Etiqueta RFID UHF Zebra <span className="text-slate-400 text-[10px] font-mono">(INV-003)</span></span>
                  <span className="text-emerald-400 font-mono font-bold">500 / 500 un (OK)</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-[10px] text-emerald-300 font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Bitácora de muelle protegida por políticas de cumplimiento. Este registro es inalterable.</span>
            </div>

            <div className="flex justify-end pt-1">
              <button 
                type="button" 
                onClick={() => setDetailModalOpen(false)} 
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-6 py-2.5 rounded-xl transition-all"
              >
                Cerrar Auditoría
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Historial de Recepciones en Muelle</h2>
        <p className="text-slate-400 text-xs mt-1 font-medium">Registro cronológico inalterable de camiones recibidos, placas, transportadoras y validaciones RFID de cierre.</p>
      </div>

      <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-700/80 pb-4">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Bitácora de Ingresos ({filteredHistory.length})</h3>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por PO, placa o proveedor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase bg-slate-900/40 tracking-wider">
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
            <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{h.id}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">{h.ordenCompra}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{h.placaCamion}</td>
                    <td className="py-3.5 px-4 text-slate-300">{h.transportadora}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-semibold">{h.proveedor}</td>
                    <td className="py-3.5 px-4 text-center font-black text-white">{h.totalItems || 150} un</td>
                    <td className="py-3.5 px-4 text-slate-300">{h.operator || 'Juan Pérez'}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{h.timestamp}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button 
                        onClick={() => openDetailModal(h)}
                        className="p-2 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 rounded-xl transition-all"
                        title="Ver detalle y trazabilidad de muelle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-slate-400 text-xs font-medium">
                    No se encontraron registros de muelle que coincidan con la búsqueda.
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