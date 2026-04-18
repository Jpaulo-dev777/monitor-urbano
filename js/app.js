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
/* ── Leaflet Popup com botão de rota ── */
function criarPopupHTML(o, idx) {
  const b      = BADGE_COR[o.urg] || BADGE_COR.Média;
  const stCls  = {
    'Aberto':         'background:#FFEBEE;color:#C62828',
    'Em atendimento': 'background:#FFF8E1;color:#E65100',
    'Resolvido':      'background:#E8F5E9;color:#2E7D32',
  }[o.status] || 'background:#FFEBEE;color:#C62828';

  return `
    <div style="font-family:'Sora',sans-serif;min-width:200px;padding:2px;">

      <!-- Cabeçalho do popup -->
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

      <!-- Descrição (se houver) -->
      ${o.desc ? `
        <div style="font-size:11px;color:#5A6A8A;margin-bottom:8px;
                    padding:6px 8px;background:#F5F7FF;border-radius:8px;
                    line-height:1.4;">
          ${sanitize(o.desc)}
        </div>` : ''}

      <!-- Badges de urgência e status -->
      <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">
        <span style="font-size:10px;font-weight:800;padding:3px 8px;border-radius:10px;
          background:${b.bg};color:${b.c};">
          ${sanitize(o.urg)}
        </span>
        <span style="font-size:10px;font-weight:800;padding:3px 8px;
                     border-radius:10px;${stCls}">
          ${sanitize(o.status || 'Aberto')}
        </span>
        <span style="font-size:10px;color:#8B9DB5;margin-left:auto;align-self:center;">
          ${sanitize(o.tempo)}
        </span>
      </div>

      <!-- Divisor -->
      <div style="height:1px;background:rgba(27,79,204,0.10);margin-bottom:10px;"></div>

      <!-- Botão principal: Como Chegar -->
      <button onclick="abrirRota(${idx})"
        style="width:100%;padding:9px;border-radius:10px;border:none;
               background:linear-gradient(135deg,#0F2D7A,#2E6EF7);
               color:white;font-family:Sora,sans-serif;
               font-size:12px;font-weight:800;cursor:pointer;
               display:flex;align-items:center;justify-content:center;gap:6px;
               margin-bottom:7px;box-shadow:0 4px 12px rgba(27,79,204,0.30);
               letter-spacing:0.2px;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
             stroke="white" stroke-width="2.5">
          <polygon points="3 11 22 2 13 21 11 13 3 11"/>
        </svg>
        Como Chegar
      </button>

      <!-- Botões secundários: Editar e Remover -->
      <div style="display:flex;gap:6px;">
        <button onclick="editarDoMapa(${idx})"
          style="flex:1;padding:7px;border-radius:9px;border:1.5px solid rgba(27,79,204,0.20);
                 background:#E8EFFE;color:#1B4FCC;font-family:Sora,sans-serif;
                 font-size:11px;font-weight:700;cursor:pointer;">
          ✏️ Editar
        </button>
        <button onclick="deletarDoMapa(${idx})"
          style="flex:1;padding:7px;border-radius:9px;border:1.5px solid rgba(229,57,53,0.18);
                 background:#FFEBEE;color:#E53935;font-family:Sora,sans-serif;
                 font-size:11px;font-weight:700;cursor:pointer;">
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
/* ============================================================
   AUTOCOMPLETE DE ENDEREÇO — Nominatim suggestions
   ============================================================ */

let autocompleteTimer = null;

function initAutocomplete() {
  const input = document.getElementById('end-input');
  if (!input) return;

  input.addEventListener('input', function () {
    clearTimeout(autocompleteTimer);
    const val = this.value.trim();

    // Limpa preview e sugestões se campo vazio
    if (val.length < 4) {
      esconderSugestoes();
      esconderPreviewCEP();
      return;
    }

    // Debounce: aguarda 600ms após parar de digitar
    autocompleteTimer = setTimeout(() => buscarSugestoes(val), 600);
  });

  // Fecha sugestões ao clicar fora
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#end-input') && !e.target.closest('#sugestoes-lista')) {
      esconderSugestoes();
    }
  });
}

async function buscarSugestoes(query) {
  try {
    const params = new URLSearchParams({
      format:          'json',
      q:               `${query}, ${CIDADE_PADRAO}, PE, Brasil`,
      limit:           '5',
      countrycodes:    'br',
      'accept-language': 'pt-BR',
      addressdetails:  '1',
    });

    const resp = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      { headers: { 'User-Agent': 'MonitorUrbanoJaboatao/1.0' } }
    );
    if (!resp.ok) return;

    const resultados = await resp.json();
    exibirSugestoes(resultados, query);
  } catch (e) {
    console.warn('[Autocomplete]', e);
  }
}

function exibirSugestoes(resultados, queryOriginal) {
  let lista = document.getElementById('sugestoes-lista');

  if (!lista) {
    lista = document.createElement('div');
    lista.id = 'sugestoes-lista';
    lista.style.cssText = `
      position:absolute; z-index:99999;
      background:var(--surface); border-radius:12px;
      box-shadow:0 8px 32px rgba(15,45,122,0.18);
      border:1.5px solid var(--border-strong);
      overflow:hidden; max-height:220px; overflow-y:auto;
      scrollbar-width:none;
    `;
    const formGroup = document.getElementById('end-input').parentNode;
    formGroup.style.position = 'relative';
    formGroup.appendChild(lista);
  }

  if (!resultados || resultados.length === 0) {
    lista.innerHTML = `
      <div style="padding:12px 14px;font-size:12px;color:var(--text-muted);
                  font-family:Sora,sans-serif;font-weight:500;">
        Nenhum resultado encontrado
      </div>`;
    lista.style.display = 'block';
    return;
  }

  lista.innerHTML = resultados.map((r, i) => {
    // Extrai partes legíveis do display_name
    const partes = r.display_name.split(',').slice(0, 3).map(p => p.trim());
    const titulo = partes[0] || r.display_name;
    const sub    = partes.slice(1).join(', ');
    const cep    = r.address?.postcode || '';

    return `
      <div class="sugestao-item"
           onclick="selecionarSugestao('${sanitize(titulo).replace(/'/g,"\\'")}',
                                       '${r.lat}','${r.lon}',
                                       '${sanitize(cep)}')"
           style="display:flex;align-items:center;gap:10px;padding:10px 14px;
                  cursor:pointer;transition:background 0.15s;border-bottom:
                  1px solid var(--border);font-family:Sora,sans-serif;">
        <div style="flex-shrink:0;color:var(--brand);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:12px;font-weight:700;color:var(--text);
                      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${sanitize(titulo)}
          </div>
          <div style="font-size:10px;color:var(--text-muted);font-weight:500;
                      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${sanitize(sub)} ${cep ? `· CEP ${cep}` : ''}
          </div>
        </div>
      </div>`;
  }).join('');

  // Hover effect via JS
  lista.querySelectorAll('.sugestao-item').forEach(item => {
    item.addEventListener('mouseenter', () => item.style.background = 'var(--brand-pale)');
    item.addEventListener('mouseleave', () => item.style.background = '');
  });

  lista.style.display = 'block';
}

/* ── Seleciona uma sugestão do autocomplete ── */
window.selecionarSugestao = function(titulo, lat, lng, cep) {
  const input = document.getElementById('end-input');
  input.value = titulo;
  input.dataset.lat = lat;
  input.dataset.lng = lng;
  input.dataset.cep = cep;

  esconderSugestoes();

  // Mostra preview com CEP
  if (cep) mostrarPreviewCEP(cep, titulo);
};

function esconderSugestoes() {
  const lista = document.getElementById('sugestoes-lista');
  if (lista) lista.style.display = 'none';
}

/* ── Preview do CEP abaixo do campo ── */
async function mostrarPreviewCEP(cep, endereco) {
  let preview = document.getElementById('end-preview');
  if (!preview) {
    preview = document.createElement('div');
    preview.id = 'end-preview';
    const formGroup = document.getElementById('end-input').parentNode;
    formGroup.appendChild(preview);
  }

  preview.style.cssText = `
    display:flex; align-items:center; gap:8px;
    padding:8px 12px; margin-top:6px;
    background:var(--brand-pale); border-radius:10px;
    border:1px solid var(--border-strong);
    font-family:Sora,sans-serif; font-size:11px; font-weight:600;
    color:var(--brand); animation:fadeIn 0.2s ease;
  `;
  preview.innerHTML = `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2.5">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
    📮 CEP <strong>${cep}</strong> — endereço localizado
    <span style="margin-left:auto;color:var(--success);font-size:10px;">✅ Exato</span>
  `;
}

function esconderPreviewCEP() {
  const preview = document.getElementById('end-preview');
  if (preview) preview.style.display = 'none';
}

// /* ============================================================
//    ROTA — usa lat/lng real da ocorrência (já geocodificada)
//    ============================================================ */

// window.abrirGoogleMaps = function(idx) {
//   const o = dados[idx];
//   if (!o) return;

//   const destino = `${o.lat},${o.lng}`;

//   const abrirURL = (origem) => {
//     const url = origem
//       ? `https://www.google.com/maps/dir/?api=1&origin=${origem}&destination=${destino}&travelmode=driving`
//       : `https://www.google.com/maps/search/?api=1&query=${destino}`;
//     window.open(url, '_blank');
//   };

//   if (navigator.geolocation) {
//     // Timeout de 5s para não travar o usuário
//     const timeout = setTimeout(() => {
//       abrirURL(null);
//       toast('🗺️ Abrindo Google Maps...');
//     }, 5000);

//     navigator.geolocation.getCurrentPosition(
//       pos => {
//         clearTimeout(timeout);
//         abrirURL(`${pos.coords.latitude},${pos.coords.longitude}`);
//         toast('🗺️ Rota traçada no Google Maps!');
//       },
//       () => {
//         clearTimeout(timeout);
//         abrirURL(null);
//         toast('🗺️ Abrindo destino no Google Maps...');
//       },
//       { timeout: 4500, maximumAge: 60000 }
//     );
//   } else {
//     abrirURL(null);
//     toast('🗺️ Abrindo Google Maps...');
//   }

//   closeRota();
// };

window.abrirWaze = function(idx) {
  const o = dados[idx];
  if (!o) return;

  // Waze aceita lat/lng direto — sempre preciso pois usamos coords geocodificadas
  const url = `https://waze.com/ul?ll=${o.lat},${o.lng}&navigate=yes&zoom=17`;
  window.open(url, '_blank');

  closeRota();
  toast('🔵 Abrindo Waze com destino exato!');
};

window.abrirAppleMaps = function(idx) {
  const o = dados[idx];
  if (!o) return;

  const url = `http://maps.apple.com/?daddr=${o.lat},${o.lng}&dirflg=d`;
  window.open(url, '_blank');

  closeRota();
  toast('🍎 Abrindo Apple Maps...');
};

window.copiarCoordenadas = function(idx) {
  const o = dados[idx];
  if (!o) return;

  const texto = `${o.lat.toFixed(6)}, ${o.lng.toFixed(6)}`;
  const msg   = o.cep
    ? `📋 Coords copiadas! CEP: ${o.cep}`
    : '📋 Coordenadas copiadas!';

  if (navigator.clipboard) {
    navigator.clipboard.writeText(texto).then(() => toast(msg));
  } else {
    const el = document.createElement('textarea');
    el.value = texto; document.body.appendChild(el);
    el.select(); document.execCommand('copy');
    document.body.removeChild(el);
    toast(msg);
  }

  closeRota();
};


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
/* ── IDs de todas as views + nav items ── */
const VIEWS = [
  'view-home',
  'view-lista',
  'view-mapa',
  'view-mapa-full',
  'view-chat'          // ✅ nova view
];

const NAV_MAP = {
  'view-home':     'nav-home',
  'view-lista':    'nav-bell',
  'view-mapa':     'nav-map',
  'view-mapa-full':'nav-map',
  'view-chat':     'nav-chat'   // ✅ ativa o item correto
};

function goTo(viewId) {
  /* Esconde todas as views */
  VIEWS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  /* Remove active de todos os nav-items */
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  /* Mostra a view alvo */
  const target = document.getElementById(viewId);
  if (!target) return;

  /* view-chat usa flex; outras usam block/flex conforme classe */
  target.style.display = (viewId === 'view-chat') ? 'flex' : 'block';

  /* Ativa o nav-item correspondente */
  const navId = NAV_MAP[viewId];
  if (navId) {
    const navEl = document.getElementById(navId);
    if (navEl) navEl.classList.add('active');
  }

  /* Reinicializa mapas se necessário */
  if (viewId === 'view-mapa' && window.mapaLeaflet) {
    setTimeout(() => window.mapaLeaflet.invalidateSize(), 100);
  }
  if (viewId === 'view-mapa-full' && window.mapaLeafletFull) {
    setTimeout(() => window.mapaLeafletFull.invalidateSize(), 100);
  }

  /* Foca no input ao abrir o chat */
  if (viewId === 'view-chat') {
    setTimeout(() => document.getElementById('chat-input')?.focus(), 300);
    /* Remove badge do nav ao entrar na aba */
    document.getElementById('nav-chat')?.classList.remove('has-badge');
  }
}


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
   SISTEMA DE GEOCODING + CEP — Completo
   ============================================================

   Fluxo:
   1. Usuário digita endereço no campo
   2. buscarCEPporEndereco() → ViaCEP retorna CEP + endereço normalizado
   3. geocodificarEndereco() → Nominatim com query estruturada retorna lat/lng
   4. Fallback: Nominatim free-form → fallback geográfico de Jaboatão
   ============================================================ */

const CIDADE_PADRAO   = 'Jaboatão dos Guararapes';
const ESTADO_PADRAO   = 'PE';
const PAIS_PADRAO     = 'Brasil';

// Centro geográfico de Jaboatão dos Guararapes
const LAT_CENTRO = -8.1128;
const LNG_CENTRO = -34.9092;

/* ── 1. Busca CEP pelo endereço usando ViaCEP ── */
async function buscarCEPporEndereco(enderecoRaw) {
  try {
    // Limpa o endereço: remove números soltos de CEP, normaliza espaços
    const endLimpo = enderecoRaw
      .replace(/\b\d{5}-?\d{3}\b/g, '')   // remove CEP se já veio no campo
      .replace(/\s+/g, ' ')
      .trim();

    // Tenta extrair rua e número do endereço
    // Exemplos: "Av. Principal, 340" / "Rua das Flores s/n" / "Praça Central"
    const partes  = endLimpo.split(',');
    const rua     = (partes[0] || endLimpo).trim();

    // ViaCEP busca por endereço: /ws/UF/Cidade/Logradouro/json/
    const cidadeEncoded = encodeURIComponent(CIDADE_PADRAO);
    const ruaEncoded    = encodeURIComponent(rua);
    const url = `https://viacep.com.br/ws/${ESTADO_PADRAO}/${cidadeEncoded}/${ruaEncoded}/json/`;

    const resp = await fetch(url);
    if (!resp.ok) return null;

    const resultado = await resp.json();

    // ViaCEP retorna array quando busca por endereço
    if (Array.isArray(resultado) && resultado.length > 0) {
      // Pega o primeiro resultado com CEP válido
      const item = resultado.find(r => r.cep && !r.erro) || resultado[0];
      if (item && item.cep) {
        return {
          cep:        item.cep,
          logradouro: item.logradouro || rua,
          bairro:     item.bairro     || '',
          cidade:     item.localidade || CIDADE_PADRAO,
          uf:         item.uf         || ESTADO_PADRAO,
          enderecoCompleto: montarEnderecoCompleto(item, partes[1])
        };
      }
    }
    return null;
  } catch (e) {
    console.warn('[ViaCEP] Falha na busca por endereço:', e);
    return null;
  }
}

/* ── Monta endereço completo normalizado ── */
function montarEnderecoCompleto(viaCepItem, numeroRaw) {
  const numero = numeroRaw ? numeroRaw.trim() : '';
  const partes = [
    viaCepItem.logradouro,
    numero     || '',
    viaCepItem.bairro    || '',
    `${viaCepItem.localidade || CIDADE_PADRAO} - ${viaCepItem.uf || ESTADO_PADRAO}`,
    `CEP ${viaCepItem.cep}`
  ].filter(Boolean);
  return partes.join(', ');
}

/* ── 2. Geocodifica via Nominatim (query ESTRUTURADA) ── */
async function geocodificarEstruturado(enderecoRaw, dadosCEP) {
  try {
    let params;

    if (dadosCEP) {
      // Com dados do ViaCEP: usa query estruturada precisa
      const partes = enderecoRaw.split(',');
      const numero = partes[1] ? partes[1].trim().replace(/\D/g, '') : '';
      const rua    = dadosCEP.logradouro;
      const street = numero ? `${numero} ${rua}` : rua;

      params = new URLSearchParams({
        format:          'json',
        addressdetails:  '1',
        limit:           '3',
        'accept-language': 'pt-BR',
        countrycodes:    'br',
        street:          street,
        city:            dadosCEP.cidade,
        state:           'Pernambuco',
        postalcode:      dadosCEP.cep.replace('-', ''),
        country:         PAIS_PADRAO,
      });
    } else {
      // Sem ViaCEP: query estruturada com cidade fixa
      const partes = enderecoRaw.split(',');
      const street = partes[0].trim();

      params = new URLSearchParams({
        format:          'json',
        addressdetails:  '1',
        limit:           '5',
        'accept-language': 'pt-BR',
        countrycodes:    'br',
        street:          street,
        city:            CIDADE_PADRAO,
        state:           'Pernambuco',
        country:         PAIS_PADRAO,
      });
    }

    const url  = `https://nominatim.openstreetmap.org/search?${params}`;
    const resp = await fetch(url, {
      headers: {
        'Accept-Language': 'pt-BR',
        // User-Agent obrigatório pelo Nominatim ToS
        'User-Agent': 'MonitorUrbanoJaboatao/1.0'
      }
    });

    if (!resp.ok) return null;
    const resultados = await resp.json();

    if (resultados && resultados.length > 0) {
      // Filtra resultados dentro de Jaboatão / Pernambuco
      const filtrado = resultados.find(r =>
        r.display_name &&
        (r.display_name.toLowerCase().includes('jaboatão') ||
         r.display_name.toLowerCase().includes('jaboatao') ||
         r.display_name.toLowerCase().includes('pernambuco') ||
         r.display_name.toLowerCase().includes('pe,'))
      ) || resultados[0];

      return {
        lat:         parseFloat(filtrado.lat),
        lng:         parseFloat(filtrado.lon),
        displayName: filtrado.display_name,
        encontrado:  true,
        precisao:    'exata'
      };
    }
    return null;
  } catch (e) {
    console.warn('[Nominatim Estruturado] Falha:', e);
    return null;
  }
}

/* ── 3. Fallback: Nominatim free-form ── */
async function geocodificarFreeForm(enderecoRaw) {
  try {
    // Estratégia: tenta 3 variações da query, do mais específico ao menos
    const queries = [
      `${enderecoRaw}, ${CIDADE_PADRAO}, ${ESTADO_PADRAO}, ${PAIS_PADRAO}`,
      `${enderecoRaw}, ${CIDADE_PADRAO}, Pernambuco`,
      `${enderecoRaw.split(',')[0]}, ${CIDADE_PADRAO}, Brasil`,
    ];

    for (const q of queries) {
      const params = new URLSearchParams({
        format:          'json',
        q:               q,
        limit:           '3',
        countrycodes:    'br',
        'accept-language': 'pt-BR',
      });

      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`,
        { headers: { 'User-Agent': 'MonitorUrbanoJaboatao/1.0' } }
      );
      if (!resp.ok) continue;

      const resultados = await resp.json();
      if (resultados && resultados.length > 0) {
        const r = resultados[0];
        return {
          lat:         parseFloat(r.lat),
          lng:         parseFloat(r.lon),
          displayName: r.display_name,
          encontrado:  true,
          precisao:    'aproximada'
        };
      }

      // Aguarda 300ms entre requisições (respeita rate limit do Nominatim)
      await new Promise(res => setTimeout(res, 300));
    }
    return null;
  } catch (e) {
    console.warn('[Nominatim FreeForm] Falha:', e);
    return null;
  }
}

/* ── 4. Fallback geográfico inteligente ── */
function fallbackGeografico(enderecoRaw) {
  // Gera ponto próximo ao centro de Jaboatão com variação pequena
  // para não sobrepor todos os pins de fallback no mesmo lugar
  const seed  = enderecoRaw.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const angulo = (seed % 360) * (Math.PI / 180);
  const raio   = 0.003 + (seed % 100) * 0.00015; // 300m a 1.8km do centro

  return {
    lat:        LAT_CENTRO + raio * Math.sin(angulo),
    lng:        LNG_CENTRO + raio * Math.cos(angulo),
    encontrado: false,
    precisao:   'fallback',
    displayName: `${enderecoRaw} (posição aproximada)`
  };
}

/* ── FUNÇÃO PRINCIPAL — substitui a antiga obterCoordenadasEndereco ── */
async function obterCoordenadasEndereco(enderecoRaw) {
  if (!enderecoRaw || !enderecoRaw.trim()) return fallbackGeografico('centro');

  console.log(`[Geocoding] Buscando: "${enderecoRaw}"`);

  // ETAPA 1 — Busca CEP no ViaCEP
  const dadosCEP = await buscarCEPporEndereco(enderecoRaw);
  console.log('[ViaCEP]', dadosCEP);

  // ETAPA 2 — Geocoding estruturado (com ou sem CEP)
  const coordsEstruturado = await geocodificarEstruturado(enderecoRaw, dadosCEP);
  if (coordsEstruturado) {
    console.log('[Nominatim Estruturado] ✅', coordsEstruturado);
    return { ...coordsEstruturado, cep: dadosCEP?.cep || null };
  }

  // ETAPA 3 — Fallback free-form
  const coordsFreeForm = await geocodificarFreeForm(enderecoRaw);
  if (coordsFreeForm) {
    console.log('[Nominatim FreeForm] ✅', coordsFreeForm);
    return { ...coordsFreeForm, cep: dadosCEP?.cep || null };
  }

  // ETAPA 4 — Fallback geográfico
  console.warn('[Geocoding] Nenhuma API retornou resultado. Usando fallback geográfico.');
  return { ...fallbackGeografico(enderecoRaw), cep: dadosCEP?.cep || null };
}


/* ============================================================
   MODAL RELATAR — com geocoding melhorado + CEP
   ============================================================ */
function openRelatar()  { document.getElementById('modal-relatar').classList.add('open'); }
function closeRelatar() {
  document.getElementById('modal-relatar').classList.remove('open');
  // Limpa preview de CEP/endereço
  const preview = document.getElementById('end-preview');
  if (preview) preview.style.display = 'none';
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

  // Estado: carregando
  btn.innerHTML = `
    <span style="display:flex;align-items:center;gap:8px;justify-content:center;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="white" stroke-width="2.5"
           style="animation:spinIcon 1s linear infinite;">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83
                 M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      Buscando localização...
    </span>`;
  btn.disabled = true;

  try {
    const coords = await obterCoordenadasEndereco(end);

    // Monta endereço exibido no card (com CEP se encontrado)
    const endExibido = coords.cep
      ? `${end} — CEP ${coords.cep}`
      : end;

    dados.unshift({
      tipo,
      local:    end,
      localCompleto: endExibido,
      desc:     desc || '',
      tempo:    'Agora',
      urg,
      status:   'Aberto',
      lat:      coords.lat,
      lng:      coords.lng,
      cep:      coords.cep || null,
      precisao: coords.precisao || 'fallback',
    });

    syncTudo();
    closeRelatar();

    // Limpa campos
    document.getElementById('tipo-select').value = '';
    document.getElementById('end-input').value   = '';
    document.getElementById('desc-input').value  = '';

    // Feedback para o usuário com nível de precisão
    const msgs = {
      exata:      `✅ ${tipo} localizado com precisão no mapa!`,
      aproximada: `📍 ${tipo} registrado — posição aproximada no mapa.`,
      fallback:   `⚠️ Endereço não encontrado — pin posicionado em Jaboatão.`,
    };
    toast(msgs[coords.precisao] || msgs.fallback);

    // Se o CEP foi encontrado, mostra notificação extra
    if (coords.cep) {
      setTimeout(() => toast(`📮 CEP identificado: ${coords.cep}`), 2600);
    }

    // Navega para o mapa e centraliza no pin
    setTimeout(() => {
      goTo('view-mapa');
      setTimeout(() => {
        if (mapa && mapaReady) {
          mapa.setView([coords.lat, coords.lng], 17);
          if (marcadores.length > 0) {
            marcadores[0].openPopup();
          }
        }
      }, 450);
    }, 700);

  } catch (err) {
    console.error('[submitRelatar]', err);
    toast('❌ Erro ao registrar ocorrência.');
  } finally {
    btn.innerHTML = 'Enviar Ocorrência';
    btn.disabled  = false;
    enviando      = false;
  }
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

/* ============================================================
   ROTA ATÉ A OCORRÊNCIA — Google Maps & Waze
   ============================================================ */

/**
 * Abre opções de navegação para uma ocorrência
 * @param {number} idx - índice da ocorrência em dados[]
 */
function abrirRota(idx) {
  const o = dados[idx];
  if (!o) return;

  // Salva índice e abre o modal de rota
  rotaIndex = idx;
  const modal = document.getElementById('modal-rota');

  // Preenche informações da ocorrência no modal
  document.getElementById('rota-tipo').textContent   = o.tipo;
  document.getElementById('rota-local').textContent  = o.local;
  document.getElementById('rota-urg').textContent    = o.urg;
  document.getElementById('rota-urg').style.background =
    (BADGE_COR[o.urg] || BADGE_COR.Média).bg;
  document.getElementById('rota-urg').style.color =
    (BADGE_COR[o.urg] || BADGE_COR.Média).c;

  // Ícone do tipo
  document.getElementById('rota-icon-wrap').style.background =
    (COR[o.tipo] || '#6b7280') + '22';
  document.getElementById('rota-icon-wrap').innerHTML =
    getIconColor(o.tipo);

  modal.classList.add('open');
}

function closeRota() {
  document.getElementById('modal-rota').classList.remove('open');
  rotaIndex = -1;
}

let rotaIndex = -1;

/**
 * Abre Google Maps com destino nas coordenadas da ocorrência
 */
window.abrirGoogleMaps = function(idx) {
  const o = dados[idx ?? rotaIndex];
  if (!o) return;

  const destino = `${o.lat},${o.lng}`;

  const abrirSoDestino = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destino}&travelmode=driving`;
    window.open(url, '_blank');
    closeRota();
    toast('🗺️ Defina a origem no Google Maps.');
  };

  if (!navigator.geolocation) {
    abrirSoDestino();
    return;
  }

  toast('📡 Obtendo sua localização...');

  navigator.geolocation.getCurrentPosition(
    pos => {
      const origem = `${pos.coords.latitude},${pos.coords.longitude}`;
      const url = `https://www.google.com/maps/dir/?api=1&origin=${origem}&destination=${destino}&travelmode=driving`;
      window.open(url, '_blank');
      closeRota();
      toast('🗺️ Rota traçada com sua localização atual!');
    },
    () => abrirSoDestino(),
    { timeout: 8000, maximumAge: 30000, enableHighAccuracy: true }
  );
};


window.abrirWaze = function(idx) {
  const o = dados[idx ?? rotaIndex];
  if (!o) return;

  const destino = `${o.lat},${o.lng}`;

  const abrirSemOrigem = () => {
    const url = `https://waze.com/ul?ll=${destino}&navigate=yes&zoom=17`;
    window.open(url, '_blank');
    closeRota();
    toast('🔵 Abrindo Waze...');
  };

  if (!navigator.geolocation) {
    abrirSemOrigem();
    return;
  }

  toast('📡 Obtendo sua localização...');

  navigator.geolocation.getCurrentPosition(
    pos => {
      const origem = `${pos.coords.latitude},${pos.coords.longitude}`;
      const url = `https://waze.com/ul?ll=${destino}&navigate=yes&zoom=17&from=ll.${origem}`;
      window.open(url, '_blank');
      closeRota();
      toast('🔵 Rota traçada no Waze com sua localização!');
    },
    () => abrirSemOrigem(),
    { timeout: 8000, maximumAge: 30000, enableHighAccuracy: true }
  );
};


/**
 * Abre Apple Maps (fallback para iOS)
 */
window.abrirAppleMaps = function(idx) {
  const o = dados[idx];
  if (!o) return;

  const url = `http://maps.apple.com/?daddr=${o.lat},${o.lng}&dirflg=d`;
  window.open(url, '_blank');

  closeRota();
  toast('🍎 Abrindo Apple Maps...');
};

/**
 * Copia coordenadas para a área de transferência
 */
window.copiarCoordenadas = function(idx) {
  const o = dados[idx];
  if (!o) return;

  const texto = `${o.lat}, ${o.lng}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(texto).then(() => {
      toast('📋 Coordenadas copiadas!');
    });
  } else {
    // Fallback para navegadores antigos
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

/* ── Inicia autocomplete quando o modal de relato abre ── */
const _origOpenRelatar = openRelatar;
// Sobrescreve openRelatar para iniciar autocomplete na 1ª abertura
(function() {
  let autoInit = false;
  window.openRelatar = function() {
    document.getElementById('modal-relatar').classList.add('open');
    if (!autoInit) {
      initAutocomplete();
      autoInit = true;
    }
  };
})();

/* ============================================================
   ASSISTENTE IA — Gemini 2.0 Flash (correção do erro 400)
   ============================================================ */

const GEMINI_API_KEY = 'AIzaSyBJRU7QlfWmPx-Cy06k0PiJ1T2f0sa5z40';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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
- Contexto: Jaboatão dos Guararapes fica na Região Metropolitana do Recife,
  área sujeita a chuvas intensas especialmente de março a agosto`;

/* ─────────────────────────────────────────
   HISTÓRICO — pares completos [user, model]
   Garante alternância correta e nunca corrompe
───────────────────────────────────────── */
let historicoChat = []; // Sempre pares: [{role:'user',...}, {role:'model',...}]

/* ─────────────────────────────────────────
   ENVIAR MENSAGEM
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
    digitando.remove();
    adicionarMensagem(resposta, 'bot');
  } catch (erro) {
    digitando.remove();
    console.error('[Gemini] Erro:', erro.message);
    adicionarMensagem(obterMsgErro(erro), 'bot');
  } finally {
    if (btnEnviar) btnEnviar.disabled = false;
    setStatusChat('● Online', false);
  }
}

/* ─────────────────────────────────────────
   CHAMAR API GEMINI — sem erro 400
───────────────────────────────────────── */
async function chamarGemini(pergunta) {

  /* ✅ Monta o conteúdo com histórico anterior + nova pergunta
     Garante que começa sempre com 'user' e alterna corretamente */
  const contents = [
    ...historicoChat,          // pares anteriores (user+model)
    { role: 'user', parts: [{ text: pergunta }] }  // nova pergunta
  ];

  const body = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }]
    },
    contents,
    generationConfig: {
      temperature:     0.7,
      maxOutputTokens: 600,
      topP:            0.9,
    }
  };

  /* AbortController manual — compatível com todos os browsers */
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), 20000);

  let resp;
  try {
    resp = await fetch(GEMINI_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
      signal:  controller.signal
    });
  } finally {
    clearTimeout(timeoutId);
  }

  /* Loga o erro HTTP real para debug */
  if (!resp.ok) {
    let detalhes = '';
    try {
      const errJson = await resp.json();
      detalhes = errJson?.error?.message || JSON.stringify(errJson?.error || errJson);
    } catch (_) {
      detalhes = await resp.text().catch(() => '');
    }
    console.error(`[Gemini] HTTP ${resp.status}:`, detalhes);
    throw new Error(`HTTP_${resp.status}::${detalhes}`);
  }

  const data  = await resp.json();
  const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!texto) {
    /* Pode ser bloqueio de segurança — loga o motivo */
    const motivo = data?.candidates?.[0]?.finishReason
                || data?.promptFeedback?.blockReason
                || 'desconhecido';
    console.warn('[Gemini] Resposta vazia. Motivo:', motivo, JSON.stringify(data));
    throw new Error(`RESPOSTA_VAZIA::${motivo}`);
  }

  /* ✅ Só salva no histórico DEPOIS de receber resposta com sucesso
     Evita histórico corrompido em caso de erro */
  historicoChat.push(
    { role: 'user',  parts: [{ text: pergunta }] },
    { role: 'model', parts: [{ text: texto    }] }
  );

  /* ✅ Mantém apenas os últimos 5 pares (10 mensagens)
     e garante que sempre começa com 'user' */
  if (historicoChat.length > 10) {
    historicoChat = historicoChat.slice(-10);
    /* Garante que o primeiro item é sempre 'user' */
    if (historicoChat[0]?.role !== 'user') {
      historicoChat = historicoChat.slice(1);
    }
  }

  return texto;
}

/* ─────────────────────────────────────────
   MENSAGEM DE ERRO AMIGÁVEL
───────────────────────────────────────── */
function obterMsgErro(erro) {
  const msg = erro?.message || '';

  if (msg.includes('abort') || msg.toLowerCase().includes('aborterror')) {
    return '⏱️ A resposta demorou muito. Verifique sua conexão e tente novamente.';
  }
  if (msg.includes('HTTP_400')) {
    return '❌ Erro na requisição (400). Recarregue a página e tente novamente.';
  }
  if (msg.includes('HTTP_401') || msg.includes('HTTP_403')) {
    return '🔑 Chave de API inválida. Verifique em aistudio.google.com.';
  }
  if (msg.includes('HTTP_429')) {
    return '⏳ Muitas requisições. Aguarde alguns segundos e tente novamente.';
  }
  if (msg.includes('HTTP_5')) {
    return '🔧 Serviço do Google indisponível no momento. Tente em alguns instantes.';
  }
  if (msg.includes('SAFETY')) {
    return '🚫 Mensagem bloqueada por segurança. Tente reformular sua pergunta.';
  }
  if (msg.includes('RESPOSTA_VAZIA')) {
    return '🤔 Não obtive resposta. Tente reformular sua pergunta.';
  }
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
    return '📡 Sem conexão com a internet.\n\nEmergências: Defesa Civil **(81) 3469-5701**';
  }

  return '⚠️ Erro inesperado. Abra o console (F12) para ver o detalhe.\n\nAjuda imediata: **(81) 3469-5701**';
}

/* ─────────────────────────────────────────
   PERGUNTA RÁPIDA
───────────────────────────────────────── */
function perguntaRapida(texto) {
  const input = document.getElementById('chat-input');
  if (input) { input.value = texto; autoResize(input); }
  enviarMensagem();
}

/* ─────────────────────────────────────────
   ADICIONAR MENSAGEM NO CHAT
───────────────────────────────────────── */
function adicionarMensagem(texto, tipo) {
  const container = document.getElementById('chat-mensagens');
  if (!container) return;

  const div = document.createElement('div');
  div.className = `msg ${tipo}`;

  const html = texto
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g,     '<em>$1</em>')
    .replace(/\n/g,             '<br>');

  div.innerHTML = `
    <span class="msg-avatar">${tipo === 'bot' ? '🤖' : '👤'}</span>
    <div class="msg-balao">${html}</div>
  `;

  container.appendChild(div);
  requestAnimationFrame(() => {
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  });

  if (tipo === 'bot') notificarBadgeChat();
}

/* ─────────────────────────────────────────
   ANIMAÇÃO "DIGITANDO"
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   UTILITÁRIOS
───────────────────────────────────────── */
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
  const oculto   = !viewChat
                || viewChat.style.display === 'none'
                || viewChat.style.display === '';
  if (oculto) {
    document.getElementById('nav-chat')?.classList.add('has-badge');
  }
}

/* ─────────────────────────────────────────
   TESTE DE CONEXÃO ao carregar a página
───────────────────────────────────────── */
async function testarConexaoGemini() {
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`,
      { signal: controller.signal }
    );

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      console.warn(`[Gemini] Teste falhou HTTP ${resp.status}:`, err?.error?.message);
      setStatusChat('⚠️ API indisponível', false);
    } else {
      console.info('[Gemini] ✅ Conexão OK — pronto para uso');
    }
  } catch (e) {
    console.warn('[Gemini] Sem conexão:', e.message);
    setStatusChat('📡 Sem conexão', false);
  }
}

document.addEventListener('DOMContentLoaded', testarConexaoGemini);

async function enviarPergunta(prompt) {
  const response = await fetch("/.netlify/functions/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(data);
    alert(data.error || "Erro ao consultar a API");
    return;
  }

  console.log(data.text);
  return data.text;
}

document.getElementById("enviar").addEventListener("click", async () => {
  const prompt = document.getElementById("prompt").value;
  const respostaDiv = document.getElementById("resposta");

  respostaDiv.innerText = "Carregando...";

  const response = await fetch("/.netlify/functions/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();

  if (!response.ok) {
    respostaDiv.innerText = data.error || "Erro";
    return;
  }

  respostaDiv.innerText = data.text;
});







