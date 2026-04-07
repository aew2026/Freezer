import {
  getInventory, getInventoryItem,
  updateInventoryItem, removeInventoryItem,
  addShoppingItem, getItemByName,
} from '../store.js';
import { daysUntil, getExpiryClass, getDaysLabel, formatDate, groupBy } from '../utils.js';
import { showSheet, hideSheet } from '../components/bottomSheet.js';
import { showToast } from '../components/toast.js';
import { initSwipeReveal } from '../components/swipeReveal.js';
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_BADGE_CLASS, UNIT_OPTIONS, DEFAULT_UNIT } from '../defaults.js';

let container = null;
let listEl    = null;
let searchVal = '';

export function mount(el) {
  container = el;
  el.innerHTML = `
    <div class="search-wrap">
      <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input class="search-input" id="inventorySearch" type="search" placeholder="Search inventory…" autocomplete="off">
    </div>
    <div id="inventoryList"></div>
  `;

  listEl = el.querySelector('#inventoryList');

  el.querySelector('#inventorySearch').addEventListener('input', e => {
    searchVal = e.target.value.trim().toLowerCase();
    renderItems();
  });

  // Event delegation for minus, card tap, confirm decrement
  listEl.addEventListener('click', e => {
    const minusBtn = e.target.closest('.minus-btn');
    const confirmBtn = e.target.closest('[data-action="confirm-used"]');
    const cancelBtn  = e.target.closest('[data-action="cancel-used"]');
    const card       = e.target.closest('.swipe-card__content');

    if (minusBtn) {
      e.stopPropagation();
      handleDecrement(minusBtn.dataset.id);
      return;
    }
    if (confirmBtn) {
      e.stopPropagation();
      handleUsedItAll(confirmBtn.dataset.id);
      return;
    }
    if (cancelBtn) {
      e.stopPropagation();
      // Restore to quantity 1
      const item = getInventoryItem(cancelBtn.dataset.id);
      if (item) updateInventoryItem(item.id, { quantity: 1 });
      renderItems();
      return;
    }
    if (card) {
      openEditSheet(card.dataset.id);
    }
  });

  renderItems();
}

export function refresh() {
  renderItems();
}

function renderItems() {
  const all = getInventory();
  const filtered = searchVal
    ? all.filter(i => i.name.toLowerCase().includes(searchVal))
    : all;

  if (all.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🧊</div>
        <div class="empty-state__title">Your freezer is empty</div>
        <div class="empty-state__subtitle">Tap + to add your first item</div>
      </div>`;
    return;
  }

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🔍</div>
        <div class="empty-state__title">No items match</div>
        <div class="empty-state__subtitle">"${searchVal}"</div>
      </div>`;
    return;
  }

  const grouped = groupBy(filtered, i => i.category);
  let html = '';
  let cardIndex = 0;

  CATEGORIES.forEach(cat => {
    const items = grouped[cat];
    if (!items || items.length === 0) return;
    html += `<div class="section-header">${CATEGORY_ICONS[cat]} ${cat}</div>`;
    items.forEach(item => {
      html += renderCard(item, cardIndex++);
    });
  });

  listEl.innerHTML = html;

  // Init swipe on each card
  listEl.querySelectorAll('.swipe-card').forEach(cardEl => {
    const id = cardEl.dataset.id;
    initSwipeReveal(cardEl, {
      onUsedItAll: () => handleUsedItAll(id),
      onDelete:    () => handleDelete(id),
    });
  });
}

function renderCard(item, index) {
  const days      = daysUntil(item.useByDate);
  const chipClass = getExpiryClass(days);
  const daysLabel = getDaysLabel(days);
  const badgeClass = CATEGORY_BADGE_CLASS[item.category] || 'badge--other';
  const dateLabel  = formatDate(item.useByDate);

  return `
    <div class="swipe-card animate-slide-up" data-id="${item.id}" style="--i:${index}">
      <div class="swipe-card__actions">
        <button class="swipe-action swipe-action--used" data-swipe-action="used" aria-label="Used it all">
          <span class="swipe-action__icon">✓</span>
          <span>Used it</span>
        </button>
        <button class="swipe-action swipe-action--delete" data-swipe-action="delete" aria-label="Delete">
          <span class="swipe-action__icon">🗑</span>
          <span>Delete</span>
        </button>
      </div>
      <div class="swipe-card__content" data-id="${item.id}">
        <div class="swipe-card__main">
          <div class="swipe-card__meta" style="margin-bottom:6px">
            <span class="badge ${badgeClass}">${item.category}</span>
          </div>
          <div class="swipe-card__name">${escHtml(item.name)}</div>
          <div class="swipe-card__meta">
            <span class="swipe-card__qty">${item.quantity} ${escHtml(item.unit)}</span>
            <span class="swipe-card__date">${dateLabel}</span>
          </div>
        </div>
        <div class="swipe-card__right">
          <span class="days-chip ${chipClass}">${daysLabel}</span>
          <button class="minus-btn" data-id="${item.id}" aria-label="Decrease quantity">−</button>
        </div>
      </div>
    </div>`;
}

function handleDecrement(id) {
  const item = getInventoryItem(id);
  if (!item) return;

  if (item.quantity > 1) {
    updateInventoryItem(id, { quantity: item.quantity - 1 });
    renderItems();
  } else {
    // Show inline confirm
    updateInventoryItem(id, { quantity: 0 });
    const cardContent = listEl.querySelector(`.swipe-card__content[data-id="${id}"]`);
    if (cardContent) {
      cardContent.querySelector('.swipe-card__right').innerHTML = `
        <button class="btn btn--ghost" style="font-size:12px;padding:6px 10px" data-action="confirm-used" data-id="${id}">Used it all</button>
        <button class="btn btn--icon" style="font-size:18px;color:var(--color-text-secondary)" data-action="cancel-used" data-id="${id}">✕</button>
      `;
    }
  }
}

function handleUsedItAll(id) {
  const item = getInventoryItem(id);
  if (!item) return;
  const name     = item.name;
  const category = item.category;
  removeInventoryItem(id);
  renderItems();
  showToast(`Gone! Add ${name} to your shopping list?`, {
    actionLabel: 'Add',
    action: () => {
      const known = getItemByName(name);
      addShoppingItem({ name, category: known?.category || category });
    },
  });
}

function handleDelete(id) {
  removeInventoryItem(id);
  renderItems();
}

function openEditSheet(id) {
  const item = getInventoryItem(id);
  if (!item) return;

  const categoryOptions = CATEGORIES.map(c =>
    `<option value="${c}" ${c === item.category ? 'selected' : ''}>${c}</option>`
  ).join('');

  const unitOptions = (UNIT_OPTIONS[item.category] || UNIT_OPTIONS['Other']).map(u =>
    `<option value="${u}" ${u === item.unit ? 'selected' : ''}>${u}</option>`
  ).join('');

  const html = `
    <div class="sheet-handle"></div>
    <div class="sheet-header">
      <h2>Edit Item</h2>
      <button class="btn btn--icon" data-action="cancel" aria-label="Close">✕</button>
    </div>
    <div class="sheet-body">
      <input type="hidden" id="editId" value="${item.id}">
      <div class="form-row">
        <div class="input-group">
          <label class="input-label" for="editName">Name</label>
          <input class="input" id="editName" type="text" value="${escHtml(item.name)}" autocomplete="off">
        </div>
      </div>
      <div class="form-row">
        <div class="input-group">
          <label class="input-label" for="editCategory">Category</label>
          <select class="input" id="editCategory">${categoryOptions}</select>
        </div>
      </div>
      <div class="form-row form-row--inline">
        <div class="input-group">
          <label class="input-label" for="editQty">Quantity</label>
          <input class="input" id="editQty" type="number" min="0" step="0.5" value="${item.quantity}">
        </div>
        <div class="input-group">
          <label class="input-label" for="editUnit">Unit</label>
          <select class="input" id="editUnit">${unitOptions}</select>
        </div>
      </div>
      <div class="form-row">
        <div class="input-group">
          <label class="input-label" for="editDateFrozen">Date Frozen</label>
          <input class="input" id="editDateFrozen" type="date" value="${item.dateFrozen || ''}">
        </div>
      </div>
      <div class="form-row">
        <div class="input-group">
          <label class="input-label" for="editUseBy">Use By</label>
          <input class="input" id="editUseBy" type="date" value="${item.useByDate || ''}">
        </div>
      </div>
    </div>
    <div class="sheet-footer">
      <button class="btn btn--ghost" style="flex:1" data-action="cancel">Cancel</button>
      <button class="btn btn--primary" style="flex:2" data-action="save">Save</button>
    </div>`;

  showSheet(html, {
    onSave: () => {
      const el = document.getElementById('bottomSheet');
      const changes = {
        name:       el.querySelector('#editName').value.trim(),
        category:   el.querySelector('#editCategory').value,
        quantity:   parseFloat(el.querySelector('#editQty').value) || 1,
        unit:       el.querySelector('#editUnit').value,
        dateFrozen: el.querySelector('#editDateFrozen').value,
        useByDate:  el.querySelector('#editUseBy').value,
      };
      if (!changes.name) return;
      updateInventoryItem(item.id, changes);
      hideSheet();
      renderItems();
    },
  });

  // Update unit options when category changes
  setTimeout(() => {
    const catSelect  = document.getElementById('editCategory');
    const unitSelect = document.getElementById('editUnit');
    if (catSelect && unitSelect) {
      catSelect.addEventListener('change', () => {
        const cat   = catSelect.value;
        const units = UNIT_OPTIONS[cat] || UNIT_OPTIONS['Other'];
        unitSelect.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');
        unitSelect.value = DEFAULT_UNIT[cat] || units[0];
      });
    }
  }, 50);
}

function escHtml(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
