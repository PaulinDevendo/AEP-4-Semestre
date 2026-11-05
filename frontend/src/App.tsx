import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Shell from './pages/Shell'
import Home from './pages/Home'
import { STAFF_PATH, useSession } from './data/auth'

const Category = lazy(() => import('./pages/Category'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Panel = lazy(() => import('./pages/staff/Panel'))

/** Sem sessão, /atendente parece uma 404 — e só ela tem a porta "moda". */
function StaffRoute() {
  return useSession() ? <Panel /> : <NotFound door />
}

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="categoria/:slug" element={<Category />} />
          <Route path="produto/:id" element={<ProductPage />} />
          <Route path="entrar" element={<Login />} />
        </Route>
        <Route path={STAFF_PATH} element={<StaffRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
