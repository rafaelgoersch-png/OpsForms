(function () {
  window.OpsConfig = {
    STORAGE_KEY: 'formularios-operacionais-github-v3',
    PREFS_KEY: 'formularios-operacionais-preferencias-v1',
    RIGS: ['PR-21', 'PR-14'],
    PHASES: ['26\"', '17 1/2\"', '12 1/4\"', '8 1/2\"', 'Outro'],
    ACTIVITIES: [
      'Perfuração',
      'Manobra',
      'Circulação',
      'Condicionamento',
      'Descida de revestimento',
      'Cimentação',
      'Perfilagem',
      'Teste de BOP',
      'Movimentação de cargas',
      'Manutenção',
      'Espera',
      'Outro'
    ],
    EVENT_CATEGORIES: [
      'Segurança',
      'Operacional',
      'Manutenção',
      'Logística',
      'Qualidade',
      'Tempo',
      'Custo',
      'Dados / Comunicação',
      'Fornecedor',
      'Planejamento',
      'Equipamento'
    ],
    EVENT_IMPACTS: [
      'Sem impacto relevante',
      'Risco de segurança',
      'NPT / perda de tempo',
      'Retrabalho',
      'Custo adicional',
      'Risco ao poço',
      'Risco ao equipamento',
      'Qualidade de dados',
      'Atraso logístico',
      'Exposição operacional',
      'Outro'
    ],
    EVENT_APPLICABLE_TO: [
      'Próxima fase',
      'Próximo poço',
      'Mesmo poço',
      'Equipe de sonda',
      'Fiscalização',
      'Engenharia',
      'Manutenção',
      'Fornecedor',
      'Logística',
      'Planejamento',
      'Contratada',
      'Não aplicável'
    ],
    CRITICALITY: ['Baixa', 'Média', 'Alta', 'Crítica'],
    CRITICALITY_COLORS: {
      Baixa: '#56d364',
      Média: '#ffc457',
      Alta: '#ff8b4c',
      Crítica: '#ff6b6b'
    },
    CRITICALITY_EMOJIS: {
      Baixa: '🟢',
      Média: '🟡',
      Alta: '🟠',
      Crítica: '🔴'
    }
  };
})();
