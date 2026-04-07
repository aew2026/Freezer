import {
  getSettings, saveSettings,
  getItemList, removeFromItemList,
  clearAllData, initStore,
} from './store.js';
import { CATEGORIES, CATEGORY_DEFAULTS_MONTHS } from './defaults.js';

let onCloseCallback = null;

export function initSettings(onClose) {
  onCloseCallback = onClose || null;
  const overlay = document.getElementById('settingsOverlay');
  overlay.innerHTML = buildHTML();
  overlay.classList.add('is-open');
  bindListeners(overlay);
}

function buildHTML() {
  const settings  = getSettings();
  const apiKey    = settings.anthropicApiKey || '';
  const catDefs   = settings.categoryDefaults || CATEGORY_DEFAULTS_MONTHS;

  const catRows = CATEGORIES.map(cat => `
    <div class="settings-row">
      <div>
        <div class="settings-row__label">${cat}</div>
        <div class="settings-row__sub">months until use-by</div>
      </div>
      <div class="settings-row__right">
        <input class="input" type="number" min="1" max="24" data-cat="${cat}"
          value="${catDefs[cat] || CATEGORY_DEFAULTS_MONTHS[cat]}" style="width:64px;text-align:center;padding:6px 8px">
      </div>
    </div>`).join('');

  const itemList = getItemList();
  const itemRows = itemList.map(i => `
    <div class="item-list-item">
      <span class="item-list-item__name">${escHtml(i.name)}</span>
      <span class="item-list-item__badge">${i.category || ''}</span>
      <button class="btn btn--icon" data-remove-item="${escHtml(i.name)}" aria-label="Remove ${escHtml(i.name)}" style="color:var(--color-text-secondary)">✕</button>
    </div>`).join('');

  return `
    <div class="settings-header">
      <h1>Settings</h1>
      <button class="btn btn--icon" id="settingsClose" aria-label="Close settings">✕</button>
    </div>
    <div class="settings-body">

      <div class="settings-section">
        <h2>Anthropic API Key</h2>
        <div class="settings-item">
          <div class="settings-row" style="flex-direction:column;align-items:flex-start;gap:8px">
            <div class="api-key-wrap" style="width:100%">
              <input class="input" id="apiKeyInput" type="password"
                value="${escHtml(apiKey)}" placeholder="sk-ant-…" autocomplete="off" spellcheck="false">
              <button class="api-key-toggle" id="apiKeyToggle" type="button">Show</button>
            </div>
            <p style="font-size:12px;color:var(--color-text-secondary)">
              Used only for auto-categorizing items when you add them. Optional — you can always set categories manually.
            </p>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h2>Default Use-By Duration</h2>
        <div class="settings-item">${catRows}</div>
      </div>

      <div class="settings-section">
        <h2>Item List (${itemList.length} items)</h2>
        <div class="settings-item" style="max-height:300px;overflow-y:auto" id="itemListContainer">
          ${itemRows}
        </div>
      </div>

      <div class="settings-section">
        <h2>Data</h2>
        <div class="settings-item">
          <div class="settings-row">
            <div>
              <div class="settings-row__label">Clear all data</div>
              <div class="settings-row__sub">Removes all inventory, shopping, and custom items</div>
            </div>
            <button class="btn btn--danger" id="clearDataBtn">Clear</button>
          </div>
        </div>
      </div>

    </div>`;
}

function bindListeners(overlay) {
  // Close
  overlay.querySelector('#settingsClose').addEventListener('click', closeSettings);

  // API key save
  const apiInput = overlay.querySelector('#apiKeyInput');
  const apiToggle = overlay.querySelector('#apiKeyToggle');

  apiToggle.addEventListener('click', () => {
    const isPass = apiInput.type === 'password';
    apiInput.type  = isPass ? 'text' : 'password';
    apiToggle.textContent = isPass ? 'Hide' : 'Show';
  });

  apiInput.addEventListener('change', () => {
    saveSettings({ anthropicApiKey: apiInput.value.trim() });
  });

  apiInput.addEventListener('blur', () => {
    saveSettings({ anthropicApiKey: apiInput.value.trim() });
  });

  // Category defaults
  overlay.querySelectorAll('input[data-cat]').forEach(input => {
    input.addEventListener('change', () => {
      const cat = input.dataset.cat;
      const val = parseInt(input.value, 10);
      if (val >= 1 && val <= 24) {
        saveSettings({ categoryDefaults: { [cat]: val } });
      }
    });
  });

  // Remove from item list
  overlay.querySelector('#itemListContainer').addEventListener('click', e => {
    const btn = e.target.closest('[data-remove-item]');
    if (!btn) return;
    removeFromItemList(btn.dataset.removeItem);
    // Re-render item list section
    const container = overlay.querySelector('#itemListContainer');
    const items = getItemList();
    container.innerHTML = items.map(i => `
      <div class="item-list-item">
        <span class="item-list-item__name">${escHtml(i.name)}</span>
        <span class="item-list-item__badge">${i.category || ''}</span>
        <button class="btn btn--icon" data-remove-item="${escHtml(i.name)}" style="color:var(--color-text-secondary)">✕</button>
      </div>`).join('');
  });

  // Clear all data
  overlay.querySelector('#clearDataBtn').addEventListener('click', () => {
    if (!confirm('Delete ALL inventory, shopping list, and custom items? This cannot be undone.')) return;
    clearAllData();
    initStore();
    closeSettings();
    // Notify app to refresh all tabs
    window.dispatchEvent(new CustomEvent('frosttrack:datareset'));
  });
}

function closeSettings() {
  const overlay = document.getElementById('settingsOverlay');
  overlay.classList.remove('is-open');
  if (onCloseCallback) onCloseCallback();
}

function escHtml(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
