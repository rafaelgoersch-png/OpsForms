(function () {
  const { byId, value, formatDateBR, todayDateInput, formatListPT } = window.OpsUtils;
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

  function createInputWrap(labelText, type, className, val) {
    const label = document.createElement('label');
    const span = document.createElement('span');
    const input = document.createElement(type);

    span.textContent = labelText;
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

  function collectProntos() {
    return [...document.querySelectorAll('.supervisor-pronto-item')].map(item => ({
      nome: item.querySelector('.sup_pronto_nome').value.trim(),
      mitigacao: item.querySelector('.sup_pronto_mitigacao').value.trim()
    })).filter(item => item.nome || item.mitigacao);
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

    text += `*4. ESCP e Simulados:*\n`;
    text += `- *Estado dos equipamentos:* ${value('sup_escp_estado') || '-'}\n`;
    text += `- *Pendências:* ${value('sup_escp_pendencias') || '-'}\n`;
    text += `- *Data do último teste:* ${formatDateBR(value('sup_escp_ultimo_teste')) || '-'}\n`;
    text += `- *Data do próximo teste:* ${formatDateBR(value('sup_escp_proximo_teste')) || '-'}\n`;
    text += `- *Simulado de controle de poço:* ${value('sup_simulado_poco') || '-'}\n`;
    text += `- *Simulado com UCI:* ${value('sup_simulado_uci') || '-'}\n\n`;

    text += `*5. Pessoas / Comportamento:*\n`;
    text += `- *Desvios Identificados:* ${value('sup_desvios') || '-'}\n`;
    text += `- *Pontos de Atenção / Conflitos Identificados:* ${value('sup_pontos_atencao') || '-'}\n`;

    const prontosTable = buildProntosTable(prontos);
    if (prontosTable) {
      text += `- *PRONTOS - Colaboradores Alterados e Ações Preventivas:*\n${prontosTable}\n`;
    }
    text += `\n`;

    text += `*6. Suporte Operacional:*\n`;
    text += `- *Falta de Materiais / Recursos logísticos:* ${value('sup_falta_materiais') || '-'}\n`;
    text += `- *Limitações Operacionais:* ${value('sup_limitacoes') || '-'}\n\n`;

    text += `*7. Incidentes / Acidentes:*\n${value('sup_incidentes') || '-'}\n\n`;
    text += `*8. Observações Relevantes:*\n${value('sup_observacoes') || '-'}`;

    return text.trim();
  }

  function initialiseDefaults() {
    const data = byId('sup_data');
    if (data && !data.value.trim()) data.value = todayDateInput();
  }

  function clearBodyLists() {
    if (byId('sup_prontos_list')) byId('sup_prontos_list').innerHTML = '';
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
    collectProntos,
    buildOutput,
    initialiseDefaults,
    clearBodyLists,
    getTurmasValues,
    syncTurmasField,
    attachTurmasHandlers
  };
})();
