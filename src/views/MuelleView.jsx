import React from 'react';
import { Truck } from 'lucide-react';

export default function MuelleView({
  muelleForm,
  setMuelleForm,
  handleRegisterTruckEntry
}) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Muelle de Carga & Despacho — Recepción de Camiones</h2>
        <p className="text-slate-400 text-xs mt-1 font-medium">Registro de ingresos de camiones, órdenes de compra y lectura RFID masiva en tiempo real.</p>
      </div>

      <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Datos del Transporte y Proveedor</h3>
        <form onSubmit={handleRegisterTruckEntry} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="text" 
            placeholder="Orden de Compra (PO)" 
            value={muelleForm.ordenCompra} 
            onChange={(e)=>setMuelleForm({...muelleForm, ordenCompra: e.target.value})} 
            className="bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500" 
            required 
          />
          <input 
            type="text" 
            placeholder="Placa del Camión" 
            value={muelleForm.placaCamion} 
            onChange={(e)=>setMuelleForm({...muelleForm, placaCamion: e.target.value})} 
            className="bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500" 
            required 
          />
          <input 
            type="text" 
            placeholder="Transportadora" 
            value={muelleForm.transportadora} 
            onChange={(e)=>setMuelleForm({...muelleForm, transportadora: e.target.value})} 
            className="bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500" 
          />
          <input 
            type="text" 
            placeholder="Proveedor" 
            value={muelleForm.proveedor} 
            onChange={(e)=>setMuelleForm({...muelleForm, proveedor: e.target.value})} 
            className="bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500" 
          />
          <div className="md:col-span-4 flex justify-end">
            <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl shadow-lg uppercase tracking-wider transition-all">Confirmar Ingreso de Mercancía al Stock</button>
          </div>
        </form>
      </div>
    </div>
  );
}