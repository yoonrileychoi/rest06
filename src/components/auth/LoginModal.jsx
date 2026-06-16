import { useAuth } from '../../context/AuthContext'
import './LoginModal.css'

export default function LoginModal({ onClose }) {
  const { signInWithGoogle, signInWithKakao } = useAuth()

  const handleGoogle = async () => {
    await signInWithGoogle()
    onClose()
  }

  const handleKakao = async () => {
    await signInWithKakao()
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="닫기">✕</button>
        <div className="modal__logo"><span className="dot">D</span>Dream<b>IT</b></div>
        <h2 className="modal__title">로그인</h2>
        <p className="modal__sub">소셜 계정으로 간편하게 시작하세요</p>

        <div className="modal__btns">
          <button className="social-btn social-btn--google" onClick={handleGoogle}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google로 로그인
          </button>

          <button className="social-btn social-btn--kakao" onClick={handleKakao}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#3C1E1E">
              <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.713 1.613 5.1 4.063 6.536L5.1 21l4.574-3.044C10.1 18.063 11.037 18.15 12 18.15c5.523 0 10-3.477 10-7.35C22 6.477 17.523 3 12 3z"/>
            </svg>
            카카오로 로그인
          </button>
        </div>

        <p className="modal__terms">
          로그인 시 <a href="#">이용약관</a> 및 <a href="#">개인정보처리방침</a>에 동의합니다.
        </p>
      </div>
    </div>
  )
}
