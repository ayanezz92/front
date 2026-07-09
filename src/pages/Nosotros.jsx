import React from "react";
import { Heart, Stethoscope, Map, Users, Sparkles, MapPin, Mail } from "lucide-react";

// Importación del logo desde tu carpeta assets
import logo from "../assets/logo.png";

const valores = [
    { icon: Heart, t: "Empatía radical", d: "Cada caso es único y merece atención personalizada.", bg: "bg-rose-50 text-rose-600" },
    { icon: Stethoscope, t: "Cuidado profesional", d: "Red de veterinarios voluntarios certificados.", bg: "bg-[#EAF5ED] text-[#256944]" },
    { icon: Map, t: "Cobertura local", d: "Microservicios geolocalizados barrio por barrio.", bg: "bg-blue-50 text-blue-600" },
    { icon: Users, t: "Comunidad activa", d: "Más de 12.000 vecinos colaborando.", bg: "bg-amber-50 text-amber-700" },
];

const Nosotros = () => {
    return (
        <div className="min-h-screen bg-[#FFFDF9] font-sans overflow-x-hidden relative flex flex-col">

            {/* Sistema de iluminación ambiental (Ambient Glow) */}
            <div className="absolute top-[-5%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#EAF5ED] blur-[130px] pointer-events-none opacity-80" />
            <div className="absolute bottom-[20%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#FDF1E2] blur-[120px] pointer-events-none opacity-70" />

            {/* 1. SECCIÓN HISTORIA (HERO) */}
            <section className="relative overflow-hidden pt-20 pb-12 px-12 z-10">
                <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">

                    <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EAF5ED] text-[#256944] font-bold text-[10px] uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-[#256944]" /> Nuestra historia
            </span>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#1E293B] leading-[1.1] tracking-tight">
                            Nacimos para que <br />
                            <span className="text-[#1E5F44] italic">ningún animal esté solo.</span>
                        </h1>
                        <p className="text-sm text-slate-400 max-w-xl leading-relaxed font-normal">
                            Sanos y Salvos comenzó en Puerto Montt como una red de vecinos que rescataban mascotas perdidas. Hoy somos una plataforma tecnológica que une refugios, veterinarios y familias en toda la región.
                        </p>
                    </div>

                    {/* Tarjeta del Logo */}
                    <div className="relative flex justify-center lg:justify-end">
                        <div className="relative rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-4 border-white bg-white w-full max-w-md h-[380px] flex items-center justify-center p-8">
                            <img src={logo} alt="Logo Sanos y Salvos" className="w-56 h-56 object-contain" />
                        </div>
                    </div>

                </div>
            </section>

            {/* 2. SECCIÓN VALORES */}
            <section className="container mx-auto max-w-6xl px-12 py-16 z-10">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-slate-900 tracking-tight mb-12">
                    Lo que nos <span className="italic text-[#256944]">mueve</span>
                </h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {valores.map((v) => {
                        // 👇 Corregido: Extraemos el icono en una variable con mayúscula para que React lo compile bien
                        const IconComponent = v.icon;
                        return (
                            <div key={v.t} className="bg-white border border-slate-100/80 rounded-[2rem] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                                <div>
                                    <div className={`h-11 w-11 rounded-xl ${v.bg} grid place-items-center shadow-sm mb-5`}>
                                        <IconComponent className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2 tracking-tight">{v.t}</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed font-normal">{v.d}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 3. SECCIÓN MÉTRICAS GLOBALES */}
            <section className="container mx-auto max-w-6xl px-12 pb-24 z-10 mt-6">
                <div className="bg-[#1A365D] rounded-[2.5rem] text-white p-8 md:p-14 grid md:grid-cols-3 gap-8 text-center shadow-xl shadow-slate-200/40 border border-white/5 relative overflow-hidden">
                    {[
                        { n: "1.240", l: "Mascotas reunidas con su familia" },
                        { n: "486", l: "Adopciones responsables" },
                        { n: "12K+", l: "Voluntarios y donantes" },
                    ].map((s) => (
                        <div key={s.l} className="space-y-1">
                            <p className="text-4xl md:text-5xl font-serif font-bold text-[#F5A524] tracking-tight">{s.n}</p>
                            <p className="text-xs text-slate-300 font-medium">{s.l}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. FOOTER CORPORATIVO UNIFICADO */}
            <footer className="bg-[#1A365D] text-slate-300 py-12 px-12 mt-auto z-10 border-t border-white/5 shadow-inner">
                <div className="container mx-auto max-w-6xl grid md:grid-cols-3 gap-10 border-b border-white/10 pb-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg shadow-sm"><span className="text-xl">🐶</span></div>
                            <div>
                                <h2 className="font-bold text-white text-base leading-none">Sanos y Salvos</h2>
                                <p className="text-[9px] text-[#22C55E] font-extrabold tracking-widest uppercase mt-0.5">Cuidado Animal</p>
                            </div>
                        </div>
                        <p className="text-xs leading-relaxed max-w-sm text-slate-300 font-normal">
                            Reunimos mascotas perdidas con sus familias, gestionamos adopciones responsables y velamos por la salud animal en cada barrio.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-4 font-serif text-base tracking-tight">Servicios</h3>
                        <ul className="space-y-2 text-xs text-slate-300 font-medium">
                            <li><button type="button" className="hover:text-white transition-colors">Adopciones</button></li>
                            <li><button type="button" className="hover:text-white transition-colors">Reportar mascota</button></li>
                            <li><button type="button" className="hover:text-white transition-colors">Donar</button></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-4 font-serif text-base tracking-tight">Contacto</h3>
                        <ul className="space-y-3 text-xs text-slate-300 font-medium">
                            <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#F5A524]" /> Puerto Montt, Chile</li>
                            <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#F5A524]" /> hola@sanosysalvos.cl</li>
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center text-[10px] font-medium pt-6 text-slate-400">
                    <p>© 2026 Sanos y Salvos. Todos los derechos reservados.</p>
                    <p className="mt-2 md:mt-0">Hecho con 💛 para los AWS microservices</p>
                </div>
            </footer>

        </div>
    );
};

export default Nosotros;