import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainDashboard from './features/dashboard/pages/mainDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
