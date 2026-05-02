const STORAGE_KEY = 'formularios-operacionais-github-v3';
const PREFS_KEY = 'formularios-operacionais-preferencias-v1';

const RIGS = ['PR-21', 'PR-14'];

const PHASES = ['26"', '17 1/2"', '12 1/4"', '8 1/2"', 'Outro'];

const ACTIVITIES = [
  'Perfuração',
  'Manobra',
  'Circulação',
  'Condicionamento',
  'Descida de revestimento',
  'Cimentação',
  'Perfilagem',
  'Teste de BOP',
  'Movimentação de cargas',
  'Manutenção',
  'Espera',
  'Outro'
];

const EVENT_CATEGORIES = [
  'Segurança',
  'Operacional',
  'Manutenção',
  'Logística',
  'Qualidade',
  'Tempo',
  'Custo',
  'Dados / Comunicação',
  'Fornecedor',
  'Planejamento',
  'Equipamento'
];

const EVENT_IMPACTS = [
  'Sem impacto relevante',
  'Risco de segurança',
  'NPT / perda de tempo',
  'Retrabalho',
  'Custo adicional',
  'Risco ao poço',
  'Risco ao equipamento',
  'Qualidade de dados',
  'Atraso logístico',
  'Exposição operacional',
  'Outro'
];

const EVENT_APPLICABLE_TO = [
  'Próxima fase',
  'Próximo poço',
  'Mesmo poço',
  'Equipe de sonda',
  'Fiscalização',
  'Engenharia',
  'Manutenção',
  'Fornecedor',
  'Logística',
  'Planejamento',
  'Contratada',
  'Não aplicável'
];

const CRITICALITY = ['Baixa', 'Média', 'Alta', 'Crítica'];

const CRITICALITY_COLORS = {
  Baixa: '#56d364',
  Média: '#ffc457',
  Alta: '#ff8b4c',
  Crítica: '#ff6b6b'
};

const CRITICALITY_EMOJIS = {
  Baixa: '🟢',
  Média: '🟡',
  Alta: '🟠',
  Crítica: '🔴'
};

const outputText = document.getElementById('outputText');
const saveStatus = document.getElementById('saveStatus');
const copyFeedback = document.getElementById('copyFeedback');

function byId(id) {
  return document.getElementById(id);
}

function value(id) {
  const el = byId(id);
  return el ? el.value.trim() : '';
}

function setValue(id, val) {
  const el = byId(id);
  if (el) el.value = val || '';
}

function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY)) || {};
  } catch {
    return {};
  }
}

function savePrefs(prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

function getRigFieldIds() {
  return ['sitop_sonda', 'desvio_sonda', 'evento_rig'];
}

function getWellFieldIds() {
  return ['sitop_poco', 'desvio_poco', 'evento_well'];
}

function getCurrentRigValue() {
  for (const id of getRigFieldIds()) {
    const val = value(id);
    if (val) return val;
  }
  return '';
}

function getCurrentWellValue() {
  for (const id of getWellFieldIds()) {
    const val = value(id);
    if (val) return val;
  }
  return '';
}

function updatePrefsFromFields() {
  const prefs = loadPrefs();
  const rig = getCurrentRigValue();
  const well = getCurrentWellValue();

  if (rig) prefs.lastRig = rig;
  if (well) prefs.lastWell = well;

  savePrefs(prefs);
}

function applyPrefsToEmptyHeaderFields() {
  const prefs = loadPrefs();

  if (prefs.lastRig) {
    getRigFieldIds().forEach(id => {
      if (byId(id) && !value(id)) setValue(id, prefs.lastRig);
    });
  }

  if (prefs.lastWell) {
    getWellFieldIds().forEach(id => {
      if (byId(id) && !value(id)) setValue(id, prefs.lastWell);
    });
  }
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function todayDateInput() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function nowTimeInput() {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function nowDateTimeInput() {
  return `${todayDateInput()}T${nowTimeInput()}`;
}

function formatDateBR(dateValue) {
  if (!dateValue) return '';
  const [year, month, day] = dateValue.split('-');
  if (!year || !month || !day) return dateValue;
  return `${day}/${month}/${year}`;
}

function formatDateTimeBR(value) {
  if (!value) return '';
  const [date, time] = value.split('T');
  return `${formatDateBR(date)} ${time || ''}`.trim();
}

function getActiveFormType() {
  const checked = document.querySelector('input[name="formType"]:checked');
  return checked ? checked.value : 'sitop';
}

function setActiveFormType(type) {
  document.querySelectorAll('input[name="formType"]').forEach(input => {
    input.checked = input.value === type;
  });
}

function switchForm(type) {
  document.querySelectorAll('.form-view').forEach(view => view.classList.add('hidden'));
  byId(`${type}Form`).classList.remove('hidden');
  updateOutput();
}

function fillSelect(selectId, items) {
  const select = byId(selectId);
  select.innerHTML = '';

  const empty = document.createElement('option');
  empty.value = '';
  empty.textContent = 'Selecione...';
  select.appendChild(empty);

  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

function fillCheckboxGroup(containerId, name, items, groupName) {
  const container = byId(containerId);
  container.innerHTML = '';

  items.forEach(item => {
    const label = document.createElement('label');
    const input = document.createElement('input');

    input.type = 'checkbox';
    input.name = name;
    input.value = item;
    input.dataset.form = 'evento';
    input.dataset.group = groupName;

    const span = document.createElement('span');
    span.textContent = item;

    label.append(input, span);
    container.appendChild(label);
  });
}

function getRadioValue(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : '';
}

function getCheckedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value);
}

function optionalLine(label, content) {
  if (!content) return '';
  return `${label}: ${content}`;
}

function optionalBlock(title, content) {
  if (!content) return '';
  return `${title}\n${content}`;
}

function addNpt(data = {}) {
  const container = byId('sitop_npt_list');
  const item = document.createElement('div');
  item.className = 'dynamic-item npt-item';

  const row = document.createElement('div');
  row.className = 'row';

  const descWrap = createInputWrap('Descrição', 'input', 'npt_desc', data.desc || '');
  const dtWrap = createInputWrap('Data e hora', 'input', 'npt_datahora', data.datahora || '');
  const hrsWrap = createInputWrap('Horas', 'input', 'npt_horas', data.horas || '');

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'danger';
  removeBtn.textContent = 'Remover';
  removeBtn.addEventListener('click', () => {
    item.remove();
    updateOutput();
  });

  row.append(descWrap, dtWrap, hrsWrap, removeBtn);
  item.appendChild(row);
  container.appendChild(item);

  attachAutoHandlers(item);
}

function addIncident(data = {}) {
  const container = byId('sitop_incident_list');
  const item = document.createElement('div');
  item.className = 'dynamic-item incident-item';

  const row = document.createElement('div');
  row.className = 'row incident';

  const descWrap = createInputWrap('Descrição breve + status', 'input', 'inc_desc', data.desc || '');
  const dtWrap = createInputWrap('Data e hora', 'input', 'inc_datahora', data.datahora || '');

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'danger';
  removeBtn.textContent = 'Remover';
  removeBtn.addEventListener('click', () => {
    item.remove();
    updateOutput();
  });

  row.append(descWrap, dtWrap, removeBtn);
  item.appendChild(row);
  container.appendChild(item);

  attachAutoHandlers(item);
}

function createInputWrap(labelText, type, className, val) {
  const label = document.createElement('label');
  const span = document.createElement('span');
  const input = document.createElement(type);

  span.textContent = labelText;
  input.className = className;
  input.value = val;
  input.dataset.form = 'sitop';
  input.dataset.group = 'body';

  label.append(span, input);
  return label;
}

function collectNpts() {
  return [...document.querySelectorAll('.npt-item')].map(item => ({
    desc: item.querySelector('.npt_desc').value.trim(),
    datahora: item.querySelector('.npt_datahora').value.trim(),
    horas: item.querySelector('.npt_horas').value.trim()
  })).filter(item => item.desc || item.datahora || item.horas);
}

function collectIncidents() {
  return [...document.querySelectorAll('.incident-item')].map(item => ({
    desc: item.querySelector('.inc_desc').value.trim(),
    datahora: item.querySelector('.inc_datahora').value.trim()
  })).filter(item => item.desc || item.datahora);
}

function buildSitopOutput() {
  const npts = collectNpts();
  const incidents = collectIncidents();

  let text = `*SITOP DW 12h - Fiscalização*\n\n`;

  text += `*Sonda:* ${value('sitop_sonda') || '-'}\n`;
  text += `*Poço:* ${value('sitop_poco') || '-'}\n`;
  text += `*Data:* ${formatDateBR(value('sitop_data')) || '-'}\n`;
  text += `*Turno:* ${value('sitop_turno') || '-'}\n`;
  text += `*Fiscal:* ${value('sitop_fiscal') || '-'}\n\n`;

  text += `*1. Situação do Projeto:*\n${value('sitop_situacao') || '-'}\n\n`;
  text += `*2. Próximas 12h:*\n${value('sitop_proximas') || '-'}\n\n`;
  text += `*3. Desempenho vs Programa:*\n${value('sitop_desempenho') || '-'}\n\n`;

  text += `*4. NPT do projeto:*\n`;
  if (!npts.length) {
    text += `-\n`;
  } else {
    npts.forEach(npt => {
      text += `${npt.desc || '-'} - ${npt.datahora || '-'} - ${npt.horas || '-'}\n`;
    });
  }

  text += `*Total NPT:* ${value('sitop_npt_total') || '-'}\n\n`;

  text += `*5. Incidentes / Acidentes:*\n`;
  if (!incidents.length) {
    text += `-\n`;
  } else {
    incidents.forEach(inc => {
      text += `${inc.desc || '-'} - ${inc.datahora || '-'}\n`;
    });
  }

  text += `*Total NPT associado:* ${value('sitop_inc_total_npt') || '-'}\n\n`;
  text += `*6. Observações Relevantes:*\n${value('sitop_observacoes') || '-'}`;

  return text.trim();
}

function buildDesvioOutput() {
  const setor = getCheckedValues('desvio_setor');
  const regras = getCheckedValues('desvio_regraOuro');

  let text = `⚠️ *CAÇA-DESVIO*\n\n`;

  text += `• *Sonda:* ${value('desvio_sonda') || '-'}\n`;
  text += `• *Poço:* ${value('desvio_poco') || '-'}\n`;
  text += `• *Área / Sistema:* ${value('desvio_areaSistema') || '-'}\n`;
  text += `• *Data / Hora:* ${formatDateTimeBR(value('desvio_dataHora')) || '-'}\n\n`;

  text += `*Desvio identificado:*\n${value('desvio_desvio') || '-'}\n\n`;
  text += `*Risco associado:*\n${value('desvio_risco') || '-'}\n\n`;
  text += `*Ação imediata tomada:*\n${value('desvio_acao') || '-'}\n\n`;
  text += `*Status atual:*\n${getRadioValue('desvio_status') || '-'}\n\n`;
  text += `*Setor responsável pela correção:*\n${setor.length ? setor.join(' / ') : '-'}\n\n`;
  text += `*Classificação do desvio:*\n${getRadioValue('desvio_classificacao') || '-'}\n\n`;
  text += `*Regra de Ouro:*\n${regras.length ? regras.join(' / ') : '-'}\n\n`;
  text += `*Sugestão de Criticidade:*\n${getRadioValue('desvio_criticidade') || '-'}\n\n`;
  text += `*Evidência:*\n${value('desvio_evidencia') || 'Enviar após a mensagem, se aplicável.'}`;

  return text.trim();
}

function currentEventCriticality() {
  const index = Number(value('evento_criticality') || 0);
  return CRITICALITY[index] || 'Baixa';
}

function formattedEventCriticality() {
  const crit = currentEventCriticality();
  const emoji = CRITICALITY_EMOJIS[crit] || '🟢';
  return `${emoji} *${crit.toUpperCase()}*`;
}

function updateEventCriticalityVisual() {
  const crit = currentEventCriticality();
  const color = CRITICALITY_COLORS[crit] || CRITICALITY_COLORS.Baixa;
  byId('evento_criticality').style.setProperty('--criticality-color', color);
}

function toggleEventTimeFields() {
  const mode = getRadioValue('evento_timeMode');
  byId('evento_fixedTimeFields').classList.toggle('hidden', mode !== 'fixed');
  byId('evento_rangeTimeFields').classList.toggle('hidden', mode !== 'range');
}

function toggleEventActionField() {
  const mode = getRadioValue('evento_actionTakenMode');
  byId('evento_actionTextWrap').classList.toggle('hidden', mode !== 'yes');
}

function buildEventTimeText() {
  const mode = getRadioValue('evento_timeMode');

  if (mode === 'none') {
    return '📅 Tempo: Sem vínculo específico de data/hora — registro associado ao poço.';
  }

  if (mode === 'range') {
    const start = `${formatDateBR(value('evento_startDate'))} ${value('evento_startTime')}`.trim();
    const end = `${formatDateBR(value('evento_endDate'))} ${value('evento_endTime')}`.trim();

    if (start && end) return `📅 Período: ${start} até ${end}`;
    if (start) return `📅 Início: ${start}`;
    if (end) return `📅 Fim: ${end}`;
    return '';
  }

  const lines = [];
  if (value('evento_eventDate')) lines.push(`📅 Data: ${formatDateBR(value('evento_eventDate'))}`);
  if (value('evento_eventTime')) lines.push(`🕒 Hora: ${value('evento_eventTime')}`);
  return lines.join('\n');
}

function buildEventActionText() {
  const mode = getRadioValue('evento_actionTakenMode');

  if (mode === 'yes') {
    const action = value('evento_actionTaken');
    return action ? `🛠️ *Ação tomada:*\n${action}` : '🛠️ *Ação tomada:*\nSim, porém sem descrição preenchida.';
  }

  if (mode === 'no') return '🛠️ *Ação tomada:*\nNão.';
  if (mode === 'na') return '🛠️ *Ação tomada:*\nNão aplicável.';

  return '';
}

function buildEventoOutput() {
  const recordType = value('evento_recordType') || 'Evento operacional';
  const categories = getCheckedValues('evento_categories').join('; ');
  const impacts = getCheckedValues('evento_impacts').join('; ');
  const applicable = getCheckedValues('evento_applicableTo').join('; ');

  const headerLines = [
    `📌 *REGISTRO OPERACIONAL — ${recordType.toUpperCase()}*`,
    '',
    optionalLine('🛢️ *Poço*', value('evento_well')),
    optionalLine('🏗️ *Sonda*', value('evento_rig')),
    optionalLine('📍 *Área*', value('evento_area')),
    optionalLine('🧱 *Fase*', value('evento_phase')),
    optionalLine('⚙️ *Atividade*', value('evento_activity')),
    optionalLine('🏷️ *Categoria*', categories),
    `🚦 *Criticidade*: ${formattedEventCriticality()}`
  ].filter(Boolean);

  const timeText = buildEventTimeText();
  const person = optionalLine('👤 *Registrado por*', value('evento_registeredBy'));

  const impactParts = [];
  if (impacts) impactParts.push(impacts);
  if (value('evento_impactDetail')) impactParts.push(value('evento_impactDetail'));

  const bodyBlocks = [
    timeText,
    person,
    optionalBlock('🔎 *Evento observado:*', value('evento_eventDescription')),
    optionalBlock('⚠️ *Impacto observado ou potencial:*', impactParts.join('\n')),
    buildEventActionText(),
    optionalBlock('🧠 *Lição aprendida:*', value('evento_lessonLearned')),
    optionalBlock('✅ *Recomendação prática:*', value('evento_recommendation')),
    optionalBlock('🔁 *Aplicável a:*', [applicable, value('evento_applicableDetail')].filter(Boolean).join('\n'))
  ].filter(Boolean);

  return [...headerLines, '', ...bodyBlocks].join('\n').trim();
}

function buildOutput() {
  const type = getActiveFormType();
  if (type === 'sitop') return buildSitopOutput();
  if (type === 'desvio') return buildDesvioOutput();
  return buildEventoOutput();
}

function updateOutput() {
  toggleEventTimeFields();
  toggleEventActionField();
  updateEventCriticalityVisual();
  updatePrefsFromFields();
  outputText.textContent = buildOutput();
  saveState();
}

function collectState() {
  const state = {
    activeFormType: getActiveFormType(),
    npts: collectNpts(),
    incidents: collectIncidents(),
    fields: {}
  };

  document.querySelectorAll('input, select, textarea').forEach(el => {
    if (el.name === 'formType') return;

    if (el.type === 'checkbox') {
      if (!state.fields[el.name]) state.fields[el.name] = [];
      if (el.checked) state.fields[el.name].push(el.value);
      return;
    }

    if (el.type === 'radio') {
      if (el.checked) state.fields[el.name] = el.value;
      return;
    }

    if (el.id) state.fields[el.id] = el.value;
  });

  return state;
}

function applyState(state) {
  if (!state || typeof state !== 'object') return;

  setActiveFormType(state.activeFormType || 'sitop');

  document.querySelectorAll('input, select, textarea').forEach(el => {
    if (el.name === 'formType') return;

    if (el.type === 'checkbox') {
      el.checked = Array.isArray(state.fields?.[el.name]) && state.fields[el.name].includes(el.value);
      return;
    }

    if (el.type === 'radio') {
      el.checked = state.fields?.[el.name] === el.value;
      return;
    }

    if (el.id && Object.prototype.hasOwnProperty.call(state.fields || {}, el.id)) {
      el.value = state.fields[el.id];
    }
  });

  byId('sitop_npt_list').innerHTML = '';
  byId('sitop_incident_list').innerHTML = '';

  (state.npts || []).forEach(addNpt);
  (state.incidents || []).forEach(addIncident);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collectState()));
  saveStatus.textContent = 'Salvo localmente';
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;

  try {
    applyState(JSON.parse(raw));
    return true;
  } catch {
    return false;
  }
}

function clearCurrent(group) {
  const type = getActiveFormType();

  document.querySelectorAll(`[data-form="${type}"][data-group="${group}"]`).forEach(el => {
    if (el.type === 'checkbox' || el.type === 'radio') {
      el.checked = false;
      return;
    }

    el.value = '';
  });

  if (type === 'sitop' && group === 'body') {
    byId('sitop_npt_list').innerHTML = '';
    byId('sitop_incident_list').innerHTML = '';
    addNpt();
    addIncident();
  }

  if (type === 'evento') {
    if (group === 'header') {
      initialiseEventDefaults(false);
      applyPrefsToEmptyHeaderFields();
    }
    if (group === 'body') {
      byId('evento_criticality').value = '0';
      document.querySelector('input[name="evento_actionTakenMode"][value="omit"]').checked = true;
    }
  }

  updateOutput();
}

function clearCurrentAll() {
  clearCurrent('header');
  clearCurrent('body');

  const type = getActiveFormType();
  if (type === 'sitop') {
    byId('sitop_npt_list').innerHTML = '';
    byId('sitop_incident_list').innerHTML = '';
    addNpt();
    addIncident();
  }

  updateOutput();
}

async function copyOutput() {
  const text = outputText.textContent;

  try {
    await navigator.clipboard.writeText(text);
    copyFeedback.textContent = 'Texto copiado.';
  } catch {
    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
    copyFeedback.textContent = 'Texto copiado.';
  }

  setTimeout(() => copyFeedback.textContent = '', 2200);
}

async function openWhatsApp() {
  const text = outputText.textContent;

  await copyOutput();

  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function initialiseSitopDefaults() {
  if (!value('sitop_data')) setValue('sitop_data', todayDateInput());
  if (!byId('sitop_npt_list').children.length) addNpt();
  if (!byId('sitop_incident_list').children.length) addIncident();
}

function initialiseDesvioDefaults() {
  if (!value('desvio_dataHora')) setValue('desvio_dataHora', nowDateTimeInput());
}

function initialiseEventDefaults(onlyIfEmpty = true) {
  const setIf = (id, val) => {
    if (!onlyIfEmpty || !value(id)) setValue(id, val);
  };

  setIf('evento_eventDate', todayDateInput());
  setIf('evento_eventTime', nowTimeInput());
  setIf('evento_startDate', todayDateInput());
  setIf('evento_endDate', todayDateInput());
}

function attachAutoHandlers(root = document) {
  root.querySelectorAll('input, select, textarea').forEach(el => {
    el.removeEventListener('input', updateOutput);
    el.removeEventListener('change', updateOutput);
    el.addEventListener('input', updateOutput);
    el.addEventListener('change', updateOutput);
  });
}

function init() {
  fillSelect('sitop_sonda', RIGS);
  fillSelect('desvio_sonda', RIGS);
  fillSelect('evento_rig', RIGS);
  fillSelect('evento_phase', PHASES);
  fillSelect('evento_activity', ACTIVITIES);
  fillCheckboxGroup('evento_categoryGroup', 'evento_categories', EVENT_CATEGORIES, 'header');
  fillCheckboxGroup('evento_impactGroup', 'evento_impacts', EVENT_IMPACTS, 'body');
  fillCheckboxGroup('evento_applicableGroup', 'evento_applicableTo', EVENT_APPLICABLE_TO, 'body');

  const loaded = loadState();

  if (!loaded) {
    initialiseSitopDefaults();
    initialiseDesvioDefaults();
    initialiseEventDefaults();
    applyPrefsToEmptyHeaderFields();
  } else {
    applyPrefsToEmptyHeaderFields();
    if (!byId('sitop_npt_list').children.length) addNpt();
    if (!byId('sitop_incident_list').children.length) addIncident();
  }

  document.querySelectorAll('input[name="formType"]').forEach(input => {
    input.addEventListener('change', () => switchForm(input.value));
  });

  byId('addNptBtn').addEventListener('click', () => {
    addNpt();
    updateOutput();
  });

  byId('addIncidentBtn').addEventListener('click', () => {
    addIncident();
    updateOutput();
  });

  byId('copyTopBtn').addEventListener('click', openWhatsApp);
  byId('copyBottomBtn').addEventListener('click', openWhatsApp);
  byId('clearHeaderBtn').addEventListener('click', () => clearCurrent('header'));
  byId('clearBodyBtn').addEventListener('click', () => clearCurrent('body'));
  byId('clearAllBtn').addEventListener('click', clearCurrentAll);

  attachAutoHandlers();

  switchForm(getActiveFormType());
  updateOutput();
}

init();
