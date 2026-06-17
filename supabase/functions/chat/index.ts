import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SYSTEM_PROMPT = `당신은 드림아이티비즈(DreamIT BIZ) 온라인 IT 교육 플랫폼의 AI 학습 도우미 '드림봇'입니다.
수강생들의 IT 학습, 강좌 선택, 자격증 준비, 취업 정보에 관한 질문에 친절하고 전문적으로 답변해주세요.
제공 강좌: 풀스택 웹 개발 부트캠프, 정보처리기사, 파이썬 & 생성형 AI, React 실전, 엑셀 자동화, SQLD.
답변은 간결하게, 항상 한국어로 답변하세요.`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages } = await req.json()

    // service role key로 API 키 조회 (브라우저에 노출 안 됨)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: config, error } = await supabase
      .from('r06_chat_config')
      .select('solar_api_key, openai_api_key, preferred_provider')
      .eq('id', 1)
      .single()

    if (error || !config) {
      return new Response(
        JSON.stringify({ error: 'API 설정을 불러올 수 없습니다.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const useSolar = config.preferred_provider !== 'openai' && !!config.solar_api_key
    const endpoint = useSolar
      ? 'https://api.upstage.ai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions'
    const apiKey = useSolar ? config.solar_api_key : config.openai_api_key
    const model = useSolar ? 'solar-pro' : 'gpt-4o-mini'

    const aiRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    })

    if (!aiRes.ok) {
      const err = await aiRes.json().catch(() => ({}))
      return new Response(
        JSON.stringify({ error: err?.error?.message || `API 오류 ${aiRes.status}` }),
        { status: aiRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await aiRes.json()
    return new Response(
      JSON.stringify({ content: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
