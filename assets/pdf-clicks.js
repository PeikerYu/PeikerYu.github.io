(() => {
  const counterOrigin = 'https://abacus.jasoncameron.dev';
  const namespace = 'peikeryu.github.io';

  function requestCount(action, key) {
    return fetch(`${counterOrigin}/${action}/${namespace}/${key}`, {
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      cache: 'no-store',
      keepalive: action === 'hit'
    });
  }

  function countActivation(event) {
    const expectedButton = event.type === 'auxclick' ? 1 : 0;
    if (!event.isTrusted || event.defaultPrevented || event.button !== expectedButton) return;

    const key = event.currentTarget.dataset.pdfCounter;
    // Let the browser follow the original PDF link even if the counter is offline.
    requestCount('hit', key).catch(() => {});
  }

  if (location.origin === 'https://peikeryu.github.io') {
    for (const link of document.querySelectorAll('a[data-pdf-counter]')) {
      link.addEventListener('click', countActivation);
      link.addEventListener('auxclick', countActivation);
    }
  }

  async function showTotal(cell) {
    cell.textContent = 'Loading…';
    try {
      const response = await requestCount('get', cell.dataset.pdfTotal);
      if (!response.ok) throw new Error('Could not read counter');
      const { value } = await response.json();
      if (!Number.isSafeInteger(value) || value < 0) throw new Error('Invalid counter value');
      cell.textContent = value.toLocaleString('en');
    } catch {
      cell.textContent = 'Unavailable';
    }
  }

  for (const cell of document.querySelectorAll('[data-pdf-total]')) {
    showTotal(cell);
  }
})();
