import React, { useState } from 'react';
import { Printer, RefreshCw, CheckCircle2, Cpu, Settings } from 'lucide-react';

export default function EncoderView({ showNotification }) {
  const [epcCode, setEpcCode] = useState('E280689400004001F830');
  const [printerModel, setPrinterModel] = useState('Zebra ZT410 UHF RFID');
  const [powerLevel, setPowerLevel] = useState('25 dBm');
  const [encodedList, setEncodedList] = useState([
    { id: 'ENC-01', epc: 'E280689400004001F82B', item: 'Lector Biométrico ZKTeco', time: 'Hace 5 min' },
    { id: 'ENC-02', epc: 'E280689400004001F82C', item: 'Cámara IP Domo 4K', time: 'Hace 12 min' }
  ]);

  const handleGenerateNewEPC = () => {
    const newCode = 'E28068940000' + Math.floor(10000000 + Math.random() * 90000000);
    setEpcCode(newCode);
    if (showNotification) showNotification('✨ Nuevo código EPC generado con éxito.');
  };

  const handleBurnTag = (e) => {
    e.preventDefault();
    const newItem = {
      id: 'ENC-' + Math.floor(10 + Math.random() * 90),
      epc: epcCode,
      item: `Etiqueta UHF Industrial (${printerModel})`,
      time: 'Justo ahora'
    };
    setEncodedList([newItem, ...encodedList]);
    if (showNotification) showNotification('🖨️ ¡Tag RFID grabado e impreso correctamente vía ZPL!');
    handleGenerateNewEPC();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Grabación e Impresión de Tags RFID (Encoder)</h2>
        <p className="text-slate-400 text-xs mt-1 font-medium">Codificación de chips EPC y generación masiva de etiquetas UHF para inventario industrial.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de Configuración de Hardware */}
        <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-700/80 pb-3">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Configuración de Impresora</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Modelo de Impresora</label>
              <select 
                value={printerModel} 
                onChange={(e) => setPrinterModel(e.target.value)} 
                className="w-full bg-[#0F172A] border border-slate-700 p-2.5 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="Zebra ZT410 UHF RFID">Zebra ZT410 UHF RFID</option>
                <option value="Zebra ZD500R Desktop">Zebra ZD500R Desktop</option>
                <option value="TSC TTP-244M Pro">TSC TTP-244M Pro</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Potencia de Escritura</label>
              <select 
                value={powerLevel} 
                onChange={(e) => setPowerLevel(e.target.value)} 
                className="w-full bg-[#0F172A] border border-slate-700 p-2.5 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="20 dBm">20 dBm (Corto Alcance)</option>
                <option value="25 dBm">25 dBm (Estándar Industrial)</option>
                <option value="30 dBm">30 dBm (Máxima Potencia)</option>
              </select>
            </div>

            <div className="pt-2">
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 block text-center">
                🟢 Puerto USB / ZPL En Línea
              </span>
            </div>
          </div>
        </div>

        {/* Formulario Principal de Codificación */}
        <div className="lg:col-span-2 bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-700/80 pb-3">
            <Printer className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Generador y Escritor EPC</h3>
          </div>

          <form onSubmit={handleBurnTag} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Código EPC Generado (Hexadecimal 96-bit)</label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  readOnly 
                  value={epcCode} 
                  className="flex-1 bg-[#0F172A] border border-slate-700 p-3 rounded-xl text-xs font-mono text-cyan-400 font-bold focus:outline-none" 
                />
                <button 
                  type="button" 
                  onClick={handleGenerateNewEPC} 
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-3 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all"
                >
                  <RefreshCw className="w-4 h-4 text-cyan-400" /> Generar Otro
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs py-3.5 rounded-xl uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" /> Grabar Chip EPC & Imprimir Etiqueta ZPL
            </button>
          </form>
        </div>
      </div>

      {/* Historial de Etiquetas Codificadas */}
      <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl p-6 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Historial de Etiquetas Codificadas en Sesión</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase bg-slate-900/40 tracking-wider">
                <th className="py-3 px-4">ID Registro</th>
                <th className="py-3 px-4">Código EPC</th>
                <th className="py-3 px-4">Descripción / Impresora</th>
                <th className="py-3 px-4">Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs text-slate-200 font-mono">
              {encodedList.map((enc) => (
                <tr key={enc.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-cyan-400">{enc.id}</td>
                  <td className="py-3.5 px-4 text-slate-300">{enc.epc}</td>
                  <td className="py-3.5 px-4 font-sans font-semibold text-white">{enc.item}</td>
                  <td className="py-3.5 px-4 font-sans text-slate-400">{enc.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}