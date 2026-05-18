import { Link } from 'react-router-dom'
import dtoLogo from '../../../assets/d-to-logo.png'

function AuthLogo({ className = '', linkClassName, to }) {
  const image = <img className={`w-auto object-contain ${className}`.trim()} src={dtoLogo} alt="D-TO" />

  if (!to) {
    return image
  }

  return (
    <Link className={linkClassName} to={to} aria-label="D-TO 홈">
      {image}
    </Link>
  )
}

export default AuthLogo
