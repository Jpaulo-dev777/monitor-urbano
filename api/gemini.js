export default async function handler(req, res) {
  // 1. Libera a segurança (CORS) para o navegador não bloquear (Evita o erro 405)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // 2. Responde a requisição fantasma "OPTIONS" com sucesso
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 3. Garante que só vai processar requisições do tipo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  try {
    // Pega os dados que o seu frontend (app.js) mandou
    const { messages, systemPrompt } = req.body;
    
    // Pega a chave secreta guardada lá no Vercel (Passo 1 que você fez antes)
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Chave da API (GEMINI_API_KEY) não encontrada no Vercel.' });
    }

    // 4. Monta o pacote para enviar para o Google Gemini
    const googleBody = {
      contents: messages,
      systemInstruction: {
        parts: [{ text: systemPrompt || "Você é um assistente útil." }]
      }
    };

    // 5. Chama o Google Gemini (Versão gemini-1.5-flash, que é rápida e gratuita)
    const googleResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(googleBody)
    });

    if (!googleResponse.ok) {
      const errorData = await googleResponse.json();
      console.error("Erro retornado pelo Google:", errorData);
      return res.status(googleResponse.status).json({ error: 'Erro na API do Google.' });
    }

    const data = await googleResponse.json();
    
    // 6. Pega a resposta e manda de volta para o seu frontend
    const textoBot = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ text: textoBot });

  } catch (error) {
    console.error("Erro interno no Vercel:", error);
    return res.status(500).json({ error: 'Erro interno no servidor do Vercel.' });
  }
}
