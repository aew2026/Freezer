// ─────────────────────────────────────────────
// FrostTrack — single-file bundle (no ES modules)
// ─────────────────────────────────────────────

// Built-in Firebase config (declared first so it's available everywhere)
var BUILT_IN_FIREBASE_CONFIG = {
  apiKey: "AIzaSyD0qQ1HpgSrqooaFLe6RnRtB1D2cRkykA4",
  authDomain: "frosttrack-cbeee.firebaseapp.com",
  projectId: "frosttrack-cbeee",
  storageBucket: "frosttrack-cbeee.firebasestorage.app",
  messagingSenderId: "505797139212",
  appId: "1:505797139212:web:53551ef2ae0c9fb7884729"
};

// ── defaults.js ──────────────────────────────

const CATEGORIES = ['Protein', 'Produce', 'Full Meals', 'Desserts', 'Other'];

const CATEGORY_DEFAULTS_MONTHS = {
  'Protein':    4,
  'Produce':    10,
  'Full Meals': 3,
  'Desserts':   6,
  'Other':      3,
};

// Universal unit list — same options regardless of category
const ALL_UNITS = ['lbs', 'oz', 'g', 'kg', 'pieces', 'unit', 'servings', 'portions', 'bags', 'cups', 'containers', 'trays', 'Custom…'];

// Build <option> tags for a unit select; handles custom values not in the list
function unitOptsHtml(selected) {
  const inList = ALL_UNITS.includes(selected);
  let opts = ALL_UNITS.map(u => `<option value="${u}" ${u === (inList ? selected : 'Custom…') ? 'selected' : ''}>${u}</option>`).join('');
  return opts;
}

// Wire up a unit select + custom text input pair
function wireUnitCustom(selId, inpId) {
  const sel = document.getElementById(selId);
  const inp = document.getElementById(inpId);
  if (!sel || !inp) return;
  const sync = () => { const show = sel.value === 'Custom…'; inp.style.display = show ? '' : 'none'; if (show) inp.focus(); };
  sel.addEventListener('change', sync);
  sync();
}

const DEFAULT_UNIT = {
  'Protein':    'lbs',
  'Produce':    'bags',
  'Full Meals': 'servings',
  'Desserts':   'servings',
  'Other':      'servings',
};

const CATEGORY_ICONS = {
  'Protein':    '🥩',
  'Produce':    '🥦',
  'Full Meals': '🍱',
  'Desserts':   '🍰',
  'Other':      '📦',
};

const CATEGORY_BADGE_CLASS = {
  'Protein':    'badge--protein',
  'Produce':    'badge--produce',
  'Full Meals': 'badge--meals',
  'Desserts':   'badge--desserts',
  'Other':      'badge--other',
};

const DEFAULT_ITEMS = [
  { name: 'Chicken breasts',  category: 'Protein',    defaultUnit: 'lbs',      isDefault: true, useCount: 0 },
  { name: 'Chicken thighs',   category: 'Protein',    defaultUnit: 'lbs',      isDefault: true, useCount: 0 },
  { name: 'Ground beef',      category: 'Protein',    defaultUnit: 'lbs',      isDefault: true, useCount: 0 },
  { name: 'Salmon fillets',   category: 'Protein',    defaultUnit: 'pieces',   isDefault: true, useCount: 0 },
  { name: 'Shrimp',           category: 'Protein',    defaultUnit: 'lbs',      isDefault: true, useCount: 0 },
  { name: 'Pork chops',       category: 'Protein',    defaultUnit: 'pieces',   isDefault: true, useCount: 0 },
  { name: 'Steak',            category: 'Protein',    defaultUnit: 'pieces',   isDefault: true, useCount: 0 },
  { name: 'Sausages',         category: 'Protein',    defaultUnit: 'pieces',   isDefault: true, useCount: 0 },
  { name: 'Bacon',            category: 'Protein',    defaultUnit: 'lbs',      isDefault: true, useCount: 0 },
  { name: 'Edamame',          category: 'Produce',    defaultUnit: 'bags',     isDefault: true, useCount: 0 },
  { name: 'Peas',             category: 'Produce',    defaultUnit: 'bags',     isDefault: true, useCount: 0 },
  { name: 'Corn',             category: 'Produce',    defaultUnit: 'bags',     isDefault: true, useCount: 0 },
  { name: 'Spinach',          category: 'Produce',    defaultUnit: 'bags',     isDefault: true, useCount: 0 },
  { name: 'Broccoli',         category: 'Produce',    defaultUnit: 'bags',     isDefault: true, useCount: 0 },
  { name: 'Mixed vegetables', category: 'Produce',    defaultUnit: 'bags',     isDefault: true, useCount: 0 },
  { name: 'Berries',          category: 'Produce',    defaultUnit: 'bags',     isDefault: true, useCount: 0 },
  { name: 'Mango chunks',     category: 'Produce',    defaultUnit: 'bags',     isDefault: true, useCount: 0 },
  { name: 'Lasagna',          category: 'Full Meals', defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Soup',             category: 'Full Meals', defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Chili',            category: 'Full Meals', defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Curry',            category: 'Full Meals', defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Pasta sauce',      category: 'Full Meals', defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Stir fry',        category: 'Full Meals', defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Burritos',         category: 'Full Meals', defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Waffles',          category: 'Desserts',   defaultUnit: 'pieces',   isDefault: true, useCount: 0 },
  { name: 'Pie',              category: 'Desserts',   defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Ice cream',        category: 'Desserts',   defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Cookies',          category: 'Desserts',   defaultUnit: 'pieces',   isDefault: true, useCount: 0 },
  { name: 'Bread',            category: 'Other',      defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Tortillas',        category: 'Other',      defaultUnit: 'pieces',   isDefault: true, useCount: 0 },
  { name: 'Stocks / broth',   category: 'Other',      defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Butter',           category: 'Other',      defaultUnit: 'lbs',      isDefault: true, useCount: 0 },
];

// ── utils.js ──────────────────────────────────

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function today() {
  return toDateString(new Date());
}

function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function daysUntil(dateStr) {
  const target = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / 86400000);
}

function addMonths(dateStr, months) {
  const d = new Date(dateStr + 'T00:00:00');
  const targetMonth = d.getMonth() + months;
  const result = new Date(d);
  result.setMonth(targetMonth);
  if (result.getMonth() !== ((targetMonth % 12) + 12) % 12) {
    result.setDate(0);
  }
  return toDateString(result);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  const thisYear = new Date().getFullYear();
  const opts = d.getFullYear() === thisYear
    ? { month: 'short', day: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' };
  return d.toLocaleDateString('en-US', opts);
}

function getExpiryClass(days) {
  if (days <= 0)  return 'days-chip--past';
  if (days <= 7)  return 'days-chip--urgent';
  if (days <= 30) return 'days-chip--soon';
  return 'days-chip--ok';
}

function getDaysLabel(days) {
  if (days < 0)   return `${Math.abs(days)}d ago`;
  if (days === 0) return 'Today';
  if (days === 1) return '1 day';
  return `${days} days`;
}

function debounce(fn, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

function groupBy(array, keyFn) {
  return array.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

function escHtml(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── store.js ──────────────────────────────────

const STORE_KEYS = {
  inventory: 'frosttrack_inventory',
  shopping:  'frosttrack_shopping',
  items:     'frosttrack_items',
  settings:  'frosttrack_settings',
  use_log:   'frosttrack_use_log',
};

const DEFAULT_SETTINGS = {
  anthropicApiKey: '',
  categoryDefaults: { ...CATEGORY_DEFAULTS_MONTHS },
};

function storeRead(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function storeWrite(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  if (typeof _onStoreWrite === 'function') _onStoreWrite(key, value);
}

function initStore() {
  if (storeRead(STORE_KEYS.inventory) === null) storeWrite(STORE_KEYS.inventory, []);
  if (storeRead(STORE_KEYS.shopping)  === null) storeWrite(STORE_KEYS.shopping,  []);
  if (storeRead(STORE_KEYS.items)     === null) storeWrite(STORE_KEYS.items, DEFAULT_ITEMS.map(i => ({...i})));
  const existing = storeRead(STORE_KEYS.settings) || {};
  storeWrite(STORE_KEYS.settings, {
    ...DEFAULT_SETTINGS, ...existing,
    categoryDefaults: { ...DEFAULT_SETTINGS.categoryDefaults, ...(existing.categoryDefaults || {}) },
  });
}

function getInventory() {
  const items = storeRead(STORE_KEYS.inventory) || [];
  return [...items].sort((a, b) => {
    if (!a.useByDate) return 1;
    if (!b.useByDate) return -1;
    return a.useByDate.localeCompare(b.useByDate);
  });
}

function addInventoryItem(partial) {
  const items = storeRead(STORE_KEYS.inventory) || [];
  const item = { id: generateId(), name: '', category: 'Other', quantity: 1, unit: 'servings',
    staple: false, minQty: null, intendedFor: '',
    dateFrozen: today(), useByDate: '', addedAt: new Date().toISOString(), ...partial };
  items.push(item);
  storeWrite(STORE_KEYS.inventory, items);
  return item;
}

function updateInventoryItem(id, changes) {
  const items = storeRead(STORE_KEYS.inventory) || [];
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return;
  items[idx] = { ...items[idx], ...changes };
  storeWrite(STORE_KEYS.inventory, items);
}

function removeInventoryItem(id) {
  const items = storeRead(STORE_KEYS.inventory) || [];
  storeWrite(STORE_KEYS.inventory, items.filter(i => i.id !== id));
}

function getInventoryItem(id) {
  return (storeRead(STORE_KEYS.inventory) || []).find(i => i.id === id) || null;
}

function getShoppingList() { return storeRead(STORE_KEYS.shopping) || []; }

function addShoppingItem(partial) {
  const items = storeRead(STORE_KEYS.shopping) || [];
  const item = { id: generateId(), name: '', category: null, note: '', completed: false,
    addedAt: new Date().toISOString(), ...partial };
  items.push(item);
  storeWrite(STORE_KEYS.shopping, items);
  return item;
}

function updateShoppingItem(id, changes) {
  const items = storeRead(STORE_KEYS.shopping) || [];
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return;
  items[idx] = { ...items[idx], ...changes };
  storeWrite(STORE_KEYS.shopping, items);
}

function toggleShoppingItem(id) {
  const items = storeRead(STORE_KEYS.shopping) || [];
  const idx = items.findIndex(i => i.id === id);
  if (idx !== -1) { items[idx].completed = !items[idx].completed; storeWrite(STORE_KEYS.shopping, items); }
}

function removeShoppingItem(id) {
  storeWrite(STORE_KEYS.shopping, (storeRead(STORE_KEYS.shopping) || []).filter(i => i.id !== id));
}

function clearCompletedShopping() {
  storeWrite(STORE_KEYS.shopping, (storeRead(STORE_KEYS.shopping) || []).filter(i => !i.completed));
}

function getItemList() {
  return [...(storeRead(STORE_KEYS.items) || [])].sort((a, b) => {
    if (!a.isDefault && b.isDefault) return -1;
    if (a.isDefault && !b.isDefault) return 1;
    return (b.useCount || 0) - (a.useCount || 0);
  });
}

function getItemByName(name) {
  return (storeRead(STORE_KEYS.items) || []).find(i => i.name.toLowerCase() === name.toLowerCase()) || null;
}

function addToItemList(item) {
  const items = storeRead(STORE_KEYS.items) || [];
  if (items.find(i => i.name.toLowerCase() === item.name.toLowerCase())) return;
  items.push({ useCount: 0, isDefault: false, ...item });
  storeWrite(STORE_KEYS.items, items);
}

function removeFromItemList(name) {
  storeWrite(STORE_KEYS.items, (storeRead(STORE_KEYS.items) || []).filter(i => i.name.toLowerCase() !== name.toLowerCase()));
}

function incrementItemUseCount(name) {
  const items = storeRead(STORE_KEYS.items) || [];
  const idx = items.findIndex(i => i.name.toLowerCase() === name.toLowerCase());
  if (idx !== -1) { items[idx].useCount = (items[idx].useCount || 0) + 1; storeWrite(STORE_KEYS.items, items); }
}

function getSettings() { return storeRead(STORE_KEYS.settings) || { ...DEFAULT_SETTINGS }; }

function saveSettings(changes) {
  const current = getSettings();
  storeWrite(STORE_KEYS.settings, {
    ...current, ...changes,
    categoryDefaults: { ...current.categoryDefaults, ...(changes.categoryDefaults || {}) },
  });
}

function clearAllData() { Object.values(STORE_KEYS).forEach(k => localStorage.removeItem(k)); }

function getUseLog() { return storeRead(STORE_KEYS.use_log) || []; }
function appendUseLog(entry) {
  const log = getUseLog();
  log.unshift({ ...entry, usedAt: new Date().toISOString() });
  storeWrite(STORE_KEYS.use_log, log.slice(0, 100));
}

// ── claude.js ─────────────────────────────────

async function classifyItem(name, signal) {
  const settings = getSettings();
  if (!settings.anthropicApiKey) return null;
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', signal,
      headers: {
        'x-api-key': settings.anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514', max_tokens: 10,
        messages: [{ role: 'user', content: `Given the food item name "${name}", classify it into exactly one of these freezer categories: Protein, Produce, Full Meals, Desserts, Other. Respond with only the category name, nothing else.` }],
      }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    const text = data.content?.[0]?.text?.trim();
    return ['Protein','Produce','Full Meals','Desserts','Other'].includes(text) ? text : null;
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    return null;
  }
}

// ── components/bottomSheet.js ─────────────────

let _sheetOnSave = null;
let _sheetInitialized = false;

function initSheet() {
  if (_sheetInitialized) return;
  _sheetInitialized = true;
  document.getElementById('sheetBackdrop').addEventListener('click', hideSheet);
}

function showSheet(contentHTML, { onSave, onCancel } = {}) {
  initSheet();
  _sheetOnSave = onSave || null;
  const el = document.getElementById('bottomSheet');
  el.innerHTML = contentHTML;
  el.classList.add('is-open');
  document.getElementById('sheetBackdrop').classList.add('is-open');
  el.querySelector('[data-action="save"]')?.addEventListener('click', () => { if (_sheetOnSave) _sheetOnSave(); });
  el.querySelector('[data-action="cancel"]')?.addEventListener('click', () => { hideSheet(); if (onCancel) onCancel(); });
  setTimeout(() => el.querySelector('input, select, textarea')?.focus(), 340);
}

function hideSheet() {
  const el = document.getElementById('bottomSheet');
  el.classList.remove('is-open');
  document.getElementById('sheetBackdrop').classList.remove('is-open');
  el.addEventListener('transitionend', () => { el.innerHTML = ''; _sheetOnSave = null; }, { once: true });
}

// ── components/toast.js ───────────────────────

function showToast(message, { action, actionLabel = 'Add', duration = 4000 } = {}) {
  const container = document.getElementById('toastContainer');
  const existing = container.querySelectorAll('.toast');
  if (existing.length >= 3) dismissToast(existing[0]);

  const toast = document.createElement('div');
  toast.className = 'toast';
  const msgSpan = document.createElement('span');
  msgSpan.textContent = message;
  toast.appendChild(msgSpan);
  if (action) {
    const btn = document.createElement('button');
    btn.className = 'toast__action';
    btn.textContent = actionLabel;
    btn.addEventListener('click', () => { action(); dismissToast(toast); });
    toast.appendChild(btn);
  }
  container.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('is-visible')));
  toast._timer = setTimeout(() => dismissToast(toast), duration);
}

function dismissToast(toast) {
  clearTimeout(toast._timer);
  toast.classList.remove('is-visible');
  toast.addEventListener('transitionend', () => toast.remove(), { once: true });
}

// ── components/swipeReveal.js ─────────────────

let _openSwipeCard = null;

function initSwipeReveal(cardElement, { onUsedItAll, onDelete }) {
  const content = cardElement.querySelector('.swipe-card__content');
  if (!content) return;
  let startX = 0, startY = 0, currentX = 0, isDecided = false, isHorizontal = false;

  cardElement.querySelector('[data-swipe-action="used"]')?.addEventListener('click', e => {
    e.stopPropagation(); snapClose(); if (onUsedItAll) onUsedItAll();
  });
  cardElement.querySelector('[data-swipe-action="delete"]')?.addEventListener('click', e => {
    e.stopPropagation(); snapClose(); if (onDelete) onDelete();
  });

  content.addEventListener('touchstart', e => {
    const t = e.touches[0];
    startX = t.clientX; startY = t.clientY; currentX = 0; isDecided = false; isHorizontal = false;
    content.classList.remove('is-snapping'); content.classList.add('is-swiping');
  }, { passive: true });

  content.addEventListener('touchmove', e => {
    const t = e.touches[0];
    const dx = t.clientX - startX, dy = t.clientY - startY;
    if (!isDecided) {
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
      isDecided = true; isHorizontal = Math.abs(dx) > Math.abs(dy);
    }
    if (!isHorizontal) return;
    e.preventDefault();
    const offset = _openSwipeCard === cardElement ? -160 : 0;
    currentX = Math.min(0, Math.max(-160, dx + offset));
    content.style.transform = `translateX(${currentX}px)`;
  }, { passive: false });

  content.addEventListener('touchend', () => {
    content.classList.remove('is-swiping'); content.classList.add('is-snapping');
    if (currentX < -80) snapOpen(); else snapClose();
  }, { passive: true });

  document.addEventListener('swipeopen', e => { if (e.detail.card !== cardElement) snapClose(); });

  function snapOpen() {
    content.style.transform = 'translateX(-160px)';
    _openSwipeCard = cardElement;
    document.dispatchEvent(new CustomEvent('swipeopen', { detail: { card: cardElement } }));
  }
  function snapClose() {
    content.classList.add('is-snapping');
    content.style.transform = 'translateX(0)';
    if (_openSwipeCard === cardElement) _openSwipeCard = null;
  }
}

// ── tabs/home.js ──────────────────────────────

let _homeContainer = null;

function mountHome(el) {
  _homeContainer = el;
  el.innerHTML = `
    <div id="summaryStrip" class="summary-strip"></div>
    <div id="staplesSection"></div>
    <div id="expiringSection"></div>`;
  refreshHome();
}

function refreshHome() {
  if (!_homeContainer) return;
  const inventory  = getInventory();
  const shopping   = getShoppingList();
  const urgent     = inventory.filter(i => daysUntil(i.useByDate) <= 7).length;
  const lowStaples = inventory.filter(i => i.staple && i.minQty != null && i.quantity < i.minQty);

  // Summary strip — "Running Low" replaces "In Freezer"
  _homeContainer.querySelector('#summaryStrip').innerHTML = `
    <div class="summary-pill"><div class="summary-pill__val ${lowStaples.length > 0 ? 'has-alert' : ''}">${lowStaples.length}</div><div class="summary-pill__label">Running Low</div></div>
    <div class="summary-pill"><div class="summary-pill__val ${urgent > 0 ? 'has-alert' : ''}">${urgent}</div><div class="summary-pill__label">Expiring Soon</div></div>
    <div class="summary-pill"><div class="summary-pill__val">${shopping.filter(i=>!i.completed).length}</div><div class="summary-pill__label">To Buy</div></div>`;

  // ── Staples Running Low ──
  const staplesSection = _homeContainer.querySelector('#staplesSection');
  const staplesCollapsed = !!staplesSection.querySelector('.home-section.is-collapsed');
  if (lowStaples.length > 0) {
    let shtml = `<div class="home-section${staplesCollapsed ? ' is-collapsed' : ''}">
      <div class="home-section__hdr section-header">
        <span>⭐ Staples Running Low</span>
        <span class="section-chevron" style="${staplesCollapsed ? 'transform:rotate(-90deg)' : ''}">▾</span>
      </div>
      <div class="home-section__body">`;
    lowStaples.sort((a,b) => a.name.localeCompare(b.name)).forEach((item, i) => {
      shtml += `<div class="expiry-card animate-slide-up" style="--i:${i}">
        <div class="expiry-card__info">
          <div class="expiry-card__name">${escHtml(item.name)}</div>
          <div class="expiry-card__qty">${item.quantity} ${escHtml(item.unit)} · min ${item.minQty}</div>
        </div>
        <div class="staple-card-actions">
          <button class="btn btn--icon staple-inc-btn" data-id="${item.id}" title="Add one" style="font-size:18px;width:36px;height:36px">＋</button>
          <button class="btn btn--ghost staple-shop-btn" data-id="${item.id}" style="font-size:12px;padding:6px 10px;white-space:nowrap">Add to List</button>
        </div>
      </div>`;
    });
    shtml += `</div></div>`;
    staplesSection.innerHTML = shtml;

    staplesSection.querySelector('.home-section__hdr').addEventListener('click', () => {
      const collapsed = staplesSection.querySelector('.home-section').classList.toggle('is-collapsed');
      staplesSection.querySelector('.section-chevron').style.transform = collapsed ? 'rotate(-90deg)' : '';
    });
    staplesSection.querySelectorAll('.staple-shop-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = getInventoryItem(btn.dataset.id);
        if (item) showAddToShoppingSheet(item);
      });
    });
    staplesSection.querySelectorAll('.staple-inc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = getInventoryItem(btn.dataset.id);
        if (!item) return;
        const newQty = Math.round((item.quantity + 1) * 100) / 100;
        updateInventoryItem(item.id, { quantity: newQty });
        showToast(`${item.name}: ${newQty} ${item.unit}`);
        refreshHome();
        refreshInventory();
      });
    });
  } else {
    staplesSection.innerHTML = '';
  }

  // ── Expiring Soon ──
  const expiring = inventory.filter(i => daysUntil(i.useByDate) <= 30).sort((a,b) => a.useByDate.localeCompare(b.useByDate));
  const expiringSection = _homeContainer.querySelector('#expiringSection');
  const expiringCollapsed = !!expiringSection.querySelector('.home-section.is-collapsed');

  // Extra gap when both sections are visible
  expiringSection.style.marginTop = lowStaples.length > 0 ? '24px' : '';

  if (expiring.length === 0) {
    expiringSection.innerHTML = lowStaples.length === 0
      ? `<div class="empty-state" style="padding:32px 0 16px"><div class="empty-state__icon">✅</div><div class="empty-state__title">Your freezer looks good!</div><div class="empty-state__subtitle">Nothing expiring soon, no staples running low.</div></div>`
      : '';
    return;
  }
  let html = `<div class="home-section${expiringCollapsed ? ' is-collapsed' : ''}">
    <div class="home-section__hdr section-header">
      <span>⏰ Expiring Soon</span>
      <span class="section-chevron" style="${expiringCollapsed ? 'transform:rotate(-90deg)' : ''}">▾</span>
    </div>
    <div class="home-section__body">`;
  expiring.forEach((item, i) => {
    const days = daysUntil(item.useByDate);
    html += `<div class="expiry-card animate-slide-up" style="--i:${i}">
      <div class="expiry-card__info">
        <div class="expiry-card__name">${escHtml(item.name)}</div>
        <div class="expiry-card__qty"><span class="badge ${CATEGORY_BADGE_CLASS[item.category]||'badge--other'}">${item.category}</span>&nbsp;${item.quantity} ${escHtml(item.unit)}</div>
      </div>
      <span class="days-chip days-chip--large ${getExpiryClass(days)}">${getDaysLabel(days)}</span>
    </div>`;
  });
  html += `</div></div>`;
  expiringSection.innerHTML = html;

  expiringSection.querySelector('.home-section__hdr').addEventListener('click', () => {
    const collapsed = expiringSection.querySelector('.home-section').classList.toggle('is-collapsed');
    expiringSection.querySelector('.section-chevron').style.transform = collapsed ? 'rotate(-90deg)' : '';
  });
}

function showAddToShoppingSheet(item) {
  showSheet(`
    <div class="sheet-handle"></div>
    <div class="sheet-header"><h2>Add to Shopping List</h2><button class="btn btn--icon" data-action="cancel">✕</button></div>
    <div class="sheet-body">
      <p style="color:var(--color-text-secondary);font-size:13px;margin-bottom:16px">Edit name if needed (e.g. change "pasta sauce" to "canned tomatoes")</p>
      <div class="form-row"><div class="input-group"><label class="input-label">Item</label>
        <input class="input" id="shopNameInput" type="text" value="${escHtml(item.name)}" autocomplete="off">
      </div></div>
    </div>
    <div class="sheet-footer">
      <button class="btn btn--ghost" style="flex:1" data-action="cancel">Cancel</button>
      <button class="btn btn--primary" style="flex:2" id="shopAddConfirm">Add to List</button>
    </div>`, {
    onSave: () => {
      const name = document.getElementById('shopNameInput')?.value.trim();
      if (name) { addShoppingItem({ name, category: item.category }); refreshShopping(); showToast('Added to shopping list'); }
      hideSheet();
    },
  });
  setTimeout(() => {
    document.getElementById('shopAddConfirm')?.addEventListener('click', () => {
      const name = document.getElementById('shopNameInput')?.value.trim();
      if (name) { addShoppingItem({ name, category: item.category }); refreshShopping(); showToast('Added to shopping list'); }
      hideSheet();
    });
  }, 50);
}

// ── tabs/inventory.js ─────────────────────────

let _invContainer = null;
let _invListEl    = null;
let _invSearch    = '';

function mountInventory(el) {
  _invContainer = el;
  el.innerHTML = `
    <div class="search-wrap">
      <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      <input class="search-input" id="inventorySearch" type="search" placeholder="Search inventory…" autocomplete="off">
    </div>
    <div id="inventoryList"></div>`;
  _invListEl = el.querySelector('#inventoryList');
  el.querySelector('#inventorySearch').addEventListener('input', e => { _invSearch = e.target.value.trim().toLowerCase(); renderInventory(); });
  _invListEl.addEventListener('click', e => {
    const star    = e.target.closest('.star-btn');
    const minus   = e.target.closest('.minus-btn');
    const confirm = e.target.closest('[data-action="confirm-used"]');
    const cancel  = e.target.closest('[data-action="cancel-used"]');
    const card    = e.target.closest('.swipe-card__content');
    if (star)    { e.stopPropagation(); const item = getInventoryItem(star.dataset.id); if (item) { updateInventoryItem(item.id, {staple: !item.staple}); renderInventory(); refreshHome(); } return; }
    if (minus)   { e.stopPropagation(); invHandleDecrement(minus.dataset.id); return; }
    if (confirm) { e.stopPropagation(); invHandleUsedItAll(confirm.dataset.id); return; }
    if (cancel)  { e.stopPropagation(); const item = getInventoryItem(cancel.dataset.id); if (item) updateInventoryItem(item.id, {quantity:1}); renderInventory(); return; }
    if (card)    { openEditSheet(card.dataset.id); }
  });
  renderInventory();
}

function refreshInventory() { renderInventory(); }

function renderInventory() {
  if (!_invListEl) return;
  const all = getInventory();
  const filtered = _invSearch ? all.filter(i => i.name.toLowerCase().includes(_invSearch)) : all;
  if (all.length === 0) {
    _invListEl.innerHTML = `<div class="empty-state"><div class="empty-state__icon">🧊</div><div class="empty-state__title">Your freezer is empty</div><div class="empty-state__subtitle">Tap + to add your first item</div></div>`;
    return;
  }
  if (filtered.length === 0) {
    _invListEl.innerHTML = `<div class="empty-state"><div class="empty-state__icon">🔍</div><div class="empty-state__title">No items match</div><div class="empty-state__subtitle">"${escHtml(_invSearch)}"</div></div>`;
    return;
  }
  const staples    = filtered.filter(i => i.staple).sort((a, b) => a.name.localeCompare(b.name));
  const nonStaples = filtered.filter(i => !i.staple);
  const grouped    = groupBy(nonStaples, i => i.category);
  let html = '', idx = 0;
  if (staples.length > 0) {
    html += `<div class="section-header">⭐ Staples</div>`;
    staples.forEach(item => { html += renderInvCard(item, idx++); });
  }
  CATEGORIES.forEach(cat => {
    const items = grouped[cat];
    if (!items || !items.length) return;
    html += `<div class="section-header">${CATEGORY_ICONS[cat]} ${cat}</div>`;
    items.forEach(item => { html += renderInvCard(item, idx++); });
  });
  _invListEl.innerHTML = html;
  _invListEl.querySelectorAll('.swipe-card').forEach(cardEl => {
    const id = cardEl.dataset.id;
    initSwipeReveal(cardEl, { onUsedItAll: () => invHandleUsedItAll(id), onDelete: () => { removeInventoryItem(id); renderInventory(); } });
  });
}

function renderInvCard(item, index) {
  const days = daysUntil(item.useByDate);
  return `
    <div class="swipe-card animate-slide-up" data-id="${item.id}" style="--i:${index}">
      <div class="swipe-card__actions">
        <button class="swipe-action swipe-action--used" data-swipe-action="used"><span class="swipe-action__icon">✓</span><span>Used it</span></button>
        <button class="swipe-action swipe-action--delete" data-swipe-action="delete"><span class="swipe-action__icon">🗑</span><span>Delete</span></button>
      </div>
      <div class="swipe-card__content" data-id="${item.id}">
        <div class="swipe-card__main">
          <div class="swipe-card__meta" style="margin-bottom:6px"><span class="badge ${CATEGORY_BADGE_CLASS[item.category]||'badge--other'}">${item.category}</span></div>
          <div class="swipe-card__name">${escHtml(item.name)}</div>
          <div class="swipe-card__meta">
            <span class="swipe-card__qty">${item.quantity} ${escHtml(item.unit)}</span>
            <span class="swipe-card__date">${formatDate(item.useByDate)}</span>
          </div>
        </div>
        <div class="swipe-card__right">
          <button class="star-btn" data-id="${item.id}" title="Toggle staple">${item.staple ? '⭐' : '☆'}</button>
          <span class="days-chip ${getExpiryClass(days)}">${getDaysLabel(days)}</span>
          <button class="minus-btn" data-id="${item.id}">−</button>
        </div>
      </div>
    </div>`;
}

function invHandleDecrement(id) {
  const item = getInventoryItem(id);
  if (!item) return;
  // Show a "Use amount" sheet so the user can use full or fractional quantities
  const q = item.quantity;
  const half = Math.round(q / 2 * 4) / 4;   // nearest 0.25
  const chips = [
    q >= 0.5 && half > 0 && half < q ? { label: `½ (${half})`, val: half } : null,
    q >= 1                             ? { label: `1 ${item.unit}`, val: 1 } : null,
    { label: 'All', val: q },
  ].filter(Boolean);

  showSheet(`
    <div class="sheet-handle"></div>
    <div class="sheet-header"><h2>Using from ${escHtml(item.name)}</h2><button class="btn btn--icon" data-action="cancel">✕</button></div>
    <div class="sheet-body">
      <p style="color:var(--color-text-secondary);font-size:13px;margin-bottom:16px">Currently: <strong>${q} ${escHtml(item.unit)}</strong></p>
      <div class="form-row"><div class="input-group"><label class="input-label">Amount used</label>
        <input class="input" id="useAmt" type="number" min="0.25" max="${q}" step="0.25" value="1" style="text-align:center;font-size:18px">
      </div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
        ${chips.map(c => `<button class="chip" data-use-chip="${c.val}">${c.label}</button>`).join('')}
      </div>
    </div>
    <div class="sheet-footer">
      <button class="btn btn--ghost" style="flex:1" data-action="cancel">Cancel</button>
      <button class="btn btn--primary" style="flex:2" id="useConfirmBtn">Use it</button>
    </div>`, {
    onSave: () => {
      const amt = parseFloat(document.getElementById('useAmt')?.value) || 0;
      if (amt <= 0) { hideSheet(); return; }
      const remaining = Math.max(0, Math.round((q - amt) * 100) / 100);
      if (remaining <= 0) {
        hideSheet();
        invHandleUsedItAll(id);
      } else {
        updateInventoryItem(id, { quantity: remaining });
        hideSheet();
        renderInventory();
      }
    },
  });
  setTimeout(() => {
    // Quick-select chips
    document.querySelectorAll('[data-use-chip]').forEach(btn => {
      btn.addEventListener('click', () => { document.getElementById('useAmt').value = btn.dataset.useChip; });
    });
    // Wire save button
    document.getElementById('useConfirmBtn')?.addEventListener('click', () => {
      const amt = parseFloat(document.getElementById('useAmt')?.value) || 0;
      const remaining = Math.max(0, Math.round((q - amt) * 100) / 100);
      hideSheet();
      if (remaining <= 0) { invHandleUsedItAll(id); } else { updateInventoryItem(id, { quantity: remaining }); renderInventory(); }
    });
  }, 50);
}

function invHandleUsedItAll(id) {
  const item = getInventoryItem(id);
  if (!item) return;
  const { name, category, quantity, unit } = item;
  appendUseLog({ name, category, quantity, unit });
  removeInventoryItem(id);
  renderInventory();
  showToast(`Gone! Add ${name} to your shopping list?`, { actionLabel: 'Add', action: () => {
    const known = getItemByName(name);
    addShoppingItem({ name, category: known?.category || category });
    refreshShopping();
  }});
}

function openEditSheet(id) {
  const item = getInventoryItem(id);
  if (!item) return;
  const catOpts  = CATEGORIES.map(c => `<option value="${c}" ${c===item.category?'selected':''}>${c}</option>`).join('');
  const isCustomUnit = !ALL_UNITS.slice(0,-1).includes(item.unit);
  showSheet(`
    <div class="sheet-handle"></div>
    <div class="sheet-header"><h2>Edit Item</h2><button class="btn btn--icon" data-action="cancel">✕</button></div>
    <div class="sheet-body">
      <input type="hidden" id="editId" value="${item.id}">
      <div class="form-row"><div class="input-group"><label class="input-label">Name</label><input class="input" id="editName" type="text" value="${escHtml(item.name)}" autocomplete="off"></div></div>
      <div class="form-row"><div class="input-group"><label class="input-label">Category</label><select class="input" id="editCategory">${catOpts}</select></div></div>
      <div class="form-row"><div class="input-group" style="flex-direction:row;align-items:center;justify-content:space-between"><label class="input-label" style="margin:0">Staple item</label><input type="checkbox" id="editStaple" ${item.staple ? 'checked' : ''} style="width:20px;height:20px;accent-color:var(--color-accent)"></div></div>
      <div class="form-row form-row--inline">
        <div class="input-group"><label class="input-label">Quantity</label><input class="input" id="editQty" type="number" min="0" step="0.25" value="${item.quantity}"></div>
        <div class="input-group"><label class="input-label">Unit</label>
          <select class="input" id="editUnit">${unitOptsHtml(item.unit)}</select>
          <input class="input" id="editUnitCustom" type="text" placeholder="e.g. tray, bunch" value="${isCustomUnit ? escHtml(item.unit) : ''}" style="margin-top:6px;display:${isCustomUnit ? '' : 'none'}">
        </div>
      </div>
      <div class="form-row"><div class="input-group"><label class="input-label">Date Frozen</label><input class="input" id="editDateFrozen" type="date" value="${item.dateFrozen||''}"></div></div>
      <div class="form-row"><div class="input-group"><label class="input-label">Use By</label><input class="input" id="editUseBy" type="date" value="${item.useByDate||''}"></div></div>
    </div>
    <div class="sheet-footer">
      <button class="btn btn--ghost" style="flex:1" data-action="cancel">Cancel</button>
      <button class="btn btn--primary" style="flex:2" data-action="save">Save</button>
    </div>`, {
    onSave: () => {
      const el = document.getElementById('bottomSheet');
      const changes = {
        name:       el.querySelector('#editName').value.trim(),
        category:   el.querySelector('#editCategory').value,
        staple:     el.querySelector('#editStaple').checked,
        quantity:   parseFloat(el.querySelector('#editQty').value) || 1,
        unit:       el.querySelector('#editUnit').value === 'Custom…' ? (el.querySelector('#editUnitCustom').value.trim() || 'unit') : el.querySelector('#editUnit').value,
        dateFrozen: el.querySelector('#editDateFrozen').value,
        useByDate:  el.querySelector('#editUseBy').value,
      };
      if (!changes.name) return;
      updateInventoryItem(item.id, changes);
      hideSheet();
      renderInventory();
    },
  });
  setTimeout(() => {
    wireUnitCustom('editUnit', 'editUnitCustom');
  }, 50);
}

// ── tabs/add.js ───────────────────────────────

let _addContainer    = null;
let _addCategory     = null;
let _addQuantity     = 1;
let _classifyCtrl    = null;

function mountAdd(el) {
  _addContainer = el;
  el.innerHTML = `
    <h2 style="font-size:18px;font-weight:600;margin-bottom:20px">Add to Freezer</h2>
    <div class="form-row"><div class="input-group"><label class="input-label">Item Name</label>
      <div class="autocomplete-wrap">
        <input class="input" id="addName" type="text" placeholder="e.g. Chicken thighs" autocomplete="off" autocorrect="off">
        <ul class="autocomplete-list" id="addAutocomplete" hidden></ul>
      </div></div></div>
    <div class="form-row"><div class="input-label" style="margin-bottom:8px">Category</div>
      <div class="chip-group" id="catChips">
        ${CATEGORIES.map(c => `<button type="button" class="chip" data-cat="${c}">${CATEGORY_ICONS[c]} ${c}</button>`).join('')}
      </div></div>
    <div class="form-row"><div class="input-label" style="margin-bottom:8px">Quantity</div>
      <div style="display:flex;gap:12px;align-items:center">
        <div class="stepper">
          <button type="button" class="stepper__btn" id="addQtyMinus">−</button>
          <span class="stepper__val" id="addQtyVal">1</span>
          <button type="button" class="stepper__btn" id="addQtyPlus">+</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0;width:120px">
          <select class="input" id="addUnit"></select>
          <input class="input" id="addUnitCustom" type="text" placeholder="e.g. tray, bunch" style="display:none">
        </div>
      </div></div>
    <div class="form-row form-row--inline">
      <div class="input-group"><label class="input-label">Date Frozen</label><input class="input" id="addDateFrozen" type="date"></div>
      <div class="input-group"><label class="input-label">Use By</label><input class="input" id="addUseBy" type="date"></div>
    </div>
    <div class="form-row"><div class="input-group" style="flex-direction:row;align-items:center;justify-content:space-between"><label class="input-label" style="margin:0">Staple item</label><input type="checkbox" id="addStaple" style="width:20px;height:20px;accent-color:var(--color-accent)"></div></div>
    <div style="margin-top:8px"><button class="btn btn--primary" id="addSaveBtn" type="button">Save to Freezer</button></div>`;

  const nameInput = el.querySelector('#addName');
  const autocomplete = el.querySelector('#addAutocomplete');

  const debouncedClassify = debounce(async (name) => {
    if (!name || name.length < 3 || !getSettings().anthropicApiKey) return;
    if (_classifyCtrl) _classifyCtrl.abort();
    _classifyCtrl = new AbortController();
    el.querySelector('#catChips').classList.add('is-loading');
    try {
      const cat = await classifyItem(name, _classifyCtrl.signal);
      el.querySelector('#catChips').classList.remove('is-loading');
      if (cat) addSelectCategory(cat);
    } catch(e) {
      el.querySelector('#catChips').classList.remove('is-loading');
      if (e.name !== 'AbortError') console.warn('Classify failed', e);
    }
  }, 500);

  nameInput.addEventListener('input', e => {
    addPopulateAutocomplete(e.target.value.trim());
    debouncedClassify(e.target.value.trim());
  });
  nameInput.addEventListener('focusout', () => setTimeout(() => { autocomplete.hidden = true; }, 150));

  autocomplete.addEventListener('click', e => {
    const item = e.target.closest('.autocomplete-item');
    if (!item) return;
    nameInput.value = item.dataset.name;
    autocomplete.hidden = true;
    if (item.dataset.cat) addSelectCategory(item.dataset.cat);
  });

  el.querySelector('#catChips').addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (chip) addSelectCategory(chip.dataset.cat);
  });

  el.querySelector('#addQtyMinus').addEventListener('click', () => {
    _addQuantity = Math.max(0.5, _addQuantity - 1);
    el.querySelector('#addQtyVal').textContent = _addQuantity % 1 === 0 ? _addQuantity : _addQuantity.toFixed(1);
  });
  el.querySelector('#addQtyPlus').addEventListener('click', () => {
    _addQuantity += 1;
    el.querySelector('#addQtyVal').textContent = _addQuantity;
  });

  el.querySelector('#addSaveBtn').addEventListener('click', handleAddSave);
  addResetForm();
}

function refreshAdd() {}

function addPopulateAutocomplete(val) {
  const list = _addContainer.querySelector('#addAutocomplete');
  if (!val) { list.hidden = true; return; }
  const matches = getItemList().filter(i => i.name.toLowerCase().startsWith(val.toLowerCase())).slice(0, 8);
  if (!matches.length) { list.hidden = true; return; }
  list.innerHTML = matches.map(i => `<li class="autocomplete-item" data-name="${escHtml(i.name)}" data-cat="${escHtml(i.category||'')}"><span>${escHtml(i.name)}</span><span class="autocomplete-item__badge">${i.category||''}</span></li>`).join('');
  list.hidden = false;
}

function addSelectCategory(cat) {
  _addCategory = cat;
  _addContainer.querySelectorAll('#catChips .chip').forEach(c => c.classList.toggle('is-selected', c.dataset.cat === cat));
  const unitSel = _addContainer.querySelector('#addUnit');
  unitSel.innerHTML = ALL_UNITS.map(u => `<option value="${u}">${u}</option>`).join('');
  unitSel.value = DEFAULT_UNIT[cat] || 'servings';
  wireUnitCustom('addUnit', 'addUnitCustom');
  const settings = getSettings();
  const months = (settings.categoryDefaults && settings.categoryDefaults[cat]) || CATEGORY_DEFAULTS_MONTHS[cat] || 3;
  _addContainer.querySelector('#addUseBy').value = addMonths(today(), months);
}

function handleAddSave() {
  const nameInput = _addContainer.querySelector('#addName');
  const name = nameInput.value.trim();
  if (!name) { nameInput.focus(); nameInput.style.borderColor='var(--color-red)'; setTimeout(()=>nameInput.style.borderColor='',1500); return; }
  if (!_addCategory) {
    const chips = _addContainer.querySelector('#catChips');
    chips.style.outline='2px solid var(--color-red)'; chips.style.borderRadius='8px';
    setTimeout(()=>{ chips.style.outline=''; },1500); return;
  }
  const rawUnit    = _addContainer.querySelector('#addUnit')?.value || 'servings';
  const unit       = rawUnit === 'Custom…' ? (_addContainer.querySelector('#addUnitCustom')?.value.trim() || 'unit') : rawUnit;
  const dateFrozen = _addContainer.querySelector('#addDateFrozen').value || today();
  const useByDate  = _addContainer.querySelector('#addUseBy').value || addMonths(dateFrozen, CATEGORY_DEFAULTS_MONTHS[_addCategory]||3);
  const staple = _addContainer.querySelector('#addStaple')?.checked || false;

  // Check if this item already exists in inventory
  const existing = getInventory().filter(i => i.name.toLowerCase() === name.toLowerCase());
  if (existing.length > 0) {
    const ex = existing[0];
    showSheet(`
      <div class="sheet-handle"></div>
      <div class="sheet-header"><h2>Already in Freezer</h2><button class="btn btn--icon" data-action="cancel">✕</button></div>
      <div class="sheet-body">
        <p style="color:var(--color-text-secondary);font-size:14px;margin-bottom:20px">You already have <strong>${escHtml(ex.name)}</strong> in your freezer (${ex.quantity} ${escHtml(ex.unit)}).</p>
        <div style="display:flex;flex-direction:column;gap:10px">
          <button class="btn btn--primary" id="addToExisting">Add ${_addQuantity} ${escHtml(unit)} to existing (→ ${ex.quantity + _addQuantity} ${escHtml(ex.unit)})</button>
          <button class="btn btn--ghost" id="addAsNew">Create separate entry</button>
        </div>
      </div>`, {});
    setTimeout(() => {
      document.getElementById('addToExisting')?.addEventListener('click', () => {
        updateInventoryItem(ex.id, { quantity: ex.quantity + _addQuantity });
        hideSheet(); addResetForm();
        showToast(`Added ${_addQuantity} to existing ${escHtml(ex.name)}`);
        if (_invContainer) refreshInventory();
        refreshHome();
      });
      document.getElementById('addAsNew')?.addEventListener('click', () => {
        addInventoryItem({ name, category: _addCategory, quantity: _addQuantity, unit, dateFrozen, useByDate, staple });
        incrementItemUseCount(name);
        hideSheet(); addResetForm();
        showToast(`${escHtml(name)} added`);
        if (_invContainer) refreshInventory();
        refreshHome();
      });
    }, 50);
    return;
  }

  addInventoryItem({ name, category: _addCategory, quantity: _addQuantity, unit, dateFrozen, useByDate, staple });
  incrementItemUseCount(name);
  if (!getItemByName(name)) addToItemList({ name, category: _addCategory, defaultUnit: unit, isDefault: false, useCount: 1 });

  const btn = _addContainer.querySelector('#addSaveBtn');
  btn.textContent = 'Saved! ✓'; btn.disabled = true;
  setTimeout(() => { btn.textContent = 'Save to Freezer'; btn.disabled = false; addResetForm(); }, 1500);
  refreshHome(); refreshInventory();
}

function addResetForm() {
  if (!_addContainer) return;
  _addContainer.querySelector('#addName').value = '';
  _addContainer.querySelector('#addAutocomplete').hidden = true;
  _addContainer.querySelector('#addDateFrozen').value = today();
  _addQuantity = 1;
  _addContainer.querySelector('#addQtyVal').textContent = '1';
  _addCategory = null;
  _addContainer.querySelectorAll('#catChips .chip').forEach(c => c.classList.remove('is-selected'));
  _addContainer.querySelector('#addUnit').innerHTML = '';
  const customInp = _addContainer.querySelector('#addUnitCustom');
  if (customInp) { customInp.value = ''; customInp.style.display = 'none'; }
  const stapleChk = _addContainer.querySelector('#addStaple');
  if (stapleChk) stapleChk.checked = false;
  _addContainer.querySelector('#addUseBy').value = '';
  _addContainer.querySelector('#addName').focus();
}

// ── tabs/shopping.js ──────────────────────────

let _shopContainer = null;

function mountShopping(el) {
  _shopContainer = el;
  el.innerHTML = `
    <div class="shopping-add-row">
      <input class="input" id="shopAddInput" type="text" placeholder="Add item…" autocomplete="off">
      <button class="btn btn--ghost" id="shopAddBtn" style="flex-shrink:0">Add</button>
    </div>
    <div class="shopping-actions">
      <button class="btn btn--ghost" id="shopCopyBtn" style="flex:1">📋 Copy List</button>
      <button class="btn btn--ghost" id="shopClearBtn" style="flex:1">✓ Clear Done</button>
    </div>
    <div id="shopList"></div>`;

  const input = el.querySelector('#shopAddInput');
  const doAdd = () => {
    const name = input.value.trim();
    if (!name) return;
    const known = getItemByName(name);
    addShoppingItem({ name, category: known?.category || null });
    input.value = '';
    renderShoppingList();
  };
  el.querySelector('#shopAddBtn').addEventListener('click', doAdd);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') doAdd(); });
  el.querySelector('#shopCopyBtn').addEventListener('click', handleShopCopy);
  el.querySelector('#shopClearBtn').addEventListener('click', () => { clearCompletedShopping(); renderShoppingList(); });

  const list = el.querySelector('#shopList');
  list.addEventListener('change', e => {
    const cb = e.target.closest('.shopping-checkbox');
    if (cb) { toggleShoppingItem(cb.dataset.id); renderShoppingList(); }
  });
  list.addEventListener('click', e => {
    const del = e.target.closest('.shopping-item__delete');
    if (del) { removeShoppingItem(del.dataset.id); renderShoppingList(); }
  });
  list.addEventListener('blur', e => {
    const note = e.target.closest('.shopping-item__note');
    if (note) updateShoppingItem(note.dataset.id, { note: note.value });
  }, true);
  renderShoppingList();
}

function refreshShopping() { renderShoppingList(); }

function renderShoppingList() {
  const list = _shopContainer?.querySelector('#shopList');
  if (!list) return;
  const items = getShoppingList();
  if (!items.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-state__icon">🛒</div><div class="empty-state__title">Your list is empty</div><div class="empty-state__subtitle">Add items to buy at the store</div></div>`;
    return;
  }
  const uncompleted = items.filter(i => !i.completed);
  const completed   = items.filter(i => i.completed);
  const grouped     = groupBy(uncompleted, i => i.category || 'Other');
  let html = '';
  CATEGORIES.forEach(cat => {
    const catItems = grouped[cat];
    if (!catItems || !catItems.length) return;
    html += `<div class="section-header">${CATEGORY_ICONS[cat]} ${cat}</div><div class="settings-item" style="margin-bottom:8px">`;
    catItems.forEach(item => { html += renderShopItem(item); });
    html += `</div>`;
  });
  // Items with no category
  const noCat = uncompleted.filter(i => !i.category || !CATEGORIES.includes(i.category));
  if (noCat.length) {
    html += `<div class="section-header">📦 Other</div><div class="settings-item" style="margin-bottom:8px">`;
    noCat.forEach(item => { html += renderShopItem(item); });
    html += `</div>`;
  }
  if (completed.length) {
    html += `<div class="section-header" style="margin-top:16px">✓ Done</div><div class="settings-item" style="margin-bottom:8px">`;
    completed.forEach(item => { html += renderShopItem(item); });
    html += `</div>`;
  }
  list.innerHTML = html;
}

function renderShopItem(item) {
  return `<div class="shopping-item ${item.completed?'is-completed':''}" data-id="${item.id}">
    <input type="checkbox" class="shopping-checkbox" data-id="${item.id}" ${item.completed?'checked':''}>
    <div style="flex:1;min-width:0">
      <div class="shopping-item__name">${escHtml(item.name)}</div>
      <input type="text" class="shopping-item__note" data-id="${item.id}" value="${escHtml(item.note||'')}" placeholder="Add note…">
    </div>
    <button class="shopping-item__delete" data-id="${item.id}">✕</button>
  </div>`;
}

function handleShopCopy() {
  const items = getShoppingList().filter(i => !i.completed);
  if (!items.length) { showToast('Nothing on the list yet!'); return; }
  const grouped = groupBy(items, i => i.category || 'Other');
  let text = 'FrostTrack Shopping List\n';
  CATEGORIES.forEach(cat => {
    const catItems = grouped[cat];
    if (!catItems || !catItems.length) return;
    text += `\n${cat.toUpperCase()}\n`;
    catItems.forEach(i => { text += `- ${i.name}${i.note ? ` (${i.note})` : ''}\n`; });
  });
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!')).catch(() => fallbackCopy(text));
  } else { fallbackCopy(text); }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
  document.body.appendChild(ta); ta.focus(); ta.select();
  try { document.execCommand('copy'); showToast('Copied!'); } catch { showToast('Could not copy'); }
  ta.remove();
}

// ── tabs/plan.js (replaces meals) ─────────────

let _mealsContainer = null;

function mountMeals(el) {
  _mealsContainer = el;
  el.innerHTML = `<div id="planContent"></div>`;
  renderPlan();
}

function refreshMeals() { renderPlan(); }

function renderPlan() {
  const content = _mealsContainer?.querySelector('#planContent');
  if (!content) return;
  const inv = getInventory();
  let html = '';

  // Section 1: Use Soon (expiring within 30 days)
  const useSoon = inv.filter(i => { const d = daysUntil(i.useByDate); return d !== null && d <= 30; })
    .sort((a,b) => a.useByDate.localeCompare(b.useByDate));
  if (useSoon.length > 0) {
    html += `<div class="section-header">⏰ Use Soon</div>`;
    useSoon.forEach((item, i) => {
      const days = daysUntil(item.useByDate);
      html += `<div class="plan-row animate-slide-up" style="--i:${i}">
        <div class="plan-row__info">
          <div class="plan-row__name">${escHtml(item.name)}</div>
          <div class="plan-row__meta">${item.quantity} ${escHtml(item.unit)} · <span class="badge ${CATEGORY_BADGE_CLASS[item.category]||'badge--other'}">${item.category}</span></div>
        </div>
        <span class="days-chip ${getExpiryClass(days)}">${getDaysLabel(days)}</span>
      </div>`;
    });
  }

  // Section 2: Full Meals ready to heat
  const meals = inv.filter(i => i.category === 'Full Meals').sort((a,b) => a.useByDate.localeCompare(b.useByDate));
  if (meals.length > 0) {
    html += `<div class="section-header">🍱 Ready to Heat</div>`;
    meals.forEach((item, i) => {
      const days = daysUntil(item.useByDate);
      html += `<div class="plan-row animate-slide-up" style="--i:${i}">
        <div class="plan-row__info">
          <div class="plan-row__name">${escHtml(item.name)}</div>
          <div class="plan-row__meta">${item.quantity} ${escHtml(item.unit)}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="days-chip ${getExpiryClass(days)}">${getDaysLabel(days)}</span>
          <button class="btn btn--ghost" style="font-size:12px;padding:6px 10px" data-plan-used="${item.id}">Used</button>
        </div>
      </div>`;
    });
  }

  if (!html) {
    content.innerHTML = `<div class="empty-state"><div class="empty-state__icon">📋</div><div class="empty-state__title">Nothing to plan right now</div><div class="empty-state__subtitle">Items expiring soon and full meals will appear here.</div></div>`;
    return;
  }
  content.innerHTML = html;
  content.querySelectorAll('[data-plan-used]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = getInventoryItem(btn.dataset.planUsed);
      if (!item) return;
      invHandleUsedItAll(item.id);
      renderPlan();
    });
  });
}

// ── settings.js ───────────────────────────────

function initSettings(onClose) {
  const overlay  = document.getElementById('settingsOverlay');
  const settings = getSettings();
  const catDefs  = settings.categoryDefaults || CATEGORY_DEFAULTS_MONTHS;
  const items    = getItemList();
  const fbConfig = (settings.firebaseConfig && settings.firebaseConfig.apiKey)
    ? settings.firebaseConfig
    : (typeof BUILT_IN_FIREBASE_CONFIG !== 'undefined' ? BUILT_IN_FIREBASE_CONFIG : {});
  const hasConfig = !!(fbConfig.apiKey);

  // Auth status block
  let authBlock = '';
  if (!hasConfig) {
    authBlock = `
      <div class="settings-section">
        <h2>Sync (Firebase)</h2>
        <div class="settings-item">
          <div class="settings-row" style="flex-direction:column;align-items:flex-start;gap:10px">
            <p style="font-size:13px;color:var(--color-text-secondary)">Paste your Firebase config below to enable real-time sync across all your devices.</p>
            <textarea class="input" id="fbConfigInput" rows="6" placeholder='{"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}'
              style="font-size:11px;font-family:monospace;resize:vertical">${hasConfig ? JSON.stringify(fbConfig, null, 2) : ''}</textarea>
            <button class="btn btn--primary" id="fbSaveConfig" style="width:100%">Save &amp; Connect</button>
          </div>
        </div>
      </div>`;
  } else if (_fbUser) {
    authBlock = `
      <div class="settings-section">
        <h2>Sync</h2>
        <div class="settings-item">
          <div class="settings-row">
            <div>
              <div class="settings-row__label" style="color:var(--color-green)">✓ Synced</div>
              <div class="settings-row__sub">${escHtml(_fbUser.displayName || _fbUser.email || 'Signed in')}</div>
            </div>
            <button class="btn btn--ghost" id="fbSignOutBtn">Sign out</button>
          </div>
        </div>
      </div>`;
  } else {
    authBlock = `
      <div class="settings-section">
        <h2>Sync</h2>
        <div class="settings-item">
          <div class="settings-row" style="flex-direction:column;align-items:flex-start;gap:10px">
            <p style="font-size:13px;color:var(--color-text-secondary)">Sign in with Google to sync your freezer across all devices.</p>
            <button class="btn btn--primary" id="fbSignInBtn" style="width:100%">
              <svg width="18" height="18" viewBox="0 0 18 18" style="margin-right:6px"><path fill="#fff" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#fff" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01c-.72.48-1.63.76-2.7.76-2.07 0-3.82-1.4-4.45-3.27H1.87v2.07A8 8 0 0 0 8.98 17z"/><path fill="#fff" d="M4.53 10.54A4.8 4.8 0 0 1 4.28 9c0-.54.09-1.06.25-1.54V5.38H1.87A8 8 0 0 0 .98 9c0 1.29.31 2.51.89 3.61l2.66-2.07z"/><path fill="#fff" d="M8.98 3.58c1.16 0 2.2.4 3.02 1.19l2.26-2.26A8 8 0 0 0 1.87 5.38L4.53 7.46C5.16 5.59 6.91 3.58 8.98 3.58z"/></svg>
              Sign in with Google
            </button>
            <button class="btn btn--ghost" id="fbRemoveConfig" style="width:100%;font-size:12px">Remove Firebase config</button>
          </div>
        </div>
      </div>`;
  }

  overlay.innerHTML = `
    <div class="settings-header">
      <h1>Settings</h1>
      <button class="btn btn--icon" id="settingsClose">✕</button>
    </div>
    <div class="settings-body">
      ${authBlock}
      <div class="settings-section">
        <h2>Anthropic API Key</h2>
        <div class="settings-item">
          <div class="settings-row" style="flex-direction:column;align-items:flex-start;gap:8px">
            <div class="api-key-wrap" style="width:100%">
              <input class="input" id="apiKeyInput" type="password" value="${escHtml(settings.anthropicApiKey||'')}" placeholder="sk-ant-…" autocomplete="off" spellcheck="false">
              <button class="api-key-toggle" id="apiKeyToggle" type="button">Show</button>
            </div>
            <p style="font-size:12px;color:var(--color-text-secondary)">Used only for auto-categorizing items. Optional — you can always set categories manually.</p>
          </div>
        </div>
      </div>
      <div class="settings-section">
        <h2>Default Use-By Duration</h2>
        <div class="settings-item">
          ${CATEGORIES.map(cat => `<div class="settings-row"><div><div class="settings-row__label">${cat}</div><div class="settings-row__sub">months until use-by</div></div><div class="settings-row__right"><input class="input" type="number" min="1" max="24" data-cat="${cat}" value="${catDefs[cat]||CATEGORY_DEFAULTS_MONTHS[cat]}" style="width:64px;text-align:center;padding:6px 8px"></div></div>`).join('')}
        </div>
      </div>
      <div class="settings-section">
        <h2>Item List (${items.length} items)</h2>
        <div class="settings-item" style="max-height:300px;overflow-y:auto" id="settingsItemList">
          ${items.map(i => `<div class="item-list-item"><span class="item-list-item__name">${escHtml(i.name)}</span><span class="item-list-item__badge">${i.category||''}</span><button class="btn btn--icon" data-remove-item="${escHtml(i.name)}" style="color:var(--color-text-secondary)">✕</button></div>`).join('')}
        </div>
      </div>
      <div class="settings-section">
        <h2>Staple Minimums</h2>
        <div class="settings-item" id="stapleMinList">
          ${(function() {
            const staples = (storeRead(STORE_KEYS.inventory) || []).filter(i => i.staple).sort((a,b) => a.name.localeCompare(b.name));
            if (!staples.length) return '<p style="font-size:13px;color:var(--color-text-secondary)">No staples yet. Star an item in inventory to mark it as a staple.</p>';
            return staples.map(item => `
              <div class="settings-row" style="padding:8px 0">
                <div><div class="settings-row__label">${escHtml(item.name)}</div><div class="settings-row__sub">${item.quantity} ${escHtml(item.unit)} on hand</div></div>
                <div class="settings-row__right"><input class="input" type="number" min="0" step="0.5" placeholder="min" data-staple-min="${item.id}" value="${item.minQty != null ? item.minQty : ''}" style="width:64px;text-align:center;padding:6px 8px"></div>
              </div>`).join('');
          })()}
        </div>
      </div>
      <div class="settings-section">
        <h2>Data</h2>
        <div class="settings-item"><div class="settings-row"><div><div class="settings-row__label">Clear all data</div><div class="settings-row__sub">Removes all inventory, shopping, and custom items</div></div><button class="btn btn--danger" id="clearDataBtn">Clear</button></div></div>
      </div>
    </div>`;

  overlay.classList.add('is-open');

  // Collapsible sections — click h2 to toggle
  overlay.querySelectorAll('.settings-section h2').forEach(h2 => {
    h2.style.cursor = 'pointer';
    h2.style.display = 'flex';
    h2.style.justifyContent = 'space-between';
    h2.style.alignItems = 'center';
    const chevron = document.createElement('span');
    chevron.textContent = '▾';
    chevron.style.fontSize = '12px';
    chevron.style.transition = 'transform 0.2s';
    h2.appendChild(chevron);
    h2.addEventListener('click', () => {
      const section = h2.closest('.settings-section');
      const isCollapsed = section.classList.toggle('is-collapsed');
      chevron.style.transform = isCollapsed ? 'rotate(-90deg)' : '';
    });
  });

  overlay.querySelector('#settingsClose').addEventListener('click', () => { overlay.classList.remove('is-open'); if (onClose) onClose(); });

  const apiInput  = overlay.querySelector('#apiKeyInput');
  const apiToggle = overlay.querySelector('#apiKeyToggle');
  apiToggle.addEventListener('click', () => { const isPass = apiInput.type==='password'; apiInput.type=isPass?'text':'password'; apiToggle.textContent=isPass?'Hide':'Show'; });
  apiInput.addEventListener('blur', () => saveSettings({ anthropicApiKey: apiInput.value.trim() }));

  overlay.querySelectorAll('input[data-cat]').forEach(input => {
    input.addEventListener('change', () => {
      const val = parseInt(input.value, 10);
      if (val >= 1 && val <= 24) saveSettings({ categoryDefaults: { [input.dataset.cat]: val } });
    });
  });

  overlay.querySelector('#settingsItemList').addEventListener('click', e => {
    const btn = e.target.closest('[data-remove-item]');
    if (!btn) return;
    removeFromItemList(btn.dataset.removeItem);
    btn.closest('.item-list-item').remove();
  });

  overlay.querySelector('#clearDataBtn').addEventListener('click', () => {
    if (!confirm('Delete ALL inventory, shopping list, and custom items? This cannot be undone.')) return;
    // Prevent empty arrays from propagating to Firestore during re-init
    _syncing = true;
    clearAllData(); initStore();
    _syncing = false;
    overlay.classList.remove('is-open');
    _mounted.clear(); switchTab('home');
  });

  overlay.querySelectorAll('input[data-staple-min]').forEach(input => {
    input.addEventListener('change', () => {
      const val = input.value.trim();
      const minQty = val === '' ? null : parseFloat(val);
      updateInventoryItem(input.dataset.stapleMin, { minQty });
    });
  });

  // Firebase buttons
  overlay.querySelector('#fbSaveConfig')?.addEventListener('click', () => {
    const raw = overlay.querySelector('#fbConfigInput')?.value.trim();
    if (!raw) return;
    try {
      // Strip code fences, "const x = ", trailing semicolons, whitespace
      let cleaned = raw.trim()
        .replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '')  // strip ``` fences
        .replace(/^[\s\S]*?const\s+\w+\s*=\s*/, '')          // strip "const x = "
        .replace(/;?\s*$/, '').trim();                         // strip trailing ;

      // Extract { } block if there's surrounding text
      const braceMatch = cleaned.match(/\{[\s\S]*\}/);
      if (braceMatch) cleaned = braceMatch[0];

      // Strip markdown link format [text](url) → url  (Claude chat renders URLs as links)
      cleaned = cleaned.replace(/\[([^\]]*)\]\(([^)]*)\)/g, '$2');

      // Quote any unquoted JS object keys
      cleaned = cleaned
        .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
        .replace(/'/g, '"');

      const config = JSON.parse(cleaned);
      if (!config.apiKey || !config.projectId) { alert('Invalid config — make sure you pasted the full firebaseConfig object.'); return; }
      saveSettings({ firebaseConfig: config });
      fbInit(config);
      initSettings(onClose);
    } catch(e) { alert('Could not parse config.\n\nTip: paste only the { } block with no surrounding text.'); }
  });

  overlay.querySelector('#fbSignInBtn')?.addEventListener('click', () => { fbSignInWithGoogle(); });
  overlay.querySelector('#fbSignOutBtn')?.addEventListener('click', () => { fbSignOut(); });
  overlay.querySelector('#fbRemoveConfig')?.addEventListener('click', () => {
    if (!confirm('Remove Firebase config? Sync will stop but your local data stays.')) return;
    fbStopListeners(); _db = null; _auth = null; _fbUser = null;
    saveSettings({ firebaseConfig: {} });
    initSettings(onClose);
  });
}

// ── app.js (router) ───────────────────────────

const TAB_CONFIG = {
  home:      { title: 'FrostTrack', mount: mountHome,      refresh: refreshHome },
  inventory: { title: 'Inventory',  mount: mountInventory, refresh: refreshInventory },
  add:       { title: 'Add Item',   mount: mountAdd,       refresh: refreshAdd },
  shopping:  { title: 'Shopping',   mount: mountShopping,  refresh: refreshShopping },
  meals:     { title: 'Plan',       mount: mountMeals,     refresh: refreshMeals },
};

const _mounted = new Set();
let _activeTab = null;

function switchTab(tabId, mealsMode) {
  if (tabId === _activeTab && !mealsMode) return;
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('is-active'));
  document.querySelector(`#tab-${tabId}`)?.classList.add('is-active');
  document.querySelectorAll('.bottom-nav__item').forEach(b => b.classList.toggle('is-active', b.dataset.tab === tabId));
  const config    = TAB_CONFIG[tabId];
  const container = document.querySelector(`#tab-${tabId}`);
  if (!config || !container) return;
  if (!_mounted.has(tabId)) { config.mount(container); _mounted.add(tabId); }
  else { config.refresh(); }
  if (tabId === 'meals' && mealsMode) setMealsMode(mealsMode);
  document.querySelector('.app-header__title').textContent = config.title;
  _activeTab = tabId;
  document.querySelector('.tab-content')?.scrollTo(0, 0);
}

window.switchToTab = switchTab;

document.querySelector('.bottom-nav').addEventListener('click', e => {
  const btn = e.target.closest('[data-tab]');
  if (btn) switchTab(btn.dataset.tab);
});

document.querySelector('.gear-btn').addEventListener('click', () => {
  try {
    initSettings(() => { if (_activeTab) TAB_CONFIG[_activeTab]?.refresh(); });
  } catch(e) { alert('Settings error: ' + e.message); console.error(e); }
});

// ── Boot ──────────────────────────────────────
initStore();
switchTab('home');

// ── Firebase Sync ─────────────────────────────
// All Firebase logic lives here. The store's storeWrite
// calls _onStoreWrite (set below) to mirror writes to Firestore.

var _db          = null;
var _auth        = null;
var _fbUser      = null;
var _fbListeners = [];   // unsubscribe functions
var _syncing     = false; // prevent feedback loops

// Called by storeWrite on every localStorage change
function _onStoreWrite(key, value) {
  if (!_db || !_fbUser || _syncing) return;
  // Never silently erase inventory in Firestore with an empty array
  if (key === STORE_KEYS.inventory && Array.isArray(value) && value.length === 0) return;
  const docName = key.replace('frosttrack_', '');
  _db.collection('users').doc(_fbUser.uid)
    .collection('data').doc(docName)
    .set({ value })
    .catch(e => console.warn('Firestore write failed', e));
}

function fbInit(config) {
  if (!window.firebase) { console.warn('Firebase SDK not loaded'); return; }
  try {
    // Avoid re-initialising if already done
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    _db   = firebase.firestore();
    _auth = firebase.auth();

    // Keep login alive across refreshes and app restarts
    _auth.setPersistence('local').catch(() => {});

    _auth.onAuthStateChanged(user => {
      _fbUser = user;
      if (user) {
        fbLoadAndListen(user.uid);
        fbUpdateAuthUI(user);
      } else {
        fbStopListeners();
        fbUpdateAuthUI(null);
      }
    });
  } catch(e) { console.error('Firebase init failed', e); }
}

async function fbLoadAndListen(uid) {
  const keys = ['inventory', 'shopping', 'items', 'settings'];

  // Stop any previous listeners
  fbStopListeners();

  // First pass: load current Firestore data
  const ref = _db.collection('users').doc(uid).collection('data');
  const snap = await ref.get().catch(() => null);

  if (snap && !snap.empty) {
    // Firestore has data — it's the source of truth
    _syncing = true;
    snap.forEach(doc => {
      const storeKey = 'frosttrack_' + doc.id;
      if (doc.data().value !== undefined) {
        try { localStorage.setItem(storeKey, JSON.stringify(doc.data().value)); } catch {}
      }
    });
    _syncing = false;
    refreshAllTabs();
  } else {
    // Firestore empty — push local data up (first sign-in)
    keys.forEach(k => {
      const local = localStorage.getItem('frosttrack_' + k);
      if (local) {
        try {
          ref.doc(k).set({ value: JSON.parse(local) });
        } catch {}
      }
    });
  }

  // Real-time listeners for live sync from other devices
  keys.forEach(k => {
    const unsub = ref.doc(k).onSnapshot(doc => {
      if (!doc.exists || _syncing) return;
      _syncing = true;
      try { localStorage.setItem('frosttrack_' + k, JSON.stringify(doc.data().value)); } catch {}
      _syncing = false;
      refreshAllTabs();
    });
    _fbListeners.push(unsub);
  });
}

function fbStopListeners() {
  _fbListeners.forEach(u => u());
  _fbListeners = [];
}

function refreshAllTabs() {
  if (_homeContainer)    refreshHome();
  if (_invContainer)     refreshInventory();
  if (_shopContainer)    refreshShopping();
  if (_mealsContainer)   refreshMeals();
}

function fbSignInWithGoogle() {
  if (!_auth) return;
  const provider = new firebase.auth.GoogleAuthProvider();
  _auth.signInWithPopup(provider).catch(e => console.warn('Sign-in failed', e));
}

function fbSignOut() {
  if (!_auth) return;
  _auth.signOut();
}

function fbUpdateAuthUI(user) {
  // Refresh settings panel if it's open
  const overlay = document.getElementById('settingsOverlay');
  if (overlay.classList.contains('is-open')) {
    initSettings(() => { if (_activeTab) TAB_CONFIG[_activeTab]?.refresh(); });
  }
}


// Auto-init Firebase: use saved config if present, otherwise use built-in
(function() {
  const settings = storeRead(STORE_KEYS.settings) || {};
  const config = (settings.firebaseConfig && settings.firebaseConfig.apiKey)
    ? settings.firebaseConfig
    : BUILT_IN_FIREBASE_CONFIG;
  // Save built-in config so settings UI shows it as connected
  if (!settings.firebaseConfig || !settings.firebaseConfig.apiKey) saveSettings({ firebaseConfig: config });
  function tryInit() {
    if (window.firebase) { fbInit(config); }
    else { setTimeout(tryInit, 200); }
  }
  tryInit();
})();
