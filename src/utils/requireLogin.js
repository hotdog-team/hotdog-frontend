export function redirectToLogin(navigate, from) {
  navigate('/login', { state: { from } })
}
