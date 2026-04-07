import {
  getShoppingList, addShoppingItem,
  updateShoppingItem, toggleShoppingItem,
  removeShoppingItem, clearCompletedShopping,
  getItemByName,
} from '../store.js';
import { groupBy } from '../utils.js';
import { showToast } from '../components/toast.js';
import { CATEGORIES, CATEGORY_ICONS } from '../defaults.js';

let container = null;

export function mount(el) {
  container = el;
  el.innerHTML = `
    <div class="shopping-add-row">
      <input class="input" id="shopAddInput" type="text" placeholder="Add item…" autocomplete="off">
      <button class="btn btn--ghost" id="shopAddBtn" style="flex-shrink:0">Add</button>
    </div>
    <div class="shopping-actions">
      <button class="btn btn--ghost" id="shopCopyBtn" style="flex:1">
        📋 Copy List
      </button>
      <button class="btn btn--ghost" id="shopClearBtn" style="flex:1">
        ✓ Clear Done
      </button>
    </div>
    <div id="shopList"></div>
  `;

  const input   = el.querySelector('#shopAddInput');
  const addBtn  = el.querySelector('#shopAddBtn');
  const copyBtn = el.querySelector('#shopCopyBtn');
  const clearBtn = el.querySelector('#shopClearBtn');
  const list    = el.querySelector('#shopList');

  const doAdd = () => {
    const name = input.value.trim();
    if (!name) return;
    const known = getItemByName(name);
    addShoppingItem({ name, category: known?.category || null });
    input.value = '';
    renderList();
  };

  addBtn.addEventListener('click', doAdd);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') doAdd(); });

  copyBtn.addEventListener('click', handleCopy);

  clearBtn.addEventListener('click', () => {
    clearCompletedShopping();
    renderList();
  });

  // Event delegation
  list.addEventListener('change', e => {
    const cb = e.target.closest('.shopping-checkbox');
    if (!cb) return;
    toggleShoppingItem(cb.dataset.id);
    renderList();
  });

  list.addEventListener('click', e => {
    const delBtn = e.target.closest('.shopping-item__delete');
    if (delBtn) {
      removeShoppingItem(delBtn.dataset.id);
      renderList();
    }
  });

  list.addEventListener('blur', e => {
    const noteInput = e.target.closest('.shopping-item__note');
    if (noteInput) {
      updateShoppingItem(noteInput.dataset.id, { note: noteInput.value });
    }
  }, true);

  renderList();
}

export function refresh() {
  renderList();
}

function renderList() {
  const list = container?.querySelector('#shopList');
  if (!list) return;

  const items = getShoppingList();
  if (items.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🛒</div>
        <div class="empty-state__title">Your list is empty</div>
        <div class="empty-state__subtitle">Add items to buy at the store</div>
      </div>`;
    return;
  }

  const uncompleted = items.filter(i => !i.completed);
  const completed   = items.filter(i => i.completed);
  const grouped     = groupBy(uncompleted, i => i.category || 'Other');

  let html = '';

  CATEGORIES.forEach(cat => {
    const catItems = grouped[cat];
    if (!catItems || catItems.length === 0) return;
    html += `<div class="section-header">${CATEGORY_ICONS[cat]} ${cat}</div>`;
    html += `<div class="settings-item" style="margin-bottom:8px">`;
    catItems.forEach(item => { html += renderItem(item); });
    html += `</div>`;
  });

  // Uncategorized
  const uncatItems = grouped[null] || grouped['null'] || grouped['Other'];

  // Completed items at bottom
  if (completed.length > 0) {
    html += `<div class="section-header" style="margin-top:16px">✓ Done</div>`;
    html += `<div class="settings-item" style="margin-bottom:8px">`;
    completed.forEach(item => { html += renderItem(item); });
    html += `</div>`;
  }

  list.innerHTML = html;
}

function renderItem(item) {
  return `
    <div class="shopping-item ${item.completed ? 'is-completed' : ''}" data-id="${item.id}">
      <input type="checkbox" class="shopping-checkbox" data-id="${item.id}" ${item.completed ? 'checked' : ''} aria-label="Mark ${escHtml(item.name)} as done">
      <div style="flex:1;min-width:0">
        <div class="shopping-item__name">${escHtml(item.name)}</div>
        <input type="text" class="shopping-item__note" data-id="${item.id}" value="${escHtml(item.note || '')}" placeholder="Add note…">
      </div>
      <button class="shopping-item__delete" data-id="${item.id}" aria-label="Remove">✕</button>
    </div>`;
}

function handleCopy() {
  const items = getShoppingList().filter(i => !i.completed);
  if (items.length === 0) {
    showToast('Nothing on the list yet!');
    return;
  }

  const grouped = groupBy(items, i => i.category || 'Other');
  let text = 'FrostTrack Shopping List\n';

  CATEGORIES.forEach(cat => {
    const catItems = grouped[cat];
    if (!catItems || catItems.length === 0) return;
    text += `\n${cat.toUpperCase()}\n`;
    catItems.forEach(i => {
      text += `- ${i.name}${i.note ? ` (${i.note})` : ''}\n`;
    });
  });

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard!');
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    showToast('Copied to clipboard!');
  } catch {
    showToast('Could not copy — try manually');
  }
  ta.remove();
}

function escHtml(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
