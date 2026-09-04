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

function escapeHtml(value = '') {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[character]);
}

function parseFrontMatter(source) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  const meta = {};
  if (match) {
    match[1].split('\n').forEach((line) => {
      const separator = line.indexOf(':');
      if (separator === -1) return;
      meta[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
    });
  }
  return { meta, body: match ? source.slice(match[0].length) : source };
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/!\[([^\]]*)\]\((images\/[A-Za-z0-9._/-]+\.(?:avif|gif|jpe?g|png|webp))\)/gi, '<img class="markdown-image" src="$2" alt="$1" loading="lazy">')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>')
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
    if (paragraph.length) output.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
    paragraph = [];
  };
  const closeList = () => {
    if (listOpen) output.push('</ul>');
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
      if (!listOpen) output.push('<ul>');
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

async function getCollection(kind) {
  const manifestResponse = await fetch(`${kind}/index.json`, { cache: 'no-store' });
  if (!manifestResponse.ok) throw new Error(`${kind}/index.json okunamadı`);
  const manifest = await manifestResponse.json();
  const filenames = kind === 'blog' ? manifest.posts : manifest.games;
  if (!Array.isArray(filenames)) throw new Error('İçerik listesi geçerli değil');

  const records = await Promise.all(filenames.map(async (filename) => {
    const response = await fetch(`${kind}/${filename}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${filename} okunamadı`);
    const parsed = parseFrontMatter(await response.text());
    return { ...parsed, filename, slug: filename.replace(/\.md$/i, '') };
  }));
  return records.filter((record) => record.meta.draft !== 'true');
}

function makeRecordLink(kind, record) {
  const page = kind === 'blog' ? 'blog.html' : 'games.html';
  const parameter = kind === 'blog' ? 'post' : 'game';
  return `${page}?${parameter}=${encodeURIComponent(record.slug)}`;
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long' }).format(date);
}

function renderEmptyList(container, kind) {
  const label = kind === 'blog' ? 'LOG 000' : 'NO SAVES';
  const title = kind === 'blog' ? 'Henüz yayımlanmış yazı yok.' : 'Kütüphane henüz boş.';
  const message = kind === 'blog'
    ? 'İlk Markdown yazını eklediğinde burada kendiliğinden görünecek.'
    : 'İlk Markdown oyun kaydını eklediğinde burada kendiliğinden görünecek.';
  container.innerHTML = `<div class="empty-state compact"><div><span class="empty-code">${label}</span><h2>${title}</h2><p>${message}</p></div></div>`;
}

function renderRecordList(container, kind, records) {
  if (!records.length) {
    renderEmptyList(container, kind);
    return;
  }
  const list = document.createElement('ol');
  list.className = kind === 'blog' ? 'record-list' : 'game-list';
  records.forEach((record, index) => {
    const item = document.createElement('li');
    const image = /^images\/[A-Za-z0-9._/-]+\.(avif|gif|jpe?g|png|webp)$/i.test(record.meta.image || '')
      ? `<img class="record-thumb" src="${escapeHtml(record.meta.image)}" alt="" loading="lazy">`
      : '';
    const meta = kind === 'blog'
      ? formatDate(record.meta.date)
      : [record.meta.platform, record.meta.status].filter(Boolean).join(' / ');
    item.innerHTML = `<span>${String(index + 1).padStart(3, '0')}</span><a href="${makeRecordLink(kind, record)}">${image}<span class="record-copy"><strong>${escapeHtml(record.meta.title || record.slug)}</strong><small>${escapeHtml(record.meta.summary || '')}</small></span></a><span>${escapeHtml(meta)}</span>`;
    list.appendChild(item);
  });
  container.replaceChildren(list);
}

function renderReader(root, kind, records) {
  const parameter = kind === 'blog' ? 'post' : 'game';
  const slug = new URLSearchParams(location.search).get(parameter);
  if (!slug) return;
  const record = records.find((item) => item.slug === slug);
  if (!record) return;

  const reader = root.querySelector('[data-library-reader]');
  const meta = kind === 'blog'
    ? [formatDate(record.meta.date), record.meta.tags].filter(Boolean).join(' / ')
    : [record.meta.year, record.meta.platform, record.meta.status].filter(Boolean).join(' / ');
  reader.querySelector('[data-reader-meta]').textContent = meta;
  reader.querySelector('[data-reader-title]').textContent = record.meta.title || record.slug;
  reader.querySelector('[data-reader-summary]').textContent = record.meta.summary || '';
  const cover = reader.querySelector('[data-reader-image]');
  if (cover && /^images\/[A-Za-z0-9._/-]+\.(avif|gif|jpe?g|png|webp)$/i.test(record.meta.image || '')) {
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
  if (!root) return;
  const kind = root.dataset.library;
  const listContainer = root.querySelector('[data-library-list]');
  const count = root.querySelector('[data-library-count]');
  try {
    const records = await getCollection(kind);
    const sorted = records.sort((a, b) => (b.meta.date || b.meta.year || '').localeCompare(a.meta.date || a.meta.year || ''));
    count.textContent = `${sorted.length} kayıt`;
    renderRecordList(listContainer, kind, sorted);
    renderReader(root, kind, sorted);
  } catch (error) {
    count.textContent = 'okunamadı';
    listContainer.innerHTML = '<p class="load-error">İçerikler yüklenemedi. Siteyi dosyaya çift tıklayarak değil, VS Code Live Server ile açtığından emin ol.</p>';
    console.error(error);
  }
}

async function setupHomeContent() {
  const blogTitle = document.querySelector('[data-latest-blog-title]');
  if (!blogTitle) return;
  try {
    const posts = (await getCollection('blog')).sort((a, b) => (b.meta.date || '').localeCompare(a.meta.date || ''));
    if (posts[0]) {
      document.querySelector('[data-latest-blog-status]').innerHTML = `<span class="signal signal-live"></span>${escapeHtml(formatDate(posts[0].meta.date))}`;
      blogTitle.textContent = posts[0].meta.title;
      document.querySelector('[data-latest-blog-summary]').textContent = posts[0].meta.summary || '';
      document.querySelector('[data-latest-blog-link]').href = makeRecordLink('blog', posts[0]);
    }
    const games = await getCollection('games');
    if (games[0]) {
      document.querySelector('[data-latest-game-title]').textContent = games[0].meta.title;
      document.querySelector('[data-latest-game-summary]').textContent = games[0].meta.summary || '';
    }
  } catch (error) {
    console.error(error);
  }
}

setupTheme();
setupYear();
setupTimer();
setupLibrary();
setupHomeContent();
