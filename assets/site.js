(() => {
  const root = document.documentElement;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const readPreference = key => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const savePreference = (key, value) => {
    try { localStorage.setItem(key, value); } catch { /* Preferences are optional. */ }
  };
  const storedTheme = readPreference('peiker-theme');
  root.dataset.theme = ['light', 'dark'].includes(storedTheme)
    ? storedTheme
    : (systemTheme.matches ? 'dark' : 'light');

  document.addEventListener('DOMContentLoaded', () => {
    const themeButton = document.querySelector('.theme-toggle');
    const updateThemeLabel = () => {
      const dark = root.dataset.theme === 'dark';
      themeButton.setAttribute('aria-pressed', String(dark));
      themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      themeButton.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
    };
    if (themeButton) {
      themeButton.hidden = false;
      updateThemeLabel();
      themeButton.addEventListener('click', () => {
        root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        savePreference('peiker-theme', root.dataset.theme);
        updateThemeLabel();
      });
      systemTheme.addEventListener('change', event => {
        if (!readPreference('peiker-theme')) {
          root.dataset.theme = event.matches ? 'dark' : 'light';
          updateThemeLabel();
        }
      });
    }

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
