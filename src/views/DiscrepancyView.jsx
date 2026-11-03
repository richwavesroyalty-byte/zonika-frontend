import React, { useState } from 'react';
import { AlertTriangle, ClipboardList, ShieldAlert, Search } from 'lucide-react';

export default function DiscrepancyView({ discrepancies = [], deletedHistory = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDeletions = deletedHistory.filter(d => 
    d.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Discrepancias & Historial de Bajas (Inalterable)</h2>
        <p className="text-slate-400 text-xs mt-1 font-medium">Auditoría estricta de stock, discrepancias RFID y registro permanente de productos dados de baja con justificación.</p>
      </div>

      {/* Tabla de Discrepancias Activas */}
      <div className="bg-[#05070E] border-2 border-slate-800/90 p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Discrepancias Detectadas por RFID</h3>
            <p className="text-[10px] text-slate-400">Diferencias entre el stock teórico en sistema y el conteo físico en antenas</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-[#020408]">
                <th className="py-3 px-4">ID Discrepancia</th>
                <th className="py-3 px-4">SKU / Ítem</th>
                <th className="py-3 px-4 text-center">Esperado</th>
                <th className="py-3 px-4 text-center">Conteo RFID</th>
                <th className="py-3 px-4 text-center">Diferencia</th>
                <th className="py-3 px-4">Ubicación</th>
                <th className="py-3 px-4">Causa Estimada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {discrepancies.length > 0 ? (
                discrepancies.map((d, i) => (
                  <tr key={i} className="hover:bg-[#020408]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{d.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">{d.item} <span className="text-[10px] text-slate-400 font-mono">({d.sku})</span></td>
                    <td className="py-3.5 px-4 text-center font-bold">{d.expected} un</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-cyan-400">{d.rfidCount} un</td>
                    <td className="py-3.5 px-4 text-center font-black text-rose-400">{d.diff} un</td>
                    <td className="py-3.5 px-4 text-slate-300">{d.location}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{d.cause}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-slate-400 text-xs">No hay discrepancias activas reportadas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historial Permanente e Inalterable de Productos Eliminados */}
      <div className="bg-[#05070E] border-2 border-slate-800/90 p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Historial Inalterable de Productos Eliminados (Bajas)</h3>
              <p className="text-[10px] text-slate-400">Registro permanente de auditoría con motivo, justificación, responsable y estampa temporal (No eliminable)</p>
            </div>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar en historial de bajas..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#020408] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-[#020408]">
                <th className="py-3 px-4">ID Registro</th>
                <th className="py-3 px-4">SKU / Producto</th>
                <th className="py-3 px-4">Motivo de Baja</th>
                <th className="py-3 px-4">Descripción / Justificación</th>
                <th className="py-3 px-4">Ubicación</th>
                <th className="py-3 px-4">Responsable</th>
                <th className="py-3 px-4">Fecha y Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredDeletions.length > 0 ? (
                filteredDeletions.map((del) => (
                  <tr key={del.id} className="hover:bg-[#020408]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-400">{del.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {del.name} <span className="text-[10px] text-cyan-400 font-mono block">SKU: {del.sku}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-300">{del.reason}</td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate" title={del.description}>{del.description}</td>
                    <td className="py-3.5 px-4 text-slate-400">{del.location}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-200">{del.user}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{del.timestamp}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 text-xs font-medium">
                    No se encontraron registros de bajas con los filtros actuales.
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