// 헤더 메뉴, sidebar는 하위메뉴로 차용.
export const adminMenuSections = [
  {
    id: 'home',
    label: '홈',
    to: '/admin/dashboard',
  },
  {
    id: 'catalog',
    label: '상품 관리',
    to: '/admin/categories',
    sidebar: [
      { to: '/admin/categories', label: '카테고리 관리' },
      { to: '/admin/meta-tags', label: '메타태그 관리' },
      { to: '/admin/products', label: '등록 상품 관리' },
    ],
  },
  {
    id: 'orders',
    label: '주문·배송 관리',
    to: '/admin/orders',
  },
  {
    id: 'members',
    label: '회원 및 운영 관리',
    to: '/admin/moderation',
    sidebar: [
      { to: '/admin/moderation', label: '콘텐츠 모니터링 (문의)' },
      { to: '/admin/members', label: '회원 관리' },
    ],
  },
  {
    id: 'reviews',
    label: '리뷰 관리',
    to: '/admin/reviews',
  },
]

export function getAdminSectionByPath(pathname) {
  return adminMenuSections.find((section) => {
    if (pathname === section.to) {
      return true
    }
    return section.sidebar?.some((item) => pathname === item.to)
  })
}

export function isAdminSectionActive(section, pathname) {
  if (pathname === section.to) {
    return true
  }
  return section.sidebar?.some((item) => pathname === item.to) ?? false
}

const allPageLabels = adminMenuSections.flatMap((section) => {
  const entries = [[section.to, section.label]]
  if (section.sidebar) {
    section.sidebar.forEach((item) => entries.push([item.to, item.label]))
  }
  return entries
})

export const adminNavLabelsByPath = Object.fromEntries(allPageLabels)
