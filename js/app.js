/* ============================================================
   MONITOR URBANO — app.js (COMPLETO + CORRIGIDO)
   ============================================================ */

/* ── Dados ── */
const dados = [
  { tipo:'Alagamento', local:'Av. Principal, 340',     tempo:'Há 10 min',   urg:'Alta',  status:'Aberto', lat:-8.1128, lng:-34.9092 },
  { tipo:'Barreira',   local:'Rua das Flores, s/n',    tempo:'Há 32 min',   urg:'Média', status:'Aberto', lat:-8.1160, lng:-34.9050 },
  { tipo:'Lixo',       local:'Praça Central',           tempo:'Há 1h',       urg:'Baixa', status:'Aberto', lat:-8.1090, lng:-34.9110 },
  { tipo:'Alagamento', local:'Av. Sul, 120',            tempo:'Há 1h 20min', urg:'Alta',  status:'Em atendimento', lat:-8.1200, lng:-34.9080 },
  { tipo:'Barreira',   local:'Viaduto João Paulo',      tempo:'Há 2h',       urg:'Alta',  status:'Aberto', lat:-8.1070, lng:-34.9030 },
  { tipo:'Lixo',       local:'Rua 3, Bairro Novo',     tempo:'Há 3h',       urg:'Baixa', status:'Resolvido', lat:-8.1140, lng:-34.9140 },
  { tipo:'Outros',     local:'Rua Esperança, 88',       tempo:'Há 4h',       urg:'Média', status:'Aberto', lat:-8.1050, lng:-34.9065 },
  { tipo:'Alagamento', local:'Rua do Porto, 14',        tempo:'Há 5h',       urg:'Alta',  status:'Aberto', lat:-8.1180, lng:-34.9120 },
  { tipo:'Barreira',   local:'Terminal Rodoviário',     tempo:'Há 6h',       urg:'Média', status:'Em atendimento', lat:-8.1030, lng:-34.9000 },
  { tipo:'Lixo',       local:'Feira do Município',      tempo:'Há 7h',       urg:'Baixa', status:'Aberto', lat:-8.1220, lng:-34.9060 },
  { tipo:'Outros',     local:'Praça da Matriz',         tempo:'Há 8h',       urg:'Média', status:'Aberto', lat:-8.1100, lng:-34.9150 },
  { tipo:'Alagamento', local:'Av. Barreto de Menezes', tempo:'Há 9h',       urg:'Alta',  status:'Aberto', lat:-8.1155, lng:-34.9095 },
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
const STATUS_CLS = {
  'Aberto':         'status-aberto',
  'Em atendimento': 'status-atendimento',
  'Resolvido':      'status-resolvido',
};

const SVG_ICON = {
  Alagamento:`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M2 20c2-2 4 0 6 0s4-2 6 0 4 2 6 0"/><path d="M2 14c2-2 4 0 6 0s4-2 6 0 4 2 6 0"/></svg>`,
  Barreira:  `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect x="2" y="9" width="20" height="6" rx="2"/><line x1="7" y1="9" x2="7" y2="15"/><line x1="12" y1="9" x2="12" y2="15"/></svg>`,
  Lixo:      `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>`,
  Outros:    `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  Buraco:    `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><ellipse cx="12" cy="16" rx="8" ry="4"/><path d="M4 12c0-2.2 3.6-4 8-4s8 1.8 8 4"/></svg>`,
  Iluminação:`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><line x1="12" y1="2" x2="12" y2="6"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="18" x2="12" y2="22"/></svg>`,
};

const SVG_ICON_COLOR = {
  Alagamento:(c)=>`<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><path d="M2 20c2-2 4 0 6 0s4-2 6 0 4 2 6 0"/><path d="M2 14c2-2 4 0 6 0s4-2 6 0 4 2 6 0"/></svg>`,
  Barreira:  (c)=>`<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><rect x="2" y="9" width="20" height="6" rx="2"/><line x1="7" y1="9" x2="7" y2="15"/><line x1="12" y1="9" x2="12" y2="15"/></svg>`,
  Lixo:      (c)=>`<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>`,
  Outros:    (c)=>`<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  Buraco:    (c)=>`<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><ellipse cx="12" cy="16" rx="8" ry="4"/><path d="M4 12c0-2.2 3.6-4 8-4s8 1.8 8 4"/></svg>`,
  Iluminação:(c)=>`<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><line x1="12" y1="2" x2="12" y2="6"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="18" x2="12" y2="22"/></svg>`,
};

/* ── Utilitários ── */
function sanitize(str = '') {
  const el = document.createElement('div');
  el.textContent = String(str);
  return el.innerHTML;
}

function getIconColor(tipo) {
  const fn = SVG_ICON_COLOR[tipo] || SVG_ICON_COLOR.Outros;
  return fn(COR[tipo] || '#6b7280');
}

/* ============================================================
   SINCRONIZAÇÃO GLOBAL (CRUD)
   ============================================================ */
function syncTudo() {
  atualizarContadores();
  renderLista(dados, 'listaHome');
  renderLista(dados, 'listaTodas');
  renderChart();
  if (mapaReady)     { renderMarcadores(dados);     renderMiniLista(dados); }
  if (mapaFullReady) { renderMarcadoresFull(dados); }

  const badge = document.getElementById('recentesBadge');
  if (badge) {
    badge.classList.remove('count-pop');
    void badge.offsetWidth;
    badge.classList.add('count-pop');
  }
}

/* ============================================================
   RENDER LISTA
   ============================================================ */
function renderLista(lista, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  if (lista.length === 0) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        </div>
        <div class="empty-title">Nenhuma ocorrência</div>
        <div class="empty-sub">
          Não há ocorrências no momento.<br>
          Use o botão + para registrar uma nova.
        </div>
      </div>`;
    return;
  }

  el.innerHTML = lista.map(o => {
    const idxReal = dados.indexOf(o);
    const b       = BADGE_COR[o.urg] || BADGE_COR.Média;
    const status  = o.status || 'Aberto';
    const stCls   = STATUS_CLS[status] || 'status-aberto';

    return `
      <div class="ocorrencia-card" id="card-${idxReal}">
        <div class="oc-icon" style="background:${COR[o.tipo] || '#6b7280'}22;">
          ${getIconColor(o.tipo)}
        </div>
        <div class="oc-info" style="flex:1;min-width:0;">
          <div class="oc-title">${sanitize(o.tipo)}</div>
          <div class="oc-sub" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${sanitize(o.local)} · ${sanitize(o.tempo)}
          </div>
          <span class="oc-status ${stCls}">${sanitize(status)}</span>
        </div>
        <span class="oc-badge" style="background:${b.bg};color:${b.c};flex-shrink:0;">
          ${sanitize(o.urg)}
        </span>
        <div class="oc-actions">
          <button class="oc-btn-edit" title="Editar" onclick="openEditar(${idxReal})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="oc-btn-delete" title="Remover" onclick="openConfirmDelete(${idxReal})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
            </svg>
          </button>
        </div>
      </div>`;
  }).join('');
}

/* ============================================================
   LEAFLET — POPUP COM CRUD
   ============================================================ */
function criarPopupHTML(o, idx) {
  const b      = BADGE_COR[o.urg] || BADGE_COR.Média;
  const stCls  = {
    'Aberto':         'background:#FFEBEE;color:#C62828',
    'Em atendimento': 'background:#FFF8E1;color:#E65100',
    'Resolvido':      'background:#E8F5E9;color:#2E7D32',
  }[o.status] || 'background:#FFEBEE;color:#C62828';

  return `
    <div style="font-family:'Sora',sans-serif;min-width:200px;padding:2px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <div style="width:34px;height:34px;border-radius:10px;
                    background:${(COR[o.tipo]||'#6b7280')}22;
                    display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          ${getIconColor(o.tipo)}
        </div>
        <div>
          <div style="font-size:13px;font-weight:800;color:#0D1B3E;">
            ${sanitize(o.tipo)}
          </div>
          <div style="font-size:10px;color:#5A6A8A;margin-top:1px;">
            ${sanitize(o.local)}
          </div>
        </div>
      </div>

      ${o.desc ? `
        <div style="font-size:11px;color:#5A6A8A;margin-bottom:8px;
                    padding:6px 8px;background:#F5F7FF;border-radius:8px;
                    line-height:1.4;">
          ${sanitize(o.desc)}
        </div>` : ''}

      <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">
        <span style="font-size:10px;font-weight:800;padding:3px 8px;border-radius:10px;background:${b.bg};color:${b.c};">
          ${sanitize(o.urg)}
        </span>
        <span style="font-size:10px;font-weight:800;padding:3px 8px;border-radius:10px;${stCls}">
          ${sanitize(o.status || 'Aberto')}
        </span>
        <span style="font-size:10px;color:#8B9DB5;margin-left:auto;align-self:center;">
          ${sanitize(o.tempo)}
        </span>
      </div>

      <div style="height:1px;background:rgba(27,79,204,0.10);margin-bottom:10px;"></div>

      <button onclick="abrirRota(${idx})"
        style="width:100%;padding:9px;border-radius:10px;border:none;
               background:linear-gradient(135deg,#0F2D7A,#2E6EF7);
               color:white;font-family:Sora,sans-serif;
               font-size:12px;font-weight:800;cursor:pointer;
               display:flex;align-items:center;justify-content:center;gap:6px;
               margin-bottom:7px;box-shadow:0 4px 12px rgba(27,79,204,0.30);">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
          <polygon points="3 11 22 2 13 21 11 13 3 11"/>
        </svg>
        Como Chegar
      </button>

      <div style="display:flex;gap:6px;">
        <button onclick="editarDoMapa(${idx})"
          style="flex:1;padding:7px;border-radius:9px;border:1.5px solid rgba(27,79,204,0.20);
                 background:#E8EFFE;color:#1B4FCC;font-family:Sora,sans-serif;font-size:11px;font-weight:700;cursor:pointer;">
          ✏️ Editar
        </button>
        <button onclick="deletarDoMapa(${idx})"
          style="flex:1;padding:7px;border-radius:9px;border:1.5px solid rgba(229,57,53,0.18);
                 background:#FFEBEE;color:#E53935;font-family:Sora,sans-serif;font-size:11px;font-weight:700;cursor:pointer;">
          🗑️ Remover
        </button>
      </div>
    </div>`;
}

/* ── Mapa Normal ── */
let mapa = null, marcadores = [], userMarker = null, mapaReady = false;

function criarIcone(tipo) {
  const cor = COR[tipo] || '#6b7280';
  const svg = SVG_ICON[tipo] || SVG_ICON.Outros;
  return L.divIcon({
    className: '',
    iconSize: [40, 48], iconAnchor: [20, 48], popupAnchor: [0, -50],
    html: `<div style="width:40px;height:40px;background:${cor};border-radius:50% 50% 50% 0;
             transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;
             box-shadow:0 4px 14px rgba(0,0,0,0.28);border:3px solid white;">
             <div style="transform:rotate(45deg);width:20px;height:20px;">${svg}</div>
           </div>`
  });
}

function iniciarMapa() {
  if (!mapaReady) {
    mapa = L.map('leafletMap', {
      center: [-8.1128, -34.9092], zoom: 14,
      zoomControl: false, attributionControl: true
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap', maxZoom: 19
    }).addTo(mapa);
    L.control.zoom({ position: 'bottomright' }).addTo(mapa);
    mapaReady = true;
    renderMarcadores(dados);
    renderMiniLista(dados);
    renderZonasRisco(mapa);
  }
  requestAnimationFrame(() => setTimeout(() => mapa && mapa.invalidateSize(true), 200));
}

function renderMarcadores(lista) {
  if (!mapa) return;
  marcadores.forEach(m => mapa.removeLayer(m));
  marcadores = [];
  lista.forEach(o => {
    const idx = dados.indexOf(o);
    const m = L.marker([o.lat, o.lng], { icon: criarIcone(o.tipo) })
      .bindPopup(criarPopupHTML(o, idx), { maxWidth: 230 })
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
          <div class="mini-t">${sanitize(o.tipo)} — ${sanitize(o.local)}</div>
          <div class="mini-s">${sanitize(o.tempo)}</div>
        </div>
        <span class="mini-b" style="background:${b.bg};color:${b.c};">${sanitize(o.urg)}</span>
      </div>`;
  }).join('');
}

/* ── Mapa Fullscreen ── */
let mapaFull = null, marcadoresFull = [], userMarkerFull = null, mapaFullReady = false;

function iniciarMapaFull() {
  if (!mapaFullReady) {
    mapaFull = L.map('leafletMapFull', {
      center: [-8.1128, -34.9092], zoom: 14,
      zoomControl: false, attributionControl: true
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap', maxZoom: 19
    }).addTo(mapaFull);
    L.control.zoom({ position: 'bottomright' }).addTo(mapaFull);
    mapaFullReady = true;
    renderMarcadoresFull(dados);
    renderZonasRisco(mapaFull);
  }
  requestAnimationFrame(() => setTimeout(() => mapaFull && mapaFull.invalidateSize(true), 200));
}

function renderMarcadoresFull(lista) {
  if (!mapaFull) return;
  marcadoresFull.forEach(m => mapaFull.removeLayer(m));
  marcadoresFull = [];
  lista.forEach(o => {
    const idx = dados.indexOf(o);
    const m = L.marker([o.lat, o.lng], { icon: criarIcone(o.tipo) })
      .bindPopup(criarPopupHTML(o, idx), { maxWidth: 230 })
      .addTo(mapaFull);
    marcadoresFull.push(m);
  });
}

function filtrarMapa(tipo) {
  document.querySelectorAll('#chips .chip').forEach(c => {
    c.className = 'chip ' + (c.dataset.t === tipo ? 'on' : 'off');
  });
  const lista = tipo === 'Todos' ? dados : dados.filter(o => o.tipo === tipo);
  if (mapa) { renderMarcadores(lista); renderMiniLista(lista); }
  document.getElementById('mapaCount').textContent = lista.length;
  const vm = document.getElementById('view-mapa');
  if (!vm.classList.contains('open')) goTo('view-mapa');
}

function filtrarMapaFull(tipo) {
  document.querySelectorAll('#chips-full .chip').forEach(c => {
    c.className = 'chip ' + (c.dataset.t === tipo ? 'on' : 'off');
  });
  const lista = tipo === 'Todos' ? dados : dados.filter(o => o.tipo === tipo);
  renderMarcadoresFull(lista);
  document.getElementById('fullMapCount').textContent = lista.length;
}

function buscarMapa(val) {
  const v = val.toLowerCase().trim();
  const lista = v
    ? dados.filter(o => o.tipo.toLowerCase().includes(v) || o.local.toLowerCase().includes(v))
    : dados;
  if (mapa) { renderMarcadores(lista); renderMiniLista(lista); }
  document.getElementById('mapaCount').textContent = lista.length;
}

function centralizarUsuario() {
  if (!navigator.geolocation) { toast('GPS não disponível'); return; }
  toast('Localizando...');
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude: lat, longitude: lng } = pos.coords;
    mapa.setView([lat, lng], 15);
    if (userMarker) mapa.removeLayer(userMarker);
    userMarker = L.circleMarker([lat, lng], {
      radius: 10, color: '#7B2FBE', fillColor: '#A855F7', fillOpacity: 0.9, weight: 3
    }).bindPopup('<b style="font-family:Sora,sans-serif;font-size:12px;">Você está aqui</b>')
      .addTo(mapa).openPopup();
    toast('Localização encontrada! 📍');
  }, () => toast('Não foi possível obter localização'));
}

function centralizarUsuarioFull() {
  if (!navigator.geolocation) { toast('GPS não disponível'); return; }
  toast('Localizando...');
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude: lat, longitude: lng } = pos.coords;
    mapaFull.setView([lat, lng], 15);
    if (userMarkerFull) mapaFull.removeLayer(userMarkerFull);
    userMarkerFull = L.circleMarker([lat, lng], {
      radius: 10, color: '#7B2FBE', fillColor: '#A855F7', fillOpacity: 0.9, weight: 3
    }).bindPopup('<b style="font-family:Sora,sans-serif;font-size:12px;">Você está aqui</b>')
      .addTo(mapaFull).openPopup();
    toast('Localização encontrada! 📍');
  }, () => toast('Não foi possível obter localização'));
}

window.editarDoMapa = function(idx) {
  if (mapaReady && mapa)         mapa.closePopup();
  if (mapaFullReady && mapaFull) mapaFull.closePopup();
  setTimeout(() => openEditar(idx), 150);
};

window.deletarDoMapa = function(idx) {
  if (mapaReady && mapa)         mapa.closePopup();
  if (mapaFullReady && mapaFull) mapaFull.closePopup();
  setTimeout(() => openConfirmDelete(idx), 150);
};

const zonasRisco = [
  { coords:[[-8.1100,-34.9120],[-8.1080,-34.9100],[-8.1060,-34.9130]], nivel:'Alto',  tipo:'Alagamento',   bairro:'Cajueiro Seco' },
  { coords:[[-8.1200,-34.9050],[-8.1180,-34.9030],[-8.1160,-34.9060]], nivel:'Médio', tipo:'Deslizamento',  bairro:'Prazeres'      },
];

function renderZonasRisco(mapaInst) {
  const cores = {
    Alto:  { color:'#dc2626', fill:'#dc262630' },
    Médio: { color:'#ca8a04', fill:'#ca8a0430' },
    Baixo: { color:'#16a34a', fill:'#16a34a30' },
  };
  zonasRisco.forEach(zona => {
    const c = cores[zona.nivel];
    L.polygon(zona.coords, {
      color: c.color, fillColor: c.fill,
      fillOpacity: 0.35, weight: 2, dashArray: '6,4'
    })
    .bindPopup(`<b>${zona.bairro}</b><br>Risco de ${zona.tipo}<br>
      <span style="color:${c.color};font-weight:700;">⚠️ Nível ${zona.nivel}</span>`)
    .addTo(mapaInst);
  });
}

/* ============================================================
   NAVEGAÇÃO — UNIFICADA E CORRIGIDA
   ============================================================ */
const VIEWS = ['view-home', 'view-lista', 'view-mapa', 'view-mapa-full', 'view-chat'];

const NAV_MAP = {
  'view-home':     'nav-home',
  'view-lista':    'nav-bell',
  'view-mapa':     'nav-map',
  'view-mapa-full':'nav-map',
  'view-chat':     'nav-chat'
};

function goTo(viewId) {
  VIEWS.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.style.display = 'none';
        el.classList.remove('open');
    }
  });

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const target = document.getElementById(viewId);
  if (!target) return;

  if (viewId === 'view-mapa' || viewId === 'view-mapa-full') {
    target.style.display = 'block';
    target.classList.add('open');
    if (viewId === 'view-mapa') iniciarMapa();
    if (viewId === 'view-mapa-full') {
      iniciarMapaFull();
      document.getElementById('fullMapCount').textContent = dados.length;
    }
  } else if (viewId === 'view-chat') {
    target.style.display = 'flex'; 
    setTimeout(() => document.getElementById('chat-input')?.focus(), 300);
    document.getElementById('nav-chat')?.classList.remove('has-badge');
  } else {
    target.style.display = 'block';
  }

  const navId = NAV_MAP[viewId];
  if (navId) {
    const navEl = document.getElementById(navId);
    if (navEl) navEl.classList.add('active');
  }

  if (viewId === 'view-mapa' && window.mapa) {
    setTimeout(() => window.mapa.invalidateSize(), 100);
  }
  if (viewId === 'view-mapa-full' && window.mapaFull) {
    setTimeout(() => window.mapaFull.invalidateSize(), 100);
  }
}

let recentesAberto = false;
function toggleRecentes() {
  recentesAberto = !recentesAberto;
  const lista = document.getElementById('listaHome');
  const seta  = document.getElementById('recentesArrow');
  lista.style.display = recentesAberto ? 'flex' : 'none';
  seta.classList.toggle('open', recentesAberto);
}

/* ============================================================
   GRÁFICO E ESTATÍSTICAS
   ============================================================ */
function contarPorTipo(lista) {
  return lista.reduce((acc, o) => { acc[o.tipo] = (acc[o.tipo]||0)+1; return acc; }, {});
}

function distribuirNasSemana(contagem, numDias) {
  const ordenados = Object.entries(contagem).sort((a,b) => b[1]-a[1]);
  const fatias = [];
  ordenados.forEach(([tipo, qtd]) => {
    if (qtd <= 2) { fatias.push({ tipo, val: qtd }); }
    else {
      fatias.push({ tipo, val: Math.ceil(qtd/2) });
      fatias.push({ tipo, val: Math.floor(qtd/2) });
    }
  });
  while (fatias.length < numDias) fatias.push({ tipo:'Outros', val:0 });
  return fatias.slice(0, numDias);
}

function renderChart() {
  const dias = ['S','T','Q','Q','S','S','D'];
  const el   = document.getElementById('barsArea');
  if (!el) return;
  const contagem = contarPorTipo(dados);
  const fatias   = distribuirNasSemana(contagem, dias.length);
  const mx       = Math.max(...fatias.map(f => f.val), 1);
  atualizarLegendaChart(contagem);
  el.innerHTML = dias.map((d, i) => {
    const { val, tipo } = fatias[i];
    const h   = val > 0 ? Math.max(Math.round((val/mx)*90), 8) : 4;
    const cor = COR[tipo] || '#C4B5FD';
    const opa = val === 0 ? '0.25' : '1';
    return `<div class="bar-col">
      <div class="bar" data-val="${val}" data-h="${h}"
           style="height:0;background:${cor};opacity:${opa}"></div>
      <span class="bar-day">${d}</span>
    </div>`;
  }).join('');
  setTimeout(() => {
    document.querySelectorAll('.bar').forEach(b => { b.style.height = b.dataset.h + 'px'; });
  }, 120);
}

function atualizarLegendaChart(contagem) {
  const rows  = document.querySelectorAll('.stat-row');
  const ordem = ['Alagamento','Barreira','Lixo','Outros'];
  rows.forEach((row, i) => {
    const tipo = ordem[i]; if (!tipo) return;
    const qtd  = contagem[tipo] || 0;
    const dot  = row.querySelector('.stat-dot');
    row.innerHTML = '';
    if (dot) row.appendChild(dot);
    row.appendChild(document.createTextNode(` ${qtd} ${tipo}${qtd !== 1 ? 's' : ''}`));
  });
}

/* ============================================================
   SISTEMA DE GEOCODING + CEP
   ============================================================ */
const CIDADE_PADRAO   = 'Jaboatão dos Guararapes';
const LAT_CENTRO = -8.1128;
const LNG_CENTRO = -34.9092;

let autocompleteTimer = null;

function initAutocomplete() {
  const input = document.getElementById('end-input');
  if (!input) return;

  input.addEventListener('input', function () {
    clearTimeout(autocompleteTimer);
    const val = this.value.trim();

    if (val.length < 4) {
      esconderSugestoes();
      esconderPreviewCEP();
      return;
    }
    autocompleteTimer = setTimeout(() => buscarSugestoes(val), 600);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#end-input') && !e.target.closest('#sugestoes-lista')) {
      esconderSugestoes();
    }
  });
}

async function buscarSugestoes(query) {
  try {
    const params = new URLSearchParams({
      format: 'json', q: `${query}, ${CIDADE_PADRAO}, PE, Brasil`,
      limit: '5', countrycodes: 'br', 'accept-language': 'pt-BR', addressdetails: '1',
    });

    const resp = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, { headers: { 'User-Agent': 'MonitorUrbanoJaboatao/1.0' } });
    if (!resp.ok) return;
    exibirSugestoes(await resp.json(), query);
  } catch (e) { }
}

function exibirSugestoes(resultados, queryOriginal) {
  let lista = document.getElementById('sugestoes-lista');

  if (!lista) {
    lista = document.createElement('div');
    lista.id = 'sugestoes-lista';
    lista.style.cssText = `
      position:absolute; z-index:99999; background:var(--surface); border-radius:12px;
      box-shadow:0 8px 32px rgba(15,45,122,0.18); border:1.5px solid var(--border-strong);
      overflow:hidden; max-height:220px; overflow-y:auto; scrollbar-width:none; width: 100%;
    `;
    const formGroup = document.getElementById('end-input').parentNode;
    formGroup.style.position = 'relative';
    formGroup.appendChild(lista);
  }

  if (!resultados || resultados.length === 0) {
    lista.innerHTML = `<div style="padding:12px 14px;font-size:12px;color:var(--text-muted);">Nenhum resultado encontrado</div>`;
    lista.style.display = 'block';
    return;
  }

  lista.innerHTML = resultados.map((r, i) => {
    const partes = r.display_name.split(',').slice(0, 3).map(p => p.trim());
    const titulo = partes[0] || r.display_name;
    const sub    = partes.slice(1).join(', ');
    const cep    = r.address?.postcode || '';

    return `
      <div class="sugestao-item" onclick="selecionarSugestao('${sanitize(titulo).replace(/'/g,"\\'")}', '${r.lat}', '${r.lon}', '${sanitize(cep)}')"\
           style="display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;border-bottom:1px solid var(--border);">
        <div style="flex-shrink:0;color:var(--brand);">📍</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:12px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${sanitize(titulo)}</div>
          <div style="font-size:10px;color:var(--text-muted);">${sanitize(sub)} ${cep ? `· CEP ${cep}` : ''}</div>
        </div>
      </div>`;
  }).join('');
  lista.style.display = 'block';
}

window.selecionarSugestao = function(titulo, lat, lng, cep) {
  const input = document.getElementById('end-input');
  input.value = titulo;
  input.dataset.lat = lat;
  input.dataset.lng = lng;
  input.dataset.cep = cep;
  esconderSugestoes();
  if (cep) mostrarPreviewCEP(cep, titulo);
};

function esconderSugestoes() { const lista = document.getElementById('sugestoes-lista'); if (lista) lista.style.display = 'none'; }

async function mostrarPreviewCEP(cep, endereco) {
  let preview = document.getElementById('end-preview');
  if (!preview) {
    preview = document.createElement('div');
    preview.id = 'end-preview';
    document.getElementById('end-input').parentNode.appendChild(preview);
  }
  preview.style.cssText = `display:flex; align-items:center; gap:8px; padding:8px 12px; margin-top:6px; background:var(--brand-pale); border-radius:10px; border:1px solid var(--border-strong); font-size:11px; font-weight:600; color:var(--brand);`;
  preview.innerHTML = `📮 CEP <strong>${cep}</strong> — endereço localizado <span style="margin-left:auto;color:var(--success);font-size:10px;">✅ Exato</span>`;
}
function esconderPreviewCEP() { const preview = document.getElementById('end-preview'); if (preview) preview.style.display = 'none'; }

async function obterCoordenadasEndereco(enderecoRaw) {
  const input = document.getElementById('end-input');
  if (input && input.dataset.lat) {
      return { lat: parseFloat(input.dataset.lat), lng: parseFloat(input.dataset.lng), cep: input.dataset.cep || null, precisao: 'exata' };
  }
  return { lat: LAT_CENTRO, lng: LNG_CENTRO, cep: null, precisao: 'fallback' };
}

/* ============================================================
   MODAL RELATAR
   ============================================================ */
function openRelatar()  { 
  document.getElementById('modal-relatar').classList.add('open'); 
  initAutocomplete();
}

function closeRelatar() {
  document.getElementById('modal-relatar').classList.remove('open');
  esconderPreviewCEP();
}

let enviando = false;

async function submitRelatar() {
  if (enviando) return;

  const tipo = document.getElementById('tipo-select').value;
  const end  = document.getElementById('end-input').value.trim();
  const desc = document.getElementById('desc-input').value.trim();
  const urg  = document.getElementById('urg-select').value;

  if (!tipo) { toast('Selecione o tipo de ocorrência!'); return; }
  if (!end)  { toast('Informe o endereço!'); return; }

  enviando = true;
  const btn = document.querySelector('#modal-relatar .btn-submit');
  btn.innerHTML = `⏳ Buscando localização...`;
  btn.disabled = true;

  try {
    const coords = await obterCoordenadasEndereco(end);
    const endExibido = coords.cep ? `${end} — CEP ${coords.cep}` : end;

    dados.unshift({
      tipo, local: end, localCompleto: endExibido, desc: desc || '',
      tempo: 'Agora', urg, status: 'Aberto', lat: coords.lat, lng: coords.lng, cep: coords.cep
    });

    syncTudo();
    closeRelatar();

    document.getElementById('tipo-select').value = '';
    document.getElementById('end-input').value   = '';
    document.getElementById('desc-input').value  = '';
    delete document.getElementById('end-input').dataset.lat;
    delete document.getElementById('end-input').dataset.lng;

    toast(`✅ ${tipo} registrado com sucesso!`);
    
    setTimeout(() => {
      goTo('view-mapa');
      setTimeout(() => { if (mapa && mapaReady) { mapa.setView([coords.lat, coords.lng], 17); if (marcadores.length > 0) marcadores[0].openPopup(); } }, 450);
    }, 700);

  } catch (err) {
    toast('❌ Erro ao registrar ocorrência.');
  } finally {
    btn.innerHTML = 'Enviar Ocorrência';
    btn.disabled  = false;
    enviando      = false;
  }
}

/* ============================================================
   SIMULAÇÃO DE ALERTA SEVERO (DEFESA CIVIL)
   ============================================================ */
function simularAlertaSevero() {
  document.getElementById('modal-alerta-severo').classList.add('open');
  
  // Efeito bônus: Faz o celular vibrar para dar susto real na demonstração (se aberto no celular)
  if (navigator.vibrate) {
    navigator.vibrate([500, 200, 500]);
  }
}

function fecharAlertaSevero() {
  document.getElementById('modal-alerta-severo').classList.remove('open');
}

/* ============================================================
   LÓGICA DO ALERTA AUTOMÁTICO (5 A 20 SEGUNDOS)
   ============================================================ */
let alertaAutoTimeout = null;
let alertaAutoAtivo = false;

function toggleAlertaAutomatico(element) {
  // Muda a cor e a posição da bolinha do botão (liga/desliga)
  const track = element.querySelector('.toggle-track');
  track.classList.toggle('active');
  
  // Verifica se o botão ficou ativado ou desativado
  alertaAutoAtivo = track.classList.contains('active');

  if (alertaAutoAtivo) {
    toast('⏰ Simulação ativada! Alertas a cada 5~20s.');
    agendarProximoAlerta(); // Dá a partida no ciclo
  } else {
    toast('🛑 Simulação desativada.');
    clearTimeout(alertaAutoTimeout); // Para o ciclo na hora
  }
}

function agendarProximoAlerta() {
  if (!alertaAutoAtivo) return; // Trava de segurança

  // Sorteia um número entre 5000 (5s) e 20000 (20s)
  const tempoSorteado = Math.floor(Math.random() * (20000 - 5000 + 1)) + 5000;

  // Cria o cronômetro para disparar o alerta
  alertaAutoTimeout = setTimeout(() => {
    if (alertaAutoAtivo) {
      simularAlertaSevero(); // Abre a tela preta que criamos
      agendarProximoAlerta(); // Assim que exibe, já agenda o próximo!
    }
  }, tempoSorteado);
}

/* ============================================================
   OCULTAR/MOSTRAR BOTÃO DE SIMULAR ALERTA
   ============================================================ */
function toggleVisibilidadeBotao(element) {
  // Liga/desliga o visual da chavinha
  const track = element.querySelector('.toggle-track');
  track.classList.toggle('active');
  
  // Pega o estado atual (true se estiver ativado, false se desativado)
  const estaAtivo = track.classList.contains('active');
  
  // Pega a caixinha do botão pelo ID que criamos no Passo 1
  const btnWrap = document.getElementById('btn-simular-wrap');
  
  if (btnWrap) {
    // Se a chave estiver ligada, mostra o botão (flex). Se não, oculta (none).
    btnWrap.style.display = estaAtivo ? 'flex' : 'none';
  }
}




/* ============================================================
   MODAIS DIVERSOS & CONFIGURAÇÕES
   ============================================================ */
function openContato()   { document.getElementById('modal-contato').classList.add('open'); }
function closeContato()  { document.getElementById('modal-contato').classList.remove('open'); }
function openVistoria()  { document.getElementById('modal-vistoria').classList.add('open'); }
function closeVistoria() { document.getElementById('modal-vistoria').classList.remove('open'); }

function submitVistoria() {
  const tipo = document.getElementById('vistoria-tipo').value;
  const end  = document.getElementById('vistoria-end').value.trim();
  if (!tipo || !end) { toast('Preencha tipo e endereço!'); return; }
  closeVistoria();
  document.getElementById('vistoria-tipo').value = ''; document.getElementById('vistoria-end').value  = ''; document.getElementById('vistoria-desc').value = '';
  toast('Vistoria solicitada! 🔍');
}

let temaEscuro = false;

function openConfig() { atualizarIconeTema(); document.getElementById('modal-config').classList.add('open'); }
function closeConfig() { document.getElementById('modal-config').classList.remove('open'); }

function atualizarIconeTema() {
  const wrap  = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  const track = document.getElementById('toggleTrack');
  if (temaEscuro) {
    wrap.innerHTML = `🌙`; wrap.style.background = '#1e1a30'; wrap.style.border = '1.5px solid #6d3fa8';
    label.textContent = 'Modo Escuro ativo'; track.classList.add('active');
  } else {
    wrap.innerHTML = `☀️`; wrap.style.background = '#d97706'; wrap.style.border = 'none';
    label.textContent = 'Modo Claro ativo'; track.classList.remove('active');
  }
}

function toggleTema() {
  temaEscuro = !temaEscuro;
  document.documentElement.setAttribute('data-theme', temaEscuro ? 'dark' : 'light');
  atualizarIconeTema();
  toast(temaEscuro ? '🌙 Modo Escuro ativado' : '☀️ Modo Claro ativado');
}

function toggleConfig(wrap) { wrap.querySelector('.toggle-track').classList.toggle('active'); }

/* ============================================================
   CRUD — UPDATE & DELETE
   ============================================================ */
let crudIndex = -1;

function openEditar(idx) {
  const o = dados[idx]; if (!o) return; crudIndex = idx;
  document.getElementById('edit-tipo').value   = o.tipo   || '';
  document.getElementById('edit-end').value    = o.local  || '';
  document.getElementById('edit-desc').value   = o.desc   || '';
  document.getElementById('edit-urg').value    = o.urg    || 'Média';
  document.getElementById('edit-status').value = o.status || 'Aberto';
  document.getElementById('edit-info-text').textContent = `Editando: ${o.tipo} · ${o.local}`;
  document.getElementById('modal-editar').classList.add('open');
}

function closeEditar() { document.getElementById('modal-editar').classList.remove('open'); crudIndex = -1; }

function salvarEdicao() {
  if (crudIndex < 0 || crudIndex >= dados.length) return;
  const tipo   = document.getElementById('edit-tipo').value;
  const local  = document.getElementById('edit-end').value.trim();
  const desc   = document.getElementById('edit-desc').value.trim();
  const urg    = document.getElementById('edit-urg').value;
  const status = document.getElementById('edit-status').value;

  if (!tipo || !local) { toast('Preencha os dados!'); return; }
  dados[crudIndex] = { ...dados[crudIndex], tipo, local, desc, urg, status };
  closeEditar(); syncTudo(); toast('✅ Atualizada!');
}

function openConfirmDelete(idx) {
  const o = dados[idx]; if (!o) return; crudIndex = idx;
  document.getElementById('confirm-sub-text').innerHTML = `Deseja remover <strong>${sanitize(o.tipo)}</strong>?`;
  document.getElementById('confirm-delete').classList.add('open');
}

function closeConfirmDelete() { document.getElementById('confirm-delete').classList.remove('open'); crudIndex = -1; }

function confirmarDelete() {
  if (crudIndex < 0 || crudIndex >= dados.length) return;
  const cardEl = document.getElementById(`card-${crudIndex}`);
  if (cardEl) { cardEl.classList.add('removing'); cardEl.addEventListener('transitionend', () => cardEl.remove(), { once: true }); }
  dados.splice(crudIndex, 1); closeConfirmDelete(); setTimeout(() => syncTudo(), 380); toast(`🗑️ Removido!`);
}

/* ============================================================
   TOAST E RELÓGIO
   ============================================================ */
function toast(msg) {
  const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

function atualizarRelogio() {
  const n = new Date();
  document.getElementById('relogio').textContent = String(n.getHours()).padStart(2,'0') + ':' + String(n.getMinutes()).padStart(2,'0');
}
setInterval(atualizarRelogio, 30000); atualizarRelogio();

function atualizarContadores() {
  const n = dados.length;
  document.getElementById('alertCount').innerHTML = `<span>🔔 </span>${n} Alertas`;
  if(document.getElementById('mapaCount')) document.getElementById('mapaCount').textContent = n;
  if(document.getElementById('fullMapCount')) document.getElementById('fullMapCount').textContent = n;
  if(document.getElementById('recentesBadge')) document.getElementById('recentesBadge').textContent= n;

  if (document.getElementById('kpiAlta')) document.getElementById('kpiAlta').textContent = dados.filter(o => o.urg === 'Alta').length;
  if (document.getElementById('kpiResolvido')) document.getElementById('kpiResolvido').textContent  = dados.filter(o => o.status === 'Resolvido').length;
  if (document.getElementById('kpiAtend')) document.getElementById('kpiAtend').textContent      = dados.filter(o => o.status === 'Em atendimento').length;
}

/* ============================================================
   ROTA ATÉ A OCORRÊNCIA
   ============================================================ */
let rotaIndex = -1;
function abrirRota(idx) {
  const o = dados[idx]; if (!o) return; rotaIndex = idx;
  document.getElementById('rota-tipo').textContent   = o.tipo;
  document.getElementById('rota-local').textContent  = o.local;
  document.getElementById('rota-urg').textContent    = o.urg;
  document.getElementById('rota-urg').style.background = (BADGE_COR[o.urg] || BADGE_COR.Média).bg;
  document.getElementById('rota-urg').style.color = (BADGE_COR[o.urg] || BADGE_COR.Média).c;
  document.getElementById('rota-icon-wrap').style.background = (COR[o.tipo] || '#6b7280') + '22';
  document.getElementById('rota-icon-wrap').innerHTML = getIconColor(o.tipo);
  document.getElementById('modal-rota').classList.add('open');
}

function closeRota() { document.getElementById('modal-rota').classList.remove('open'); rotaIndex = -1; }

window.abrirGoogleMaps = function(idx) {
  const o = dados[idx ?? rotaIndex]; if (!o) return;
  const destino = `${o.lat},${o.lng}`;
  const abrirSoDestino = () => { window.open(`https://www.google.com/maps/dir/?api=1&destination=${destino}&travelmode=driving`, '_blank'); closeRota(); };
  if (!navigator.geolocation) { abrirSoDestino(); return; }
  toast('📡 Obtendo sua localização...');
  navigator.geolocation.getCurrentPosition(
    pos => { window.open(`https://www.google.com/maps/dir/?api=1&origin=${pos.coords.latitude},${pos.coords.longitude}&destination=${destino}&travelmode=driving`, '_blank'); closeRota(); },
    () => abrirSoDestino(), { timeout: 8000 }
  );
};

window.abrirWaze = function(idx) {
  const o = dados[idx ?? rotaIndex]; if (!o) return;
  const destino = `${o.lat},${o.lng}`;
  const abrirSemOrigem = () => { window.open(`https://waze.com/ul?ll=${destino}&navigate=yes&zoom=17`, '_blank'); closeRota(); };
  if (!navigator.geolocation) { abrirSemOrigem(); return; }
  toast('📡 Obtendo sua localização...');
  navigator.geolocation.getCurrentPosition(
    pos => { window.open(`https://waze.com/ul?ll=${destino}&navigate=yes&zoom=17&from=ll.${pos.coords.latitude},${pos.coords.longitude}`, '_blank'); closeRota(); },
    () => abrirSemOrigem(), { timeout: 8000 }
  );
};

window.abrirAppleMaps = function(idx) {
  const o = dados[idx]; if (!o) return;
  window.open(`http://maps.apple.com/?daddr=${o.lat},${o.lng}&dirflg=d`, '_blank'); closeRota();
};

window.copiarCoordenadas = function(idx) {
  const o = dados[idx]; if (!o) return;
  const texto = `${o.lat}, ${o.lng}`;
  if (navigator.clipboard) { navigator.clipboard.writeText(texto).then(() => toast('📋 Coordenadas copiadas!')); } 
  else { const el = document.createElement('textarea'); el.value = texto; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); toast('📋 Coordenadas copiadas!'); }
  closeRota();
};

/* ============================================================
   ASSISTENTE IA — VIA VERCEL BACKEND
   ============================================================ */

const SYSTEM_PROMPT = `Você é o Assistente de Monitoramento Urbano de Jaboatão dos Guararapes - PE, Brasil.
Seu foco exclusivo é: clima, prevenção de desastres, alagamentos, deslizamentos e emergências urbanas.

REGRAS:
- Responda SEMPRE em português brasileiro
- Seja direto, claro e acessível (linguagem simples)
- Priorize informações práticas e acionáveis
- Para emergências, sempre forneça telefones úteis:
  • Defesa Civil Jaboatão: (81) 3469-5701
  • SAMU: 192 | Bombeiros: 193 | Polícia: 190 | Defesa Civil Nacional: 199
- Se não souber algo específico local, oriente de forma geral mas mencione a Defesa Civil
- Respostas curtas e objetivas (máx. 200 palavras, exceto quando pedir detalhes)
- Use emojis com moderação para facilitar leitura
- Nunca responda sobre assuntos fora do escopo (política, entretenimento, etc.)
- Contexto: Jaboatão dos Guararapes fica na Região Metropolitana do Recife, área sujeita a chuvas intensas especialmente de março a agosto`;

let historicoChat = [];

/* ─────────────────────────────────────────
   COMUNICAÇÃO COM O BACKEND (VERCEL)
───────────────────────────────────────── */
async function chamarGemini(textoDoUsuario) {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ texto: textoDoUsuario })
    });

    const data = await response.json();

    if (!response.ok) {
      // Aqui pegamos o motivo REAL do erro para mostrar no console
      const motivo = data.detalhes ? JSON.stringify(data.detalhes) : data.error;
      throw new Error(`Erro retornado pelo servidor: ${motivo}`);
    }

    return data.text; 

  } catch (error) {
    console.error("Erro na API:", error);
    throw error;
  }
}

/* ─────────────────────────────────────────
   ESTILOS: O SEGREDO DO LAYOUT PERFEITO
───────────────────────────────────────── */
function configurarLayoutChat() {
  if (!document.getElementById('estilo-layout-chat')) {
    const estiloCss = document.createElement('style');
    estiloCss.id = 'estilo-layout-chat';
    estiloCss.innerHTML = `
      #view-chat:not([style*="display: none"]):not([style*="display:none"]) {
        display: flex !important;
        flex-direction: column !important;
        height: 100% !important;
      }
      #view-chat {
        box-sizing: border-box !important;
        padding-bottom: 75px !important; 
      }
      #chat-mensagens {
        flex: 1 1 auto !important;
        height: 0px !important; 
        max-height: none !important; 
        overflow-y: auto !important;
        overflow-x: hidden !important;
        padding-right: 5px !important;
      }
      #chat-rapidas, .chat-input-area, #chat-input-area {
        flex: 0 0 auto !important;
        margin-bottom: 5px !important;
      }
      #chat-mensagens::-webkit-scrollbar { width: 6px; }
      #chat-mensagens::-webkit-scrollbar-track { background: transparent; }
      #chat-mensagens::-webkit-scrollbar-thumb { background: #555555; border-radius: 10px; }
      #chat-mensagens::-webkit-scrollbar-thumb:hover { background: #777777; }
    `;
    document.head.appendChild(estiloCss);
  }
}

async function testarConexaoGemini() {
  configurarLayoutChat();
  setStatusChat('● Online', false); 
}

/* ─────────────────────────────────────────
   ENVIAR MENSAGEM E UI DO CHAT
───────────────────────────────────────── */
async function enviarMensagem() {
  const input = document.getElementById('chat-input');
  if (!input) return;

  const texto = input.value.trim();
  if (!texto) return;

  input.value = '';
  autoResize(input);

  adicionarMensagem(texto, 'usuario');
  ocultarPerguntasRapidas();

  const digitando = mostrarDigitando();
  const btnEnviar = document.getElementById('btn-enviar');
  if (btnEnviar) btnEnviar.disabled = true;
  setStatusChat('⏳ Digitando...', true);

  try {
    const resposta = await chamarGemini(texto);
    if (digitando.parentNode) digitando.remove(); 
    adicionarMensagem(resposta, 'bot');
  } catch (erro) {
    if (digitando.parentNode) digitando.remove();
    adicionarMensagem(obterMsgErro(erro), 'bot');
  } finally {
    if (btnEnviar) btnEnviar.disabled = false;
    setStatusChat('● Online', false);
  }
}

function obterMsgErro(erro) {
  const msg = erro?.message || '';
  if (msg.includes('abort') || msg.toLowerCase().includes('aborterror')) {
    return '⏱️ A resposta demorou muito. Verifique sua conexão e tente novamente.';
  }
  if (msg.includes('HTTP_400')) return '❌ Erro na requisição. Tente novamente.';
  if (msg.includes('HTTP_403') || msg.includes('API_KEY_INVALID') || msg.includes('API key')) return '🔑 Chave de API inválida no servidor.';
  if (msg.includes('HTTP_429')) return '⏳ Muitas requisições ao mesmo tempo. Aguarde alguns minutos.';
  if (msg.includes('HTTP_5') || msg.includes('Falha na conexão')) return '🔧 O serviço da IA está indisponível no momento (Erro no Servidor).';
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
    return '📡 Sem conexão com a internet.\nEmergências: Defesa Civil **(81) 3469-5701**';
  }
  return '⚠️ Erro inesperado. (' + msg + ')\nAjuda imediata: **(81) 3469-5701**';
}

function perguntaRapida(texto) {
  const input = document.getElementById('chat-input');
  if (input) { input.value = texto; autoResize(input); }
  enviarMensagem();
}

function adicionarMensagem(texto, tipo) {
  const container = document.getElementById('chat-mensagens');
  if (!container) return;

  const div = document.createElement('div');
  div.className = `msg ${tipo}`;
  div.style.wordBreak = 'break-word';

  const html = texto
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g,     '<em>$1</em>')
    .replace(/\n/g,             '<br>');

  div.innerHTML = `
    <span class="msg-avatar">${tipo === 'bot' ? '🤖' : '👤'}</span>
    <div class="msg-balao">${html}</div>
  `;

  container.appendChild(div);
  
  setTimeout(() => {
    container.scrollTop = container.scrollHeight;
  }, 50);

  if (tipo === 'bot') notificarBadgeChat();
}

function mostrarDigitando() {
  const container = document.getElementById('chat-mensagens');
  if (!container) return { remove: () => {} };

  const div = document.createElement('div');
  div.className = 'msg bot msg-digitando';
  div.innerHTML = `
    <span class="msg-avatar">🤖</span>
    <div class="msg-balao">
      <span class="dots"><span>●</span><span>●</span><span>●</span></span>
    </div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

function ocultarPerguntasRapidas() {
  const el = document.getElementById('chat-rapidas');
  if (el) el.style.display = 'none';
}

function setStatusChat(texto, digitando) {
  const el = document.getElementById('chat-status');
  if (!el) return;
  el.textContent = texto;
  el.className   = 'chat-status' + (digitando ? ' digitando' : '');
}

function chatKeyDown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    enviarMensagem();
  }
}

function autoResize(el) {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
}

function notificarBadgeChat() {
  const viewChat = document.getElementById('view-chat');
  const oculto   = !viewChat || viewChat.style.display === 'none' || viewChat.style.display === '';
  if (oculto) {
    document.getElementById('nav-chat')?.classList.add('has-badge');
  }
}

// INICIALIZAÇÃO DO APP
document.addEventListener('DOMContentLoaded', () => {
    syncTudo();
    testarConexaoGemini();
});



