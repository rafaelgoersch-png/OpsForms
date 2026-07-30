(function () {
  const { STORAGE_KEY, PREFS_KEY } = window.OpsConfig;
  const { byId, value, setValue } = window.OpsUtils;

  function loadPrefs() {
    try {
      return JSON.parse(localStorage.getItem(PREFS_KEY)) || {};
    } catch {
      return {};
    }
  }

  function savePrefs(prefs) {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }

  function getRigFieldIds() {
    return ['sitop_sonda', 'sup_sonda', 'sond_sonda', 'desvio_sonda', 'evento_rig'];
  }

  function getWellFieldIds() {
    return ['sitop_poco', 'sup_poco', 'sond_poco', 'desvio_poco', 'evento_well'];
  }

  function getCurrentRigValue() {
    for (const id of getRigFieldIds()) {
      const val = value(id);
      if (val) return val;
    }
    return '';
  }

  function getCurrentWellValue() {
    for (const id of getWellFieldIds()) {
      const val = value(id);
      if (val) return val;
    }
    return '';
  }

  function updatePrefsFromFields() {
    const prefs = loadPrefs();
    const rig = getCurrentRigValue();
    const well = getCurrentWellValue();

    if (rig) prefs.lastRig = rig;
    if (well) prefs.lastWell = well;

    savePrefs(prefs);
  }

  function applyPrefsToEmptyHeaderFields() {
    const prefs = loadPrefs();

    if (prefs.lastRig) {
      getRigFieldIds().forEach(id => {
        if (byId(id) && !value(id)) setValue(id, prefs.lastRig);
      });
    }

    if (prefs.lastWell) {
      getWellFieldIds().forEach(id => {
        if (byId(id) && !value(id)) setValue(id, prefs.lastWell);
      });
    }
  }

  function collectState(activeFormType) {
    const { sitop, sitopSupervisor, sitopSondador } = window.OpsFormsModules;
    const state = {
      activeFormType,
      equipments: sitop.collectEquipments(),
      riskDecisions: sitop.collectRiskDecisions(),
      lessons: sitop.collectLessons(),
      npts: sitop.collectNpts(),
      incidents: sitop.collectIncidents(),
      supervisorAtividadesPrincipais: sitopSupervisor.collectAtividadesPrincipais(),
      supervisorMovimentacoesCarga: sitopSupervisor.collectMovimentacoesCarga(),
      supervisorAtividadesParalelas: sitopSupervisor.collectAtividadesParalelas(),
      supervisorPreventivas: sitopSupervisor.collectPreventivas(),
      supervisorFalhas: sitopSupervisor.collectFalhas(),
      supervisorSubstituicoes: sitopSupervisor.collectSubstituicoes(),
      supervisorProntos: sitopSupervisor.collectProntos(),
      supervisorIncidents: sitopSupervisor.collectIncidents(),
      sondadorTimeline: sitopSondador.collectTimeline(),
      fields: {}
    };

    document.querySelectorAll('input, select, textarea').forEach(el => {
      if (el.name === 'formType' || el.id === 'themeSelect') return;

      if (el.type === 'checkbox') {
        if (!state.fields[el.name]) state.fields[el.name] = [];
        if (el.checked) state.fields[el.name].push(el.value);
        return;
      }

      if (el.type === 'radio') {
        if (el.checked) state.fields[el.name] = el.value;
        return;
      }

      if (el.id) state.fields[el.id] = el.value;
    });

    return state;
  }

  function applyState(state, setActiveFormType) {
    const { sitop, sitopSupervisor, sitopSondador } = window.OpsFormsModules;
    if (!state || typeof state !== 'object') return;

    setActiveFormType(state.activeFormType || 'sitop');

    document.querySelectorAll('input, select, textarea').forEach(el => {
      if (el.name === 'formType' || el.id === 'themeSelect') return;

      if (el.type === 'checkbox') {
        el.checked = Array.isArray(state.fields?.[el.name]) && state.fields[el.name].includes(el.value);
        return;
      }

      if (el.type === 'radio') {
        el.checked = state.fields?.[el.name] === el.value;
        return;
      }

      if (el.id && Object.prototype.hasOwnProperty.call(state.fields || {}, el.id)) {
        el.value = state.fields[el.id];
      }
    });

    if (byId('sitop_equipamento_list')) byId('sitop_equipamento_list').innerHTML = '';
    if (byId('sitop_risco_decisao_list')) byId('sitop_risco_decisao_list').innerHTML = '';
    if (byId('sitop_licao_list')) byId('sitop_licao_list').innerHTML = '';
    if (byId('sitop_npt_list')) byId('sitop_npt_list').innerHTML = '';
    if (byId('sitop_incident_list')) byId('sitop_incident_list').innerHTML = '';
    if (byId('sup_atividade_principal_list')) byId('sup_atividade_principal_list').innerHTML = '';
    if (byId('sup_movimentacao_carga_list')) byId('sup_movimentacao_carga_list').innerHTML = '';
    if (byId('sup_atividade_paralela_list')) byId('sup_atividade_paralela_list').innerHTML = '';
    if (byId('sup_preventivas_list')) byId('sup_preventivas_list').innerHTML = '';
    if (byId('sup_falhas_list')) byId('sup_falhas_list').innerHTML = '';
    if (byId('sup_substituicoes_list')) byId('sup_substituicoes_list').innerHTML = '';
    if (byId('sup_prontos_list')) byId('sup_prontos_list').innerHTML = '';
    if (byId('sup_incident_list')) byId('sup_incident_list').innerHTML = '';
    if (byId('sond_timeline_list')) byId('sond_timeline_list').innerHTML = '';

    (state.equipments || []).forEach(sitop.addEquipment);
    (state.riskDecisions || []).forEach(sitop.addRiskDecision);
    (state.lessons || []).forEach(sitop.addLesson);
    (state.npts || []).forEach(sitop.addNpt);
    (state.incidents || []).forEach(sitop.addIncident);
    (state.supervisorAtividadesPrincipais || []).forEach(sitopSupervisor.addAtividadePrincipal);
    (state.supervisorMovimentacoesCarga || []).forEach(sitopSupervisor.addMovimentacaoCarga);
    (state.supervisorAtividadesParalelas || []).forEach(sitopSupervisor.addAtividadeParalela);
    (state.supervisorPreventivas || []).forEach(sitopSupervisor.addPreventiva);
    (state.supervisorFalhas || []).forEach(sitopSupervisor.addFalha);
    (state.supervisorSubstituicoes || []).forEach(sitopSupervisor.addSubstituicao);
    (state.supervisorProntos || []).forEach(sitopSupervisor.addPronto);
    (state.supervisorIncidents || []).forEach(sitopSupervisor.addIncident);
    (state.sondadorTimeline || []).forEach(sitopSondador.addTimelineItem);
    sitopSupervisor.syncTurmasField();
  }

  function saveState(activeFormType) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collectState(activeFormType)));
  }

  function loadState(setActiveFormType) {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    try {
      applyState(JSON.parse(raw), setActiveFormType);
      return true;
    } catch {
      return false;
    }
  }

  window.OpsStorage = {
    updatePrefsFromFields,
    applyPrefsToEmptyHeaderFields,
    collectState,
    applyState,
    saveState,
    loadState
  };
})();
