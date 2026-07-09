import React from "react";
import 'leaflet/dist/leaflet.css';
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Shield, Sparkles, PawPrint, HandHeart, MapPin } from "lucide-react";

// Importación de imágenes
import heroPets from "../assets/logo.png";
import pet1 from "../assets/Luka.jpeg";
import pet2 from "../assets/Lia.jpeg";
import pet3 from "../assets/Kitty.jpeg";
import pet4 from "../assets/Kira.jpeg";

const stats = [
    { n: "1.240", l: "Mascotas reunidas" },
    { n: "486", l: "Adopciones felices" },
    { n: "$32M", l: "Donaciones recibidas" },
    { n: "97%", l: "Casos resueltos" },
];

const services = [
    { icon: PawPrint, title: "Reportar mascota", desc: "Sube una foto y ubicación. Activamos coincidencias automáticas en segundos.", href: "/reportar", color: "bg-[#1E5F74] text-white" },
    { icon: Heart, title: "Adoptar con amor", desc: "Encuentra a tu nuevo mejor amigo entre cientos de mascotas listas para un hogar.", href: "/adopciones", color: "bg-[#22C55E] text-white" },
    { icon: HandHeart, title: "Donar a la causa", desc: "Cada aporte se convierte en alimento, atención veterinaria y refugio.", href: "/donaciones", color: "bg-[#F5A524] text-white" },
    { icon: Shield, title: "Ficha médica", desc: "Historial veterinario unificado para cada mascota rescatada o adoptada.", href: "/usuarios", color: "bg-slate-700 text-white" },
];

const adoptables = [
    { img: pet1, name: "Luka", age: "4 meses", tag: "Juguetón" },
    { img: pet2, name: "Lia", age: "4 meses", tag: "Enojona" },
    { img: pet3, name: "Kitty", age: "1 año", tag: "Dócil" },
    { img: pet4, name: "Kira", age: "4 meses", tag: "Tímida" },
];

const Inicio = () => {
    return (
        <div className="min-h-screen bg-[#FFFDF9] font-sans overflow-x-hidden">

            {/* HERO SECTION CON EL GRADIENTE AMBIENTAL REPLICADO */}
            <section className="relative overflow-hidden py-16 lg:py-24 px-6 bg-[#FFFDF9]">
                {/* Esferas de luz difuminadas de fondo (Ambient Glow) */}
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#E8F5E9]/70 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-[#FDF0DF]/80 blur-[100px] pointer-events-none" />

                <div className="container mx-auto max-w-6xl relative grid lg:grid-cols-2 gap-12 items-center">

                    <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Plataforma de bienestar animal
            </span>

                        <h1 className="text-5xl md:text-6xl font-serif font-bold leading-[1.1] text-[#1E293B]">
                            Cada huella <br />
                            merece volver <br />
                            <span className="text-[#2E7D32] italic">a casa.</span>
                        </h1>

                        <p className="text-base text-slate-500 max-w-xl leading-relaxed">
                            Sanos y Salvos conecta familias, refugios y veterinarios para reunir mascotas perdidas, encontrar nuevos hogares y cuidar la salud de cada animal.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link to="/reportar" className="inline-flex items-center gap-2 bg-[#1A365D] hover:bg-[#102444] text-white px-6 py-3 rounded-full font-medium transition-all shadow-md text-sm">
                                <PawPrint className="w-4 h-4" /> Reportar una mascota
                            </Link>
                            <Link to="/adopciones" className="inline-flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-full font-medium transition-all shadow-sm text-sm">
                                Ver adopciones <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-200/60">
                            {stats.map((s) => (
                                <div key={s.l}>
                                    <p className="text-3xl font-bold text-[#1A365D] font-serif">{s.n}</p>
                                    <p className="text-xs text-slate-400 mt-1 font-medium leading-tight">{s.l}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* VISTA DERECHA CON CONTENEDOR ENLACE CORREGIDO */}
                    <div className="relative flex justify-center">
                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border-4 border-white bg-white w-full max-w-md h-[420px] flex items-center justify-center">
                            <img src={heroPets} alt="Logo" className="w-100 h-100 object-contain" />
                        </div>

                        {/* Tarjeta flotante izquierda */}
                        <div className="absolute -left-6 top-16 bg-white rounded-2xl shadow-xl shadow-slate-100/80 px-4 py-3 flex items-center gap-3 border border-slate-50">
                            <div className="h-9 w-9 rounded-full bg-[#E8F5E9] grid place-items-center">
                                <Heart className="h-4 w-4 text-[#2E7D32] fill-[#2E7D32]/20" />
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Hoy</p>
                                <p className="font-bold text-xs text-slate-800">3 reuniones</p>
                            </div>
                        </div>

                        {/* Tarjeta flotante derecha */}
                        <div className="absolute -right-4 bottom-16 bg-white rounded-2xl shadow-xl shadow-slate-100/80 px-4 py-3 flex items-center gap-3 border border-slate-50">
                            <div className="h-9 w-9 rounded-full bg-[#FFF3E0] grid place-items-center">
                                <MapPin className="h-4 h-4 text-[#EF6C00]" />
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Cerca de ti</p>
                                <p className="font-bold text-xs text-slate-800">12 reportes</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* SECCIÓN NUESTROS SERVICIOS (FONDO BLANCO LIMPIO) */}
            <section className="bg-white py-20 px-6 border-y border-slate-100">
                <div className="container mx-auto max-w-6xl">
                    <div className="max-w-2xl mb-12">
                        <p className="text-[#2E7D32] font-bold text-xs uppercase tracking-wider mb-2">Nuestros servicios</p>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 leading-tight">Todo lo que tu mascota necesita, en un solo lugar.</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((s) => (
                            <Link key={s.title} to={s.href} className="group bg-[#FFFDF9] border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
                                <div>
                                    <div className={`h-11 w-11 rounded-xl ${s.color} grid place-items-center shadow-sm mb-5`}>
                                        <s.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">{s.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                                </div>
                                <div className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#1A365D] group-hover:gap-2 transition-all">
                                    Saber más <ArrowRight className="h-3.5 w-3.5" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECCIÓN EN ADOPCIÓN CON FONDO CALIDO REPLICADO */}
            <section className="bg-[#FFFDF9] py-20 px-6 relative overflow-hidden">
                <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#FDF0DF]/60 blur-[100px] pointer-events-none" />

                <div className="container mx-auto max-w-6xl relative">
                    <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
                        <div className="max-w-xl">
                            <p className="text-[#2E7D32] font-bold text-xs uppercase tracking-wider mb-2">En adopción</p>
                            <h2 className="text-4xl font-serif font-bold text-slate-900 leading-tight">
                                Buscan una familia <span className="italic text-[#2E7D32]">como la tuya</span>
                            </h2>
                        </div>
                        <Link to="/adopciones" className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2 rounded-full text-xs font-medium transition-all shadow-sm">
                            Ver todas <ArrowRight className="w-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {adoptables.map((p) => (
                            <article key={p.name} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-slate-200/80">
                                <div className="aspect-[4/5] overflow-hidden bg-slate-50">
                                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-102 transition-all duration-500" />
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-slate-800">{p.name}</h3>
                                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-bold">{p.tag}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">{p.age}</p>
                                    <Link to="/adopciones" className="block text-center bg-[#22C55E] hover:bg-[#16A34A] text-white font-medium py-2 rounded-xl text-xs transition-all mt-4 shadow-sm">
                                        Adoptar a {p.name}
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECCIÓN DE DONACIONES */}
            <section className="container mx-auto max-w-6xl py-12 px-6">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-[#1A365D] p-8 md:p-12 text-white shadow-xl">
                    <div className="relative grid md:grid-cols-2 gap-10 items-center">
                        <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wider text-[#F5A524]">
                <HandHeart className="h-3.5 w-3.5" /> Tu aporte transforma vidas
              </span>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">Una donación, miles de colas felices.</h2>
                            <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
                                Con tan solo $5.000 ayudas a financiar una atención veterinaria de urgencia. Total transparencia: cada peso queda registrado.
                            </p>
                            <div className="flex flex-wrap gap-3 pt-2">
                                <Link to="/donaciones" className="inline-flex items-center gap-2 bg-[#F5A524] hover:bg-[#E0941F] text-slate-900 font-bold px-5 py-2.5 rounded-full text-xs transition-all shadow-md">
                                    <HandHeart className="w-3.5 w-3.5" /> Donar ahora
                                </Link>
                                <Link to="/donaciones" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-2.5 rounded-full text-xs transition-all">
                                    Ver historial
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { n: "$5.000", l: "Vacuna preventiva" },
                                { n: "$15.000", l: "Esterilización" },
                                { n: "$25.000", l: "Atención de urgencia" },
                                { n: "$50.000", l: "Refugio mensual" },
                            ].map((d) => (
                                <div key={d.l} className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                    <p className="text-2xl font-bold text-[#F5A524] font-serif">{d.n}</p>
                                    <p className="text-[11px] text-slate-300 mt-1 leading-tight">{d.l}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= BARRA DE FOOTER CORPORATIVO UNIFICADO ================= */}
            <footer className="bg-[#1A365D] text-slate-300 py-12 px-8 md:px-12 mt-auto border-t border-white/5 shadow-inner w-full font-sans z-10">
                <div className="container mx-auto max-w-6xl grid md:grid-cols-3 gap-10 border-b border-white/10 pb-10">

                    {/* Columna 1: Identidad Visual */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-xl shadow-sm flex items-center justify-center">
                                <span className="text-xl">🐶</span>
                            </div>
                            <div>
                                <h2 className="font-bold text-white text-base leading-none tracking-tight">Sanos y Salvos</h2>
                                <p className="text-[9px] text-[#22C55E] font-extrabold tracking-widest uppercase mt-1">Cuidado Animal</p>
                            </div>
                        </div>
                        <p className="text-xs leading-relaxed max-w-sm text-slate-300 font-normal">
                            Reunimos mascotas perdidas con sus familias, gestionamos adopciones responsables y velamos por la salud animal en cada barrio.
                        </p>
                    </div>

                    {/* Columna 2: Enlaces de Navegación Directos */}
                    <div>
                        <h3 className="text-white font-bold mb-4 font-serif text-base tracking-tight">Servicios</h3>
                        <div className="flex flex-col space-y-2 text-xs text-slate-400 font-semibold">
                            <a href="/adopciones" className="hover:text-white transition-colors w-fit">Adopciones</a>
                            <a href="/reportar" className="hover:text-white transition-colors w-fit">Reportar mascota</a>
                            <a href="/donaciones" className="hover:text-white transition-colors w-fit">Donar</a>
                        </div>
                    </div>

                    {/* Columna 3: Información de Contacto Regional */}
                    <div>
                        <h3 className="text-white font-bold mb-4 font-serif text-base tracking-tight">Contacto</h3>
                        <ul className="space-y-3 text-xs text-slate-400 font-semibold">
                            <li className="flex items-center gap-2">
                                {/* Icono de Ubicación SVG Nativo */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A524" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                                <span className="text-slate-300">Puerto Montt, Chile</span>
                            </li>
                            <li className="flex items-center gap-2">
                                {/* Icono de Correo SVG Nativo */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A524" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                </svg>
                                <span className="text-slate-300">hola@sanosysalvos.cl</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Fila Inferior de Créditos y Tecnologías */}
                <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center text-[10px] font-bold pt-6 text-slate-400/80 tracking-wide">
                    <p>© 2026 Sanos y Salvos. Todos los derechos reservados.</p>
                    <p className="mt-2 md:mt-0 flex items-center gap-1">
                        Hecho con 💛 para los AWS microservices
                    </p>
                </div>
            </footer>

        </div>
    );
};

export default Inicio;
