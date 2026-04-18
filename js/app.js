/* ============================================================
   MONITOR URBANO — app.js (COMPLETO + CRUD)
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
   RENDER LISTA — única definição (com CRUD)
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="oc-btn-delete" title="Remover" onclick="openConfirmDelete(${idxReal})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5">
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
  const b = BADGE_COR[o.urg] || BADGE_COR.Média;
  return `
    <div style="font-family:'Sora',sans-serif;min-width:190px;">
      <b style="font-size:13px;color:#1a1a2e;">${sanitize(o.tipo)}</b><br>
      <span style="font-size:11px;color:#8B7CA8;">${sanitize(o.local)}</span>
      ${o.desc ? `<span style="font-size:11px;color:#555;display:block;margin-top:4px;">${sanitize(o.desc)}</span>` : ''}
      <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:10px;color:#8B7CA8;">${sanitize(o.tempo)}</span>
        <span style="font-size:10px;font-weight:700;padding:3px 8px;border-radius:10px;
          background:${b.bg};color:${b.c};">${sanitize(o.urg)}</span>
      </div>
      <div style="display:flex;gap:6px;margin-top:10px;">
        <button onclick="editarDoMapa(${idx})"
          style="flex:1;padding:6px;border-radius:8px;border:none;
                 background:#EDE9FE;color:#7B2FBE;font-family:Sora,sans-serif;
                 font-size:11px;font-weight:600;cursor:pointer;">
          ✏️ Editar
        </button>
        <button onclick="deletarDoMapa(${idx})"
          style="flex:1;padding:6px;border-radius:8px;border:none;
                 background:#fee2e2;color:#dc2626;font-family:Sora,sans-serif;
                 font-size:11px;font-weight:600;cursor:pointer;">
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

/* ── Filtros e busca ── */
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

function filtrarMapaFull(tipo) {
  document.querySelectorAll('#chips-full .chip').forEach(c => {
    c.className = 'chip ' + (c.dataset.t === tipo ? 'on' : 'off');
  });
  const lista = tipo === 'Todos' ? dados : dados.filter(o => o.tipo === tipo);
  renderMarcadoresFull(lista);
  document.getElementById('fullMapCount').textContent = lista.length;
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

/* ── Funções globais para popup (onclick inline) ── */
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

/* ── Zonas de risco ── */
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
   NAVEGAÇÃO
   ============================================================ */
const VIEWS   = ['view-home','view-lista','view-mapa','view-mapa-full'];
const NAV_IDS = {
  'view-home':'nav-home','view-lista':'nav-bell',
  'view-mapa':'nav-map', 'view-mapa-full':'nav-map'
};

function goTo(id) {
  VIEWS.forEach(v => {
    const el = document.getElementById(v);
    if (!el) return;
    el.style.display = 'none';
    el.classList.remove('open');
  });
  const target = document.getElementById(id);
  if (!target) return;

  if (id === 'view-mapa' || id === 'view-mapa-full') {
    target.style.display = '';
    target.classList.add('open');
    if (id === 'view-mapa')      iniciarMapa();
    if (id === 'view-mapa-full') {
      iniciarMapaFull();
      document.getElementById('fullMapCount').textContent = dados.length;
    }
  } else {
    target.style.display = 'block';
  }

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const nav = document.getElementById(NAV_IDS[id]);
  if (nav) nav.classList.add('active');
}

/* ── Recentes dropdown ── */
let recentesAberto = false;
function toggleRecentes() {
  recentesAberto = !recentesAberto;
  const lista = document.getElementById('listaHome');
  const seta  = document.getElementById('recentesArrow');
  lista.style.display = recentesAberto ? 'flex' : 'none';
  seta.classList.toggle('open', recentesAberto);
}

/* ============================================================
   GRÁFICO
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
   GEOCODING
   ============================================================ */
async function obterCoordenadasEndereco(endereco) {
  try {
    const query = encodeURIComponent(endereco + ', Jaboatão dos Guararapes, PE, Brasil');
    const resp  = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
      { headers: { 'Accept-Language': 'pt-BR' } }
    );
    const result = await resp.json();
    if (result?.length > 0)
      return { lat: parseFloat(result[0].lat), lng: parseFloat(result[0].lon), encontrado: true };
  } catch (e) { console.warn('Geocoding falhou:', e); }
  return {
    lat: -8.1128 + (Math.random()-0.5)*0.018,
    lng: -34.9092 + (Math.random()-0.5)*0.018,
    encontrado: false
  };
}

/* ============================================================
   MODAL RELATAR
   ============================================================ */
function openRelatar()  { document.getElementById('modal-relatar').classList.add('open'); }
function closeRelatar() { document.getElementById('modal-relatar').classList.remove('open'); }

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
  btn.textContent = '📍 Buscando localização...';
  btn.disabled = true;

  const coords = await obterCoordenadasEndereco(end);
  dados.unshift({
    tipo, local: end, desc: desc||'', tempo: 'Agora',
    urg, status: 'Aberto', lat: coords.lat, lng: coords.lng
  });

  syncTudo();
  closeRelatar();
  document.getElementById('tipo-select').value = '';
  document.getElementById('end-input').value   = '';
  document.getElementById('desc-input').value  = '';
  btn.textContent = 'Enviar Ocorrência';
  btn.disabled    = false;
  enviando        = false;

  toast(coords.encontrado ? `✅ ${tipo} marcado no mapa!` : `✅ Registrado! Pin posicionado aproximadamente.`);

  setTimeout(() => {
    goTo('view-mapa');
    setTimeout(() => {
      if (mapa && mapaReady) {
        mapa.setView([coords.lat, coords.lng], 16);
        if (marcadores.length > 0) marcadores[0].openPopup();
      }
    }, 400);
  }, 600);
}

function atualizarContadores() {
  const n = dados.length;
  document.getElementById('alertCount').innerHTML     = `<span>🔔 </span>${n} Alertas`;
  document.getElementById('mapaCount').textContent    = n;
  document.getElementById('fullMapCount').textContent = n;
  document.getElementById('recentesBadge').textContent= n;
}

/* ============================================================
   MODAIS DIVERSOS
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
  document.getElementById('vistoria-tipo').value = '';
  document.getElementById('vistoria-end').value  = '';
  document.getElementById('vistoria-desc').value = '';
  toast('Vistoria solicitada! 🔍');
}

/* ── Config / Tema ── */
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
    wrap.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="20" height="20"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    wrap.style.background = '#1e1a30'; wrap.style.border = '1.5px solid #6d3fa8';
    label.textContent = 'Modo Escuro ativo'; track.classList.add('active');
  } else {
    wrap.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    wrap.style.background = '#d97706'; wrap.style.border = 'none';
    label.textContent = 'Modo Claro ativo'; track.classList.remove('active');
  }
}

function toggleTema() {
  temaEscuro = !temaEscuro;
  document.documentElement.setAttribute('data-theme', temaEscuro ? 'dark' : 'light');
  atualizarIconeTema();
  toast(temaEscuro ? '🌙 Modo Escuro ativado' : '☀️ Modo Claro ativado');
}

function toggleConfig(wrap) {
  wrap.querySelector('.toggle-track').classList.toggle('active');
}

/* ============================================================
   CRUD — UPDATE (Editar)
   ============================================================ */
let crudIndex = -1;

function openEditar(idx) {
  const o = dados[idx];
  if (!o) return;
  crudIndex = idx;
  document.getElementById('edit-tipo').value   = o.tipo   || '';
  document.getElementById('edit-end').value    = o.local  || '';
  document.getElementById('edit-desc').value   = o.desc   || '';
  document.getElementById('edit-urg').value    = o.urg    || 'Média';
  document.getElementById('edit-status').value = o.status || 'Aberto';
  document.getElementById('edit-info-text').textContent = `Editando: ${o.tipo} · ${o.local}`;
  document.getElementById('modal-editar').classList.add('open');
}

function closeEditar() {
  document.getElementById('modal-editar').classList.remove('open');
  crudIndex = -1;
}

function salvarEdicao() {
  if (crudIndex < 0 || crudIndex >= dados.length) {
    toast('⚠️ Ocorrência não encontrada.'); return;
  }
  const tipo   = document.getElementById('edit-tipo').value;
  const local  = document.getElementById('edit-end').value.trim();
  const desc   = document.getElementById('edit-desc').value.trim();
  const urg    = document.getElementById('edit-urg').value;
  const status = document.getElementById('edit-status').value;

  if (!tipo)  { toast('Selecione o tipo!');   return; }
  if (!local) { toast('Informe o endereço!'); return; }

  dados[crudIndex] = { ...dados[crudIndex], tipo, local, desc, urg, status };

  closeEditar();
  syncTudo();
  toast('✅ Ocorrência atualizada!');
}

/* ============================================================
   CRUD — DELETE (Remover)
   ============================================================ */
function openConfirmDelete(idx) {
  const o = dados[idx];
  if (!o) return;
  crudIndex = idx;
  document.getElementById('confirm-sub-text').innerHTML =
    `Deseja remover <strong>${sanitize(o.tipo)}</strong> em <strong>${sanitize(o.local)}</strong>?
     <br><span style="color:#dc2626;font-size:11px;">Esta ação não pode ser desfeita.</span>`;
  document.getElementById('confirm-delete').classList.add('open');
}

function closeConfirmDelete() {
  document.getElementById('confirm-delete').classList.remove('open');
  crudIndex = -1;
}

function confirmarDelete() {
  if (crudIndex < 0 || crudIndex >= dados.length) return;

  const o      = dados[crudIndex];
  const cardEl = document.getElementById(`card-${crudIndex}`);

  /* Animação de saída */
  if (cardEl) {
    cardEl.classList.add('removing');
    cardEl.addEventListener('transitionend', () => cardEl.remove(), { once: true });
  }

  dados.splice(crudIndex, 1);
  closeConfirmDelete();
  setTimeout(() => syncTudo(), 380);
  toast(`🗑️ ${sanitize(o.tipo)} removido!`);
}

/* ============================================================
   TOAST & RELÓGIO
   ============================================================ */
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

function atualizarRelogio() {
  const n = new Date();
  document.getElementById('relogio').textContent =
    String(n.getHours()).padStart(2,'0') + ':' + String(n.getMinutes()).padStart(2,'0');
}
setInterval(atualizarRelogio, 30000);
atualizarRelogio();

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
renderLista(dados, 'listaHome');
renderLista(dados, 'listaTodas');
renderChart();
function atualizarContadores() {
  const n = dados.length;
  document.getElementById('alertCount').innerHTML = `<span>🔔 </span>${n} Alertas`;
  document.getElementById('mapaCount').textContent    = n;
  document.getElementById('fullMapCount').textContent = n;
  document.getElementById('recentesBadge').textContent= n;

  // KPI Strip
  const kpiAlta     = document.getElementById('kpiAlta');
  const kpiResolvido= document.getElementById('kpiResolvido');
  const kpiAtend    = document.getElementById('kpiAtend');
  if (kpiAlta)      kpiAlta.textContent      = dados.filter(o => o.urg === 'Alta').length;
  if (kpiResolvido) kpiResolvido.textContent  = dados.filter(o => o.status === 'Resolvido').length;
  if (kpiAtend)     kpiAtend.textContent      = dados.filter(o => o.status === 'Em atendimento').length;
}
;
atualizarIconeTema();
