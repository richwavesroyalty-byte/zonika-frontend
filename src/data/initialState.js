// Estado inicial centralizado para los inventarios, muelle, operarios y analítica

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

export const initialHistoricalOperators = {
  '2026-10-24': [
    { 
      id: 'OP-01', name: 'Juan Pérez', role: 'Operador de Muelle', tasksCompleted: 42, efficiency: '96%', status: 'Excelente',
      hourlyLog: [
        { time: '08:15 a.m.', type: 'Recepción Muelle', detail: 'Ingreso Camión SGT-881 (250 ítems)', location: 'Muelle de Carga' },
        { time: '09:40 a.m.', type: 'Escaneo RFID', detail: 'Validación de 18 Cámaras Domo 4K', location: 'Muelle de Carga' },
      ]
    },
    { 
      id: 'OP-02', name: 'Sonia Gómez', role: 'Encargada de Inventario', tasksCompleted: 38, efficiency: '92%', status: 'Óptimo',
      hourlyLog: [
        { time: '08:30 a.m.', type: 'Codificación RFID', detail: 'Grabar y pegar 45 tags para Lectores ZKTeco', location: 'Madefront Ferretería' },
      ]
    }
  ]
};

export const initialCycleTimes = [
  { truckId: 'REC-892', plate: 'SGT-881', provider: 'Ferretería Mayorista SAS', arrivalTime: '09:00 a.m.', scanTime: '09:15 a.m.', leadTime: '15 Minutos', status: 'Rápido' },
  { truckId: 'REC-304', plate: 'WXYZ-12', provider: 'Seguridad Global Andina', arrivalTime: '02:00 p.m.', scanTime: '02:40 p.m.', leadTime: '40 Minutos', status: 'Revisión Manual' },
];