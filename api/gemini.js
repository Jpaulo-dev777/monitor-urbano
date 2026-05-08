export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use o método POST.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'A Chave da API (GEMINI_API_KEY) não foi encontrada no Vercel.' });
  }

  try {
    const textoUsuario = req.body.texto;
    if (!textoUsuario) {
      return res.status(400).json({ error: 'Nenhum texto recebido do chat.' });
    }

    // ✅ Modelo atualizado para 1.5-flash (gratuito e estável)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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

    if (!googleResponse.ok) {
      return res.status(googleResponse.status).json({ 
        error: 'Erro na API do Google', 
        detalhes: googleData.error?.message || googleData 
      });
    }

    const respostaIA = googleData.candidates[0].content.parts[0].text;
    return res.status(200).json({ text: respostaIA });

  } catch (error) {
    console.error("Erro no Vercel:", error);
    return res.status(500).json({ error: 'Erro interno no servidor do Vercel.', detalhes: error.message });
  }
}
