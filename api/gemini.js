/* ─────────────────────────────────────────
   CHAMAR API GEMINI (VIA VERCEL BACKEND)
───────────────────────────────────────── */
async function chamarGemini(pergunta) {
  // Adiciona a pergunta do usuário no histórico
  historicoChat.push({ role: 'user', parts: [{ text: pergunta }] });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); 

  let resp;
  try {
    // ⚠️ AQUI ESTÁ A MÁGICA: Agora chamamos o seu próprio servidor Vercel!
    resp = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: historicoChat,
        systemPrompt: SYSTEM_PROMPT
      }),
      signal: controller.signal
    });
  } catch (erro) {
    clearTimeout(timeoutId);
    throw new Error('Falha na conexão com o servidor.');
  }

  clearTimeout(timeoutId);

  // Tratamento de erro caso o Vercel devolva problema
  if (!resp.ok) {
    const errorData = await resp.json().catch(() => ({}));
    throw new Error(`Erro: ${errorData.error || resp.statusText}`);
  }
  
  const data = await resp.json();
  const texto = data.text; // O backend devolve apenas { text: "..." }

  if (!texto) throw new Error('Resposta vazia');

  // Adiciona a resposta da IA no histórico
  historicoChat.push({ role: 'model', parts: [{ text: texto }] });

  // Mantém apenas as últimas 10 mensagens na memória
  if (historicoChat.length > 10) {
    historicoChat = historicoChat.slice(-10);
    if (historicoChat[0]?.role !== 'user') historicoChat = historicoChat.slice(1);
  }

  return texto;
}
