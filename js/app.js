/* ============================================================
   MONITOR URBANO — app.js (COMPLETO + CORRIGIDO v2.0)
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

/* ============================================================
   MELHORIA #9 — SVG UNIFICADO (elimina duplicação)
   ============================================================ */
function gerarSvgTipo(tipo, cor = 'white', strokeWidth = 2.5) {
  const sw = strokeWidth;
  const icones = {
    Alagamento: `<svg viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="${sw}"><path d="M2 20c2-2 4 0 6 0s4-2 6 0 4 2 6 0"/><path d="M2 14c2-2 4 0 6 0s4-2 6 0 4 2 6 0"/></svg>`,
    Barreira:   `<svg viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="${sw}"><rect x="2" y="9" width="20" height="6" rx="2"/><line x1="7" y1="9" x2="7" y2="15"/><line x1="12" y1="9" x2="12" y2="15"/></svg>`,
    Lixo:       `<svg viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="${sw}"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>`,
    Outros:     `<svg viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="${sw}"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    Buraco:     `<svg viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="${sw}"><ellipse cx="12" cy="16" rx="8" ry="4"/><path d="M4 12c0-2.2 3.6-4 8-4s8 1.8 8 4"/></svg>`,
    Iluminação: `<svg viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="${sw}"><line x1="12" y1="2" x2="12" y2="6"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="18" x2="12" y2="22"/></svg>`,
  };
  return icones[tipo] || icones.Outros;
}

/* Mantém compatibilidade com código que usa getIconColor() e criarIcone() */
function getIconColor(tipo) {
  return gerarSvgTipo(tipo, COR[tipo] || '#6b7280', 2);
}

function getSvgBranco(tipo) {
  return gerarSvgTipo(tipo, 'white', 2.5);
}

/* ── Utilitários ── */
function sanitize(str = '') {
  const el = document.createElement('div');
  el.textContent = String(str);
  return el.innerHTML;
}

/* ============================================================
   MELHORIA #6 — PERSISTÊNCIA COM localStorage
   ============================================================ */
function salvarDados() {
  try {
    // Salva sem a imagem base64 para não estourar o limite do localStorage (~5MB)
    const dadosParaSalvar = dados.map(o => {
      const { imagem, ...resto } = o;
      return resto;
    });
    localStorage.setItem('monitorUrbano_dados', JSON.stringify(dadosParaSalvar));
  } catch (e) {
    console.warn('localStorage indisponível ou cheio:', e.message);
  }
}

function carregarDadosSalvos() {
  try {
    const raw = localStorage.getItem('monitorUrbano_dados');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        dados.splice(0, dados.length, ...parsed);
        console.log(`[Storage] ${parsed.length} ocorrências carregadas.`);
      }
    }
  } catch (e) {
    console.warn('Erro ao carregar dados salvos:', e.message);
  }
}

/* ============================================================
   SINCRONIZAÇÃO GLOBAL (CRUD)
   ============================================================ */
function syncTudo() {
  salvarDados(); // MELHORIA #6 — persiste a cada mudança
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
          ${o.imagem ? `<img src="${o.imagem}" style="width:100%;height:130px;object-fit:cover;border-radius:8px;margin-top:10px;border:1px solid #e2e8f0;display:block;">` : ''}
          <span class="oc-status ${stCls}" style="margin-top:${o.imagem ? '10px' : '4px'};display:inline-block;">${sanitize(status)}</span>
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
          <div style="font-size:13px;font-weight:800;color:#0D1B3E;">${sanitize(o.tipo)}</div>
          <div style="font-size:10px;color:#5A6A8A;margin-top:1px;">${sanitize(o.local)}</div>
        </div>
      </div>
      ${o.imagem ? `<img src="${o.imagem}" style="width:100%;height:110px;object-fit:cover;border-radius:8px;margin-bottom:8px;border:1px solid rgba(0,0,0,0.08);">` : ''}
      ${o.desc ? `<div style="font-size:11px;color:#5A6A8A;margin-bottom:8px;padding:6px 8px;background:#F5F7FF;border-radius:8px;line-height:1.4;">${sanitize(o.desc)}</div>` : ''}
      <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">
        <span style="font-size:10px;font-weight:800;padding:3px 8px;border-radius:10px;background:${b.bg};color:${b.c};">${sanitize(o.urg)}</span>
        <span style="font-size:10px;font-weight:800;padding:3px 8px;border-radius:10px;${stCls}">${sanitize(o.status||'Aberto')}</span>
        <span style="font-size:10px;color:#8B9DB5;margin-left:auto;align-self:center;">${sanitize(o.tempo)}</span>
      </div>
      <div style="height:1px;background:rgba(27,79,204,0.10);margin-bottom:10px;"></div>
      <button onclick="abrirRota(${idx})"
        style="width:100%;padding:9px;border-radius:10px;border:none;
               background:linear-gradient(135deg,#0F2D7A,#2E6EF7);
               color:white;font-family:Sora,sans-serif;font-size:12px;font-weight:800;cursor:pointer;
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
  const svg = getSvgBranco(tipo); // MELHORIA #9 — usa função unificada
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
  { coords:[[-8.1100,-34.9120],[-8.1080,-34.9100],[-8.1060,-34.9130]], nivel:'Alto',  tipo:'Alagamento',  bairro:'Cajueiro Seco' },
  { coords:[[-8.1200,-34.9050],[-8.1180,-34.9030],[-8.1160,-34.9060]], nivel:'Médio', tipo:'Deslizamento', bairro:'Prazeres'      },
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
const VIEWS = ['view-home','view-lista','view-mapa','view-mapa-full','view-chat','view-alertas-chuva'];

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
    if (el) { el.style.display = 'none'; el.classList.remove('open'); }
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
  } else if (viewId === 'view-alertas-chuva') {
    target.style.display = 'block';
    carregarDadosChuva();
  } else {
    target.style.display = 'block';
  }

  const navId = NAV_MAP[viewId];
  if (navId) {
    const navEl = document.getElementById(navId);
    if (navEl) navEl.classList.add('active');
  }

  if (viewId === 'view-mapa' && window.mapa) setTimeout(() => window.mapa.invalidateSize(), 100);
  if (viewId === 'view-mapa-full' && window.mapaFull) setTimeout(() => window.mapaFull.invalidateSize(), 100);
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
   GEOCODING + CEP
   ============================================================ */
const CIDADE_PADRAO = 'Jaboatão dos Guararapes';
const LAT_CENTRO    = -8.1128;
const LNG_CENTRO    = -34.9092;

let autocompleteTimer = null;

function initAutocomplete() {
  const input = document.getElementById('end-input');
  if (!input) return;
  input.addEventListener('input', function () {
    clearTimeout(autocompleteTimer);
    const val = this.value.trim();
    if (val.length < 4) { esconderSugestoes(); esconderPreviewCEP(); return; }
    autocompleteTimer = setTimeout(() => buscarSugestoes(val), 600);
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#end-input') && !e.target.closest('#sugestoes-lista')) esconderSugestoes();
  });
}

async function buscarSugestoes(query) {
  try {
    const params = new URLSearchParams({
      format: 'json', q: `${query}, ${CIDADE_PADRAO}, PE, Brasil`,
      limit: '5', countrycodes: 'br', 'accept-language': 'pt-BR', addressdetails: '1',
    });
    const resp = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: { 'User-Agent': 'MonitorUrbanoJaboatao/1.0' }
    });
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
      position:absolute;z-index:99999;background:var(--surface);border-radius:12px;
      box-shadow:0 8px 32px rgba(15,45,122,0.18);border:1.5px solid var(--border-strong);
      overflow:hidden;max-height:220px;overflow-y:auto;scrollbar-width:none;width:100%;`;
    const formGroup = document.getElementById('end-input').parentNode;
    formGroup.style.position = 'relative';
    formGroup.appendChild(lista);
  }
  if (!resultados || resultados.length === 0) {
    lista.innerHTML = `<div style="padding:12px 14px;font-size:12px;color:var(--text-muted);">Nenhum resultado encontrado</div>`;
    lista.style.display = 'block';
    return;
  }
  lista.innerHTML = resultados.map((r) => {
    const partes = r.display_name.split(',').slice(0, 3).map(p => p.trim());
    const titulo = partes[0] || r.display_name;
    const sub    = partes.slice(1).join(', ');
    const cep    = r.address?.postcode || '';
    return `
      <div class="sugestao-item" onclick="selecionarSugestao('${sanitize(titulo).replace(/'/g,"\\'")}','${r.lat}','${r.lon}','${sanitize(cep)}')"
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

function esconderSugestoes() {
  const lista = document.getElementById('sugestoes-lista');
  if (lista) lista.style.display = 'none';
}

async function mostrarPreviewCEP(cep, endereco) {
  let preview = document.getElementById('end-preview');
  if (!preview) {
    preview = document.createElement('div');
    preview.id = 'end-preview';
    document.getElementById('end-input').parentNode.appendChild(preview);
  }
  preview.style.cssText = `display:flex;align-items:center;gap:8px;padding:8px 12px;margin-top:6px;background:var(--brand-pale);border-radius:10px;border:1px solid var(--border-strong);font-size:11px;font-weight:600;color:var(--brand);`;
  preview.innerHTML = `📮 CEP <strong>${cep}</strong> — endereço localizado <span style="margin-left:auto;color:var(--success);font-size:10px;">✅ Exato</span>`;
}

function esconderPreviewCEP() {
  const preview = document.getElementById('end-preview');
  if (preview) preview.style.display = 'none';
}

async function obterCoordenadasEndereco(enderecoRaw) {
  const input = document.getElementById('end-input');
  if (input && input.dataset.lat) {
    return { lat: parseFloat(input.dataset.lat), lng: parseFloat(input.dataset.lng), cep: input.dataset.cep || null, precisao: 'exata' };
  }
  return { lat: LAT_CENTRO, lng: LNG_CENTRO, cep: null, precisao: 'fallback' };
}

/* ============================================================
   SISTEMA DE FOTOS
   ============================================================ */
let fotoAtualBase64 = null;

// ✅ SUBSTITUIR PELO BLOCO ABAIXO:

/* ============================================================
   COMPRESSÃO DE IMAGEM — reduz ~70% do tamanho antes de salvar
   ============================================================ */
async function comprimirImagem(base64, maxWidth = 800, qualidade = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;

    img.onload = () => {
      const canvas  = document.createElement('canvas');
      const ratio   = Math.min(maxWidth / img.width, 1); // nunca aumenta, só reduz
      canvas.width  = Math.round(img.width  * ratio);
      canvas.height = Math.round(img.height * ratio);

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL('image/jpeg', qualidade));
    };

    img.onerror = () => {
      // Se falhar a compressão, retorna a imagem original sem travar o app
      console.warn('[Foto] Falha ao comprimir, usando original.');
      resolve(base64);
    };
  });
}

window.prepararFoto = async function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const btnRemover = document.getElementById('btn-remover-foto');
  const preview    = document.getElementById('foto-preview');

  // Feedback visual imediato enquanto comprime
  if (preview) {
    preview.style.opacity  = '0.4';
    preview.style.display  = 'block';
  }

  const reader = new FileReader();

  reader.onload = async function(e) {
    try {
      // ✅ Comprime antes de salvar (reduz ~70% do tamanho)
      fotoAtualBase64 = await comprimirImagem(e.target.result, 800, 0.7);

      if (preview) {
        preview.src           = fotoAtualBase64;
        preview.style.opacity = '1'; // restaura opacidade após comprimir
        preview.style.display = 'block';
      }
      if (btnRemover) btnRemover.style.display = 'block';

      // Mostra o tamanho economizado no toast
      const originalKB  = Math.round(e.target.result.length  / 1024);
      const comprimidoKB = Math.round(fotoAtualBase64.length / 1024);
      const economia     = Math.round((1 - comprimidoKB / originalKB) * 100);

      if (economia > 0) {
        toast(`📸 Foto comprimida! Economia de ${economia}% (${originalKB}KB → ${comprimidoKB}KB)`);
      } else {
        toast('📸 Foto adicionada!');
      }

    } catch (err) {
      console.error('[Foto] Erro inesperado:', err);
      // Fallback: usa a foto original sem comprimir
      fotoAtualBase64 = e.target.result;
      if (preview) { preview.src = fotoAtualBase64; preview.style.opacity = '1'; }
      if (btnRemover) btnRemover.style.display = 'block';
      toast('📸 Foto adicionada (sem compressão).');
    }
  };

  reader.onerror = () => toast('❌ Erro ao ler a foto. Tente novamente.');
  reader.readAsDataURL(file);
};

window.removerFoto = function() {
  fotoAtualBase64 = null;
  const preview = document.getElementById('foto-preview');
  const btn     = document.getElementById('btn-remover-foto');
  const input   = document.getElementById('foto-input');
  if (preview) { preview.style.display = 'none'; preview.src = ''; }
  if (btn)     btn.style.display = 'none';
  if (input)   input.value = '';
};

function injetarBotaoFoto() {
  if (document.getElementById('foto-container')) return;
  const descInput = document.getElementById('desc-input');
  if (!descInput) return;

  const container = document.createElement('div');
  container.id = 'foto-container';
  container.style.marginTop = '12px';
  container.innerHTML = `
    <input type="file" id="foto-input" accept="image/*" capture="environment" style="display:none;" onchange="prepararFoto(event)">
    <button type="button" onclick="document.getElementById('foto-input').click()"
      style="width:100%;padding:12px;border-radius:10px;border:1.5px dashed #2E6EF7;background:#F5F7FF;color:#0F2D7A;
             font-family:'Sora',sans-serif;font-size:13px;font-weight:700;cursor:pointer;
             display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
      Tirar Foto na Hora
    </button>
    <div style="position:relative;">
      <img id="foto-preview" style="display:none;width:100%;height:160px;object-fit:cover;border-radius:10px;margin-top:10px;border:1px solid #E2E8F0;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
      <button id="btn-remover-foto" type="button" onclick="removerFoto()"
        style="display:none;position:absolute;top:18px;right:8px;background:#dc2626;color:white;border:none;border-radius:50%;width:30px;height:30px;cursor:pointer;font-size:14px;font-weight:bold;box-shadow:0 2px 8px rgba(0,0,0,0.4);">X</button>
    </div>`;
  descInput.insertAdjacentElement('afterend', container);
}

/* ============================================================
   MODAL RELATAR
   ============================================================ */
function openRelatar() {
  document.getElementById('modal-relatar').classList.add('open');
  initAutocomplete();
  injetarBotaoFoto();
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
  btn.disabled  = true;

  try {
    const coords     = await obterCoordenadasEndereco(end);
    const endExibido = coords.cep ? `${end} — CEP ${coords.cep}` : end;

    dados.unshift({
      tipo, local: end, localCompleto: endExibido, desc: desc || '',
      tempo: 'Agora', urg, status: 'Aberto',
      lat: coords.lat, lng: coords.lng, cep: coords.cep,
      imagem: fotoAtualBase64
    });

    syncTudo();
    closeRelatar();

    document.getElementById('tipo-select').value = '';
    document.getElementById('end-input').value   = '';
    document.getElementById('desc-input').value  = '';
    delete document.getElementById('end-input').dataset.lat;
    delete document.getElementById('end-input').dataset.lng;
    if (typeof removerFoto === 'function') removerFoto();

    toast(`✅ ${tipo} registrado com sucesso!`);

    setTimeout(() => {
      goTo('view-mapa');
      setTimeout(() => {
        if (mapa && mapaReady) {
          mapa.setView([coords.lat, coords.lng], 17);
          if (marcadores.length > 0) marcadores[0].openPopup();
        }
      }, 450);
    }, 700);

  } catch (err) {
    // MELHORIA #10 — erros mais descritivos
    console.error('Erro no submitRelatar:', err);
    if (!navigator.onLine) {
      toast('📡 Sem conexão com internet. Verifique sua rede.');
    } else if (err.message?.includes('geocod') || err.message?.includes('coordenada')) {
      toast('📍 Endereço não encontrado. Verifique e tente novamente.');
    } else {
      toast('❌ Erro ao registrar. Tente novamente.');
    }
  } finally {
    btn.innerHTML = 'Enviar Ocorrência';
    btn.disabled  = false;
    enviando      = false;
  }
}

/* ============================================================
   MELHORIA #2 — ALERTA SEVERO (padronizado com style.display)
   ============================================================ */
function simularAlertaSevero() {
  const modal = document.getElementById('modal-alerta-severo');
  if (modal) modal.style.display = 'flex'; // ✅ padronizado

  const som = document.getElementById('somDefesaCivil');
  if (som) { som.currentTime = 0; som.play().catch(e => console.log('Áudio bloqueado', e)); }

  if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 800, 200, 500]);
}

function fecharAlertaSevero() {
  const modal = document.getElementById('modal-alerta-severo');
  if (modal) modal.style.display = 'none'; // ✅ padronizado

  const som = document.getElementById('somDefesaCivil');
  if (som) { som.pause(); som.currentTime = 0; }

  if (navigator.vibrate) navigator.vibrate(0);

  goTo('view-alertas-chuva');
}

/* ============================================================
   LÓGICA DO ALERTA AUTOMÁTICO
   ============================================================ */
let alertaAutoTimeout = null;
let alertaAutoAtivo   = false;

function toggleAlertaAutomatico(element) {
  const track = element.querySelector('.toggle-track');
  track.classList.toggle('active');
  alertaAutoAtivo = track.classList.contains('active');

  if (alertaAutoAtivo) {
    toast('⏰ Simulação ativada! Alertas a cada 5~20s.');
    agendarProximoAlerta();
  } else {
    toast('🛑 Simulação desativada.');
    clearTimeout(alertaAutoTimeout);
  }
}

function agendarProximoAlerta() {
  if (!alertaAutoAtivo) return;
  const tempoSorteado = Math.floor(Math.random() * (20000 - 5000 + 1)) + 5000;
  alertaAutoTimeout = setTimeout(() => {
    if (alertaAutoAtivo) {
      simularAlertaSevero();
      agendarProximoAlerta();
    }
  }, tempoSorteado);
}

function toggleVisibilidadeBotao(element) {
  const track  = element.querySelector('.toggle-track');
  track.classList.toggle('active');
  const estaAtivo = track.classList.contains('active');
  const btnWrap   = document.getElementById('btn-simular-wrap');
  if (btnWrap) btnWrap.style.display = estaAtivo ? 'flex' : 'none';
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
  document.getElementById('vistoria-tipo').value = '';
  document.getElementById('vistoria-end').value  = '';
  document.getElementById('vistoria-desc').value = '';
  toast('Vistoria solicitada! 🔍');
}

let temaEscuro = false;

function openConfig()  { atualizarIconeTema(); document.getElementById('modal-config').classList.add('open'); }
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
   MELHORIA #7 — Foto preservada ao editar
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

  // MELHORIA #7 — carrega foto existente na edição
  fotoAtualBase64 = o.imagem || null;
  injetarBotaoFotoEdicao();

  const preview    = document.getElementById('foto-preview-edit');
  const btnRemover = document.getElementById('btn-remover-foto-edit');
  if (preview) {
    if (o.imagem) {
      preview.src           = o.imagem;
      preview.style.display = 'block';
      if (btnRemover) btnRemover.style.display = 'block';
    } else {
      preview.style.display = 'none';
      if (btnRemover) btnRemover.style.display = 'none';
    }
  }

  document.getElementById('modal-editar').classList.add('open');
}

function injetarBotaoFotoEdicao() {
  if (document.getElementById('foto-container-edit')) return;
  const descInput = document.getElementById('edit-desc');
  if (!descInput) return;

  const container = document.createElement('div');
  container.id = 'foto-container-edit';
  container.style.marginTop = '12px';
  container.innerHTML = `
    <input type="file" id="foto-input-edit" accept="image/*" capture="environment" style="display:none;"
           onchange="prepararFotoEdicao(event)">
    <button type="button" onclick="document.getElementById('foto-input-edit').click()"
      style="width:100%;padding:10px;border-radius:10px;border:1.5px dashed #2E6EF7;background:#F5F7FF;color:#0F2D7A;
             font-family:'Sora',sans-serif;font-size:12px;font-weight:700;cursor:pointer;
             display:flex;align-items:center;justify-content:center;gap:8px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
      Alterar / Adicionar Foto
    </button>
    <div style="position:relative;">
      <img id="foto-preview-edit" style="display:none;width:100%;height:130px;object-fit:cover;border-radius:10px;margin-top:10px;border:1px solid #E2E8F0;">
      <button id="btn-remover-foto-edit" type="button" onclick="removerFotoEdicao()"
        style="display:none;position:absolute;top:18px;right:8px;background:#dc2626;color:white;border:none;border-radius:50%;width:28px;height:28px;cursor:pointer;font-size:13px;font-weight:bold;">X</button>
    </div>`;
  descInput.insertAdjacentElement('afterend', container);
}

window.prepararFotoEdicao = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    fotoAtualBase64 = e.target.result;
    const preview    = document.getElementById('foto-preview-edit');
    const btnRemover = document.getElementById('btn-remover-foto-edit');
    if (preview) { preview.src = fotoAtualBase64; preview.style.display = 'block'; }
    if (btnRemover) btnRemover.style.display = 'block';
  };
  reader.readAsDataURL(file);
};

window.removerFotoEdicao = function() {
  fotoAtualBase64 = null;
  const preview    = document.getElementById('foto-preview-edit');
  const btn        = document.getElementById('btn-remover-foto-edit');
  const input      = document.getElementById('foto-input-edit');
  if (preview) { preview.style.display = 'none'; preview.src = ''; }
  if (btn)     btn.style.display = 'none';
  if (input)   input.value = '';
};

function closeEditar() {
  document.getElementById('modal-editar').classList.remove('open');
  // Remove o container de foto injetado para reinjetar limpo na próxima abertura
  const fc = document.getElementById('foto-container-edit');
  if (fc) fc.remove();
  crudIndex = -1;
}

function salvarEdicao() {
  if (crudIndex < 0 || crudIndex >= dados.length) return;
  const tipo   = document.getElementById('edit-tipo').value;
  const local  = document.getElementById('edit-end').value.trim();
  const desc   = document.getElementById('edit-desc').value.trim();
  const urg    = document.getElementById('edit-urg').value;
  const status = document.getElementById('edit-status').value;

  if (!tipo || !local) { toast('Preencha os dados!'); return; }

  // MELHORIA #7 — preserva / atualiza foto
  dados[crudIndex] = { ...dados[crudIndex], tipo, local, desc, urg, status, imagem: fotoAtualBase64 };

  closeEditar();
  syncTudo();
  toast('✅ Atualizada!');
}

function openConfirmDelete(idx) {
  const o = dados[idx]; if (!o) return; crudIndex = idx;
  document.getElementById('confirm-sub-text').innerHTML = `Deseja remover <strong>${sanitize(o.tipo)}</strong>?`;
  document.getElementById('confirm-delete').classList.add('open');
}

function closeConfirmDelete() {
  document.getElementById('confirm-delete').classList.remove('open');
  crudIndex = -1;
}

function confirmarDelete() {
  if (crudIndex < 0 || crudIndex >= dados.length) return;
  const cardEl = document.getElementById(`card-${crudIndex}`);
  if (cardEl) {
    cardEl.classList.add('removing');
    cardEl.addEventListener('transitionend', () => cardEl.remove(), { once: true });
  }
  dados.splice(crudIndex, 1);
  closeConfirmDelete();
  setTimeout(() => syncTudo(), 380);
  toast(`🗑️ Removido!`);
}

/* ============================================================
   TOAST E RELÓGIO
   MELHORIA #8 — relógio atualiza a cada 10s (era 30s)
   ============================================================ */
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

function atualizarRelogio() {
  const n = new Date();
  const el = document.getElementById('relogio');
  if (el) el.textContent =
    String(n.getHours()).padStart(2,'0') + ':' + String(n.getMinutes()).padStart(2,'0');
}
setInterval(atualizarRelogio, 10000); // MELHORIA #8 — era 30000
atualizarRelogio();

function atualizarContadores() {
  const n = dados.length;
  const alertCount = document.getElementById('alertCount');
  if (alertCount) alertCount.innerHTML = `<span>🔔 </span>${n} Alertas`;
  if (document.getElementById('mapaCount'))     document.getElementById('mapaCount').textContent     = n;
  if (document.getElementById('fullMapCount'))  document.getElementById('fullMapCount').textContent  = n;
  if (document.getElementById('recentesBadge')) document.getElementById('recentesBadge').textContent = n;
  if (document.getElementById('kpiAlta'))       document.getElementById('kpiAlta').textContent       = dados.filter(o => o.urg === 'Alta').length;
  if (document.getElementById('kpiResolvido'))  document.getElementById('kpiResolvido').textContent  = dados.filter(o => o.status === 'Resolvido').length;
  if (document.getElementById('kpiAtend'))      document.getElementById('kpiAtend').textContent      = dados.filter(o => o.status === 'Em atendimento').length;
}

/* ============================================================
   ROTA ATÉ A OCORRÊNCIA
   ============================================================ */
let rotaIndex = -1;
function abrirRota(idx) {
  const o = dados[idx]; if (!o) return; rotaIndex = idx;
  document.getElementById('rota-tipo').textContent  = o.tipo;
  document.getElementById('rota-local').textContent = o.local;
  document.getElementById('rota-urg').textContent   = o.urg;
  document.getElementById('rota-urg').style.background = (BADGE_COR[o.urg] || BADGE_COR.Média).bg;
  document.getElementById('rota-urg').style.color      = (BADGE_COR[o.urg] || BADGE_COR.Média).c;
  document.getElementById('rota-icon-wrap').style.background = (COR[o.tipo] || '#6b7280') + '22';
  document.getElementById('rota-icon-wrap').innerHTML        = getIconColor(o.tipo);
  document.getElementById('modal-rota').classList.add('open');
}

function closeRota() { document.getElementById('modal-rota').classList.remove('open'); rotaIndex = -1; }

window.abrirGoogleMaps = function(idx) {
  const o = dados[idx ?? rotaIndex]; if (!o) return;
  const destino       = `${o.lat},${o.lng}`;
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
  const destino       = `${o.lat},${o.lng}`;
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
  window.open(`http://maps.apple.com/?daddr=${o.lat},${o.lng}&dirflg=d`, '_blank');
  closeRota();
};

window.copiarCoordenadas = function(idx) {
  const o = dados[idx]; if (!o) return;
  const texto = `${o.lat}, ${o.lng}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(texto).then(() => toast('📋 Coordenadas copiadas!'));
  } else {
    const el = document.createElement('textarea');
    el.value = texto;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    toast('📋 Coordenadas copiadas!');
  }
  closeRota();
};

/* ============================================================
   ASSISTENTE IA
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

async function chamarGemini(textoDoUsuario) {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto: textoDoUsuario })
    });
    const data = await response.json();
    if (!response.ok) {
      const motivo = data.detalhes ? JSON.stringify(data.detalhes) : data.error;
      throw new Error(`Erro retornado pelo servidor: ${motivo}`);
    }
    return data.text;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
}

function configurarLayoutChat() {
  if (!document.getElementById('estilo-layout-chat')) {
    const estiloCss = document.createElement('style');
    estiloCss.id = 'estilo-layout-chat';
    estiloCss.innerHTML = `
      #view-chat:not([style*="display: none"]):not([style*="display:none"]) {
        display: flex !important; flex-direction: column !important; height: 100% !important;
      }
      #view-chat { box-sizing: border-box !important; padding-bottom: 75px !important; }
      #chat-mensagens {
        flex: 1 1 auto !important; height: 0px !important; max-height: none !important;
        overflow-y: auto !important; overflow-x: hidden !important; padding-right: 5px !important;
      }
      #chat-rapidas, .chat-input-area, #chat-input-area { flex: 0 0 auto !important; margin-bottom: 5px !important; }
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
  if (msg.includes('abort') || msg.toLowerCase().includes('aborterror'))
    return '⏱️ A resposta demorou muito. Verifique sua conexão e tente novamente.';
  if (msg.includes('HTTP_400')) return '❌ Erro na requisição. Tente novamente.';
  if (msg.includes('HTTP_403') || msg.includes('API_KEY_INVALID') || msg.includes('API key'))
    return '🔑 Chave de API inválida no servidor.';
  if (msg.includes('HTTP_429')) return '⏳ Muitas requisições ao mesmo tempo. Aguarde alguns minutos.';
  if (msg.includes('HTTP_5') || msg.includes('Falha na conexão'))
    return '🔧 O serviço da IA está indisponível no momento (Erro no Servidor).';
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError'))
    return '📡 Sem conexão com a internet.\nEmergências: Defesa Civil **(81) 3469-5701**';
  return `⚠️ Erro inesperado. (${msg})\nAjuda imediata: **(81) 3469-5701**`;
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
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
  div.innerHTML = `
    <span class="msg-avatar">${tipo === 'bot' ? '🤖' : '👤'}</span>
    <div class="msg-balao">${html}</div>`;
  container.appendChild(div);
  setTimeout(() => { container.scrollTop = container.scrollHeight; }, 50);
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
    </div>`;
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
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarMensagem(); }
}

function autoResize(el) {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
}

function notificarBadgeChat() {
  const viewChat = document.getElementById('view-chat');
  const oculto   = !viewChat || viewChat.style.display === 'none' || viewChat.style.display === '';
  if (oculto) document.getElementById('nav-chat')?.classList.add('has-badge');
}

/* ============================================================
   BUSCA DE ENDEREÇO POR CEP
   ============================================================ */
function ativarBuscaCep(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener('input', async function () {
    const apenasNumeros = this.value.replace(/\D/g, '');
    if (apenasNumeros.length !== 8) return;
    if (this.dataset.ultimoCep === apenasNumeros) return;
    this.dataset.ultimoCep = apenasNumeros;
    toast('⏳ Buscando endereço...');
    try {
      const respViaCep = await fetch(`https://viacep.com.br/ws/${apenasNumeros}/json/`);
      const dataCep    = await respViaCep.json();
      if (dataCep.erro) { toast('❌ CEP não encontrado.'); return; }
      const enderecoCompleto = `${dataCep.logradouro}, ${dataCep.bairro}, ${dataCep.localidade} - ${dataCep.uf}`;
      this.value       = enderecoCompleto + ', Nº ';
      this.dataset.cep = apenasNumeros;
      toast('⏳ Marcando no mapa...');
      const queryUrl = `https://nominatim.openstreetmap.org/search?format=json&street=${encodeURIComponent(dataCep.logradouro)}&city=${encodeURIComponent(dataCep.localidade)}&state=${encodeURIComponent(dataCep.uf)}&country=Brazil&limit=1`;
      const respMapa = await fetch(queryUrl, { headers: { 'User-Agent': 'MonitorUrbanoJaboatao/1.0' } });
      const dataMapa = await respMapa.json();
      if (dataMapa && dataMapa.length > 0) {
        this.dataset.lat = dataMapa[0].lat;
        this.dataset.lng = dataMapa[0].lon;
        toast('✅ Endereço e Mapa prontos!');
        if (typeof mostrarPreviewCEP === 'function') mostrarPreviewCEP(apenasNumeros, enderecoCompleto);
      } else {
        toast('⚠️ Endereço achado, mas sem pino exato no mapa.');
      }
      this.focus();
    } catch (erro) {
      toast('❌ Erro na busca do CEP.');
    }
  });
}

/* ============================================================
   MÓDULO DE PREVISÃO DE CHUVAS — Open-Meteo API
   ============================================================ */
const CHUVA_LAT = -8.1128;
const CHUVA_LNG = -34.9092;
let   chuvaJaCarregou = false;
let   historicoAlertasChuva = [];

const ZONAS_RISCO_CHUVA = [
  { nome:'Cajueiro Seco', bairro:'Cajueiro Seco', tipo:'Alagamento + Deslizamento', nivel:'Alto',  pop:'~12.000 pessoas', lat:-8.1090, lng:-34.9115 },
  { nome:'Prazeres',      bairro:'Prazeres',      tipo:'Deslizamento de encosta',   nivel:'Médio', pop:'~8.500 pessoas',  lat:-8.1185, lng:-34.9042 },
  { nome:'Guararapes',    bairro:'Guararapes',    tipo:'Alagamento de rua',         nivel:'Médio', pop:'~6.200 pessoas',  lat:-8.1155, lng:-34.9095 },
  { nome:'Pontezinha',    bairro:'Pontezinha',    tipo:'Inundação ribeirinha',      nivel:'Alto',  pop:'~9.800 pessoas',  lat:-8.1200, lng:-34.9080 },
  { nome:'Curado',        bairro:'Curado',        tipo:'Alagamento urbano',         nivel:'Baixo', pop:'~5.100 pessoas',  lat:-8.1050, lng:-34.9065 },
];

function classificarAlertaChuva(mmHora, mmAcum24h, probabilidade) {
  if (mmHora >= 10 || mmAcum24h >= 60 || probabilidade >= 90) {
    return { nivel:'CRÍTICO', emoji:'🚨', cor:'#7f1d1d', corTexto:'#fca5a5',
      corBg:'linear-gradient(135deg,#7f1d1d,#dc2626)',
      msg:'Risco iminente de alagamentos e deslizamentos. Evite áreas de risco!', classe:'nivel-critico' };
  }
  if (mmHora >= 5 || mmAcum24h >= 30 || probabilidade >= 70) {
    return { nivel:'ALTO', emoji:'⚠️', cor:'#78350f', corTexto:'#fcd34d',
      corBg:'linear-gradient(135deg,#78350f,#d97706)',
      msg:'Chuva forte prevista. Monitore pontos de alagamento e encostas.', classe:'nivel-alto' };
  }
  if (mmHora >= 2 || mmAcum24h >= 10 || probabilidade >= 50) {
    return { nivel:'MODERADO', emoji:'🌧️', cor:'#1e3a5f', corTexto:'#93c5fd',
      corBg:'linear-gradient(135deg,#1e3a5f,#2563eb)',
      msg:'Chuva moderada esperada. Fique atento às condições do tempo.', classe:'nivel-moderado' };
  }
  if (probabilidade >= 20 || mmAcum24h > 0) {
    return { nivel:'ATENÇÃO', emoji:'🌦️', cor:'#14532d', corTexto:'#86efac',
      corBg:'linear-gradient(135deg,#14532d,#16a34a)',
      msg:'Possibilidade de chuva fraca. Sem risco significativo no momento.', classe:'nivel-atencao' };
  }
  return { nivel:'NORMAL', emoji:'☀️', cor:'#0f172a', corTexto:'#94a3b8',
    corBg:'linear-gradient(135deg,#1e293b,#334155)',
    msg:'Sem previsão de chuvas. Condições climáticas favoráveis.', classe:'nivel-normal' };
}

async function buscarDadosChuva() {
  const url = `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${CHUVA_LAT}&longitude=${CHUVA_LNG}` +
    `&hourly=precipitation,precipitation_probability,wind_gusts_10m,relative_humidity_2m` +
    `&current=precipitation,wind_gusts_10m,relative_humidity_2m` +
    `&timezone=America%2FRecife&forecast_days=2`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Falha ao buscar dados Open-Meteo');
  return await resp.json();
}

function renderizarGraficoChuva(horasLabels, valoresMm, probArray) {
  const svg = document.getElementById('grafico-chuva-svg');
  if (!svg) return;
  const W    = svg.getBoundingClientRect().width || 320;
  const n    = horasLabels.length;
  const maxV = Math.max(...valoresMm, 1);
  const bW   = Math.floor((W - 20) / n) - 2;
  let html   = '';

  valoresMm.forEach((v, i) => {
    const x    = 10 + i * ((W - 20) / n);
    const h    = Math.max((v / maxV) * 75, v > 0 ? 4 : 2);
    const y    = 85 - h;
    const cor  = v >= 5 ? '#dc2626' : v >= 2 ? '#ca8a04' : '#2563eb';
    const opa  = v === 0 ? '0.2' : '1';
    const prob = probArray[i] || 0;

    html += `
      <g>
        <rect x="${x}" y="${y}" width="${Math.max(bW,4)}" height="${h}" rx="3" fill="${cor}" opacity="${opa}"/>
        ${i < n-1 ? `<line x1="${x+bW/2}" y1="${85-(prob/100)*75}" x2="${x+bW/2+(W-20)/n}" y2="${85-((probArray[i+1]||0)/100)*75}" stroke="#a78bfa" stroke-width="1.5" stroke-dasharray="3,2" opacity="0.7"/>` : ''}
        <circle cx="${x+bW/2}" cy="${85-(prob/100)*75}" r="3" fill="#a78bfa" opacity="0.9"/>
        <text x="${x+bW/2}" y="100" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="Sora,sans-serif">${horasLabels[i]}</text>
        ${v >= 1 ? `<text x="${x+bW/2}" y="${y-3}" text-anchor="middle" font-size="8" fill="${cor}" font-family="Sora,sans-serif" font-weight="700">${v.toFixed(1)}</text>` : ''}
      </g>`;
  });

  html += `<line x1="8" y1="86" x2="${W-8}" y2="86" stroke="#334155" stroke-width="1"/>`;
  html += `<circle cx="16" cy="108" r="3" fill="#a78bfa"/>
           <text x="22" y="111" font-size="8" fill="#94a3b8" font-family="Sora,sans-serif">% probabilidade</text>`;

  svg.setAttribute('height', '120');
  svg.innerHTML = html;
}

function renderizarTimeline(horas, mm, prob) {
  const el = document.getElementById('timeline-chuva');
  if (!el) return;
  el.innerHTML = horas.slice(0, 12).map((h, i) => {
    const v   = mm[i] || 0;
    const p   = prob[i] || 0;
    const cor = v >= 5 ? '#dc2626' : v >= 2 ? '#ca8a04' : v > 0 ? '#2563eb' : '#334155';
    const ico = v >= 5 ? '⛈️' : v >= 2 ? '🌧️' : v > 0 ? '🌦️' : p > 40 ? '🌥️' : '☀️';
    return `
      <div style="flex:0 0 auto;text-align:center;min-width:52px;
                  background:var(--surface);border-radius:12px;padding:10px 6px;
                  border:1.5px solid ${v >= 5 ? '#dc2626' : v >= 2 ? '#ca8a04' : 'var(--border)'};">
        <div style="font-size:9px;color:var(--text-muted);font-weight:700;margin-bottom:4px;">${h}</div>
        <div style="font-size:20px;margin-bottom:4px;">${ico}</div>
        <div style="font-size:11px;font-weight:900;color:${cor};">${v.toFixed(1)}</div>
        <div style="font-size:8px;color:var(--text-muted);">mm</div>
        <div style="font-size:8px;color:#a78bfa;font-weight:700;margin-top:2px;">${p}%</div>
      </div>`;
  }).join('');
}

function renderizarZonasRisco(alerta) {
  const el = document.getElementById('lista-zonas-risco');
  if (!el) return;
  const corNivel = {
    Alto:  { bg:'#fee2e2', c:'#dc2626', ic:'🔴' },
    Médio: { bg:'#fef9c3', c:'#ca8a04', ic:'🟡' },
    Baixo: { bg:'#dcfce7', c:'#16a34a', ic:'🟢' },
  };
  el.innerHTML = ZONAS_RISCO_CHUVA.map(zona => {
    let nivelReal = zona.nivel;
    if (alerta.nivel === 'CRÍTICO' && zona.nivel !== 'Baixo') nivelReal = 'Alto';
    if (alerta.nivel === 'ALTO'    && zona.nivel === 'Baixo')  nivelReal = 'Médio';
    const c      = corNivel[nivelReal] || corNivel.Baixo;
    const elevado = nivelReal !== zona.nivel;
    return `
      <div style="display:flex;align-items:center;gap:12px;padding:12px;
                  background:var(--surface);border-radius:12px;
                  border:1.5px solid ${c.bg};">
        <div style="font-size:22px;flex-shrink:0;">${c.ic}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:12px;font-weight:800;color:var(--text);">
            ${zona.nome}
            ${elevado ? `<span style="font-size:9px;color:#dc2626;margin-left:6px;font-weight:900;">↑ ELEVADO</span>` : ''}
          </div>
          <div style="font-size:10px;color:var(--text-muted);">${zona.tipo} · ${zona.pop}</div>
        </div>
        <span style="font-size:10px;font-weight:800;padding:3px 9px;border-radius:10px;background:${c.bg};color:${c.c};flex-shrink:0;">
          ${nivelReal}
        </span>
      </div>`;
  }).join('');
}

function adicionarHistoricoAlerta(alerta, mmHora, mmAcum) {
  const agora = new Date();
  const hora  = `${String(agora.getHours()).padStart(2,'0')}:${String(agora.getMinutes()).padStart(2,'0')}`;
  historicoAlertasChuva.unshift({ hora, nivel: alerta.nivel, emoji: alerta.emoji, msg: alerta.msg, mmHora: mmHora.toFixed(1), mmAcum: mmAcum.toFixed(1) });
  if (historicoAlertasChuva.length > 5) historicoAlertasChuva.length = 5;

  const el = document.getElementById('historico-alertas-chuva');
  if (!el) return;
  if (historicoAlertasChuva.length === 0) {
    el.innerHTML = `<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:12px;">Nenhum alerta emitido ainda.</div>`;
    return;
  }
  el.innerHTML = historicoAlertasChuva.map(a => `
    <div style="display:flex;align-items:flex-start;gap:10px;padding:10px;
                background:var(--surface);border-radius:10px;
                border-left:3px solid ${a.nivel==='CRÍTICO'?'#dc2626':a.nivel==='ALTO'?'#d97706':'#2563eb'};">
      <div style="font-size:18px;flex-shrink:0;">${a.emoji}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:11px;font-weight:800;color:var(--text);">
          Nível ${a.nivel}
          <span style="font-size:10px;color:var(--text-muted);font-weight:500;margin-left:6px;">${a.hora}</span>
        </div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">${a.msg}</div>
        <div style="font-size:10px;color:var(--brand);margin-top:3px;font-weight:700;">${a.mmHora}mm/h · ${a.mmAcum}mm acumulado</div>
      </div>
    </div>`).join('');
}

/* ============================================================
   MELHORIA #1 — atualizarBannerChuva COM classe CSS corrigida
   ============================================================ */
function atualizarBannerChuva(alerta, mmHora) {
  const banner = document.getElementById('chuva-banner');
  const icon   = document.getElementById('chuva-banner-icon');
  const titulo = document.getElementById('chuva-nivel-titulo');
  const sub    = document.getElementById('chuva-nivel-sub');
  const mmVal  = document.getElementById('chuva-mm-valor');

  if (banner) {
    banner.style.background = alerta.corBg;
    // MELHORIA #1 — bloco movido para DENTRO da função (era global e causava crash)
    banner.className = '';
    if (alerta.classe) banner.classList.add(alerta.classe);
  }
  if (icon)   icon.textContent  = alerta.emoji;
  if (titulo) titulo.textContent = alerta.nivel;
  if (sub)    sub.textContent    = alerta.msg;
  if (mmVal)  mmVal.textContent  = mmHora.toFixed(1);
}

/* ============================================================
   MELHORIA #4 — carregarDadosChuva sem conflito de variável
   ============================================================ */
async function carregarDadosChuva(forcar = false) {
  if (chuvaJaCarregou && !forcar) return;

  const elAtualizado = document.getElementById('chuva-atualizado');
  if (elAtualizado) elAtualizado.textContent = '⏳ Atualizando...';

  try {
    // MELHORIA #4 — renomeado de 'dados' para 'dadosMeteo' (evita conflito com array global)
    const dadosMeteo = await buscarDadosChuva();
    const agora      = new Date();

    const todasHoras = dadosMeteo.hourly.time;
    const idxInicio  = todasHoras.findIndex(t => new Date(t) >= agora);
    const inicio     = idxInicio >= 0 ? idxInicio : 0;

    const horasSlice = todasHoras.slice(inicio, inicio + 24);
    const mmSlice    = dadosMeteo.hourly.precipitation.slice(inicio, inicio + 24);
    const probSlice  = dadosMeteo.hourly.precipitation_probability.slice(inicio, inicio + 24);
    const ventSlice  = dadosMeteo.hourly.wind_gusts_10m.slice(inicio, inicio + 24);
    const umidSlice  = dadosMeteo.hourly.relative_humidity_2m.slice(inicio, inicio + 24);

    const labels    = horasSlice.map(t => `${String(new Date(t).getHours()).padStart(2,'0')}h`);
    const mmHora    = mmSlice[0] || 0;
    const mmAcum24h = mmSlice.reduce((a, b) => a + b, 0);
    const probAgora = probSlice[0] || 0;
    const ventoMax  = Math.max(...ventSlice);
    const umidMedia = Math.round(umidSlice.reduce((a,b) => a+b, 0) / umidSlice.length);

    const alerta = classificarAlertaChuva(mmHora, mmAcum24h, probAgora);

    atualizarBannerChuva(alerta, mmHora); // MELHORIA #1 — já corrigido dentro da função

    const elProb    = document.getElementById('chuva-prob');
    const elAcum    = document.getElementById('chuva-acum24h');
    const elVento   = document.getElementById('chuva-vento');
    const elUmidade = document.getElementById('chuva-umidade');

    if (elProb)    elProb.textContent    = `${probAgora}%`;
    if (elAcum)    elAcum.textContent    = mmAcum24h.toFixed(1);
    if (elVento)   elVento.textContent   = Math.round(ventoMax);
    if (elUmidade) elUmidade.textContent = `${umidMedia}%`;

    renderizarGraficoChuva(labels, mmSlice, probSlice);
    renderizarTimeline(labels, mmSlice, probSlice);
    renderizarZonasRisco(alerta);
    adicionarHistoricoAlerta(alerta, mmHora, mmAcum24h);

    const now = new Date();
    if (elAtualizado) elAtualizado.textContent =
      `✅ ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    chuvaJaCarregou = true;

    if ((alerta.nivel === 'CRÍTICO' || alerta.nivel === 'ALTO') && !forcar) {
      setTimeout(() => dispararAlertaClimatico(alerta, mmHora, mmAcum24h), 1200);
    }

  } catch (err) {
    console.error('Erro Open-Meteo:', err);
    const elAt = document.getElementById('chuva-atualizado');
    if (elAt) elAt.textContent = '❌ Erro na API';
    toast('⚠️ Falha ao buscar previsão de chuvas.');
  }
}

function dispararAlertaClimatico(alerta, mmHora, mmAcum) {
  const modal = document.getElementById('modal-alerta-severo');
  if (!modal) return;
  const textoEl = modal.querySelector('.alerta-severo-text');
  if (textoEl) {
    textoEl.innerHTML = `
      <strong>Defesa Civil — Jaboatão dos Guararapes</strong><br><br>
      ${alerta.emoji} <strong>ALERTA NÍVEL ${alerta.nivel}</strong><br><br>
      Precipitação atual: <strong>${mmHora.toFixed(1)}mm/h</strong><br>
      Acumulado 24h: <strong>${mmAcum.toFixed(1)}mm</strong><br><br>
      ${alerta.msg}<br><br>
      <small>📞 Defesa Civil: 199 | Bombeiros: 193</small>`;
  }
  simularAlertaSevero();
}

/* ============================================================
   MELHORIA #5 — confirmarEmissaoAlerta COM confirmação
   ============================================================ */
window.emitirAlertaChuvaManual = function() {
  criarModalAlertaChuva();
  const modal    = document.getElementById('modal-alerta-chuva');
  modal.style.display = 'flex';

  const nivelAtual = document.getElementById('chuva-nivel-titulo')?.textContent?.trim() || 'ALTO';
  const mmAtual    = document.getElementById('chuva-mm-valor')?.textContent?.trim()    || '--';
  const emojis     = { 'NORMAL':'☀️','ATENÇÃO':'⚡','MODERADO':'🌧️','ALTO':'⛈️','CRÍTICO':'🚨' };

  document.getElementById('alerta-modal-emoji').textContent = emojis[nivelAtual] || '⛈️';
  document.getElementById('alerta-modal-nivel').textContent = nivelAtual;
  document.getElementById('alerta-modal-mm').textContent    = `${mmAtual} mm/h registrado`;

  const select = document.getElementById('alerta-chuva-nivel');
  if (select) {
    const opcao = [...select.options].find(o => o.value === nivelAtual);
    if (opcao) select.value = nivelAtual;
  }
};

function fecharModalAlertaChuva() {
  const modal = document.getElementById('modal-alerta-chuva');
  if (modal) modal.style.display = 'none';
}

function confirmarEmissaoAlerta() {
  const nivel  = document.getElementById('alerta-chuva-nivel')?.value  || 'ALTO';
  const area   = document.getElementById('alerta-chuva-area')?.value   || 'Toda a cidade';
  const msgCus = document.getElementById('alerta-chuva-msg')?.value?.trim() || '';

  // MELHORIA #5 — pede confirmação antes de emitir alertas críticos/altos
  if (nivel === 'CRÍTICO' || nivel === 'ALTO') {
    const confirmar = confirm(
      `⚠️ Confirma emissão de Alerta Nível ${nivel}?\n\nÁrea: ${area}\n\nEsta ação notificará a população e disparará o alerta sonoro.`
    );
    if (!confirmar) return;
  }

  const chApp   = document.getElementById('ch-app')?.checked;
  const chSms   = document.getElementById('ch-sms')?.checked;
  const chRadio = document.getElementById('ch-rádio')?.checked;
  const canais  = [];
  if (chApp)   canais.push('App');
  if (chSms)   canais.push('SMS');
  if (chRadio) canais.push('Rádio');

  const mensagensPadrao = {
    'ATENÇÃO':  'Chuva leve prevista. Fique atento às condições do tempo.',
    'MODERADO': 'Chuva moderada. Evite áreas sujeitas a alagamento.',
    'ALTO':     'Chuva forte. Evite áreas de risco e não atravesse ruas alagadas.',
    'CRÍTICO':  'CHUVA MUITO INTENSA. Procure abrigo imediatamente. Ligue 199 ou 193.',
  };
  const msgFinal = msgCus || mensagensPadrao[nivel] || mensagensPadrao['ALTO'];

  fecharModalAlertaChuva();
  adicionarHistoricoAlertaManual(nivel, area, msgFinal, canais);

  const emojis = { 'ATENÇÃO':'⚡','MODERADO':'🌧️','ALTO':'⛈️','CRÍTICO':'🚨' };
  toast(`${emojis[nivel] || '🚨'} Alerta ${nivel} emitido para ${area}!`);

  if (nivel === 'CRÍTICO' || nivel === 'ALTO') {
    setTimeout(() => {
      const modalSevero = document.getElementById('modal-alerta-severo');
      if (modalSevero) {
        const textoEl = modalSevero.querySelector('.alerta-severo-text');
        if (textoEl) textoEl.textContent = `Defesa Civil - PE: ALERTA NÍVEL ${nivel} de CHUVAS em ${area.toUpperCase()}. ${msgFinal} Emergência: ligue 193 ou 199.`;
        modalSevero.style.display = 'flex'; // MELHORIA #2 — padronizado
        const som = document.getElementById('somDefesaCivil');
        if (som) { som.currentTime = 0; som.play().catch(() => {}); }
      }
    }, 600);
  }
}

function adicionarHistoricoAlertaManual(nivel, area, msg, canais) {
  const historico = document.getElementById('historico-alertas-chuva');
  if (!historico) return;
  const cores = {
    'ATENÇÃO':  { bg:'#fef9c3', txt:'#ca8a04', borda:'#fde68a' },
    'MODERADO': { bg:'#fff7ed', txt:'#ea580c', borda:'#fed7aa' },
    'ALTO':     { bg:'#ffedd5', txt:'#dc2626', borda:'#fca5a5' },
    'CRÍTICO':  { bg:'#fee2e2', txt:'#991b1b', borda:'#f87171' },
  };
  const c    = cores[nivel] || cores['ALTO'];
  const agora = new Date();
  const hora  = `${String(agora.getHours()).padStart(2,'0')}:${String(agora.getMinutes()).padStart(2,'0')}`;

  const item = document.createElement('div');
  item.style.cssText = `padding:12px 14px;border-radius:12px;background:${c.bg};border:1px solid ${c.borda};animation:fadeIn 0.3s ease;`;
  item.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
      <span style="font-size:12px;font-weight:800;color:${c.txt};">🚨 NÍVEL ${nivel}</span>
      <span style="font-size:10px;color:${c.txt};font-weight:600;">Agora · ${hora}</span>
    </div>
    <div style="font-size:11px;color:#374151;margin-bottom:4px;">📍 ${area}</div>
    <div style="font-size:11px;color:#6b7280;line-height:1.4;">${msg}</div>
    <div style="font-size:10px;color:${c.txt};margin-top:6px;font-weight:700;">
      📡 Canais: ${canais.length > 0 ? canais.join(', ') : 'Nenhum selecionado'}
    </div>`;
  historico.insertBefore(item, historico.firstChild);
}

/* ============================================================
   POLLING INTELIGENTE — atualiza a cada 10min em background
   ============================================================ */
let chuvaIntervalId = null;

function iniciarPollingChuva() {
  carregarDadosChuva(true);
  if (chuvaIntervalId) clearInterval(chuvaIntervalId);
  chuvaIntervalId = setInterval(async () => {
    console.log('[Chuva] Atualizando dados em background...');
    await carregarDadosChuva(true);
    const nivelEl = document.getElementById('chuva-nivel-titulo');
    const nivel   = nivelEl?.textContent || '';
    if (nivel === 'CRÍTICO' || nivel === 'ALTO') {
      const mmHora = parseFloat(document.getElementById('chuva-mm-valor')?.textContent || '0');
      const mmAcum = parseFloat(document.getElementById('chuva-acum24h')?.textContent  || '0');
      const prob   = parseInt(document.getElementById('chuva-prob')?.textContent        || '0');
      const alerta = classificarAlertaChuva(mmHora, mmAcum, prob);
      dispararAlertaClimatico(alerta, mmHora, mmAcum);
    }
  }, 10 * 60 * 1000);
}

/* ============================================================
   MODAL DE ALERTA MANUAL DE CHUVA
   ============================================================ */
function criarModalAlertaChuva() {
  if (document.getElementById('modal-alerta-chuva')) return;

  const modal = document.createElement('div');
  modal.id = 'modal-alerta-chuva';
  modal.style.cssText = `
    position:absolute;inset:0;background:rgba(8,14,31,0.75);
    backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
    display:none;align-items:flex-end;justify-content:center;
    z-index:99999;border-radius:48px;`;

  modal.innerHTML = `
    <div style="background:var(--surface);width:100%;border-radius:28px 28px 0 0;padding:22px 22px 40px;
                animation:slideUp 0.32s cubic-bezier(0.34,1.26,0.64,1);border-top:2px solid #dc2626;
                max-height:88%;overflow-y:auto;scrollbar-width:none;">
      <div style="width:36px;height:4px;background:#dc262640;border-radius:2px;margin:0 auto 20px;"></div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
        <div style="width:42px;height:42px;border-radius:12px;background:#dc2626;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="20" height="20">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
          </svg>
        </div>
        <div>
          <div style="font-size:16px;font-weight:900;color:var(--text);">Emitir Alerta de Chuva</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">Notifica agentes e população</div>
        </div>
      </div>
      <div id="alerta-chuva-preview" style="background:linear-gradient(135deg,#1e3a5f,#0f2d7a);border-radius:14px;padding:14px 16px;margin-bottom:18px;display:flex;align-items:center;gap:12px;">
        <div style="font-size:28px;" id="alerta-modal-emoji">⛈️</div>
        <div>
          <div style="font-size:11px;color:rgba(255,255,255,0.6);font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">Nível atual detectado</div>
          <div style="font-size:16px;font-weight:900;color:white;" id="alerta-modal-nivel">Carregando...</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:2px;" id="alerta-modal-mm">-- mm/h</div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div>
          <label style="font-size:11px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.6px;display:block;margin-bottom:5px;">NÍVEL DO ALERTA</label>
          <select id="alerta-chuva-nivel" style="width:100%;padding:10px 14px;border-radius:10px;border:1.5px solid var(--border-strong);background:var(--surface-2);color:var(--text);font-family:'Sora',sans-serif;font-size:13px;outline:none;">
            <option value="ATENÇÃO">⚡ ATENÇÃO — Chuva leve</option>
            <option value="MODERADO">🌧️ MODERADO — Chuva moderada</option>
            <option value="ALTO" selected>⛈️ ALTO — Chuva forte</option>
            <option value="CRÍTICO">🚨 CRÍTICO — Chuva muito intensa</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.6px;display:block;margin-bottom:5px;">ÁREA AFETADA</label>
          <select id="alerta-chuva-area" style="width:100%;padding:10px 14px;border-radius:10px;border:1.5px solid var(--border-strong);background:var(--surface-2);color:var(--text);font-family:'Sora',sans-serif;font-size:13px;outline:none;">
            <option value="Toda a cidade">📍 Toda Jaboatão dos Guararapes</option>
            <option value="Muribeca">Muribeca</option>
            <option value="Prazeres">Prazeres</option>
            <option value="Curado">Curado</option>
            <option value="Cavaleiro">Cavaleiro</option>
            <option value="Barra de Jangada">Barra de Jangada</option>
            <option value="Cajueiro Seco">Cajueiro Seco</option>
            <option value="Jardim Jordão">Jardim Jordão</option>
            <option value="Piedade">Piedade</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.6px;display:block;margin-bottom:5px;">MENSAGEM (OPCIONAL)</label>
          <textarea id="alerta-chuva-msg" rows="3" placeholder="Ex: Evite áreas de risco. Procure abrigo..."
            style="width:100%;padding:10px 14px;border-radius:10px;border:1.5px solid var(--border-strong);background:var(--surface-2);color:var(--text);font-family:'Sora',sans-serif;font-size:13px;outline:none;resize:none;"></textarea>
        </div>
        <div style="background:var(--surface-2);border-radius:12px;padding:12px 14px;border:1px solid var(--border);">
          <div style="font-size:11px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.6px;margin-bottom:10px;">CANAIS DE NOTIFICAÇÃO</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="checkbox" id="ch-app" checked style="accent-color:var(--brand);width:15px;height:15px;">
              <span style="font-size:12px;font-weight:600;color:var(--text);">📱 Notificação no App</span>
            </label>
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="checkbox" id="ch-sms" checked style="accent-color:var(--brand);width:15px;height:15px;">
              <span style="font-size:12px;font-weight:600;color:var(--text);">💬 SMS para agentes</span>
            </label>
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="checkbox" id="ch-rádio" style="accent-color:var(--brand);width:15px;height:15px;">
              <span style="font-size:12px;font-weight:600;color:var(--text);">📻 Rádio Comunitária</span>
            </label>
          </div>
        </div>
        <button onclick="confirmarEmissaoAlerta()" style="width:100%;padding:15px;border-radius:12px;border:none;
          background:linear-gradient(135deg,#b91c1c,#dc2626);color:white;font-family:'Sora',sans-serif;
          font-size:14px;font-weight:900;cursor:pointer;box-shadow:0 6px 20px rgba(220,38,38,0.40);
          display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity 0.15s;"
          onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
          </svg>
          🚨 Emitir Alerta Agora
        </button>
        <button onclick="fecharModalAlertaChuva()" style="width:100%;padding:12px;border-radius:12px;
          border:1.5px solid var(--border-strong);background:var(--surface-2);color:var(--text);
          font-family:'Sora',sans-serif;font-size:13px;font-weight:700;cursor:pointer;">
          Cancelar
        </button>
      </div>
    </div>`;

  modal.addEventListener('click', function(e) {
    if (e.target === modal) fecharModalAlertaChuva();
  });

  document.getElementById('phone').appendChild(modal);
}

/* ============================================================
   MELHORIA #3 — DOMContentLoaded UNIFICADO (era duplicado)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  carregarDadosSalvos(); // MELHORIA #6 — carrega dados salvos antes de tudo
  syncTudo();
  testarConexaoGemini();
  ativarBuscaCep('end-input');
  ativarBuscaCep('vistoria-end');
  setTimeout(() => iniciarPollingChuva(), 3000); // MELHORIA #3 — unificado aqui
});
