// /api/gemini.js  ← pode manter o nome para não alterar o frontend
export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use o método POST.' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY; // ← Variável no Vercel
  if (!apiKey) {
    return res.status(500).json({ error: 'A chave DEEPSEEK_API_KEY não foi encontrada no Vercel.' });
  }

  try {
    const textoUsuario = req.body?.texto;
    if (!textoUsuario) {
      return res.status(400).json({ error: 'Nenhum texto recebido do chat.' });
    }

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

    const url = 'https://api.deepseek.com/chat/completions';

    const payload = {
      model: 'deepseek-chat', // ← DeepSeek-V3 (melhor custo-benefício)
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: textoUsuario,
        },
      ],
      max_tokens: 512,
      temperature: 0.7,
      stream: false,
    };

    // Timeout de 15 segundos (DeepSeek pode ser um pouco mais lento que Gemini)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const deepseekResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`, // ← DeepSeek usa Bearer token
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const deepseekData = await deepseekResponse.json();

    if (!deepseekResponse.ok) {
      return res.status(deepseekResponse.status).json({
        error: 'Erro na API do DeepSeek',
        detalhes: deepseekData?.error?.message || deepseekData,
      });
    }

    // Extrai o texto da resposta (formato OpenAI-compatível)
    const respostaIA = deepseekData?.choices?.[0]?.message?.content;

    if (!respostaIA) {
      return res.status(500).json({
        error: 'Texto não encontrado na resposta do DeepSeek.',
        detalhes: deepseekData,
      });
    }

    return res.status(200).json({ text: respostaIA });

  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Timeout: O DeepSeek demorou muito para responder.' });
    }

    console.error('Erro no Vercel (DeepSeek):', error);
    return res.status(500).json({
      error: 'Erro interno no servidor.',
      detalhes: error.message,
    });
  }
}
