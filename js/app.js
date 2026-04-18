/* ============================================================
   MONITOR URBANO — app.js
   ============================================================ */

/* ── Dados ── */
const dados = [
  { tipo:'Alagamento', local:'Av. Principal, 340',       tempo:'Há 10 min',   urg:'Alta',  lat:-8.1128, lng:-34.9092 },
  { tipo:'Barreira',   local:'Rua das Flores, s/n',      tempo:'Há 32 min',   urg:'Média', lat:-8.1160, lng:-34.9050 },
  { tipo:'Lixo',       local:'Praça Central',             tempo:'Há 1h',       urg:'Baixa', lat:-8.1090, lng:-34.9110 },
  { tipo:'Alagamento', local:'Av. Sul, 120',              tempo:'Há 1h 20min', urg:'Alta',  lat:-8.1200, lng:-34.9080 },
  { tipo:'Barreira',   local:'Viaduto João Paulo',        tempo:'Há 2h',       urg:'Alta',  lat:-8.1070, lng:-34.9030 },
  { tipo:'Lixo',       local:'Rua 3, Bairro Novo',       tempo:'Há 3h',       urg:'Baixa', lat:-8.1140, lng:-34.9140 },
  { tipo:'Outros',     local:'Rua Esperança, 88',         tempo:'Há 4h',       urg:'Média', lat:-8.1050, lng:-34.9065 },
  { tipo:'Alagamento', local:'Rua do Porto, 14',          tempo:'Há 5h',       urg:'Alta',  lat:-8.1180, lng:-34.9120 },
  { tipo:'Barreira',   local:'Terminal Rodoviário',       tempo:'Há 6h',       urg:'Média', lat:-8.1030, lng:-34.9000 },
  { tipo:'Lixo',       local:'Feira do Município',        tempo:'Há 7h',       urg:'Baixa', lat:-8.1220, lng:-34.9060 },
  { tipo:'Outros',     local:'Praça da Matriz',           tempo:'Há 8h',       urg:'Média', lat:-8.1100, lng:-34.9150 },
  { tipo:'Alagamento', local:'Av. Barreto de Menezes',   tempo:'Há 9h',       urg:'Alta',  lat:-8.1155, lng:-34.9095 },
];

/* ── Paletas ── */
const COR = {
  Alagamento:'#2563eb', Barreira:'#dc2626', Lixo:'#ca8a04',
  Outros:'#6b7280', Buraco:'#78350f', Iluminação:'#d97706'
};
const BADGE_COR = {
  Alta:  { bg:'#fee2e2', c:'#dc2626' },
  Média: { bg:'#fef9c3', c:'#ca8a04' },
  Baixa: { bg:'#dcfce7', c:'#16a34a' }
};

/* ── SVG Icons (branco — marcadores mapa) ── */
const SVG_ICON = {
  Alagamento: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M2 20c2-2 4 0 6 0s4-2 6 0 4 2 6 0"/><path d="M2 14c2-2 4 0 6 0s4-2 6 0 4 2 6 0"/></svg>`,
  Barreira:   `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect x="2" y="9" width="20" height="6" rx="2"/><line x1="7" y1="9" x2="7" y2="15"/><line x1="12" y1="9" x2="12" y2="15"/></svg>`,
  Lixo:       `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>`,
  Outros:     `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  Buraco:     `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><ellipse cx="12" cy="16" rx="8" ry="4"/><path d="M4 12c0-2.2 3.6-4 8-4s8 1.8 8 4"/></svg>`,
  Iluminação: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><line x1="12" y1="2" x2="12" y2="6"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="18" x2="12" y2="22"/></svg>`,
};

/* ── SVG Icons (colorido — listas) ── */
const SVG_ICON_COLOR = {
  Alagamento: (c) => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><path d="M2 20c2-2 4 0 6 0s4-2 6 0 4 2 6 0"/><path d="M2 14c2-2 4 0 6 0s4-2 6 0 4 2 6 0"/></svg>`,
  Barreira:   (c) => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><rect x="2" y="9" width="20" height="6" rx="2"/><line x1="7" y1="9" x2="7" y2="15"/><line x1="12" y1="9" x2="12" y2="15"/></svg>`,
  Lixo:       (c) => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>`,
  Outros:     (c) => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  Buraco:     (c) => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><ellipse cx="12" cy="16" rx="8" ry="4"/><path d="M4 12c0-2.2 3.6-4 8-4s8 1.8 8 4"/></svg>`,
  Iluminação: (c) => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><line x1="12" y1="2" x2="12" y2="6"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="18" x2="12" y2="22"/></svg>`,
};

function getIconColor(tipo) {
  const fn = SVG_ICON_COLOR[tipo] || SVG_ICON_COLOR.Outros;
  return fn(COR[tipo] || '#6b7280');
}

/* ============================================================
   LEAFLET MAP
   ============================================================ */
let mapa       = null;
let marcadores = [];
let userMarker = null;
let mapaReady  = false;

function criarIcone(tipo) {
  const cor = COR[tipo] || '#6b7280';
  const svg = SVG_ICON[tipo] || SVG_ICON.Outros;
  return L.divIcon({
    className:    '',
    iconSize:     [40, 48],
    iconAnchor:   [20, 48],
    popupAnchor:  [0, -50],
    html: `
      <div style="
        width:40px;height:40px;
        background:${cor};
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 4px 14px rgba(0,0,0,0.28);
        border:3px solid white;
      ">
        <div style="transform:rotate(45deg);width:20px;height:20px;">${svg}</div>
      </div>`
  });
}

function iniciarMapa() {
  if (mapaReady) {
    setTimeout(() => mapa && mapa.invalidateSize(true), 80);
    return;
  }
  mapa = L.map('leafletMap', {
    center: [-8.1128, -34.9092],
    zoom: 14,
    zoomControl: false,
    attributionControl: true
  });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap', maxZoom: 19
  }).addTo(mapa);
  L.control.zoom({ position: 'bottomright' }).addTo(mapa);
  mapaReady = true;
  renderMarcadores(dados);
  renderMiniLista(dados);
  setTimeout(() => mapa.invalidateSize(true), 250);
}

function renderMarcadores(lista) {
  if (!mapa) return;
  marcadores.forEach(m => mapa.removeLayer(m));
  marcadores = [];
  lista.forEach(o => {
    const b = BADGE_COR[o.urg] || BADGE_COR.Média;
    const m = L.marker([o.lat, o.lng], { icon: criarIcone(o.tipo) })
      .bindPopup(`
        <div style="font-family:'Sora',sans-serif;min-width:180px;">
          <b style="font-size:13px;color:#1a1a2e;">${o.tipo}</b><br>
          <span style="font-size:11px;color:#8B7CA8;">${o.local}</span><br>
          <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:10px;color:#8B7CA8;">${o.tempo}</span>
            <span style="font-size:10px;font-weight:700;padding:3px 8px;border-radius:10px;background:${b.bg};color:${b.c};">${o.urg}</span>
          </div>
        </div>`, { maxWidth: 220 })
      .addTo(mapa);
    marcadores.push(m);
  });
}

function renderMiniLista(lista) {
  const el = document.getElementById('miniLista');
  if (!el) return;
  el.innerHTML = lista.slice(0, 5).map(o => {
    const cor = COR[o.tipo] || '#6b7280';
    const b   = BADGE_COR[o.urg] || BADGE_COR.Média;
    return `
      <div class="mini-item">
        <div class="mini-ic" style="background:${cor}22;">${getIconColor(o.tipo)}</div>
        <div class="mini-txt">
          <div class="mini-t">${o.tipo} — ${o.local}</div>
          <div class="mini-s">${o.tempo}</div>
        </div>
        <span class="mini-b" style="background:${b.bg};color:${b.c};">${o.urg}</span>
      </div>`;
  }).join('');
}

/* ── Filtros ── */
function filtrarMapa(tipo) {
  document.querySelectorAll('.chip').forEach(c => {
    c.className = 'chip ' + (c.dataset.t === tipo ? 'on' : 'off');
  });
  const lista = tipo === 'Todos' ? dados : dados.filter(o => o.tipo === tipo);
  if (mapa) { renderMarcadores(lista); renderMiniLista(lista); }
  document.getElementById('mapaCount').textContent = lista.length;
  const vm = document.getElementById('view-mapa');
  if (!vm.classList.contains('open')) goTo('view-mapa');
}

function buscarMapa(val) {
  const v = val.toLowerCase().trim();
  const lista = v ? dados.filter(o =>
    o.tipo.toLowerCase().includes(v) || o.local.toLowerCase().includes(v)
  ) : dados;
  if (mapa) { renderMarcadores(lista); renderMiniLista(lista); }
  document.getElementById('mapaCount').textContent = lista.length;
}

/* ── Localização ── */
function centralizarUsuario() {
  if (!navigator.geolocation) { toast('GPS não disponível'); return; }
  toast('Localizando...');
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude: lat, longitude: lng } = pos.coords;
    mapa.setView([lat, lng], 15);
    if (userMarker) mapa.removeLayer(userMarker);
    userMarker = L.circleMarker([lat, lng], {
      radius: 10, color: '#7B2FBE',
      fillColor: '#A855F7', fillOpacity: 0.9, weight: 3
    })
    .bindPopup('<b style="font-family:Sora,sans-serif;font-size:12px;">Você está aqui</b>')
    .addTo(mapa).openPopup();
    toast('Localização encontrada! 📍');
  }, () => toast('Não foi possível obter localização'));
}

/* ============================================================
   NAVEGAÇÃO
   ============================================================ */
const VIEWS   = ['view-home', 'view-lista', 'view-mapa'];
const NAV_IDS = { 'view-home':'nav-home', 'view-lista':'nav-bell', 'view-mapa':'nav-map' };

function goTo(id) {
  VIEWS.forEach(v => {
    const el = document.getElementById(v);
    if (!el) return;
    el.style.display = 'none';
    el.classList.remove('open');
  });

  const target = document.getElementById(id);
  if (!target) return;

  if (id === 'view-mapa') {
    target.classList.add('open');
    target.style.display = '';
    setTimeout(iniciarMapa, 80);
    setTimeout(() => mapa && mapa.invalidateSize(true), 320);
  } else {
    target.style.display = 'block';
  }

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const nav = document.getElementById(NAV_IDS[id]);
  if (nav) nav.classList.add('active');
}

/* ============================================================
   LISTAS
   ============================================================ */
function renderLista(lista, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = lista.map(o => {
    const b  = BADGE_COR[o.urg] || BADGE_COR.Média;
    const ic = getIconColor(o.tipo);
    return `
      <div class="ocorrencia-card">
        <div class="oc-icon">${ic}</div>
        <div class="oc-info">
          <div class="oc-title">${o.tipo}</div>
          <div class="oc-sub">${o.local} · ${o.tempo}</div>
        </div>
        <span class="oc-badge" style="background:${b.bg};color:${b.c};">${o.urg}</span>
      </div>`;
  }).join('');
}

/* ── Dropdown Recentes ── */
let recentesAberto = false;
function toggleRecentes() {
  recentesAberto = !recentesAberto;
  const lista  = document.getElementById('listaHome');
  const seta   = document.getElementById('recentesArrow');
  lista.style.display = recentesAberto ? 'flex' : 'none';
  seta.classList.toggle('open', recentesAberto);
}

/* ============================================================
   GRÁFICO
   ============================================================ */
function renderChart() {
  const dias = ['S','T','Q','Q','S','S','D'];
  const vals = [2, 3, 2, 5, 4, 2, 1];
  const mx   = 5;
  const el   = document.getElementById('barsArea');
  if (!el) return;
  el.innerHTML = dias.map((d, i) => {
    const h = Math.round((vals[i] / mx) * 90);
    return `
      <div class="bar-col">
        <div class="bar${i === 3 ? ' highlight' : ''}"
             data-val="${vals[i]}"
             style="height:0"
             data-h="${h}"></div>
        <span class="bar-day">${d}</span>
      </div>`;
  }).join('');
  setTimeout(() => {
    document.querySelectorAll('.bar').forEach(b => b.style.height = b.dataset.h + 'px');
  }, 120);
}

/* ============================================================
   MODAL RELATAR
   ============================================================ */
function openRelatar()  { document.getElementById('modal-relatar').classList.add('open'); }
function closeRelatar() { document.getElementById('modal-relatar').classList.remove('open'); }

function submitRelatar() {
  const tipo = document.getElementById('tipo-select').value;
  const end  = document.getElementById('end-input').value.trim();
  if (!tipo || !end) { toast('Preencha tipo e endereço!'); return; }
  const urg = document.getElementById('urg-select').value;

  dados.unshift({
    tipo, local: end, tempo: 'Agora', urg,
    lat: -8.1128 + (Math.random() - 0.5) * 0.02,
    lng: -34.9092 + (Math.random() - 0.5) * 0.02
  });

  atualizarContadores();
  renderLista(dados, 'listaHome');
  renderLista(dados, 'listaTodas');
  if (mapa) { renderMarcadores(dados); renderMiniLista(dados); }

  closeRelatar();
  document.getElementById('tipo-select').value = '';
  document.getElementById('end-input').value   = '';
  document.getElementById('desc-input').value  = '';
  toast('Ocorrência registrada! ✅');
}

function atualizarContadores() {
  const n = dados.length;
  document.getElementById('alertCount').innerHTML = `<span>🔔 </span>${n} Alertas`;
  document.getElementById('mapaCount').textContent = n;
  document.getElementById('recentesBadge').textContent = n;
}

/* ============================================================
   MODAL CONTATO EMERGÊNCIA
   ============================================================ */
function openContato()  { document.getElementById('modal-contato').classList.add('open'); }
function closeContato() { document.getElementById('modal-contato').classList.remove('open'); }

/* ============================================================
   MODAL CONFIG + TEMA DIA/NOITE
   ============================================================ */
let temaEscuro = false;

function openConfig() {
  atualizarIconeTema();
  document.getElementById('modal-config').classList.add('open');
}
function closeConfig() { document.getElementById('modal-config').classList.remove('open'); }

function atualizarIconeTema() {
  const wrap  = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  const track = document.getElementById('toggleTrack');

  if (temaEscuro) {
    wrap.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="20" height="20">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>`;
    wrap.style.background = '#1e1a30';
    wrap.style.border = '1.5px solid #6d3fa8';
    label.textContent = 'Modo Escuro ativo';
    track.classList.add('active');
  } else {
    wrap.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="20" height="20">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>`;
    wrap.style.background = '#d97706';
    wrap.style.border = 'none';
    label.textContent = 'Modo Claro ativo';
    track.classList.remove('active');
  }
}

function toggleTema() {
  temaEscuro = !temaEscuro;
  document.documentElement.setAttribute('data-theme', temaEscuro ? 'dark' : 'light');
  atualizarIconeTema();
  toast(temaEscuro ? '🌙 Modo Escuro ativado' : '☀️ Modo Claro ativado');
}

function toggleConfig(wrap) {
  const track = wrap.querySelector('.toggle-track');
  track.classList.toggle('active');
}

/* ============================================================
   MODAL VISTORIA
   ============================================================ */
function openVistoria()  { document.getElementById('modal-vistoria').classList.add('open'); }
function closeVistoria() { document.getElementById('modal-vistoria').classList.remove('open'); }

function submitVistoria() {
  const tipo = document.getElementById('vistoria-tipo').value;
  const end  = document.getElementById('vistoria-end').value.trim();
  if (!tipo || !end) { toast('Preencha tipo e endereço!'); return; }
  closeVistoria();
  document.getElementById('vistoria-tipo').value = '';
  document.getElementById('vistoria-end').value  = '';
  document.getElementById('vistoria-desc').value = '';
  toast('Vistoria solicitada! 🔍');
}

/* ============================================================
   TOAST
   ============================================================ */
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

/* ============================================================
   RELÓGIO
   ============================================================ */
function atualizarRelogio() {
  const n = new Date();
  document.getElementById('relogio').textContent =
    String(n.getHours()).padStart(2, '0') + ':' +
    String(n.getMinutes()).padStart(2, '0');
}
setInterval(atualizarRelogio, 30000);
atualizarRelogio();

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
renderLista(dados, 'listaHome');
renderLista(dados, 'listaTodas');
renderChart();
atualizarContadores();
atualizarIconeTema();


