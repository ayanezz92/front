import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, PawPrint } from "lucide-react";
import { toast } from "sonner";

// Importación segura con la ruta relativa directa hacia tus imágenes
import logo from "../assets/logo.png";

// Roles que tienen permitido entrar al panel interno (staff)
const ROLES_STAFF = ["ADMIN", "VETERINARIO", "OPERADOR"];

// Todo el tráfico pasa por el API Gateway: los microservicios ya no
// declaran su propio CORS (se centralizó en el Gateway) para evitar
// headers duplicados, así que llamarlos directo ya no es una opción.
const GATEWAY_URL = "http://localhost:8080";

const Auth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });

    const intentarLogin = async () => {
        const response = await fetch(`${GATEWAY_URL}/ms-usuarios/api/usuarios/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: form.email, contrasena: form.password }),
        });
        if (!response.ok) return null;
        return await response.json();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email.trim() || !form.password) {
            toast.error("Por favor, ingresa tus credenciales completas.");
            return;
        }
        if (form.password.length < 6) {
            toast.error("La contraseña debe contener al menos 6 caracteres.");
            return;
        }

        setLoading(true);
        try {
            const usuario = await intentarLogin();

            if (!usuario) {
                toast.error("Credenciales incorrectas o usuario inexistente.");
                return;
            }

            if (!ROLES_STAFF.includes((usuario.rol || "").toUpperCase())) {
                toast.error("Acceso denegado: esta cuenta no tiene permisos de staff.");
                return;
            }

            // Guardamos la sesión para que el panel (Usuarios.jsx) sepa quién entró
            localStorage.setItem("usuario", JSON.stringify(usuario));
            toast.success(`¡Autenticación exitosa! Bienvenido, ${usuario.nombre || ""}.`);
            navigate("/usuarios", { replace: true });
        } catch (error) {
            console.error("Error en autenticación de staff:", error);
            toast.error("No se pudo contactar al servidor. Verifica que el backend esté activo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white font-sans overflow-hidden">

            {/* COLUMNA IZQUIERDA: EL DEGRADÉ AZUL/VERDE CONTINUO (REPLICADO DE TU DISEÑO) */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#1A365D] via-[#163B66] to-[#256944] text-white relative">
                <div className="absolute inset-0 bg-black/5 pointer-events-none" />

                {/* Identidad Superior */}
                <Link to="/inicio" className="flex items-center gap-3 relative z-10">
                    <img src={logo} alt="Logo" className="h-10 w-10 bg-white rounded-xl p-1.5 shadow-sm" />
                    <span className="font-serif text-lg font-bold tracking-tight text-white">Sanos y Salvos</span>
                </Link>

                {/* Sección de Texto Inferior */}
                <div className="relative z-10 space-y-4">
                    <PawPrint className="h-9 w-9 text-[#EF6C00]" />
                    <h2 className="text-4xl font-serif font-bold leading-tight tracking-tight">
                        Panel administrador
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-xs font-normal">
                        Gestiona adopciones, reportes y la comunidad desde un solo lugar.
                    </p>
                </div>

                {/* Pie de Firma Sutil */}
                <div className="text-[10px] text-slate-400 font-semibold relative z-10">
                    © 2026 Sanos y Salvos · Sistema de Seguridad Staff
                </div>
            </div>

            {/* COLUMNA DERECHA: FORMULARIO BLANCO LIMPIO */}
            <div className="flex items-center justify-center p-8 sm:p-12 bg-white">
                <div className="w-full max-w-sm space-y-6">

                    {/* Cabecera Móvil */}
                    <div className="lg:hidden flex justify-center mb-4">
                        <Link to="/inicio" className="flex items-center gap-2">
                            <img src={logo} alt="Logo" className="h-9 w-9 object-contain" />
                            <span className="font-serif text-base font-bold text-[#1A365D]">Sanos y Salvos</span>
                        </Link>
                    </div>

                    {/* Bloque de Encabezado de Login */}
                    <div className="space-y-2">
                        <div className="flex justify-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#F1F5F9] text-[#64748B] uppercase tracking-wider border border-slate-200/60">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-400" /> Acceso staff
              </span>
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-slate-800 tracking-tight">Inicia sesión</h1>
                        <p className="text-xs text-slate-400 font-normal leading-relaxed">
                            Solo cuentas con rol administrador podrán acceder al panel.
                        </p>
                    </div>

                    {/* Formulario Estilizado */}
                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">

                        {/* Input Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-xs font-semibold text-slate-600">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="gerardo@gmail.com"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-[#EFF4FF] border-0 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#1A365D]/20 transition-all placeholder-slate-400"
                            />
                        </div>

                        {/* Input Contraseña */}
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-xs font-semibold text-slate-600">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-[#EFF4FF] border-0 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#1A365D]/20 transition-all"
                            />
                        </div>

                        {/* Botón de Envío con el Degradé Azul-Verde */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#1A365D] to-[#256944] hover:opacity-95 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all mt-6 h-11 flex items-center justify-center"
                        >
                            {loading ? "Verificando credenciales..." : "Iniciar sesión"}
                        </button>
                    </form>

                    {/* Nota al pie */}
                    <p className="text-[10px] text-center text-slate-400 font-medium pt-2">
                        El registro de administradores se realiza internamente.
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Auth;
