import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import Usuarios from "./pages/Usuarios"
import Clientes from "./pages/Clientes"
import ProtectedRoute from "./components/ProtectedRoute"
import useUserData from './hooks/useUserData';

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />;
}

function RegisterAndLogout(){
  localStorage.clear()
  return <Register />;
}

function App() {
  const { user, loading, error } = useUserData();

  return (
  <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<ProtectedRoute>
            <Home user={user} loading={loading} error={error}/>
          </ProtectedRoute>} />
          <Route
          path="/usuarios"
          element={<ProtectedRoute>
            <Usuarios user={user} loading={loading} error={error}/>
          </ProtectedRoute>} />
          <Route
          path="/clientes"
          element={<ProtectedRoute>
            <Clientes user={user} loading={loading} error={error}/>
          </ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
