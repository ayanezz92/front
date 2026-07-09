import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, User } from "lucide-react";

// Importación de tu logo local
import logo from "../assets/logo.png";

const Navbar = () => {
    const location = useLocation();

    // Verifica la ruta activa para pintar la píldora azul marino
    const obtenerEstiloLink = (path) => {
        const estaActivo = location.pathname === path;
        return estaActivo
            ? "bg-[#1A365D] text-white px-4 py-1.5 rounded-full font-bold transition-all text-xs lg:text-sm shadow-sm"
            : "text-slate-500 hover:text-slate-900 font-semibold transition-colors text-xs lg:text-sm px-3 py-1.5 rounded-full hover:bg-slate-50/50";
    };

    return (
        <nav className="w-full bg-white/90 backdrop-blur-md px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-slate-100/80">

            {/* 1. LOGO E IDENTIDAD IZQUIERDA */}
            <Link to="/inicio" className="flex items-center gap-3 group">
                <img
                    src={logo}
                    alt="Sanos y Salvos"
                    className="w-8 h-8 object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div>
                    <h1 className="font-black text-[#1A365D] tracking-tight text-sm lg:text-base leading-none">Sanos y Salvos</h1>
                    <p className="text-[9px] text-[#22C55E] font-extrabold tracking-widest uppercase mt-1">Cuidado Animal</p>
                </div>
            </Link>

            {/* 2. ENLACES CENTRALES */}
            <div className="hidden md:flex items-center gap-1 lg:gap-3">
                <Link to="/inicio" className={obtenerEstiloLink("/inicio")}>Inicio</Link>
                <Link to="/adopciones" className={obtenerEstiloLink("/adopciones")}>Adopciones</Link>
                <Link to="/reportar" className={obtenerEstiloLink("/reportar")}>Reportar</Link>
                <Link to="/donaciones" className={obtenerEstiloLink("/donaciones")}>Donar</Link>
                <Link to="/nosotros" className={obtenerEstiloLink("/nosotros")}>Nosotros</Link>
            </div>

            {/* 3. BOTONES DE ACCIÓN DERECHOS */}
            <div className="flex items-center gap-2 lg:gap-3 text-[11px] font-bold">

                {/* Botón Panel de Administración */}
                <Link
                    to="/auth"
                    className={`flex items-center gap-1.5 border px-4 py-2 rounded-full shadow-sm transition-all ${
                        location.pathname === "/auth"
                            ? "bg-[#1A365D] text-white border-[#1A365D]"
                            : "border-slate-200 text-slate-600 bg-white hover:bg-slate-50"
                    }`}
                >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Panel admin
                </Link>

                {/* 👇 REEMPLAZADO: Botón de Inicio de Sesión / Crear Usuario General */}
                <Link
                    to="/login"
                    className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 shadow-md ${
                        location.pathname === "/login"
                            ? "bg-[#256944] text-white shadow-emerald-100"
                            : "bg-[#1A365D] hover:bg-[#102444] text-white shadow-slate-100"
                    }`}
                >
                    <User className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">Iniciar sesión</span>
                    <span className="lg:hidden">Ingresar</span>
                </Link>
            </div>

        </nav>
    );
};

export default Navbar;