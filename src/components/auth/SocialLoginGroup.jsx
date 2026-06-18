import { startSocialLogin } from '../../api/authApi.js'
import SocialLoginButton from './SocialLoginButton.jsx'

const providers = ['naver', 'kakao', 'google']

export default function SocialLoginGroup({ onSocialLogin = startSocialLogin, className = '' }) {
  return (
    <div className={className} role="group" aria-label="소셜 로그인">
      <div className="grid grid-cols-divider items-center gap-4 mb-5" aria-hidden="true">
        <span className="h-px bg-border" />
        <p className="my-0 text-body-sm font-medium text-muted">
          소셜 로그인
        </p>
        <span className="h-px bg-border" />
      </div>

      <ul className="mt-6 flex list-none items-center justify-center gap-4 p-0">
        {providers.map((provider) => (
          <li key={provider}>
            <SocialLoginButton provider={provider} onClick={onSocialLogin} />
          </li>
        ))}
      </ul>
    </div>
  )
}
