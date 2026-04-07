import { getInventory, removeInventoryItem, addShoppingItem, getItemByName } from '../store.js';
import { daysUntil, getExpiryClass, getDaysLabel } from '../utils.js';
import { showToast } from '../components/toast.js';

let container    = null;
let currentMode  = 'heat';
let shuffleOffset = 0;

export function mount(el) {
  container = el;

  el.innerHTML = `
    <div class="segmented-control">
      <button class="segmented-btn is-active" data-mode="heat">🔥 Just heat it up</button>
      <button class="segmented-btn" data-mode="cook">🍳 I'm cooking</button>
    </div>
    <div id="mealsContent"></div>
  `;

  el.querySelector('.segmented-control').addEventListener('click', e => {
    const btn = e.target.closest('[data-mode]');
    if (!btn) return;
    setMode(btn.dataset.mode);
  });

  renderModeContent();
}

export function refresh() {
  shuffleOffset = 0;
  if (!container) return;
  updateSegmented();
  renderModeContent();
}

export function setMode(mode) {
  currentMode   = mode;
  shuffleOffset = 0;
  updateSegmented();
  renderModeContent();
}

function updateSegmented() {
  container?.querySelectorAll('.segmented-btn').forEach(b => {
    b.classList.toggle('is-active', b.dataset.mode === currentMode);
  });
}

function renderModeContent() {
  const content = container?.querySelector('#mealsContent');
  if (!content) return;
  currentMode === 'heat' ? renderHeat(content) : renderCook(content);
}

// ── Heat Mode ──────────────────────────────────────────────────────────────────

function renderHeat(content) {
  const meals = getInventory()
    .filter(i => i.category === 'Full Meals')
    .sort((a, b) => a.useByDate.localeCompare(b.useByDate));

  if (meals.length === 0) {
    content.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🍱</div>
        <div class="empty-state__title">No freezer meals right now</div>
        <div class="empty-state__subtitle">Add some Full Meals to see them here</div>
      </div>`;
    return;
  }

  const rotated = [...meals.slice(shuffleOffset), ...meals.slice(0, shuffleOffset)];
  const shown   = rotated.slice(0, 3);

  let html = `<div class="section-header">🍱 Ready to Heat</div>`;
  shown.forEach((item, i) => {
    const days      = daysUntil(item.useByDate);
    const chipClass = getExpiryClass(days);
    const daysLabel = getDaysLabel(days);
    html += `
      <div class="meal-card animate-slide-up" style="--i:${i}">
        <div class="meal-card__name">${escHtml(item.name)}</div>
        <div class="meal-card__meta">
          <span style="font-size:13px;color:var(--color-text-secondary)">${item.quantity} ${escHtml(item.unit)}</span>
          <span class="days-chip ${chipClass}">${daysLabel}</span>
        </div>
        <div class="meal-card__footer">
          <span></span>
          <button class="btn btn--ghost" style="font-size:13px;padding:8px 14px"
            data-action="mark-used" data-id="${item.id}">Mark as used</button>
        </div>
      </div>`;
  });

  if (meals.length > 3) {
    html += `
      <div class="shuffle-wrap">
        <button class="btn btn--ghost" id="shuffleBtn">🔀 Shuffle</button>
      </div>`;
  }

  content.innerHTML = html;

  content.querySelector('#shuffleBtn')?.addEventListener('click', () => {
    shuffleOffset = (shuffleOffset + 3) % meals.length;
    renderModeContent();
  });

  content.querySelectorAll('[data-action="mark-used"]').forEach(btn => {
    btn.addEventListener('click', () => handleMarkUsed(btn.dataset.id));
  });
}

// ── Cook Mode ──────────────────────────────────────────────────────────────────

function renderCook(content) {
  const inventory = getInventory();
  const proteins  = inventory.filter(i => i.category === 'Protein').sort((a,b)=>a.useByDate.localeCompare(b.useByDate));
  const produce   = inventory.filter(i => i.category === 'Produce').sort((a,b)=>a.useByDate.localeCompare(b.useByDate));
  const other     = inventory.filter(i => i.category === 'Other').sort((a,b)=>a.useByDate.localeCompare(b.useByDate));

  if (proteins.length === 0 && produce.length === 0) {
    content.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🛒</div>
        <div class="empty-state__title">Nothing to cook with</div>
        <div class="empty-state__subtitle">Add some Protein and Produce to your freezer</div>
      </div>`;
    return;
  }

  const protein = proteins[shuffleOffset % Math.max(proteins.length, 1)] || null;
  const veg     = produce[shuffleOffset  % Math.max(produce.length, 1)]  || null;
  const extra   = other[shuffleOffset   % Math.max(other.length, 1)]    || null;

  let html = `<div class="section-header">🍳 Tonight's Combo</div>`;
  html += `<div class="combo-card"><div class="combo-card__header">Suggested ingredients</div>`;

  if (!protein) {
    html += `
      <div class="combo-item">
        <div class="combo-item__info">
          <div class="combo-item__name" style="color:var(--color-text-secondary)">No Protein in freezer</div>
          <div class="combo-item__sub">Check your shopping list</div>
        </div>
      </div>`;
  } else {
    html += renderComboItem(protein, '🥩');
  }

  if (!veg) {
    html += `
      <div class="combo-item">
        <div class="combo-item__info">
          <div class="combo-item__name" style="color:var(--color-text-secondary)">No Produce in freezer</div>
          <div class="combo-item__sub">Check your shopping list</div>
        </div>
      </div>`;
  } else {
    html += renderComboItem(veg, '🥦');
  }

  if (extra) {
    html += renderComboItem(extra, '📦');
  }

  html += `</div>`;

  if (protein && veg) {
    const query = encodeURIComponent(`${protein.name} ${veg.name} recipe`);
    html += `
      <div style="margin-top:8px;text-align:center">
        <a class="recipe-link" href="https://www.google.com/search?q=${query}" target="_blank" rel="noopener">
          🔍 Search recipes →
        </a>
      </div>`;
  }

  const canShuffle = proteins.length > 1 || produce.length > 1 || other.length > 1;
  if (canShuffle) {
    html += `
      <div class="shuffle-wrap">
        <button class="btn btn--ghost" id="shuffleBtn">🔀 Different combo</button>
      </div>`;
  }

  content.innerHTML = html;

  content.querySelector('#shuffleBtn')?.addEventListener('click', () => {
    shuffleOffset++;
    renderModeContent();
  });

  content.querySelectorAll('[data-action="mark-used"]').forEach(btn => {
    btn.addEventListener('click', () => handleMarkUsed(btn.dataset.id));
  });
}

function renderComboItem(item, icon) {
  const days      = daysUntil(item.useByDate);
  const chipClass = getExpiryClass(days);
  const daysLabel = getDaysLabel(days);
  return `
    <div class="combo-item">
      <div class="combo-item__info">
        <div class="combo-item__name">${icon} ${escHtml(item.name)}</div>
        <div class="combo-item__sub">${item.quantity} ${escHtml(item.unit)}</div>
      </div>
      <span class="days-chip ${chipClass}" style="font-size:12px">${daysLabel}</span>
      <button class="btn btn--ghost" style="font-size:12px;padding:6px 10px;margin-left:8px"
        data-action="mark-used" data-id="${item.id}">Used</button>
    </div>`;
}

// ── Shared ─────────────────────────────────────────────────────────────────────

function handleMarkUsed(id) {
  const item = getInventory().find(i => i.id === id);
  if (!item) return;
  const name = item.name;
  const cat  = item.category;
  removeInventoryItem(id);
  renderModeContent();
  showToast(`Marked ${name} as used. Add to shopping list?`, {
    actionLabel: 'Add',
    action: () => {
      const known = getItemByName(name);
      addShoppingItem({ name, category: known?.category || cat });
    },
  });
}

function escHtml(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
