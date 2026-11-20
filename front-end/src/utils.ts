import { TriageLevel } from './types';

export const roman: Record<TriageLevel, string> = { 1: 'I', 2: 'II', 3: 'III' };
export const triageLabel: Record<TriageLevel, string> = {
  1: 'Emergencia vital',
  2: 'Urgencia',
  3: 'Consulta prioritaria',
};

export function minutesAgo(timestamp?: number): number {
  if (!timestamp) return 0;
  return Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));
}

export function timeLabel(timestamp?: number): string {
  if (!timestamp) return '–';
  return new Date(timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function sortQueue<T extends { level: TriageLevel; createdAt: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.level - b.level || a.createdAt - b.createdAt);
}
