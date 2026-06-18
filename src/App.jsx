import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LoginPage from './features/auth/pages/LoginPage.jsx'
import HomePage from './features/main/pages/HomePage.jsx'
import MyOrders from './features/mypage/pages/MyOrders.jsx'
import MyBookmarks from './features/mypage/pages/MyBookmarks.jsx'
import MyInquiries from './features/mypage/pages/MyInquiries.jsx'
import MyReviews from './features/mypage/pages/MyReviews.jsx'
import MyA11ySettings from './features/mypage/pages/MyA11ySettings.jsx'
import ResetPasswordCompletePage from './features/auth/pages/ResetPasswordCompletePage.jsx'
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage.jsx'
import ResetPasswordConfirmPage from './features/auth/pages/ResetPasswordConfirmPage.jsx'
import ProductDetailPage from './features/shop/pages/ProductDetailPage.jsx'
import ProductListPage from './features/shop/pages/ProductListPage.jsx'
import RecentlyViewedPage from './features/shop/pages/RecentlyViewedPage.jsx'
import CartPage from './features/shop/pages/CartPage'
import CheckoutPage from "./features/shop/pages/CheckoutPage.jsx";
import SignUpPage from './features/auth/pages/SignUpPage.jsx'
import SignUpProfilePage from './features/auth/pages/SignUpProfilePage.jsx'
import { useAuthStore } from './store/useAuthStore';
import SocialSuccessPage from './features/auth/pages/SocialSuccessPage.jsx';
import RequireAuth from './features/auth/RequireAuth.jsx';
import RequireAdmin from './features/auth/RequireAdmin.jsx';
import GlobalLayout from './layout/GlobalLayout.jsx';
import OrderFlowLayout from './layout/OrderFlowLayout.jsx';
import MyPageLayout from './layout/MyPageLayout.jsx';
import MyPageProfile from './features/mypage/pages/MyPageProfile.jsx';
import AddressManagement from './features/mypage/pages/AddressManagement.jsx'
import AdminLayout from './layout/AdminLayout.jsx'
import AdminPlaceholderPage from './features/admin/pages/AdminPlaceholderPage.jsx'
import AdminDashboard from './features/admin/pages/AdminDashboard.jsx'
import CategoryManagement from './features/admin/pages/CategoryManagement.jsx'
import MetaTagManagement from './features/admin/pages/MetaTagManagement.jsx'
import MemberManagement from './features/admin/pages/MemberManagement.jsx'
import ModerationManagement from './features/admin/pages/ModerationManagement.jsx'
import ProductManagement from './features/admin/pages/ProductManagement.jsx'
import OrderManagement from './features/admin/pages/OrderManagement.jsx'
import NaverProductManagement from './features/admin/pages/NaverProductManagement';
import AdminReviewManagement from './features/admin/pages/AdminReviewManagement.jsx';
import OrderDetailPage from './features/order/pages/OrderDetailPage'
import PaymentSuccessPage from './features/payment/pages/PaymentSuccessPage'
import PaymentFailPage from './features/payment/pages/PaymentFailPage'


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
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<LoginEntry />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/reset-password/complete" element={<ResetPasswordCompletePage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordConfirmPage />} />
        <Route path="/social-success" element={<SocialSuccessPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/signup/profile" element={<SignUpProfilePage />} />
        </Route>
        <Route element={<GlobalLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/shop" element={<ProductListPage />} />
          <Route path="/shop/:productId" element={<ProductDetailPage />} />
          <Route path="/recent-products" element={<RecentlyViewedPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<OrderFlowLayout />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders/checkout" element={<CheckoutPage />} />
              <Route
                path="/mypage/orders/:orderId"
                element={<OrderDetailPage />}
              />
            </Route>
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/fail" element={<PaymentFailPage />} />
            <Route path="/mypage" element={<MyPageLayout />}>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<MyPageProfile />} />
              <Route path="settings" element={<MyA11ySettings />} />
              <Route path="orders" element={<MyOrders />} />
              <Route path="bookmarks" element={<MyBookmarks />} />
              <Route path="inquiries" element={<MyInquiries />} />
              <Route path="addresses" element={<AddressManagement />} />
              <Route path="reviews" element={<MyReviews />} />
            </Route>
          </Route>
        </Route>
        <Route element={<RequireAuth />}>
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="meta-tags" element={<MetaTagManagement />} />
            <Route path="members" element={<MemberManagement />} />

            <Route path="moderation" element={<ModerationManagement />} />
            <Route path="inquiries" element={<ModerationManagement />} />

            <Route path="products" element={<ProductManagement />} />
            <Route path="products/naver" element={<NaverProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />

            <Route path="reviews" element={<AdminReviewManagement />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={1800}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="light"
        role="status"
        aria-live="polite"
      />
    </>
  )
}

export default App