import React from 'react';
import { ArrowLeftRight } from 'lucide-react';

export default function MovementsView({
  newMovement,
  setNewMovement,
  handleAddMovement,
  movements
}) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-black text-white tracking-tight">Registro de Entradas y Salidas</h2>
      
      <form onSubmit={handleAddMovement} className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl flex gap-4 items-end shadow-xl">
        <select 
          value={newMovement.type} 
          onChange={(e) => setNewMovement({...newMovement, type: e.target.value})} 
          className="bg-[#0F172A] border border-slate-700 p-3 rounded-xl text-xs font-bold text-white focus:outline-none"
        >
          <option value="ENTRADA">ENTRADA</option>
          <option value="SALIDA">SALIDA</option>
        </select>
        
        <input 
          type="text" 
          placeholder="Artículo" 
          value={newMovement.item} 
          onChange={(e) => setNewMovement({...newMovement, item: e.target.value})} 
          className="flex-1 bg-[#0F172A] border border-slate-700 p-3 rounded-xl text-xs text-white focus:outline-none" 
          required 
        />
        
        <input 
          type="number" 
          min="1" 
          value={newMovement.qty} 
          onChange={(e) => setNewMovement({...newMovement, qty: e.target.value})} 
          className="w-28 bg-[#0F172A] border border-slate-700 p-3 rounded-xl text-xs text-center text-white focus:outline-none" 
          required 
        />
        
        <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all">
          Registrar
        </button>
      </form>

      <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase bg-slate-900/40">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Tipo</th>
              <th className="py-3 px-4">Artículo</th>
              <th className="py-3 px-4 text-center">Cantidad</th>
              <th className="py-3 px-4">Usuario</th>
              <th className="py-3 px-4">Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
            {movements.map((m) => (
              <tr key={m.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{m.id}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${m.type === 'ENTRADA' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {m.type}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-white">{m.item}</td>
                <td className="py-3.5 px-4 text-center font-bold">{m.qty}</td>
                <td className="py-3.5 px-4 text-slate-300">{m.user}</td>
                <td className="py-3.5 px-4 text-slate-500">{m.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}