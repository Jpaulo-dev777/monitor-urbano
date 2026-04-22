export default async function handler(req, res) {
  // 1. Só aceita requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use o método POST.' });
  }

  // 2. Pega a Chave da API configurada no Vercel
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'A Chave da API (GEMINI_API_KEY) não foi encontrada no Vercel.' });
  }

  try {
    const textoUsuario = req.body.texto;
    if (!textoUsuario) {
      return res.status(400).json({ error: 'Nenhum texto recebido do chat.' });
    }

    // 3. Comunicação com a API do Google (Usando Gemini 1.5 Flash)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    // FORMATO EXATO QUE O GOOGLE EXIGE:
    const payload = {
      contents: [{
        parts: [{ text: textoUsuario }]
      }]
    };

    const googleResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const googleData = await googleResponse.json();

    // 4. Se o Google barrar, repassamos o motivo exato pro frontend
    if (!googleResponse.ok) {
      return res.status(googleResponse.status).json({ 
        error: 'Erro na API do Google', 
        detalhes: googleData.error?.message || googleData 
      });
    }

    // 5. Sucesso! Pega a resposta da IA e devolve
    const respostaIA = googleData.candidates[0].content.parts[0].text;
    return res.status(200).json({ text: respostaIA });

  } catch (error) {
    console.error("Erro no Vercel:", error);
    return res.status(500).json({ error: 'Erro interno no servidor do Vercel.', detalhes: error.message });
  }
}
