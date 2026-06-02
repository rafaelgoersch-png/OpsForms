(function () {
  const { byId, value, formatDateTimeBR, getRadioValue, getCheckedValues, nowDateTimeInput, setValue } = window.OpsUtils;

  const COMPORTAMENTO_INSEGURO = 'Comportamento Inseguro';

  function isComportamentoInseguro() {
    return getRadioValue('desvio_classificacao') === COMPORTAMENTO_INSEGURO;
  }

  function toggleComportamentoField() {
    const wrap = byId('desvio_acaoComportamentoWrap');
    if (!wrap) return;

    wrap.classList.toggle('hidden', !isComportamentoInseguro());
  }

  function buildOutput() {
    const setor = getCheckedValues('desvio_setor');
    const regras = getCheckedValues('desvio_regraOuro');
    const comportamentoInseguro = isComportamentoInseguro();
    const acaoComportamento = comportamentoInseguro
      ? (value('desvio_acaoComportamento') || '-')
      : 'NA';

    let text = `⚠️ *CAÇA-DESVIO*\n\n`;

    text += `• *Sonda:* ${value('desvio_sonda') || '-'}\n`;
    text += `• *Poço:* ${value('desvio_poco') || '-'}\n`;
    text += `• *Área / Sistema:* ${value('desvio_areaSistema') || '-'}\n`;
    text += `• *Data / Hora:* ${formatDateTimeBR(value('desvio_dataHora')) || '-'}\n\n`;

    text += `*Desvio identificado:*\n${value('desvio_desvio') || '-'}\n\n`;
    text += `*Risco associado:*\n${value('desvio_risco') || '-'}\n\n`;
    text += `*Ação imediata tomada:*\n${value('desvio_acao') || '-'}\n\n`;
    text += `*Melhoria sugerida:*\n${value('desvio_melhoria') || '-'}\n\n`;
    text += `*Status atual:*\n${getRadioValue('desvio_status') || '-'}\n\n`;
    text += `*Setor responsável pela correção:*\n${setor.length ? setor.join(' / ') : '-'}\n\n`;
    text += `*Classificação do desvio:*\n${getRadioValue('desvio_classificacao') || '-'}\n\n`;
    text += `*Ação tomada para Comportamento Inseguro:*\n${acaoComportamento}\n\n`;
    text += `*Regra de Ouro:*\n${regras.length ? regras.join(' / ') : '-'}\n\n`;
    text += `*Sugestão de Criticidade:*\n${getRadioValue('desvio_criticidade') || '-'}\n\n`;
    text += `*Evidência:*\n${value('desvio_evidencia') || 'Enviar após a mensagem, se aplicável.'}`;

    return text.trim();
  }

  function initialiseDefaults() {
    if (!value('desvio_dataHora')) setValue('desvio_dataHora', nowDateTimeInput());
    toggleComportamentoField();
  }

  window.OpsFormsModules = window.OpsFormsModules || {};
  window.OpsFormsModules.desvio = {
    buildOutput,
    initialiseDefaults,
    toggleComportamentoField
  };
})();
