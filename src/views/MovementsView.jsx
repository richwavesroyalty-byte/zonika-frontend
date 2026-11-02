import React, { useState } from 'react';
import { ArrowLeftRight, Search, Filter, Eye, ShieldCheck, X } from 'lucide-react';

export default function MovementsView({
  newMovement,
  setNewMovement,
  handleAddMovement,
  movements,
  showNotification
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  
  // Estado para el modal de auditoría de transacción
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);

  const filteredMovements = movements.filter(m => {
    const matchesSearch = 
      (m.item && m.item.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (m.user && m.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.id && m.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.reason && m.reason.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'ALL' || m.type === filterType;
    return matchesSearch && matchesType;
  });

  const openDetailModal = (mov) => {
    setSelectedMovement(mov);
    setDetailModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 relative">
      {/* Modal de Auditoría y Trazabilidad de Transacción */}
      {detailModalOpen && selectedMovement && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleIn">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Auditoría de Transacción</h3>
              </div>
              <button onClick={() => setDetailModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#0F172A] border border-slate-800 p-4 rounded-2xl text-xs space-y-2.5">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[10px]">ID Transacción:</span>
                <span className="font-mono font-bold text-cyan-400">{selectedMovement.id}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Tipo de Movimiento:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedMovement.type === 'ENTRADA' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
                  {selectedMovement.type}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Artículo / Producto:</span>
                <span className="font-semibold text-white">{selectedMovement.item}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Cantidad:</span>
                <span className="font-black text-white">{selectedMovement.qty} un</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Motivo Principal:</span>
                <span className="font-bold text-amber-300">{selectedMovement.reason || 'Reposición de Proveedor'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Descripción / Justificación:</span>
                <p className="text-slate-200 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 italic">
                  "{selectedMovement.description || 'Sin observaciones detalladas registradas.'}"
                </p>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Responsable:</span>
                <span className="font-medium text-slate-200">{selectedMovement.user}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Fecha y Hora:</span>
                <span className="font-mono text-slate-400 text-[11px]">{selectedMovement.time}</span>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl text-[10px] text-emerald-300 font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Registro protegido por políticas de auditoría inalterable del sistema.</span>
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
        <h2 className="text-2xl font-black text-white tracking-tight">Registro de Entradas y Salidas</h2>
        <p className="text-slate-400 text-xs mt-1 font-medium">Auditoría en tiempo real de transacciones de inventario, despachos y recepciones de almacén con trazabilidad inalterable.</p>
      </div>

      {/* Formulario de Registro Rápido con Trazabilidad */}
      <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-700/80 pb-3">Registrar Nuevo Movimiento de Stock</h3>
        <form onSubmit={handleAddMovement} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Tipo de Movimiento</label>
            <select 
              value={newMovement.type} 
              onChange={(e) => setNewMovement({...newMovement, type: e.target.value})} 
              className="w-full bg-[#0F172A] border border-slate-700 p-3 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="ENTRADA">🟢 ENTRADA</option>
              <option value="SALIDA">🔴 SALIDA</option>
            </select>
          </div>
          
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Artículo / Producto</label>
            <input 
              type="text" 
              placeholder="Nombre o descripción del artículo..." 
              value={newMovement.item} 
              onChange={(e) => setNewMovement({...newMovement, item: e.target.value})} 
              className="w-full bg-[#0F172A] border border-slate-700 p-3 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-medium" 
              required 
            />
          </div>
          
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Cantidad</label>
            <input 
              type="number" 
              min="1" 
              value={newMovement.qty} 
              onChange={(e) => setNewMovement({...newMovement, qty: e.target.value})} 
              className="w-full bg-[#0F172A] border border-slate-700 p-3 rounded-xl text-xs text-center text-white focus:outline-none focus:border-cyan-500 font-bold" 
              required 
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Motivo del Movimiento</label>
            <select 
              value={newMovement.reason || 'Reposición de Proveedor'} 
              onChange={(e) => setNewMovement({...newMovement, reason: e.target.value})} 
              className="w-full bg-[#0F172A] border border-slate-700 p-3 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="Reposición de Proveedor">Reposición de Proveedor</option>
              <option value="Despacho por Venta / Pedido">Despacho por Venta / Pedido</option>
              <option value="Ajuste de Inventario / Conteo">Ajuste de Inventario / Conteo</option>
              <option value="Transferencia Interna (Bodega a Ferretería)">Transferencia Interna</option>
              <option value="Garantía / RMA">Garantía / RMA</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Descripción / Justificación de Auditoría</label>
            <input 
              type="text" 
              placeholder="Explique el motivo de la entrada o salida de stock..." 
              value={newMovement.description || ''} 
              onChange={(e) => setNewMovement({...newMovement, description: e.target.value})} 
              className="w-full bg-[#0F172A] border border-slate-700 p-3 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500" 
              required
            />
          </div>

          <div className="md:col-span-3 flex justify-end pt-2">
            <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl shadow-lg uppercase tracking-wider transition-all">
              Registrar Transacción con Trazabilidad
            </button>
          </div>
        </form>
      </div>

      {/* Filtros y Tabla */}
      <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-700/80 pb-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Historial de Transacciones ({filteredMovements.length})</h3>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar por ítem, usuario, motivo o ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#0F172A] border border-slate-700 text-xs font-bold text-slate-300 px-3 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="ALL">Todos los tipos</option>
              <option value="ENTRADA">Entradas</option>
              <option value="SALIDA">Salidas</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase bg-slate-900/40 tracking-wider">
                <th className="py-3 px-4">ID Transacción</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Artículo</th>
                <th className="py-3 px-4 text-center">Cantidad</th>
                <th className="py-3 px-4">Motivo / Justificación</th>
                <th className="py-3 px-4">Usuario Responsable</th>
                <th className="py-3 px-4">Hora / Fecha</th>
                <th className="py-3 px-4 text-center">Auditoría</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
              {filteredMovements.length > 0 ? (
                filteredMovements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{m.id}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${m.type === 'ENTRADA' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                        {m.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">{m.item}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-white text-sm">{m.qty} un</td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      <span className="text-amber-300 block font-semibold">{m.reason || 'Reposición'}</span>
                      <span className="text-[10px] text-slate-400 truncate max-w-xs block">{m.description}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{m.user}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{m.time}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button 
                        onClick={() => openDetailModal(m)} 
                        className="p-2 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 rounded-xl transition-all"
                        title="Ver auditoría y detalles de transacción"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400 text-xs font-medium">
                    No se encontraron movimientos registrados con los filtros seleccionados.
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