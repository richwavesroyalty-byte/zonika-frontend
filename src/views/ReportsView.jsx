import React from 'react';
import { 
  BarChart3, Download, FileText, Calendar, Filter, 
  Clock, UserCheck, TrendingDown, Sparkles, TrendingUp, Activity, Eye 
} from 'lucide-react';

export default function ReportsView({ 
  reportDateRange, setReportDateRange, 
  reportWarehouseFilter, setReportWarehouseFilter,
  productSalesPerformance, cycleTimes, 
  selectedOperatorDate, setSelectedOperatorDate, 
  currentOperatorsList, setSelectedOperatorDetails, 
  stockoutForecast, discrepancies, onExportExcel, onExportPDF 
}) {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* CABECERA Y FILTROS */}
      <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Centro de Reportes & Analítica Gerencial</h2>
            <p className="text-slate-400 text-xs mt-1 font-medium">Informe consolidado con inteligencia artificial, mermas, tiempos de ciclo y pronósticos de stock.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onExportExcel}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all"
            >
              <Download className="w-4 h-4" /> Exportar Excel
            </button>
            <button 
              onClick={onExportPDF}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all"
            >
              <FileText className="w-4 h-4" /> Exportar PDF
            </button>
          </div>
        </div>

        <div className="border-t border-slate-700/80 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 bg-[#0F172A] border border-slate-800 p-3 rounded-xl">
            <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="w-full">
              <label className="text-[10px] font-bold text-slate-400 uppercase block">Rango de Fechas</label>
              <select value={reportDateRange} onChange={(e)=>setReportDateRange(e.target.value)} className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer mt-0.5">
                <option value="today" className="bg-slate-900">Hoy (Corte Diario)</option>
                <option value="week" className="bg-slate-900">Esta Semana</option>
                <option value="month" className="bg-slate-900">Este Mes (Actual)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#0F172A] border border-slate-800 p-3 rounded-xl">
            <Filter className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="w-full">
              <label className="text-[10px] font-bold text-slate-400 uppercase block">Filtrar por Sede</label>
              <select value={reportWarehouseFilter} onChange={(e)=>setReportWarehouseFilter(e.target.value)} className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer mt-0.5">
                <option value="all" className="bg-slate-900">Todas las Sedes (Consolidado)</option>
                <option value="madefront" className="bg-slate-900">Madefront Ferretería</option>
                <option value="bodega" className="bg-slate-900">Bodega Principal</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ⏱️ TIEMPOS DE CICLO LOGÍSTICO (LEAD TIME) EN MUELLE */}
      <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-700/80 pb-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Tiempos de Ciclo Logístico en Muelle (Lead Time)</h3>
            <p className="text-[10px] text-slate-400">Duración exacta desde la llegada del camión hasta la validación y escaneo RFID de cierre</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">ID Recepción</th>
                <th className="py-3 px-4">Placa Camión</th>
                <th className="py-3 px-4">Proveedor</th>
                <th className="py-3 px-4 text-center">Hora de Llegada</th>
                <th className="py-3 px-4 text-center">Escaneo de Cierre</th>
                <th className="py-3 px-4 text-center">Tiempo Total (Lead Time)</th>
                <th className="py-3 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200 font-medium">
              {cycleTimes.map((c, i) => (
                <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{c.truckId}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">{c.plate}</td>
                  <td className="py-3.5 px-4 text-slate-300">{c.provider}</td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-400">{c.arrivalTime}</td>
                  <td className="py-3.5 px-4 text-center font-mono text-cyan-400">{c.scanTime}</td>
                  <td className="py-3.5 px-4 text-center font-black text-white">{c.leadTime}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${c.status === 'Rápido' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRODUCTIVIDAD & PRONÓSTICO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-700/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Productividad por Operador</h3>
                <p className="text-[10px] text-slate-400">Haz clic para ver desglose horario</p>
              </div>
            </div>
            
            <select value={selectedOperatorDate} onChange={(e) => setSelectedOperatorDate(e.target.value)} className="bg-[#0F172A] border border-slate-800 text-[11px] font-bold text-cyan-400 p-2 rounded-xl focus:outline-none cursor-pointer">
              <option value="2026-10-24">Hoy (24 Oct)</option>
            </select>
          </div>

          <div className="space-y-2.5">
            {currentOperatorsList.map((op) => (
              <div key={op.id} onClick={() => setSelectedOperatorDetails(op)} className="flex justify-between items-center bg-[#0F172A] hover:bg-slate-800 border border-slate-800 p-3 rounded-xl text-xs cursor-pointer transition-all group">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-cyan-400 font-bold flex items-center justify-center text-xs group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                    {op.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-white font-semibold block group-hover:text-cyan-400">{op.name}</span>
                    <span className="text-[10px] text-slate-400">{op.role} • {op.tasksCompleted} tareas</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">{op.efficiency}</span>
                  <Eye className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-700/80 pb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Pronóstico de Quiebre de Stock (AI)</h3>
              <p className="text-[10px] text-slate-400">Días estimados antes de agotar inventario</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {stockoutForecast.map((s, idx) => (
              <div key={idx} className="bg-[#0F172A] border border-slate-800 p-3 rounded-xl text-xs space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-cyan-400">{s.sku} - {s.name}</span>
                  <span className="text-amber-400">{s.daysLeft} días restantes</span>
                </div>
                <p className="text-[10px] text-slate-400">Stock actual: {s.currentStock} un | Consumo diario: {s.dailyConsumption} un</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}