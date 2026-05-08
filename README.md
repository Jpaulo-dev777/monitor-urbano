# 🏙️ Monitor Urbano — Jaboatão dos Guararapes

Aplicação web mobile-first para monitoramento de ocorrências urbanas, previsão de chuvas e comunicação de emergência, voltada ao município de Jaboatão dos Guararapes - PE.

---

## 📋 Sobre o Projeto

O **Monitor Urbano** é uma **PWA (Progressive Web App)** que permite à população e agentes públicos registrar, visualizar e gerenciar ocorrências urbanas em tempo real — como alagamentos, barreiras, descarte irregular de lixo e outros problemas — diretamente no mapa da cidade.

---

## ✨ Funcionalidades

### 🗺️ Mapa Interativo (Leaflet.js + OpenStreetMap)
- Visualização de ocorrências com marcadores coloridos por tipo
- Mapa normal e modo fullscreen
- Filtro por chips e busca por endereço/tipo
- Zonas de risco demarcadas com polígonos
- Localização do usuário via GPS
- Rotas integradas: Google Maps, Waze e Apple Maps

### 📝 Gestão de Ocorrências (CRUD)
- Registro com tipo, endereço, descrição, urgência e foto
- Edição e remoção com confirmação
- Status: `Aberto` · `Em atendimento` · `Resolvido`
- Persistência via localStorage

### 🌧️ Previsão de Chuvas (Open-Meteo API)
- Dados em tempo real: mm/h, acumulado 24h, probabilidade, vento e umidade
- Classificação automática em 5 níveis: `NORMAL` → `ATENÇÃO` → `MODERADO` → `ALTO` → `CRÍTICO`
- Gráfico SVG por hora + timeline visual
- Mapa de zonas de risco com nível dinâmico
- Polling automático a cada 10 minutos
- Emissão manual de alertas com canais configuráveis (App, SMS, Rádio)

### 🚨 Sistema de Alertas Severos
- Modal de alerta com sirene sonora e vibração
- Disparo automático via API ou manual pelo operador
- Simulação com intervalo aleatório (5s a 20s)

### 🤖 Assistente IA (Gemini via `/api/gemini`)
- Chatbot especializado em clima, emergências e prevenção de desastres
- Contexto exclusivo: Jaboatão dos Guararapes
- Respostas em português com foco em informações acionáveis
- Perguntas rápidas pré-definidas

### 🔧 Outras Funcionalidades
- Tema claro/escuro
- Relógio em tempo real (atualiza a cada 10s)
- Geocoding via Nominatim + busca por CEP (ViaCEP)
- Sanitização de HTML contra XSS
- Contadores e KPIs (Alta urgência, Resolvidos, Em atendimento)

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| JavaScript (Vanilla) | Lógica principal |
| Leaflet.js | Mapas interativos |
| OpenStreetMap / Nominatim | Tiles e geocoding |
| Open-Meteo API | Previsão meteorológica |
| ViaCEP API | Busca de endereço por CEP |
| Gemini API | Assistente de IA |
| localStorage | Persistência local de dados |
| SVG inline | Ícones customizados por tipo |
