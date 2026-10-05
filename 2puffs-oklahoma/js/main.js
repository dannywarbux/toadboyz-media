(() => {
  'use strict';

  // ---------- Age / patient gate ----------
  const GATE_KEY = '2puffs_gate_ok';
  const GATE_DAYS = 30;
  const gate = document.getElementById('gate');

  const store = {
    get(k) { try { return localStorage.getItem(k) || sessionStorage.getItem(k); } catch (_) { return null; } },
    set(k, v, persist) { try { (persist ? localStorage : sessionStorage).setItem(k, v); } catch (_) {} }
  };

  const gatePassed = () => {
    const v = Number(store.get(GATE_KEY));
    return v && v > Date.now();
  };

  if (gate && !gatePassed()) {
    gate.hidden = false;
    document.body.classList.add('is-locked');
    document.getElementById('gate-yes').focus();
  }

  document.getElementById('gate-yes')?.addEventListener('click', () => {
    const persist = document.getElementById('gate-remember').checked;
    store.set(GATE_KEY, String(Date.now() + GATE_DAYS * 864e5), persist);
    gate.hidden = true;
    document.body.classList.remove('is-locked');
  });
  document.getElementById('gate-no')?.addEventListener('click', () => {
    document.getElementById('gate-deny').hidden = false;
    document.querySelector('.gate__actions').hidden = true;
  });

  // ---------- Mobile nav ----------
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    links.classList.toggle('is-open', open);
  });
  links?.addEventListener('click', (e) => {
    if (e.target.closest('a')) { toggle.setAttribute('aria-expanded', 'false'); links.classList.remove('is-open'); }
  });

  // ---------- Helpers ----------
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const getJSON = (url) => fetch(url, { cache: 'no-cache' }).then((r) => { if (!r.ok) throw new Error(url); return r.json(); });
  const STATUS = { 'in-stock': 'In stock', limited: 'Limited', 'dropping-soon': 'Dropping soon' };

  // ---------- Strains ----------
  const grid = document.getElementById('strain-grid');
  let strains = [];
  const renderStrains = (type) => {
    const list = type === 'all' ? strains : strains.filter((s) => s.type === type);
    grid.innerHTML = list.length ? list.map((s) => `
      <article class="card">
        <span class="card__type card__type--${esc(s.type)}">${esc(s.type)}</span>
        <div class="card__swatch" style="background-color:${/^#[0-9a-f]{3,8}$/i.test(s.color) ? s.color : '#3ec6f0'}"></div>
        <h3>${esc(s.name)}</h3>
        <p class="card__lineage">${esc(s.lineage)}</p>
        <ul class="card__notes">${(s.notes || []).map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
        <p class="card__thc">${s.thc ? `THC ${esc(s.thc)}` : 'COA pending'}</p>
        <span class="card__status">${esc(STATUS[s.status] || s.status || '')}</span>
      </article>`).join('') : '<p>Nothing in this lane right now. Check back next drop.</p>';
  };
  if (grid) {
    getJSON('/data/strains.json')
      .then((d) => { strains = d.strains || []; renderStrains('all'); })
      .catch(() => { grid.innerHTML = '<p>Lineup loading issue. Refresh to try again.</p>'; });
    document.querySelectorAll('.chip').forEach((chip) => chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c === chip));
      renderStrains(chip.dataset.type);
    }));
  }

  // ---------- Store finder ----------
  const list = document.getElementById('store-list');
  const empty = document.getElementById('store-empty');
  const search = document.getElementById('store-search');
  let stores = [];
  const renderStores = (q = '') => {
    const needle = q.trim().toLowerCase();
    const hits = stores.filter((s) => !needle || [s.name, s.city, s.zip, s.address].join(' ').toLowerCase().includes(needle));
    list.innerHTML = hits.map((s) => {
      const addr = [s.address, s.city, 'OK', s.zip].filter(Boolean).join(', ');
      const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.name} ${addr}`)}`;
      return `<li class="store">
        <h3>${esc(s.name)}</h3>
        <p>${esc(addr)}</p>
        ${s.phone ? `<p>${esc(s.phone)}</p>` : ''}
        <div class="store__links">
          <a href="${maps}" target="_blank" rel="noopener">Directions</a>
          ${s.phone ? `<a href="tel:${esc(s.phone.replace(/[^\d+]/g, ''))}">Call</a>` : ''}
          ${/^https?:\/\//.test(s.url || '') ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">Menu</a>` : ''}
        </div>
      </li>`;
    }).join('');
    empty.hidden = hits.length > 0;
    if (!stores.length) empty.innerHTML = 'Landing in Oklahoma dispensaries soon. <a href="#drops">Get notified</a> the day we drop.';
  };
  if (list) {
    getJSON('/data/dispensaries.json')
      .then((d) => { stores = d.dispensaries || []; renderStores(); })
      .catch(() => renderStores());
    search?.addEventListener('input', (e) => renderStores(e.target.value));
  }

  // ---------- Footer year ----------
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
