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

  function addPreventiva(data = {}) {
    addActivityItem(
      'sup_preventivas_list',
      'supervisor-preventiva-item',
      'sup_preventiva_text',
      'Preventiva prevista/executada + status',
      'Ex.: Preventiva do top drive prevista para o turno; executada inspeção de cabos; pendente apoio da manutenção.',
      data
    );
  }

  function addFalha(data = {}) {
    addActivityItem(
      'sup_falhas_list',
      'supervisor-falha-item',
      'sup_falha_text',
      'Falha detectada + equipamento + impacto + status',
      'Ex.: Falha em sensor da bomba 1; impacto na confiabilidade da leitura; manutenção acionada; pendente teste funcional.',
      data
    );
  }

  function addSubstituicao(data = {}) {
    const container = byId('sup_substituicoes_list');
    if (!container) return;

    const item = document.createElement('div');
    item.className = 'dynamic-item supervisor-substituicao-item';

    const row = document.createElement('div');
    row.className = 'grid two';

    const tipoWrap = document.createElement('label');
    const tipoSpan = document.createElement('span');
    const tipo = document.createElement('select');
    tipoSpan.textContent = 'Tipo de substituição';
    tipo.className = 'sup_sub_tipo';
    tipo.dataset.form = 'sitopSupervisor';
    tipo.dataset.group = 'body';
    ['', 'Camisa de bomba', 'Pistão de bomba', 'Tela de peneira', 'Outro'].forEach(optText => {
      const opt = document.createElement('option');
      opt.value = optText;
      opt.textContent = optText || 'Selecione...';
      tipo.appendChild(opt);
    });
    tipo.value = data.tipo || '';
    tipoWrap.append(tipoSpan, tipo);

    const equipamentoWrap = createInputWrap('Bomba / peneira / equipamento', 'input', 'sup_sub_equipamento', data.equipamento || '');
    const statusWrap = createInputWrap('Status', 'input', 'sup_sub_status', data.status || '');
    const psvWrap = createInputWrap('PSV / pop-off informada após troca de camisa', 'input', 'sup_sub_psv', data.psv || '');
    const descWrap = createTextareaWrap('Descrição da substituição / observação', 'sup_sub_desc', data.desc || '', 'Ex.: Substituídas camisas da bomba 1 de 6.1/2” para 6”; PSV alterada/confirmada em XXXX psi.');

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'danger';
    removeBtn.textContent = 'Remover';
    removeBtn.addEventListener('click', () => {
      item.remove();
      updateOutput();
    });

    row.append(tipoWrap, equipamentoWrap, statusWrap, psvWrap);
    item.append(row, descWrap, removeBtn);
    container.appendChild(item);

    attachAutoHandlers(item);
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

  function collectPreventivas() {
    return collectActivityList('.supervisor-preventiva-item', '.sup_preventiva_text');
  }

  function collectFalhas() {
    return collectActivityList('.supervisor-falha-item', '.sup_falha_text');
  }

  function collectSubstituicoes() {
    return [...document.querySelectorAll('.supervisor-substituicao-item')].map(item => ({
      tipo: item.querySelector('.sup_sub_tipo')?.value.trim() || '',
      equipamento: item.querySelector('.sup_sub_equipamento')?.value.trim() || '',
      status: item.querySelector('.sup_sub_status')?.value.trim() || '',
      psv: item.querySelector('.sup_sub_psv')?.value.trim() || '',
      desc: item.querySelector('.sup_sub_desc')?.value.trim() || ''
    })).filter(item => item.tipo || item.equipamento || item.status || item.psv || item.desc);
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
    const preventivas = collectPreventivas();
    const falhas = collectFalhas();
    const substituicoes = collectSubstituicoes();

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

    text += `*3.1 Preventivas previstas e executadas:*
`;
    if (preventivas.length) {
      preventivas.forEach(item => {
        text += `- ${item.text}
`;
      });
    } else {
      text += `-
`;
    }

    text += `
*3.2 Falhas detectadas e status das correções:*
`;
    if (falhas.length) {
      falhas.forEach(item => {
        text += `- ${item.text}
`;
      });
    } else {
      text += `-
`;
    }

    text += `
*3.3 Substituições operacionais / componentes críticos:*
`;
    if (substituicoes.length) {
      substituicoes.forEach(item => {
        const campos = [];
        if (item.tipo) campos.push(item.tipo);
        if (item.equipamento) campos.push(item.equipamento);
        if (item.status) campos.push(`Status: ${item.status}`);
        if (item.psv) campos.push(`PSV/pop-off: ${item.psv}`);
        if (item.desc) campos.push(item.desc);
        text += `- ${campos.join(' | ') || '-'}
`;
        if ((item.tipo || '').toLowerCase().includes('camisa') && !item.psv) {
          text += `  ⚠️ Troca de camisa exige informar/confirmar modificação ou validação da PSV/pop-off.
`;
        }
      });
    } else {
      text += `-
`;
    }

    const corretivasGerais = value('sup_corretivas');
    if (corretivasGerais) {
      text += `
*3.4 Corretivas operacionais gerais:*
${corretivasGerais}
`;
    }
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
    if (byId('sup_preventivas_list')) byId('sup_preventivas_list').innerHTML = '';
    if (byId('sup_falhas_list')) byId('sup_falhas_list').innerHTML = '';
    if (byId('sup_substituicoes_list')) byId('sup_substituicoes_list').innerHTML = '';
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
    addPreventiva,
    addFalha,
    addSubstituicao,
    addPronto,
    addIncident,
    collectAtividadesPrincipais,
    collectMovimentacoesCarga,
    collectAtividadesParalelas,
    collectPreventivas,
    collectFalhas,
    collectSubstituicoes,
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
