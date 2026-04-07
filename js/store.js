import { DEFAULT_ITEMS, CATEGORY_DEFAULTS_MONTHS } from './defaults.js';
import { generateId, today } from './utils.js';

const KEYS = {
  inventory: 'frosttrack_inventory',
  shopping:  'frosttrack_shopping',
  items:     'frosttrack_items',
  settings:  'frosttrack_settings',
};

const DEFAULT_SETTINGS = {
  anthropicApiKey: '',
  categoryDefaults: { ...CATEGORY_DEFAULTS_MONTHS },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full — silently fail
  }
}

// ── Init ─────────────────────────────────────────────────────────────────────

export function initStore() {
  if (read(KEYS.inventory) === null) {
    write(KEYS.inventory, []);
  }
  if (read(KEYS.shopping) === null) {
    write(KEYS.shopping, []);
  }
  if (read(KEYS.items) === null) {
    write(KEYS.items, DEFAULT_ITEMS.map(i => ({ ...i })));
  }
  // Always merge settings so new keys get defaults
  const existing = read(KEYS.settings) || {};
  write(KEYS.settings, {
    ...DEFAULT_SETTINGS,
    ...existing,
    categoryDefaults: {
      ...DEFAULT_SETTINGS.categoryDefaults,
      ...(existing.categoryDefaults || {}),
    },
  });
}

// ── Inventory ─────────────────────────────────────────────────────────────────

export function getInventory() {
  const items = read(KEYS.inventory) || [];
  return [...items].sort((a, b) => {
    if (!a.useByDate) return 1;
    if (!b.useByDate) return -1;
    return a.useByDate.localeCompare(b.useByDate);
  });
}

export function addInventoryItem(partial) {
  const items = read(KEYS.inventory) || [];
  const item = {
    id:         generateId(),
    name:       '',
    category:   'Other',
    quantity:   1,
    unit:       'servings',
    dateFrozen: today(),
    useByDate:  '',
    addedAt:    new Date().toISOString(),
    ...partial,
  };
  items.push(item);
  write(KEYS.inventory, items);
  return item;
}

export function updateInventoryItem(id, changes) {
  const items = read(KEYS.inventory) || [];
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return;
  items[idx] = { ...items[idx], ...changes };
  write(KEYS.inventory, items);
}

export function removeInventoryItem(id) {
  const items = read(KEYS.inventory) || [];
  write(KEYS.inventory, items.filter(i => i.id !== id));
}

export function getInventoryItem(id) {
  const items = read(KEYS.inventory) || [];
  return items.find(i => i.id === id) || null;
}

// ── Shopping List ─────────────────────────────────────────────────────────────

export function getShoppingList() {
  return read(KEYS.shopping) || [];
}

export function addShoppingItem(partial) {
  const items = read(KEYS.shopping) || [];
  const item = {
    id:        generateId(),
    name:      '',
    category:  null,
    note:      '',
    completed: false,
    addedAt:   new Date().toISOString(),
    ...partial,
  };
  items.push(item);
  write(KEYS.shopping, items);
  return item;
}

export function updateShoppingItem(id, changes) {
  const items = read(KEYS.shopping) || [];
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return;
  items[idx] = { ...items[idx], ...changes };
  write(KEYS.shopping, items);
}

export function toggleShoppingItem(id) {
  const items = read(KEYS.shopping) || [];
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return;
  items[idx].completed = !items[idx].completed;
  write(KEYS.shopping, items);
}

export function removeShoppingItem(id) {
  const items = read(KEYS.shopping) || [];
  write(KEYS.shopping, items.filter(i => i.id !== id));
}

export function clearCompletedShopping() {
  const items = read(KEYS.shopping) || [];
  write(KEYS.shopping, items.filter(i => !i.completed));
}

// ── Item List ─────────────────────────────────────────────────────────────────

export function getItemList() {
  const items = read(KEYS.items) || [];
  return [...items].sort((a, b) => {
    // User-added first
    if (!a.isDefault && b.isDefault) return -1;
    if (a.isDefault && !b.isDefault) return 1;
    // Then by use count desc
    return (b.useCount || 0) - (a.useCount || 0);
  });
}

export function getItemByName(name) {
  const items = read(KEYS.items) || [];
  return items.find(i => i.name.toLowerCase() === name.toLowerCase()) || null;
}

export function addToItemList(item) {
  const items = read(KEYS.items) || [];
  const exists = items.find(i => i.name.toLowerCase() === item.name.toLowerCase());
  if (exists) return;
  items.push({ useCount: 0, isDefault: false, ...item });
  write(KEYS.items, items);
}

export function removeFromItemList(name) {
  const items = read(KEYS.items) || [];
  write(KEYS.items, items.filter(i => i.name.toLowerCase() !== name.toLowerCase()));
}

export function incrementItemUseCount(name) {
  const items = read(KEYS.items) || [];
  const idx = items.findIndex(i => i.name.toLowerCase() === name.toLowerCase());
  if (idx !== -1) {
    items[idx].useCount = (items[idx].useCount || 0) + 1;
    write(KEYS.items, items);
  }
}

// ── Settings ──────────────────────────────────────────────────────────────────

export function getSettings() {
  return read(KEYS.settings) || { ...DEFAULT_SETTINGS };
}

export function saveSettings(changes) {
  const current = getSettings();
  const merged = {
    ...current,
    ...changes,
    categoryDefaults: {
      ...current.categoryDefaults,
      ...(changes.categoryDefaults || {}),
    },
  };
  write(KEYS.settings, merged);
}

// ── Clear All ─────────────────────────────────────────────────────────────────

export function clearAllData() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}
