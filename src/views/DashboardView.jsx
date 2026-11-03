import React from 'react';
import { 
  Activity, Boxes, ArrowLeftRight, AlertTriangle, 
  Radio, Cpu, Warehouse, Signal, AlertOctagon
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
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* BANNER PRINCIPAL HIGH-TECH CON MARCO DE NEÓN DUBLE */}
      <div className="bg-[#0A0F1D] border-2 border-cyan-500/50 rounded-3xl p-6 shadow-[0_0_35px_rgba(0,240,255,0.15)] relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <h2 className="text-2xl font-black text-white tracking-wide flex items-center gap-3">
              <span>Panel General de Operaciones RFID</span>
              <span className="text-[11px] bg-cyan-500/20 text-[#00f0ff] border-2 border-cyan-400/80 px-3 py-1 rounded-full font-mono font-bold tracking-wider shadow-[0_0_12px_rgba(0,240,255,0.4)]">
                Enterprise v3.2
              </span>
            </h2>
            <p className="text-slate-400 text-xs mt-1 font-medium">
              Monitoreo en tiempo real de inventarios, antenas UHF y flujos logísticos en sedes.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#05070E] border-2 border-cyan-400/60 px-4 py-2 rounded-2xl text-xs font-mono font-bold shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Radio className={`w-4 h-4 ${isReading ? 'text-amber-400 animate-pulse' : 'text-[#00f0ff]'}`} />
            <span className="text-white">{isReading ? 'Lectura UHF Activa' : 'Sistema en Espera'}</span>
          </div>
        </div>
      </div>

      {/* METRICAS KPI CON BORDES NEÓN DE 2PX Y GLOW DENSE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stock Madefront (Cian Neón) */}
        <div className="bg-[#0A0F1D] border-2 border-[#00f0ff] rounded-3xl p-5 shadow-[0_0_25px_rgba(0,240,255,0.35)] transition-all hover:scale-[1.02] group">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">STOCK MADEFRONT</span>
              <div className="text-3xl font-black text-white mt-2 tracking-tight group-hover:text-[#00f0ff] transition-colors">
                {totalStockMadefront.toLocaleString()} <span className="text-xs text-slate-500 font-normal">un</span>
              </div>
            </div>
            <div className="p-3 bg-cyan-500/20 text-[#00f0ff] rounded-2xl border border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <Warehouse className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-[#00f0ff] font-mono font-bold mt-3">{inventoryMadefrontLength} referencias activas</p>
        </div>

        {/* Stock Bodega Principal (Verde Esmeralda Neón) */}
        <div className="bg-[#0A0F1D] border-2 border-[#10b981] rounded-3xl p-5 shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.02] group">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">STOCK BODEGA PRINCIPAL</span>
              <div className="text-3xl font-black text-white mt-2 tracking-tight group-hover:text-emerald-300 transition-colors">
                {totalStockBodega.toLocaleString()} <span className="text-xs text-slate-500 font-normal">un</span>
              </div>
            </div>
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-400 font-mono font-bold mt-3">{inventoryBodegaLength} referencias activas</p>
        </div>

        {/* Movimientos (Dorado Neón) */}
        <div className="bg-[#0A0F1D] border-2 border-[#f59e0b] rounded-3xl p-5 shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all hover:scale-[1.02] group">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">MOVIMIENTOS REGISTRADOS</span>
              <div className="text-3xl font-black text-white mt-2 tracking-tight group-hover:text-amber-300 transition-colors">
                {movementsLength}
              </div>
            </div>
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-amber-400 font-mono font-bold mt-3">Entradas y salidas de hoy</p>
        </div>

        {/* Discrepancias (Carmesí Neón) */}
        <div className="bg-[#0A0F1D] border-2 border-[#ff2a6d] rounded-3xl p-5 shadow-[0_0_25px_rgba(255,42,109,0.45)] transition-all hover:scale-[1.02] group">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">DISCREPANCIAS / MERMAS</span>
              <div className="text-3xl font-black text-[#ff2a6d] mt-2 tracking-tight">
                {discrepanciesLength}
              </div>
            </div>
            <div className="p-3 bg-rose-500/20 text-[#ff2a6d] rounded-2xl border border-[#ff2a6d] shadow-[0_0_15px_rgba(255,42,109,0.4)]">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-[#ff2a6d] font-mono font-bold mt-3">Requiere revisión auditoría</p>
        </div>
      </div>

      {/* GRÁFICO CON RETÍCULA Y LÍNEA LÁSER + ESTADO DE HARDWARE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico de Flujo en Vivo con Láser */}
        <div className="lg:col-span-2 bg-[#0A0F1D] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,240,255,0.1)] space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5 text-[#00f0ff]">
              <Activity className="w-5 h-5" />
              <h3 className="text-xs font-mono font-black uppercase tracking-wider text-white">
                TASA DE LECTURA RFID EN VIVO (TAGS/MIN)
              </h3>
            </div>
            <span className="flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Conectado a Middleware
            </span>
          </div>

          {/* Área del gráfico con retícula y escáner vertical */}
          <div className="relative h-52 flex items-end justify-between gap-3 pt-6 px-4 bg-[#040711] rounded-2xl border border-slate-800 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-[size:24px_24px] overflow-hidden">
            
            {/* Línea Láser Vertical Cyan en el gráfico */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#00f0ff] shadow-[0_0_12px_#00f0ff] z-10 opacity-70"></div>

            {liveActivityFlow.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group z-20">
                <span className="text-[10px] font-mono text-cyan-300 font-bold opacity-80 group-hover:opacity-100">{val}</span>
                <div 
                  className="w-full bg-gradient-to-t from-cyan-600 via-cyan-400 to-[#00f0ff] rounded-t-md transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.8)]"
                  style={{ height: `${val}%` }}
                ></div>
              </div>
            ))}
          </div>
          
          <p className="text-[10px] text-slate-500 font-mono text-center">
            Actualización automática cada 1.2 segundos mediante socket simulado con lector Zebra FX9600.
          </p>
        </div>

        {/* Estado de Lectores con Barras RSSI */}
        <div className="bg-[#0A0F1D] border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-[#00f0ff] border-b border-slate-800 pb-3">
            <Cpu className="w-5 h-5" />
            <h3 className="text-xs font-mono font-black uppercase tracking-wider text-white">ESTADO DE HARDWARE</h3>
          </div>

          <div className="space-y-3">
            {/* Zebra FX9600 */}
            <div className="bg-[#05070E] border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.9)]"></div>
                <div>
                  <span className="text-xs font-bold text-white block">Zebra FX9600 (Muelle)</span>
                  <span className="text-[10px] text-slate-500 font-mono">IP: 192.168.1.150 • Antenas 1-4</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Signal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/80 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  Online
                </span>
              </div>
            </div>

            {/* Chainway C66 */}
            <div className="bg-[#05070E] border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.9)]"></div>
                <div>
                  <span className="text-xs font-bold text-white block">Chainway C66 (Handheld)</span>
                  <span className="text-[10px] text-slate-500 font-mono">Sede Madefront • Sincronizado</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Signal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/80 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  Activo
                </span>
              </div>
            </div>

            {/* Torre de Luz I/O */}
            <div className="bg-[#05070E] border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.9)]"></div>
                <div>
                  <span className="text-xs font-bold text-white block">Torre de Luz I/O (Gate 2)</span>
                  <span className="text-[10px] text-slate-500 font-mono">Estado: Reposo (Verde)</span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#00f0ff] bg-cyan-500/20 border border-cyan-400/80 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                Listo
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}