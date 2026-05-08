(function () {
  function byId(id) {
    return document.getElementById(id);
  }

  function value(id) {
    const el = byId(id);
    return el ? el.value.trim() : '';
  }

  function setValue(id, val) {
    const el = byId(id);
    if (el) el.value = val || '';
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function todayDateInput() {
    const now = new Date();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }

  function nowTimeInput() {
    const now = new Date();
    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  function nowDateTimeInput() {
    return `${todayDateInput()}T${nowTimeInput()}`;
  }

  function formatDateBR(dateValue) {
    if (!dateValue) return '';
    const [year, month, day] = dateValue.split('-');
    if (!year || !month || !day) return dateValue;
    return `${day}/${month}/${year}`;
  }

  function formatDateTimeBR(value) {
    if (!value) return '';
    const [date, time] = value.split('T');
    return `${formatDateBR(date)} ${time || ''}`.trim();
  }

  function getRadioValue(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : '';
  }

  function getCheckedValues(name) {
    return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value);
  }

  function formatListPT(items) {
    const cleaned = items.filter(Boolean);
    if (!cleaned.length) return '';
    if (cleaned.length === 1) return cleaned[0];
    if (cleaned.length === 2) return `${cleaned[0]} e ${cleaned[1]}`;
    return `${cleaned.slice(0, -1).join(', ')} e ${cleaned[cleaned.length - 1]}`;
  }

  function optionalLine(label, content) {
    if (!content) return '';
    return `${label}: ${content}`;
  }

  function optionalBlock(title, content) {
    if (!content) return '';
    return `${title}\n${content}`;
  }

  function fillSelect(selectId, items) {
    const select = byId(selectId);
    if (!select) return;
    select.innerHTML = '';

    const empty = document.createElement('option');
    empty.value = '';
    empty.textContent = 'Selecione...';
    select.appendChild(empty);

    items.forEach(item => {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      select.appendChild(option);
    });
  }

  function fillCheckboxGroup(containerId, name, items, groupName) {
    const container = byId(containerId);
    if (!container) return;
    container.innerHTML = '';

    items.forEach(item => {
      const label = document.createElement('label');
      const input = document.createElement('input');

      input.type = 'checkbox';
      input.name = name;
      input.value = item;
      input.dataset.form = 'evento';
      input.dataset.group = groupName;

      const span = document.createElement('span');
      span.textContent = item;

      label.append(input, span);
      container.appendChild(label);
    });
  }

  window.OpsUtils = {
    byId,
    value,
    setValue,
    pad,
    todayDateInput,
    nowTimeInput,
    nowDateTimeInput,
    formatDateBR,
    formatDateTimeBR,
    getRadioValue,
    getCheckedValues,
    formatListPT,
    optionalLine,
    optionalBlock,
    fillSelect,
    fillCheckboxGroup
  };
})();
