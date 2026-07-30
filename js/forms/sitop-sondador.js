(function () {
  const { byId, value, formatDateBR, todayDateInput } = window.OpsUtils;
  let attachAutoHandlers = () => {};
  let updateOutput = () => {};

  function setCallbacks(callbacks = {}) {
    attachAutoHandlers = callbacks.attachAutoHandlers || attachAutoHandlers;
    updateOutput = callbacks.updateOutput || updateOutput;
  }

  function createInputWrap(labelText, className, val, type = 'text', placeholder = '') {
    const label = document.createElement('label');
    const span = document.createElement('span');
    const input = document.createElement('input');

    span.textContent = labelText;
    input.type = type;
    input.className = className;
    input.value = val || '';
    input.placeholder = placeholder || '';
    input.dataset.form = 'sitopSondador';
    input.dataset.group = 'body';

    if (type === 'time') {
      input.step = 900;
    }

    label.append(span, input);
    return label;
  }

  function createTextareaWrap(labelText, className, val, rows = 3, placeholder = '') {
    const label = document.createElement('label');
    const span = document.createElement('span');
    const textarea = document.createElement('textarea');

    span.textContent = labelText;
    textarea.className = className;
    textarea.value = val || '';
    textarea.rows = rows;
    textarea.placeholder = placeholder || '';
    textarea.dataset.form = 'sitopSondador';
    textarea.dataset.group = 'body';

    label.append(span, textarea);
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

  function addTimelineItem(data = {}) {
    const container = byId('sond_timeline_list');
    if (!container) return;

    const item = document.createElement('div');
    item.className = 'dynamic-item sondador-timeline-item';

    const row = document.createElement('div');
    row.className = 'grid two';

    row.append(
      createInputWrap('Início', 'sond_tl_inicio', data.inicio || '', 'time'),
      createInputWrap('Fim', 'sond_tl_fim', data.fim || '', 'time'),
      createTextareaWrap('Atividade', 'sond_tl_atividade', data.atividade || '', 3, 'Ex.: Descendo coluna em poço revestido de 288 m a 515 m'),
      createTextareaWrap('Observação', 'sond_tl_obs', data.obs || '', 2, 'Ex.: dificuldade na passagem, conexão, survey, espera, etc.')
    );

    item.appendChild(row);
    item.appendChild(createRemoveButton(item));
    container.appendChild(item);

    attachAutoHandlers(item);
  }

  function collectTimeline() {
    return [...document.querySelectorAll('.sondador-timeline-item')].map(item => ({
      inicio: item.querySelector('.sond_tl_inicio')?.value.trim() || '',
      fim: item.querySelector('.sond_tl_fim')?.value.trim() || '',
      atividade: item.querySelector('.sond_tl_atividade')?.value.trim() || '',
      obs: item.querySelector('.sond_tl_obs')?.value.trim() || ''
    })).filter(item => item.inicio || item.fim || item.atividade || item.obs);
  }

  function clearBodyLists() {
    if (byId('sond_timeline_list')) byId('sond_timeline_list').innerHTML = '';
    addTimelineItem();
  }

  function initialiseDefaults() {
    const data = byId('sond_data');
    if (data && !data.value.trim()) data.value = todayDateInput();

    if (byId('sond_timeline_list') && !byId('sond_timeline_list').children.length) {
      addTimelineItem();
    }
  }

  function timeRange(item) {
    if (item.inicio && item.fim) return `${item.inicio} às ${item.fim}`;
    if (item.inicio) return `${item.inicio} às --:--`;
    if (item.fim) return `--:-- às ${item.fim}`;
    return '--:-- às --:--';
  }

  function buildOutput() {
    const timeline = collectTimeline();

    let text = `*Situação operacional* ${value('sond_situacao') || '-'}\n`;
    text += `*BDO:* ${value('sond_bdo') || '-'}\n`;
    text += `*Poço:* ${value('sond_poco') || '-'}\n`;
    text += `*Sonda:* ${value('sond_sonda') || '-'}\n`;
    text += `*Data:* ${formatDateBR(value('sond_data')) || '-'}\n`;
    text += `*Turno:* ${value('sond_turno') || '-'}\n`;
    text += `*Sondador/Assist. Sondador:* ${value('sond_sondador') || '-'}/${value('sond_assistente') || '-'}\n`;
    text += `*Fiscal:* ${value('sond_fiscal') || '-'}\n`;
    text += `*Supervisor:* ${value('sond_supervisor') || '-'}\n\n`;

    if (!timeline.length) {
      text += `*Linha do tempo*\n-\n\n`;
    } else {
      timeline.forEach(item => {
        text += `*${timeRange(item)}*\n`;
        text += `${item.atividade || '-'}\n`;
        if (item.obs) text += `*Obs:* ${item.obs}\n`;
      });
      text += `\n`;
    }

    text += `*Circulação das bombas*\n`;
    text += `Bomba 1: ${value('sond_b1_status') || '-'} | ${value('sond_b1_horas') || '-'}\n`;
    text += `Bomba 2: ${value('sond_b2_status') || '-'} | ${value('sond_b2_horas') || '-'}\n`;
    text += `Obs bombas: ${value('sond_bombas_obs') || '-'}\n\n`;

    text += `*Atividades paralelas*\n${value('sond_atividades_paralelas') || '-'}\n\n`;
    text += `*Observações gerais*\n${value('sond_observacoes') || '-'}`;

    return text.trim();
  }

  window.OpsFormsModules = window.OpsFormsModules || {};
  window.OpsFormsModules.sitopSondador = {
    setCallbacks,
    addTimelineItem,
    collectTimeline,
    clearBodyLists,
    initialiseDefaults,
    buildOutput
  };
})();
