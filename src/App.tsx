import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './app/page/login/LoginPage';



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element= {<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </BrowserRouter>
  )
}
