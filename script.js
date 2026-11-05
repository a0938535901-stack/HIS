// 大綱與內容都在這裡維護。
// 要放教材時，把內容寫進該頁的 content（可使用 HTML）；留空會顯示「內容準備中」。
const HIS_URL = 'https://his.dentall.io/test/#/registration';

// 考核專區的五次考核；day 是到職日後推的天數，日曆依此標記日期
const ASSESSMENT_STAGES = [
  { id: 'assessment-1', title: '第一次考核', day: 7, intro: '到職第 1–7 天的考核。', content: '' },
  { id: 'assessment-2', title: '第二次考核', day: 14, intro: '到職第 8–14 天的考核。', content: '' },
  { id: 'assessment-3', title: '第三次考核', day: 30, intro: '到職第 14–30 天的考核。', content: '' },
  { id: 'assessment-4', title: '第四次考核', day: 45, intro: '到職第 30–45 天的考核。', content: '' },
  { id: 'assessment-5', title: '最後考核', day: 90, final: true, intro: '到職第 90 天（滿三個月）的最後考核。', content: '' },
];

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
      { id: 'nhi-codes', title: '健保代碼查詢', intro: '查詢健保代碼的方式與資料。', content: '', renderTool: renderNhiSearch },
      { id: 'nhi-sites', title: '健保相關網站', intro: '工作上常用的健保相關網站。', content: '' },
    ],
  },
  {
    title: '考核專區',
    noProgress: true,
    pages: ASSESSMENT_STAGES,
  },
  {
    title: '診所常見Q&A',
    id: 'clinic-qa',
    intro: '診所經常詢問的問題與解答。',
    content: '',
    noProgress: true,
  },
];

const SCRIPT_PAGE = { id: 'script', title: '客服話術轉換' };

// 考核評分與對應的牙齒圖案
const SCORES_KEY = 'training-scores';
const SCORE_LEVELS = [
  {
    score: 60,
    message: '及格了，再加油！',
    className: 'is-60',
    accessory: `
      <path d="M9 24Q50 8 91 24" fill="none" stroke="#ef4444" stroke-width="6" stroke-linecap="round"/>
      <path d="M90 24l9-6M90 24l10 3" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
      <path class="score-sweat" d="M12 42q-5 8 0 11q5-3 0-11z" fill="#7dd3fc" stroke="#0284c7" stroke-width="1.5"/>`,
  },
  {
    score: 80,
    message: '很棒，繼續保持！',
    className: 'is-80',
    accessory: `
      <g class="score-bow">
        <path d="M50 10L35 2V18ZM50 10L65 2V18Z" fill="#f472b6" stroke="#be185d" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="50" cy="10" r="4" fill="#be185d"/>
      </g>
      <path class="score-spark" d="M92 8l2.5 5.5 6 .8-4.4 4.2 1 6-5.1-2.9-5.1 2.9 1-6-4.4-4.2 6-.8z" fill="#f59e0b"/>`,
  },
  {
    score: 100,
    message: '太厲害了，滿分！',
    className: 'is-100',
    amazed: true,
    accessory: `
      <g class="score-crown">
        <path d="M26 8L28 -14L40 -2L50 -20L60 -2L72 -14L74 8Z" fill="#fbbf24" stroke="#b45309" stroke-width="2.5" stroke-linejoin="round"/>
        <circle cx="50" cy="-1" r="3" fill="#ef4444"/>
      </g>
      <path class="score-spark" d="M2 10l2 4.5 5 .6-3.6 3.4.9 4.9-4.3-2.4-4.3 2.4.9-4.9-3.6-3.4 5-.6z" fill="#f59e0b"/>
      <path class="score-spark" d="M99 2l2 4.5 5 .6-3.6 3.4.9 4.9-4.3-2.4-4.3 2.4.9-4.9-3.6-3.4 5-.6z" fill="#f59e0b"/>`,
  },
];

// 考核專區總覽（首頁的捷徑會連到這裡）；考核不是學習單元，不計入學習進度
const ASSESSMENT = {
  id: 'assessment',
  title: '考核專區',
  intro: '依到職天數安排的五次考核。',
  content: '',
  renderContent: renderAssessmentOverview,
  noProgress: true,
};

const HIRE_DATE_KEY = 'training-hire-date';

// 登入帳號。這是前端的簡易登入，只能擋住一般瀏覽，不能保護網站內容；
// 雜湊會隨網站公開，所以這裡的密碼不可與其他系統共用。
const ACCOUNTS = [
  {
    account: '1234',
    name: '學習者',
    role: 'learner',
    // 展示用的預設進度，讓畫面看得到各階段的樣子；正式使用前請刪除這一行
    demoProgress: { 'his-teaching': 100, 'his-qa': 100, 'clinic-training': 80, 'clinic-onsite': 50, 'cloud-module': 20 },
    salt: 'a3c156750b93db3b650a009a60a641c8',
    hash: '0356703f5f69f7192fabe81e5c05c5b8f1196f2f09ef50fd8aff36216efdce68',
  },
  {
    account: 'mentor',
    name: '指導者',
    role: 'mentor',
    salt: '407fa6d37a9c27fc7b4d593437851051',
    hash: 'e989fe0365d38d3f041d2443b8390a78239e8bee2f0fe2b86bfa44def34ca38f',
  },
];
const SESSION_KEY = 'training-session';
// 暫時免輸入：不填帳密按登入就是學習者。正式使用前改成 true 即恢復驗證
const LOGIN_REQUIRED = false;
const LOGIN_SUCCESS_DELAY = 600;
const MASCOT_TYPING_MS = 500;

// 個人筆記存在各自的瀏覽器（localStorage），只有本人看得到
const NOTES_PAGE = { id: 'notes', title: '個人筆記' };
const NOTES_KEY = 'training-notes';
const HOME_NOTE_COUNT = 3;
const MENTOR_MESSAGES_KEY = 'training-mentor-messages';

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
  chevron: '<path d="M9 6l6 6-6 6"/>',
  'milestone-sprout': '<path d="M12 21v-9"/><path d="M12 13C7 13 4 10 4 5c5 0 8 3 8 8z"/><path d="M12 11c0-4 3-7 8-7 0 5-3 7-8 7z"/>',
  'milestone-flag': '<path d="M5 22V3"/><path d="M5 4h13l-3 4.5 3 4.5H5"/>',
  'milestone-rocket': '<path d="M14 4c3-1 5-1 6-1 0 1 0 3-1 6-1.500 4-5 7-8 8l-4-4c1-3 3.500-7.500 7-9z"/><circle cx="14.5" cy="9.5" r="1.5"/><path d="M7 13l-4 1 2-4 4-1"/><path d="M11 17l-1 4 4-2 1-4"/>',
  'milestone-trophy': '<path d="M8 3h8v7a4 4 0 0 1-8 0z"/><path d="M8 5H4c0 4 2 6 4 6"/><path d="M16 5h4c0 4-2 6-4 6"/><path d="M12 14v4"/><path d="M8 21h8"/><path d="M9 18h6v3H9z"/>',
  notes: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 12h6"/><path d="M9 16h6"/>',
  script: '<path d="M4 8h13"/><path d="M14 5l3 3-3 3"/><path d="M20 16H7"/><path d="M10 13l-3 3 3 3"/>',
};

// 日曆上的行程，由管理者在這裡維護，例如：
// { date: '2026-11-20', time: '14:00', title: '新進客服教育訓練' }
const CALENDAR_EVENTS = [];
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const EVENT_ALERT_DAYS = 3;
const COUNT_DURATION = 1000;
const COUNT_DELAY = 300;
const CELEBRATE_MS = 2600;
const NOTIFY_TOAST_MS = 5000;
const NHI_RESULT_LIMIT = 20;
const CELEBRATE_COLORS = ['#0f52ba', '#1f93ea', '#0b8f7c', '#9b6ae8', '#f59e0b', '#ec4899'];

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
// 自動記錄閱讀進度：預設閱讀 60 秒且捲到頁面底部算完成，可用各頁的 readSeconds 調整
const READ_SECONDS = 60;

// 學習進度的里程碑：標語、進度圖中間的圖示、提示時牙齒的配件
const PROGRESS_MILESTONES = [
  {
    percent: 20,
    message: '好的開始，再加油！',
    icon: 'milestone-sprout',
    accessory: `
      <path d="M50 12V-4" stroke="#15803d" stroke-width="3" stroke-linecap="round"/>
      <path d="M50 -2C42 -2 37 -8 36 -15C44 -15 50 -10 50 -2Z" fill="#4ade80" stroke="#15803d" stroke-width="2" stroke-linejoin="round"/>
      <path d="M50 -5C57 -5 62 -10 63 -17C56 -17 50 -13 50 -5Z" fill="#86efac" stroke="#15803d" stroke-width="2" stroke-linejoin="round"/>`,
  },
  {
    percent: 50,
    message: '已經一半了，繼續保持！',
    icon: 'milestone-flag',
    accessory: `
      <path d="M74 8V-20" stroke="#0a3f94" stroke-width="3" stroke-linecap="round"/>
      <path d="M74 -20L96 -13L74 -6Z" fill="#fbbf24" stroke="#b45309" stroke-width="2" stroke-linejoin="round"/>`,
  },
  {
    percent: 80,
    message: '快學完了，衝刺一下！',
    icon: 'milestone-rocket',
    accessory: `
      <path d="M12 12Q50 -2 88 12" fill="none" stroke="#2563eb" stroke-width="6" stroke-linecap="round"/>
      <path d="M88 12l10-7M88 12l11 2" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/>
      <path class="score-spark" d="M96 26l2 4.5 5 .6-3.6 3.4.9 4.9-4.3-2.4-4.3 2.4.9-4.9-3.6-3.4 5-.6z" fill="#f59e0b"/>`,
  },
  {
    percent: 100,
    message: '已完成，很棒！',
    icon: 'milestone-trophy',
  },
];
let currentAccount = null;
let mascotTypingTimer = null;
let progress = {};
let notes = [];
let mentorMessages = [];
let editingNoteId = null;
let notesFilterDate = null;
let hireDate = null;
let readingTimer = null;
let pendingScriptText = '';
let heroCelebrationPending = false;
let scores = {};

const calendarState = createCalendarState();
let searchActiveIndex = -1;

const main = document.getElementById('main');
const sidebar = document.getElementById('sidebar');
const menuButton = document.getElementById('menuButton');
const scrim = document.getElementById('scrim');
const topbar = document.querySelector('.topbar');
const searchBox = document.getElementById('search');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const searchToggle = document.getElementById('searchToggle');
const appRoot = document.getElementById('app');
const loginRoot = document.getElementById('login');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const loginShell = document.getElementById('loginShell');
const loginSubmit = document.getElementById('loginSubmit');
const mascot = document.getElementById('mascot');
const mascotBubble = document.getElementById('mascotBubble');

// 進度與筆記依帳號分開存；沒有帳號專屬資料時，沿用登入功能上線前的舊資料
function accountKey(key) {
  return `${key}:${currentAccount}`;
}

function readAccountData(key) {
  const own = localStorage.getItem(accountKey(key));
  return isMentor() ? own : own ?? localStorage.getItem(key);
}

function readNotesOf(account) {
  try {
    const saved = JSON.parse(localStorage.getItem(`${NOTES_KEY}:${account}`) ?? localStorage.getItem(NOTES_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function writeNotesOf(account, list) {
  try {
    localStorage.setItem(`${NOTES_KEY}:${account}`, JSON.stringify(list));
    return true;
  } catch (error) {
    return false;
  }
}

function loadProgress() {
  try {
    const saved = JSON.parse(readAccountData(PROGRESS_KEY)) || {};
    Object.keys(saved).forEach((id) => {
      saved[id] = Math.round(saved[id] / 10) * 10;
    });
    const account = ACCOUNTS.find((item) => item.account === currentAccount);
    Object.entries((account && account.demoProgress) || {}).forEach(([id, percent]) => {
      saved[id] = Math.max(saved[id] || 0, percent);
    });
    return saved;
  } catch (error) {
    return {};
  }
}

function saveProgress() {
  try {
    localStorage.setItem(accountKey(PROGRESS_KEY), JSON.stringify(progress));
    return true;
  } catch (error) {
    return false;
  }
}

function loadNotes() {
  try {
    const saved = JSON.parse(readAccountData(NOTES_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveNotes() {
  try {
    localStorage.setItem(accountKey(NOTES_KEY), JSON.stringify(notes));
    return true;
  } catch (error) {
    return false;
  }
}

function loadHireDate() {
  try {
    const saved = localStorage.getItem(accountKey(HIRE_DATE_KEY));
    return saved && isDateKey(saved) ? saved : null;
  } catch (error) {
    return null;
  }
}

function saveHireDate() {
  try {
    if (hireDate) {
      localStorage.setItem(accountKey(HIRE_DATE_KEY), hireDate);
    } else {
      localStorage.removeItem(accountKey(HIRE_DATE_KEY));
    }
    return true;
  } catch (error) {
    return false;
  }
}

function loadScores() {
  try {
    return JSON.parse(localStorage.getItem(accountKey(SCORES_KEY))) || {};
  } catch (error) {
    return {};
  }
}

function saveScores() {
  try {
    localStorage.setItem(accountKey(SCORES_KEY), JSON.stringify(scores));
    return true;
  } catch (error) {
    return false;
  }
}

function readMessagesOf(account) {
  try {
    const saved = JSON.parse(localStorage.getItem(`${MENTOR_MESSAGES_KEY}:${account}`));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function writeMessagesOf(account, list) {
  try {
    localStorage.setItem(`${MENTOR_MESSAGES_KEY}:${account}`, JSON.stringify(list));
    return true;
  } catch (error) {
    return false;
  }
}

function pageProgress(id) {
  return progress[id] || 0;
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

// 目前達到的最高里程碑，還沒到 20% 時回傳 null
function currentMilestone(percent) {
  return [...PROGRESS_MILESTONES].reverse().find((item) => percent >= item.percent) || null;
}

function renderIcon(id) {
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[id] || ICONS.assessment}</svg>`;
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
      <text class="donut-label" x="50" y="62" text-anchor="middle" dominant-baseline="central" data-count="${percent}" data-suffix="%">${percent}%</text>
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

// 展開或收合側邊欄的大標題
function setNavGroupOpen(group, open) {
  group.classList.toggle('is-collapsed', !open);
  group.querySelector('.nav-toggle').setAttribute('aria-expanded', String(open));
}

function renderSidebar() {
  const groups = OUTLINE.map((group, index) => {
    if (!group.pages) return renderTopLink(group);
    const links = group.pages
      .map((page) => `<li><a class="nav-link" href="#/${page.id}" data-route="${page.id}">${renderIcon(page.id)}${escapeHtml(page.title)}</a></li>`)
      .join('');
    const externalLinks = (group.links || [])
      .map((link) => `<li><a class="nav-link" href="${link.href}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(link.title)}（開新分頁）">${renderIcon('external')}${escapeHtml(link.title)}</a></li>`)
      .join('');
    return `
      <div class="nav-group is-collapsible is-collapsed">
        <button class="nav-title nav-toggle" type="button" aria-expanded="false" aria-controls="navGroup${index}">
          ${escapeHtml(group.title)}${renderIcon('chevron')}
        </button>
        <div class="nav-collapse" id="navGroup${index}">
          <ul class="nav-list">${externalLinks}${links}</ul>
        </div>
      </div>`;
  }).join('');

  document.getElementById('sidebarNav').innerHTML = `<div class="nav-group"><a class="nav-link is-top" href="#/" data-route="">${renderIcon('home')}首頁</a></div>${groups}${renderTopLink({ id: NOTES_PAGE.id, title: notesPageTitle() })}`;
}

// 主畫面橫幅的 3D 插圖：電腦、牙齒與牙科器械，每個都可以點
function renderHeroArt() {
  return `
    <div class="hero-stage">
    <svg class="hero-art" viewBox="0 0 300 240">
      <defs>
        <radialGradient id="heroGlow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stop-color="#ffffff" stop-opacity=".9"/>
          <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="heroFrame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#4f9bff"/>
          <stop offset=".55" stop-color="#1d5fd6"/>
          <stop offset="1" stop-color="#0b3a94"/>
        </linearGradient>
        <linearGradient id="heroScreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset="1" stop-color="#cfe6ff"/>
        </linearGradient>
        <linearGradient id="heroStand" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#6f9fe0"/>
          <stop offset=".45" stop-color="#d7e8ff"/>
          <stop offset="1" stop-color="#4f7fc4"/>
        </linearGradient>
        <radialGradient id="heroEnamel" cx=".36" cy=".26" r=".85">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset=".55" stop-color="#f3f8ff"/>
          <stop offset="1" stop-color="#b4cdf2"/>
        </radialGradient>
        <linearGradient id="heroIris" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2f7bf0"/>
          <stop offset="1" stop-color="#0b2559"/>
        </linearGradient>
        <linearGradient id="heroSteel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#6b7c94"/>
          <stop offset=".4" stop-color="#f7fafd"/>
          <stop offset=".7" stop-color="#b6c3d4"/>
          <stop offset="1" stop-color="#5f7087"/>
        </linearGradient>
        <linearGradient id="heroRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset=".5" stop-color="#9aabc0"/>
          <stop offset="1" stop-color="#5f7087"/>
        </linearGradient>
        <radialGradient id="heroMirror" cx=".34" cy=".28" r=".85">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset=".5" stop-color="#bfe0ff"/>
          <stop offset="1" stop-color="#5b97e6"/>
        </radialGradient>
      </defs>

      <circle cx="150" cy="118" r="112" fill="url(#heroGlow)"/>
      <ellipse cx="150" cy="224" rx="142" ry="11" fill="#1d3f9a" fill-opacity=".22"/>

      <g class="hero-hit is-monitor" data-hit="monitor" role="button" tabindex="0" aria-label="電腦，按一下切換畫面">
        <ellipse cx="62" cy="212" rx="36" ry="8" fill="#0b3a94"/>
        <ellipse cx="60" cy="208" rx="36" ry="8" fill="url(#heroFrame)"/>
        <path d="M47 176h26l4 31q-17 6-34 0z" fill="url(#heroStand)"/>
        <rect x="10" y="101" width="104" height="82" rx="12" fill="#082c70"/>
        <rect x="4" y="96" width="104" height="82" rx="12" fill="url(#heroFrame)"/>
        <rect x="11" y="103" width="90" height="62" rx="6" fill="url(#heroScreen)"/>
        <g class="hero-screen-a">
          <rect x="11" y="103" width="90" height="11" rx="5" fill="#b9d9ff"/>
          <circle cx="18" cy="108.5" r="1.8" fill="#ff6b6b"/>
          <circle cx="24" cy="108.5" r="1.8" fill="#ffc23d"/>
          <circle cx="30" cy="108.5" r="1.8" fill="#35cf85"/>
          <rect x="17" y="120" width="30" height="39" rx="4" fill="#ffffff" stroke="#b9d9ff"/>
          <path transform="translate(21.5 122) scale(.21)" fill="#2f7bf0" d="M50 12C42 12 36 6 26 6C12 6 6 20 6 36C6 52 14 58 17 72C19 84 22 94 30 94C39 94 38 72 50 72C62 72 61 94 70 94C78 94 81 84 83 72C86 58 94 52 94 36C94 20 88 6 74 6C64 6 58 12 50 12Z"/>
          <path d="M22 149h20M22 154h13" stroke="#9cc0ec" stroke-width="2" stroke-linecap="round"/>
          <path d="M54 122h40M54 129h30" stroke="#8fb4e6" stroke-width="2.5" stroke-linecap="round"/>
          <g class="hero-bars">
            <rect x="55" y="146" width="7" height="13" rx="1.5" fill="#35cf85"/>
            <rect x="66" y="140" width="7" height="19" rx="1.5" fill="#2f9bf0"/>
            <rect x="77" y="136" width="7" height="23" rx="1.5" fill="#8b5cf6"/>
            <rect x="88" y="141" width="7" height="18" rx="1.5" fill="#f472b6"/>
          </g>
        </g>
        <g class="hero-screen-b">
          <circle cx="56" cy="130" r="17" fill="#35cf85"/>
          <path d="M47 130l6.5 6.500L66 124" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M34 156h44" stroke="#8fb4e6" stroke-width="3" stroke-linecap="round"/>
        </g>
        <path d="M11 109a6 6 0 0 1 6-6h38l-26 62H17a6 6 0 0 1-6-6z" fill="#ffffff" fill-opacity=".22" pointer-events="none"/>
        <circle cx="56" cy="171.5" r="2.2" fill="#bfe0ff"/>
      </g>

      <g class="hero-hit is-tooth hero-tooth" data-hit="tooth" role="button" tabindex="0" aria-label="牙齒，按一下會跳起來">
        <g class="mascot-body">
          <path transform="translate(102 68) scale(1.2)" fill="#7ea6e6" d="M50 12C42 12 36 6 26 6C12 6 6 20 6 36C6 52 14 58 17 72C19 84 22 94 30 94C39 94 38 72 50 72C62 72 61 94 70 94C78 94 81 84 83 72C86 58 94 52 94 36C94 20 88 6 74 6C64 6 58 12 50 12Z"/>
          <path transform="translate(96 62) scale(1.2)" fill="url(#heroEnamel)" stroke="#2f6fd0" stroke-width="2.2" stroke-linejoin="round" d="M50 12C42 12 36 6 26 6C12 6 6 20 6 36C6 52 14 58 17 72C19 84 22 94 30 94C39 94 38 72 50 72C62 72 61 94 70 94C78 94 81 84 83 72C86 58 94 52 94 36C94 20 88 6 74 6C64 6 58 12 50 12Z"/>
          <path d="M114 94c1-9 8-15 18-16" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
          <circle cx="111" cy="106" r="2.5" fill="#ffffff"/>
          <ellipse cx="121" cy="124" rx="8" ry="4.5" fill="#ff8fbc" fill-opacity=".6"/>
          <ellipse cx="183" cy="124" rx="8" ry="4.5" fill="#ff8fbc" fill-opacity=".6"/>
          <g class="eye-open">
            <ellipse cx="135" cy="107" rx="8.5" ry="10" fill="url(#heroIris)"/>
            <ellipse cx="169" cy="107" rx="8.5" ry="10" fill="url(#heroIris)"/>
            <circle cx="138" cy="103" r="3" fill="#ffffff"/>
            <circle cx="172" cy="103" r="3" fill="#ffffff"/>
            <circle cx="132.5" cy="111" r="1.5" fill="#ffffff" fill-opacity=".8"/>
            <circle cx="166.5" cy="111" r="1.5" fill="#ffffff" fill-opacity=".8"/>
          </g>
          <path class="hero-smile" d="M145 122q7 7 14 0" fill="none" stroke="#0b2559" stroke-width="2.8" stroke-linecap="round"/>
          <path class="hero-laugh" d="M143 120h18q-1 11-9 11t-9-11z" fill="#d6336c"/>
        </g>
      </g>

      <g class="hero-hit is-mirror" data-hit="mirror" role="button" tabindex="0" aria-label="口鏡，按一下會轉動">
        <rect x="259" y="114" width="9" height="104" rx="4.5" fill="#5f7087"/>
        <rect x="256" y="112" width="9" height="104" rx="4.5" fill="url(#heroSteel)"/>
        <path d="M256.5 160h8M256.5 165h8M256.5 170h8M256.5 175h8M256.5 180h8" stroke="#5f7087" stroke-width="1.2"/>
        <rect x="258" y="100" width="5" height="16" fill="url(#heroSteel)"/>
        <circle cx="263.5" cy="79" r="27" fill="#5f7087"/>
        <circle cx="260.5" cy="76" r="27" fill="url(#heroRing)"/>
        <circle cx="260.5" cy="76" r="22" fill="url(#heroMirror)"/>
        <path d="M246 72a17 17 0 0 1 11-11" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
      </g>

      <g class="hero-hit is-probe" data-hit="probe" role="button" tabindex="0" aria-label="探針，按一下會搖動" fill="none" stroke-linecap="round">
        <path d="M232 217L239 152" stroke="#5f7087" stroke-width="9.5"/>
        <path d="M229 215L236 150" stroke="#5f7087" stroke-width="9.5"/>
        <path d="M229 215L236 150" stroke="url(#heroSteel)" stroke-width="7"/>
        <path d="M231.5 192l6 .7M232.3 186l6 .7M233 180l6 .7M233.7 174l6 .7" stroke="#5f7087" stroke-width="1.2"/>
        <path d="M236 150L239 124q1-8-7-10" stroke="#5f7087" stroke-width="3"/>
      </g>

      <g class="hero-stars" fill="#ffb020" pointer-events="none">
        <path d="M96 40l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>
        <path d="M216 34l2.5 5.5 6 .8-4.4 4.2 1 6-5.1-2.9-5.1 2.9 1-6-4.4-4.2 6-.8z"/>
        <path d="M156 12l2 4.5 5 .6-3.6 3.4.9 4.9-4.3-2.4-4.3 2.4.9-4.9-3.6-3.4 5-.6z"/>
      </g>
    </svg>
    </div>`;
}

// 點一下插圖裡的物件：重新播放動畫；電腦會切換畫面，牙齒旁邊會冒星星
function pressHeroPart(part) {
  part.classList.remove('is-pressed');
  void part.getBoundingClientRect();
  part.classList.add('is-pressed');
  if (part.dataset.hit === 'monitor') part.classList.toggle('is-switched');
  if (part.dataset.hit === 'tooth') {
    const art = part.closest('.hero-art');
    art.classList.remove('is-sparkling');
    void art.getBoundingClientRect();
    art.classList.add('is-sparkling');
  }
}

// 滑鼠移動時，插圖跟著微微傾斜
function tiltHeroArt(event) {
  const stage = event.target.closest && event.target.closest('.hero-stage');
  document.querySelectorAll('.hero-stage').forEach((item) => {
    if (item !== stage) item.style.removeProperty('--tilt');
  });
  if (!stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = stage.getBoundingClientRect();
  const x = (event.clientX - box.left) / box.width - .5;
  const y = (event.clientY - box.top) / box.height - .5;
  stage.style.setProperty('--tilt', `rotateY(${(x * 22).toFixed(1)}deg) rotateX(${(-y * 16).toFixed(1)}deg)`);
}

// 依使用者電腦的時間問候：5–11 點早安、12–17 點午安，其餘晚安
function greeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return '早安';
  if (hour >= 12 && hour < 18) return '午安';
  return '晚安';
}

function renderHome() {
  const pages = allPages();
  const total = pages.length;
  const done = pages.filter((item) => item.percent === 100).length;
  const notStarted = pages.filter((item) => item.percent === 0).length;
  const inProgress = total - done - notStarted;
  const tiles = pages.map(({ page, group, colorIndex, percent }) => {
    const milestone = currentMilestone(percent);
    return `
    <a class="donut-tile${percent === 100 ? ' is-complete' : ''}" href="#/${page.id}" style="--ring: ${percent === 100 ? '#b45309' : `var(--unit-${colorIndex})`}">
      ${renderDonut(percent, page.title, milestone ? milestone.icon : page.id, colorIndex)}
      <span class="donut-name">${escapeHtml(page.title)}</span>
      <span class="donut-topic">${escapeHtml(group.title)}</span>
      ${milestone ? `<span class="donut-message">${milestone.message}</span>` : ''}
    </a>`;
  }).join('');

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
    <div class="b-hero hero-wrap">
    <form class="hero-script" id="heroScript">
      <label class="hero-script-label" for="heroScriptInput">${renderIcon('script')}${SCRIPT_PAGE.title}</label>
      <input id="heroScriptInput" type="text" placeholder="貼上想轉換的說法" autocomplete="off">
      <button class="button hero-script-button" type="submit">轉換</button>
    </form>
    <section class="hero">
      <img class="hero-logo" src="logo.png" alt="dentall 牙e通 logo">
      <div class="hero-copy">
        <h1>牙e通客戶成功培訓</h1>
        <p>${greeting()}！你已完成 ${done} 個單元，還有 ${total - done} 個單元待學習。</p>
      </div>
      ${renderHeroArt()}
    </section>
    </div>
    <section class="tile glass b-calendar" id="calendar" aria-label="日曆"></section>
    <div class="stat-row">
    <section class="tile stat b-done">
      <div class="stat-head"><span class="stat-icon">${renderIcon('done')}</span><p class="tile-label">已完成</p></div>
      <p class="stat-value"><span data-count="${done}">${done}</span><small>/ ${total} 單元</small></p>
    </section>
    <section class="tile stat b-doing">
      <div class="stat-head"><span class="stat-icon">${renderIcon('doing')}</span><p class="tile-label">進行中</p></div>
      <p class="stat-value"><span data-count="${inProgress}">${inProgress}</span><small>單元</small></p>
    </section>
    <section class="tile stat b-todo">
      <div class="stat-head"><span class="stat-icon">${renderIcon('todo')}</span><p class="tile-label">未開始</p></div>
      <p class="stat-value"><span data-count="${notStarted}">${notStarted}</span><small>單元</small></p>
    </section>
    </div>
    <section class="tile glass b-units">
      <h2 class="panel-title">我的學習進度</h2>
      <p class="panel-hint">進入單元閱讀，系統會自動記錄進度。紀錄只存在這台電腦的這個瀏覽器。</p>
      <div class="donut-grid">${tiles}</div>
    </section>
    <a class="tile b-assess" href="#/${ASSESSMENT.id}">
      <span class="stat-icon">${renderIcon(ASSESSMENT.id)}</span>
      <span class="assess-title">${escapeHtml(ASSESSMENT.title)}</span>
      <span class="assess-next">${renderNextStage()}</span>
      <span class="assess-go">前往查看 →</span>
    </a>
    <section class="tile glass b-next">
      <h2 class="panel-title">接下來學習</h2>
      <p class="panel-hint">${nextItems ? '從進行中的單元接著學。' : '所有單元都完成了！'}</p>
      ${nextItems ? `<ul class="next-list">${nextItems}</ul>` : ''}
    </section>
    <section class="tile glass b-notes" id="notesTile">${renderNotesTile()}</section>
    </div>`;

  renderCalendar();
  animateCounts();

  if (heroCelebrationPending) {
    heroCelebrationPending = false;
    main.querySelector('.hero-art').classList.add('is-celebrating');
  }
}

// 數字從 0 跳到實際值；使用者偏好減少動態時直接顯示
function animateCounts() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const items = [...main.querySelectorAll('[data-count]')];
  items.forEach((item) => {
    item.textContent = `0${item.dataset.suffix || ''}`;
  });
  // 延遲時間與 CSS 的圓環動畫相同
  const start = performance.now() + COUNT_DELAY;

  function tick(now) {
    const progressRatio = Math.max(Math.min((now - start) / COUNT_DURATION, 1), 0);
    const eased = 1 - (1 - progressRatio) ** 3;
    items.forEach((item) => {
      item.textContent = `${Math.round(Number(item.dataset.count) * eased)}${item.dataset.suffix || ''}`;
    });
    if (progressRatio < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
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
function allComments() {
  return [
    ...notes.flatMap((note) => noteComments(note).map((comment) => ({ note, comment }))),
    ...mentorMessages.map((comment) => ({ note: null, comment })),
  ].sort((a, b) => b.comment.createdAt - a.comment.createdAt);
}

function unreadCommentCount() {
  return allComments().filter(({ comment }) => !comment.read).length;
}

function renderCommentPreview({ note, comment }) {
  return `
    <li>
      <a class="note-preview" href="#/${NOTES_PAGE.id}${note ? `/${noteDate(note)}` : ''}">
        <span class="note-preview-text">${comment.read ? '' : '<b class="new-tag">新</b>'}${escapeHtml(comment.text)}</span>
        <span class="note-time">${formatNoteTime(comment.createdAt)}　${note ? `回覆「${escapeHtml(note.text.slice(0, 12))}」` : '給你的留言'}</span>
      </a>
    </li>`;
}

// 首頁筆記欄裡顯示這則筆記最新的指導者留言
function renderNoteLatestComment(note) {
  const list = noteComments(note);
  if (!list.length) return '';
  const latest = list[list.length - 1];
  return `
    <span class="note-preview-comment">
      ${latest.read ? '' : '<b class="new-tag">新</b>'}指導者：${escapeHtml(latest.text)}
      ${list.length > 1 ? `<small>（共 ${list.length} 則）</small>` : ''}
    </span>`;
}

function renderMentorNotesTile() {
  const recent = learnerAccounts()
    .flatMap((learner) => readNotesOf(learner.account).map((note) => ({ note, learner })))
    .sort((a, b) => b.note.updatedAt - a.note.updatedAt)
    .slice(0, HOME_NOTE_COUNT)
    .map(({ note, learner }) => `
      <li>
        <a class="note-preview" href="#/${NOTES_PAGE.id}">
          <span class="note-preview-text">${escapeHtml(note.text)}</span>
          <span class="note-time">${escapeHtml(learner.name)}　${formatDateLabel(noteDate(note))}</span>
        </a>
      </li>`).join('');
  return `
    <div class="tile-head">
      <h2 class="panel-title">${notesPageTitle()}</h2>
      <a class="tile-link" href="#/${NOTES_PAGE.id}">查看並留言</a>
    </div>
    ${recent
      ? `<ul class="note-previews">${recent}</ul>`
      : '<p class="tile-note note-empty">這個瀏覽器裡還沒有學習者的筆記。</p>'}`;
}

function renderNotesTile() {
  if (isMentor()) return renderMentorNotesTile();
  const date = calendarState.selected;
  const dayNotes = notesOn(date);
  const latest = dayNotes.slice(0, HOME_NOTE_COUNT).map((note) => `
    <li>
      <a class="note-preview" href="#/${NOTES_PAGE.id}/${date}">
        <span class="note-preview-text">${escapeHtml(note.text)}</span>
        <span class="note-time">${formatNoteTime(note.updatedAt)}</span>
        ${renderNoteLatestComment(note)}
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
  if (isMentor()) return;
  const draft = tile.querySelector('textarea').value;
  tile.innerHTML = renderNotesTile();
  tile.querySelector('textarea').value = draft;
}

function noteComments(note) {
  return note.comments || [];
}

function renderNoteComments(note, owner) {
  const canWrite = isMentor();
  if (!canWrite && !noteComments(note).length) return '';

  const comments = noteComments(note).map((comment) => `
    <li class="note-comment">
      <p class="note-text">${escapeHtml(comment.text)}</p>
      <div class="note-foot">
        <span class="note-time">${formatNoteTime(comment.createdAt)}</span>
        ${canWrite ? `<button class="note-action" type="button" data-comment-delete="${escapeHtml(comment.id)}" data-note-id="${escapeHtml(note.id)}" data-owner="${escapeHtml(owner)}">刪除</button>` : ''}
      </div>
    </li>`).join('');
  return `
    <div class="note-comments">
      <p class="note-comments-title">指導者留言</p>
      ${comments ? `<ul class="note-comment-list">${comments}</ul>` : ''}
      ${canWrite ? `
        <form class="note-comment-form" data-note-id="${escapeHtml(note.id)}" data-owner="${escapeHtml(owner)}">
          <input name="text" type="text" aria-label="留言給學習者" placeholder="留言給學習者" autocomplete="off">
          <button class="button note-button" type="submit">留言</button>
        </form>` : ''}
    </div>`;
}

function renderLearnerHireDate(account) {
  const saved = localStorage.getItem(`${HIRE_DATE_KEY}:${account}`);
  if (!saved) return '<p class="learner-hire">到職日：尚未設定</p>';
  return `
    <p class="learner-hire">
      到職日：${formatDateLabel(saved)}
      <button class="note-action" type="button" data-hire-reset="${escapeHtml(account)}">重設</button>
    </p>`;
}

function handleHireReset(account) {
  if (!window.confirm('確定要重設這位學習者的到職日嗎？重設後學習者可以重新選擇。')) return;
  try {
    localStorage.removeItem(`${HIRE_DATE_KEY}:${account}`);
    renderMentorNotesPage('到職日已重設。');
  } catch (error) {
    renderMentorNotesPage('瀏覽器無法儲存，到職日沒有重設。', true);
  }
}

function renderMessageEditor(account) {
  const items = readMessagesOf(account).map((message) => `
    <li class="note-comment">
      <p class="note-text">${escapeHtml(message.text)}</p>
      <div class="note-foot">
        <span class="note-time">${formatNoteTime(message.createdAt)}</span>
        <button class="note-action" type="button" data-message-delete="${escapeHtml(message.id)}" data-owner="${escapeHtml(account)}">刪除</button>
      </div>
    </li>`).join('');
  return `
    <div class="mentor-board">
      <h3 class="panel-title">指導者留言區</h3>
      ${items ? `<ul class="note-comment-list">${items}</ul>` : ''}
      <form class="note-comment-form mentor-message-form" data-owner="${escapeHtml(account)}">
        <input name="text" type="text" aria-label="直接留言給學習者" placeholder="直接留言給學習者（不用綁定筆記）" autocomplete="off">
        <button class="button note-button" type="submit">留言</button>
      </form>
    </div>`;
}

function handleMessageSubmit(form) {
  if (!isMentor()) return;
  const input = form.elements.text;
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }
  const { owner } = form.dataset;
  const list = readMessagesOf(owner);
  list.unshift({ id: `${Date.now()}-${list.length}`, text, createdAt: Date.now() });
  const saved = writeMessagesOf(owner, list);
  renderMentorNotesPage(saved ? '留言已送出。' : '瀏覽器無法儲存，這則留言沒有留下來。', !saved);
  main.querySelector(`.mentor-message-form[data-owner="${owner}"] input`).focus();
}

function handleMessageDelete(button) {
  if (!isMentor() || !window.confirm('確定要刪除這則留言嗎？刪除後無法復原。')) return;
  const { owner, messageDelete } = button.dataset;
  const saved = writeMessagesOf(owner, readMessagesOf(owner).filter((message) => message.id !== messageDelete));
  renderMentorNotesPage(saved ? '留言已刪除。' : '瀏覽器無法儲存，留言沒有刪除。', !saved);
}

function renderMentorNotesPage(statusMessage = '', isAlert = false) {
  const sections = learnerAccounts().map((learner) => {
    const list = readNotesOf(learner.account);
    const items = list.map((note) => `
      <li class="note-item">
        <p class="note-text">${escapeHtml(note.text)}</p>
        <div class="note-foot">
          <span class="note-time">${formatDateLabel(noteDate(note))}</span>
        </div>
        ${renderNoteComments(note, learner.account)}
      </li>`).join('');
    return `
      <section class="note-group">
        <h2 class="note-group-title"><span>${escapeHtml(learner.name)}（帳號 ${escapeHtml(learner.account)}）</span></h2>
        ${renderLearnerHireDate(learner.account)}
        ${renderMessageEditor(learner.account)}
        ${items
          ? `<ul class="note-list">${items}</ul>`
          : '<div class="placeholder"><strong>還沒有筆記</strong>這位學習者還沒有寫筆記。</div>'}
      </section>`;
  }).join('');

  main.innerHTML = `
    <div class="page">
      <h1 class="page-title">${notesPageTitle()}</h1>
      <p class="page-intro">在學習者的筆記下方留言給他們。</p>
      <p class="notes-notice">這裡只看得到這台電腦、這個瀏覽器裡的筆記；留言也只存在這裡，學習者要在同一台電腦登入才看得到。</p>
      <p class="status" id="mentorStatus" role="status"></p>
      ${sections}
    </div>`;
  const status = document.getElementById('mentorStatus');
  status.textContent = statusMessage;
  if (isAlert) status.classList.add('is-error');
}

function handleCommentSubmit(form) {
  if (!isMentor()) return;
  const input = form.elements.text;
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }
  const { noteId, owner } = form.dataset;
  const list = readNotesOf(owner);
  const note = list.find((item) => item.id === noteId);
  if (!note) return;
  note.comments = [...noteComments(note), { id: `${Date.now()}-${noteComments(note).length}`, text, createdAt: Date.now() }];
  const saved = writeNotesOf(owner, list);
  renderMentorNotesPage(saved ? '留言已送出。' : '瀏覽器無法儲存，這則留言沒有留下來。', !saved);
  main.querySelector(`.note-comment-form[data-note-id="${noteId}"] input`).focus();
}

function handleCommentDelete(button) {
  if (!isMentor() || !window.confirm('確定要刪除這則指導者留言嗎？刪除後無法復原。')) return;
  const { noteId, owner, commentDelete } = button.dataset;
  const list = readNotesOf(owner);
  const note = list.find((item) => item.id === noteId);
  if (!note) return;
  note.comments = noteComments(note).filter((comment) => comment.id !== commentDelete);
  const saved = writeNotesOf(owner, list);
  renderMentorNotesPage(saved ? '留言已刪除。' : '瀏覽器無法儲存，留言沒有刪除。', !saved);
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
      ${renderNoteComments(note, currentAccount)}
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

function renderMentorBoard() {
  const items = allComments().map(({ note, comment }) => `
    <li class="mentor-board-item">
      <p class="note-text">${escapeHtml(comment.text)}</p>
      <p class="note-time">
        ${formatNoteTime(comment.createdAt)}
        ${note
          ? `回覆筆記「<a class="tile-link" href="#/${NOTES_PAGE.id}/${noteDate(note)}">${escapeHtml(note.text.slice(0, 12))}</a>」`
          : '給你的留言'}
      </p>
    </li>`).join('');
  return `
    <section class="mentor-board">
      <h2 class="panel-title">指導者留言區</h2>
      ${items
        ? `<ul class="mentor-board-list">${items}</ul>`
        : '<p class="tile-note">目前還沒有指導者留言。指導者留言後，會顯示在這裡，右上角的鈴鐺也會通知你。</p>'}
    </section>`;
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
      <p class="notes-notice">指導者留言也一樣只存在這個瀏覽器。指導者要在這台電腦登入，才看得到筆記並留言。</p>
      ${filter ? `<p class="page-link"><a class="tile-link" href="#/${NOTES_PAGE.id}">← 查看全部筆記</a></p>` : ''}
      <div class="notes-compose">${renderNoteForm(3, filter || todayKey(), !filter)}</div>
      ${renderMentorBoard()}
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

function addDays(key, days) {
  const [year, month, day] = key.split('-').map(Number);
  const moved = new Date(year, month - 1, day + days);
  return dateKey(moved.getFullYear(), moved.getMonth(), moved.getDate());
}

// 到職日後推的考核日期；還沒設定到職日時回傳 null
function stageDate(stage) {
  return hireDate ? addDays(hireDate, stage.day) : null;
}

function stagesOn(key) {
  return ASSESSMENT_STAGES.filter((stage) => stageDate(stage) === key);
}

// 今天起幾天內的行程與考核，用來顯示到期提示
function upcomingEventCount() {
  const today = todayKey();
  const lastKey = addDays(today, EVENT_ALERT_DAYS);
  const dates = [
    ...CALENDAR_EVENTS.map((item) => item.date),
    ...ASSESSMENT_STAGES.map(stageDate).filter(Boolean),
  ];
  return dates.filter((date) => date >= today && date <= lastKey).length;
}

function renderNextStage() {
  if (!hireDate) return '選擇到職日後，日曆會標出考核日期。';
  const today = todayKey();
  const next = ASSESSMENT_STAGES.find((stage) => stageDate(stage) >= today);
  return next
    ? `下一個：${next.title}，${formatDateLabel(stageDate(next))}`
    : '五次考核的日期都已經過了。';
}

function handleHireDateChange(input) {
  const { value } = input;
  // 手動輸入年份時，打到一半的日期（例如 0002 年）先不套用
  if (hireDate || !value || !isDateKey(value) || Number(value.slice(0, 4)) < 2000) return;
  confirmHireDate(value);
}

// 到職日設定後就不能更改，所以先確認一次
function confirmHireDate(value) {
  if (window.confirm(`到職日設定為 ${formatDateLabel(value)} 後就不能更改，確定嗎？`)) {
    applyHireDate(value);
  } else {
    document.getElementById('hireDateInput').value = '';
  }
}

// 五次考核日的捷徑，點了會跳到該日期所在的月份
function renderStageChips() {
  if (!hireDate) return '';
  const chips = ASSESSMENT_STAGES.map((stage) => {
    const date = stageDate(stage);
    const [, month, day] = date.split('-').map(Number);
    return `<button class="cal-chip${stage.final ? ' is-final' : ''}" type="button" data-cal="goto" data-date="${date}">${escapeHtml(stage.title.replace('考核', ''))} ${month}/${day}</button>`;
  }).join('');
  return `<div class="cal-chips">${chips}</div>`;
}

function applyHireDate(value) {
  hireDate = value;
  const saved = saveHireDate();
  const input = document.getElementById('hireDateInput');
  input.value = value;
  input.disabled = true;
  if (hireDate) {
    const [year, month] = hireDate.split('-').map(Number);
    Object.assign(calendarState, { year, month: month - 1, selected: hireDate });
    refreshNotesTileKeepingDraft();
  }
  renderCalendar();
  if (!saved) {
    const box = document.getElementById('calendar');
    box.classList.add('is-alert');
    box.querySelector('.cal-next').textContent = '瀏覽器無法儲存，關閉網頁後到職日不會保留。';
  }
}

function renderCalendar(focusSelector) {
  const box = document.getElementById('calendar');
  if (!box) return;

  // 到職日欄位只建立一次，重畫日曆時才不會打斷輸入
  if (!box.querySelector('#calendarBody')) {
    box.innerHTML = `
      <label class="cal-hire">
        <span>到職日</span>
        <input id="hireDateInput" type="date" value="${hireDate || ''}" ${hireDate ? 'disabled' : ''}>
      </label>
      <div class="cal-body" id="calendarBody"></div>`;
  }
  const body = box.querySelector('#calendarBody');

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
      const stages = stagesOn(key);
      const classes = [
        'cal-day',
        key === today ? 'is-today' : '',
        key === selected ? 'is-selected' : '',
        count ? 'has-event' : '',
        noteCount ? 'has-note' : '',
        key === hireDate ? 'is-hire' : '',
        stages.some((stage) => !stage.final) ? 'is-quiz' : '',
        stages.some((stage) => stage.final) ? 'is-final' : '',
      ].filter(Boolean).join(' ');
      const marks = [
        key === hireDate ? '到職日' : '',
        ...stages.map((stage) => stage.title),
        count ? `${count} 個行程` : '',
        noteCount ? `${noteCount} 則筆記` : '',
      ].filter(Boolean);
      const label = `${month + 1}月${day}日${marks.length ? `，${marks.join('，')}` : ''}`;
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
  const agendaItems = [
    ...(selected === hireDate ? ['<li><b>到職日</b></li>'] : []),
    ...stagesOn(selected).map((stage) => `<li><a class="tile-link" href="#/${stage.id}">${escapeHtml(stage.title)} →</a></li>`),
    ...events.map((item) => `<li><b>${escapeHtml(item.time || '全天')}</b>${escapeHtml(item.title)}</li>`),
  ];
  const agenda = agendaItems.length
    ? `<ul class="cal-events">${agendaItems.join('')}</ul>`
    : '<p class="tile-note">這天沒有安排。</p>';

  body.innerHTML = `
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
    <p class="cal-legend"><i class="is-hire"></i>到職日<i class="is-quiz"></i>小考核<i class="is-final"></i>最後考核<i class="is-event"></i>行程<i class="is-note"></i>筆記</p>
    ${renderStageChips()}
    <p class="cal-next">${renderNextStage()}</p>
    <div class="cal-agenda">
      ${upcoming ? `<p class="cal-alert">⚠ ${EVENT_ALERT_DAYS} 天內有 ${upcoming} 個行程或考核</p>` : ''}
      <div class="tile-head cal-agenda-head">
        <p class="tile-label">${formatDateLabel(selected)}</p>
        ${isMentor() ? '' : `<a class="tile-link" href="#/${NOTES_PAGE.id}/${selected}">${selectedNotes ? `${selectedNotes} 則筆記` : '寫筆記'} →</a>`}
      </div>
      ${agenda}
      ${hireDate ? '' : '<button class="cal-set-hire" type="button" data-cal="set-hire">把這天設為到職日</button>'}
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

  if (action === 'set-hire') {
    confirmHireDate(calendarState.selected);
    return;
  }

  if (action === 'goto') {
    const { date } = button.dataset;
    const [year, month] = date.split('-').map(Number);
    Object.assign(calendarState, { year, month: month - 1, selected: date });
    refreshNotesTileKeepingDraft();
    renderCalendar(`[data-cal="goto"][data-date="${date}"]`);
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
      title: notesPageTitle(),
      groupTitle: '',
      text: [
        ...(isMentor() ? learnerAccounts().flatMap((item) => readNotesOf(item.account)) : notes)
          .map((note) => [note.text, ...noteComments(note).map((comment) => comment.text)].join(' ')),
        ...(isMentor() ? learnerAccounts().flatMap((item) => readMessagesOf(item.account)) : mentorMessages)
          .map((message) => message.text),
      ].join(' '),
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

function scoreLevel(score) {
  return SCORE_LEVELS.find((level) => level.score === score);
}

function renderScoreTooth(level) {
  return `
    <svg class="score-tooth" viewBox="-8 -24 116 130" aria-hidden="true">
      ${renderMascotTooth({ x: 0, y: 0, scale: 1, delay: 0, device: '', accessory: level.accessory, amazed: level.amazed })}
    </svg>`;
}

function renderScoreResult(stageId) {
  const level = scoreLevel(scores[stageId]);
  if (!level) return '<p class="tile-note">選擇分數後，會出現對應的牙齒圖案。</p>';
  const confetti = level.score === 100
    ? `<span class="score-confetti" aria-hidden="true">${Array.from({ length: 16 }, (_, index) => `<i style="left:${(index * 37) % 100}%;background:${CELEBRATE_COLORS[index % CELEBRATE_COLORS.length]};animation-delay:${((index * 3) % 16) / 8}s"></i>`).join('')}</span>`
    : '';
  return `
    <div class="score-result ${level.className}">
      ${confetti}
      ${renderScoreTooth(level)}
      <div>
        <p class="score-value">${level.score}<small>分</small></p>
        <p class="score-message">${level.message}</p>
      </div>
    </div>`;
}

function renderScoreSection(stage) {
  const options = [...SCORE_LEVELS.map((level) => level.score), 0].map((score) => `
    <label>
      <input type="radio" name="score" value="${score}" ${score === (scores[stage.id] || 0) ? 'checked' : ''}>
      <span>${score ? `${score} 分` : '未評分'}</span>
    </label>`).join('');
  return `
    <fieldset class="progress-picker score-picker">
      <legend>考核評分</legend>
      <div class="progress-options">${options}</div>
      <div class="score-area" id="scoreArea">${renderScoreResult(stage.id)}</div>
      <p class="status" id="scoreStatus" role="status"></p>
    </fieldset>`;
}

// 健保代碼查詢：資料在 nhi-codes.js，約 1.6 MB，進到這頁才載入
function renderNhiSearch() {
  return `
    <section class="nhi-search">
      <h2 class="panel-title">健保AI查詢</h2>
      <p class="panel-hint">輸入健保代碼或項目名稱，會自動查詢。</p>
      <div class="nhi-input">
        ${renderIcon('nhi-codes')}
        <input id="nhiCodeInput" type="search" placeholder="例如 89001C 或 銀粉充填" aria-label="輸入健保代碼或項目名稱" autocomplete="off" spellcheck="false">
      </div>
      <div class="nhi-results" id="nhiResults" role="status"></div>
      <p class="nhi-source" id="nhiSource"></p>
    </section>`;
}

function loadNhiCodes(onReady) {
  if (window.NHI_CODES) {
    onReady();
    return;
  }
  const script = document.createElement('script');
  script.src = 'nhi-codes.js';
  script.onload = onReady;
  script.onerror = () => {
    const results = document.getElementById('nhiResults');
    if (results) results.textContent = '代碼資料載入失敗，請重新整理後再試一次。';
  };
  document.head.appendChild(script);
}

// 比對順序：代碼完全相同、代碼開頭相同、代碼或名稱包含關鍵字
function searchNhiCodes(query) {
  const keyword = query.trim().toUpperCase();
  const rank = ([code, , , name]) => {
    if (code === keyword) return 0;
    if (code.startsWith(keyword)) return 1;
    if (code.includes(keyword) || name.toUpperCase().includes(keyword)) return 2;
    return 3;
  };
  return window.NHI_CODES
    .map((item) => ({ item, score: rank(item) }))
    .filter(({ score }) => score < 3)
    .sort((a, b) => a.score - b.score)
    .map(({ item }) => item);
}

function formatNhiDate(value) {
  return `${value.slice(0, 4)}/${value.slice(4, 6)}/${value.slice(6, 8)}`;
}

function renderNhiResults() {
  const input = document.getElementById('nhiCodeInput');
  const results = document.getElementById('nhiResults');
  if (!input || !results) return;

  const query = input.value.trim();
  if (!query) {
    results.innerHTML = '';
    return;
  }

  const matches = searchNhiCodes(query);
  if (!matches.length) {
    results.innerHTML = `<p class="tile-note">找不到「${escapeHtml(query)}」，請確認代碼是否正確。</p>`;
    return;
  }

  const items = matches.slice(0, NHI_RESULT_LIMIT).map(([code, points, start, name, note]) => `
    <li class="nhi-item">
      <div class="nhi-item-head">
        <b class="nhi-code">${escapeHtml(code)}</b>
        <span class="nhi-points">${escapeHtml(points)} 點</span>
      </div>
      <p class="nhi-name">${escapeHtml(name)}</p>
      <p class="note-time">生效日 ${formatNhiDate(start)}</p>
      ${note ? `<details class="nhi-note"><summary>查看備註</summary><p>${escapeHtml(note)}</p></details>` : ''}
    </li>`).join('');
  const more = matches.length > NHI_RESULT_LIMIT
    ? `<p class="tile-note">共 ${matches.length} 筆，只顯示前 ${NHI_RESULT_LIMIT} 筆，請輸入更完整的關鍵字。</p>`
    : '';
  results.innerHTML = `<ul class="nhi-list">${items}</ul>${more}`;
}

function prepareNhiSearch() {
  const source = document.getElementById('nhiSource');
  if (!source) return;
  loadNhiCodes(() => {
    source.innerHTML = `資料來源：健保署開放資料「<a class="tile-link" href="https://data.gov.tw/dataset/174450" target="_blank" rel="noopener noreferrer">醫療服務給付項目及支付標準</a>」，資料日期 ${window.NHI_CODES_DATE}。實際申報請以健保署最新公告為準。`;
    renderNhiResults();
  });
}

function renderStageDate(stage) {
  const date = stageDate(stage);
  return date
    ? `考核日：${formatDateLabel(date)}（到職後第 ${stage.day} 天）`
    : `到職後第 ${stage.day} 天。在<a class="tile-link" href="#/">首頁日曆</a>選擇到職日後，會顯示實際日期。`;
}

function renderAssessmentOverview() {
  const items = ASSESSMENT_STAGES.map((stage) => `
    <li>
      <a class="assess-item${stage.final ? ' is-final' : ''}" href="#/${stage.id}">
        <span class="assess-item-title">${escapeHtml(stage.title)}</span>
        <span class="assess-item-date">${stageDate(stage) ? formatDateLabel(stageDate(stage)) : `到職後第 ${stage.day} 天`}</span>
        ${scoreLevel(scores[stage.id])
          ? `<span class="assess-item-score">${renderScoreTooth(scoreLevel(scores[stage.id]))}${scores[stage.id]} 分</span>`
          : '<span class="assess-item-score is-empty">未評分</span>'}
      </a>
    </li>`).join('');
  return `<ul class="assess-list">${items}</ul>`;
}

function renderPage({ page, group }) {
  const content = page.renderContent ? page.renderContent() : page.content;
  const tool = page.renderTool ? page.renderTool() : '';
  const body = tool + (content || `
    <div class="placeholder is-building">
      <svg class="placeholder-tooth" viewBox="-6 -10 112 122" aria-hidden="true">
        ${renderMascotTooth({ x: 0, y: 0, scale: 1, delay: 0, device: MASCOT_LAPTOP })}
      </svg>
      <div>
        <strong>內容準備中<span class="typing-dots" aria-hidden="true"><i></i><i></i><i></i></span></strong>
        這個頁面的內容尚未上架。
      </div>
    </div>`);
  const noProgress = page.noProgress || (group && group.noProgress);

  main.innerHTML = `
    <div class="page">
      ${group ? `<p class="crumb">${escapeHtml(group.title)}</p>` : ''}
      <h1 class="page-title">${escapeHtml(page.title)}</h1>
      <p class="page-intro">${escapeHtml(page.intro)}</p>
      ${page.day ? `<p class="assess-date">${renderStageDate(page)}</p>` : ''}
      ${(group && group.links ? group.links : []).map((link) => `
        <p class="page-link"><a class="button link-button" href="${link.href}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(link.title)}（開新分頁）">${renderIcon('external')}${escapeHtml(link.title)}</a></p>`).join('')}
      ${body}
      ${noProgress ? '' : '<p class="reading-note" id="readingStatus" role="status">系統會依閱讀情況自動記錄學習進度。</p>'}
      ${page.day ? renderScoreSection(page) : ''}
    </div>`;

  if (page.day) {
    main.querySelector('.score-picker').addEventListener('change', (event) => {
      const score = Number(event.target.value);
      const beforeScore = scores[page.id];
      if (score) {
        scores[page.id] = score;
      } else {
        delete scores[page.id];
      }
      const saved = saveScores();
      const status = document.getElementById('scoreStatus');
      document.getElementById('scoreArea').innerHTML = renderScoreResult(page.id);
      status.textContent = saved ? '評分已儲存。' : '瀏覽器無法儲存，關閉網頁後評分不會保留。';
      markAlert(status, !saved);
      if (score === 100 && beforeScore !== 100) showCertificate(`${page.title}滿分`);
    });
  }

  if (page.renderTool) prepareNhiSearch();
  if (!noProgress) startReadingTracker(page);
}

function stopReadingTracker() {
  clearInterval(readingTimer);
  readingTimer = null;
}

function scrollRatio() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  // 頁面短到不用捲動時，視為已看到底
  return scrollable <= 1 ? 1 : Math.min((window.scrollY + 2) / scrollable, 1);
}

function showMilestoneToast(page, milestone) {
  const overlay = document.createElement('div');
  overlay.className = 'celebrate';
  overlay.innerHTML = `
    <div class="celebrate-card" role="status">
      <svg class="celebrate-tooth" viewBox="-8 -24 116 130" aria-hidden="true">
        ${renderMascotTooth({ x: 0, y: 0, scale: 1, delay: 0, device: '', accessory: milestone.accessory })}
      </svg>
      <p>${escapeHtml(page.title)}：${milestone.message}</p>
    </div>`;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), CELEBRATE_MS);
}

function recordReadingProgress(page, percent) {
  const before = currentMilestone(pageProgress(page.id));
  progress[page.id] = percent;
  const saved = saveProgress();
  const status = document.getElementById('readingStatus');
  if (status && !saved) {
    status.textContent = '瀏覽器無法儲存，關閉網頁後進度不會保留。';
    status.classList.add('is-error');
  }
  if (percent < 100) {
    const reached = currentMilestone(percent);
    if (reached && reached !== before) showMilestoneToast(page, reached);
    return;
  }
  stopReadingTracker();
  if (allPages().every((item) => item.percent === 100)) {
    showCertificate('全部學習單元');
  } else {
    celebrateUnit(page.title);
  }
}

// 只計算頁面在前景的時間；進度取閱讀時間與捲動位置較低者，每 10% 記錄一次，只增不減
function startReadingTracker(page) {
  const startPercent = pageProgress(page.id);
  if (startPercent >= 100) return;

  const required = page.readSeconds || READ_SECONDS;
  let elapsed = (startPercent / 100) * required;
  let farthest = startPercent / 100;

  readingTimer = setInterval(() => {
    if (document.hidden) return;
    elapsed += 1;
    farthest = Math.max(farthest, scrollRatio());
    const percent = Math.floor(Math.min(elapsed / required, farthest) * 10) * 10;
    if (percent > pageProgress(page.id)) recordReadingProgress(page, percent);
  }, 1000);
}

function renderBurst(left, top, delay) {
  return Array.from({ length: 14 }, (_, index) => {
    const angle = (index / 14) * Math.PI * 2;
    const distance = 70 + (index % 3) * 24;
    const color = CELEBRATE_COLORS[index % CELEBRATE_COLORS.length];
    return `<i class="spark" style="left:${left}%;top:${top}%;background:${color};animation-delay:${delay}s;--dx:${Math.round(Math.cos(angle) * distance)}px;--dy:${Math.round(Math.sin(angle) * distance)}px"></i>`;
  }).join('');
}

// 完成單元：放煙火、牙齒點頭，回首頁時橫幅的牙齒也會慶祝
function celebrateUnit(title) {
  heroCelebrationPending = true;
  const overlay = document.createElement('div');
  overlay.className = 'celebrate';
  overlay.innerHTML = `
    <div aria-hidden="true">
      ${renderBurst(22, 28, 0)}${renderBurst(78, 24, .25)}${renderBurst(50, 16, .5)}
    </div>
    <div class="celebrate-card" role="status">
      <svg class="celebrate-tooth" viewBox="-8 -24 116 130" aria-hidden="true">
        ${renderMascotTooth({ x: 0, y: 0, scale: 1, delay: 0, device: '', amazed: true })}
      </svg>
      <p>「${escapeHtml(title)}」已完成，很棒！</p>
    </div>`;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), CELEBRATE_MS);
}

function renderFallingMedals() {
  return Array.from({ length: 22 }, (_, index) => {
    const left = (index * 47) % 100;
    const delay = ((index * 13) % 22) / 10;
    const duration = 2.4 + ((index * 7) % 10) / 5;
    return `
      <svg class="falling-medal" viewBox="0 0 40 56" style="left:${left}%;animation-delay:${delay}s;animation-duration:${duration}s" aria-hidden="true">
        <path d="M10 0h8l4 14h-8zM30 0h-8l-4 14h8z" fill="${CELEBRATE_COLORS[index % CELEBRATE_COLORS.length]}"/>
        <circle cx="20" cy="34" r="17" fill="#fbbf24" stroke="#b45309" stroke-width="3"/>
        <path d="M20 23l3.2 7 7.6.9-5.6 5.2 1.5 7.5-6.7-3.8-6.7 3.8 1.5-7.5-5.6-5.2 7.6-.9z" fill="#fff7d6"/>
      </svg>`;
  }).join('');
}

// 滿分或全部完成：全螢幕證書與掉落的勳章
function showCertificate(achievement) {
  const returnFocus = document.activeElement;
  const level = scoreLevel(100);
  const [, month, day] = todayKey().split('-').map(Number);
  const overlay = document.createElement('div');
  overlay.className = 'certificate-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'certificateTitle');
  overlay.innerHTML = `
    ${renderFallingMedals()}
    <div class="certificate">
      <p class="certificate-kicker">成就證書</p>
      ${renderScoreTooth(level)}
      <h2 class="certificate-title" id="certificateTitle">恭喜 ${escapeHtml(currentAccountName())}！</h2>
      <p class="certificate-text">達成「${escapeHtml(achievement)}」</p>
      <p class="certificate-date">${new Date().getFullYear()} 年 ${month} 月 ${day} 日</p>
      <button class="button certificate-close" type="button">太棒了！</button>
    </div>`;

  function close() {
    document.body.classList.remove('menu-open');
    overlay.remove();
    if (returnFocus && returnFocus.isConnected) returnFocus.focus();
  }

  overlay.querySelector('.certificate-close').addEventListener('click', close);
  overlay.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
    // 對話框只有一個按鈕，Tab 留在按鈕上
    if (event.key === 'Tab') event.preventDefault();
  });
  document.body.classList.add('menu-open');
  document.body.appendChild(overlay);
  overlay.querySelector('.certificate-close').focus();
}

// 按鈕的漣漪效果
function addRipple(event) {
  const target = event.target.closest('.button, .nav-link, .nav-toggle, .topbar-logout, .note-action, .b-assess, .progress-options span');
  if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = target.getBoundingClientRect();
  const size = Math.max(box.width, box.height) * 2;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${event.clientX - box.left - size / 2}px;top:${event.clientY - box.top - size / 2}px`;
  target.classList.add('has-ripple');
  target.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
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

  // 從首頁橫幅帶過來的文字，直接轉換
  if (pendingScriptText) {
    input.value = pendingScriptText;
    pendingScriptText = '';
    document.getElementById('convertButton').click();
  }
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

  // 目前所在頁面的大標題要展開，其他大標題維持使用者設定的狀態
  const current = sidebar.querySelector('[aria-current="page"]');
  const currentGroup = current && current.closest('.is-collapsible');
  if (currentGroup) setNavGroupOpen(currentGroup, true);
}

function isMentor() {
  const found = ACCOUNTS.find((item) => item.account === currentAccount);
  return Boolean(found && found.role === 'mentor');
}

function learnerAccounts() {
  return ACCOUNTS.filter((item) => item.role === 'learner');
}

// 指導者看的是學習者的筆記，頁面名稱也跟著不同
function notesPageTitle() {
  return isMentor() ? '學習者筆記' : NOTES_PAGE.title;
}

function updateNotifyBadge() {
  const badge = document.getElementById('notifyBadge');
  const count = unreadCommentCount();
  badge.hidden = count === 0;
  badge.textContent = count > 9 ? '9+' : String(count);
  document.getElementById('notifyButton').setAttribute('aria-label', count ? `指導者留言通知，${count} 則未讀` : '指導者留言通知');
}

function markCommentsRead() {
  let changed = false;
  allComments().forEach(({ comment }) => {
    if (!comment.read) {
      comment.read = true;
      changed = true;
    }
  });
  if (changed) {
    saveNotes();
    writeMessagesOf(currentAccount, mentorMessages);
  }
  updateNotifyBadge();
}

function closeNotify() {
  document.getElementById('notifyPanel').hidden = true;
  document.getElementById('notifyButton').setAttribute('aria-expanded', 'false');
}

function toggleNotify() {
  const panel = document.getElementById('notifyPanel');
  if (!panel.hidden) {
    closeNotify();
    return;
  }
  document.querySelector('.notify-toast')?.remove();
  const items = allComments().slice(0, 8).map(renderCommentPreview).join('');
  panel.innerHTML = `
    <p class="notify-title">指導者留言</p>
    ${items ? `<ul class="note-previews">${items}</ul>` : '<p class="tile-note">目前沒有留言。</p>'}`;
  panel.hidden = false;
  document.getElementById('notifyButton').setAttribute('aria-expanded', 'true');
  markCommentsRead();
}

function showUnreadToast() {
  const count = unreadCommentCount();
  if (!count) return;
  const toast = document.createElement('div');
  toast.className = 'notify-toast';
  toast.setAttribute('role', 'status');
  toast.textContent = `指導者有 ${count} 則新留言，點右上角的鈴鐺查看。`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), NOTIFY_TOAST_MS);
}

function currentAccountName() {
  const found = ACCOUNTS.find((item) => item.account === currentAccount);
  return found ? found.name : '';
}

function readSession() {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    return ACCOUNTS.some((item) => item.account === saved) ? saved : null;
  } catch (error) {
    return null;
  }
}

function writeSession(account) {
  try {
    if (account) {
      sessionStorage.setItem(SESSION_KEY, account);
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  } catch (error) {
    // 無法記住登入狀態時，重新整理後需要再登入一次
  }
}

async function hashPassword(salt, password) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

// 登入頁的牙齒吉祥物：心情決定表情與對話框文字
function setMascot(mood, message) {
  mascot.dataset.mood = mood;
  if (mascotBubble.textContent === message) return;
  mascotBubble.textContent = message;
  // 重新觸發對話框的彈出動畫
  mascotBubble.style.animation = 'none';
  void mascotBubble.offsetWidth;
  mascotBubble.style.animation = '';
}

function mascotLook(length) {
  const offset = (Math.min(length, 16) / 16) * 6 - 3;
  mascot.style.setProperty('--look', `${offset}px`);
}

// 打字時，牙齒們的手也敲得比較快
function mascotTyping() {
  mascot.classList.add('is-typing');
  clearTimeout(mascotTypingTimer);
  mascotTypingTimer = setTimeout(() => mascot.classList.remove('is-typing'), MASCOT_TYPING_MS);
}

const MASCOT_STAR = 'l1.8 3.8 4.2.6-3 2.9.7 4.2-3.7-2-3.7 2 .7-4.2-3-2.9 4.2-.6z';

// 一顆 Q 版牙齒（100×100 座標），accessory 是配件，device 是面前的設備，amazed 是驚嘆的星星眼
function renderMascotTooth({ x, y, scale, delay, accessory = '', device, amazed = false }) {
  const stars = amazed
    ? `<g class="eye-star" fill="#f59e0b">
        <path d="M34 31.5${MASCOT_STAR}"/>
        <path d="M66 31.5${MASCOT_STAR}"/>
      </g>`
    : '';
  const wow = amazed
    ? '<ellipse class="mouth mouth-smile" cx="50" cy="52" rx="5" ry="6" fill="#0f52ba" stroke="none"/>'
    : '<path class="mouth mouth-smile" d="M44 49q6 6 12 0"/>';
  return `
    <g transform="translate(${x} ${y}) scale(${scale})">
      <g class="mascot-body" style="animation-delay: ${delay}s">
        <path fill="#ffffff" stroke="#0f52ba" stroke-width="3" stroke-linejoin="round"
          d="M50 12C42 12 36 6 26 6C12 6 6 20 6 36C6 52 14 58 17 72C19 84 22 94 30 94C39 94 38 72 50 72C62 72 61 94 70 94C78 94 81 84 83 72C86 58 94 52 94 36C94 20 88 6 74 6C64 6 58 12 50 12Z"/>
        <ellipse cx="22" cy="48" rx="6" ry="4" fill="#f9a8c9"/>
        <ellipse cx="78" cy="48" rx="6" ry="4" fill="#f9a8c9"/>
        <g class="eye-open">
          <circle cx="34" cy="37" r="8" fill="#ffffff" stroke="#0f52ba" stroke-width="2"/>
          <circle cx="66" cy="37" r="8" fill="#ffffff" stroke="#0f52ba" stroke-width="2"/>
          <g class="pupils${amazed ? ' is-amazed' : ''}" fill="#0b2559">
            <circle cx="34" cy="38" r="5"/>
            <circle cx="66" cy="38" r="5"/>
          </g>
          ${stars}
        </g>
        <g class="eye-closed" fill="none" stroke="#0b2559" stroke-width="3" stroke-linecap="round">
          <path d="M26 38q8 7 16 0"/>
          <path d="M58 38q8 7 16 0"/>
        </g>
        <g fill="none" stroke="#0b2559" stroke-width="3" stroke-linecap="round">
          ${wow}
          <path class="mouth mouth-sad" d="M44 55q6-6 12 0"/>
        </g>
        <path class="mouth mouth-happy" d="M42 47h16q-1 11-8 11t-8-11z" fill="#0f52ba"/>
        ${accessory}
      </g>
      ${device}
    </g>`;
}

const MASCOT_LAPTOP_BODY = `
  <rect x="18" y="60" width="64" height="37" rx="4" fill="#0f52ba" stroke="#0a3f94" stroke-width="2"/>
  <text x="50" y="84" text-anchor="middle" fill="#ffffff" font-size="18" font-weight="700">e</text>
  <rect x="9" y="96" width="82" height="7" rx="3.5" fill="#9dbdec" stroke="#0a3f94" stroke-width="2"/>
  <circle class="mascot-hand" cx="26" cy="60" r="6" fill="#ffffff" stroke="#0f52ba" stroke-width="2.5"/>`;

const MASCOT_LAPTOP = `${MASCOT_LAPTOP_BODY}
  <circle class="mascot-hand is-right" cx="74" cy="60" r="6" fill="#ffffff" stroke="#0f52ba" stroke-width="2.5"/>`;

// 中間的牙齒：一手打字，一手伸向右邊的登入框
const MASCOT_LAPTOP_POINTING = `${MASCOT_LAPTOP_BODY}
  <g class="mascot-arm">
    <path d="M86 50C97 47 103 40 107 31" fill="none" stroke="#0f52ba" stroke-width="9" stroke-linecap="round"/>
    <path d="M86 50C97 47 103 40 107 31" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
    <path d="M111 25l11-3" stroke="#0f52ba" stroke-width="7" stroke-linecap="round"/>
    <path d="M111 25l11-3" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="108" cy="27" r="6.5" fill="#ffffff" stroke="#0f52ba" stroke-width="2"/>
  </g>`;

const MASCOT_TABLET = `
  <defs>
    <linearGradient id="mascotTabletScreen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f52ba"/>
      <stop offset="1" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>
  <g class="mascot-tablet">
    <rect x="20" y="60" width="60" height="42" rx="6" fill="#0b2559"/>
    <rect x="24" y="64" width="52" height="34" rx="3" fill="url(#mascotTabletScreen)"/>
    <text x="38" y="88" text-anchor="middle" fill="#ffffff" font-size="20" font-weight="700">e</text>
    <g stroke="#ffffff" stroke-width="2.5" stroke-linecap="round">
      <path d="M50 73h20"/><path d="M50 81h20"/><path d="M50 89h13"/>
    </g>
  </g>
  <circle class="mascot-hand" cx="18" cy="82" r="6" fill="#ffffff" stroke="#0f52ba" stroke-width="2.5"/>
  <circle class="mascot-hand is-right" cx="82" cy="82" r="6" fill="#ffffff" stroke="#0f52ba" stroke-width="2.5"/>`;

const MASCOT_HEADSET = `
  <path d="M12 32C12 -4 88 -4 88 32" fill="none" stroke="#0a3f94" stroke-width="5" stroke-linecap="round"/>
  <rect x="5" y="26" width="12" height="20" rx="5" fill="#0f52ba"/>
  <rect x="83" y="26" width="12" height="20" rx="5" fill="#0f52ba"/>
  <path d="M10 46C10 58 20 62 32 60" fill="none" stroke="#0a3f94" stroke-width="3" stroke-linecap="round"/>
  <circle cx="34" cy="60" r="3.5" fill="#0a3f94"/>`;

const MASCOT_SCHOLAR = `
  <path d="M50 -9L88 7L50 23L12 7Z" fill="#0b2559" stroke="#0b2559" stroke-width="2" stroke-linejoin="round"/>
  <path d="M82 9V24" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
  <circle cx="82" cy="27" r="3.5" fill="#d97706"/>
  <g fill="none" stroke="#7c3aed" stroke-width="2.5">
    <circle cx="34" cy="37" r="11"/>
    <circle cx="66" cy="37" r="11"/>
    <path d="M45 36h10"/>
  </g>`;

function renderMascotScene() {
  mascot.innerHTML = `
    <rect x="8" y="216" width="344" height="9" rx="4.5" fill="#0f52ba" fill-opacity=".22"/>
    ${renderMascotTooth({ x: 8, y: 112, scale: 1, delay: -1, accessory: MASCOT_HEADSET, device: MASCOT_LAPTOP })}
    ${renderMascotTooth({ x: 256, y: 112, scale: 1, delay: -2, accessory: MASCOT_SCHOLAR, device: MASCOT_TABLET })}
    ${renderMascotTooth({ x: 106, y: 72, scale: 1.4, delay: 0, device: MASCOT_LAPTOP_POINTING })}`;
}

function shakeLogin() {
  loginShell.classList.remove('is-shake');
  void loginShell.offsetWidth;
  loginShell.classList.add('is-shake');
}

function showLogin() {
  document.title = '登入｜客戶成功部內部培訓';
  appRoot.hidden = true;
  loginRoot.hidden = false;
  loginError.textContent = '';
  loginForm.reset();
  loginSubmit.disabled = false;
  mascotLook(0);
  document.getElementById('loginAccount').focus();
  setMascot('idle', `${greeting()}！今天也一起學習吧`);
}

function startSession(account) {
  currentAccount = account;
  progress = loadProgress();
  notes = loadNotes();
  mentorMessages = isMentor() ? [] : readMessagesOf(account);
  hireDate = loadHireDate();
  scores = loadScores();
  document.getElementById('topbarAccountName').textContent = currentAccountName();
  document.getElementById('notify').hidden = isMentor();
  closeNotify();
  updateNotifyBadge();
  loginRoot.hidden = true;
  appRoot.hidden = false;
  renderSidebar();
  route(true);
}

function logout() {
  stopReadingTracker();
  writeSession(null);
  currentAccount = null;
  progress = {};
  notes = [];
  mentorMessages = [];
  hireDate = null;
  scores = {};
  editingNoteId = null;
  Object.assign(calendarState, createCalendarState());
  closeSearch();
  setMenuOpen(false);
  main.innerHTML = '';
  document.getElementById('sidebarNav').innerHTML = '';
  history.replaceState(null, '', location.pathname + location.search);
  showLogin();
}

function completeLogin(found) {
  writeSession(found.account);
  loginForm.reset();
  loginSubmit.disabled = true;
  setMascot('happy', `歡迎回來，${found.name}！`);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(() => {
    startSession(found.account);
    showUnreadToast();
  }, reduced ? 0 : LOGIN_SUCCESS_DELAY);
}

async function handleLogin(event) {
  event.preventDefault();
  const account = loginForm.elements.account.value.trim().toLowerCase();
  const password = loginForm.elements.password.value;
  loginError.textContent = '';

  if (!LOGIN_REQUIRED && !account && !password) {
    completeLogin(ACCOUNTS.find((item) => item.role === 'learner'));
    return;
  }

  if (!account || !password) {
    loginError.textContent = '請輸入帳號和密碼。';
    setMascot('sad', '還少填了一點喔');
    shakeLogin();
    return;
  }
  if (!window.crypto || !crypto.subtle) {
    loginError.textContent = '這個網址無法使用登入功能，請改用 https 網址開啟。';
    return;
  }

  const found = ACCOUNTS.find((item) => item.account === account);
  if (found && await hashPassword(found.salt, password) === found.hash) {
    completeLogin(found);
    return;
  }

  loginError.textContent = '帳號或密碼不正確。';
  loginForm.elements.password.value = '';
  loginForm.elements.password.focus();
  setMascot('sad', '咦？再試一次看看');
  shakeLogin();
}

function route(isFirstLoad) {
  if (!currentAccount) return;

  stopReadingTracker();

  const id = location.hash.replace(/^#\/?/, '');
  const [base, param] = id.split('/');
  let pageTitle = '';

  if (!id) {
    renderHome();
  } else if (id === SCRIPT_PAGE.id) {
    renderScriptTool();
    pageTitle = SCRIPT_PAGE.title;
  } else if (base === NOTES_PAGE.id && (!param || isDateKey(param))) {
    editingNoteId = null;
    notesFilterDate = param || null;
    if (param) {
      const [year, month] = param.split('-').map(Number);
      Object.assign(calendarState, { year, month: month - 1, selected: param });
    }
    if (isMentor()) {
      renderMentorNotesPage();
    } else {
      markCommentsRead();
      renderNotesPage();
    }
    pageTitle = notesPageTitle();
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
  closeNotify();

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

  const heroPart = event.target.closest('.hero-hit');
  if (heroPart) pressHeroPart(heroPart);

  const hireReset = event.target.closest('[data-hire-reset]');
  if (hireReset) handleHireReset(hireReset.dataset.hireReset);

  const messageDelete = event.target.closest('[data-message-delete]');
  if (messageDelete) handleMessageDelete(messageDelete);

  const commentDelete = event.target.closest('[data-comment-delete]');
  if (commentDelete) handleCommentDelete(commentDelete);

  const noteButton = event.target.closest('[data-note-action]');
  if (noteButton) handleNoteAction(noteButton);
});

main.addEventListener('input', (event) => {
  if (event.target.id === 'nhiCodeInput' && window.NHI_CODES) renderNhiResults();
});

main.addEventListener('animationend', (event) => {
  if (event.target.classList && event.target.classList.contains('hero-hit')) event.target.classList.remove('is-pressed');
});
main.addEventListener('pointermove', tiltHeroArt);
main.addEventListener('pointerleave', tiltHeroArt);
main.addEventListener('keydown', (event) => {
  const part = event.target.closest('.hero-hit');
  if (part && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    pressHeroPart(part);
  }
});

main.addEventListener('change', (event) => {
  if (event.target.id === 'hireDateInput') handleHireDateChange(event.target);
});

main.addEventListener('submit', (event) => {
  if (event.target.classList.contains('mentor-message-form')) {
    event.preventDefault();
    handleMessageSubmit(event.target);
    return;
  }
  if (event.target.classList.contains('note-comment-form')) {
    event.preventDefault();
    handleCommentSubmit(event.target);
    return;
  }
  if (event.target.id === 'heroScript') {
    event.preventDefault();
    pendingScriptText = document.getElementById('heroScriptInput').value.trim();
    location.hash = `#/${SCRIPT_PAGE.id}`;
    return;
  }
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
  const toggle = event.target.closest('.nav-toggle');
  if (toggle) {
    const group = toggle.closest('.is-collapsible');
    setNavGroupOpen(group, group.classList.contains('is-collapsed'));
  }
});

document.getElementById('logoutButton').addEventListener('click', logout);
document.getElementById('notifyButton').addEventListener('click', toggleNotify);
document.getElementById('notifyPanel').addEventListener('click', (event) => {
  if (event.target.closest('a')) closeNotify();
});
document.addEventListener('click', (event) => {
  if (!document.getElementById('notify').contains(event.target)) closeNotify();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !document.getElementById('notifyPanel').hidden) {
    closeNotify();
    document.getElementById('notifyButton').focus();
  }
});
document.addEventListener('pointerdown', addRipple);

loginForm.addEventListener('submit', handleLogin);

if (!LOGIN_REQUIRED) {
  document.getElementById('loginHint').textContent = '不用輸入帳號密碼，直接按登入即可';
  const mentorButton = document.getElementById('loginAsMentor');
  mentorButton.hidden = false;
  mentorButton.addEventListener('click', () => {
    completeLogin(ACCOUNTS.find((item) => item.role === 'mentor'));
  });
}

const loginAccountInput = document.getElementById('loginAccount');
const loginPasswordInput = document.getElementById('loginPassword');

loginAccountInput.addEventListener('focus', () => setMascot('idle', '先輸入你的帳號'));
loginAccountInput.addEventListener('input', () => {
  mascotLook(loginAccountInput.value.length);
  mascotTyping();
  setMascot('idle', '先輸入你的帳號');
});
loginPasswordInput.addEventListener('focus', () => setMascot('shy', '放心，我們不偷看！'));
loginPasswordInput.addEventListener('input', () => {
  mascotTyping();
  setMascot('shy', '放心，我們不偷看！');
});
loginShell.addEventListener('animationend', (event) => {
  if (event.target === loginShell) loginShell.classList.remove('is-shake');
});

window.addEventListener('hashchange', () => route(false));

document.getElementById('topbarDate').textContent = new Date().toLocaleDateString('zh-TW', {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
});

renderMascotScene();

const savedAccount = readSession();
if (savedAccount) {
  startSession(savedAccount);
} else {
  showLogin();
}
