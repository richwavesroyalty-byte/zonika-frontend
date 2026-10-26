import React from 'react';
import { 
  Activity, Boxes, ArrowLeftRight, AlertTriangle, 
  Radio, Cpu, TrendingUp, CheckCircle2, ShieldCheck, Warehouse, Truck 
} from 'lucide-react';

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
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Cabecera de Bienvenida */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Panel General de Operaciones RFID</span>
            <span className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 px-3 py-1 rounded-full font-bold">Enterprise v3.2</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1 font-medium">Monitoreo en tiempo real de inventarios, antenas UHF y flujos logísticos en sedes.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0F172A] border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold text-slate-300">
            <Radio className={`w-4 h-4 text-cyan-400 ${isReading ? 'animate-ping' : ''}`} />
            <span>{isReading ? 'Lectura UHF Activa' : 'Sistema en Espera'}</span>
          </div>
        </div>
      </div>

      {/* Tarjetas KPI Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock Madefront</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">{totalStockMadefront.toLocaleString()} <span className="text-xs font-normal text-slate-400">un</span></h3>
            <p className="text-[10px] text-cyan-400 font-semibold mt-1">{inventoryMadefrontLength} referencias activas</p>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock Bodega Principal</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">{totalStockBodega.toLocaleString()} <span className="text-xs font-normal text-slate-400">un</span></h3>
            <p className="text-[10px] text-emerald-400 font-semibold mt-1">{inventoryBodegaLength} referencias activas</p>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Movimientos Registrados</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">{movementsLength}</h3>
            <p className="text-[10px] text-amber-400 font-semibold mt-1">Entradas y salidas de hoy</p>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-slate-700/60 p-5 rounded-2xl shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Discrepancias / Mermas</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">{discrepanciesLength}</h3>
            <p className="text-[10px] text-rose-400 font-semibold mt-1">Requiere revisión auditoría</p>
          </div>
        </div>
      </div>

      {/* Flujo de Actividad y Estado de Hardware */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de flujo en vivo */}
        <div className="lg:col-span-2 bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-700/80 pb-3">
            <div className="flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Tasa de Lectura RFID en Vivo (Tags/min)</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">🟢 Conectado a Middleware</span>
          </div>

          <div className="h-48 flex items-end gap-3 pt-6 px-2 bg-[#0F172A] rounded-xl border border-slate-800">
            {liveActivityFlow.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[9px] font-mono text-slate-400">{val}</span>
                <div 
                  className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-lg transition-all duration-500 hover:brightness-125" 
                  style={{ height: `${val}%` }}
                ></div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 text-center">Actualización automática cada 1.2 segundos mediante socket simulado con lector Zebra FX9600.</p>
        </div>

        {/* Estado de Lectores e Infraestructura */}
        <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-700/80 pb-3">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Estado de Hardware</h3>
          </div>

          <div className="space-y-3">
            <div className="bg-[#0F172A] border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <div>
                  <span className="text-xs font-bold text-white block">Zebra FX9600 (Muelle)</span>
                  <span className="text-[10px] text-slate-400 font-mono">IP: 192.168.1.150 • Antenas 1-4</span>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2.5 py-1 rounded-md border border-emerald-500/20">Online</span>
            </div>

            <div className="bg-[#0F172A] border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <div>
                  <span className="text-xs font-bold text-white block">Chainway C66 (Handheld)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Sede Madefront • Sincronizado</span>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2.5 py-1 rounded-md border border-emerald-500/20">Activo</span>
            </div>

            <div className="bg-[#0F172A] border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                <div>
                  <span className="text-xs font-bold text-white block">Torre de Luz I/O (Gate 2)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Estado: Reposo (Verde)</span>
                </div>
              </div>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-400 font-bold px-2.5 py-1 rounded-md border border-cyan-500/20">Listo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}