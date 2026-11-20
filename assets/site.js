(() => {
  document.documentElement.dataset.theme = 'light';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const readPreference = key => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const savePreference = (key, value) => {
    try { localStorage.setItem(key, value); } catch { /* Preferences are optional. */ }
  };
  document.addEventListener('DOMContentLoaded', () => {
    const image = document.querySelector('.banner-image');
    const motionButton = document.querySelector('.motion-toggle');
    if (!image || !motionButton) return;
    const motionPreference = readPreference('peiker-motion');
    let paused = motionPreference ? motionPreference === 'paused' : reducedMotion.matches;
    const renderMotion = () => {
      image.src = paused ? image.dataset.still : image.dataset.animated;
      motionButton.setAttribute('aria-pressed', String(paused));
      const label = paused ? 'Play background animation' : 'Pause background animation';
      motionButton.setAttribute('aria-label', label);
      motionButton.title = label;
    };
    motionButton.hidden = false;
    renderMotion();
    motionButton.addEventListener('click', () => {
      paused = !paused;
      savePreference('peiker-motion', paused ? 'paused' : 'playing');
      renderMotion();
    });
    reducedMotion.addEventListener('change', event => {
      if (!readPreference('peiker-motion')) {
        paused = event.matches;
        renderMotion();
      }
    });
    image.addEventListener('error', () => {
      if (!image.src.endsWith('/assets/gojo-poster.jpg')) {
        paused = true;
        renderMotion();
      }
      motionButton.hidden = true;
    });
  });
})();
