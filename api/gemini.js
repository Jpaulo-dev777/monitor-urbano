export default async function handler(req, res) {
  // 1. Bloqueia se não for POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  // 2. Pega a chave da API do painel do Vercel
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Chave da API não configurada no servidor Vercel.' });
  }

  try {
    // 3. Pega o texto que o frontend enviou
    const userText = req.body.texto;
    if (!userText) {
      return res.status(400).json({ error: 'Nenhum texto foi enviado pelo chat.' });
    }

    // 4. Monta a requisição EXATAMENTE como o Google pede
    const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const googleResponse = await fetch(googleUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: userText }]
        }]
      })
    });

    const googleData = await googleResponse.json();

    // 5. Se o Google deu erro, repassa o erro para sabermos o que foi
    if (!googleResponse.ok) {
      console.error("Erro retornado pelo Google:", googleData);
      return res.status(googleResponse.status).json({ 
        error: 'Erro na API do Google', 
        details: googleData 
      });
    }

    // 6. Extrai apenas o texto da resposta da IA e devolve para o site
    const respostaIA = googleData.candidates[0].content.parts[0].text;
    return res.status(200).json({ text: respostaIA });

  } catch (error) {
    console.error("Erro interno no Vercel:", error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}
