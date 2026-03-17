import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import PersonDetail from './pages/PersonDetail'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pessoa/:id" element={<PersonDetail />} />
      </Routes>
    </Layout>
  )
}
