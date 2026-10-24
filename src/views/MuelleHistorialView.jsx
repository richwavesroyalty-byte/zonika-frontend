import React from 'react';
import { ClipboardList, Truck, Trash2 } from 'lucide-react';

export default function MuelleHistorialView({ muelleHistorial, onDeleteRecord, onSimulateTruck }) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Historial de Recepciones en Muelle</h2>
          <p className="text-slate-400 text-xs mt-1 font-medium">Registro detallado de todos los camiones procesados e ingresados al inventario.</p>
        </div>
        <button 
          onClick={onSimulateTruck} 
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all"
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
                        onClick={() => onDeleteRecord(rec.id)}
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
  );
}