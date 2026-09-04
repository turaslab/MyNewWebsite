// ------------------------------------------------------------
// Tura's Lab — ortak site davranışları
// ------------------------------------------------------------

const THEMES = new Set([
  'paper',
  'garage',
  'citypop',
  'lounge',
  'lowpoly',
]);

const THEME_KEY = 'turas-lab-theme';
const TIMER_KEY = 'turas-lab-timer';
const PLAYER_TRACK_KEY = 'turas-lab-player-track';

// Her içerik odasının dosya yapısı ve ekranda kullanacağı metinler burada.
// Yeni bir oda eklemek gerektiğinde önce bu tabloya bir kayıt eklenebilir.
const COLLECTIONS = {
  blog: {
    manifestKey: 'posts',
    page: 'blog.html',
    queryParameter: 'post',
    listClass: 'record-list',
    emptyCode: 'LOG 000',
    emptyTitle: 'Henüz yayımlanmış yazı yok.',
    emptyMessage: 'İlk Markdown yazını eklediğinde burada kendiliğinden görünecek.',
    sortValue: (record) => record.meta.date || '',
    listMeta: (record) => formatDate(record.meta.date),
    readerMeta: (record) => [
      formatDate(record.meta.date),
      record.meta.tags,
    ],
  },
  games: {
    manifestKey: 'games',
    page: 'games.html',
    queryParameter: 'game',
    listClass: 'game-list',
    emptyCode: 'NO SAVES',
    emptyTitle: 'Kütüphane henüz boş.',
    emptyMessage: 'İlk Markdown oyun kaydını eklediğinde burada kendiliğinden görünecek.',
    sortValue: (record) => record.meta.year || '',
    listMeta: (record) => [record.meta.platform, record.meta.status],
    readerMeta: (record) => [
      record.meta.year,
      record.meta.platform,
      record.meta.status,
    ],
  },
  music: {
    manifestKey: 'albums',
    page: 'music.html',
    queryParameter: 'album',
    listClass: 'record-list',
    emptyCode: 'SIDE A / 000',
    emptyTitle: 'Müzik rafı henüz boş.',
    emptyMessage: 'İlk Markdown albüm kaydını eklediğinde burada kendiliğinden görünecek.',
    sortValue: (record) => record.meta.year || '',
    listMeta: (record) => [record.meta.artist, record.meta.year],
    readerMeta: (record) => [
      record.meta.artist,
      record.meta.year,
      record.meta.format,
      record.meta.status,
    ],
  },
};

// ------------------------------------------------------------
// Tema yönetimi
// ------------------------------------------------------------

function applyTheme(theme) {
  const safeTheme = THEMES.has(theme) ? theme : 'paper';

  document.documentElement.dataset.theme = safeTheme;
  localStorage.setItem(THEME_KEY, safeTheme);

  const select = document.querySelector('#theme-select');
  if (select) {
    select.value = safeTheme;
  }
}

function setupTheme() {
  applyTheme(localStorage.getItem(THEME_KEY) || 'paper');

  document.querySelector('#theme-select')?.addEventListener('change', (event) => {
    applyTheme(event.target.value);
  });
}

function setupYear() {
  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
}

// ------------------------------------------------------------
// Pomodoro sayacı
// ------------------------------------------------------------

function setupTimer() {
  const display = document.querySelector('.timer');
  const toggle = document.querySelector('[data-timer="toggle"]');
  const reset = document.querySelector('[data-timer="reset"]');

  // Sayaç yalnızca ana sayfada var. Diğer sayfalarda sessizce çıkılır.
  if (!display || !toggle || !reset) {
    return;
  }

  const defaultState = {
    remaining: 25 * 60,
    running: false,
    updatedAt: Date.now(),
  };

  let state;

  try {
    state = {
      ...defaultState,
      ...JSON.parse(localStorage.getItem(TIMER_KEY) || '{}'),
    };
  } catch {
    state = { ...defaultState };
  }

  // Sekme kapalıyken geçen süreyi geri dönüldüğünde hesaba kat.
  if (state.running) {
    const elapsedSeconds = Math.floor((Date.now() - state.updatedAt) / 1000);
    state.remaining = Math.max(0, state.remaining - elapsedSeconds);

    if (state.remaining === 0) {
      state.running = false;
    }
  }

  const save = () => {
    localStorage.setItem(
      TIMER_KEY,
      JSON.stringify({ ...state, updatedAt: Date.now() }),
    );
  };

  const render = () => {
    const minutes = Math.floor(state.remaining / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (state.remaining % 60).toString().padStart(2, '0');

    display.textContent = `${minutes}:${seconds}`;
    toggle.textContent = state.running
      ? 'Duraklat'
      : state.remaining === 0
        ? 'Yeniden başlat'
        : 'Başlat';

    document.title = state.running
      ? `${minutes}:${seconds} — Tura's Lab`
      : "Tura's Lab — kişisel arşivler ve dijital deneyler";
  };

  toggle.addEventListener('click', () => {
    if (state.remaining === 0) {
      state.remaining = 25 * 60;
    }

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
    if (!state.running) {
      return;
    }

    state.remaining = Math.max(0, state.remaining - 1);
    state.updatedAt = Date.now();

    if (state.remaining === 0) {
      state.running = false;
    }

    save();
    render();
  }, 1000);

  render();
}

// ------------------------------------------------------------
// Ana sayfa müzik çaları
// ------------------------------------------------------------

function formatPlayerTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '00:00';
  }

  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');

  return `${minutes}:${remainingSeconds}`;
}

async function setupMusicPlayer() {
  const root = document.querySelector('[data-music-player]');

  // Müzik çaları yalnızca ana sayfa içerir.
  if (!root) {
    return;
  }

  const audio = root.querySelector('[data-player-audio]');
  const previous = root.querySelector('[data-player="previous"]');
  const toggle = root.querySelector('[data-player="toggle"]');
  const next = root.querySelector('[data-player="next"]');
  const seek = root.querySelector('[data-player="seek"]');
  const status = root.querySelector('[data-player-status]');
  const title = root.querySelector('[data-player-title]');
  const artist = root.querySelector('[data-player-artist]');
  const time = root.querySelector('[data-player-time]');
  const message = root.querySelector('[data-player-message]');

  let tracks = [];
  let trackIndex = 0;

  const updateToggleButton = () => {
    const isPlaying = !audio.paused;
    toggle.textContent = isPlaying ? 'Ⅱ' : '▶';
    toggle.setAttribute(
      'aria-label',
      isPlaying ? 'Parçayı duraklat' : 'Parçayı oynat',
    );
    toggle.setAttribute('aria-pressed', String(isPlaying));
    status.textContent = isPlaying ? 'LAB RADIO / ÇALIYOR' : 'LAB RADIO / HAZIR';
  };

  const updateProgress = () => {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const currentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    seek.value = progress;
    seek.style.setProperty('--progress', `${progress}%`);
    time.textContent = `${formatPlayerTime(currentTime)} / ${formatPlayerTime(duration)}`;
  };

  const playCurrentTrack = async () => {
    try {
      await audio.play();
      message.textContent = '';
    } catch (error) {
      message.textContent = 'Tarayıcı oynatmayı engelledi; yeniden ▶ düğmesine bas.';
      console.error(error);
    }
  };

  const loadTrack = (newIndex, shouldPlay = false) => {
    if (!tracks.length) {
      return;
    }

    trackIndex = (newIndex + tracks.length) % tracks.length;
    const track = tracks[trackIndex];

    localStorage.setItem(PLAYER_TRACK_KEY, track.id);
    audio.src = track.file;
    audio.load();

    title.textContent = track.title;
    artist.textContent = track.artist;
    status.textContent = 'LAB RADIO / HAZIRLANIYOR';
    message.textContent = '';
    toggle.disabled = true;
    seek.disabled = true;
    updateProgress();

    if (shouldPlay) {
      audio.addEventListener(
        'canplay',
        () => {
          playCurrentTrack();
        },
        { once: true },
      );
    }
  };

  const changeTrack = (offset, shouldPlay = !audio.paused) => {
    loadTrack(trackIndex + offset, shouldPlay);
  };

  toggle.addEventListener('click', () => {
    if (audio.paused) {
      playCurrentTrack();
    } else {
      audio.pause();
    }
  });

  previous.addEventListener('click', () => {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      updateProgress();
      return;
    }

    changeTrack(-1);
  });

  next.addEventListener('click', () => {
    changeTrack(1);
  });

  seek.addEventListener('input', () => {
    if (Number.isFinite(audio.duration)) {
      audio.currentTime = (Number(seek.value) / 100) * audio.duration;
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    toggle.disabled = false;
    seek.disabled = false;
    updateProgress();
    updateToggleButton();
  });

  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('play', updateToggleButton);
  audio.addEventListener('pause', updateToggleButton);
  audio.addEventListener('ended', () => {
    const hasNextTrack = trackIndex < tracks.length - 1;

    if (hasNextTrack) {
      changeTrack(1, true);
    } else {
      audio.currentTime = 0;
      updateProgress();
      updateToggleButton();
    }
  });
  audio.addEventListener('error', () => {
    status.textContent = 'LAB RADIO / HATA';
    message.textContent = 'Ses dosyası açılamadı. Çalma listesindeki yolu kontrol et.';
    toggle.disabled = true;
    seek.disabled = true;
  });

  try {
    const response = await fetch('music/playlist.json', { cache: 'no-store' });

    if (!response.ok) {
      throw new Error('music/playlist.json okunamadı');
    }

    const playlist = await response.json();
    const safeAudioPath = /^audio\/music\/[A-Za-z0-9._/-]+\.(?:aac|m4a|mp3|ogg|wav)$/i;

    tracks = Array.isArray(playlist.tracks)
      ? playlist.tracks.filter((track) => {
          return track.id && track.title && track.artist && safeAudioPath.test(track.file || '');
        })
      : [];

    if (!tracks.length) {
      status.textContent = 'LAB RADIO / BOŞ';
      title.textContent = 'Çalma listesi boş.';
      artist.textContent = 'music/playlist.json dosyasına ilk parçayı ekle.';
      message.textContent = '';
      return;
    }

    const savedTrackId = localStorage.getItem(PLAYER_TRACK_KEY);
    const savedIndex = tracks.findIndex((track) => track.id === savedTrackId);
    const initialIndex = savedIndex >= 0 ? savedIndex : 0;

    const hasMultipleTracks = tracks.length > 1;
    previous.disabled = !hasMultipleTracks;
    next.disabled = !hasMultipleTracks;
    loadTrack(initialIndex);
  } catch (error) {
    status.textContent = 'LAB RADIO / HATA';
    title.textContent = 'Çalma listesi okunamadı.';
    artist.textContent = 'Yerel sunucuyu ve playlist dosyasını kontrol et.';
    message.textContent = '';
    console.error(error);
  }
}

// ------------------------------------------------------------
// Güvenli metin ve küçük Markdown dönüştürücü
// ------------------------------------------------------------

function escapeHtml(value = '') {
  const characters = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return value.replace(/[&<>"']/g, (character) => characters[character]);
}

function parseFrontMatter(source) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  const meta = {};

  if (match) {
    match[1].split('\n').forEach((line) => {
      const separator = line.indexOf(':');

      if (separator === -1) {
        return;
      }

      const key = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim();
      meta[key] = value;
    });
  }

  return {
    meta,
    body: match ? source.slice(match[0].length) : source,
  };
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(
      /!\[([^\]]*)\]\((images\/[A-Za-z0-9._/-]+\.(?:avif|gif|jpe?g|png|webp))\)/gi,
      '<img class="markdown-image" src="$2" alt="$1" loading="lazy">',
    )
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" rel="noopener noreferrer">$1</a>',
    )
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function markdownToHtml(markdown) {
  const lines = markdown.trim().split('\n');
  const output = [];
  let paragraph = [];
  let listOpen = false;

  const closeParagraph = () => {
    if (paragraph.length) {
      output.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
    }

    paragraph = [];
  };

  const closeList = () => {
    if (listOpen) {
      output.push('</ul>');
    }

    listOpen = false;
  };

  lines.forEach((line) => {
    if (!line.trim()) {
      closeParagraph();
      closeList();
      return;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)/);
    if (heading) {
      closeParagraph();
      closeList();

      const level = Math.min(heading[1].length + 1, 4);
      output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      return;
    }

    const item = line.match(/^[-*]\s+(.+)/);
    if (item) {
      closeParagraph();

      if (!listOpen) {
        output.push('<ul>');
      }

      listOpen = true;
      output.push(`<li>${inlineMarkdown(item[1])}</li>`);
      return;
    }

    paragraph.push(line.trim());
  });

  closeParagraph();
  closeList();

  return output.join('');
}

// ------------------------------------------------------------
// Blog, oyun ve müzik koleksiyonlarını okuma
// ------------------------------------------------------------

function getCollectionConfig(kind) {
  const config = COLLECTIONS[kind];

  if (!config) {
    throw new Error(`Bilinmeyen içerik koleksiyonu: ${kind}`);
  }

  return config;
}

async function getCollection(kind) {
  const config = getCollectionConfig(kind);
  const manifestResponse = await fetch(`${kind}/index.json`, {
    cache: 'no-store',
  });

  if (!manifestResponse.ok) {
    throw new Error(`${kind}/index.json okunamadı`);
  }

  const manifest = await manifestResponse.json();
  const filenames = manifest[config.manifestKey];

  if (!Array.isArray(filenames)) {
    throw new Error(`${kind} içerik listesi geçerli değil`);
  }

  const records = await Promise.all(
    filenames.map(async (filename) => {
      const response = await fetch(`${kind}/${filename}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`${filename} okunamadı`);
      }

      const parsed = parseFrontMatter(await response.text());

      return {
        ...parsed,
        filename,
        slug: filename.replace(/\.md$/i, ''),
      };
    }),
  );

  return records.filter((record) => record.meta.draft !== 'true');
}

function sortRecords(kind, records) {
  const config = getCollectionConfig(kind);

  return records.sort((first, second) => {
    return config.sortValue(second).localeCompare(config.sortValue(first));
  });
}

function makeRecordLink(kind, record) {
  const config = getCollectionConfig(kind);
  const slug = encodeURIComponent(record.slug);

  return `${config.page}?${config.queryParameter}=${slug}`;
}

function formatDate(value) {
  if (!value) {
    return '';
  }

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'long',
  }).format(date);
}

function joinMeta(parts) {
  const values = Array.isArray(parts) ? parts : [parts];
  return values.filter(Boolean).join(' / ');
}

// ------------------------------------------------------------
// Arşiv listeleri ve Markdown okuyucu
// ------------------------------------------------------------

function renderEmptyList(container, kind) {
  const config = getCollectionConfig(kind);

  container.innerHTML = `
    <div class="empty-state compact">
      <div>
        <span class="empty-code">${config.emptyCode}</span>
        <h2>${config.emptyTitle}</h2>
        <p>${config.emptyMessage}</p>
      </div>
    </div>
  `;
}

function renderRecordList(container, kind, records) {
  if (!records.length) {
    renderEmptyList(container, kind);
    return;
  }

  const config = getCollectionConfig(kind);
  const list = document.createElement('ol');
  list.className = config.listClass;

  records.forEach((record, index) => {
    const item = document.createElement('li');
    const imageIsSafe = /^images\/[A-Za-z0-9._/-]+\.(avif|gif|jpe?g|png|webp)$/i.test(
      record.meta.image || '',
    );
    const image = imageIsSafe
      ? `<img class="record-thumb" src="${escapeHtml(record.meta.image)}" alt="" loading="lazy">`
      : '';
    const meta = joinMeta(config.listMeta(record));

    item.innerHTML = `
      <span>${String(index + 1).padStart(3, '0')}</span>
      <a href="${makeRecordLink(kind, record)}">
        ${image}
        <span class="record-copy">
          <strong>${escapeHtml(record.meta.title || record.slug)}</strong>
          <small>${escapeHtml(record.meta.summary || '')}</small>
        </span>
      </a>
      <span>${escapeHtml(meta)}</span>
    `;

    list.appendChild(item);
  });

  container.replaceChildren(list);
}

function renderReader(root, kind, records) {
  const config = getCollectionConfig(kind);
  const slug = new URLSearchParams(location.search).get(config.queryParameter);

  if (!slug) {
    return;
  }

  const record = records.find((item) => item.slug === slug);
  if (!record) {
    return;
  }

  const reader = root.querySelector('[data-library-reader]');
  if (!reader) {
    return;
  }

  reader.querySelector('[data-reader-meta]').textContent = joinMeta(
    config.readerMeta(record),
  );
  reader.querySelector('[data-reader-title]').textContent =
    record.meta.title || record.slug;
  reader.querySelector('[data-reader-summary]').textContent =
    record.meta.summary || '';

  const cover = reader.querySelector('[data-reader-image]');
  const imageIsSafe = /^images\/[A-Za-z0-9._/-]+\.(avif|gif|jpe?g|png|webp)$/i.test(
    record.meta.image || '',
  );

  if (cover && imageIsSafe) {
    cover.src = record.meta.image;
    cover.alt = record.meta.image_alt || '';
    cover.hidden = false;
  }

  reader.querySelector('[data-reader-body]').innerHTML = markdownToHtml(record.body);
  reader.hidden = false;
  reader.scrollIntoView({ block: 'start' });

  document.title = `${record.meta.title || record.slug} — Tura's Lab`;
}

async function setupLibrary() {
  const root = document.querySelector('[data-library]');

  // Oda sayfasında arşiv yoksa bu işlevin yapacağı bir şey yok.
  if (!root) {
    return;
  }

  const kind = root.dataset.library;
  const listContainer = root.querySelector('[data-library-list]');
  const count = root.querySelector('[data-library-count]');

  try {
    const records = sortRecords(kind, await getCollection(kind));

    count.textContent = `${records.length} kayıt`;
    renderRecordList(listContainer, kind, records);
    renderReader(root, kind, records);
  } catch (error) {
    count.textContent = 'okunamadı';
    listContainer.innerHTML = `
      <p class="load-error">
        İçerikler yüklenemedi. Siteyi dosyaya çift tıklayarak değil,
        VS Code Live Server ile açtığından emin ol.
      </p>
    `;
    console.error(error);
  }
}

// ------------------------------------------------------------
// Ana sayfadaki son içerik önizlemeleri
// ------------------------------------------------------------

async function setupHomeContent() {
  const blogTitle = document.querySelector('[data-latest-blog-title]');

  // Bu işaret yoksa ziyaretçi ana sayfada değildir.
  if (!blogTitle) {
    return;
  }

  try {
    const posts = sortRecords('blog', await getCollection('blog'));
    const latestPost = posts[0];

    if (latestPost) {
      document.querySelector('[data-latest-blog-status]').innerHTML = `
        <span class="signal signal-live"></span>
        ${escapeHtml(formatDate(latestPost.meta.date))}
      `;
      blogTitle.textContent = latestPost.meta.title;
      document.querySelector('[data-latest-blog-summary]').textContent =
        latestPost.meta.summary || '';
      document.querySelector('[data-latest-blog-link]').href = makeRecordLink(
        'blog',
        latestPost,
      );
    }
  } catch (error) {
    console.error(error);
  }

  try {
    const games = sortRecords('games', await getCollection('games'));
    const latestGame = games[0];

    if (latestGame) {
      document.querySelector('[data-latest-game-title]').textContent =
        latestGame.meta.title;
      document.querySelector('[data-latest-game-summary]').textContent =
        latestGame.meta.summary || '';
    }
  } catch (error) {
    console.error(error);
  }

}

// ------------------------------------------------------------
// Sayfa başlangıcı
// ------------------------------------------------------------

setupTheme();
setupYear();
setupTimer();
setupMusicPlayer();
setupLibrary();
setupHomeContent();
