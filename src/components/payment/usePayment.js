import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

export function usePayment() {
  const { user } = useAuth()
  const IMP_CODE = import.meta.env.VITE_IAMPORT_CODE

  const requestPayment = async ({ course, amount, pg = 'html5_inicis' }) => {
    if (!user) return { success: false, error: '로그인이 필요합니다.' }

    const IMP = window.IMP
    if (!IMP) return { success: false, error: '결제 모듈을 불러올 수 없습니다.' }

    IMP.init(IMP_CODE)

    return new Promise((resolve) => {
      IMP.request_pay(
        {
          pg,
          pay_method: 'card',
          merchant_uid: `dreamit_${course.id}_${Date.now()}`,
          name: course.title,
          amount,
          buyer_email: user.email,
          buyer_name: user.user_metadata?.full_name || user.email,
        },
        async (rsp) => {
          if (rsp.success) {
            const { error } = await supabase.from('r06_purchases').insert({
              user_id: user.id,
              course_id: course.id,
              imp_uid: rsp.imp_uid,
              merchant_uid: rsp.merchant_uid,
              amount,
              paid_at: new Date().toISOString(),
            })
            resolve({ success: !error, error: error?.message })
          } else {
            resolve({ success: false, error: rsp.error_msg })
          }
        }
      )
    })
  }

  return { requestPayment }
}
