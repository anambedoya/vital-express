import { ActiveService, QueueService } from './types';

const now = Date.now();
const MIN = 60_000;

export const activeServiceFixture: ActiveService = {
  id: 'S-1003',
  level: 1,
  type: 'Dolor torácico',
  comuna: 'Robledo',
  createdAt: now - 12 * MIN,
  assignedTo: 'TAM-03',
  transfer: false,
  status: 'onway',
  clinic: 'Clínica Norte',
  times: {
    assigned: now - 10 * MIN,
    departure: now - 9 * MIN,
  },
};

export const queueFixture: QueueService[] = [
  { id: 'S-1006', level: 1, type: 'Trauma grave', comuna: 'Doce de Octubre', createdAt: now - 3 * MIN, assignedTo: 'TAM-03', transfer: true },
  { id: 'S-1001', level: 2, type: 'Crisis asmática', comuna: 'Villa Hermosa', createdAt: now - 14 * MIN, assignedTo: null },
  { id: 'S-1005', level: 2, type: 'Posible fractura', comuna: 'Castilla', createdAt: now - 9 * MIN, assignedTo: 'TAB-03' },
  { id: 'S-1007', level: 2, type: 'Dolor abdominal intenso', comuna: 'Villa Hermosa', createdAt: now - 6 * MIN, assignedTo: null },
  { id: 'S-1002', level: 3, type: 'Fiebre persistente', comuna: 'Belén', createdAt: now - 22 * MIN, assignedTo: null },
  { id: 'S-1009', level: 3, type: 'Malestar general', comuna: 'Laureles-Estadio', createdAt: now - 11 * MIN, assignedTo: 'MD-02' },
];
