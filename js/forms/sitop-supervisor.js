(function () {
  const { byId, value, formatDateBR, formatDateTimeBR, normalizeDateTimeInput, todayDateInput, formatListPT } = window.OpsUtils;
  let attachAutoHandlers = () => {};
  let updateOutput = () => {};

  function setCallbacks(callbacks = {}) {
    attachAutoHandlers = callbacks.attachAutoHandlers || attachAutoHandlers;
    updateOutput = callbacks.updateOutput || updateOutput;
  }

  function getTurmasValues() {
    return [...document.querySelectorAll('input[name="sup_turmas"]')]
      .filter(input => input.checked)
      .map(input => input.value);
  }

  function syncTurmasField() {
    const hidden = byId('sup_turmas_embarcadas');
    if (!hidden) return '';

    hidden.value = formatListPT(getTurmasValues());
    return hidden.value;
  }

  function getTurmasText() {
    return syncTurmasField() || '-';
  }

  function createInputWrap(labelText, tagName, className, val, inputType = 'text') {
    const label = document.createElement('label');
    const span = document.createElement('span');
    const input = document.createElement(tagName);

    span.textContent = labelText;
    if (tagName === 'input') input.type = inputType;
    input.className = className;
    input.value = val;
    input.dataset.form = 'sitopSupervisor';
    input.dataset.group = 'body';

    label.append(span, input);
    return label;
  }

  function addPronto(data = {}) {
    const container = byId('sup_prontos_list');
    if (!container) return;

    const item = document.createElement('div');
    item.className = 'dynamic-item supervisor-pronto-item';

    const row = document.createElement('div');
    row.className = 'row supervisor-pronto';

    const nomeWrap = createInputWrap('Nome do empregado', 'input', 'sup_pronto_nome', data.nome || '');
    const mitigacaoWrap = createInputWrap('Mitigação', 'input', 'sup_pronto_mitigacao', data.mitigacao || '');

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'danger';
    removeBtn.textContent = 'Remover';
    removeBtn.addEventListener('click', () => {
      item.remove();
      updateOutput();
    });

    row.append(nomeWrap, mitigacaoWrap, removeBtn);
    item.appendChild(row);
    container.appendChild(item);

    attachAutoHandlers(item);
  }

  function addIncident(data = {}) {
    const container = byId('sup_incident_list');
    if (!container) return;

    const item = document.createElement('div');
    item.className = 'dynamic-item supervisor-incident-item';

    const row = document.createElement('div');
    row.className = 'row incident';

    const descWrap = createInputWrap('Descrição breve + status', 'input', 'sup_inc_desc', data.desc || '');
    const dtWrap = createInputWrap('Data e hora do evento', 'input', 'sup_inc_datahora', normalizeDateTimeInput(data.datahora || ''), 'datetime-local');
    const reportWrap = createInputWrap('Data e hora do reporte', 'input', 'sup_inc_reporte_datahora', normalizeDateTimeInput(data.reporteDatahora || data.reportDatahora || ''), 'datetime-local');

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'danger';
    removeBtn.textContent = 'Remover';
    removeBtn.addEventListener('click', () => {
      item.remove();
      updateOutput();
    });

    row.append(descWrap, dtWrap, reportWrap, removeBtn);
    item.appendChild(row);
    container.appendChild(item);

    attachAutoHandlers(item);
  }

  function collectProntos() {
    return [...document.querySelectorAll('.supervisor-pronto-item')].map(item => ({
      nome: item.querySelector('.sup_pronto_nome').value.trim(),
      mitigacao: item.querySelector('.sup_pronto_mitigacao').value.trim()
    })).filter(item => item.nome || item.mitigacao);
  }

  function collectIncidents() {
    return [...document.querySelectorAll('.supervisor-incident-item')].map(item => ({
      desc: item.querySelector('.sup_inc_desc').value.trim(),
      datahora: item.querySelector('.sup_inc_datahora').value.trim(),
      reporteDatahora: item.querySelector('.sup_inc_reporte_datahora')?.value.trim() || ''
    })).filter(item => item.desc || item.datahora || item.reporteDatahora);
  }

  function buildProntosTable(prontos) {
    if (!prontos.length) return '';

    const lines = [
      '| Nome do empregado | Mitigação |',
      '|---|---|'
    ];

    prontos.forEach(item => {
      lines.push(`| ${item.nome || '-'} | ${item.mitigacao || '-'} |`);
    });

    return lines.join('\n');
  }

  function buildOutput() {
    const prontos = collectProntos();
    const incidents = collectIncidents();

    let text = `*SITOP DW 12h - Supervisão*\n\n`;

    text += `*Sonda:* ${value('sup_sonda') || '-'}\n`;
    text += `*Poço:* ${value('sup_poco') || '-'}\n`;
    text += `*Data:* ${formatDateBR(value('sup_data')) || '-'}\n`;
    text += `*Turno:* ${value('sup_turno') || '-'}\n`;
    text += `*Supervisor:* ${value('sup_supervisor') || '-'}\n`;
    text += `*Turmas embarcadas:* ${getTurmasText()}\n\n`;

    text += `*1. Atividades realizadas nas últimas 12h:*\n${value('sup_atividades_realizadas') || '-'}\n\n`;
    text += `*2. Atividades das próximas 12h:*\n${value('sup_atividades_proximas') || '-'}\n\n`;

    text += `*3. Equipamentos / Integridade:*\n`;
    text += `- *Preventivas Previstas e Executadas:* ${value('sup_previstas_executadas') || '-'}\n`;
    text += `- *Falhas Detectadas e Status das correções:* ${value('sup_falhas_status') || '-'}\n`;
    text += `- *Corretivas Operacionais (telas / camisas / etc):* ${value('sup_corretivas') || '-'}\n`;
    text += `- *Observações adicionais:* ${value('sup_equip_obs') || '-'}\n\n`;

    text += `*4. ESCP:*\n`;
    text += `- *Pendências:* ${value('sup_escp_pendencias') || '-'}\n`;
    text += `- *Data do último teste de ESCP:* ${formatDateBR(value('sup_escp_ultimo_teste')) || '-'}\n\n`;
    text += `*5. Pessoas / Comportamento:*\n`;
    text += `${value('sup_pessoas_comportamento') || '-'}\n`;

    const prontosTable = buildProntosTable(prontos);
    if (prontosTable) {
      text += `- *PRONTOS - Colaboradores Alterados e Ações Preventivas:*\n${prontosTable}\n`;
    }
    text += `\n`;

    text += `*6. Suporte Operacional:*\n`;
    text += `- *Falta de Materiais / Recursos logísticos:* ${value('sup_falta_materiais') || '-'}\n\n`;

    text += `*7. Incidentes / Acidentes:*\n`;
    if (!incidents.length) {
      text += `-\n`;
    } else {
      incidents.forEach(inc => {
        text += `${inc.desc || '-'} - ${formatDateTimeBR(inc.datahora) || '-'} - Reportado em: ${formatDateTimeBR(inc.reporteDatahora) || '-'}\n`;
      });
    }
    text += `\n`;
    text += `*8. Observações Relevantes:*\n${value('sup_observacoes') || '-'}`;

    return text.trim();
  }

  function initialiseDefaults() {
    const data = byId('sup_data');
    if (data && !data.value.trim()) data.value = todayDateInput();
    if (byId('sup_incident_list') && !byId('sup_incident_list').children.length) addIncident();
  }

  function clearBodyLists() {
    if (byId('sup_prontos_list')) byId('sup_prontos_list').innerHTML = '';
    if (byId('sup_incident_list')) byId('sup_incident_list').innerHTML = '';
    addIncident();
  }

  function attachTurmasHandlers() {
    const updateAfterCheckboxToggle = () => {
      syncTurmasField();
      updateOutput();
    };

    document.querySelectorAll('input[name="sup_turmas"]').forEach(input => {
      input.removeEventListener('input', updateAfterCheckboxToggle);
      input.removeEventListener('change', updateAfterCheckboxToggle);
      input.addEventListener('input', updateAfterCheckboxToggle);
      input.addEventListener('change', updateAfterCheckboxToggle);
    });

    const container = document.querySelector('.turmas-checks');
    if (container && !container.dataset.turmasHandlerAttached) {
      container.dataset.turmasHandlerAttached = 'true';
      container.addEventListener('click', event => {
        if (event.target.closest('label')) {
          setTimeout(updateAfterCheckboxToggle, 0);
        }
      });
    }
  }

  window.OpsFormsModules = window.OpsFormsModules || {};
  window.OpsFormsModules.sitopSupervisor = {
    setCallbacks,
    addPronto,
    addIncident,
    collectProntos,
    collectIncidents,
    buildOutput,
    initialiseDefaults,
    clearBodyLists,
    getTurmasValues,
    syncTurmasField,
    attachTurmasHandlers
  };
})();
