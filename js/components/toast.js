const MAX_TOASTS = 3;

export function showToast(message, { action, actionLabel = 'Add', duration = 4000 } = {}) {
  const container = document.getElementById('toastContainer');

  // Remove oldest if at max
  const existing = container.querySelectorAll('.toast');
  if (existing.length >= MAX_TOASTS) {
    dismissToast(existing[0]);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';

  const msgSpan = document.createElement('span');
  msgSpan.textContent = message;
  toast.appendChild(msgSpan);

  if (action) {
    const btn = document.createElement('button');
    btn.className = 'toast__action';
    btn.textContent = actionLabel;
    btn.addEventListener('click', () => {
      action();
      dismissToast(toast);
    });
    toast.appendChild(btn);
  }

  container.appendChild(toast);

  // Trigger transition
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('is-visible'));
  });

  const timer = setTimeout(() => dismissToast(toast), duration);
  toast._timer = timer;
}

function dismissToast(toast) {
  clearTimeout(toast._timer);
  toast.classList.remove('is-visible');
  toast.addEventListener('transitionend', () => toast.remove(), { once: true });
}
