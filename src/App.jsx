import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LoginPage from './features/auth/pages/LoginPage.jsx'
import HomePage from './features/main/pages/HomePage.jsx'
import MyOrders from './features/mypage/pages/MyOrders.jsx'
import ResetPasswordCompletePage from './features/auth/pages/ResetPasswordCompletePage.jsx'
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage.jsx'
import ResetPasswordConfirmPage from './features/auth/pages/ResetPasswordConfirmPage.jsx'
import ProductDetailPage from './features/shop/pages/ProductDetailPage.jsx'
import ProductListPage from './features/shop/pages/ProductListPage.jsx'
import SignUpPage from './features/auth/pages/SignUpPage.jsx'
import { useAuthStore } from './store/useAuthStore';
import SocialSuccessPage from './features/auth/pages/SocialSuccessPage.jsx';
import RequireAuth from "./features/auth/RequireAuth.jsx";
import GlobalLayout from "./common/GlobalLayout.jsx";

function LoginEntry() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  return <LoginPage />
}

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
        <Route path="/" element={<LoginEntry />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/reset-password/complete" element={<ResetPasswordCompletePage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordConfirmPage />} />
        <Route path="/social-success" element={<SocialSuccessPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<GlobalLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/shop" element={<ProductListPage />} />
          <Route path="/shop/:productId" element={<ProductDetailPage />} />
          <Route path="/orders" element={<MyOrders />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={1800}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App
