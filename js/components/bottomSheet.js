let onSaveCallback = null;
let onCancelCallback = null;

const sheet   = () => document.getElementById('bottomSheet');
const backdrop = () => document.getElementById('sheetBackdrop');

let initialized = false;

function init() {
  if (initialized) return;
  initialized = true;
  backdrop().addEventListener('click', hideSheet);
}

export function showSheet(contentHTML, { onSave, onCancel } = {}) {
  init();
  onSaveCallback   = onSave   || null;
  onCancelCallback = onCancel || null;

  const el = sheet();
  el.innerHTML = contentHTML;
  el.classList.add('is-open');
  backdrop().classList.add('is-open');

  // Wire save/cancel buttons inside the content
  el.querySelector('[data-action="save"]')?.addEventListener('click', () => {
    if (onSaveCallback) onSaveCallback();
  });
  el.querySelector('[data-action="cancel"]')?.addEventListener('click', () => {
    hideSheet();
    if (onCancelCallback) onCancelCallback();
  });

  // Focus first input after transition
  setTimeout(() => {
    el.querySelector('input, select, textarea')?.focus();
  }, 340);
}

export function hideSheet() {
  const el = sheet();
  el.classList.remove('is-open');
  backdrop().classList.remove('is-open');

  el.addEventListener('transitionend', () => {
    el.innerHTML = '';
    onSaveCallback   = null;
    onCancelCallback = null;
  }, { once: true });
}

export function getSheetEl() {
  return sheet();
}
