import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useReveal } from '../hooks/useReveal'

export default function Shell() {
  const { pathname } = useLocation()
  useReveal(pathname)
  return (
    <>
      <Header />
      <main><Outlet /></main>
      <Footer />
    </>
  )
}
