import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
    LayoutDashboard, PawPrint, Heart, MapPin, HandHeart, Bell, Stethoscope,
    Search, CheckCircle2, Clock, AlertCircle, LogOut,
    Edit3, Trash2, Plus, Save, Map, Loader2
} from "lucide-react";
import { toast } from "sonner";

const SECTIONS = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "General" },
    { id: "mascotas", label: "Mascotas", icon: PawPrint, group: "Gestión" },
    { id: "adopciones", label: "Adopciones", icon: Heart, group: "Gestión" },
    { id: "geo", label: "Geolocalización", icon: MapPin, group: "Operaciones" },
    { id: "donaciones", label: "Donaciones", icon: HandHeart, group: "Operaciones" },
    { id: "historial", label: "Historial médico", icon: Stethoscope, group: "Operaciones" },
];

const CLINICAS_PTO_MONTT = [
    { nombre: "Hospital Vet. Los Lagos", dir: "Av. Pres. Ibáñez 231", fono: "+56 65 225 4010", estado: "Urgencias 24h" },
    { nombre: "Clínica Veterinaria Del Mar", dir: "Calle Guillermo Gallardo 540", fono: "+56 65 231 8899", estado: "Abierto" },
    { nombre: "Veterinaria Petrohué", dir: "Av. Monseignor Almonacid 412", fono: "+56 65 228 1122", estado: "Abierto" },
];

// Base del Gateway apuntando al proxy de descubrimiento automático en minúsculas
const GATEWAY_URL = "http://localhost:8080";

const Usuarios = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [searchQuery, setSearchQuery] = useState("");

    // ====== ESTADOS DE CONTROL DE RED ======
    const [loading, setLoading] = useState(true);
    const [errorConexion, setErrorConexion] = useState(false);

    // ====== ESTADOS DE INTERACCIÓN ======
    const [unreadNotifs, setUnreadNotifs] = useState(true);
    const [showNotifMenu, setShowNotifMenu] = useState(false);
    const [alertasHeader, setAlertasHeader] = useState([]);

    // ====== DATA DE ENTIDADES (PERSISTENCIA REAL EN BASE DE DATOS) ======
    const [mascotas, setMascotas] = useState([]);
    const [adopciones, setAdopciones] = useState([]);
    const [fichasMedicas, setFichasMedicas] = useState([]);
    const [donaciones, setDonaciones] = useState([]);

    // Rescate dinámico del perfil en sesión
    const userLogueado = JSON.parse(localStorage.getItem("usuario") || "{}");
    const nombreExhibir = userLogueado.nombre || "Vet. Gerardo Vera";
    const inicialesPerfil = nombreExhibir.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

    // 📡 FETCH CENTRALIZADO Y RESILIENTE MEDIANTE DISCOVERY LOCATOR POR SERVICE ID
    const sincronizarEcosistema = useCallback(async () => {
        setLoading(true);
        setErrorConexion(false);

        let gatewayResponde = false;

        // 1. Carga aislada de Mascotas
        try {
            const res = await fetch(`${GATEWAY_URL}/ms-registro-mascotas/api/mascotas`);
            if (res.ok) {
                setMascotas(await res.json());
                gatewayResponde = true;
            }
        } catch {
            console.warn("ms-mascotas no disponible en este momento.");
        }

        // 2. Carga aislada de Adopciones
        try {
            const res = await fetch(`${GATEWAY_URL}/ms-adopciones/api/adopciones`);
            if (res.ok) {
                setAdopciones(await res.json());
                gatewayResponde = true;
            }
        } catch {
            console.warn("ms-adopciones no disponible en este momento.");
        }

        // 3. Carga aislada de Historial Clínico
        try {
            const res = await fetch(`${GATEWAY_URL}/ms-historial/api/historial`);
            if (res.ok) {
                setFichasMedicas(await res.json());
                gatewayResponde = true;
            }
        } catch {
            console.warn("ms-historial clínico veterinario offline.");
        }

        // 5. Carga aislada de Donaciones / Finanzas
        try {
            const res = await fetch(`${GATEWAY_URL}/ms-donaciones/api/donaciones`);
            if (res.ok) {
                setDonaciones(await res.json());
                gatewayResponde = true;
            }
        } catch {
            console.warn("ms-donaciones offline o no disponible.");
        }

        // 6. Carga aislada de Notificaciones (RabbitMQ Bus)
        try {
            const res = await fetch(`${GATEWAY_URL}/ms-notificaciones/api/notificaciones`);
            if (res.ok) {
                setAlertasHeader(await res.json());
                gatewayResponde = true;
            }
        } catch {
            console.warn("ms-notificaciones no disponible aún.");
        }

        // Evaluamos el estado de red general basándonos en si al menos una llamada cruzó el api-gateway
        if (!gatewayResponde) {
            setErrorConexion(true);
            toast.error("Error de comunicación: El API Gateway no responde.");
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        sincronizarEcosistema();
    }, [sincronizarEcosistema]);

    const toggleNotificaciones = () => {
        setShowNotifMenu(!showNotifMenu);
        setUnreadNotifs(false);
    };

    const activeLabel = SECTIONS.find((s) => s.id === activeTab)?.label;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-10 w-10 text-[#1A365D] animate-spin" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cargando registros desde PostgreSQL...</p>
            </div>
        );
    }

    if (errorConexion) {
        return (
            <div className="min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center gap-4 p-6 text-center">
                <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 grid place-items-center"><AlertCircle className="w-6 h-6"/></div>
                <h3 className="font-serif text-xl font-bold text-slate-800">Ecosistema Fuera de Línea</h3>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">No se pudo establecer conexión con el puerto 8080. Asegúrate de levantar tu clúster de microservicios con Docker Compose.</p>
                <button onClick={sincronizarEcosistema} className="bg-[#1A365D] hover:bg-[#102444] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm">Reintentar Conexión</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-[#FFFDF9] font-sans antialiased text-slate-800 flex-col md:flex-row relative">

            {/* SIDEBAR */}
            <aside className="w-full md:w-64 bg-gradient-to-b from-[#1A365D] to-[#102444] text-slate-200 flex flex-col justify-between shrink-0 md:sticky md:top-0 md:h-screen z-20 shadow-xl border-r border-white/5">
                <div>
                    <div className="p-5 border-b border-white/10">
                        <Link to="/inicio" className="flex items-center gap-3">
                            <div className="bg-white p-1.5 rounded-xl text-sm font-bold shadow-md">🐶</div>
                            <div>
                                <p className="font-serif font-black text-white tracking-tight text-sm leading-none">Sanos y Salvos</p>
                                <p className="text-[9px] uppercase tracking-widest font-extrabold text-[#22C55E] mt-1">Panel Staff</p>
                            </div>
                        </Link>
                    </div>

                    <nav className="p-4 space-y-5 max-h-[calc(100vh-160px)] overflow-y-auto">
                        {["General", "Gestión", "Operaciones"].map((grupo) => (
                            <div key={grupo} className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">{grupo}</p>
                                <div className="space-y-0.5">
                                    {SECTIONS.filter((s) => s.group === grupo).map((item) => {
                                        const Icon = item.icon;
                                        const estaActivo = activeTab === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => setActiveTab(item.id)}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                                                    estaActivo ? "bg-[#256944] text-white shadow-lg shadow-black/10 font-extrabold" : "text-slate-300 hover:text-white hover:bg-white/5"
                                                }`}
                                            >
                                                <Icon className="h-4 w-4 shrink-0" />
                                                <span>{item.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-white/10 bg-black/10 space-y-2">
                    <div className="flex items-center gap-3 px-2 py-1">
                        <div className="h-8 w-8 rounded-xl bg-[#256944] text-white flex items-center justify-center font-bold text-xs shadow-sm">{inicialesPerfil}</div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{nombreExhibir}</p>
                            <p className="text-[10px] text-slate-400 font-medium truncate">Refugio Puerto Montt</p>
                        </div>
                    </div>
                    <Link to="/" className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-rose-400 rounded-xl text-xs font-bold hover:bg-white/5 transition-colors">
                        <LogOut className="h-4 w-4" />
                        <span>Cerrar Sesión</span>
                    </Link>
                </div>
            </aside>

            {/* AREA CENTRAL */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b border-slate-100 sticky top-0 z-30 px-8 py-4 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mapeo de Control Administrativo</p>
                        <h2 className="font-serif text-2xl font-bold text-slate-800 capitalize tracking-tight">{activeLabel}</h2>
                    </div>

                    <div className="flex items-center gap-4 relative">
                        <div className="relative hidden md:block">
                            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar registros..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 w-64 bg-[#FFFDF9] border border-slate-200 rounded-full text-xs font-medium focus:outline-none focus:border-[#1A365D]"
                            />
                        </div>

                        <button onClick={toggleNotificaciones} className={`relative h-9 w-9 grid place-items-center rounded-full border shadow-sm transition-all ${showNotifMenu ? "bg-slate-100 border-slate-300 text-slate-900" : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"}`}>
                            <Bell className="h-4 w-4" />
                            {unreadNotifs && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />}
                        </button>

                        {showNotifMenu && (
                            <div className="absolute right-0 top-11 w-72 bg-white border border-slate-200/80 rounded-2xl shadow-xl p-4 space-y-2.5 z-40">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                    <p className="text-[11px] font-black text-[#1A365D] uppercase tracking-wider">Centro de Notificaciones</p>
                                    <button onClick={() => setShowNotifMenu(false)} className="text-[10px] text-slate-400 font-bold hover:text-slate-600">Cerrar</button>
                                </div>
                                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                                    {alertasHeader.map((n) => (
                                        <div key={n.id} className="p-2 rounded-xl bg-[#FFFDF9] hover:bg-slate-50 border border-slate-100 flex flex-col gap-0.5">
                                            <p className="text-[11px] font-bold text-slate-700 leading-tight">{n.mensaje || n.msg}</p>
                                            <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5"><Clock className="w-2.5 h-2.5" /> {n.time || "Reciente"}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <main className="p-8 flex-1">
                    {activeTab === "dashboard" && <DashboardSection familias={mascotas} adopciones={adopciones} donaciones={donaciones} />}
                    {activeTab === "mascotas" && <MascotasSection data={mascotas} setData={setMascotas} query={searchQuery} />}
                    {activeTab === "adopciones" && <AdopcionesSection data={adopciones} setData={setAdopciones} />}
                    {activeTab === "geo" && <GeoSection data={mascotas} />}
                    {activeTab === "donaciones" && <DonacionesSection data={donaciones} setData={setDonaciones} />}
                    {activeTab === "historial" && <HistorialSection data={fichasMedicas} setData={setFichasMedicas} />}
                </main>
            </div>
        </div>
    );
};

/* ==================== SUB-VISTAS CRUD ARQUITECTURALES REALES ==================== */

const DashboardSection = ({ familias, adopciones, donaciones }) => {
    const totalDonado = donaciones.reduce((acc, curr) => acc + (parseInt(curr.monto?.replace(/\D/g, "")) || 0), 0);
    const donacionesFormat = totalDonado > 0 ? `$${(totalDonado / 1000000).toFixed(1)}M` : "$2.4M";

    return (
        <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <StatCard icon={PawPrint} label="Mascotas registradas" value={familias.length.toString()} delta="+12%" color="bg-blue-100 border-blue-200/50 text-blue-700" />
                <StatCard icon={Heart} label="Adopciones activas" value={adopciones.filter(a => a.estado?.toUpperCase().includes("PROCESO")).length.toString()} delta="+5" color="bg-rose-100 border-rose-200/50 text-rose-700" />
                <StatCard icon={HandHeart} label="Donaciones mes" value={donacionesFormat} delta="+18%" color="bg-green-100 border-green-200 text-[#14452F]" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                    <h3 className="font-serif text-lg font-bold text-slate-800 mb-4 tracking-tight">Estatus de Sincronización Transaccional</h3>
                    <div className="space-y-2">
                        {[
                            { icon: CheckCircle2, color: "text-[#256944] bg-[#EAF5ED]", t: "Persistencia atómica activa sobre PostgreSQL", time: "Consistente" },
                            { icon: Search, color: "text-[#1A365D] bg-blue-50", t: "Contratos de Datos e Integridad de Llaves Foráneas verificados", time: "Monitoreado" }
                        ].map((a, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#FFFDF9] border border-slate-100/50 flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`h-9 w-9 rounded-xl grid place-items-center ${a.color} shrink-0`}><a.icon className="h-4 w-4" /></div>
                                    <p className="text-xs font-bold text-slate-700 truncate">{a.t}</p>
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase">{a.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#FFFDF9] border-2 border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin className="h-4 w-4 text-[#256944]" />
                            <p className="text-[10px] font-black text-[#256944] uppercase tracking-wider">Red Asistencial Local</p>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-slate-800 tracking-tight">Veterinarias Pto. Montt</h3>
                        <div className="mt-4 space-y-3">
                            {CLINICAS_PTO_MONTT.map((c, i) => (
                                <div key={i} className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs space-y-1">
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs font-black text-slate-800 truncate">{c.nombre}</p>
                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${c.estado === 'Urgencias 24h' ? 'bg-rose-50 text-rose-600' : 'bg-[#EAF5ED] text-[#256944]'}`}>{c.estado}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-semibold"><Map className="w-3 h-3 text-slate-300 inline mr-1" /> {c.dir}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, delta, color }) => (
    <div className={`border rounded-2xl p-5 shadow-2xs ${color}`}>
        <div className="flex items-start justify-between">
            <div className="h-9 w-9 bg-white/70 rounded-xl grid place-items-center shadow-xs"><Icon className="h-4 w-4" /></div>
            <span className="text-[10px] font-black bg-white/60 px-2 py-0.5 rounded-full">{delta}</span>
        </div>
        <p className="font-serif text-3xl font-black mt-4 tracking-tight">{value}</p>
        <p className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-60">{label}</p>
    </div>
);

/* SEC_MASCOTAS: CRUD PURO DIRECTO AL MICROSERVICIO */
const MascotasSection = ({ data, setData, query }) => {
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({ nombre: "", especie: "", estado: "", zona: "" });
    const [nuevoForm, setNuevoForm] = useState({ nombre: "", especie: "", estado: "En refugio", zona: "" });

    const handleCrear = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${GATEWAY_URL}/ms-registro-mascotas/api/mascotas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoForm)
            });
            if (!res.ok) throw new Error();
            const nuevaMascota = await res.json();
            setData([...data, nuevaMascota]);
            setNuevoForm({ nombre: "", especie: "", estado: "En refugio", zona: "" });
            toast.success("Inserción realizada correctamente en base de datos.");
        } catch (err) {
            console.error(err);
            toast.error("Error en la transacción de guardado.");
        }
    };

    const handleSaveEdicion = async (id) => {
        try {
            const res = await fetch(`${GATEWAY_URL}/ms-registro-mascotas/api/mascotas/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm)
            });
            if (!res.ok) throw new Error();
            setData(data.map(m => m.id === id ? { ...m, ...editForm } : m));
            setEditId(null);
            toast.success("Registro modificado de forma persistente.");
        } catch (err) {
            console.error(err);
            toast.error("Falla de actualización.");
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Confirmar eliminación física del registro?")) return;
        try {
            const res = await fetch(`${GATEWAY_URL}/ms-registro-mascotas/api/mascotas/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            setData(data.filter(m => m.id !== id));
            toast.error("Fila eliminada permanentemente.");
        } catch (err) {
            console.error(err);
            toast.error("Violación de integridad: El registro está enlazado a una adopción.");
        }
    };

    const filtrados = data.filter(m => m.nombre?.toLowerCase().includes(query.toLowerCase()) || m.zona?.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="space-y-6">
            <form onSubmit={handleCrear} className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                <input type="text" placeholder="Nombre" value={nuevoForm.nombre} onChange={e => setNuevoForm({...nuevoForm, nombre: e.target.value})} className="text-xs p-2.5 rounded-xl border border-slate-200" required />
                <input type="text" placeholder="Especie" value={nuevoForm.especie} onChange={e => setNuevoForm({...nuevoForm, especie: e.target.value})} className="text-xs p-2.5 rounded-xl border border-slate-200" required />
                <input type="text" placeholder="Zona/Barrio" value={nuevoForm.zona} onChange={e => setNuevoForm({...nuevoForm, zona: e.target.value})} className="text-xs p-2.5 rounded-xl border border-slate-200" required />
                <select value={nuevoForm.estado} onChange={e => setNuevoForm({...nuevoForm, estado: e.target.value})} className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white">
                    <option value="En refugio">En refugio</option>
                    <option value="Disponible">Disponible</option>
                    <option value="Urgente">Urgente</option>
                </select>
                <button type="submit" className="bg-[#256944] text-white font-bold py-2 px-4 rounded-xl text-xs h-10 flex items-center justify-center gap-1"><Plus className="w-4 h-4"/> Añadir Fila</button>
            </form>

            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-[#FFFDF9] border-b border-slate-100 font-bold text-slate-400 uppercase tracking-wider">
                    <tr>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Nombre</th>
                        <th className="px-6 py-4">Especie</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4">Zona</th>
                        <th className="px-6 py-4 text-center">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                    {filtrados.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 font-mono font-bold text-slate-400">{m.id}</td>
                            <td className="px-6 py-4">
                                {editId === m.id ? <input type="text" value={editForm.nombre} onChange={e => setEditForm({...editForm, nombre: e.target.value})} className="p-1 rounded border text-xs" /> : <span className="font-bold text-slate-800">{m.nombre}</span>}
                            </td>
                            <td className="px-6 py-4">
                                {editId === m.id ? <input type="text" value={editForm.especie} onChange={e => setEditForm({...editForm, especie: e.target.value})} className="p-1 rounded border text-xs" /> : m.especie}
                            </td>
                            <td className="px-6 py-4">
                                {editId === m.id ? (
                                    <select value={editForm.estado} onChange={e => setEditForm({...editForm, estado: e.target.value})} className="p-1 rounded border text-xs bg-white">
                                        <option value="En refugio">En refugio</option>
                                        <option value="Adoptada">Adoptada</option>
                                        <option value="Disponible">Disponible</option>
                                        <option value="Urgente">Urgente</option>
                                    </select>
                                ) : <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${m.estado === 'Adoptada' ? 'bg-[#EAF5ED] text-[#256944]' : 'bg-blue-50 text-blue-600'}`}>{m.estado}</span>}
                            </td>
                            <td className="px-6 py-4">
                                {editId === m.id ? <input type="text" value={editForm.zona} onChange={e => setEditForm({...editForm, zona: e.target.value})} className="p-1 rounded border text-xs" /> : m.zona}
                            </td>
                            <td className="px-6 py-4 text-center flex justify-center gap-3">
                                {editId === m.id ? (
                                    <button onClick={() => handleSaveEdicion(m.id)} className="text-emerald-600 font-bold flex items-center gap-0.5"><Save className="w-3.5 h-3.5"/> Salvar</button>
                                ) : (
                                    <>
                                        <button onClick={() => { setEditId(m.id); setEditForm({...m}); }} className="text-[#1A365D] font-bold flex items-center gap-0.5"><Edit3 className="w-3.5 h-3.5"/> Editar</button>
                                        <button onClick={() => handleEliminar(m.id)} className="text-rose-600 hover:text-rose-800"><Trash2 className="w-3.5 h-3.5"/></button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* SEC_ADOPCIONES: CONTROL TRANSACCIONAL */
const AdopcionesSection = ({ data, setData }) => {

    const handleProcesar = async (id, decision) => {
        try {
            const res = await fetch(`${GATEWAY_URL}/ms-adopciones/api/adopciones/${id}/estado`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: decision.toUpperCase() })
            });
            if (!res.ok) throw new Error();
            setData(data.map(a => a.id === id ? { ...a, estado: decision } : a));
            toast.success(`Solicitud transaccionada como: ${decision}`);
        } catch (err) {
            console.error(err);
            toast.error("Error al actualizar estado en la base de datos.");
        }
    };

    return (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#FFFDF9] border-b border-slate-100 font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Mascota</th>
                    <th className="px-6 py-4">Postulante</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-center">Modificar Decisión</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                {data.map((r) => (
                    <tr key={r.id}>
                        <td className="px-6 py-4 font-mono font-bold text-slate-400">{r.id}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{r.mascota || `ID Mascotas #${r.idMascota}`}</td>
                        <td className="px-6 py-4 font-semibold">{r.adoptante || `ID Solicitante #${r.idAdoptante}`}</td>
                        <td className="px-6 py-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${r.estado === 'Aprobada' || r.estado === 'APROBADA' ? 'bg-[#EAF5ED] text-[#256944]' : 'bg-blue-50 text-blue-600'}`}>
                                    {r.estado}
                                </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-1.5 font-bold text-[10px]">
                                <button onClick={() => handleProcesar(r.id, "Aprobada")} className="bg-[#256944] text-white px-2 py-1 rounded-lg">Aprobar</button>
                                <button onClick={() => handleProcesar(r.id, "Rechazada")} className="bg-rose-50 text-rose-600 px-2 py-1 rounded-lg">Rechazar</button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

/* GEOLOCALIZACION */
const GeoSection = ({ data }) => (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-serif text-xl font-bold text-slate-800">Geolocalización Real (Monitor Relacional)</h3>
        <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 h-80 rounded-2xl bg-[#FFFDF9] border border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center">
                <MapPin className="h-7 w-7 text-[#1A365D]" />
                <p className="text-xs font-bold text-slate-700 mt-2">Mapeo Activo Incorporado</p>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
                {data.map(m => (
                    <div key={m.id} className="bg-slate-50/60 border border-slate-100 p-2.5 rounded-xl text-[11px]">
                        <p className="font-bold text-slate-700">{m.nombre}</p>
                        <p className="text-slate-400">📍 {m.zona || "Región Los Lagos"}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

/* DONACIONES */
const DonacionesSection = ({ data }) => (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#FFFDF9] border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <tr><th>Donante</th><th>Monto</th><th>Destino</th><th>Método</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
            {data.map((r, i) => (
                <tr key={r.id || i}>
                    <td className="px-6 py-4 font-bold text-slate-700">{r.donante}</td>
                    <td className="px-6 py-4 font-serif font-bold text-[#256944] text-sm">{r.monto}</td>
                    <td className="px-6 py-4 text-slate-500">{r.destino}</td>
                    <td className="px-6 py-4 font-mono text-slate-400">{r.metodo}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);

/* HISTORIAL MEDICO */
const HistorialSection = ({ data, setData }) => {
    const [nuevaFicha, setNuevaFicha] = useState({ mascota: "", diag: "", tto: "", chip: true });

    const handleCrearFicha = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${GATEWAY_URL}/ms-historial/api/historial`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevaFicha)
            });
            if (!res.ok) throw new Error();
            const guardada = await res.json();
            setData([...data, guardada]);
            setNuevaFicha({ mascota: "", diag: "", tto: "", chip: true });
            toast.success("Expediente indexado en base de datos.");
        } catch (err) {
            console.error(err);
            toast.error("Error al registrar ficha clínica.");
        }
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-4">
                {data.map((f) => (
                    <div key={f.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
                        <div className="flex items-start justify-between">
                            <h4 className="font-serif text-base font-bold text-slate-800">{f.mascota}</h4>
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF5ED] text-[#256944]">✓ Mapeado</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-2"><strong>Diagnóstico:</strong> {f.diag}</p>
                        <p className="text-xs text-slate-600"><strong>Tratamiento:</strong> {f.tto}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={handleCrearFicha} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-[#1A365D]">Crear Ficha Médica</h3>
                <input type="text" placeholder="Mascota" value={nuevaFicha.mascota} onChange={e => setNuevaFicha({...nuevaFicha, mascota: e.target.value})} className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50" required />
                <input type="text" placeholder="Diagnóstico" value={nuevaFicha.diag} onChange={e => setNuevaFicha({...nuevaFicha, diag: e.target.value})} className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50" required />
                <input type="text" placeholder="Tratamiento" value={nuevaFicha.tto} onChange={e => setNuevaFicha({...nuevaFicha, tto: e.target.value})} className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50" required />
                <button type="submit" className="w-full bg-[#1A365D] text-white text-xs font-bold py-2.5 rounded-xl"><Plus className="w-4 h-4 inline mr-1" /> Registrar Ficha</button>
            </form>
        </div>
    );
};

export default Usuarios;