// Lab Radio / senkron dinleyici. Sunucuya komut veya token göndermez.
(() => {
  const room = document.querySelector('[data-radio-room]');
  if (!room) return;
  const start = room.querySelector('[data-radio-start]');
  const stop = room.querySelector('[data-radio-stop]');
  const status = room.querySelector('[data-radio-message]');
  const video = room.querySelector('[data-radio-video]');
  const cassette = document.querySelector('[data-player-audio]');
  let state = null;
  let player = null;
  let ready = false;
  let listening = false;
  let loadedId = null;
  let apiPromise = null;
  let receivedAt = 0;
  let lastSeek = -Infinity;

  function say(text) { status.textContent = text; }
  function controls() {
    start.disabled = !state?.live;
    start.textContent = listening ? 'Yayına eşitle' : 'Radyoyu başlat';
    stop.disabled = !listening;
  }

  function pause(text) {
    listening = false;
    if (ready) player.pauseVideo();
    controls();
    say(text);
  }

  // Sunucunun ISO zaman damgasından güncel konum. Cihaz saati doğru olmalı.
  function position() {
    const elapsed = state.state === 'playing'
      ? Math.max(0, (Date.now() - Date.parse(state.sourceTimestamp)) / 1000) : 0;
    const expected = state.sourcePosition + elapsed;
    const duration = player.getDuration();
    return duration > 0 && loadedId === state.videoId
      ? Math.min(expected, Math.max(0, duration - 0.1)) : expected;
  }

  function sync(force = false) {
    if (!ready || !listening || !state?.live) return;
    if (performance.now() - receivedAt > 35000) {
      state = null;
      pause('Yayın güncellemesi kesildi. Yeni bilgi gelince yeniden başlat.');
      return;
    }
    const target = position();
    if (loadedId !== state.videoId) {
      loadedId = state.videoId;
      lastSeek = performance.now();
      const track = { videoId: state.videoId, startSeconds: target };
      if (state.state === 'playing') player.loadVideoById(track);
      else player.cueVideoById(track);
    } else {
      // Ufak farklarda oynatıcıya dokunma; sürekli seek sesi kesebilir.
      if (force || (Math.abs(player.getCurrentTime() - target) > 3 && performance.now() - lastSeek > 5000)) {
        player.seekTo(target, true);
        lastSeek = performance.now();
      }
      if (state.state === 'paused') player.pauseVideo();
      else if (force || player.getPlayerState() === 5) player.playVideo();
    }
    say(state.state === 'paused' ? 'DJ yayını duraklattı.' : 'Yayını takip ediyorsun.');
  }

  // YouTube'a ziyaretçi başlatmadan istek yapılmaz.
  function loadAPI() {
    if (window.YT?.Player) return Promise.resolve();
    if (apiPromise) return apiPromise;
    apiPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const timeout = setTimeout(fail, 15000);
      function fail() {
        clearTimeout(timeout);
        script.remove();
        apiPromise = null;
        reject(new Error('YouTube API unavailable'));
      }
      window.onYouTubeIframeAPIReady = () => { clearTimeout(timeout); resolve(); };
      script.onerror = fail;
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.append(script);
    });
    return apiPromise;
  }

  start.addEventListener('click', async () => {
    if (!state?.live) return;
    listening = true;
    cassette?.pause();
    controls();
    say('YouTube oynatıcısı hazırlanıyor…');
    if (ready) { sync(true); return; }
    try {
      await loadAPI();
      if (!listening || player) return;
      video.hidden = false;
      player = new YT.Player('radio-youtube-player', {
        width: '100%', height: '270',
        playerVars: { playsinline: 1, origin: location.origin, controls: 1 },
        events: {
          onReady(event) {
            ready = true;
            event.target.getIframe().title = 'Lab Radio YouTube oynatıcısı';
            sync(true);
          },
          onAutoplayBlocked() {
            pause('Tarayıcı oynatmayı engelledi. Radyoyu başlat veya videodaki oynat düğmesine bas.');
          },
          onError(event) {
            const messages = {
              100: 'Video kaldırılmış veya özel.',
              101: 'Bu videonun sitede oynatılmasına izin verilmiyor.',
              150: 'Bu videonun sitede oynatılmasına izin verilmiyor.',
              153: 'YouTube site kimliğini doğrulayamadı. Tarayıcının gizlilik/referrer ayarlarını kontrol et.'
            };
            loadedId = null;
            pause(messages[event.data] || 'YouTube bu videoyu oynatamadı. Yeniden deneyebilir veya sonraki şarkıyı bekleyebilirsin.');
          },
          onStateChange(event) {
            // Gömülü oynatıcının kendi pause/play kontrolü de yerel kalır.
            if (event.data === 2 && listening && state?.state === 'playing') {
              pause('Dinleme sende duraklatıldı. Başlatınca güncel yayına dönersin.');
            }
            if (event.data === 1) {
              if (!state?.live) { player.pauseVideo(); return; }
              cassette?.pause();
              if (!listening) { listening = true; controls(); sync(true); }
              else if (state.state === 'paused') player.pauseVideo();
            }
          }
        }
      });
    } catch {
      pause('YouTube yüklenemedi. Bağlantını veya içerik engelleyicini kontrol edip tekrar dene.');
    }
  });

  stop.addEventListener('click', () => pause('Dinleme durduruldu. Yayın diğer dinleyicilerde devam eder.'));
  cassette?.addEventListener('play', () => pause('Kasetçalar açık; radyo dinlemesi durduruldu.'));
  window.addEventListener('lab-radio-state', event => {
    const previous = state;
    state = event.detail;
    receivedAt = performance.now();
    controls();
    if (!state?.live) { pause(state ? 'Şu an yayın yok.' : 'Radyo bağlantısı kesildi.'); return; }
    if (listening) sync(previous?.state !== state.state);
    else say('Yayına katılmak için Radyoyu başlat.');
  });
  window.addEventListener('pagehide', () => pause('Dinleme durduruldu.'));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
  setInterval(() => sync(), 5000);
})();
