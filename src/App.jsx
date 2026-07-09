import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

// Importamos el nuevo Navbar global
import Navbar from "./components/Navbar.jsx";

// Importación de las vistas
import Inicio from "./pages/Inicio.jsx"; // 👈 Importamos tu nueva vista de inicio aquí
import Adopciones from "./pages/Adopciones.jsx";
import Donaciones from "./pages/Donaciones.jsx";
import Historial from "./pages/Historial.jsx";
import Mascotas from "./pages/Mascotas.jsx";
import ReportarMascota from "./pages/ReportarMascota.jsx";
import Usuarios from "./pages/Usuarios.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import Auth from "./pages/Auth.jsx";
import Login from "./pages/Login.jsx";
import RequireStaffAuth from "./components/RequireStaffAuth.jsx";

function App() {
    return (
        <BrowserRouter>
            {/* El menú superior fijo */}
            <Navbar />

            <main className="min-h-screen bg-slate-50">
                <Routes>
                    {/* 👇 Al entrar a la raíz de la web, ahora viaja directo a /inicio */}
                    <Route path="/" element={<Navigate to="/inicio" replace />} />
                    <Route path="/nosotros" element={<Nosotros />} />

                    {/* 👇 Enlazamos la ruta oficial de la landing page */}
                    <Route path="/inicio" element={<Inicio />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/login" element={<Login />} />

                    <Route path="/adopciones" element={<Adopciones />} />
                    <Route path="/donaciones" element={<Donaciones />} />
                    <Route path="/history" element={<Historial />} />
                    <Route path="/mascotas" element={<Mascotas />} />
                    <Route path="/reportar" element={<ReportarMascota />} />
                    <Route path="/usuarios" element={
                        <RequireStaffAuth>
                            <Usuarios />
                        </RequireStaffAuth>
                    } />
                </Routes>
            </main>

            <Toaster position="top-right" richColors />
        </BrowserRouter>
    );
}

export default App;