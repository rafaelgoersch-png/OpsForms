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

  function createTextareaWrap(labelText, className, val, placeholder = '') {
    const label = document.createElement('label');
    const span = document.createElement('span');
    const textarea = document.createElement('textarea');

    span.textContent = labelText;
    textarea.className = className;
    textarea.value = val || '';
    textarea.rows = 2;
    textarea.placeholder = placeholder;
    textarea.dataset.form = 'sitopSupervisor';
    textarea.dataset.group = 'body';

    label.append(span, textarea);
    return label;
  }

  function addActivityItem(containerId, itemClass, inputClass, labelText, placeholder, data = {}) {
    const container = byId(containerId);
    if (!container) return;

    const item = document.createElement('div');
    item.className = `dynamic-item ${itemClass}`;

    const row = document.createElement('div');
    row.className = 'row activity-item-row';

    const textWrap = createTextareaWrap(labelText, inputClass, data.text || data.value || '', placeholder);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'danger';
    removeBtn.textContent = 'Remover';
    removeBtn.addEventListener('click', () => {
      item.remove();
      updateOutput();
    });

    row.append(textWrap, removeBtn);
    item.appendChild(row);
    container.appendChild(item);

    attachAutoHandlers(item);
  }

  function addAtividadePrincipal(data = {}) {
    addActivityItem(
      'sup_atividade_principal_list',
      'supervisor-atividade-principal-item',
      'sup_atividade_principal_text',
      'Item realizado',
      'Ex.: Movimentada broca para a área de preparação; acompanhado teste de bomba; liberada frente operacional.',
      data
    );
  }

  function addMovimentacaoCarga(data = {}) {
    addActivityItem(
      'sup_movimentacao_carga_list',
      'supervisor-movimentacao-carga-item',
      'sup_movimentacao_carga_text',
      'Item realizado',
      'Ex.: Movimentada broca; recebida carga crítica; apoio de guindaste; movimentação no catwalk.',
      data
    );
  }

  function addAtividadeParalela(data = {}) {
    addActivityItem(
      'sup_atividade_paralela_list',
      'supervisor-atividade-paralela-item',
      'sup_atividade_paralela_text',
      'Item realizado',
      'Ex.: Inspeção, organização de área, preparação de material, apoio de terceiros ou trabalho simultâneo.',
      data
    );
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

  function collectActivityList(itemSelector, inputSelector) {
    return [...document.querySelectorAll(itemSelector)]
      .map(item => item.querySelector(inputSelector)?.value.trim() || '')
      .filter(Boolean)
      .map(text => ({ text }));
  }

  function collectAtividadesPrincipais() {
    return collectActivityList('.supervisor-atividade-principal-item', '.sup_atividade_principal_text');
  }

  function collectMovimentacoesCarga() {
    return collectActivityList('.supervisor-movimentacao-carga-item', '.sup_movimentacao_carga_text');
  }

  function collectAtividadesParalelas() {
    return collectActivityList('.supervisor-atividade-paralela-item', '.sup_atividade_paralela_text');
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

    text += `*2. Atividades:*
`;

    const atividadesPrincipais = collectAtividadesPrincipais();
    const movimentacoesCarga = collectMovimentacoesCarga();
    const atividadesParalelas = collectAtividadesParalelas();
    const pessoasComportamento = value('sup_pessoas_comportamento');

    text += `
*2.1 Atividades realizadas nas últimas 12h:*
`;

    text += `*Atividade Principal:*
`;
    if (atividadesPrincipais.length) {
      atividadesPrincipais.forEach(item => {
        text += `- ${item.text}
`;
      });
    } else {
      text += `-
`;
    }

    if (movimentacoesCarga.length) {
      text += `
*Movimentação de Carga:*
`;
      movimentacoesCarga.forEach(item => {
        text += `- ${item.text}
`;
      });
    }

    if (atividadesParalelas.length) {
      text += `
*Atividades Paralelas:*
`;
      atividadesParalelas.forEach(item => {
        text += `- ${item.text}
`;
      });
    }

    if (pessoasComportamento) {
      text += `
*Pessoas / Comportamento:*
${pessoasComportamento}
`;
    }

    text += `
`;

    text += `*2.2 Atividades das próximas 12h:*
${value('sup_atividades_proximas') || '-'}

`;

    text += `*3. Equipamentos / Integridade:*
`;
    text += `- *Preventivas Previstas e Executadas:* ${value('sup_previstas_executadas') || '-'}
`;
    text += `- *Falhas Detectadas e Status das correções:* ${value('sup_falhas_status') || '-'}
`;
    text += `- *Corretivas Operacionais (telas / camisas / etc):* ${value('sup_corretivas') || '-'}
`;
    text += `
`;

    text += `*4. PRONTOS:*
`;
    const prontosTable = buildProntosTable(prontos);
    if (prontosTable) {
      text += `*PRONTOS - Colaboradores Alterados e Ações Preventivas:*\n${prontosTable}\n\n`;
    } else {
      text += `PRONTOS sem anomalia\n\n`;
    }

    text += `*5. Suporte Operacional:*\n`;
    text += `- *Falta de Materiais / Recursos logísticos:* ${value('sup_falta_materiais') || '-'}\n\n`;

    text += `*6. Incidentes / Acidentes:*\n`;
    if (!incidents.length) {
      text += `-\n`;
    } else {
      incidents.forEach(inc => {
        text += `${inc.desc || '-'} - ${formatDateTimeBR(inc.datahora) || '-'} - Reportado em: ${formatDateTimeBR(inc.reporteDatahora) || '-'}\n`;
      });
    }
    text += `\n`;
    text += `*7. Observações Relevantes:*\n${value('sup_observacoes') || '-'}`;

    return text.trim();
  }

  function initialiseDefaults() {
    const data = byId('sup_data');
    if (data && !data.value.trim()) data.value = todayDateInput();
    if (byId('sup_atividade_principal_list') && !byId('sup_atividade_principal_list').children.length) addAtividadePrincipal();
    if (byId('sup_incident_list') && !byId('sup_incident_list').children.length) addIncident();
  }

  function clearBodyLists() {
    if (byId('sup_atividade_principal_list')) byId('sup_atividade_principal_list').innerHTML = '';
    if (byId('sup_movimentacao_carga_list')) byId('sup_movimentacao_carga_list').innerHTML = '';
    if (byId('sup_atividade_paralela_list')) byId('sup_atividade_paralela_list').innerHTML = '';
    if (byId('sup_prontos_list')) byId('sup_prontos_list').innerHTML = '';
    if (byId('sup_incident_list')) byId('sup_incident_list').innerHTML = '';
    addAtividadePrincipal();
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
    addAtividadePrincipal,
    addMovimentacaoCarga,
    addAtividadeParalela,
    addPronto,
    addIncident,
    collectAtividadesPrincipais,
    collectMovimentacoesCarga,
    collectAtividadesParalelas,
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
