import React, { useState } from 'react';
import { Printer, RefreshCw, Cpu, CheckCircle2, Zap } from 'lucide-react';

export default function EncoderView({ showNotification }) {
  const [printerModel, setPrinterModel] = useState('Zebra ZT410 UHF RFID');
  const [rfidPower, setRfidPower] = useState('25 dBm (Estándar Industrial)');
  const [printerPort, setPrinterPort] = useState('Puerto USB / ZPL En Línea');
  
  const [currentEpc, setCurrentEpc] = useState('E280689400004001F830');
  const [itemDescription, setItemDescription] = useState('Lector Biométrico ZKTeco - Lote Principal');
  const [encodedHistory, setEncodedHistory] = useState([
    { id: 'ENC-01', epc: 'E280689400004001F82B', desc: 'Lector Biométrico ZKTeco', time: 'Hace 5 min' },
    { id: 'ENC-02', epc: 'E280689400004001F82C', desc: 'Cámara IP Domo 4K', time: 'Hace 12 min' },
  ]);

  const handleGenerateNewEpc = () => {
    const randomHex = 'E28068940000' + Math.floor(10000000 + Math.random() * 90000000).toString(16).toUpperCase();
    setCurrentEpc(randomHex);
    if (showNotification) showNotification('🔄 Nuevo código EPC generado.');
  };

  const handleBurnAndPrint = (e) => {
    e.preventDefault();
    if (!currentEpc) return;

    const newRecord = {
      id: 'ENC-' + Math.floor(10 + Math.random() * 90),
      epc: currentEpc,
      desc: itemDescription || 'Etiqueta RFID Genérica',
      time: 'Justo ahora'
    };

    setEncodedHistory([newRecord, ...encodedHistory]);
    if (showNotification) {
      showNotification(`🖨️ ¡Chip grabado y ZPL enviado a ${printerModel} (${printerPort})!`);
    }
    handleGenerateNewEpc();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Grabación e Impresión de Tags RFID (Encoder)</h2>
        <p className="text-slate-400 text-xs mt-1 font-medium">Codificación de chips EPC y generación masiva de etiquetas UHF para inventario industrial.</p>
      </div>

      {/* GENERADOR Y ESCRITOR EPC - ESTILO BLACK OLED UNIFICADO */}
      <div className="bg-[#05070E] border-2 border-slate-800/90 p-6 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <Printer className="w-5 h-5 text-[#00f0ff]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Generador, Escritor EPC & Impresión ZPL</h3>
        </div>

        <form onSubmit={handleBurnAndPrint} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Impresora Activa (Sincronizada)</label>
              <select 
                value={printerModel} 
                onChange={(e) => setPrinterModel(e.target.value)}
                className="w-full bg-[#020408] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-[#00f0ff] cursor-pointer"
              >
                <option value="Zebra ZT410 UHF RFID">Zebra ZT410 UHF RFID</option>
                <option value="Zebra ZT230 RFID Industrial">Zebra ZT230 RFID Industrial</option>
                <option value="Toshiba B-EX4T1 RFID">Toshiba B-EX4T1 RFID</option>
                <option value="SATO CL4NX Plus RFID">SATO CL4NX Plus RFID</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Potencia de Escritura Antena</label>
              <select 
                value={rfidPower} 
                onChange={(e) => setRfidPower(e.target.value)}
                className="w-full bg-[#020408] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-[#00f0ff] cursor-pointer"
              >
                <option value="18 dBm (Baja Potencia)">18 dBm (Baja Potencia)</option>
                <option value="25 dBm (Estándar Industrial)">25 dBm (Estándar Industrial)</option>
                <option value="30 dBm (Máximo Alcance UHF)">30 dBm (Máximo Alcance UHF)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Código EPC Generado (Hexadecimal 96-Bit)</label>
              <button 
                type="button" 
                onClick={handleGenerateNewEpc}
                className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Generar Otro
              </button>
            </div>
            <input 
              type="text" 
              value={currentEpc} 
              onChange={(e) => setCurrentEpc(e.target.value)}
              className="w-full bg-[#020408] border border-slate-800 rounded-xl px-4 py-3 text-sm text-cyan-400 font-mono font-bold focus:outline-none focus:border-[#00f0ff]"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Descripción o Artículo a Codificar</label>
            <input 
              type="text" 
              value={itemDescription} 
              onChange={(e) => setItemDescription(e.target.value)}
              placeholder="Ej. Lector Biométrico ZKTeco..."
              className="w-full bg-[#020408] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00f0ff]"
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              className="w-full bg-[#00f0ff] hover:bg-cyan-300 text-black font-black text-xs py-3.5 rounded-xl uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.6)] transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" /> Grabar Chip EPC & Imprimir Etiqueta ZPL
            </button>
          </div>
        </form>
      </div>

      {/* HISTORIAL DE ETIQUETAS CODIFICADAS */}
      <div className="bg-[#05070E] border-2 border-slate-800/90 p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <Printer className="w-5 h-5 text-[#00f0ff]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Historial de Etiquetas Codificadas en Sesión</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-[#020408]">
                <th className="py-3 px-4">ID Registro</th>
                <th className="py-3 px-4">Código EPC</th>
                <th className="py-3 px-4">Descripción / Artículo</th>
                <th className="py-3 px-4 text-right">Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {encodedHistory.length > 0 ? (
                encodedHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-[#020408]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#00f0ff]">{h.id}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{h.epc}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">{h.desc}</td>
                    <td className="py-3.5 px-4 text-right text-slate-400 text-[11px] font-mono">{h.time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400 text-xs font-medium">
                    No hay etiquetas codificadas en esta sesión.
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