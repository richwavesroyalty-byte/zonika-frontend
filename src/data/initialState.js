// Estado inicial centralizado para inventarios, muelle, operarios y analítica

export const initialInventoryMadefront = [
  { id: 'INV-001', epc: 'E280689400004001F82B', name: 'Lector Biométrico ZKTeco', category: 'Seguridad', stock: 45, rfidTagged: 45, location: 'Madefront Ferretería - Estante A1', status: 'Optimal' },
  { id: 'INV-002', epc: 'E280689400004001F82C', name: 'Cámara IP Domo 4K', category: 'CCTV', stock: 12, rfidTagged: 10, location: 'Madefront Ferretería - Estante B3', status: 'Low' },
];

export const initialInventoryBodega = [
  { id: 'BOD-501', epc: 'E280689400005009A11F', name: 'Taladro Percutor Industrial 800W', category: 'Herramientas', stock: 120, rfidTagged: 1200, location: 'Bodega Principal - Pasillo 3', status: 'Optimal' },
  { id: 'BOD-502', epc: 'E280689400005009A120', name: 'Etiqueta RFID UHF Zebra', category: 'Insumos', stock: 1200, rfidTagged: 1200, location: 'Bodega Principal - Caja 05', status: 'Optimal' },
];

export const initialMovements = [
  { id: 'MOV-501', type: 'ENTRADA', item: 'Lector Biométrico ZKTeco', qty: 15, user: 'Carlos Mendoza (Admin)', time: 'Hace 10 min' },
  { id: 'MOV-502', type: 'SALIDA', item: 'Cámara IP Domo 4K', qty: 2, user: 'Juan Pérez (Muelle)', time: 'Hace 45 min' },
];

export const initialMuelleHistorial = [
  { id: 'REC-892', ordenCompra: 'PO-44102', placaCamion: 'SGT-881', transportadora: 'TCC Carga', proveedor: 'Ferretería Mayorista SAS', timestamp: '23/10/2026, 09:15:22 a.m.', totalItems: 250, operator: 'Juan Pérez' },
  { id: 'REC-304', ordenCompra: 'PO-98210', placaCamion: 'WXYZ-12', transportadora: 'Deprisa Logística', proveedor: 'Seguridad Global Andina', timestamp: '23/10/2026, 02:40:10 p.m.', totalItems: 50, operator: 'Carlos Mendoza' },
];