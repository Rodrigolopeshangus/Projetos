import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `Você é a assistente virtual da Isabella Médici Beauty, especializada em cílios e sobrancelhas.
Seu papel é ajudar os clientes a agendar serviços de forma amigável e profissional.

Serviços disponíveis:
CÍLIOS:
- Alongamento Clássico — R$180 — 120min
- Volume Russo — R$220 — 150min
- Mega Volume — R$260 — 180min
- Lash Lifting + Botox — R$150 — 90min
- Manutenção de Cílios — R$120 — 90min

SOBRANCELHAS:
- Design de Sobrancelha — R$60 — 45min
- Henna de Sobrancelha — R$80 — 60min
- Micropigmentação — R$450 — 120min
- Brow Lamination — R$130 — 75min
- Sobrancelha a Navalha — R$70 — 50min

Horários disponíveis: Segunda a Sábado, das 9h às 19h.

Fluxo de agendamento:
1. Pergunte qual serviço a cliente quer.
2. Pergunte a data preferida.
3. Ofereça horários disponíveis (ex: 9h, 10h30, 14h, 16h).
4. Confirme o agendamento com nome e WhatsApp da cliente (já obtidos no login).
5. Informe que ela receberá confirmação via WhatsApp.

Regras:
- Seja sempre gentil, feminino e profissional.
- Não invente horários — use os do fluxo acima como exemplo.
- Não cobre nada — o pagamento é feito presencialmente.
- Responda no idioma da mensagem recebida.
- Mantenha respostas curtas e diretas.`

export async function POST(req: NextRequest) {
  const { messages, locale, userName, userPhone } = await req.json()

  const apiKey = process.env.OPENAI_API_KEY

  // Fallback inteligente sem API key
  if (!apiKey) {
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() ?? ''
    const reply = generateFallbackReply(lastMessage, userName, locale)
    return NextResponse.json({ reply })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT + `\n\nCliente: ${userName ?? 'Cliente'}, WhatsApp: ${userPhone ?? 'não informado'}` },
          ...messages,
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content ?? 'Desculpe, não consegui processar sua mensagem.'
    return NextResponse.json({ reply })
  } catch {
    return NextResponse.json({ reply: 'Desculpe, ocorreu um erro. Por favor, entre em contato pelo WhatsApp.' })
  }
}

function generateFallbackReply(input: string, name?: string, locale?: string): string {
  const greet = name ? `${name.split(' ')[0]}` : 'você'

  if (input.includes('cílio') || input.includes('lash') || input.includes('cilios')) {
    return `Ótima escolha, ${greet}! Temos os seguintes serviços de cílios:\n\n• Alongamento Clássico — R$180\n• Volume Russo — R$220\n• Mega Volume — R$260\n• Lash Lifting + Botox — R$150\n• Manutenção — R$120\n\nQual você prefere?`
  }
  if (input.includes('sobrancelha') || input.includes('brow') || input.includes('ceja')) {
    return `Perfeito, ${greet}! Para sobrancelhas temos:\n\n• Design — R$60\n• Henna — R$80\n• Micropigmentação — R$450\n• Brow Lamination — R$130\n• Navalha — R$70\n\nQual você deseja?`
  }
  if (input.includes('data') || input.includes('dia') || input.includes('quando') || input.includes('horário')) {
    return `Atendemos de segunda a sábado, das 9h às 19h. Qual data você prefere? 📅`
  }
  if (input.includes('segunda') || input.includes('terça') || input.includes('quarta') || input.includes('quinta') || input.includes('sexta') || input.includes('sábado')) {
    return `Ótimo! Para esse dia temos disponibilidade às: 9h, 10h30, 14h e 16h. Qual horário fica melhor para você?`
  }
  if (input.includes('confirmar') || input.includes('agendar') || input.includes('marcar')) {
    return `Perfeito, ${greet}! Seu agendamento está confirmado. Você receberá uma confirmação no seu WhatsApp em breve. Qualquer dúvida, estamos à disposição! 💕`
  }
  return `Olá, ${greet}! Sou a assistente da Isabella Médici Beauty. Posso ajudar você a agendar serviços de **cílios** ou **sobrancelhas**. O que você gostaria? 😊`
}
