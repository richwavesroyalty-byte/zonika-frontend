import React, { useState } from 'react';
import { Printer, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function EncoderView({ showNotification }) {
  const [epcCode, setEpcCode] = useState('E280689400004001F830');
  const [encodedList, setEncodedList] = useState([
    { id: 'ENC-01', epc: 'E280689400004001F82B', item: 'Lector Biométrico ZKTeco', time: 'Hace 5 min' }
  ]);

  const handleGenerateNewEPC = () => {
    const newCode = 'E28068940000' + Math.floor(10000000 + Math.random() * 90000000);
    setEpcCode(newCode);
    if (showNotification) showNotification('✨ Nuevo código EPC generado.');
  };

  const handleBurnTag = (e) => {
    e.preventDefault();
    const newItem = {
      id: 'ENC-' + Math.floor(10 + Math.random() * 90),
      epc: epcCode,
      item: 'Etiqueta UHF Industrial - Madefront',
      time: 'Justo ahora'
    };
    setEncodedList([newItem, ...encodedList]);
    if (showNotification) showNotification('🖨️ ¡Tag RFID grabado e impreso con éxito!');
    handleGenerateNewEPC();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Grabación e Impresión de Tags RFID</h2>
        <p className="text-slate-400 text-xs mt-1 font-medium">Codificación de chips EPC y generación de etiquetas UHF industriales para el inventario.</p>
      </div>

      <div className="bg-[#1E293B] border border-slate-700/60 p-6 rounded-2xl shadow-xl space-y-4">
        <form onSubmit={handleBurnTag} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">Código EPC Generado para Chip</label>
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
            <Printer className="w-4 h-4" /> Grabar Tag RFID & Imprimir Etiqueta
          </button>
        </form>
      </div>

      <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl p-6 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Historial de Etiquetas Codificadas en Sesión</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase bg-slate-900/30">
              <th className="py-3 px-4">ID Registro</th>
              <th className="py-3 px-4">Código EPC</th>
              <th className="py-3 px-4">Descripción</th>
              <th className="py-3 px-4">Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs text-slate-200 font-mono">
            {encodedList.map((enc) => (
              <tr key={enc.id} className="hover:bg-slate-800/50">
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
  );
}