import { startSocialLogin } from '../../../api/authApi.js'
import SocialLoginButton from './SocialLoginButton.jsx'

const providers = ['naver', 'kakao', 'google']

export default function SocialLoginGroup({ onSocialLogin = startSocialLogin }) {
  return (
    <>
      <div className="my-10 grid grid-cols-[1fr_auto_1fr] items-center gap-8 max-sm:my-8 max-sm:gap-4">
        <span className="h-px bg-border" aria-hidden="true" />
        <p className="m-0 text-body-sm font-extrabold uppercase text-ink max-sm:whitespace-nowrap max-sm:text-caption">
          다른 계정으로 계속하기
        </p>
        <span className="h-px bg-border" aria-hidden="true" />
      </div>

      <div className="grid w-full justify-items-center gap-5">
        {providers.map((provider) => (
          <SocialLoginButton key={provider} provider={provider} onClick={onSocialLogin} />
        ))}
      </div>
    </>
  )
}
