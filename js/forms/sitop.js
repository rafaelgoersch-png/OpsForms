(function () {
  const { byId, value, formatDateBR, formatDateTimeBR, normalizeDateTimeInput, todayDateInput } = window.OpsUtils;
  let attachAutoHandlers = () => {};
  let updateOutput = () => {};

  function setCallbacks(callbacks = {}) {
    attachAutoHandlers = callbacks.attachAutoHandlers || attachAutoHandlers;
    updateOutput = callbacks.updateOutput || updateOutput;
  }

  function createInputWrap(labelText, tagName, className, val, inputType = 'text') {
    const label = document.createElement('label');
    const span = document.createElement('span');
    const input = document.createElement(tagName);

    span.textContent = labelText;
    if (tagName === 'input') input.type = inputType;
    input.className = className;
    input.value = val;
    input.dataset.form = 'sitop';
    input.dataset.group = 'body';

    label.append(span, input);
    return label;
  }

  function createTextareaWrap(labelText, className, val, rows = 3) {
    const label = document.createElement('label');
    const span = document.createElement('span');
    const textarea = document.createElement('textarea');

    span.textContent = labelText;
    textarea.className = className;
    textarea.value = val || '';
    textarea.rows = rows;
    textarea.dataset.form = 'sitop';
    textarea.dataset.group = 'body';

    label.append(span, textarea);
    return label;
  }

  function createSelectWrap(labelText, className, val, options = []) {
    const label = document.createElement('label');
    const span = document.createElement('span');
    const select = document.createElement('select');

    span.textContent = labelText;
    select.className = className;
    select.dataset.form = 'sitop';
    select.dataset.group = 'body';

    const empty = document.createElement('option');
    empty.value = '';
    empty.textContent = 'Selecione...';
    select.appendChild(empty);

    options.forEach(optionText => {
      const option = document.createElement('option');
      option.value = optionText;
      option.textContent = optionText;
      select.appendChild(option);
    });

    select.value = val || '';
    label.append(span, select);
    return label;
  }

  function createRemoveButton(item) {
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'danger';
    removeBtn.textContent = 'Remover';
    removeBtn.addEventListener('click', () => {
      item.remove();
      updateOutput();
    });
    return removeBtn;
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

    row.append(descWrap, dtWrap, hrsWrap, createRemoveButton(item));
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
    const dtWrap = createInputWrap('Data e hora do evento', 'input', 'inc_datahora', normalizeDateTimeInput(data.datahora || ''), 'datetime-local');
    const reportWrap = createInputWrap('Data e hora do reporte', 'input', 'inc_reporte_datahora', normalizeDateTimeInput(data.reporteDatahora || data.reportDatahora || ''), 'datetime-local');

    row.append(descWrap, dtWrap, reportWrap, createRemoveButton(item));
    item.appendChild(row);
    container.appendChild(item);

    attachAutoHandlers(item);
  }

  function addEquipment(data = {}) {
    const container = byId('sitop_equipamento_list');
    if (!container) return;

    const item = document.createElement('div');
    item.className = 'dynamic-item equipamento-item';

    const row = document.createElement('div');
    row.className = 'grid two';

    row.append(
      createInputWrap('Equipamento', 'input', 'eq_nome', data.nome || ''),
      createSelectWrap('Status', 'eq_status', data.status || '', ['Pendente', 'Em acompanhamento', 'Resolvido']),
      createSelectWrap('Criticidade', 'eq_criticidade', data.criticidade || '', ['Baixa', 'Média', 'Alta', 'Crítica']),
      createInputWrap('Responsável', 'input', 'eq_responsavel', data.responsavel || ''),
      createTextareaWrap('Problema / ponto de atenção', 'eq_problema', data.problema || '', 3),
      createTextareaWrap('Impacto operacional', 'eq_impacto', data.impacto || '', 3),
      createTextareaWrap('Ação tomada', 'eq_acao', data.acao || '', 3),
      createTextareaWrap('Pendência / próxima ação', 'eq_pendencia', data.pendencia || '', 3)
    );

    item.appendChild(row);
    item.appendChild(createRemoveButton(item));
    container.appendChild(item);

    attachAutoHandlers(item);
  }

  function addRiskDecision(data = {}) {
    const container = byId('sitop_risco_decisao_list');
    if (!container) return;

    const item = document.createElement('div');
    item.className = 'dynamic-item risco-decisao-item';

    const row = document.createElement('div');
    row.className = 'grid two';

    row.append(
      createTextareaWrap('Risco / ponto de decisão', 'rd_risco', data.risco || '', 3),
      createTextareaWrap('Gatilho de mudança de plano', 'rd_gatilho', data.gatilho || '', 3),
      createTextareaWrap('Decisão pendente / decisão tomada', 'rd_decisao', data.decisao || '', 3),
      createInputWrap('Responsável', 'input', 'rd_responsavel', data.responsavel || '')
    );

    item.appendChild(row);
    item.appendChild(createRemoveButton(item));
    container.appendChild(item);

    attachAutoHandlers(item);
  }

  function addLesson(data = {}) {
    const container = byId('sitop_licao_list');
    if (!container) return;

    const item = document.createElement('div');
    item.className = 'dynamic-item licao-item';

    const row = document.createElement('div');
    row.className = 'grid two';

    row.append(
      createTextareaWrap('Lição aprendida', 'li_licao', data.licao || '', 3),
      createTextareaWrap('Aplicação prática', 'li_aplicacao', data.aplicacao || '', 3),
      createSelectWrap('Deve virar procedimento?', 'li_procedimento', data.procedimento || '', ['Sim', 'Não', 'Avaliar']),
      createInputWrap('Responsável / dono da ação', 'input', 'li_responsavel', data.responsavel || '')
    );

    item.appendChild(row);
    item.appendChild(createRemoveButton(item));
    container.appendChild(item);

    attachAutoHandlers(item);
  }


  function parseNumber(raw) {
    const text = String(raw || '').trim();
    if (!text) return null;
    const match = text.replace(/\s/g, '').match(/-?\d+(?:[.,]\d+)?/);
    if (!match) return null;
    const num = Number(match[0].replace(',', '.'));
    return Number.isFinite(num) ? num : null;
  }

  function fmtBbl(num) {
    if (num === null || num === undefined || !Number.isFinite(num)) return '';
    return `${num.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} bbl`;
  }

  function fmtStk(num) {
    if (num === null || num === undefined || !Number.isFinite(num)) return '';
    return `${Math.round(num).toLocaleString('pt-BR')} stk`;
  }

  function setCalculatedValue(id, text) {
    const el = byId(id);
    if (el) el.value = text || '';
  }

  function calculateVolumetry() {
    const bhaInternal = parseNumber(value('sitop_bha_volume_interno'));
    const bhaAnnular = parseNumber(value('sitop_bha_volume_anular'));
    const dpVolPerStand = parseNumber(value('sitop_dp_volume_por_stand'));
    const dpStands = parseNumber(value('sitop_dp_num_stands'));
    const ohMeters = parseNumber(value('sitop_oh_dp_metros'));
    const ohCapacity = parseNumber(value('sitop_oh_capacidade_bbl_m'));
    const casedMeters = parseNumber(value('sitop_cased_dp_metros'));
    const casedCapacity = parseNumber(value('sitop_cased_capacidade_bbl_m'));
    const margin = parseNumber(value('sitop_margem_operacional'));
    const pumpFactor = parseNumber(value('sitop_fator_bomba'));
    const metalPerStand = parseNumber(value('sitop_desloc_metal_por_stand'));
    const standsMoved = parseNumber(value('sitop_stands_manobrados'));

    const addValues = (...values) => {
      const valid = values.filter(v => v !== null && v !== undefined && Number.isFinite(v));
      return valid.length ? valid.reduce((sum, v) => sum + v, 0) : null;
    };

    const dpInternalTotal = dpVolPerStand !== null && dpStands !== null ? dpVolPerStand * dpStands : null;
    const volumeToBit = addValues(bhaInternal, dpInternalTotal);
    const ohVolume = ohMeters !== null && ohCapacity !== null ? ohMeters * ohCapacity : null;
    const casedVolume = casedMeters !== null && casedCapacity !== null ? casedMeters * casedCapacity : null;
    const bottomToShoe = addValues(bhaAnnular, ohVolume);
    const annularTotal = addValues(bottomToShoe, casedVolume);
    const annularTotalWithMargin = addValues(annularTotal, margin);
    const tripTank = metalPerStand !== null && standsMoved !== null ? metalPerStand * standsMoved : null;

    const strokes = vol => pumpFactor && pumpFactor > 0 && vol !== null ? vol / pumpFactor : null;

    const result = {
      dpInternalTotal,
      volumeToBit,
      ohVolume,
      casedVolume,
      bottomToShoe,
      annularTotal,
      annularTotalWithMargin,
      tripTank,
      stkToBit: strokes(volumeToBit),
      stkBottomToShoe: strokes(bottomToShoe),
      stkShoeToSurface: strokes(casedVolume),
      stkBottomToSurface: strokes(annularTotal),
      stkBottomToSurfaceMargin: strokes(annularTotalWithMargin)
    };

    setCalculatedValue('sitop_calc_dp_volume_total', fmtBbl(dpInternalTotal));
    setCalculatedValue('sitop_calc_volume_ate_broca', fmtBbl(volumeToBit));
    setCalculatedValue('sitop_calc_oh_volume', fmtBbl(ohVolume));
    setCalculatedValue('sitop_calc_cased_volume', fmtBbl(casedVolume));
    setCalculatedValue('sitop_calc_anular_total', fmtBbl(annularTotal));
    setCalculatedValue('sitop_calc_stk_ate_broca', fmtStk(result.stkToBit));
    setCalculatedValue('sitop_calc_stk_fundo_sapata', fmtStk(result.stkBottomToShoe));
    setCalculatedValue('sitop_calc_stk_sapata_superficie', fmtStk(result.stkShoeToSurface));
    setCalculatedValue('sitop_calc_stk_fundo_superficie', fmtStk(result.stkBottomToSurface));
    setCalculatedValue('sitop_calc_stk_total_margem', fmtStk(result.stkBottomToSurfaceMargin));
    setCalculatedValue('sitop_calc_trip_tank', fmtBbl(tripTank));

    return result;
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
      datahora: item.querySelector('.inc_datahora').value.trim(),
      reporteDatahora: item.querySelector('.inc_reporte_datahora')?.value.trim() || ''
    })).filter(item => item.desc || item.datahora || item.reporteDatahora);
  }

  function collectEquipments() {
    return [...document.querySelectorAll('.equipamento-item')].map(item => ({
      nome: item.querySelector('.eq_nome')?.value.trim() || '',
      status: item.querySelector('.eq_status')?.value.trim() || '',
      criticidade: item.querySelector('.eq_criticidade')?.value.trim() || '',
      responsavel: item.querySelector('.eq_responsavel')?.value.trim() || '',
      problema: item.querySelector('.eq_problema')?.value.trim() || '',
      impacto: item.querySelector('.eq_impacto')?.value.trim() || '',
      acao: item.querySelector('.eq_acao')?.value.trim() || '',
      pendencia: item.querySelector('.eq_pendencia')?.value.trim() || ''
    })).filter(item => item.nome || item.status || item.criticidade || item.responsavel || item.problema || item.impacto || item.acao || item.pendencia);
  }

  function collectRiskDecisions() {
    return [...document.querySelectorAll('.risco-decisao-item')].map(item => ({
      risco: item.querySelector('.rd_risco')?.value.trim() || '',
      gatilho: item.querySelector('.rd_gatilho')?.value.trim() || '',
      decisao: item.querySelector('.rd_decisao')?.value.trim() || '',
      responsavel: item.querySelector('.rd_responsavel')?.value.trim() || ''
    })).filter(item => item.risco || item.gatilho || item.decisao || item.responsavel);
  }

  function collectLessons() {
    return [...document.querySelectorAll('.licao-item')].map(item => ({
      licao: item.querySelector('.li_licao')?.value.trim() || '',
      aplicacao: item.querySelector('.li_aplicacao')?.value.trim() || '',
      procedimento: item.querySelector('.li_procedimento')?.value.trim() || '',
      responsavel: item.querySelector('.li_responsavel')?.value.trim() || ''
    })).filter(item => item.licao || item.aplicacao || item.procedimento || item.responsavel);
  }

  function line(label, fieldId) {
    return `${label}: ${value(fieldId) || '-'}`;
  }

  function buildOutput() {
    const equipments = collectEquipments();
    const riskDecisions = collectRiskDecisions();
    const lessons = collectLessons();
    const npts = collectNpts();
    const incidents = collectIncidents();

    let text = `*SITOP DW 12h - Fiscalização*\n\n`;

    text += `*Sonda:* ${value('sitop_sonda') || '-'}\n`;
    text += `*Poço:* ${value('sitop_poco') || '-'}\n`;
    text += `*Data:* ${formatDateBR(value('sitop_data')) || '-'}\n`;
    text += `*Turno:* ${value('sitop_turno') || '-'}\n`;
    text += `*Fiscal:* ${value('sitop_fiscal') || '-'}\n\n`;

    text += `*1. RESUMO EXECUTIVO*\n`;
    text += `${value('sitop_situacao') || '-'}\n\n`;
    text += `*Próximas 12h:*\n${value('sitop_proximas') || '-'}\n\n`;
    text += `*Desempenho vs Programa:*\n${value('sitop_desempenho') || '-'}\n\n`;

    text += `*2. ESTADO DO POÇO*\n`;
    text += `${line('Seção atual', 'sitop_secao_atual')}\n`;
    text += `${line('Profundidade atual - MD', 'sitop_md_atual')}\n`;
    text += `${line('Profundidade vertical - TVD', 'sitop_tvd_atual')}\n`;
    text += `${line('Último revestimento', 'sitop_ultimo_revestimento')}\n`;
    text += `${line('Sapata do último revestimento - MD', 'sitop_sapata_md')}\n`;
    text += `${line('Sapata do último revestimento - TVD', 'sitop_sapata_tvd')}\n`;
    text += `${line('Float shoe / float collar', 'sitop_float')}\n`;
    text += `${line('Fluido atual', 'sitop_fluido')}\n`;
    text += `${line('Peso do fluido', 'sitop_peso_fluido')}\n`;
    text += `Observação crítica: ${value('sitop_obs_poco') || '-'}\n\n`;

    const vol = calculateVolumetry();

    text += `*3. VOLUMETRIA / CONTROLE HIDRÁULICO*\n`;
    text += `*BHA fixo*\n`;
    text += `${line('Volume interno fixo do BHA', 'sitop_bha_volume_interno')}\n`;
    text += `${line('Volume anular fixo do BHA', 'sitop_bha_volume_anular')}\n`;
    text += `*Drill pipe / stands*\n`;
    text += `${line('Volume interno por stand de DP', 'sitop_dp_volume_por_stand')}\n`;
    text += `${line('Nº de stands conectados', 'sitop_dp_num_stands')}\n`;
    text += `Volume interno total dos stands: ${fmtBbl(vol.dpInternalTotal) || '-'}\n`;
    text += `Volume interno total até broca: ${fmtBbl(vol.volumeToBit) || '-'}\n`;
    text += `*Anular*\n`;
    text += `${line('Comprimento DP em poço aberto', 'sitop_oh_dp_metros')}\n`;
    text += `${line('Capacidade anular DP x poço aberto', 'sitop_oh_capacidade_bbl_m')}\n`;
    text += `Volume anular em poço aberto: ${fmtBbl(vol.ohVolume) || '-'}\n`;
    text += `${line('Comprimento DP em poço revestido', 'sitop_cased_dp_metros')}\n`;
    text += `${line('Capacidade anular DP x revestimento', 'sitop_cased_capacidade_bbl_m')}\n`;
    text += `Volume anular em poço revestido: ${fmtBbl(vol.casedVolume) || '-'}\n`;
    text += `Volume fundo-sapata: ${fmtBbl(vol.bottomToShoe) || '-'}\n`;
    text += `Volume fundo-superfície: ${fmtBbl(vol.annularTotal) || '-'}\n`;
    text += `${line('Margem operacional', 'sitop_margem_operacional')}\n`;
    text += `Volume fundo-superfície + margem: ${fmtBbl(vol.annularTotalWithMargin) || '-'}\n`;
    text += `*Marcos de deslocamento*\n`;
    text += `${line('Fator bomba ativo', 'sitop_fator_bomba')}\n`;
    text += `Até broca: ${fmtBbl(vol.volumeToBit) || '-'} / ${fmtStk(vol.stkToBit) || '-'}\n`;
    text += `Fundo-sapata: ${fmtBbl(vol.bottomToShoe) || '-'} / ${fmtStk(vol.stkBottomToShoe) || '-'}\n`;
    text += `Sapata-superfície: ${fmtBbl(vol.casedVolume) || '-'} / ${fmtStk(vol.stkShoeToSurface) || '-'}\n`;
    text += `Fundo-superfície: ${fmtBbl(vol.annularTotal) || '-'} / ${fmtStk(vol.stkBottomToSurface) || '-'}\n`;
    text += `Fundo-superfície + margem: ${fmtBbl(vol.annularTotalWithMargin) || '-'} / ${fmtStk(vol.stkBottomToSurfaceMargin) || '-'}\n`;
    text += `*Controle de manobra*\n`;
    text += `${line('Deslocamento metálico por stand', 'sitop_desloc_metal_por_stand')}\n`;
    text += `${line('Stands manobrados', 'sitop_stands_manobrados')}\n`;
    text += `Volume esperado no trip tank: ${fmtBbl(vol.tripTank) || '-'}\n\n`;

    text += `*4. BOMBAS / LIMITES*\n`;
    text += `${line('Bomba ativa', 'sitop_bomba_ativa')}\n`;
    text += `${line('Pop-off configurada', 'sitop_popoff')}\n`;
    text += `${line('Bomba 1 - camisa', 'sitop_b1_camisa')}\n`;
    text += `${line('Bomba 1 - fator', 'sitop_b1_fator')}\n`;
    text += `${line('Bomba 2 - camisa', 'sitop_b2_camisa')}\n`;
    text += `${line('Bomba 2 - fator', 'sitop_b2_fator')}\n`;
    text += `Limitação conhecida: ${value('sitop_bombas_limitacao') || '-'}\n\n`;

    text += `*5. EQUIPAMENTOS EM ATENÇÃO*\n`;
    if (!equipments.length) {
      text += `-\n`;
    } else {
      equipments.forEach((eq, index) => {
        text += `${index + 1}. ${eq.nome || '-'}\n`;
        text += `Status: ${eq.status || '-'}\n`;
        text += `Criticidade: ${eq.criticidade || '-'}\n`;
        text += `Problema / ponto de atenção: ${eq.problema || '-'}\n`;
        text += `Impacto operacional: ${eq.impacto || '-'}\n`;
        text += `Ação tomada: ${eq.acao || '-'}\n`;
        text += `Pendência / próxima ação: ${eq.pendencia || '-'}\n`;
        text += `Responsável: ${eq.responsavel || '-'}\n`;
      });
    }
    text += `\n`;

    text += `*6. RISCOS / DECISÕES*\n`;
    if (!riskDecisions.length) {
      text += `-\n`;
    } else {
      riskDecisions.forEach((rd, index) => {
        text += `${index + 1}. Risco / ponto de decisão: ${rd.risco || '-'}\n`;
        text += `Gatilho de mudança de plano: ${rd.gatilho || '-'}\n`;
        text += `Decisão pendente / tomada: ${rd.decisao || '-'}\n`;
        text += `Responsável: ${rd.responsavel || '-'}\n`;
      });
    }
    text += `\n`;

    text += `*7. LIÇÕES APRENDIDAS*\n`;
    if (!lessons.length) {
      text += `-\n`;
    } else {
      lessons.forEach((li, index) => {
        text += `${index + 1}. Lição: ${li.licao || '-'}\n`;
        text += `Aplicação prática: ${li.aplicacao || '-'}\n`;
        text += `Deve virar procedimento: ${li.procedimento || '-'}\n`;
        text += `Responsável / dono da ação: ${li.responsavel || '-'}\n`;
      });
    }
    text += `\n`;

    text += `*8. NPT DO PROJETO*\n`;
    if (!npts.length) {
      text += `-\n`;
    } else {
      npts.forEach(npt => {
        text += `${npt.desc || '-'} - ${npt.datahora || '-'} - ${npt.horas || '-'}\n`;
      });
    }

    text += `\n`;

    text += `*9. INCIDENTES / ACIDENTES*\n`;
    if (!incidents.length) {
      text += `-\n`;
    } else {
      incidents.forEach(inc => {
        text += `${inc.desc || '-'} - ${formatDateTimeBR(inc.datahora) || '-'} - Reportado em: ${formatDateTimeBR(inc.reporteDatahora) || '-'}\n`;
      });
    }

    text += `\n`;
    text += `*10. OBSERVAÇÕES RELEVANTES*\n${value('sitop_observacoes') || '-'}`;

    return text.trim();
  }

  function initialiseDefaults() {
    const data = byId('sitop_data');
    if (data && !data.value.trim()) data.value = todayDateInput();
    if (byId('sitop_equipamento_list') && !byId('sitop_equipamento_list').children.length) addEquipment();
    if (byId('sitop_risco_decisao_list') && !byId('sitop_risco_decisao_list').children.length) addRiskDecision();
    if (byId('sitop_licao_list') && !byId('sitop_licao_list').children.length) addLesson();
    if (byId('sitop_npt_list') && !byId('sitop_npt_list').children.length) addNpt();
    if (byId('sitop_incident_list') && !byId('sitop_incident_list').children.length) addIncident();
  }

  function clearBodyLists() {
    if (byId('sitop_equipamento_list')) byId('sitop_equipamento_list').innerHTML = '';
    if (byId('sitop_risco_decisao_list')) byId('sitop_risco_decisao_list').innerHTML = '';
    if (byId('sitop_licao_list')) byId('sitop_licao_list').innerHTML = '';
    if (byId('sitop_npt_list')) byId('sitop_npt_list').innerHTML = '';
    if (byId('sitop_incident_list')) byId('sitop_incident_list').innerHTML = '';
    addEquipment();
    addRiskDecision();
    addLesson();
    addNpt();
    addIncident();
  }

  window.OpsFormsModules = window.OpsFormsModules || {};
  window.OpsFormsModules.sitop = {
    setCallbacks,
    addNpt,
    addIncident,
    addEquipment,
    addRiskDecision,
    addLesson,
    collectNpts,
    collectIncidents,
    collectEquipments,
    collectRiskDecisions,
    collectLessons,
    calculateVolumetry,
    buildOutput,
    initialiseDefaults,
    clearBodyLists
  };
})();
