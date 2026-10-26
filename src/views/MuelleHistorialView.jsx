import React, { useState } from 'react';
import { ClipboardList, Search, Truck, Calendar, UserCheck } from 'lucide-react';

export default function MuelleHistorialView({
  muelleHistorial,
  setMuelleHistorial,
  currentUser,
  showNotification
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = muelleHistorial.filter(h => 
    h.ordenCompra.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.placaCamion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.transportadora.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Historial de Recepciones en Muelle</h2>
        <p className="text-slate-400 text-xs mt-1 font-medium">Registro cronológico de camiones recibidos, placas, transportadoras y validaciones RFID de cierre.</p>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400 text-xs font-medium">
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