// api/gemini.js — Roda no servidor Vercel, chave NUNCA vai ao browser

export default async function handler(req, res) {

  // Apenas POST permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { messages, systemPrompt } = req.body;

  // Pega a chave do ambiente (nunca exposta ao cliente)
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Chave API não configurada no servidor' });
  }

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600,
          topP: 0.9,
        }
      })
    });

    if (!response.ok) {
      const erro = await response.json().catch(() => ({}));
      const msg = erro?.error?.message || `HTTP ${response.status}`;
      console.error('[Gemini API]', msg);
      return res.status(response.status).json({ error: msg });
    }

    const data = await response.json();
    const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!texto) {
      const motivo = data?.candidates?.[0]?.finishReason
                  || data?.promptFeedback?.blockReason
                  || 'desconhecido';
      return res.status(200).json({ error: `RESPOSTA_VAZIA::${motivo}` });
    }

    return res.status(200).json({ text: texto });

  } catch (err) {
    console.error('[Gemini] Erro interno:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
