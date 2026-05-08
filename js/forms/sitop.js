(function () {
  const { byId, value, formatDateBR, todayDateInput } = window.OpsUtils;
  let attachAutoHandlers = () => {};
  let updateOutput = () => {};

  function setCallbacks(callbacks = {}) {
    attachAutoHandlers = callbacks.attachAutoHandlers || attachAutoHandlers;
    updateOutput = callbacks.updateOutput || updateOutput;
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

  function addNpt(data = {}) {
    const container = byId('sitop_npt_list');
    if (!container) return;

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
    if (!container) return;

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

  function buildOutput() {
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

  function initialiseDefaults() {
    const data = byId('sitop_data');
    if (data && !data.value.trim()) data.value = todayDateInput();
    if (byId('sitop_npt_list') && !byId('sitop_npt_list').children.length) addNpt();
    if (byId('sitop_incident_list') && !byId('sitop_incident_list').children.length) addIncident();
  }

  function clearBodyLists() {
    if (byId('sitop_npt_list')) byId('sitop_npt_list').innerHTML = '';
    if (byId('sitop_incident_list')) byId('sitop_incident_list').innerHTML = '';
    addNpt();
    addIncident();
  }

  window.OpsFormsModules = window.OpsFormsModules || {};
  window.OpsFormsModules.sitop = {
    setCallbacks,
    addNpt,
    addIncident,
    collectNpts,
    collectIncidents,
    buildOutput,
    initialiseDefaults,
    clearBodyLists
  };
})();
