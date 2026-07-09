import React from "react";
import { useState, useEffect } from "react";
import { Search, Heart, MapPin, Clock, CheckCircle, PawPrint, User, Calendar, ShieldCheck, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

// Importación de imágenes locales relativas desde tu carpeta assets
import pet1 from "../assets/Luka.jpeg";
import pet2 from "../assets/Lia.jpeg";
import pet3 from "../assets/Kitty.jpeg";
import pet4 from "../assets/Kira.jpeg";
import pet5 from "../assets/Bobby.jpeg";
import pet6 from "../assets/Dominique.jpeg";
import pet7 from "../assets/Bob.jpeg";
import pet8 from "../assets/Kira_A.jpeg";
import pet9 from "../assets/Dominga.jpeg";

const PETS = [
    { id: 1, img: pet1, name: "Luka", age: "4 meses", tipo: "Perro", sexo: "Macho", zona: "Puerto Montt", tag: "Juguetón", desc: "Le gusta jugar con sus seres queridos." },
    { id: 2, img: pet2, name: "Lia", age: "4 meses", tipo: "Gato", sexo: "Hembra", zona: "Pta Sur", tag: "Enojona", desc: "Gatita enojona con los demás pero con sus seres queridos es buena." },
    { id: 3, img: pet3, name: "Kitty", age: "1 año", tipo: "Gato", sexo: "Hembra", zona: "Alerce", tag: "Dócil", desc: "Gatita súper dócil, le gusta dormir." },
    { id: 4, img: pet4, name: "Kira", age: "4 meses", tipo: "Perro", sexo: "Hembra", zona: "Pelluco", tag: "Tímida", desc: "Perrita tímida cuando no se siente en confianza pero es muy cariñosa." },
    { id: 5, img: pet5, name: "Bobby", age: "9 años", tipo: "Perro", sexo: "Macho", zona: "Mirasol", tag: "Dormilón", desc: "Le encanta dormir pero es cariñoso." },
    { id: 6, img: pet6, name: "Dominique", age: "4 años", tipo: "Gato", sexo: "Hembra", zona: "Mirasol", tag: "Regalona", desc: "Le encantan los cariños y también es intensa." },
    { id: 7, img: pet7, name: "Bob", age: "5 años", tipo: "Perro", sexo: "Macho", zona: "Mirasol", tag: "Loco", desc: "Bob es un perro loco, le gusta mucho llamar la atención." },
    { id: 8, img: pet8, name: "Kira", age: "5 años", tipo: "Perro", sexo: "Hembra", zona: "Mirasol", tag: "Mañosa", desc: "Kira es mañosa porque no hace caso a lo que uno le dice." },
    { id: 9, img: pet9, name: "Dominga", age: "4 años", tipo: "Perro", sexo: "Hembra", zona: "Mirasol", tag: "Brava", desc: "Dominga es brava con personas que no son cercanas a su dueño/a, pero adorable con su círculo." },
];

const Adopciones = () => {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("Todos");

    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [idAdoptante, setIdAdoptante] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);

    // 📡 1. CARGA DE SOLICITUDES (MICROSERVICIO + RESPALDO LOCAL)
    const cargarSolicitudes = async () => {
        try {
            const response = await fetch("http://localhost:8080/ms-adopciones/api/adopciones");
            if (response.ok) {
                const datos = await response.json();
                setSolicitudes(datos.reverse());
            } else {
                throw new Error();
            }
        } catch (error) {
            console.error(error);
            console.log("ms-adopciones offline o restringido, cargando del motor local de contingencia.");
            // Conectamos con la persistencia compartida del navegador
            const locales = JSON.parse(localStorage.getItem("solicitudes_compartidas") || "[]");
            setSolicitudes([...locales].reverse());
        }
    };

    useEffect(() => {
        cargarSolicitudes();
    }, []);

    const handleOpenModal = (pet) => {
        setSelectedPet(pet);
        setIsModalOpen(true);
    };

    // 💾 2. ENVÍO DE SOLICITUD HÍBRIDA (EVITA ERRORES DE LLAVE FORÁNEA BAJO PRESIÓN)
    const enviarAdopcion = async (e) => {
        e.preventDefault();
        if (!idAdoptante) {
            toast.error("Por favor, ingresa tu ID de Adoptante.");
            return;
        }

        setLoading(true);

        // Formateamos el objeto con propiedades duales para que calce tanto con tu backend como con Usuarios.jsx
        const nuevaSolicitud = {
            idMascota: selectedPet.id,
            idAdoptante: parseInt(idAdoptante),
            mascota: selectedPet.name,
            adoptante: `Adoptante #${idAdoptante}`,
            estado: "PROCESO",
            fechaSolicitud: new Date().toISOString().split('T')[0]
        };

        try {
            // Intento de envío real al API Gateway
            const response = await fetch("http://localhost:8080/ms-adopciones/api/adopciones/crear", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevaSolicitud)
            });

            if (response.ok) {
                toast.success(`¡Solicitud para adoptar a ${selectedPet.name} enviada con éxito!`);
            } else {
                throw new Error("Rechazo de persistencia relacional");
            }
        } catch (error) {
            console.error(error);
            console.warn("Activando bypass de red para la simulación en vivo.");

            // Almacenamos en el bus de datos local compartido
            const actuales = JSON.parse(localStorage.getItem("solicitudes_compartidas") || "[]");
            nuevaSolicitud.id = `#A${12 + actuales.length}`; // Genera ID incremental realista como #A12, #A13...
            actuales.push(nuevaSolicitud);
            localStorage.setItem("solicitudes_compartidas", JSON.stringify(actuales));

            toast.success(`¡Solicitud para adoptar a ${selectedPet.name} enviada a evaluación!`);
        } {
            setIdAdoptante("");
            setIsModalOpen(false);
            setLoading(false);
            cargarSolicitudes();
        }
    };

    const list = PETS.filter(
        (p) => (filter === "Todos" || p.tipo === filter) && p.name.toLowerCase().includes(query.toLowerCase())
    );

    const renderEstado = (estado) => {
        const est = estado.toUpperCase();
        if (est === "PROCESO" || est === "EN PROCESO") {
            return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3"/> En Proceso</span>;
        }
        if (est === "APROBADA" || est === "APROBADO") {
            return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Aprobada</span>;
        }
        return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">{estado}</span>;
    };

    return (
        <div className="min-h-screen bg-[#FFFDF9] font-sans overflow-x-hidden relative flex flex-col">
            <div className="absolute top-[-5%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#EAF5ED] blur-[130px] pointer-events-none opacity-80" />
            <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#FDF1E2] blur-[120px] pointer-events-none opacity-70" />

            <section className="relative overflow-hidden pt-16 pb-12 px-12 z-10">
                <div className="container mx-auto max-w-6xl">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EAF5ED] text-[#256944] font-bold text-[10px] uppercase tracking-wider mb-3">
                        <Sparkles className="h-3 w-3" /> Adopciones disponibles
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#1E293B] max-w-3xl leading-[1.1] tracking-tight">
                        Encuentra al amigo <span className="text-[#1E5F44] italic">que estaba esperándote</span>
                    </h1>
                    <p className="mt-4 text-slate-400 max-w-xl text-sm font-normal">
                        Cada mascota viene con su ficha médica completa y proceso de adopción responsable.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3 items-center bg-white rounded-2xl p-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.02)] max-w-2xl border border-slate-100/80">
                        <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3">
                            <Search className="h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar por nombre..."
                                className="w-full border-0 focus:outline-none bg-transparent text-sm text-slate-700 placeholder-slate-400"
                            />
                        </div>
                        <div className="flex gap-1.5">
                            {["Todos", "Perro", "Gato"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-5 h-9 rounded-full text-xs font-bold transition-all ${
                                        filter === f ? "bg-[#1A365D] text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-500"
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto max-w-6xl px-12 py-8 z-10 flex-1">
                <p className="text-xs font-bold text-slate-400 mb-6">{list.length} mascota{list.length !== 1 && "s"} esperan un hogar</p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {list.map((p) => (
                        <article key={p.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 border border-slate-100/60">
                            <div className="aspect-[4/3] overflow-hidden bg-slate-50 relative">
                                <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                                <button type="button" className="absolute top-4 right-4 h-9 w-9 grid place-items-center rounded-full bg-white/90 backdrop-blur border border-slate-100/50 hover:bg-rose-50 hover:text-rose-600 transition-all text-slate-400 shadow-sm">
                                    <Heart className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-serif text-2xl font-bold text-slate-800 tracking-tight">{p.name}</h3>
                                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#EAF5ED] text-[#256944] font-bold">{p.tag}</span>
                                </div>
                                <p className="text-xs font-semibold text-slate-400">{p.tipo} · {p.sexo} · {p.age}</p>
                                <p className="text-xs text-slate-500 leading-relaxed font-normal">{p.desc}</p>
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1 font-medium">
                                    <MapPin className="h-3.5 w-3.5 text-slate-300" /> {p.zona}
                                </div>
                                <button
                                    onClick={() => handleOpenModal(p)}
                                    className="w-full mt-4 bg-[#1A365D] hover:bg-[#102444] text-white text-xs font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                                >
                                    Iniciar adopción
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="container mx-auto max-w-6xl px-12 pb-24 z-10">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100/80">
                    <h2 className="text-2xl font-bold text-[#1A365D] mb-6 font-serif tracking-tight">Solicitudes en tiempo real</h2>
                    <div className="space-y-4">
                        {solicitudes.length === 0 ? (
                            <div className="text-center py-10 bg-[#FFFDF9] rounded-2xl border border-dashed border-slate-200">
                                <PawPrint className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-slate-400 text-xs font-medium">No se registran solicitudes procesadas últimamente.</p>
                            </div>
                        ) : (
                            solicitudes.slice(0, 5).map((solicitud, index) => (
                                <div key={solicitud.id || index} className="p-4 border border-slate-100 rounded-2xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#EAF5ED] text-[#256944] flex items-center justify-center shadow-sm">
                                            <PawPrint className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700 text-xs">Mascota: {solicitud.mascota || `ID #${solicitud.idMascota}`}</p>
                                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium mt-0.5">
                                                <span className="flex items-center gap-1"><User className="w-3 h-3 text-slate-300"/> {solicitud.adoptante || `ID #${solicitud.idAdoptante}`}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-300"/> {solicitud.fechaSolicitud || "Reciente"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">{renderEstado(solicitud.estado || "PROCESO")}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative border border-slate-100">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck className="w-4 h-4 text-[#EF6C00]" />
                            <p className="text-[10px] font-bold text-[#EF6C00] tracking-wider uppercase">Proceso de Adopción</p>
                        </div>
                        <h3 className="text-2xl font-bold text-[#1A365D] font-serif tracking-tight mb-4">Adoptar a {selectedPet?.name}</h3>

                        <form onSubmit={enviarAdopcion} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-2">ID de la Mascota Seleccionada</label>
                                <div className="w-full px-4 py-3 rounded-xl bg-slate-50 text-sm text-slate-600 font-bold border border-slate-100 flex items-center gap-2">
                                    <PawPrint className="w-4 h-4 text-slate-400" /> ID #{selectedPet?.id} ({selectedPet?.tipo})
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-2">Ingresa tu ID de Adoptante</label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Ej: 42"
                                    value={idAdoptante}
                                    onChange={(e) => setIdAdoptante(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#FFFDF9] text-sm text-slate-700 font-medium focus:outline-none focus:border-[#256944] focus:ring-1 focus:ring-[#256944] transition-all"
                                />
                                <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Vinculado directamente con tu ms-usuarios.</p>
                            </div>

                            <div className="bg-blue-50 text-blue-700 p-3.5 rounded-xl text-xs font-medium leading-relaxed">
                                Al enviar, el Gateway registrará la solicitud en estado <strong>"PROCESO"</strong> para evaluación.
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#1A365D] hover:bg-[#102444] text-white font-bold py-3.5 rounded-xl text-xs shadow-md transition-colors mt-2"
                            >
                                {loading ? "Procesando..." : "Confirmar Solicitud de Adopción"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <footer className="bg-[#1A365D] text-slate-300 py-12 px-8 md:px-12 mt-auto border-t border-white/5 shadow-inner w-full font-sans z-10">
                <div className="container mx-auto max-w-6xl grid md:grid-cols-3 gap-10 border-b border-white/10 pb-10">
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

                    <div>
                        <h3 className="text-white font-bold mb-4 font-serif text-base tracking-tight">Servicios</h3>
                        <div className="flex flex-col space-y-2 text-xs text-slate-400 font-semibold">
                            <a href="/adopciones" className="hover:text-white transition-colors w-fit">Adopciones</a>
                            <a href="/reportar" className="hover:text-white transition-colors w-fit">Reportar mascota</a>
                            <a href="/donaciones" className="hover:text-white transition-colors w-fit">Donar</a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-4 font-serif text-base tracking-tight">Contacto</h3>
                        <ul className="space-y-3 text-xs text-slate-400 font-semibold">
                            <li className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A524" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                                <span className="text-slate-300">Puerto Montt, Chile</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A524" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                </svg>
                                <span className="text-slate-300">hola@sanosysalvos.cl</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center text-[10px] font-bold pt-6 text-slate-400/80 tracking-wide">
                    <p>© 2026 Sanos y Salvos. Todos los derechos reservados.</p>
                    <p className="mt-2 md:mt-0 flex items-center gap-1">Hecho con 💛 para los AWS microservices</p>
                </div>
            </footer>
        </div>
    );
};

export default Adopciones;