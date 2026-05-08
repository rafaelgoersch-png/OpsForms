(function () {
  const {
    byId,
    value,
    setValue,
    todayDateInput,
    nowTimeInput,
    formatDateBR,
    getRadioValue,
    getCheckedValues,
    optionalLine,
    optionalBlock
  } = window.OpsUtils;

  const {
    CRITICALITY,
    CRITICALITY_COLORS,
    CRITICALITY_EMOJIS
  } = window.OpsConfig;

  function currentCriticality() {
    const index = Number(value('evento_criticality') || 0);
    return CRITICALITY[index] || 'Baixa';
  }

  function formattedCriticality() {
    const crit = currentCriticality();
    const emoji = CRITICALITY_EMOJIS[crit] || '🟢';
    return `${emoji} *${crit.toUpperCase()}*`;
  }

  function updateCriticalityVisual() {
    const el = byId('evento_criticality');
    if (!el) return;
    const crit = currentCriticality();
    const color = CRITICALITY_COLORS[crit] || CRITICALITY_COLORS.Baixa;
    el.style.setProperty('--criticality-color', color);
  }

  function toggleTimeFields() {
    const fixed = byId('evento_fixedTimeFields');
    const range = byId('evento_rangeTimeFields');
    if (!fixed || !range) return;
    const mode = getRadioValue('evento_timeMode');
    fixed.classList.toggle('hidden', mode !== 'fixed');
    range.classList.toggle('hidden', mode !== 'range');
  }

  function toggleActionField() {
    const wrap = byId('evento_actionTextWrap');
    if (!wrap) return;
    const mode = getRadioValue('evento_actionTakenMode');
    wrap.classList.toggle('hidden', mode !== 'yes');
  }

  function buildTimeText() {
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

  function buildActionText() {
    const mode = getRadioValue('evento_actionTakenMode');

    if (mode === 'yes') {
      const action = value('evento_actionTaken');
      return action ? `🛠️ *Ação tomada:*\n${action}` : '🛠️ *Ação tomada:*\nSim, porém sem descrição preenchida.';
    }

    if (mode === 'no') return '🛠️ *Ação tomada:*\nNão.';
    if (mode === 'na') return '🛠️ *Ação tomada:*\nNão aplicável.';

    return '';
  }

  function buildOutput() {
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
      `🚦 *Criticidade*: ${formattedCriticality()}`
    ].filter(Boolean);

    const timeText = buildTimeText();
    const person = optionalLine('👤 *Registrado por*', value('evento_registeredBy'));

    const impactParts = [];
    if (impacts) impactParts.push(impacts);
    if (value('evento_impactDetail')) impactParts.push(value('evento_impactDetail'));

    const bodyBlocks = [
      timeText,
      person,
      optionalBlock('🔎 *Evento observado:*', value('evento_eventDescription')),
      optionalBlock('⚠️ *Impacto observado ou potencial:*', impactParts.join('\n')),
      buildActionText(),
      optionalBlock('🧠 *Lição aprendida:*', value('evento_lessonLearned')),
      optionalBlock('✅ *Recomendação prática:*', value('evento_recommendation')),
      optionalBlock('🔁 *Aplicável a:*', [applicable, value('evento_applicableDetail')].filter(Boolean).join('\n'))
    ].filter(Boolean);

    return [...headerLines, '', ...bodyBlocks].join('\n').trim();
  }

  function initialiseDefaults(onlyIfEmpty = true) {
    const setIf = (id, val) => {
      if (!onlyIfEmpty || !value(id)) setValue(id, val);
    };

    setIf('evento_eventDate', todayDateInput());
    setIf('evento_eventTime', nowTimeInput());
    setIf('evento_startDate', todayDateInput());
    setIf('evento_endDate', todayDateInput());
  }

  function resetBodyDefaults() {
    if (byId('evento_criticality')) byId('evento_criticality').value = '0';
    const omit = document.querySelector('input[name="evento_actionTakenMode"][value="omit"]');
    if (omit) omit.checked = true;
  }

  window.OpsFormsModules = window.OpsFormsModules || {};
  window.OpsFormsModules.evento = {
    buildOutput,
    initialiseDefaults,
    resetBodyDefaults,
    updateCriticalityVisual,
    toggleTimeFields,
    toggleActionField
  };
})();
