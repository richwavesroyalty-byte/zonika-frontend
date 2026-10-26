import React from 'react';
import { Activity, Radio, Cpu, RefreshCw } from 'lucide-react';

export default function DashboardView({ 
  totalStockMadefront, 
  totalStockBodega, 
  movementsLength, 
  discrepanciesLength, 
  inventoryMadefrontLength, 
  inventoryBodegaLength, 
  liveActivityFlow, 
  isReading, 
  showNotification 
}) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Centro de Control General (Command Center)</h2>
        <p className="text-slate-400 text-xs mt-1 font-medium">Supervisión gerencial en tiempo real de antenas, stock, flujos RFID y alertas de mermas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-md space-y-2">
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Stock Madefront</p>
          <p className="text-4xl font-black text-white">{totalStockMadefront} <span className="text-xs font-normal text-slate-400">unidades</span></p>
          <span className="text-[10px] text-emerald-400 block font-semibold uppercase">{inventoryMadefrontLength} referencias</span>
        </div>
        <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-md space-y-2">
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Stock Bodega</p>
          <p className="text-4xl font-black text-cyan-400">{totalStockBodega} <span className="text-xs font-normal text-slate-400">unidades</span></p>
          <span className="text-[10px] text-slate-400 block font-semibold uppercase">{inventoryBodegaLength} referencias</span>
        </div>
        <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-md space-y-2">
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Movimientos</p>
          <p className="text-4xl font-black text-cyan-400">{movementsLength}</p>
          <span className="text-[10px] text-emerald-400 block font-semibold uppercase">Auditoría al día</span>
        </div>
        <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-md space-y-2">
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Discrepancias</p>
          <p className="text-4xl font-black text-amber-400">{discrepanciesLength}</p>
          <span className="text-[10px] text-amber-400 block font-semibold uppercase">Requieren revisión</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" /> Flujo de Lecturas RFID por Minuto (En Vivo)
            </h3>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2.5 py-1 rounded-full font-bold">
              {isReading ? '🔴 Transmitiendo' : '⏸️ En Pausa'}
            </span>
          </div>
          <div className="h-36 flex items-end gap-3 pt-6 px-2 bg-[#0F172A] border border-slate-800 rounded-xl">
            {liveActivityFlow.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <span className="text-[9px] font-mono text-cyan-400">{val}</span>
                <div className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-md transition-all duration-500" style={{ height: `${val}%` }}></div>
                <span className="text-[9px] text-slate-500 font-mono">m{idx+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" /> Estado de Antenas & Hardware
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-[#0F172A] border border-slate-800 p-3 rounded-xl text-xs">
              <div>
                <span className="text-white font-bold block">Zebra FX9600 (Muelle)</span>
                <span className="text-[10px] text-slate-400">IP: 192.168.1.150</span>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">ONLINE</span>
            </div>
            <div className="flex justify-between items-center bg-[#0F172A] border border-slate-800 p-3 rounded-xl text-xs">
              <div>
                <span className="text-white font-bold block">Chainway C66 (Handheld)</span>
                <span className="text-[10px] text-slate-400">Modo: Móvil RFID</span>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">ONLINE</span>
            </div>
            <button onClick={() => showNotification('🔄 Conexión con middleware restablecida.')} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold p-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all">
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Reiniciar Enlace Hardware
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}