let openCard = null;

export function initSwipeReveal(cardElement, { onUsedItAll, onDelete }) {
  const content = cardElement.querySelector('.swipe-card__content');
  if (!content) return;

  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let isDecided = false;
  let isHorizontal = false;

  // Wire action buttons in reveal layer
  cardElement.querySelector('[data-swipe-action="used"]')?.addEventListener('click', e => {
    e.stopPropagation();
    snapClose();
    onUsedItAll && onUsedItAll();
  });

  cardElement.querySelector('[data-swipe-action="delete"]')?.addEventListener('click', e => {
    e.stopPropagation();
    snapClose();
    onDelete && onDelete();
  });

  content.addEventListener('touchstart', onStart, { passive: true });
  content.addEventListener('touchmove', onMove, { passive: false });
  content.addEventListener('touchend', onEnd, { passive: true });

  // Listen for other cards opening — close this one
  document.addEventListener('swipeopen', e => {
    if (e.detail.card !== cardElement) {
      snapClose();
    }
  });

  function onStart(e) {
    const t = e.touches[0];
    startX    = t.clientX;
    startY    = t.clientY;
    currentX  = 0;
    isDecided = false;
    isHorizontal = false;
    content.classList.remove('is-snapping');
    content.classList.add('is-swiping');
  }

  function onMove(e) {
    const t = e.touches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    if (!isDecided) {
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
      isDecided    = true;
      isHorizontal = Math.abs(dx) > Math.abs(dy);
    }

    if (!isHorizontal) return;

    e.preventDefault();

    // Only allow left swipe; clamp between -160 and 0
    currentX = Math.min(0, Math.max(-160, dx));

    // If card was already open (at -160), offset by that
    if (openCard === cardElement) {
      currentX = Math.min(0, Math.max(-160, dx - 160));
    }

    content.style.transform = `translateX(${currentX}px)`;
  }

  function onEnd() {
    content.classList.remove('is-swiping');
    content.classList.add('is-snapping');

    const threshold = openCard === cardElement ? -80 : -80;

    if (currentX < threshold) {
      snapOpen();
    } else {
      snapClose();
    }
  }

  function snapOpen() {
    content.classList.add('is-snapping');
    content.style.transform = 'translateX(-160px)';
    openCard = cardElement;
    document.dispatchEvent(new CustomEvent('swipeopen', { detail: { card: cardElement } }));
  }

  function snapClose() {
    content.classList.add('is-snapping');
    content.style.transform = 'translateX(0)';
    if (openCard === cardElement) openCard = null;
  }
}

export function closeAllSwipeCards() {
  if (openCard) {
    const content = openCard.querySelector('.swipe-card__content');
    if (content) {
      content.classList.add('is-snapping');
      content.style.transform = 'translateX(0)';
    }
    openCard = null;
  }
}
