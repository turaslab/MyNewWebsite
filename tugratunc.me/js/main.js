const THEMES = new Set(['paper', 'garage', 'citypop', 'lounge', 'lowpoly']);
const THEME_KEY = 'turas-lab-theme';
const TIMER_KEY = 'turas-lab-timer';

function applyTheme(theme) {
  const safeTheme = THEMES.has(theme) ? theme : 'paper';
  document.documentElement.dataset.theme = safeTheme;
  localStorage.setItem(THEME_KEY, safeTheme);
  const select = document.querySelector('#theme-select');
  if (select) select.value = safeTheme;
}

function setupTheme() {
  applyTheme(localStorage.getItem(THEME_KEY) || 'paper');
  document.querySelector('#theme-select')?.addEventListener('change', (event) => applyTheme(event.target.value));
}

function setupYear() {
  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
}

function setupTimer() {
  const display = document.querySelector('.timer');
  const toggle = document.querySelector('[data-timer="toggle"]');
  const reset = document.querySelector('[data-timer="reset"]');
  if (!display || !toggle || !reset) return;

  const defaultState = { remaining: 25 * 60, running: false, updatedAt: Date.now() };
  let state;
  try {
    state = { ...defaultState, ...JSON.parse(localStorage.getItem(TIMER_KEY) || '{}') };
  } catch {
    state = { ...defaultState };
  }

  if (state.running) {
    state.remaining = Math.max(0, state.remaining - Math.floor((Date.now() - state.updatedAt) / 1000));
    if (state.remaining === 0) state.running = false;
  }

  const save = () => localStorage.setItem(TIMER_KEY, JSON.stringify({ ...state, updatedAt: Date.now() }));
  const render = () => {
    const minutes = Math.floor(state.remaining / 60).toString().padStart(2, '0');
    const seconds = (state.remaining % 60).toString().padStart(2, '0');
    display.textContent = `${minutes}:${seconds}`;
    toggle.textContent = state.running ? 'Duraklat' : state.remaining === 0 ? 'Yeniden başlat' : 'Başlat';
    document.title = state.running ? `${minutes}:${seconds} — Tura's Lab` : "Tura's Lab — kişisel arşivler ve dijital deneyler";
  };

  toggle.addEventListener('click', () => {
    if (state.remaining === 0) state.remaining = 25 * 60;
    state.running = !state.running;
    state.updatedAt = Date.now();
    save();
    render();
  });

  reset.addEventListener('click', () => {
    state = { ...defaultState, updatedAt: Date.now() };
    save();
    render();
  });

  window.setInterval(() => {
    if (!state.running) return;
    state.remaining = Math.max(0, state.remaining - 1);
    state.updatedAt = Date.now();
    if (state.remaining === 0) state.running = false;
    save();
    render();
  }, 1000);

  render();
}

setupTheme();
setupYear();
setupTimer();
