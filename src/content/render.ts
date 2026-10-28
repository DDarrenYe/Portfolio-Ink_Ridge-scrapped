import { contact, projects, treasures, type Project, type Treasure } from './projects';

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const leaf = (p: Project) => `
  <article class="leaf">
    <div class="leaf__body">
      <span class="leaf__page">${esc(p.leaf)}</span>
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.summary)}</p>
      <span class="leaf__stack">${p.stack.map(esc).join(' · ')}</span>
      <a href="${esc(p.link.href)}">${esc(p.link.label)}</a>
    </div>
    <div class="leaf__cn" lang="zh-Hans">${esc(p.cn)}<small lang="en">${esc(p.pinyin)} · ${esc(p.meaning)}</small></div>
  </article>`;

const treasure = (t: Treasure) => `
  <div class="treasure">
    <span class="treasure__glyph" lang="zh-Hans">${esc(t.glyph)}</span>
    <span class="treasure__py">${esc(t.pinyin)} · ${esc(t.object)}</span>
    <b>${esc(t.area)}</b>
    <span>${t.tools.map(esc).join(', ')}</span>
  </div>`;

function fill(id: string, html: string) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

export function renderContent() {
  fill('leaves', projects.map(leaf).join(''));
  fill('treasures', treasures.map(treasure).join(''));
  const link = document.getElementById('contact-link') as HTMLAnchorElement | null;
  if (link) {
    link.href = contact.href;
    link.textContent = contact.label;
  }
}
