// ------------------------------------------------------------
// Lab Radio — yalnızca yayın bilgisi okuyan ortak dinleyici.
// Yayıncı tokenı bu dosyaya veya siteye hiçbir zaman eklenmez.
// ------------------------------------------------------------

(() => {
  const panels = [...document.querySelectorAll('[data-radio-summary], [data-radio-room]')];
  if (!panels.length) return;

  const endpoint = 'wss://radio.tugratunc.me/ws/listen';
  let socket = null;
  let retryTimer = null;
  let connectionTimer = null;
  let retryDelay = 1000;
  let suspended = false;

  // Yalnız müzik odasındaki oynatıcı bu salt okunur olayları dinler.
  function notifyPlayer(state = null) {
    window.dispatchEvent(new CustomEvent('lab-radio-state', { detail: state }));
  }

  function render(status, title, channel = '') {
    panels.forEach((panel) => {
      const label = panel.querySelector('[data-radio-status]');
      const heading = panel.querySelector('[data-radio-title]');
      const artist = panel.querySelector('[data-radio-channel]');
      const prefix = panel.hasAttribute('data-radio-summary') ? 'LAB RADIO / ' : '';

      // Sunucudan gelen metin HTML olarak işlenmez.
      if (label) label.textContent = prefix + status;
      if (heading) heading.textContent = title;
      if (artist) {
        artist.textContent = channel;
        artist.hidden = !channel;
      }
    });
  }

  function renderState(state) {
    if (!state || typeof state !== 'object') return false;
    if (state.live === false && state.state === 'offline') {
      render('YAYIN YOK', 'Şu an yayın yok.');
      notifyPlayer(state);
      return true;
    }

    if (state.live !== true || !['playing', 'paused'].includes(state.state)) return false;
    if (typeof state.videoId !== 'string' || !/^[\w-]{11}$/.test(state.videoId)) return false;
    if (typeof state.title !== 'string' || state.title.length > 1000) return false;
    if (state.channel != null && typeof state.channel !== 'string') return false;
    if (!Number.isFinite(state.sourcePosition) || state.sourcePosition < 0) return false;
    if (typeof state.sourceTimestamp !== 'string' || !Number.isFinite(Date.parse(state.sourceTimestamp))) return false;

    render(
      state.state === 'playing' ? 'ŞU AN ÇALAN' : 'YAYIN DURAKLATILDI',
      state.title.trim() || 'İsimsiz parça',
      (state.channel || '').slice(0, 500),
    );
    notifyPlayer(state);
    return true;
  }

  function disconnect() {
    notifyPlayer();
    clearTimeout(connectionTimer);
    connectionTimer = null;
    const previous = socket;
    socket = null;
    if (previous) previous.close();
  }

  function retry() {
    disconnect();
    clearTimeout(retryTimer);
    retryTimer = null;
    if (suspended) return;

    // Bağlantı kaybını, sunucunun bildirdiği “yayın yok” ile karıştırma.
    render('BAĞLANTI KESİLDİ', 'Yayın bilgisine ulaşılamıyor.');
    if (!navigator.onLine) return;
    retryTimer = setTimeout(connect, retryDelay);
    retryDelay = Math.min(retryDelay * 2, 30000);
  }

  function connect() {
    clearTimeout(retryTimer);
    retryTimer = null;
    if (suspended || socket) return;
    if (!navigator.onLine) {
      render('BAĞLANTI YOK', 'İnternet bağlantısı bekleniyor.');
      return;
    }
    if (!('WebSocket' in window)) {
      render('BAĞLANTI YOK', 'Bu tarayıcı radyo bağlantısını desteklemiyor.');
      return;
    }

    render('BAĞLANIYOR', 'Yayın bilgisi alınıyor.');
    try {
      const current = new WebSocket(endpoint);
      socket = current;

      // İlk gerçek durum gelmeden bağlantıyı başarılı sayma.
      connectionTimer = setTimeout(() => {
        if (socket === current) retry();
      }, 10000);

      current.addEventListener('message', (event) => {
        if (socket !== current) return;
        try {
          if (typeof event.data !== 'string' || event.data.length > 16384) throw new Error();
          const message = JSON.parse(event.data);
          if (message?.type !== 'radio_state') return;
          if (message.version !== 1 || !renderState(message.payload)) throw new Error();
          clearTimeout(connectionTimer);
          connectionTimer = null;
          retryDelay = 1000;
        } catch {
          retry();
        }
      });
      current.addEventListener('close', () => {
        if (socket === current) retry();
      });
      current.addEventListener('error', () => {
        if (socket === current) retry();
      });
    } catch {
      retry();
    }
  }

  window.addEventListener('offline', retry);
  window.addEventListener('online', connect);
  window.addEventListener('pagehide', () => {
    suspended = true;
    clearTimeout(retryTimer);
    disconnect();
  });
  window.addEventListener('pageshow', () => {
    suspended = false;
    connect();
  });
  connect();
})();
