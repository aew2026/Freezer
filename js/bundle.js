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
const ALL_UNITS = ['lbs', 'oz', 'g', 'pieces', 'servings', 'bags', 'cups', 'Custom…'];

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

// Reduce a word to a rough stem so plurals & common suffixes match
function normalizeName(s) {
  s = (s || '').toLowerCase().trim().replace(/\s+/g, ' ');
  if (s.length > 5 && s.endsWith('ies')) return s.slice(0, -3) + 'y'; // berries→berry
  if (s.length > 5 && s.endsWith('ves')) return s.slice(0, -3) + 'f'; // leaves→leaf
  if (s.length > 4 && s.endsWith('es'))  return s.slice(0, -2);        // tomatoes→tomato
  if (s.length > 3 && s.endsWith('s'))   return s.slice(0, -1);        // carrots→carrot
  return s;
}

// Standard Levenshtein edit distance (O(n) space)
function editDistance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const row = Array.from({length: b.length + 1}, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]; row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = a[i-1] === b[j-1] ? prev : 1 + Math.min(prev, row[j], row[j-1]);
      prev = tmp;
    }
  }
  return row[b.length];
}

// Returns 'exact' | 'plural' | 'fuzzy' | null compared to a list of name strings
function fuzzyMatchName(input, candidates) {
  const raw   = input.toLowerCase().trim();
  const normd = normalizeName(input);
  for (const c of candidates) {
    if (c.toLowerCase().trim() === raw)   return { kind: 'exact',  match: c };
    if (normalizeName(c) === normd)        return { kind: 'plural', match: c };
  }
  for (const c of candidates) {
    if (editDistance(normalizeName(c), normd) <= 2) return { kind: 'fuzzy', match: c };
  }
  return null;
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
  const normd = normalizeName(partial.name || '');
  // Never add a duplicate (exact or plural) of an active (uncompleted) item
  if (normd && items.find(i => !i.completed && normalizeName(i.name) === normd)) return null;
  const item = { id: generateId(), name: '', category: null, note: '', completed: false,
    addedAt: new Date().toISOString(), ...partial };
  items.push(item);
  storeWrite(STORE_KEYS.shopping, items);
  return item;
}

// Deduplicate any existing shopping list data in-place (writes back if changed)
function deduplicateShoppingList() {
  const items = storeRead(STORE_KEYS.shopping) || [];
  const seen = new Set();
  const deduped = items.filter(i => {
    const key = normalizeName(i.name) + ':' + (i.completed ? '1' : '0');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (deduped.length < items.length) {
    storeWrite(STORE_KEYS.shopping, deduped);
    return true;
  }
  return false;
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
  el.querySelectorAll('[data-action="cancel"]').forEach(btn => btn.addEventListener('click', () => { hideSheet(); if (onCancel) onCancel(); }));
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

let _homeContainer  = null;
let _homeCollapsed  = { staples: false, expiring: false };

function mountHome(el) {
  _homeContainer = el;
  el.innerHTML = `
    <div id="summaryStrip" class="summary-strip"></div>
    <div id="syncBanner"></div>
    <div id="staplesSection"></div>
    <div id="expiringSection"></div>`;
  refreshHome();
}

function refreshHome() {
  if (!_homeContainer) return;
  const inventory  = getInventory();
  const shopping   = getShoppingList();
  const urgent     = inventory.filter(i => daysUntil(i.useByDate) <= 7).length;

  // Option A: aggregate quantities across all items with same normalized name for staple minimum check
  const stapleGroups = {};
  inventory.filter(i => i.staple).forEach(i => {
    const key = normalizeName(i.name);
    if (!stapleGroups[key]) {
      stapleGroups[key] = { name: i.name, totalQty: 0, minQty: i.minQty, unit: i.unit, firstId: i.id };
    }
    stapleGroups[key].totalQty = Math.round((stapleGroups[key].totalQty + (i.quantity || 0)) * 100) / 100;
  });
  const lowStapleGroups = Object.values(stapleGroups)
    .filter(g => g.minQty != null && g.totalQty < g.minQty)
    .sort((a, b) => a.name.localeCompare(b.name));

  // Summary strip — tappable shortcuts
  _homeContainer.querySelector('#summaryStrip').innerHTML = `
    <button class="summary-pill" data-pill-nav="inventory"><div class="summary-pill__val ${lowStapleGroups.length > 0 ? 'has-alert' : ''}">${lowStapleGroups.length}</div><div class="summary-pill__label">Running Low</div></button>
    <button class="summary-pill" data-pill-nav="meals"><div class="summary-pill__val ${urgent > 0 ? 'has-alert' : ''}">${urgent}</div><div class="summary-pill__label">Expiring Soon</div></button>
    <button class="summary-pill" data-pill-nav="shopping"><div class="summary-pill__val">${shopping.filter(i=>!i.completed).length}</div><div class="summary-pill__label">To Buy</div></button>`;
  _homeContainer.querySelectorAll('[data-pill-nav]').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.pillNav));
  });

  // ── Sync banner ──
  const syncBanner = _homeContainer.querySelector('#syncBanner');
  if (syncBanner) {
    if (_auth && !_fbUser) {
      syncBanner.innerHTML = `<div style="background:var(--color-surface-2);border:1px solid var(--color-border);border-radius:8px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;font-size:13px">
        <span style="color:var(--color-text-secondary)">⚠ Not signed in — changes won't sync</span>
        <button class="btn btn--ghost" id="homeSyncBtn" style="font-size:12px;padding:4px 10px;flex-shrink:0;margin-left:10px">Sign in</button>
      </div>`;
      syncBanner.querySelector('#homeSyncBtn').addEventListener('click', () => initSettings(() => refreshAllTabs()));
    } else {
      syncBanner.innerHTML = '';
    }
  }

  // ── Staples (running-low only) ──
  const staplesSection = _homeContainer.querySelector('#staplesSection');
  if (lowStapleGroups.length > 0) {
    let shtml = `<div class="home-section">
      <div class="home-section__hdr section-header" style="cursor:pointer;display:flex;align-items:center;justify-content:space-between;user-select:none">
        <span>⭐ Running Low</span>
        <span class="section-chevron" style="font-size:12px;transition:transform 0.2s">▾</span>
      </div>
      <div class="home-section__body">`;
    lowStapleGroups.forEach((g, i) => {
      const minLabel = ` · min ${g.minQty}`;
      shtml += `<div class="expiry-card animate-slide-up" style="--i:${i};border-color:var(--color-red)">
        <div class="expiry-card__info">
          <div class="expiry-card__name">${escHtml(g.name)} <span style="font-size:10px;font-weight:600;background:var(--color-red);color:#fff;padding:1px 5px;border-radius:99px">LOW</span></div>
          <div class="expiry-card__qty">${g.totalQty} ${escHtml(g.unit)}${minLabel}</div>
        </div>
        <div class="staple-card-actions">
          <button class="btn btn--icon staple-inc-btn" data-id="${g.firstId}" title="Restock" style="font-size:18px;width:36px;height:36px">＋</button>
          <button class="btn btn--ghost staple-shop-btn" data-id="${g.firstId}" style="font-size:12px;padding:6px 10px;white-space:nowrap">Add to List</button>
        </div>
      </div>`;
    });
    shtml += `</div></div>`;
    staplesSection.innerHTML = shtml;

    // Apply saved collapse state, then wire toggle
    const staplesBody    = staplesSection.querySelector('.home-section__body');
    const staplesChevron = staplesSection.querySelector('.section-chevron');
    if (_homeCollapsed.staples) { staplesBody.style.display = 'none'; staplesChevron.style.transform = 'rotate(-90deg)'; }
    staplesSection.querySelector('.home-section__hdr').addEventListener('click', () => {
      _homeCollapsed.staples = !_homeCollapsed.staples;
      staplesBody.style.display      = _homeCollapsed.staples ? 'none' : '';
      staplesChevron.style.transform = _homeCollapsed.staples ? 'rotate(-90deg)' : '';
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
        showRestockSheet(item, () => { refreshHome(); if (_invContainer) refreshInventory(); });
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
  expiringSection.style.marginTop = lowStapleGroups.length > 0 ? '24px' : '';

  if (expiring.length === 0) {
    expiringSection.innerHTML = lowStapleGroups.length === 0
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

  // Apply saved collapse state, then wire toggle
  const expBody    = expiringSection.querySelector('.home-section__body');
  const expChevron = expiringSection.querySelector('.section-chevron');
  if (_homeCollapsed.expiring) { expBody.style.display = 'none'; expChevron.style.transform = 'rotate(-90deg)'; }
  expiringSection.querySelector('.home-section__hdr').addEventListener('click', () => {
    _homeCollapsed.expiring = !_homeCollapsed.expiring;
    expBody.style.display    = _homeCollapsed.expiring ? 'none' : '';
    expChevron.style.transform = _homeCollapsed.expiring ? 'rotate(-90deg)' : '';
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
      if (name) {
        const added = addShoppingItem({ name, category: item.category });
        if (added) { refreshShopping(); showToast('Added to shopping list'); }
        else { showToast(`"${name}" is already on your list`); }
      }
      hideSheet();
    },
  });
  setTimeout(() => {
    document.getElementById('shopAddConfirm')?.addEventListener('click', () => {
      const name = document.getElementById('shopNameInput')?.value.trim();
      if (name) {
        const added = addShoppingItem({ name, category: item.category });
        if (added) { refreshShopping(); showToast('Added to shopping list'); }
        else { showToast(`"${name}" is already on your list`); }
      }
      hideSheet();
    });
  }, 50);
}

// ── tabs/inventory.js ─────────────────────────

let _invContainer = null;
let _invListEl    = null;
let _invSearch    = '';
let _invCollapsed = {}; // { sectionKey: true/false }

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
    // Section header collapse (handled here in the permanent listener, not per-render)
    const hdr = e.target.closest('.inv-section__hdr');
    if (hdr) {
      const sec     = hdr.closest('.inv-section');
      const key     = sec && sec.dataset.sk;
      const body    = sec && sec.querySelector('.inv-section__body');
      const chevron = hdr.querySelector('.section-chevron');
      if (!key || !body) return;
      _invCollapsed[key] = !_invCollapsed[key];
      body.style.display      = _invCollapsed[key] ? 'none' : '';
      chevron.style.transform = _invCollapsed[key] ? 'rotate(-90deg)' : '';
      return;
    }
    const star    = e.target.closest('.star-btn');
    const restock = e.target.closest('.restock-btn');
    const minus   = e.target.closest('.minus-btn');
    const confirm = e.target.closest('[data-action="confirm-used"]');
    const cancel  = e.target.closest('[data-action="cancel-used"]');
    const card    = e.target.closest('.swipe-card__content');
    if (star)    { e.stopPropagation(); const item = getInventoryItem(star.dataset.id); if (item) { updateInventoryItem(item.id, {staple: !item.staple}); renderInventory(); refreshHome(); } return; }
    if (restock) { e.stopPropagation(); invHandleRestock(restock.dataset.id); return; }
    if (minus)   { e.stopPropagation(); invHandleDecrement(minus.dataset.id); return; }
    if (confirm) { e.stopPropagation(); invHandleUsedItAll(confirm.dataset.id); return; }
    if (cancel)  { e.stopPropagation(); const item = getInventoryItem(cancel.dataset.id); if (item) updateInventoryItem(item.id, {quantity:1}); renderInventory(); return; }
    if (card)    { openEditSheet(card.dataset.id); }
  });
  renderInventory();
}

function refreshInventory() { renderInventory(); }

function maybeShowSwipeHint() {
  try { if (localStorage.getItem('ft_swipe_hinted')) return; } catch(e) { return; }
  const firstContent = _invListEl?.querySelector('.swipe-card__content');
  if (!firstContent) return;
  try { localStorage.setItem('ft_swipe_hinted', '1'); } catch(e) {}
  setTimeout(() => {
    firstContent.style.transition = 'transform 0.45s ease';
    firstContent.style.transform  = 'translateX(-72px)';
    setTimeout(() => {
      firstContent.style.transform = 'translateX(0)';
      setTimeout(() => { firstContent.style.transition = ''; }, 450);
    }, 650);
  }, 900);
}

function renderInventory() {
  if (!_invListEl) return;
  const all      = getInventory();
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

  function invSectionHtml(key, headerHtml, items) {
    let s = `<div class="inv-section" data-sk="${escHtml(key)}">
      <div class="inv-section__hdr section-header" style="cursor:pointer;display:flex;align-items:center;justify-content:space-between;user-select:none">
        <span>${headerHtml}</span><span class="section-chevron" style="font-size:12px;transition:transform 0.2s">▾</span>
      </div>
      <div class="inv-section__body">`;
    items.forEach(item => { s += renderInvCard(item, idx++); });
    s += `</div></div>`;
    return s;
  }

  if (staples.length > 0)    html += invSectionHtml('Staples', '⭐ Staples', staples);
  CATEGORIES.forEach(cat => {
    const items = grouped[cat];
    if (!items || !items.length) return;
    html += invSectionHtml(cat, `${CATEGORY_ICONS[cat]} ${cat}`, items);
  });

  _invListEl.innerHTML = html;

  // Restore saved collapse state (toggling is handled by the permanent delegated listener)
  _invListEl.querySelectorAll('.inv-section').forEach(sec => {
    const key     = sec.dataset.sk;
    const body    = sec.querySelector('.inv-section__body');
    const chevron = sec.querySelector('.section-chevron');
    if (_invCollapsed[key]) { body.style.display = 'none'; chevron.style.transform = 'rotate(-90deg)'; }
  });

  _invListEl.querySelectorAll('.swipe-card').forEach(cardEl => {
    const id = cardEl.dataset.id;
    initSwipeReveal(cardEl, { onUsedItAll: () => invHandleUsedItAll(id), onDelete: () => { removeInventoryItem(id); renderInventory(); } });
  });
  maybeShowSwipeHint();
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
          <div class="swipe-card__name">${escHtml(item.name)}</div>
          ${item.intendedFor ? `<div style="font-size:12px;color:var(--color-accent);margin-top:2px">🍽️ ${escHtml(item.intendedFor)}</div>` : ''}
          <div class="swipe-card__meta">
            <span class="swipe-card__qty">${item.quantity} ${escHtml(item.unit)}</span>
            <span class="swipe-card__date">${formatDate(item.useByDate)}</span>
          </div>
        </div>
        <div class="swipe-card__right">
          <button class="star-btn" data-id="${item.id}" title="Toggle staple">${item.staple ? '⭐' : '☆'}</button>
          <span class="days-chip ${getExpiryClass(days)}">${getDaysLabel(days)}</span>
          <button class="restock-btn" data-id="${item.id}" title="Restock">＋</button>
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
  const half      = Math.round(q / 2 * 4) / 4;
  const three_q   = Math.round(q * 0.75 * 4) / 4;
  const chips = [
    q > 0.5 && half > 0 && half < q                                  ? { label: `½ (${half})`, val: half }      : null,
    q > 0.5 && three_q > 0 && three_q < q && three_q !== half        ? { label: `¾ (${three_q})`, val: three_q } : null,
    q >= 1                                                             ? { label: `1 ${item.unit}`, val: 1 }      : null,
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

function showRestockSheet(item, onSaved) {
  showSheet(`
    <div class="sheet-handle"></div>
    <div class="sheet-header"><h2>Restock ${escHtml(item.name)}</h2><button class="btn btn--icon" data-action="cancel">✕</button></div>
    <div class="sheet-body">
      <p style="color:var(--color-text-secondary);font-size:13px;margin-bottom:16px">Currently: <strong>${item.quantity} ${escHtml(item.unit)}</strong></p>
      <div class="form-row"><div class="input-group"><label class="input-label">Amount added</label>
        <input class="input" id="restockAmt" type="number" min="1" step="1" value="1" inputmode="numeric" style="text-align:center;font-size:18px">
      </div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
        ${[1,2,3].map(n => `<button class="chip" data-restock-chip="${n}">+${n} ${escHtml(item.unit)}</button>`).join('')}
      </div>
    </div>
    <div class="sheet-footer">
      <button class="btn btn--ghost" style="flex:1" data-action="cancel">Cancel</button>
      <button class="btn btn--primary" style="flex:2" id="restockSaveBtn">Add to Stock</button>
    </div>`, {});
  setTimeout(() => {
    const inp = document.getElementById('restockAmt');
    inp?.focus(); inp?.select();
    document.querySelectorAll('[data-restock-chip]').forEach(btn => {
      btn.addEventListener('click', () => { document.getElementById('restockAmt').value = btn.dataset.restockChip; });
    });
    document.getElementById('restockSaveBtn')?.addEventListener('click', () => {
      const amt = parseFloat(document.getElementById('restockAmt')?.value) || 0;
      if (amt <= 0) return;
      const newQty = Math.round((item.quantity + amt) * 100) / 100;
      updateInventoryItem(item.id, { quantity: newQty });
      hideSheet();
      showToast(`${item.name}: now ${newQty} ${item.unit}`);
      if (onSaved) onSaved();
    });
  }, 50);
}

function invHandleRestock(id) {
  const item = getInventoryItem(id);
  if (!item) return;
  showRestockSheet(item, () => { renderInventory(); refreshHome(); });
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
      <div class="form-row"><div class="input-group"><label class="input-label">Intended for <span style="font-weight:400;color:var(--color-text-secondary)">(optional)</span></label>
        <input class="input" id="editIntendedFor" type="text" placeholder="e.g. Lasagna, soup night…" value="${escHtml(item.intendedFor||'')}">
      </div></div>
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
        dateFrozen:   el.querySelector('#editDateFrozen').value,
        useByDate:    el.querySelector('#editUseBy').value,
        intendedFor:  el.querySelector('#editIntendedFor').value.trim(),
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
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <h2 style="font-size:18px;font-weight:600">Add to Freezer</h2>
      <button class="scan-btn" id="addScanBtn" aria-label="Scan barcode">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
          <line x1="7" y1="7" x2="7" y2="17"/><line x1="10" y1="7" x2="10" y2="17"/>
          <line x1="13" y1="7" x2="13" y2="17"/><line x1="16" y1="9" x2="16" y2="17"/>
        </svg>
      </button>
    </div>
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
          <input type="number" class="stepper__val" id="addQtyVal" min="0.25" step="0.25" value="1" inputmode="decimal" style="width:52px;text-align:center;border:none;background:transparent;color:inherit;font-size:inherit;font-family:inherit;-moz-appearance:textfield;appearance:textfield">
          <button type="button" class="stepper__btn" id="addQtyPlus">+</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0;width:120px">
          <select class="input" id="addUnit"></select>
          <input class="input" id="addUnitCustom" type="text" placeholder="e.g. tray, bunch" style="display:none">
        </div>
      </div></div>
    <div class="form-row" style="margin-bottom:0">
      <button type="button" id="addDatesToggle" style="background:none;border:none;padding:0;cursor:pointer;display:flex;align-items:center;gap:6px;color:var(--color-text-secondary);font-size:13px;user-select:none">
        <span id="addDatesChevron" style="font-size:11px;transition:transform 0.2s">▸</span> Dates
      </button>
    </div>
    <div id="addDatesBody" style="display:none">
      <div class="form-row form-row--inline" style="margin-top:8px">
        <div class="input-group"><label class="input-label">Date Frozen</label><input class="input" id="addDateFrozen" type="date"></div>
        <div class="input-group"><label class="input-label">Use By</label><input class="input" id="addUseBy" type="date"></div>
      </div>
    </div>
    <div class="form-row"><div class="input-group" style="flex-direction:row;align-items:center;justify-content:space-between"><div><label class="input-label" style="margin:0">Staple item</label><div style="font-size:11px;color:var(--color-text-secondary);margin-top:2px;font-weight:400;text-transform:none;letter-spacing:0">Tracks minimum stock on home</div></div><input type="checkbox" id="addStaple" style="width:22px;height:22px;accent-color:var(--color-accent);flex-shrink:0"></div></div>
    <div class="form-row"><div class="input-group"><label class="input-label">Intended for <span style="font-weight:400;color:var(--color-text-secondary)">(optional)</span></label>
      <input class="input" id="addIntendedFor" type="text" placeholder="e.g. Lasagna, soup night…" autocomplete="off">
    </div></div>
    <div style="margin-top:8px"><button class="btn btn--primary" id="addSaveBtn" type="button">Save to Freezer</button></div>`;

  el.querySelector('#addScanBtn').addEventListener('click', openScannerOverlay);

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
    _addQuantity = Math.max(1, _addQuantity - 1);
    el.querySelector('#addQtyVal').value = _addQuantity;
  });
  el.querySelector('#addQtyPlus').addEventListener('click', () => {
    _addQuantity = _addQuantity + 1;
    el.querySelector('#addQtyVal').value = _addQuantity;
  });
  el.querySelector('#addQtyVal').addEventListener('change', () => {
    _addQuantity = Math.max(0.25, parseFloat(el.querySelector('#addQtyVal').value) || 1);
    el.querySelector('#addQtyVal').value = _addQuantity;
  });

  el.querySelector('#addDatesToggle').addEventListener('click', () => {
    const body    = el.querySelector('#addDatesBody');
    const chevron = el.querySelector('#addDatesChevron');
    const open    = body.style.display === 'none';
    body.style.display    = open ? '' : 'none';
    chevron.style.transform = open ? 'rotate(90deg)' : '';
  });

  el.querySelector('#addSaveBtn').addEventListener('click', handleAddSave);
  addResetForm();
}

function refreshAdd() {}

function addPopulateAutocomplete(val) {
  const list = _addContainer.querySelector('#addAutocomplete');
  if (!val) { list.hidden = true; return; }
  const q = val.toLowerCase();
  const items = getItemList();
  const qNorm = normalizeName(q);
  const seen = new Set();
  const rank = (i) => {
    const name = i.name.toLowerCase();
    const words = name.split(/\s+/);
    const nameNorm = normalizeName(i.name);
    if (name.startsWith(q)) return 1;
    if (words.some(w => w.startsWith(q))) return 2;
    if (name.includes(q)) return 3;
    // Tier 4: typo tolerance — any word within edit distance of query (min length 4)
    if (q.length >= 4 && words.some(w => editDistance(normalizeName(w), qNorm) <= Math.floor(q.length / 4))) return 4;
    return 0;
  };
  const matches = items
    .map(i => ({ i, r: rank(i) }))
    .filter(({ r }) => r > 0)
    .sort((a, b) => a.r - b.r)
    .slice(0, 8)
    .map(({ i }) => i);
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
  _addQuantity = Math.max(0.25, parseFloat(_addContainer.querySelector('#addQtyVal')?.value) || 1);
  const rawUnit    = _addContainer.querySelector('#addUnit')?.value || 'servings';
  const unit       = rawUnit === 'Custom…' ? (_addContainer.querySelector('#addUnitCustom')?.value.trim() || 'unit') : rawUnit;
  const dateFrozen = _addContainer.querySelector('#addDateFrozen').value || today();
  const useByDate  = _addContainer.querySelector('#addUseBy').value || addMonths(dateFrozen, CATEGORY_DEFAULTS_MONTHS[_addCategory]||3);
  const staple = _addContainer.querySelector('#addStaple')?.checked || false;
  const intendedFor = (_addContainer.querySelector('#addIntendedFor')?.value || '').trim();

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
        addInventoryItem({ name, category: _addCategory, quantity: _addQuantity, unit, dateFrozen, useByDate, staple, intendedFor });
        incrementItemUseCount(name);
        hideSheet(); addResetForm();
        showToast(`${escHtml(name)} added`);
        if (_invContainer) refreshInventory();
        refreshHome();
      });
    }, 50);
    return;
  }

  addInventoryItem({ name, category: _addCategory, quantity: _addQuantity, unit, dateFrozen, useByDate, staple, intendedFor });
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
  _addContainer.querySelector('#addQtyVal').value = '1';
  _addCategory = null;
  _addContainer.querySelectorAll('#catChips .chip').forEach(c => c.classList.remove('is-selected'));
  _addContainer.querySelector('#addUnit').innerHTML = '';
  const customInp = _addContainer.querySelector('#addUnitCustom');
  if (customInp) { customInp.value = ''; customInp.style.display = 'none'; }
  const stapleChk = _addContainer.querySelector('#addStaple');
  if (stapleChk) stapleChk.checked = false;
  const intendedInp = _addContainer.querySelector('#addIntendedFor');
  if (intendedInp) intendedInp.value = '';
  _addContainer.querySelector('#addUseBy').value = '';
  _addContainer.querySelector('#addName').focus();
}

// ── tabs/shopping.js ──────────────────────────

let _shopContainer = null;

function mountShopping(el) {
  _shopContainer = el;
  deduplicateShoppingList(); // clean up any existing duplicates in stored data
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
    const active = getShoppingList().filter(i => !i.completed).map(i => i.name);
    const hit = fuzzyMatchName(name, active);
    if (hit && (hit.kind === 'exact' || hit.kind === 'plural')) {
      showToast(`"${hit.match}" is already on your list`);
      input.value = ''; return;
    }
    if (hit && hit.kind === 'fuzzy') {
      // Spelling variant — ask the user
      showSheet(`
        <div class="sheet-handle"></div>
        <div class="sheet-header"><h2>Already on your list?</h2><button class="btn btn--icon" data-action="cancel">✕</button></div>
        <div class="sheet-body">
          <p style="font-size:14px;color:var(--color-text-secondary);margin-bottom:20px">
            "<strong>${escHtml(hit.match)}</strong>" is already on your list.<br>
            Is "<strong>${escHtml(name)}</strong>" the same thing?
          </p>
          <div style="display:flex;flex-direction:column;gap:10px">
            <button class="btn btn--ghost" id="shopFuzzySkip">Yes — don't add again</button>
            <button class="btn btn--primary" id="shopFuzzyAdd">No — add "${escHtml(name)}" separately</button>
          </div>
        </div>`, {});
      setTimeout(() => {
        document.getElementById('shopFuzzySkip')?.addEventListener('click', () => {
          hideSheet(); input.value = '';
        });
        document.getElementById('shopFuzzyAdd')?.addEventListener('click', () => {
          hideSheet();
          const known = getItemByName(name);
          // Force-add by calling storeWrite directly, bypassing dedup guard
          const items = storeRead(STORE_KEYS.shopping) || [];
          const item = { id: generateId(), name, category: known?.category || null,
            note: '', completed: false, addedAt: new Date().toISOString() };
          items.push(item);
          storeWrite(STORE_KEYS.shopping, items);
          input.value = '';
          renderShoppingList();
        });
      }, 50);
      return;
    }
    const known = getItemByName(name);
    const added = addShoppingItem({ name, category: known?.category || null });
    input.value = '';
    if (!added) { showToast(`"${name}" is already on your list`); return; }
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
    if (del) { removeShoppingItem(del.dataset.id); renderShoppingList(); return; }
    // Tap note text or "+ note" to edit inline
    const noteEl = e.target.closest('.shopping-item__note-text, .shopping-item__note-add');
    if (noteEl) {
      const id = noteEl.dataset.id;
      const item = getShoppingList().find(i => i.id === id);
      if (!item) return;
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.className = 'shopping-item__note';
      inp.value = item.note || '';
      inp.placeholder = 'Add note…';
      inp.dataset.id = id;
      noteEl.replaceWith(inp);
      inp.focus();
      inp.addEventListener('blur', () => {
        updateShoppingItem(id, { note: inp.value.trim() });
        renderShoppingList();
      });
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') inp.blur(); });
    }
  });
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
  // Only truly unknown categories — null/undefined are already bucketed under 'Other' by groupBy above
  const noCat = uncompleted.filter(i => i.category && !CATEGORIES.includes(i.category));
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
  const noteHtml = item.note
    ? `<div class="shopping-item__note-text" data-id="${item.id}">${escHtml(item.note)}</div>`
    : `<div class="shopping-item__note-add" data-id="${item.id}" style="font-size:12px;color:var(--color-border);margin-top:2px;cursor:pointer">+ note</div>`;
  return `<div class="shopping-item ${item.completed?'is-completed':''}" data-id="${item.id}">
    <input type="checkbox" class="shopping-checkbox" data-id="${item.id}" ${item.completed?'checked':''}>
    <div style="flex:1;min-width:0">
      <div class="shopping-item__name">${escHtml(item.name)}</div>
      ${noteHtml}
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
          <button class="btn btn--primary" style="font-size:13px;padding:8px 14px;width:auto;border-radius:8px" data-plan-used="${item.id}">Used it</button>
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

  const currentTheme = settings.theme || 'system';

  overlay.innerHTML = `
    <div class="settings-header">
      <h1>Settings</h1>
      <button class="btn btn--icon" id="settingsClose">✕</button>
    </div>
    <div class="settings-body">
      ${authBlock}
      <div class="settings-section">
        <h2>Appearance</h2>
        <div class="settings-item">
          <div class="settings-row">
            <div><div class="settings-row__label">Theme</div></div>
            <div style="display:flex;gap:6px">
              ${['system','light','dark'].map(t => `<button class="btn btn--ghost" data-theme-btn="${t}" style="font-size:12px;padding:6px 12px;${currentTheme===t?'background:var(--color-accent);border-color:var(--color-accent);color:#fff':''}">${t.charAt(0).toUpperCase()+t.slice(1)}</button>`).join('')}
            </div>
          </div>
        </div>
      </div>
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

  // Collapsible sections — click h2 to toggle (JS-driven, no CSS dependency)
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
      const section  = h2.closest('.settings-section');
      const items    = section.querySelectorAll('.settings-item');
      const nowHide  = items.length > 0 && items[0].style.display !== 'none';
      items.forEach(item => { item.style.display = nowHide ? 'none' : ''; });
      chevron.style.transform = nowHide ? 'rotate(-90deg)' : '';
    });
  });

  overlay.querySelector('#settingsClose').addEventListener('click', () => { overlay.classList.remove('is-open'); if (onClose) onClose(); });

  overlay.querySelectorAll('[data-theme-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.themeBtn;
      saveSettings({ theme: t });
      applyTheme(t);
      initSettings(onClose);
    });
  });

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

// ── Barcode Scanner ───────────────────────────

const SCAN_STOP_WORDS = new Set([
  'organic','natural','premium','frozen','fresh','farm','harvest',
  'grade','select','choice','pure','real','original','classic',
  'traditional','artisan','gourmet','homestyle','whole','raw',
  'unsalted','salted','sweetened','unsweetened','reduced','light',
  'lite','extra','family','value','pack','bag','box','can','jar',
  'bottle','brand','foods','company','inc','llc','corp','co',
  'the','and','with','for','from','del','the'
]);

function extractProductWords(name) {
  return (name || '').toLowerCase()
    .replace(/\b\d+(\.\d+)?\s*(oz|lb|lbs|g|kg|ml|l|ct|count|pk|pack|fl\.?\s*oz)\b/gi, '')
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !SCAN_STOP_WORDS.has(w));
}

function scoreInventoryMatch(productWords, items) {
  const qSet = new Set(productWords);
  return items
    .map(item => {
      const iWords = item.name.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
      let score = 0;
      for (const qw of qSet) {
        for (const iw of iWords) {
          if (qw === iw) score += 3;
          else if (iw.startsWith(qw) || qw.startsWith(iw)) score += 1;
        }
      }
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
}

async function lookupUPC(upc) {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(upc)}.json`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 1 || !data.product) return null;
    return data.product.product_name_en || data.product.product_name || null;
  } catch { return null; }
}

let _scanStream = null;
let _scanStop   = null;

function setScanStatus(msg) {
  const el = document.getElementById('scannerStatus');
  if (el) el.textContent = msg;
}

function closeScannerOverlay() {
  const ov = document.getElementById('scannerOverlay');
  if (ov) ov.classList.remove('is-open');
  if (_scanStop)   { _scanStop(); _scanStop = null; }
  if (_scanStream) { _scanStream.getTracks().forEach(t => t.stop()); _scanStream = null; }
  setTimeout(() => { const el = document.getElementById('scannerOverlay'); if (el) el.remove(); }, 350);
}

async function handleScannedCode(upc) {
  setScanStatus('Found — looking up…');
  const items = getInventory();

  // Fast path: stored UPC on an inventory item
  const direct = items.find(i => (i.upcs || []).includes(upc));
  if (direct) {
    closeScannerOverlay();
    showRestockSheet(direct, () => { renderInventory(); refreshHome(); });
    return;
  }

  const productName = await lookupUPC(upc);
  closeScannerOverlay();

  if (!productName) {
    showToast('Product not found — fill in the name');
    switchTab('add');
    return;
  }

  const productWords = extractProductWords(productName);
  const scored = scoreInventoryMatch(productWords, items);
  showScanResultSheet(productName, scored, upc);
}

function showScanResultSheet(productName, scored, upc) {
  const displayName = productName.length > 52 ? productName.slice(0, 49) + '…' : productName;

  if (scored.length === 0) {
    const cleaned = extractProductWords(productName).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || displayName;
    showSheet(`
      <div class="sheet-handle"></div>
      <div class="sheet-header"><h2>Not in freezer yet</h2><button class="btn btn--icon" data-action="cancel">✕</button></div>
      <div class="sheet-body">
        <p style="color:var(--color-text-secondary);font-size:12px;margin-bottom:10px">Scanned product:</p>
        <div style="font-size:16px;font-weight:600;margin-bottom:20px">${escHtml(displayName)}</div>
        <button class="btn btn--primary" id="scanAddNewBtn">Add to Freezer</button>
      </div>`, {});
    setTimeout(() => {
      document.getElementById('scanAddNewBtn')?.addEventListener('click', () => {
        hideSheet();
        switchTab('add');
        setTimeout(() => {
          const inp = document.getElementById('addName');
          if (inp) { inp.value = cleaned; inp.dispatchEvent(new Event('input')); }
        }, 150);
      });
    }, 50);
    return;
  }

  const top = scored[0];
  const isHighConfidence = top.score >= 3 && (scored.length === 1 || top.score > (scored[1]?.score ?? 0) * 1.4);
  if (isHighConfidence) {
    showScanConfirmSheet(displayName, top.item, scored.slice(1), upc);
  } else {
    showScanCandidateSheet(displayName, scored.slice(0, 4), upc);
  }
}

function showScanConfirmSheet(displayName, item, otherCandidates, upc) {
  showSheet(`
    <div class="sheet-handle"></div>
    <div class="sheet-header"><h2>Is this it?</h2><button class="btn btn--icon" data-action="cancel">✕</button></div>
    <div class="sheet-body">
      <p style="color:var(--color-text-secondary);font-size:12px;margin-bottom:10px">${escHtml(displayName)}</p>
      <div style="font-size:18px;font-weight:600;margin-bottom:4px">${escHtml(item.name)}</div>
      <p style="color:var(--color-text-secondary);font-size:13px;margin-bottom:20px">Currently: ${item.quantity} ${escHtml(item.unit)}</p>
      <div class="form-row"><div class="input-group"><label class="input-label">Amount added</label>
        <input class="input" id="scanRestockAmt" type="number" min="0.5" step="0.5" value="1" inputmode="decimal" style="text-align:center;font-size:18px">
      </div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
        ${[1,2,3].map(n => `<button class="chip" data-scan-chip="${n}">+${n} ${escHtml(item.unit)}</button>`).join('')}
      </div>
    </div>
    <div class="sheet-footer">
      ${otherCandidates.length ? `<button class="btn btn--ghost" style="flex:1" id="scanNotThis">Not this</button>` : `<button class="btn btn--ghost" style="flex:1" data-action="cancel">Cancel</button>`}
      <button class="btn btn--primary" style="flex:2" id="scanRestockBtn">Restock</button>
    </div>`, {});
  setTimeout(() => {
    document.querySelectorAll('[data-scan-chip]').forEach(btn => {
      btn.addEventListener('click', () => { document.getElementById('scanRestockAmt').value = btn.dataset.scanChip; });
    });
    document.getElementById('scanRestockBtn')?.addEventListener('click', () => {
      const amt = parseFloat(document.getElementById('scanRestockAmt')?.value) || 0;
      if (amt <= 0) return;
      const newQty = Math.round((item.quantity + amt) * 100) / 100;
      const upcs = [...new Set([...(item.upcs || []), upc])];
      updateInventoryItem(item.id, { quantity: newQty, upcs });
      hideSheet(); renderInventory(); refreshHome();
      showToast(`Restocked ${item.name} — now ${newQty} ${item.unit}`);
    });
    document.getElementById('scanNotThis')?.addEventListener('click', () => {
      hideSheet();
      setTimeout(() => showScanCandidateSheet(displayName, otherCandidates, upc), 80);
    });
  }, 50);
}

function showScanCandidateSheet(displayName, candidates, upc) {
  showSheet(`
    <div class="sheet-handle"></div>
    <div class="sheet-header"><h2>Which item is this?</h2><button class="btn btn--icon" data-action="cancel">✕</button></div>
    <div class="sheet-body">
      <p style="color:var(--color-text-secondary);font-size:12px;margin-bottom:14px">${escHtml(displayName)}</p>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">
        ${candidates.map(({ item }) => `
          <button class="btn btn--ghost" data-scan-pick="${escHtml(item.id)}" style="justify-content:flex-start;text-align:left;padding:12px 14px;gap:0">
            <span style="flex:1;font-size:15px;font-weight:500">${escHtml(item.name)}</span>
            <span style="font-size:12px;color:var(--color-text-secondary)">${item.quantity} ${escHtml(item.unit)}</span>
          </button>`).join('')}
      </div>
      <button class="btn btn--ghost" id="scanPickNone" style="width:100%;color:var(--color-text-secondary);font-size:13px">Add as new item instead</button>
    </div>`, {});
  setTimeout(() => {
    document.querySelectorAll('[data-scan-pick]').forEach(btn => {
      btn.addEventListener('click', () => {
        hideSheet();
        const item = getInventoryItem(btn.dataset.scanPick);
        if (item) setTimeout(() => showScanConfirmSheet(displayName, item, [], upc), 80);
      });
    });
    document.getElementById('scanPickNone')?.addEventListener('click', () => {
      hideSheet();
      switchTab('add');
      setTimeout(() => {
        const cleaned = extractProductWords(displayName).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const inp = document.getElementById('addName');
        if (inp) { inp.value = cleaned; inp.dispatchEvent(new Event('input')); }
      }, 150);
    });
  }, 50);
}

function _buildScannerOverlay() {
  let ov = document.getElementById('scannerOverlay');
  if (ov) ov.remove();
  ov = document.createElement('div');
  ov.className = 'scanner-overlay';
  ov.id = 'scannerOverlay';
  ov.innerHTML = `
    <div class="scanner-header">
      <h2>Scan Barcode</h2>
      <button class="btn btn--icon" id="scannerClose" style="color:#fff;background:rgba(255,255,255,0.15);border:none">✕</button>
    </div>
    <div class="scanner-body">
      <video class="scanner-video" id="scannerVideo" autoplay playsinline muted></video>
      <div class="scanner-viewfinder">
        <div class="viewfinder-corner tl"></div>
        <div class="viewfinder-corner tr"></div>
        <div class="viewfinder-corner bl"></div>
        <div class="viewfinder-corner br"></div>
        <div class="scanner-line"></div>
      </div>
      <p class="scanner-hint">Point at the barcode on the package</p>
      <div class="scanner-status" id="scannerStatus"></div>
    </div>`;
  document.body.appendChild(ov);
  ov.querySelector('#scannerClose').addEventListener('click', closeScannerOverlay);
  requestAnimationFrame(() => ov.classList.add('is-open'));
  return ov.querySelector('#scannerVideo');
}

function _startNativeScan(video) {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => { _scanStream = stream; video.srcObject = stream; return video.play(); })
    .then(() => {
      const detector = new BarcodeDetector({ formats: ['upc_a', 'upc_e', 'ean_13', 'ean_8', 'code_128', 'code_39'] });
      let running = true;
      _scanStop = () => { running = false; };
      const tick = async () => {
        if (!running) return;
        try {
          const codes = await detector.detect(video);
          if (codes.length > 0 && running) { running = false; handleScannedCode(codes[0].rawValue); }
          else requestAnimationFrame(tick);
        } catch { requestAnimationFrame(tick); }
      };
      requestAnimationFrame(tick);
    })
    .catch(() => setScanStatus('Camera access denied'));
}

function _startZXingScan(video) {
  setScanStatus('Loading scanner…');
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@zxing/library@0.20.0/umd/index.min.js';
  script.onload = () => {
    setScanStatus('');
    const reader = new ZXing.BrowserMultiFormatReader();
    _scanStop = () => { try { reader.reset(); } catch {} };
    reader.decodeFromVideoDevice(null, video, (result, err) => {
      if (result) { _scanStop = null; reader.reset(); handleScannedCode(result.text); }
    });
  };
  script.onerror = () => setScanStatus('Camera not available');
  document.head.appendChild(script);
}

function openScannerOverlay() {
  const inCheck = 'BarcodeDetector' in window;
  const typeofCheck = typeof BarcodeDetector !== 'undefined';
  showToast(`BD: in=${inCheck} typeof=${typeofCheck}`, { duration: 8000 });
  return;
  const video = _buildScannerOverlay();
  if ('BarcodeDetector' in window) {
    _startNativeScan(video);
  } else {
    _startZXingScan(video);
  }
}

// ── Boot ──────────────────────────────────────
function applyTheme(theme) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (theme === 'light') { root.dataset.theme = 'light'; }
  else if (theme === 'dark') { root.dataset.theme = 'dark'; }
  else { delete root.dataset.theme; }
  const isLight = theme === 'light' || (theme !== 'dark' && !prefersDark);
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.content = isLight ? '#f2f5f9' : '#0d1117';
}

initStore();
applyTheme(getSettings().theme || 'system');
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
