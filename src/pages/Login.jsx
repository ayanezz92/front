import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Sparkles, ArrowRight, Eye, EyeOff, Heart, PawPrint } from "lucide-react";
import { toast } from "sonner";
import { usuariosService } from "../services/usuariosService"; // 👈 IMPORTACIÓN DEL SERVICIO REAL

// Importación segura de tu logo local
import logo from "../assets/logo.png";

const Login = () => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        nombre: "",
        email: "",
        password: "",
        aceptaTerminos: false,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email.trim() || !form.password) {
            toast.error("Por favor, rellena los campos obligatorios.");
            return;
        }

        if (form.password.length < 6) {
            toast.error("La contraseña debe incluir un mínimo de 6 caracteres.");
            return;
        }

        setLoading(true);

        try {
            if (isSignUp) {
                // 🚨 REGISTRO REAL EN EL MICROSERVICIO (Puerto 8081)
                await usuariosService.registrar({
                    nombre: form.nombre,
                    email: form.email,
                    contrasena: form.password, // Coincide con tu variable en Java
                    rol: "OPERADOR",           // Rol comunitario asignado por defecto
                    sucursal: "Puerto Montt"
                });

                toast.success(`¡Registro exitoso! Cuenta creada para ${form.nombre}. Ya puedes iniciar sesión.`);
                // Limpiar campos y pasar a vista de Login
                setForm({ nombre: "", email: "", password: "", aceptaTerminos: false });
                setIsSignUp(false);
            } else {
                // 🚨 LOGIN REAL EN EL MICROSERVICIO (Opcional, usando fetch directo si no está mapeado)
                const response = await fetch("http://localhost:8080/ms-usuarios/api/usuarios/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: form.email,
                        contrasena: form.password
                    })
                });

                if (!response.ok) {
                    throw new Error("Credenciales inválidas o usuario inexistente.");
                }

                const data = await response.json();
                toast.success(`¡Sesión iniciada! Bienvenido/a ${data.nombre || ""}`);
                navigate("/inicio", { replace: true });
            }
        } catch (error) {
            console.error("Error en autenticación:", error);
            toast.error(error.message || "Ocurrió un error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-[calc(100vh-76px)] bg-[#FFFDF9] font-sans flex items-center justify-center p-4 md:p-10 lg:p-12 relative overflow-hidden">

            {/* Sistema de luces ambientales gigantes de fondo (Ambient Glow) */}
            <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full bg-[#EAF5ED] blur-[150px] pointer-events-none opacity-90" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#FDF1E2] blur-[150px] pointer-events-none opacity-90" />

            {/* 🚀 CONTENEDOR GIGANTE DE GRAN FORMATO */}
            <div className="w-full max-w-5xl min-h-[70vh] bg-white border border-slate-100 rounded-[3.5rem] shadow-[0_40px_100px_rgba(26,54,93,0.06)] overflow-hidden grid md:grid-cols-12 z-10 relative">

                {/* COLUMNA IZQUIERDA: BLOQUE DE COLOR DEGRADÉ AZUL - VERDE */}
                <div className="md:col-span-5 bg-gradient-to-br from-[#1A365D] via-[#143d5c] to-[#256944] p-10 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />

                    {/* Identidad de la Marca */}
                    <div className="space-y-2.5 relative z-10">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="Logo" className="w-10 h-10 bg-white rounded-2xl p-1.5 shadow-md" />
                            <span className="font-serif font-black text-white text-lg tracking-tight">Sanos y Salvos</span>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest font-extrabold text-[#22C55E] bg-white/10 px-3 py-1 rounded-full w-fit">Plataforma Comunitaria</p>
                    </div>

                    {/* Mensajes de Valor */}
                    <div className="space-y-8 my-auto relative z-10 py-6">
                        <div className="flex items-start gap-4">
                            <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                <Heart className="w-4 h-4 text-[#F5A524]" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-white tracking-tight">Adopciones Responsables</p>
                                <p className="text-xs text-slate-300 font-normal leading-relaxed">
                                    Postula de forma digital y haz seguimiento en tiempo real del estado de tus solicitudes desde tu panel personal.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                <PawPrint className="w-4 h-4 text-[#F5A524]" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-white tracking-tight">Reportes Vecinales Inteligentes</p>
                                <p className="text-xs text-slate-300 font-normal leading-relaxed">
                                    Sube alertas geolocalizadas de mascotas perdidas o encontradas vinculadas directamente a nuestro motor de coincidencia comunitaria.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-[10px] text-slate-400 font-semibold tracking-wide relative z-10">
                        Infraestructura segura vinculada a ms-usuarios AWS.
                    </div>
                </div>

                {/* COLUMNA DERECHA: FORMULARIO BLANCO/CREMA TINTADO */}
                <div className="md:col-span-7 p-10 md:p-14 bg-white flex flex-col justify-center">

                    <div className="flex flex-col space-y-3 mb-6">
                        <div className="flex justify-start">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold bg-[#EAF5ED] text-[#256944] uppercase tracking-wider border border-[#C8E6C9]/30">
                <Sparkles className="h-3.5 w-3.5" /> Autenticación de Usuario
              </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 tracking-tight leading-none">
                            {isSignUp ? "Crea tu cuenta comunitaria" : "Ingresar a la plataforma"}
                        </h1>
                        <p className="text-xs text-slate-400 font-normal leading-relaxed">
                            {isSignUp ? "Únete hoy mismo a la red de cuidado y bienestar animal de Puerto Montt." : "Gestiona tus alertas, adopciones y aportes de forma ágil."}
                        </p>
                    </div>

                    {/* SWITCH SLIDER */}
                    <div className="bg-[#FFFDF9] border border-slate-200 p-1.5 rounded-2xl flex max-w-[320px] mb-6 shadow-2xs">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(false)}
                            className={`flex-1 py-2.5 text-center text-xs font-black rounded-xl transition-all ${!isSignUp ? "bg-[#1A365D] text-white shadow-sm" : "text-slate-400 hover:text-slate-700"}`}
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsSignUp(true)}
                            className={`flex-1 py-2.5 text-center text-xs font-black rounded-xl transition-all ${isSignUp ? "bg-[#1A365D] text-white shadow-sm" : "text-slate-400 hover:text-slate-700"}`}
                        >
                            Registrarse
                        </button>
                    </div>

                    {/* CAMPOS CON TINTE PASTEL */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {isSignUp && (
                            <div className="space-y-1.5 animate-in fade-in zoom-in-95 duration-200">
                                <label className="block text-xs font-bold text-slate-500 flex items-center gap-1">
                                    <User className="w-3.5 h-3.5 text-slate-400" /> Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Juan Pérez Soto"
                                    value={form.nombre}
                                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                    required={isSignUp}
                                    className="w-full px-5 py-3.5 rounded-xl border border-blue-100/50 bg-[#EFF4FF]/50 text-xs text-slate-700 font-bold focus:outline-none focus:border-[#1A365D] focus:bg-white transition-all shadow-2xs"
                                />
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5 text-slate-400" /> Correo electrónico
                            </label>
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                                className="w-full px-5 py-3.5 rounded-xl border border-blue-100/50 bg-[#EFF4FF]/50 text-xs text-slate-700 font-bold focus:outline-none focus:border-[#1A365D] focus:bg-white transition-all shadow-2xs"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 flex items-center gap-1">
                                <Lock className="w-3.5 h-3.5 text-slate-400" /> Contraseña
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                    className="w-full px-5 py-3.5 pr-12 rounded-xl border border-blue-100/50 bg-[#EFF4FF]/50 text-xs text-slate-700 font-bold focus:outline-none focus:border-[#1A365D] focus:bg-white transition-all shadow-2xs"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {isSignUp && (
                            <div className="flex items-start gap-2.5 pt-1 animate-in fade-in duration-200">
                                <input
                                    type="checkbox"
                                    id="user-terms-extended"
                                    checked={form.aceptaTerminos}
                                    onChange={(e) => setForm({ ...form, aceptaTerminos: e.target.checked })}
                                    required
                                    className="mt-0.5 rounded text-[#1A365D] focus:ring-0 w-4 h-4 cursor-pointer"
                                />
                                <label htmlFor="user-terms-extended" className="text-[10px] text-slate-400 font-semibold select-none leading-relaxed cursor-pointer">
                                    Acepto el acuerdo de adopción responsable y las normativas comunitarias de veracidad.
                                </label>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1A365D] hover:bg-[#102444] text-white font-extrabold py-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 mt-4 h-12 tracking-wide uppercase"
                        >
                            {loading ? "Procesando credenciales..." : isSignUp ? "Registrar nueva cuenta" : "Ingresar ahora"}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    <div className="mt-8 border-t border-slate-50 pt-5 text-center">
                        <Link to="/inicio" className="text-xs font-bold text-[#256944] hover:underline">
                            ← Volver a la página principal
                        </Link>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Login;