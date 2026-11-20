export type TriageLevel = 1 | 2 | 3;
export type ViewName = 'service' | 'queue' | 'history';
export type QueueFilter = 'all' | 'mine' | 'unassigned';
export type ServiceStatus =
  | 'assigned'
  | 'onway'
  | 'onsite'
  | 'transferred'
  | 'clinic'
  | 'hallazgos';

export interface QueueService {
  id: string;
  level: TriageLevel;
  type: string;
  comuna: string;
  createdAt: number;
  assignedTo: string | null;
  transfer?: boolean;
}

export interface ActiveService extends QueueService {
  status: ServiceStatus;
  clinic: string;
  times: {
    assigned: number;
    departure?: number;
    arrival?: number;
    transfer?: number;
    clinic?: number;
    received?: number;
    closed?: number;
  };
  findings?: Findings;
}

export interface Findings {
  fc?: string;
  fr?: string;
  spo2?: string;
  pas?: string;
  pad?: string;
  glasgow?: string;
  temp?: string;
  impression?: string;
  procedures: string[];
  outcome?: string;
  triage?: TriageLevel;
  observations?: string;
}
