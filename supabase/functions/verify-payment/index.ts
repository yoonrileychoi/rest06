// 결제 서버 검증 Edge Function
// Iamport 가맹점 코드 연동 후 활성화할 것
// usePayment.js에서 supabase.from('r06_purchases').insert() 대신 이 함수 호출

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    const { imp_uid, course_id, amount } = await req.json()

    // 1. JWT 검증
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return jsonResponse({ error: '로그인이 필요합니다.' }, 401)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.slice(7)
    )
    if (authError || !user) {
      return jsonResponse({ error: '인증에 실패했습니다.' }, 401)
    }

    // 2. Iamport 액세스 토큰 발급
    const IMP_KEY = Deno.env.get('IAMPORT_API_KEY')!
    const IMP_SECRET = Deno.env.get('IAMPORT_API_SECRET')!

    const tokenRes = await fetch('https://api.iamport.kr/users/getToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imp_key: IMP_KEY, imp_secret: IMP_SECRET }),
    })
    const tokenData = await tokenRes.json()
    if (tokenData.code !== 0) {
      return jsonResponse({ error: 'Iamport 인증 실패' }, 500)
    }
    const iamportToken = tokenData.response.access_token

    // 3. imp_uid로 실제 결제 정보 조회
    const paymentRes = await fetch(`https://api.iamport.kr/payments/${imp_uid}`, {
      headers: { 'Authorization': iamportToken },
    })
    const paymentData = await paymentRes.json()
    const payment = paymentData.response

    // 4. 금액 검증 — 클라이언트 조작 방지
    if (payment.status !== 'paid' || payment.amount !== amount) {
      return jsonResponse({ error: '결제 금액이 일치하지 않습니다.' }, 400)
    }

    // 5. 중복 결제 방지
    const { data: existing } = await supabase
      .from('r06_purchases')
      .select('id')
      .eq('imp_uid', imp_uid)
      .single()

    if (existing) {
      return jsonResponse({ error: '이미 처리된 결제입니다.' }, 409)
    }

    // 6. 검증 통과 후 DB insert
    const { error: insertError } = await supabase.from('r06_purchases').insert({
      user_id: user.id,
      course_id,
      imp_uid,
      merchant_uid: payment.merchant_uid,
      amount,
      paid_at: new Date(payment.paid_at * 1000).toISOString(),
    })

    if (insertError) {
      return jsonResponse({ error: 'DB 저장에 실패했습니다.' }, 500)
    }

    return jsonResponse({ success: true })

  } catch (err) {
    return jsonResponse({ error: err.message }, 500)
  }
})
