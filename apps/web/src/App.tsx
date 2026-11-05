import Header from './components/Header'
import Hero from './components/Hero'
import Showcase from './components/Showcase'
import EditorialBanner from './components/EditorialBanner'
import Benefits from './components/Benefits'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Showcase />
        <EditorialBanner />
        <Benefits />
      </main>
      <Footer />
    </>
  )
}
