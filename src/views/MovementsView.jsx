import React, { useState } from 'react';
import { ArrowLeftRight, Search, Eye, X } from 'lucide-react';

export default function MovementsView({ 
  newMovement, 
  setNewMovement, 
  handleAddMovement, 
  movements 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [selectedAuditMovement, setSelectedAuditMovement] = useState(null);

  const filteredMovements = movements.filter(m => {
    const matchesSearch = 
      m.item.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.user.toLowerCase().includes(searchTerm.toLowerCase());

    if (typeFilter === 'ALL') return matchesSearch;
    if (typeFilter === 'ENTRADA') return matchesSearch && m.type.toUpperCase() === 'ENTRADA';
    if (typeFilter === 'SALIDA') return matchesSearch && m.type.toUpperCase() === 'SALIDA';
    if (typeFilter === 'TRANSFERENCIA') return matchesSearch && (m.type.toUpperCase() === 'TRANSFERENCIA' || m.type.toUpperCase() === 'TRANSFER');

    return matchesSearch;
  });

  const openAuditModal = (movement) => {
    setSelectedAuditMovement(movement);
    setAuditModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Registro de Entradas, Salidas y Transferencias</h2>
        <p className="text-slate-400 text-xs mt-1 font-medium">Control de flujos de inventario, motivos de auditoría y trazabilidad por operador.</p>
      </div>

      {/* FORMULARIO DE NUEVO MOVIMIENTO - ESTILO BLACK OLED UNIFICADO */}
      <div className="bg-[#05070E] border-2 border-cyan-400/50 p-6 rounded-3xl shadow-[0_0_30px_rgba(0,240,255,0.15)] space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <ArrowLeftRight className="w-5 h-5 text-[#00f0ff]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Nuevo Movimiento de Inventario</h3>
        </div>

        <form onSubmit={handleAddMovement} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Tipo de Movimiento</label>
              <select 
                value={newMovement.type} 
                onChange={(e) => setNewMovement({...newMovement, type: e.target.value})}
                className="w-full bg-[#020408] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-[#00f0ff] cursor-pointer"
              >
                <option value="ENTRADA">ENTRADA</option>
                <option value="SALIDA">SALIDA</option>
                <option value="TRANSFERENCIA">TRANSFERENCIA</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Artículo / Producto</label>
              <input 
                type="text" 
                placeholder="Nombre o descripción del artículo..." 
                value={newMovement.item} 
                onChange={(e) => setNewMovement({...newMovement, item: e.target.value})} 
                className="w-full bg-[#020408] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00f0ff]"
                required 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Cantidad</label>
              <input 
                type="number" 
                min="1" 
                value={newMovement.qty} 
                onChange={(e) => setNewMovement({...newMovement, qty: e.target.value})} 
                className="w-full bg-[#020408] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00f0ff] font-mono font-bold text-center"
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Motivo del Movimiento</label>
              <select 
                value={newMovement.reason} 
                onChange={(e) => setNewMovement({...newMovement, reason: e.target.value})}
                className="w-full bg-[#020408] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-[#00f0ff] cursor-pointer"
              >
                <option value="Reposición de Proveedor">Reposición de Proveedor</option>
                <option value="Salida por Venta / Despacho">Salida por Venta / Despacho</option>
                <option value="Transferencia Inter-Almacén">Transferencia Inter-Almacén</option>
                <option value="Ajuste de Inventario / Conteo Cíclico">Ajuste de Inventario / Conteo Cíclico</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Descripción / Justificación de Auditoría</label>
              <input 
                type="text" 
                placeholder="Explique el motivo de la entrada, salida o transferencia..." 
                value={newMovement.description} 
                onChange={(e) => setNewMovement({...newMovement, description: e.target.value})} 
                className="w-full bg-[#020408] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00f0ff]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              className="w-full sm:w-auto bg-[#00f0ff] hover:bg-cyan-300 text-black font-black text-xs px-6 py-3 rounded-xl uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.6)] transition-all"
            >
              Registrar Transacción con Trazabilidad
            </button>
          </div>
        </form>
      </div>

      {/* HISTORIAL DE TRANSACCIONES - ESTILO BLACK OLED UNIFICADO */}
      <div className="bg-[#05070E] border-2 border-slate-800/90 p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="w-5 h-5 text-[#00f0ff]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Historial de Transacciones ({filteredMovements.length})</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar por ítem, usuario, motivo o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#020408] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00f0ff]"
              />
            </div>

            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#020408] border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-cyan-400 focus:outline-none focus:border-[#00f0ff] cursor-pointer"
            >
              <option value="ALL">Todos los tipos</option>
              <option value="ENTRADA">Entradas</option>
              <option value="SALIDA">Salidas</option>
              <option value="TRANSFERENCIA">Transferencias</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-[#020408]">
                <th className="py-3 px-4">ID Transacción</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Artículo</th>
                <th className="py-3 px-4">Cantidad</th>
                <th className="py-3 px-4">Motivo / Justificación</th>
                <th className="py-3 px-4">Usuario Responsable</th>
                <th className="py-3 px-4">Hora / Fecha</th>
                <th className="py-3 px-4 text-center">Auditoría</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredMovements.length > 0 ? (
                filteredMovements.map((m) => (
                  <tr key={m.id} className="hover:bg-[#020408]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#00f0ff]">{m.id}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${m.type.toUpperCase() === 'ENTRADA' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : m.type.toUpperCase() === 'SALIDA' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                        {m.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">{m.item}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{m.qty} un</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-amber-400 block">{m.reason}</span>
                      <span className="text-[10px] text-slate-400 block">{m.description}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{m.user}</td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono">{m.time}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button 
                        type="button"
                        onClick={() => openAuditModal(m)}
                        className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl transition-all shadow-[0_0_10px_rgba(0,240,255,0.15)] mx-auto flex items-center justify-center"
                        title="Auditoría de Movimiento"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400 text-xs font-medium">
                    No se encontraron transacciones para este filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE AUDITORÍA DE MOVIMIENTO */}
      {auditModalOpen && selectedAuditMovement && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#05070E] border-2 border-cyan-400 rounded-3xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(0,240,255,0.3)] space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">Auditoría de Transacción</h3>
              <button onClick={() => setAuditModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="bg-[#020408] border border-slate-800 p-4 rounded-xl text-xs space-y-2">
              <div className="flex justify-between"><span className="text-slate-400">ID Transacción:</span><span className="font-mono text-cyan-400">{selectedAuditMovement.id}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Tipo:</span><span className="font-bold text-white">{selectedAuditMovement.type}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Artículo:</span><span className="font-bold text-white">{selectedAuditMovement.item}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Cantidad:</span><span className="font-mono font-bold text-emerald-400">{selectedAuditMovement.qty} un</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Motivo:</span><span className="text-amber-400 font-semibold">{selectedAuditMovement.reason}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Descripción:</span><span className="text-white">{selectedAuditMovement.description || 'Sin descripción'}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Usuario Responsable:</span><span className="text-white">{selectedAuditMovement.user}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Sello Temporal:</span><span className="font-mono text-slate-300">{selectedAuditMovement.time}</span></div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-400/30 p-3 rounded-xl text-center">
              <p className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">🔒 Transacción verificada y respaldada por registro inalterable.</p>
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