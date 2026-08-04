(function () {
  const {
    value,
    setValue,
    todayDateInput,
    nowTimeInput,
    formatDateBR
  } = window.OpsUtils;

  function line(label, content) {
    return `*${label}:* ${content || ''}`;
  }

  function block(title, content) {
    return `*${title}*\n${content || ''}`;
  }

  function buildOutput() {
    const lines = [
      line('ATIVO', value('com_atendimento_ativo')),
      line('LOCAL', value('com_atendimento_local')),
      line('Poço', value('com_atendimento_poco')),
      line('DATA', formatDateBR(value('com_atendimento_data'))),
      line('HORA', value('com_atendimento_hora') ? `${value('com_atendimento_hora')}hs` : ''),
      line('Tipo DE OCORRÊNCIA', value('com_atendimento_tipo')),
      '',
      block('O que aconteceu?', value('com_atendimento_descricao')),
      line('EMPRESA', value('com_atendimento_empresa')),
      line('GERÊNCIA', value('com_atendimento_gerencia')),
      '',
      line('Houve vítimas', value('com_atendimento_vitimas')),
      line('Houve danos materiais', value('com_atendimento_danos')),
      '',
      '*AÇÃO IMEDIATA:*',
      '',
      value('com_atendimento_acao')
    ];

    return lines.join('\n').replace(/\n{4,}/g, '\n\n\n').trim();
  }

  function initialiseDefaults(onlyIfEmpty = true) {
    const setIf = (id, val) => {
      if (!onlyIfEmpty || !value(id)) setValue(id, val);
    };

    setIf('com_atendimento_data', todayDateInput());
    setIf('com_atendimento_hora', nowTimeInput());
    setIf('com_atendimento_local', 'Locação do poço.');
  }

  window.OpsFormsModules = window.OpsFormsModules || {};
  window.OpsFormsModules.comunicadoEvento = {
    buildOutput,
    initialiseDefaults
  };
})();
