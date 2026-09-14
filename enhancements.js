// Giữ lại bản nháp khi reload/chuyển tab và liên kết các màn hình với nút Back/Forward của trình duyệt.
const draftPrefix = 'tim-tu-vung-draft:';
let draftKey = null, restoring = false, suppressHistory = false, lastView = sessionStorage.getItem('tim-tu-vung-last-view') || null, allowHome = false;
const q = selector => document.querySelector(selector);
const phrase = 'Web này tạo ra để Nguyệt học từ vựng';
if (q('#userEmail')?.textContent.trim() === 'học chậm, nhớ lâu') q('#userEmail').textContent = phrase;

function activeView() { return [...document.querySelectorAll('.view')].find(v => v.classList.contains('active'))?.id.replace('View',''); }
function showView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  q('#' + view + 'View')?.classList.add('active');
  window.scrollTo(0, 0);
  if (view === 'editor') restoreDraft();
}
function addRow(word = '', meaning = '') {
  const row = document.createElement('div'); row.className = 'word-row';
  row.innerHTML = `<input class="word" placeholder="Từ vựng (English / 中文)"><input class="meaning" placeholder="Ý nghĩa tiếng Việt"><button class="remove" title="Xóa">×</button>`;
  row.querySelector('.word').value = word; row.querySelector('.meaning').value = meaning;
  row.querySelector('.remove').onclick = () => { if (document.querySelectorAll('.word-row').length > 1) { row.remove(); saveDraft(); } };
  q('#wordRows').appendChild(row);
}
function setDraftKey() {
  draftKey = draftPrefix + q('#editorHeading').textContent + ':' + q('#setName').value;
}
function saveDraft() {
  if (restoring || !q('#editorView').classList.contains('active')) return;
  if (!draftKey) setDraftKey();
  const words = [...document.querySelectorAll('.word-row')].map(r => ({ word: r.querySelector('.word').value, meaning: r.querySelector('.meaning').value }));
  localStorage.setItem(draftKey, JSON.stringify({ name: q('#setName').value, words }));
}
function restoreDraft() {
  setDraftKey(); const raw = localStorage.getItem(draftKey); if (!raw) return;
  try {
    const draft = JSON.parse(raw); restoring = true; q('#setName').value = draft.name || '';
    q('#wordRows').innerHTML = ''; (draft.words?.length ? draft.words : [{ word:'', meaning:'' }]).forEach(w => addRow(w.word, w.meaning));
  } finally { restoring = false; }
}
document.addEventListener('input', e => { if (e.target.closest('#editorView')) saveDraft(); });
document.addEventListener('click', e => {
  if (e.target.closest('#homeBtn, [data-go="home"]')) { allowHome = true; setTimeout(() => allowHome = false, 0); }
  if (e.target.closest('#newSetBtn, #editBtn')) setTimeout(restoreDraft, 0);
  if (e.target.closest('#saveSetBtn') && draftKey) setTimeout(() => localStorage.removeItem(draftKey), 900);
});
window.addEventListener('popstate', e => { suppressHistory = true; allowHome = true; showView(e.state?.view || 'home'); setTimeout(() => { suppressHistory = false; allowHome = false; }, 0); });
const observer = new MutationObserver(() => {
  const view = activeView();
  // Supabase can emit a session event when the browser regains focus. Do not let it discard an unfinished screen.
  if (view === 'home' && ['editor','detail','mode','study','complete'].includes(lastView) && !allowHome && !suppressHistory) {
    showView(lastView); return;
  }
  if (view && view !== lastView) {
    if (!suppressHistory) history.pushState({ view }, '', '#' + view);
    lastView = view;
    sessionStorage.setItem('tim-tu-vung-last-view', view);
  }
  const label = q('#userEmail'); if (label && label.textContent.trim() === 'học chậm, nhớ lâu') label.textContent = phrase;
});
observer.observe(document.body, { subtree:true, childList:true, attributes:true, characterData:true });
window.addEventListener('load', () => { const view = location.hash.slice(1); if (view && q('#' + view + 'View')) showView(view); history.replaceState({ view: activeView() || 'home' }, '', '#' + (activeView() || 'home')); });
