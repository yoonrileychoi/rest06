import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SYSTEM_PROMPT = `당신은 드림아이티비즈(DreamIT BIZ) 온라인 IT 교육 플랫폼의 AI 학습 도우미 '드림봇'입니다.
수강생들의 IT 학습, 강좌 선택, 자격증 준비, 취업 정보에 관한 질문에 친절하고 전문적으로 답변해주세요.
제공 강좌: 풀스택 웹 개발 부트캠프, 정보처리기사, 파이썬 & 생성형 AI, React 실전, 엑셀 자동화, SQLD.
답변은 간결하게, 항상 한국어로 답변하세요.`

const RATE_LIMIT = 30 // 시간당 최대 메시지 수

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function jsonResponse(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // 요청 본문을 먼저 파싱 (body는 한 번만 읽을 수 있음)
    const { messages } = await req.json()

    // 1. JWT 검증 — 로그인 사용자만 허용
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return jsonResponse({ error: '로그인 후 이용하실 수 있습니다.' }, 401)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.slice(7)
    )
    if (authError || !user) {
      return jsonResponse({ error: '로그인 후 이용하실 수 있습니다.' }, 401)
    }

    // 2. Rate limit — 시간당 30회 제한
    const hourBucket = new Date()
    hourBucket.setMinutes(0, 0, 0)
    const hourBucketStr = hourBucket.toISOString()

    const { data: usage } = await supabase
      .from('r06_chat_usage')
      .select('count')
      .eq('user_id', user.id)
      .eq('hour_bucket', hourBucketStr)
      .single()

    if (usage && usage.count >= RATE_LIMIT) {
      return jsonResponse(
        { error: `1시간에 최대 ${RATE_LIMIT}회까지 사용할 수 있습니다. 잠시 후 다시 시도해주세요.` },
        429
      )
    }

    // 카운트 증가
    await supabase.from('r06_chat_usage').upsert(
      { user_id: user.id, hour_bucket: hourBucketStr, count: (usage?.count ?? 0) + 1 },
      { onConflict: 'user_id,hour_bucket' }
    )

    // 3. API 키 조회 (서버에서만 접근)
    const { data: config, error: configError } = await supabase
      .from('r06_chat_config')
      .select('solar_api_key, openai_api_key, preferred_provider')
      .eq('id', 1)
      .single()

    if (configError || !config) {
      return jsonResponse({ error: 'API 설정을 불러올 수 없습니다.' }, 500)
    }

    // 4. AI 호출
    const useSolar = config.preferred_provider !== 'openai' && !!config.solar_api_key
    const endpoint = useSolar
      ? 'https://api.upstage.ai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions'
    const apiKey = useSolar ? config.solar_api_key : config.openai_api_key
    const model = useSolar ? 'solar-pro' : 'gpt-4o-mini'

    const aiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 800,
        temperature: 0.7,
      }),
    })

    if (!aiRes.ok) {
      const err = await aiRes.json().catch(() => ({}))
      return jsonResponse({ error: err?.error?.message || `API 오류 ${aiRes.status}` }, aiRes.status)
    }

    const data = await aiRes.json()
    return jsonResponse({ content: data.choices[0].message.content })

  } catch (err) {
    return jsonResponse({ error: err.message }, 500)
  }
})
