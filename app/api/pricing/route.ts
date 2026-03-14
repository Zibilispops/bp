import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: Request) {
  const { complexity, cost, positioning } = await req.json()

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    system:
      'You are a product strategist for a DTG printing business specializing in Japanese streetwear. Respond only with the formatted analysis, no preamble.',
    messages: [
      {
        role: 'user',
        content: `TASK: Analyze this design and suggest price points.\n\nINPUT:\n- Design complexity: ${complexity}\n- Production cost: ${cost}\n- Positioning: ${positioning}\n- Brand: THREAD (Japanese youth streetwear, ages 18-28)\n- Market: Japan\n\nOUTPUT FORMAT:\n- **Production Cost**: ¥X\n- **Recommended Price**: ¥X\n- **Justification**: [2-3 sentences]\n- **Alternative Pricing**: [3 tiers with rationale]\n\nCONSTRAINTS:\n- Competitive for Japanese streetwear market\n- Margin 40-50%\n- Note seasonal variations\n- Currency in ¥`,
      },
    ],
  })

  const text =
    message.content[0].type === 'text' ? message.content[0].text : ''
  return NextResponse.json({ result: text })
}
