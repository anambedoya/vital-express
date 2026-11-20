import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { activeServiceFixture, queueFixture } from './src/data';
import { theme } from './src/theme';
import { ActiveService, Findings, QueueFilter, TriageLevel, ViewName } from './src/types';
import { minutesAgo, roman, sortQueue, timeLabel, triageLabel } from './src/utils';

const UNIT = 'TAM-03';

const IMPRESSIONS = ['Cardiovascular', 'Respiratorio', 'Trauma', 'Neurológico', 'Digestivo', 'Infeccioso', 'Otro'];
const PROCEDURES = ['Monitoreo', 'Oxígeno', 'Acceso venoso', 'Medicamentos', 'Inmovilización', 'Curación', 'RCP', 'Electrocardiograma'];

function TriageBadge({ level, compact = false }: { level: TriageLevel; compact?: boolean }) {
  return (
    <View style={[styles.triage, compact && styles.triageCompact, level === 1 ? styles.triage1 : level === 2 ? styles.triage2 : styles.triage3]}>
      <Text style={[styles.triageText, level === 1 ? styles.triageText1 : level === 2 ? styles.triageText2 : styles.triageText3]}>{roman[level]}</Text>
    </View>
  );
}

export default function App() {
  const [view, setView] = useState<ViewName>('service');
  const [filter, setFilter] = useState<QueueFilter>('all');
  const [active, setActive] = useState<ActiveService | null>(activeServiceFixture);
  const [queue, setQueue] = useState(queueFixture);
  const [history, setHistory] = useState<ActiveService[]>([]);
  const [findings, setFindings] = useState<Findings>({ procedures: [], triage: activeServiceFixture.level });
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((value) => value + 1), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3400);
    return () => clearTimeout(timer);
  }, [toast]);

  const filteredQueue = useMemo(() => {
    let result = sortQueue(queue);
    if (filter === 'mine') result = result.filter((item) => item.assignedTo === UNIT || item.level === 1);
    if (filter === 'unassigned') result = result.filter((item) => !item.assignedTo);
    return result;
  }, [queue, filter]);

  const queueBadge = queue.filter((item) => item.assignedTo === UNIT || !item.assignedTo).length;

  function advance(next: ActiveService['status']) {
    if (!active) return;
    const now = Date.now();
    const times = { ...active.times };

    if (next === 'onway') times.departure = now;
    if (next === 'onsite') times.arrival = now;
    if (next === 'transferred') times.transfer = now;
    if (next === 'clinic') times.clinic = now;

    setActive({ ...active, status: next, times });
    setError('');
  }

  function finishService() {
    if (!active) return;
    if (!findings.impression) {
      setError('Elige la impresión diagnóstica.');
      return;
    }
    if (!findings.outcome) {
      setError('Indica cómo terminó la atención.');
      return;
    }
    if (!findings.triage) {
      setError('Confirma el nivel de triage en el sitio.');
      return;
    }

    const closed = { ...active, status: 'hallazgos' as const, findings: { ...findings }, times: { ...active.times, closed: Date.now() } };
    setHistory((items) => [closed, ...items]);

    const next = sortQueue(queue).find((item) => item.assignedTo === UNIT);
    if (next) {
      setQueue((items) => items.filter((item) => item.id !== next.id));
      setActive({
        ...next,
        transfer: false,
        status: 'assigned',
        clinic: 'Clínica Norte',
        times: { assigned: Date.now() },
      });
      setToast(`${active.id} finalizado. Siguiente: ${next.id}.`);
    } else {
      setActive(null);
      setToast(`${active.id} finalizado. Quedas disponible.`);
    }
    setFindings({ procedures: [], triage: active.level });
    setError('');
  }

  function renderHeader() {
    const busy = !!active;
    const status = !active
      ? 'Disponible'
      : active.status === 'clinic'
        ? `Ocupada: esperando recepción`
        : `Ocupada: ${active.id}`;

    return (
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View>
            <Text style={styles.brand}>♥ Vital Express</Text>
          </View>
          <View style={styles.unitBlock}>
            <Text style={styles.unitCode}>TAM-03</Text>
            <Text style={styles.unitMeta}>Ambulancia medicalizada</Text>
            <Text style={styles.unitMeta}>Base Occidente</Text>
          </View>
        </View>
        <View style={[styles.availability, busy ? null : styles.available]}>
          <View style={[styles.statusDot, busy ? styles.statusDotBusy : styles.statusDotFree]} />
          <Text style={styles.availabilityText}>{status}</Text>
        </View>
      </View>
    );
  }

  function renderService() {
    if (!active) {
      return (
        <View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Estás disponible</Text>
            <Text style={styles.meta}>No tienes servicios asignados. El despacho te asignará el próximo según urgencia, ubicación y carga.</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Lo que viene en la cola</Text>
            {sortQueue(queue).slice(0, 3).map(renderQueueItem)}
            <Pressable style={styles.secondaryButton} onPress={() => setView('queue')}>
              <Text style={styles.secondaryButtonText}>Ver toda la cola</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    const steps = [
      ['Asignado', 'El despacho te asignó el servicio'],
      ['En camino', 'Saliste hacia el lugar'],
      ['En el sitio', 'Atención al paciente'],
      ['Trasladando', 'Rumbo a la clínica'],
      ['En la clínica', 'Esperando recepción'],
      ['Paciente recibido', 'La clínica confirmó la recepción'],
      ['Hallazgos y cierre', 'Registro del servicio'],
    ] as const;

    const statusIndex: Record<ActiveService['status'], number> = {
      assigned: 0,
      onway: 1,
      onsite: 2,
      transferred: 3,
      clinic: 4,
      hallazgos: 6,
    };
    const index = statusIndex[active.status];

    return (
      <View>
        <View style={styles.card}>
          <View style={styles.serviceTop}>
            <TriageBadge level={active.level} />
            <Text style={styles.meta}>{active.id}</Text>
          </View>
          <Text style={styles.serviceTitle}>{active.type}</Text>
          <Text style={styles.meta}>{active.comuna} · {triageLabel[active.level]}</Text>
          <View style={styles.chips}>
            <View style={styles.chip}><Text style={styles.chipText}>Asignado {timeLabel(active.times.assigned)}</Text></View>
            {active.level === 1 && <View style={[styles.chip, styles.warningChip]}><Text style={[styles.chipText, styles.warningChipText]}>Meta de llegada 15 min</Text></View>}
            {active.transfer && <View style={styles.chip}><Text style={styles.chipText}>Destino {active.clinic}</Text></View>}
          </View>
        </View>

        {active.status === 'hallazgos' ? renderFindings() : (
          <View>
            <View style={styles.card}>{renderServiceAction()}</View>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Avance del servicio</Text>
              {steps.map(([label, description], stepIndex) => {
                const skipTransfer = stepIndex === 3 || stepIndex === 4 || stepIndex === 5;
                const skipped = active.transfer === false && skipTransfer;
                const done = stepIndex < index;
                const now = stepIndex === index;
                return (
                  <View key={label} style={styles.stepRow}>
                    <View style={[styles.stepCircle, done && styles.stepDone, now && styles.stepNow, skipped && styles.stepSkipped]}>
                      <Text style={[styles.stepCircleText, (done || now) && styles.stepCircleTextActive]}>{done ? '✓' : stepIndex + 1}</Text>
                    </View>
                    <View style={styles.stepCopy}>
                      <Text style={[styles.stepLabel, skipped && styles.stepSkippedText]}>{label}</Text>
                      <Text style={styles.stepDescription}>{skipped ? 'No aplica: atendido en el sitio' : description}</Text>
                    </View>
                    <Text style={styles.stepTime}>{stepIndex === 0 ? timeLabel(active.times.assigned) : '–'}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>
    );
  }

  function renderServiceAction() {
    if (!active) return null;
    if (active.status === 'assigned') {
      return <Pressable style={styles.primaryButton} onPress={() => advance('onway')}><Text style={styles.primaryButtonText}>Salir hacia el servicio</Text></Pressable>;
    }
    if (active.status === 'onway') {
      return <Pressable style={styles.primaryButton} onPress={() => advance('onsite')}><Text style={styles.primaryButtonText}>Llegué al sitio</Text></Pressable>;
    }
    if (active.status === 'onsite') {
      return (
        <View>
          <Pressable style={styles.primaryButton} onPress={() => {
            setActive((current) => current ? {
              ...current,
              transfer: true,
              status: 'transferred',
              times: { ...current.times, transfer: Date.now() },
            } : current);
            setError('');
          }}><Text style={styles.primaryButtonText}>Iniciar traslado a clínica</Text></Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => {
            setActive((current) => current ? { ...current, transfer: false } : current);
            setFindings((current) => ({ ...current, triage: active.level }));
            setActive((current) => current ? { ...current, status: 'hallazgos' } : current);
          }}><Text style={styles.secondaryButtonText}>Atendido en el sitio, sin traslado</Text></Pressable>
        </View>
      );
    }
    if (active.status === 'transferred') {
      return <Pressable style={styles.primaryButton} onPress={() => advance('clinic')}><Text style={styles.primaryButtonText}>Llegué a {active.clinic}</Text></Pressable>;
    }
    if (active.status === 'clinic') {
      return (
        <View>
          <View style={styles.waitingRule}>
            <Text style={styles.waitingTitle}>Aún no puedes cerrar.</Text>
            <Text style={styles.waitingCopy}>La ambulancia sigue ocupada hasta que la clínica reciba al paciente.</Text>
            <Text style={styles.waitingTimer}>{minutesAgo(active.times.clinic)} min</Text>
          </View>
          <Pressable style={[styles.primaryButton, styles.successButton]} onPress={() => {
            setActive((current) => current ? { ...current, times: { ...current.times, received: Date.now() }, status: 'hallazgos' } : current);
            setFindings((current) => ({ ...current, triage: active.level }));
          }}><Text style={styles.primaryButtonText}>La clínica recibió al paciente</Text></Pressable>
        </View>
      );
    }
    return null;
  }

  function toggleProcedure(procedure: string) {
    setFindings((current) => ({
      ...current,
      procedures: current.procedures.includes(procedure)
        ? current.procedures.filter((item) => item !== procedure)
        : [...current.procedures, procedure],
    }));
  }

  function renderFindings() {
    if (!active) return null;
    const outcomes = active.transfer
      ? ['Trasladado y recibido en clínica', 'Trasladado, requirió reanimación en ruta']
      : ['Atendido y resuelto en el sitio', 'Se recomendó consulta prioritaria', 'Paciente rechazó el traslado', 'No requirió atención'];

    return (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Hallazgos del servicio</Text>
        <Text style={styles.meta}>{active.times.arrival ? `Llegada en ${minutesAgo(active.times.assigned) - minutesAgo(active.times.arrival)} min` : '–'} · {active.transfer ? 'Recepción registrada' : 'Atendido en el sitio'}</Text>

        <Text style={styles.legend}>Signos vitales <Text style={styles.optional}>(opcional)</Text></Text>
        <View style={styles.vitals}>
          {[
            ['FC lpm', 'fc'], ['FR rpm', 'fr'], ['SpO₂ %', 'spo2'], ['PA sistólica', 'pas'], ['PA diastólica', 'pad'], ['Glasgow', 'glasgow'], ['Temp °C', 'temp'],
          ].map(([label, key]) => (
            <View style={styles.vitalField} key={key}>
              <Text style={styles.vitalLabel}>{label}</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={(findings as unknown as Record<string, string>)[key] || ''}
                onChangeText={(value) => setFindings((current) => ({ ...current, [key]: value }))}
              />
            </View>
          ))}
        </View>

        <Text style={styles.legend}>Impresión diagnóstica</Text>
        <View style={styles.options}>{IMPRESSIONS.map((item) => (
          <Pressable key={item} style={[styles.option, findings.impression === item && styles.optionSelected]} onPress={() => setFindings((current) => ({ ...current, impression: item }))}>
            <Text style={[styles.optionText, findings.impression === item && styles.optionTextSelected]}>{item}</Text>
          </Pressable>
        ))}</View>

        <Text style={styles.legend}>Procedimientos realizados <Text style={styles.optional}>(varios)</Text></Text>
        <View style={styles.options}>{PROCEDURES.map((item) => (
          <Pressable key={item} style={[styles.option, findings.procedures.includes(item) && styles.optionSelected]} onPress={() => toggleProcedure(item)}>
            <Text style={[styles.optionText, findings.procedures.includes(item) && styles.optionTextSelected]}>{item}</Text>
          </Pressable>
        ))}</View>

        <Text style={styles.legend}>Cómo terminó la atención</Text>
        <View style={styles.outcomes}>{outcomes.map((item) => (
          <Pressable key={item} style={[styles.option, findings.outcome === item && styles.optionSelected]} onPress={() => setFindings((current) => ({ ...current, outcome: item }))}>
            <Text style={[styles.optionText, findings.outcome === item && styles.optionTextSelected]}>{item}</Text>
          </Pressable>
        ))}</View>

        <Text style={styles.legend}>Triage confirmado en el sitio</Text>
        <View style={styles.options}>{([1, 2, 3] as TriageLevel[]).map((level) => (
          <Pressable key={level} style={[styles.option, findings.triage === level && styles.optionSelected]} onPress={() => setFindings((current) => ({ ...current, triage: level }))}>
            <Text style={[styles.optionText, findings.triage === level && styles.optionTextSelected]}>{roman[level]} · {triageLabel[level]}</Text>
          </Pressable>
        ))}</View>
        {findings.triage && <Text style={[styles.triageNote, findings.triage === active.level ? styles.triageMatch : styles.triageMismatch]}>{findings.triage === active.level ? 'Coincide con el triage del despacho.' : `Reclasificado: el despacho lo envió como Triage ${roman[active.level]}.`}</Text>}

        <Text style={styles.legend}>Observaciones <Text style={styles.optional}>(opcional)</Text></Text>
        <TextInput
          style={styles.textarea}
          multiline
          maxLength={400}
          placeholder="Hallazgos relevantes para el despacho o la clínica"
          placeholderTextColor={theme.muted}
          value={findings.observations || ''}
          onChangeText={(value) => setFindings((current) => ({ ...current, observations: value }))}
        />
        <Text style={styles.hint}>No escribas nombres, documentos ni direcciones.</Text>

        {!!error && <Text style={styles.error}>{error}</Text>}
        <Pressable style={[styles.primaryButton, styles.successButton]} onPress={finishService}>
          <Text style={styles.primaryButtonText}>Finalizar servicio</Text>
        </Pressable>
      </View>
    );
  }

  function renderQueueItem(item: (typeof queue)[number]) {
    const wait = minutesAgo(item.createdAt);
    const late = (item.level === 1 && wait >= 5) || (item.level === 2 && wait >= 15);
    const isMine = item.assignedTo === UNIT;
    return (
      <View key={item.id} style={[styles.queueItem, isMine && styles.queueItemMine]}>
        <TriageBadge level={item.level} compact />
        <View style={styles.queueCopy}>
          <Text style={styles.queueTitle}>{item.type}</Text>
          <Text style={styles.queueMeta}>{item.id} · {item.comuna}</Text>
          <View style={[styles.queueTag, isMine ? styles.queueTagMine : !item.assignedTo ? styles.queueTagPending : null]}>
            <Text style={[styles.queueTagText, isMine ? styles.queueTagTextMine : !item.assignedTo ? styles.queueTagTextPending : null]}>{isMine ? 'Siguiente para ti' : item.assignedTo ? `Asignado a ${item.assignedTo}` : 'Sin asignar'}</Text>
          </View>
        </View>
        <View style={styles.queueWait}>
          <Text style={[styles.queueWaitValue, late && styles.queueWaitLate]}>{wait} min</Text>
          <Text style={styles.queueMeta}>en cola</Text>
        </View>
      </View>
    );
  }

  function renderQueue() {
    return (
      <View>
        <View style={styles.queueHeader}>
          <Text style={styles.cardTitle}>Cola de servicios</Text>
          <Text style={styles.meta}>{queue.length} en cola</Text>
        </View>
        <Text style={[styles.meta, styles.queueHelp]}>Ordenada por urgencia y luego por orden de llegada. El despacho decide la asignación.</Text>
        <View style={styles.filters}>
          {([
            ['all', 'Todos'],
            ['mine', 'Para mi móvil'],
            ['unassigned', 'Sin asignar'],
          ] as [QueueFilter, string][]).map(([key, label]) => (
            <Pressable key={key} style={[styles.filter, filter === key && styles.filterSelected]} onPress={() => setFilter(key)}>
              <Text style={[styles.filterText, filter === key && styles.filterTextSelected]}>{label}</Text>
            </Pressable>
          ))}
        </View>
        {filteredQueue.length ? filteredQueue.map(renderQueueItem) : <View style={styles.empty}><Text style={styles.meta}>No hay servicios con este filtro.</Text></View>}
      </View>
    );
  }

  function renderHistory() {
    if (!history.length) {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.sectionTitle}>Aún no has cerrado servicios hoy</Text>
          <Text style={styles.meta}>Cuando finalices un servicio con sus hallazgos, aparecerá aquí.</Text>
        </View>
      );
    }

    return (
      <View>
        <View style={styles.queueHeader}>
          <Text style={styles.cardTitle}>Terminados hoy</Text>
          <Text style={styles.meta}>{history.length}</Text>
        </View>
        {history.map((item) => {
          const findings = item.findings!;
          const response = item.times.arrival ? minutesAgo(item.times.assigned) - minutesAgo(item.times.arrival) : null;
          const recl = findings.triage !== item.level;
          return (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <View style={styles.historyIdentity}><TriageBadge level={item.level} compact /><View><Text style={styles.queueTitle}>{item.type}</Text><Text style={styles.queueMeta}>{item.id} · {item.comuna}</Text></View></View>
                <Text style={styles.meta}>{timeLabel(item.times.closed)}</Text>
              </View>
              <View style={styles.historyStats}>
                <View><Text style={styles.historyStat}>{response ?? '–'} min</Text><Text style={styles.historyStatLabel}>Llegada</Text></View>
                <View><Text style={styles.historyStat}>{minutesAgo(item.times.assigned) - minutesAgo(item.times.closed)} min</Text><Text style={styles.historyStatLabel}>Servicio total</Text></View>
                <View><Text style={styles.historyStat}>{item.transfer ? 'Sí' : 'No'}</Text><Text style={styles.historyStatLabel}>Traslado</Text></View>
              </View>
              <View style={styles.chips}>
                {!!findings.impression && <View style={styles.chip}><Text style={styles.chipText}>{findings.impression}</Text></View>}
                {!!findings.outcome && <View style={styles.chip}><Text style={styles.chipText}>{findings.outcome}</Text></View>}
                {recl && <View style={[styles.chip, styles.warningChip]}><Text style={[styles.chipText, styles.warningChipText]}>Triage {roman[item.level]} → {roman[findings.triage!]}</Text></View>}
                {findings.procedures.map((procedure) => <View key={procedure} style={styles.chipMuted}><Text style={styles.chipMutedText}>{procedure}</Text></View>)}
              </View>
              {!!findings.observations && <Text style={styles.historyObservations}>{findings.observations}</Text>}
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar style="light" />
      {renderHeader()}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {view === 'service' && renderService()}
        {view === 'queue' && renderQueue()}
        {view === 'history' && renderHistory()}
        <Text style={styles.footer}>Prototipo con datos ficticios. Sin nombres, documentos ni direcciones de pacientes.</Text>
      </ScrollView>

      <View style={styles.bottomNav}>
        {([
          ['service', 'Mi servicio'],
          ['queue', `Cola${queueBadge ? ` ${queueBadge}` : ''}`],
          ['history', 'Terminados'],
        ] as [ViewName, string][]).map(([key, label]) => (
          <Pressable key={key} style={styles.navItem} onPress={() => setView(key)}>
            <Text style={[styles.navIcon, view === key && styles.navIconSelected]}>{key === 'service' ? '♥' : key === 'queue' ? '≡' : '✓'}</Text>
            <Text style={[styles.navText, view === key && styles.navTextSelected]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {!!toast && <View style={styles.toast}><Text style={styles.toastText}>{toast}</Text></View>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: theme.bg },
  header: { backgroundColor: theme.navy, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: '#fff', fontSize: 19, fontWeight: '800' },
  unitBlock: { alignItems: 'flex-end' },
  unitCode: { color: '#fff', fontSize: 15, fontWeight: '800' },
  unitMeta: { color: '#D7E5F4', fontSize: 12 },
  availability: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', marginTop: 8, borderRadius: 999, backgroundColor: 'rgba(255,255,255,.14)', paddingHorizontal: 12, paddingVertical: 5, gap: 6 },
  available: { backgroundColor: 'rgba(91,224,160,.18)' },
  statusDot: { width: 9, height: 9, borderRadius: 999 },
  statusDotBusy: { backgroundColor: '#FFC24B' },
  statusDotFree: { backgroundColor: '#5BE0A0' },
  availabilityText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  content: { flex: 1 },
  contentContainer: { padding: 14, paddingBottom: 100 },
  card: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, borderRadius: 14, padding: 16, marginBottom: 12 },
  cardTitle: { color: theme.text, fontSize: 22, lineHeight: 27, fontWeight: '800' },
  sectionTitle: { color: theme.text, fontSize: 16, fontWeight: '800', marginBottom: 10 },
  meta: { color: theme.muted, fontSize: 14 },
  triage: { minWidth: 40, height: 30, borderRadius: 7, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  triageCompact: { minWidth: 40 },
  triage1: { backgroundColor: theme.u1Soft }, triage2: { backgroundColor: theme.u2Soft }, triage3: { backgroundColor: theme.u3Soft },
  triageText: { fontSize: 14, fontWeight: '800' }, triageText1: { color: theme.u1 }, triageText2: { color: theme.u2 }, triageText3: { color: theme.u3 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  chip: { backgroundColor: theme.accentSoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  warningChip: { backgroundColor: theme.u1Soft }, chipText: { color: theme.accent, fontSize: 12.5, fontWeight: '700' }, warningChipText: { color: theme.u1 },
  chipMuted: { backgroundColor: theme.border, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }, chipMutedText: { color: theme.text, fontSize: 12.5, fontWeight: '700' },
  serviceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  serviceTitle: { color: theme.text, fontSize: 22, lineHeight: 27, fontWeight: '800', marginTop: 8, marginBottom: 2 },
  primaryButton: { width: '100%', minHeight: 58, borderRadius: 12, backgroundColor: theme.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: '800' }, successButton: { backgroundColor: theme.u3 },
  secondaryButton: { width: '100%', minHeight: 52, borderRadius: 12, borderWidth: 2, borderColor: theme.border, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center', marginTop: 10, paddingHorizontal: 16 },
  secondaryButtonText: { color: theme.text, fontSize: 16, fontWeight: '700' },
  waitingRule: { backgroundColor: theme.u2Soft, borderRadius: 10, padding: 12, marginBottom: 12 }, waitingTitle: { color: theme.u2, fontWeight: '800' }, waitingCopy: { color: theme.text, fontSize: 14 }, waitingTimer: { color: theme.text, fontSize: 34, fontWeight: '800', marginTop: 4 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: theme.border, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center' },
  stepDone: { backgroundColor: theme.u3, borderColor: theme.u3 }, stepNow: { backgroundColor: theme.accent, borderColor: theme.accent }, stepSkipped: { opacity: 0.45 },
  stepCircleText: { color: theme.muted, fontSize: 13, fontWeight: '800' }, stepCircleTextActive: { color: '#fff' },
  stepCopy: { flex: 1, marginLeft: 10, paddingTop: 2 }, stepLabel: { color: theme.text, fontSize: 15, fontWeight: '700' }, stepDescription: { color: theme.muted, fontSize: 12.5 }, stepSkippedText: { opacity: 0.45 }, stepTime: { color: theme.muted, fontSize: 13, paddingTop: 4 },
  legend: { color: theme.text, fontSize: 15, fontWeight: '800', marginTop: 16, marginBottom: 8 }, optional: { color: theme.muted, fontWeight: '500' },
  vitals: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, vitalField: { width: '31%', gap: 3 }, vitalLabel: { color: theme.muted, fontSize: 12.5 }, input: { height: 48, borderWidth: 1.5, borderColor: theme.border, borderRadius: 10, backgroundColor: theme.field, paddingHorizontal: 10, color: theme.text, fontSize: 18, fontWeight: '700' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, outcomes: { flexDirection: 'column', gap: 8 },
  option: { minHeight: 44, borderWidth: 1.5, borderColor: theme.border, borderRadius: 10, backgroundColor: theme.field, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14, paddingVertical: 8 },
  optionSelected: { borderColor: theme.accent, backgroundColor: theme.accentSoft }, optionText: { color: theme.text, fontSize: 14.5, fontWeight: '700' }, optionTextSelected: { color: theme.accent },
  triageNote: { fontSize: 13.5, marginTop: 8, fontWeight: '700' }, triageMatch: { color: theme.u3 }, triageMismatch: { color: theme.u2 },
  textarea: { minHeight: 90, borderWidth: 1.5, borderColor: theme.border, borderRadius: 10, backgroundColor: theme.field, padding: 10, color: theme.text, fontSize: 15, textAlignVertical: 'top' }, hint: { color: theme.muted, fontSize: 12.5, marginTop: 6, marginBottom: 12 }, error: { color: theme.u1, fontSize: 13.5, fontWeight: '700', marginBottom: 8 },
  queueHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10 }, queueHelp: { marginBottom: 10 },
  filters: { flexDirection: 'row', gap: 6, marginBottom: 10 }, filter: { borderWidth: 1.5, borderColor: theme.border, backgroundColor: theme.card, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 }, filterSelected: { backgroundColor: theme.navy, borderColor: theme.navy }, filterText: { color: theme.text, fontSize: 13.5, fontWeight: '700' }, filterTextSelected: { color: '#fff' },
  queueItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 12, marginBottom: 8 }, queueItemMine: { borderWidth: 2, borderColor: theme.accent, backgroundColor: theme.accentSoft }, queueCopy: { flex: 1 }, queueTitle: { color: theme.text, fontSize: 15.5, fontWeight: '800' }, queueMeta: { color: theme.muted, fontSize: 13 }, queueWait: { alignItems: 'flex-end' }, queueWaitValue: { color: theme.text, fontSize: 17, fontWeight: '800' }, queueWaitLate: { color: theme.u1 },
  queueTag: { alignSelf: 'flex-start', marginTop: 4, borderRadius: 6, backgroundColor: theme.border, paddingHorizontal: 7, paddingVertical: 2 }, queueTagMine: { backgroundColor: theme.accent }, queueTagPending: { backgroundColor: theme.u2Soft }, queueTagText: { color: theme.muted, fontSize: 12, fontWeight: '800' }, queueTagTextMine: { color: '#fff' }, queueTagTextPending: { color: theme.u2 },
  empty: { alignItems: 'center', paddingVertical: 26 }, emptyCard: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, borderRadius: 14, padding: 28, alignItems: 'center' },
  historyCard: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 14, marginBottom: 10 }, historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, historyIdentity: { flexDirection: 'row', alignItems: 'center', gap: 10 }, historyStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }, historyStat: { color: theme.text, fontSize: 16, fontWeight: '800' }, historyStatLabel: { color: theme.muted, fontSize: 12 }, historyObservations: { color: theme.text, fontSize: 14, marginTop: 8 },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 78, flexDirection: 'row', backgroundColor: theme.card, borderTopWidth: 1, borderTopColor: theme.border, paddingBottom: 10 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' }, navIcon: { color: theme.muted, fontSize: 21, lineHeight: 24, fontWeight: '800' }, navIconSelected: { color: theme.accent }, navText: { color: theme.muted, fontSize: 12.5, fontWeight: '700', marginTop: 2 }, navTextSelected: { color: theme.accent },
  footer: { color: theme.muted, fontSize: 12, textAlign: 'center', paddingHorizontal: 16, marginTop: 8 },
  toast: { position: 'absolute', left: 16, right: 16, bottom: 92, backgroundColor: theme.navy, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12 }, toastText: { color: '#fff', fontSize: 14.5, textAlign: 'center' },
});
