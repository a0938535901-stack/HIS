// 大綱與內容都在這裡維護。
// 要放教材時，把內容寫進該頁的 content（可使用 HTML）；留空會顯示「內容準備中」。
const HIS_URL = 'https://his.dentall.io/test/#/registration';

const OUTLINE = [
  {
    title: '系統教學',
    links: [{ title: '開啟HIS系統', href: HIS_URL }],
    pages: [
      { id: 'his-teaching', title: 'HIS系統教學', intro: 'HIS 系統的功能與操作教學。', content: '' },
      { id: 'his-qa', title: 'HIS系統Q&A', intro: 'HIS 系統的常見問題與解答。', content: '' },
    ],
  },
  {
    title: '新客戶服務流程',
    pages: [
      { id: 'clinic-training', title: '診所教育訓練', intro: '到診所進行教育訓練時需要的內容。', content: '' },
      { id: 'clinic-onsite', title: '診所駐點', intro: '診所駐點的工作內容與注意事項。', content: '' },
      { id: 'cloud-module', title: '雲端模組教學', intro: '雲端模組的功能與操作教學。', content: '' },
    ],
  },
  {
    title: '健保資料查詢',
    noProgress: true,
    pages: [
      { id: 'nhi-codes', title: '健保代碼查詢', intro: '查詢健保代碼的方式與資料。', content: '' },
      { id: 'nhi-sites', title: '健保相關網站', intro: '工作上常用的健保相關網站。', content: '' },
    ],
  },
  {
    title: '診所常見Q&A',
    id: 'clinic-qa',
    intro: '診所經常詢問的問題與解答。',
    content: '',
    noProgress: true,
  },
];

// 考核專區不是學習單元，不計入學習進度
const ASSESSMENT = {
  id: 'assessment',
  title: '考核專區',
  intro: '客服人員的考核內容。',
  content: '',
  noProgress: true,
};

// 個人筆記存在各自的瀏覽器（localStorage），只有本人看得到
const NOTES_PAGE = { id: 'notes', title: '個人筆記' };
const NOTES_KEY = 'training-notes';
const HOME_NOTE_COUNT = 3;

// 小圖示（24×24 線條圖），鍵值對應頁面 id
const ICONS = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-6h4v6"/>',
  'his-teaching': '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8"/><path d="M12 16v4"/>',
  'his-qa': '<path d="M21 15a2 2 0 0 1-2 2H8l-5 4V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M9.5 8.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.7-.9 1.4"/><path d="M12 14.5h.01"/>',
  'clinic-training': '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5"/>',
  'clinic-onsite': '<path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  'cloud-module': '<path d="M7 18a4.5 4.5 0 0 1-.6-9 6 6 0 0 1 11.4 1.4A3.8 3.8 0 0 1 17.5 18z"/>',
  'nhi-codes': '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/>',
  'nhi-sites': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9s1.3-6.4 3.8-9z"/>',
  'clinic-qa': '<path d="M12 5c-1.6 0-2.8-1.2-4.8-1.2C4.6 3.8 3.5 6.4 3.5 9c0 3.2 1.4 4.6 2 7.8.4 2 .9 3.9 2.2 3.9 1.8 0 1.5-5.2 4.3-5.2s2.5 5.2 4.3 5.2c1.3 0 1.8-1.9 2.2-3.9.6-3.2 2-4.6 2-7.8 0-2.6-1.1-5.2-3.7-5.2C14.8 3.8 13.6 5 12 5z"/>',
  assessment: '<rect x="5" y="4" width="14" height="17" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 13l2 2 4-4"/>',
  done: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16 10"/>',
  doing: '<path d="M4 18c2-6 5-9 8-9s4 2 4 4-1.5 3-3 3"/><path d="M15 5h5v5"/><path d="M20 5l-6 6"/>',
  todo: '<path d="M5 21V4"/><path d="M5 4h12l-2.5 4L17 12H5"/>',
  external: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v6H4V6h6"/>',
  notes: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 12h6"/><path d="M9 16h6"/>',
  script: '<path d="M4 8h13"/><path d="M14 5l3 3-3 3"/><path d="M20 16H7"/><path d="M10 13l-3 3 3 3"/>',
};

// 日曆上的行程，由管理者在這裡維護，例如：
// { date: '2026-11-20', time: '14:00', title: '新進客服教育訓練' }
const CALENDAR_EVENTS = [];
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const EVENT_ALERT_DAYS = 3;

// 各單元進度圖的漸層色（順序對應 --unit-1 ~ --unit-8）
const UNIT_GRADIENTS = [
  ['#0a3f94', '#0f52ba'],
  ['#1f93ea', '#0284c7'],
  ['#0b8f7c', '#0d9488'],
  ['#9b6ae8', '#7c3aed'],
  ['#c9741e', '#b45309'],
  ['#0e9fc0', '#0891b2'],
  ['#2f9e4f', '#15803d'],
  ['#d6558f', '#be185d'],
];

// 話術對照表（範例內容，請依公司實際用語調整）。比對時會優先採用較長的用語。
const SCRIPT_RULES = [
  { from: '你操作錯了', to: '這裡的操作可能需要調整一下，我帶您一步一步看' },
  { from: '這不是我們的問題', to: '我們一起來釐清原因' },
  { from: '這不歸我管', to: '我幫您轉接負責的同仁' },
  { from: '我不知道', to: '我幫您確認後回覆您' },
  { from: '我不清楚', to: '這部分我幫您確認一下' },
  { from: '不知道', to: '我幫您確認後回覆您' },
  { from: '不清楚', to: '這部分我幫您確認一下' },
  { from: '沒辦法', to: '目前暫時無法' },
  { from: '不行', to: '目前無法這樣操作' },
  { from: '等一下', to: '稍等一下' },
  { from: '你們', to: '貴診所' },
  { from: '你', to: '您' },
];

// 學習進度存在各自的瀏覽器（localStorage），不會傳到其他地方。
const PROGRESS_KEY = 'training-progress';
const PROGRESS_LEVELS = [0, 25, 50, 75, 100];
const progress = loadProgress();
const notes = loadNotes();
let editingNoteId = null;
let notesFilterDate = null;

const calendarState = createCalendarState();
let searchActiveIndex = -1;

const main = document.getElementById('main');
const sidebar = document.getElementById('sidebar');
const menuButton = document.getElementById('menuButton');
const scriptButton = document.getElementById('scriptButton');
const scrim = document.getElementById('scrim');
const topbar = document.querySelector('.topbar');
const searchBox = document.getElementById('search');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const searchToggle = document.getElementById('searchToggle');

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function saveProgress() {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    return true;
  } catch (error) {
    return false;
  }
}

function loadNotes() {
  try {
    const saved = JSON.parse(localStorage.getItem(NOTES_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveNotes() {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return true;
  } catch (error) {
    return false;
  }
}

function pageProgress(id) {
  return progress[id] || 0;
}

// 主題進度 = 底下各頁進度的平均
function topicProgress(group) {
  const pages = group.pages || [group];
  const total = pages.reduce((sum, page) => sum + pageProgress(page.id), 0);
  return Math.round(total / pages.length);
}

// 有學習進度的主題（標記 noProgress 的查詢類頁面不計入）
function progressGroups() {
  return OUTLINE.filter((group) => !group.noProgress);
}

// 所有單元攤平，colorIndex 決定該單元的圖表顏色（--unit-1 ~ --unit-8）
function allPages() {
  return progressGroups()
    .flatMap((group) => (group.pages || [group]).map((page) => ({ page, group })))
    .map((item, index) => ({ ...item, colorIndex: index + 1, percent: pageProgress(item.page.id) }));
}

function renderIcon(id) {
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[id]}</svg>`;
}

function renderDonut(percent, title, iconId, colorIndex) {
  const [from, to] = UNIT_GRADIENTS[(colorIndex - 1) % UNIT_GRADIENTS.length];
  const gradientId = `unitGradient${colorIndex}`;
  const arc = percent > 0
    ? `<circle class="donut-value" stroke="url(#${gradientId})" cx="50" cy="50" r="40" pathLength="100" stroke-dasharray="${percent} 100" transform="rotate(-90 50 50)"/>`
    : '';
  return `
    <svg class="donut" viewBox="0 0 100 100" role="img" aria-label="${escapeHtml(title)}學習進度 ${percent}%">
      <title>${escapeHtml(title)}：${percent}%</title>
      <defs>
        <linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${from}"/>
          <stop offset="1" stop-color="${to}"/>
        </linearGradient>
      </defs>
      <circle class="donut-track" cx="50" cy="50" r="40"/>
      ${arc}
      <g class="donut-icon" transform="translate(39 24) scale(.92)">${ICONS[iconId]}</g>
      <text class="donut-label" x="50" y="62" text-anchor="middle" dominant-baseline="central">${percent}%</text>
    </svg>`;
}

function renderOverallRing(percent) {
  const arc = percent > 0
    ? `<circle class="overall-value" stroke="url(#overallGradient)" cx="50" cy="50" r="42" pathLength="100" stroke-dasharray="${percent} 100" transform="rotate(-90 50 50)"/>`
    : '';
  return `
    <svg class="overall-ring" viewBox="0 0 100 100" role="img" aria-label="整體學習進度 ${percent}%">
      <defs>
        <linearGradient id="overallGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0a3f94"/>
          <stop offset="1" stop-color="#1f93ea"/>
        </linearGradient>
      </defs>
      <circle class="overall-track" cx="50" cy="50" r="42"/>
      ${arc}
      <text class="overall-label" x="50" y="50" text-anchor="middle" dominant-baseline="central">${percent}%</text>
    </svg>`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function findPage(id) {
  if (id === ASSESSMENT.id) return { page: ASSESSMENT, group: null };
  for (const group of OUTLINE) {
    if (group.id === id) return { page: group, group: null };
    const page = (group.pages || []).find((item) => item.id === id);
    if (page) return { page, group };
  }
  return null;
}

function renderTopLink(page) {
  return `<div class="nav-group"><a class="nav-link is-top" href="#/${page.id}" data-route="${page.id}">${renderIcon(page.id)}${escapeHtml(page.title)}</a></div>`;
}

function renderSidebar() {
  const groups = OUTLINE.map((group) => {
    if (!group.pages) return renderTopLink(group);
    const links = group.pages
      .map((page) => `<li><a class="nav-link" href="#/${page.id}" data-route="${page.id}">${renderIcon(page.id)}${escapeHtml(page.title)}</a></li>`)
      .join('');
    const externalLinks = (group.links || [])
      .map((link) => `<li><a class="nav-link" href="${link.href}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(link.title)}（開新分頁）">${renderIcon('external')}${escapeHtml(link.title)}</a></li>`)
      .join('');
    return `<div class="nav-group"><p class="nav-title">${escapeHtml(group.title)}</p><ul class="nav-list">${links}${externalLinks}</ul></div>`;
  }).join('');

  document.getElementById('sidebarNav').innerHTML = `<div class="nav-group"><a class="nav-link is-top" href="#/" data-route="">${renderIcon('home')}首頁</a></div>${groups}${renderTopLink(ASSESSMENT)}${renderTopLink(NOTES_PAGE)}`;
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return '早安';
  return hour < 18 ? '午安' : '晚安';
}

function renderHome() {
  const pages = allPages();
  const total = pages.length;
  const done = pages.filter((item) => item.percent === 100).length;
  const notStarted = pages.filter((item) => item.percent === 0).length;
  const inProgress = total - done - notStarted;
  const overall = Math.round(pages.reduce((sum, item) => sum + item.percent, 0) / total);

  const topics = progressGroups().map((group) => {
    const percent = topicProgress(group);
    return `
      <li>
        <div class="topic-row"><span>${escapeHtml(group.title)}</span><b>${percent}%</b></div>
        <div class="topic-bar" aria-hidden="true"><span style="width: ${percent}%"></span></div>
      </li>`;
  }).join('');

  const tiles = pages.map(({ page, group, colorIndex, percent }) => `
    <a class="donut-tile" href="#/${page.id}" style="--ring: var(--unit-${colorIndex})">
      ${renderDonut(percent, page.title, page.id, colorIndex)}
      <span class="donut-name">${escapeHtml(page.title)}</span>
      <span class="donut-topic">${escapeHtml(group.title)}</span>
    </a>`).join('');

  // 進行中的排前面，其次是未開始的
  const nextItems = pages
    .filter((item) => item.percent < 100)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 4)
    .map(({ page, group, colorIndex, percent }) => `
      <li>
        <a class="next-item" href="#/${page.id}" style="--ring: var(--unit-${colorIndex})">
          ${renderIcon(page.id)}
          <span class="next-text">
            <span class="next-name">${escapeHtml(page.title)}</span>
            <span class="next-topic">${escapeHtml(group.title)}</span>
          </span>
          ${percent > 0
            ? `<span class="pill is-active">進行中 ${percent}%</span>`
            : '<span class="pill">未開始</span>'}
        </a>
      </li>`).join('');

  main.innerHTML = `
    <div class="bento">
    <section class="hero b-hero">
      <img class="hero-logo" src="logo.png" alt="dentall 牙e通 logo">
      <div class="hero-copy">
        <h1>牙e通客戶成功培訓</h1>
        <p>${greeting()}！你已完成 ${done} 個單元，還有 ${total - done} 個單元待學習。</p>
      </div>
      <svg class="hero-art" viewBox="0 0 400 400" aria-hidden="true">
        <g fill="none" stroke="#0f52ba">
          <circle cx="200" cy="205" r="195" stroke-opacity=".14" stroke-width="2"/>
          <circle cx="200" cy="205" r="155" stroke-opacity=".22" stroke-width="2"/>
        </g>
        <path transform="translate(50 60) scale(.75)" fill="#ffffff" fill-opacity=".7" stroke="#0f52ba" stroke-width="7" stroke-linejoin="round"
          d="M200 70C170 70 150 50 115 50C70 50 50 95 50 145C50 200 75 225 85 280C92 320 100 360 125 360C155 360 150 270 200 270C250 270 245 360 275 360C300 360 308 320 315 280C325 225 350 200 350 145C350 95 330 50 285 50C250 50 230 70 200 70Z"/>
        <circle cx="200" cy="175" r="44" fill="#0f52ba"/>
        <path d="M180 176l14 14 27-29" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </section>
    <section class="tile glass b-calendar" id="calendar" aria-label="日曆"></section>
    <section class="tile stat b-done">
      <div class="stat-head"><span class="stat-icon">${renderIcon('done')}</span><p class="tile-label">已完成</p></div>
      <p class="stat-value">${done}<small>/ ${total} 單元</small></p>
    </section>
    <section class="tile stat b-doing">
      <div class="stat-head"><span class="stat-icon">${renderIcon('doing')}</span><p class="tile-label">進行中</p></div>
      <p class="stat-value">${inProgress}<small>單元</small></p>
    </section>
    <section class="tile stat b-todo">
      <div class="stat-head"><span class="stat-icon">${renderIcon('todo')}</span><p class="tile-label">未開始</p></div>
      <p class="stat-value">${notStarted}<small>單元</small></p>
    </section>
    <a class="tile b-assess" href="#/${ASSESSMENT.id}">
      <span class="stat-icon">${renderIcon(ASSESSMENT.id)}</span>
      <span class="assess-title">${escapeHtml(ASSESSMENT.title)}</span>
      <span class="assess-go">前往查看 →</span>
    </a>
    <section class="tile glass b-units">
      <h2 class="panel-title">我的學習進度</h2>
      <p class="panel-hint">點進單元後可以更新進度。紀錄只存在這台電腦的這個瀏覽器。</p>
      <div class="donut-grid">${tiles}</div>
    </section>
    <section class="tile glass b-overall">
      ${renderOverallRing(overall)}
      <div class="overall-copy">
        <p class="tile-label">整體進度</p>
        <ul class="topic-list">${topics}</ul>
      </div>
    </section>
    <section class="tile glass b-next">
      <h2 class="panel-title">接下來學習</h2>
      <p class="panel-hint">${nextItems ? '從進行中的單元接著學。' : '所有單元都完成了！'}</p>
      ${nextItems ? `<ul class="next-list">${nextItems}</ul>` : ''}
    </section>
    <section class="tile glass b-notes" id="notesTile">${renderNotesTile()}</section>
    </div>`;

  renderCalendar();
}

function formatNoteTime(timestamp) {
  return new Date(timestamp).toLocaleString('zh-TW', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// 筆記的日期；舊筆記沒有日期欄位時，以最後編輯日為準
function noteDate(note) {
  if (note.date) return note.date;
  const updated = new Date(note.updatedAt);
  return dateKey(updated.getFullYear(), updated.getMonth(), updated.getDate());
}

function notesOn(date) {
  return notes.filter((note) => noteDate(note) === date);
}

function isDateKey(text) {
  return /^\d{4}-\d{2}-\d{2}$/.test(text) && !Number.isNaN(Date.parse(text));
}

function formatDateLabel(key) {
  const [year, month, day] = key.split('-').map(Number);
  const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()];
  const yearLabel = year === new Date().getFullYear() ? '' : `${year}年`;
  return `${yearLabel}${month}月${day}日（${weekday}）`;
}

function renderNoteDateField(date, canPick) {
  if (!canPick) return `<input type="hidden" name="date" value="${date}">`;
  return `
    <label class="note-date-field">
      <span>日期</span>
      <input type="date" name="date" value="${date}" required>
    </label>`;
}

function renderNoteForm(rows, date, canPickDate) {
  return `
    <form class="note-form" data-note-add>
      <textarea name="text" rows="${rows}" aria-label="新增筆記內容" placeholder="記下學到的重點…"></textarea>
      <div class="note-form-foot">
        ${renderNoteDateField(date, canPickDate)}
        <button class="button note-button" type="submit">新增筆記</button>
        <span class="status" role="status" data-note-status></span>
      </div>
    </form>`;
}

// 首頁筆記欄位跟著日曆選到的日期
function renderNotesTile() {
  const date = calendarState.selected;
  const dayNotes = notesOn(date);
  const latest = dayNotes.slice(0, HOME_NOTE_COUNT).map((note) => `
    <li>
      <a class="note-preview" href="#/${NOTES_PAGE.id}/${date}">
        <span class="note-preview-text">${escapeHtml(note.text)}</span>
        <span class="note-time">${formatNoteTime(note.updatedAt)}</span>
      </a>
    </li>`).join('');
  const more = dayNotes.length - HOME_NOTE_COUNT;

  return `
    <div class="tile-head">
      <h2 class="panel-title">${NOTES_PAGE.title}</h2>
      <a class="tile-link" href="#/${NOTES_PAGE.id}">查看全部${notes.length ? `（${notes.length}）` : ''}</a>
    </div>
    <p class="note-day">${formatDateLabel(date)}</p>
    ${renderNoteForm(2, date, false)}
    ${latest
      ? `<ul class="note-previews">${latest}</ul>`
      : '<p class="tile-note note-empty">這天還沒有筆記。點日曆可以切換日期。</p>'}
    ${more > 0 ? `<a class="tile-link note-more" href="#/${NOTES_PAGE.id}/${date}">這天還有 ${more} 則</a>` : ''}`;
}

// 切換日期時保留還沒送出的文字
function refreshNotesTileKeepingDraft() {
  const tile = document.getElementById('notesTile');
  if (!tile) return;
  const draft = tile.querySelector('textarea').value;
  tile.innerHTML = renderNotesTile();
  tile.querySelector('textarea').value = draft;
}

function renderNoteItem(note) {
  if (note.id === editingNoteId) {
    return `
      <li class="note-item">
        <form class="note-form" data-note-edit="${note.id}">
          <textarea name="text" rows="4" aria-label="編輯筆記內容">${escapeHtml(note.text)}</textarea>
          <div class="note-form-foot">
            ${renderNoteDateField(noteDate(note), true)}
            <button class="button note-button" type="submit">儲存</button>
            <button class="button secondary note-button" type="button" data-note-action="cancel">取消</button>
          </div>
        </form>
      </li>`;
  }
  return `
    <li class="note-item">
      <p class="note-text">${escapeHtml(note.text)}</p>
      <div class="note-foot">
        <span class="note-time">${formatNoteTime(note.updatedAt)}</span>
        <span class="note-actions">
          <button class="note-action" type="button" data-note-action="edit" data-note-id="${note.id}">編輯</button>
          <button class="note-action" type="button" data-note-action="delete" data-note-id="${note.id}">刪除</button>
        </span>
      </div>
    </li>`;
}

function renderNoteGroups() {
  const dates = [...new Set(notes.map(noteDate))].sort().reverse();
  return dates.map((date) => `
    <section class="note-group">
      <h2 class="note-group-title"><a href="#/${NOTES_PAGE.id}/${date}">${formatDateLabel(date)}</a></h2>
      <ul class="note-list">${notesOn(date).map(renderNoteItem).join('')}</ul>
    </section>`).join('');
}

function renderNotesPage() {
  const filter = notesFilterDate;
  const empty = '<div class="placeholder"><strong>還沒有筆記</strong>在上方輸入內容，就會出現在這裡。</div>';
  let list = notes.length ? renderNoteGroups() : empty;
  if (filter) {
    const dayNotes = notesOn(filter);
    list = dayNotes.length ? `<ul class="note-list">${dayNotes.map(renderNoteItem).join('')}</ul>` : empty;
  }

  main.innerHTML = `
    <div class="page">
      <h1 class="page-title">${NOTES_PAGE.title}${filter ? `：${formatDateLabel(filter)}` : ''}</h1>
      <p class="page-intro">筆記只存在這台電腦的這個瀏覽器，換電腦或清除瀏覽資料後就看不到了。</p>
      ${filter ? `<p class="page-link"><a class="tile-link" href="#/${NOTES_PAGE.id}">← 查看全部筆記</a></p>` : ''}
      <div class="notes-compose">${renderNoteForm(3, filter || todayKey(), !filter)}</div>
      ${list}
    </div>`;
}

// 依目前所在的頁面重畫筆記，並顯示狀態訊息
function refreshNotes(message, isAlert = false) {
  const tile = document.getElementById('notesTile');
  if (tile) {
    tile.innerHTML = renderNotesTile();
    renderCalendar();
  } else {
    renderNotesPage();
  }
  const status = main.querySelector('[data-note-status]');
  if (status && message) {
    status.textContent = message;
    markAlert(status, isAlert);
  }
}

// 讓狀態訊息所在的卡片顯示（或取消）警示發光
function markAlert(element, isAlert) {
  const card = element.closest('.tile, .progress-picker, .notes-compose');
  if (card) card.classList.toggle('is-alert', isAlert);
}

function saveNotesAndReport(text) {
  const saved = saveNotes();
  refreshNotes(saved ? text : '瀏覽器無法儲存，關閉網頁後筆記不會保留。', !saved);
}

function handleNoteSubmit(form) {
  const text = form.elements.text.value.trim();
  const date = form.elements.date.value || todayKey();

  if (!text) {
    const status = form.querySelector('[data-note-status]');
    if (status) status.textContent = '請先輸入內容。';
    form.elements.text.focus();
    return;
  }

  if (form.dataset.noteEdit) {
    const index = notes.findIndex((note) => note.id === form.dataset.noteEdit);
    if (index >= 0) {
      const [note] = notes.splice(index, 1);
      notes.unshift({ ...note, text, date, updatedAt: Date.now() });
    }
    editingNoteId = null;
    saveNotesAndReport('筆記已更新。');
    return;
  }

  notes.unshift({ id: `${Date.now()}-${notes.length}`, text, date, updatedAt: Date.now() });
  saveNotesAndReport(`筆記已新增到 ${formatDateLabel(date)}。`);
  main.querySelector('[data-note-add] textarea').focus();
}

function handleNoteAction(button) {
  const action = button.dataset.noteAction;
  const { noteId } = button.dataset;

  if (action === 'edit') {
    editingNoteId = noteId;
    refreshNotes();
    main.querySelector('[data-note-edit] textarea').focus();
  } else if (action === 'cancel') {
    editingNoteId = null;
    refreshNotes();
  } else if (action === 'delete' && window.confirm('確定要刪除這則筆記嗎？刪除後無法復原。')) {
    notes.splice(notes.findIndex((note) => note.id === noteId), 1);
    editingNoteId = null;
    saveNotesAndReport('筆記已刪除。');
  }
}

function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function todayKey() {
  const now = new Date();
  return dateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

function createCalendarState() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth(), selected: todayKey() };
}

// 今天起幾天內的行程，用來顯示到期提示
function upcomingEventCount() {
  const now = new Date();
  const last = new Date(now.getFullYear(), now.getMonth(), now.getDate() + EVENT_ALERT_DAYS);
  const lastKey = dateKey(last.getFullYear(), last.getMonth(), last.getDate());
  const today = todayKey();
  return CALENDAR_EVENTS.filter((item) => item.date >= today && item.date <= lastKey).length;
}

function renderCalendar(focusSelector) {
  const box = document.getElementById('calendar');
  if (!box) return;

  const upcoming = upcomingEventCount();
  box.classList.toggle('is-alert', upcoming > 0);

  const { year, month, selected } = calendarState;
  const today = todayKey();
  const blanks = new Date(year, month, 1).getDay();
  const dayCount = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array(blanks).fill('<td></td>'),
    ...Array.from({ length: dayCount }, (_, index) => {
      const day = index + 1;
      const key = dateKey(year, month, day);
      const count = CALENDAR_EVENTS.filter((item) => item.date === key).length;
      const noteCount = notesOn(key).length;
      const classes = ['cal-day', key === today ? 'is-today' : '', key === selected ? 'is-selected' : '', count ? 'has-event' : '', noteCount ? 'has-note' : '']
        .filter(Boolean)
        .join(' ');
      const label = `${month + 1}月${day}日${count ? `，${count} 個行程` : ''}${noteCount ? `，${noteCount} 則筆記` : ''}`;
      return `<td><button class="${classes}" type="button" data-cal="day" data-date="${key}" aria-label="${label}" aria-pressed="${key === selected}" ${key === today ? 'aria-current="date"' : ''}>${day}</button></td>`;
    }),
  ];
  while (cells.length % 7) cells.push('<td></td>');

  const rows = [];
  for (let index = 0; index < cells.length; index += 7) {
    rows.push(`<tr>${cells.slice(index, index + 7).join('')}</tr>`);
  }

  const selectedNotes = notesOn(selected).length;
  const events = CALENDAR_EVENTS
    .filter((item) => item.date === selected)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  const agenda = events.length
    ? `<ul class="cal-events">${events.map((item) => `<li><b>${escapeHtml(item.time || '全天')}</b>${escapeHtml(item.title)}</li>`).join('')}</ul>`
    : '<p class="tile-note">這天沒有安排。</p>';

  box.innerHTML = `
    <div class="cal-head">
      <h2 class="panel-title" aria-live="polite">${year}年${month + 1}月</h2>
      <div class="cal-actions">
        <button class="cal-nav" type="button" data-cal="prev" aria-label="上個月">‹</button>
        <button class="cal-today" type="button" data-cal="today">今天</button>
        <button class="cal-nav" type="button" data-cal="next" aria-label="下個月">›</button>
      </div>
    </div>
    <table class="cal-table">
      <thead><tr>${WEEKDAYS.map((day) => `<th scope="col">${day}</th>`).join('')}</tr></thead>
      <tbody>${rows.join('')}</tbody>
    </table>
    <p class="cal-legend"><i class="is-event"></i>行程<i class="is-note"></i>筆記</p>
    <div class="cal-agenda">
      ${upcoming ? `<p class="cal-alert">⚠ ${EVENT_ALERT_DAYS} 天內有 ${upcoming} 個行程</p>` : ''}
      <div class="tile-head cal-agenda-head">
        <p class="tile-label">${formatDateLabel(selected)}</p>
        <a class="tile-link" href="#/${NOTES_PAGE.id}/${selected}">${selectedNotes ? `${selectedNotes} 則筆記` : '寫筆記'} →</a>
      </div>
      ${agenda}
    </div>`;

  if (focusSelector) {
    const target = box.querySelector(focusSelector);
    if (target) target.focus();
  }
}

function handleCalendarClick(button) {
  const action = button.dataset.cal;

  if (action === 'day') {
    calendarState.selected = button.dataset.date;
    refreshNotesTileKeepingDraft();
    renderCalendar(`[data-date="${button.dataset.date}"]`);
    return;
  }

  if (action === 'today') {
    Object.assign(calendarState, createCalendarState());
    refreshNotesTileKeepingDraft();
  } else {
    const moved = new Date(calendarState.year, calendarState.month + (action === 'next' ? 1 : -1), 1);
    calendarState.year = moved.getFullYear();
    calendarState.month = moved.getMonth();
  }
  renderCalendar(`[data-cal="${action}"]`);
}

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent;
}

function searchablePages() {
  const pages = OUTLINE.flatMap((group) => (group.pages || [group]).map((page) => ({
    id: page.id,
    title: page.title,
    groupTitle: group.pages ? group.title : '',
    text: `${page.intro} ${stripHtml(page.content)}`,
  })));
  return [
    ...pages,
    { id: ASSESSMENT.id, title: ASSESSMENT.title, groupTitle: '', text: `${ASSESSMENT.intro} ${stripHtml(ASSESSMENT.content)}` },
    {
      id: NOTES_PAGE.id,
      title: NOTES_PAGE.title,
      groupTitle: '',
      text: notes.map((note) => note.text).join(' '),
    },
    {
      id: 'script',
      title: '客服話術轉換',
      groupTitle: '',
      text: SCRIPT_RULES.map((rule) => `${rule.from} ${rule.to}`).join(' '),
    },
  ];
}

// 不分大小寫，並忽略 &，讓「qa」也找得到「Q&A」
function normalizeSearch(text) {
  return text.toLowerCase().replace(/&/g, '');
}

function searchPages(query) {
  const words = normalizeSearch(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return searchablePages()
    .map((page) => {
      const title = normalizeSearch(`${page.title} ${page.groupTitle}`);
      const all = `${title} ${normalizeSearch(page.text)}`;
      return {
        page,
        matched: words.every((word) => all.includes(word)),
        inTitle: words.every((word) => title.includes(word)),
      };
    })
    .filter((item) => item.matched)
    .sort((a, b) => Number(b.inTitle) - Number(a.inTitle))
    .map((item) => item.page);
}

function setSearchActive(index) {
  const options = [...searchResults.querySelectorAll('[data-href]')];
  searchActiveIndex = options.length ? (index + options.length) % options.length : -1;
  options.forEach((option, optionIndex) => {
    option.setAttribute('aria-selected', String(optionIndex === searchActiveIndex));
  });
  if (searchActiveIndex >= 0) {
    options[searchActiveIndex].scrollIntoView({ block: 'nearest' });
    searchInput.setAttribute('aria-activedescendant', options[searchActiveIndex].id);
  } else {
    searchInput.removeAttribute('aria-activedescendant');
  }
}

function hideSearchResults() {
  searchResults.hidden = true;
  searchResults.innerHTML = '';
  searchInput.setAttribute('aria-expanded', 'false');
  searchInput.removeAttribute('aria-activedescendant');
  searchActiveIndex = -1;
}

function renderSearchResults() {
  const query = searchInput.value.trim();
  if (!query) {
    hideSearchResults();
    return;
  }

  const results = searchPages(query);
  searchResults.innerHTML = results.length
    ? results.map((page, index) => `
        <li id="search-option-${index}" role="option" aria-selected="false" data-href="#/${page.id}">
          <a href="#/${page.id}" tabindex="-1">
            ${renderIcon(page.id)}
            <span>
              <span class="search-name">${escapeHtml(page.title)}</span>
              ${page.groupTitle ? `<span class="search-group">${escapeHtml(page.groupTitle)}</span>` : ''}
            </span>
          </a>
        </li>`).join('')
    : '<li class="search-empty" role="option" aria-disabled="true" aria-selected="false">找不到符合的內容，試試其他關鍵字。</li>';
  searchResults.hidden = false;
  searchInput.setAttribute('aria-expanded', 'true');
  setSearchActive(results.length ? 0 : -1);
}

function closeSearch() {
  hideSearchResults();
  searchInput.value = '';
  topbar.classList.remove('search-open');
  searchToggle.setAttribute('aria-expanded', 'false');
  searchToggle.setAttribute('aria-label', '開啟搜尋');
}

function goToSearchResult() {
  const option = searchResults.querySelectorAll('[data-href]')[searchActiveIndex];
  if (!option) return;
  const { href } = option.dataset;
  closeSearch();
  if (location.hash !== href) location.hash = href;
}

function renderPage({ page, group }) {
  const body = page.content
    ? page.content
    : '<div class="placeholder"><strong>內容準備中</strong>這個頁面的內容尚未上架。</div>';
  const noProgress = page.noProgress || (group && group.noProgress);

  const picker = noProgress ? '' : `
      <fieldset class="progress-picker">
        <legend>我的學習進度</legend>
        <div class="progress-options">
          ${PROGRESS_LEVELS.map((level) => `
            <label>
              <input type="radio" name="progress" value="${level}" ${level === pageProgress(page.id) ? 'checked' : ''}>
              <span>${level}%</span>
            </label>`).join('')}
        </div>
        <p class="status" id="progressStatus" role="status"></p>
      </fieldset>`;

  main.innerHTML = `
    <div class="page">
      ${group ? `<p class="crumb">${escapeHtml(group.title)}</p>` : ''}
      <h1 class="page-title">${escapeHtml(page.title)}</h1>
      <p class="page-intro">${escapeHtml(page.intro)}</p>
      ${(group && group.links ? group.links : []).map((link) => `
        <p class="page-link"><a class="button link-button" href="${link.href}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(link.title)}（開新分頁）">${renderIcon('external')}${escapeHtml(link.title)}</a></p>`).join('')}
      ${body}
      ${picker}
    </div>`;

  if (noProgress) return;

  main.querySelector('.progress-picker').addEventListener('change', (event) => {
    progress[page.id] = Number(event.target.value);
    const saved = saveProgress();
    const status = document.getElementById('progressStatus');
    status.textContent = saved
      ? '進度已儲存。'
      : '瀏覽器無法儲存，關閉網頁後進度不會保留。';
    markAlert(status, !saved);
  });
}

function renderNotFound() {
  main.innerHTML = `
    <div class="page">
      <h1 class="page-title">找不到這個頁面</h1>
      <p class="page-intro">請從大綱選擇主題，或<a href="#/">回到首頁</a>。</p>
    </div>`;
}

function convertScript(text) {
  const rules = [...SCRIPT_RULES].sort((a, b) => b.from.length - a.from.length);
  const pattern = new RegExp(rules.map((rule) => rule.from).join('|'), 'g');
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    parts.push({ text: text.slice(lastIndex, match.index), changed: false });
    parts.push({ text: rules.find((rule) => rule.from === match[0]).to, changed: true });
    lastIndex = match.index + match[0].length;
  }
  parts.push({ text: text.slice(lastIndex), changed: false });
  return parts;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    const helper = document.createElement('textarea');
    helper.value = text;
    document.body.appendChild(helper);
    helper.select();
    const copied = document.execCommand('copy');
    helper.remove();
    return copied;
  }
}

function renderScriptTool() {
  const rows = SCRIPT_RULES
    .map((rule) => `<tr><td>${escapeHtml(rule.from)}</td><td>${escapeHtml(rule.to)}</td></tr>`)
    .join('');

  main.innerHTML = `
    <div class="page">
      <h1 class="page-title">客服話術轉換</h1>
      <p class="page-intro">貼上想回覆的內容，把口語的說法換成對照表裡的客服用語。</p>
      <div class="converter">
        <div>
          <label class="field-label" for="scriptInput">原本的說法</label>
          <textarea id="scriptInput" placeholder="例如：這個功能不行，我不知道原因，你等一下。"></textarea>
        </div>
        <div>
          <span class="field-label" id="scriptOutputLabel">轉換後的說法</span>
          <div class="output output-empty" id="scriptOutput" role="status" aria-labelledby="scriptOutputLabel">轉換結果會顯示在這裡。</div>
        </div>
      </div>
      <div class="actions">
        <button class="button" id="convertButton" type="button">轉換</button>
        <button class="button secondary" id="copyButton" type="button" disabled>複製結果</button>
        <span class="status" id="scriptStatus"></span>
      </div>
      <p class="note">這裡是依對照表替換文字，不會判斷前後文，送出前請再讀過一次。</p>
      <section class="rule-section">
        <h2 class="section-title">話術對照表</h2>
        <div class="table-wrap">
          <table class="rule-table">
            <thead><tr><th scope="col">原本的說法</th><th scope="col">建議的說法</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>
    </div>`;

  const input = document.getElementById('scriptInput');
  const output = document.getElementById('scriptOutput');
  const status = document.getElementById('scriptStatus');
  const copyButton = document.getElementById('copyButton');
  let result = '';

  document.getElementById('convertButton').addEventListener('click', () => {
    const text = input.value.trim();
    output.textContent = '';

    if (!text) {
      result = '';
      copyButton.disabled = true;
      output.classList.add('output-empty');
      output.textContent = '轉換結果會顯示在這裡。';
      status.textContent = '請先輸入內容。';
      input.focus();
      return;
    }

    const parts = convertScript(text);
    parts.forEach((part) => {
      if (part.changed) {
        const mark = document.createElement('mark');
        mark.textContent = part.text;
        output.appendChild(mark);
      } else {
        output.appendChild(document.createTextNode(part.text));
      }
    });

    const changedCount = parts.filter((part) => part.changed).length;
    result = parts.map((part) => part.text).join('');
    copyButton.disabled = false;
    output.classList.remove('output-empty');
    status.textContent = changedCount
      ? `已替換 ${changedCount} 處。`
      : '沒有符合對照表的用語，內容未變更。';
  });

  copyButton.addEventListener('click', async () => {
    const copied = await copyText(result);
    status.textContent = copied ? '已複製。' : '無法自動複製，請手動選取文字。';
  });
}

function setMenuOpen(open) {
  sidebar.classList.toggle('is-open', open);
  scrim.hidden = !open;
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '關閉大綱' : '開啟大綱');
}

function updateCurrent(route) {
  sidebar.querySelectorAll('[data-route]').forEach((link) => {
    if (link.dataset.route === route) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  if (route === 'script') {
    scriptButton.setAttribute('aria-current', 'page');
  } else {
    scriptButton.removeAttribute('aria-current');
  }
}

function route(isFirstLoad) {
  const id = location.hash.replace(/^#\/?/, '');
  const [base, param] = id.split('/');
  let pageTitle = '';

  if (!id) {
    renderHome();
  } else if (id === 'script') {
    renderScriptTool();
    pageTitle = '客服話術轉換';
  } else if (base === NOTES_PAGE.id && (!param || isDateKey(param))) {
    editingNoteId = null;
    notesFilterDate = param || null;
    if (param) {
      const [year, month] = param.split('-').map(Number);
      Object.assign(calendarState, { year, month: month - 1, selected: param });
    }
    renderNotesPage();
    pageTitle = NOTES_PAGE.title;
  } else {
    const found = findPage(id);
    if (found) {
      renderPage(found);
      pageTitle = found.page.title;
    } else {
      renderNotFound();
      pageTitle = '找不到頁面';
    }
  }

  document.title = pageTitle ? `${pageTitle}｜牙e通客戶成功培訓` : '牙e通客戶成功培訓';
  document.getElementById('topbarTitle').textContent = id ? '牙e通客戶成功培訓' : '學習主頁';
  updateCurrent(base);
  setMenuOpen(false);
  closeSearch();

  if (!isFirstLoad) {
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }
}

menuButton.addEventListener('click', () => {
  closeSearch();
  setMenuOpen(!sidebar.classList.contains('is-open'));
});

main.addEventListener('click', (event) => {
  const button = event.target.closest('[data-cal]');
  if (button) handleCalendarClick(button);

  const noteButton = event.target.closest('[data-note-action]');
  if (noteButton) handleNoteAction(noteButton);
});

main.addEventListener('submit', (event) => {
  const form = event.target.closest('.note-form');
  if (!form) return;
  event.preventDefault();
  handleNoteSubmit(form);
});

searchInput.addEventListener('input', renderSearchResults);

searchInput.addEventListener('keydown', (event) => {
  // 注音選字時的方向鍵與 Enter 是給輸入法用的
  if (event.isComposing) return;
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    setSearchActive(searchActiveIndex + 1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    setSearchActive(searchActiveIndex - 1);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    goToSearchResult();
  }
});

searchResults.addEventListener('click', (event) => {
  const option = event.target.closest('[data-href]');
  if (!option) return;
  event.preventDefault();
  searchActiveIndex = [...searchResults.querySelectorAll('[data-href]')].indexOf(option);
  goToSearchResult();
});

searchToggle.addEventListener('click', () => {
  const open = !topbar.classList.contains('search-open');
  if (!open) {
    closeSearch();
    return;
  }
  setMenuOpen(false);
  topbar.classList.add('search-open');
  searchToggle.setAttribute('aria-expanded', 'true');
  searchToggle.setAttribute('aria-label', '關閉搜尋');
  searchInput.focus();
});

document.addEventListener('click', (event) => {
  if (!searchBox.contains(event.target) && !searchToggle.contains(event.target)) closeSearch();
});

scrim.addEventListener('click', () => setMenuOpen(false));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && (searchInput.value || topbar.classList.contains('search-open'))) {
    const wasToggled = topbar.classList.contains('search-open');
    closeSearch();
    if (wasToggled) searchToggle.focus();
    return;
  }
  if (event.key === 'Escape' && sidebar.classList.contains('is-open')) {
    setMenuOpen(false);
    menuButton.focus();
  }
});

// 點目前所在頁面的連結時 hash 不會變，仍要收起手機選單
sidebar.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenuOpen(false);
});

window.addEventListener('hashchange', () => route(false));

document.getElementById('topbarDate').textContent = new Date().toLocaleDateString('zh-TW', {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
});

renderSidebar();
route(true);
