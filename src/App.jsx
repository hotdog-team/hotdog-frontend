import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import LoginPage from './features/auth/pages/LoginPage.jsx'
import ResetPasswordCompletePage from './features/auth/pages/ResetPasswordCompletePage.jsx'
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage.jsx'
import ResetPasswordConfirmPage from './features/auth/pages/ResetPasswordConfirmPage.jsx'
import SignUpPage from './features/auth/pages/SignUpPage.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname])

  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/reset-password/complete" element={<ResetPasswordCompletePage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordConfirmPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
