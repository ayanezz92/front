import React from "react";
import { useState, useEffect } from "react";
import { historialService } from "../services/historialService";
import { toast } from "sonner";

const Historial = () => {
    const [registros, setRegistros] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    // Búsqueda por ID
    const [busquedaId, setBusquedaId] = useState("");

    // Formulario para nuevo registro
    const [nuevoRegistro, setNuevoRegistro] = useState({
        mascotaId: "",
        tipoEvento: "Medico",
        descripcion: "",
        fecha: new Date().toISOString().split("T")[0] // Fecha actual por defecto
    });

    const cargarHistorial = async (id = null) => {
        try {
            setCargando(true);
            setError(null);
            let data;
            if (id) {
                data = await historialService.obtenerPorMascotaId(id);
            } else {
                data = await historialService.obtenerTodos();
            }
            setRegistros(data || []);
        } catch (err) {
            console.error(err);
            setError("Error al conectar con el microservicio de historial.");
            toast.error("No se pudieron cargar los registros");
        } finally {
            setCargando(false);
        }
    };

    // Cargar historial general al inicio
    useEffect(() => {
        cargarHistorial();
    }, []);

    const handleBuscar = (e) => {
        e.preventDefault();
        if (!busquedaId.trim()) {
            cargarHistorial(); // Si está vacío, carga todo
        } else {
            cargarHistorial(busquedaId);
        }
    };

    const handleCrearRegistro = async (e) => {
        e.preventDefault();
        if (!nuevoRegistro.mascotaId || !nuevoRegistro.descripcion) {
            toast.warning("Faltan campos obligatorios");
            return;
        }

        try {
            const resultado = await historialService.registrarEvento({
                mascota: nuevoRegistro.mascotaId,
                diag: nuevoRegistro.tipoEvento,
                tto: nuevoRegistro.descripcion,
                chip: false,
            });
            toast.success("Registro añadido al historial");

            // Actualizar la lista localmente
            if (resultado) {
                setRegistros((prev) => [resultado, ...prev]);
            } else {
                cargarHistorial(busquedaId); // Recargar si no devuelve el objeto
            }

            // Limpiar formulario
            setNuevoRegistro({ ...nuevoRegistro, descripcion: "" });
        } catch (err) {
            console.error(err);
            toast.error("No se pudo guardar el registro");
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Historial y Trazabilidad
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Registro cronológico de eventos clínicos y de estado.
                    </p>
                </div>

                {/* Buscador */}
                <form onSubmit={handleBuscar} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Buscar por ID de Mascota..."
                        value={busquedaId}
                        onChange={(e) => setBusquedaId(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Filtrar
                    </button>
                </form>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Formulario lateral para nuevos hitos */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Añadir Evento</h2>
                    <form onSubmit={handleCrearRegistro} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">ID Mascota</label>
                            <input
                                type="text"
                                value={nuevoRegistro.mascotaId}
                                onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, mascotaId: e.target.value })}
                                className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                placeholder="Ej. 1042"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Tipo de Evento</label>
                            <select
                                value={nuevoRegistro.tipoEvento}
                                onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, tipoEvento: e.target.value })}
                                className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                            >
                                <option value="Medico">Evaluación Médica</option>
                                <option value="Vacuna">Vacunación</option>
                                <option value="Estado">Cambio de Estado</option>
                                <option value="Traslado">Traslado</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Fecha</label>
                            <input
                                type="date"
                                value={nuevoRegistro.fecha}
                                onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, fecha: e.target.value })}
                                className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Detalles</label>
                            <textarea
                                rows="3"
                                value={nuevoRegistro.descripcion}
                                onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, descripcion: e.target.value })}
                                className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                placeholder="Descripción del tratamiento o evento..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                            Registrar en Historial
                        </button>
                    </form>
                </div>

                {/* Línea de Tiempo (Timeline) de Registros */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Línea de Tiempo de Eventos</h2>

                    {cargando && (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                            {error}
                        </div>
                    )}

                    {!cargando && !error && registros.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
                            <p className="text-gray-400 text-sm">No hay registros históricos disponibles.</p>
                        </div>
                    )}

                    {!cargando && !error && registros.length > 0 && (
                        <div className="relative border-l border-gray-200 ml-3 space-y-8">
                            {registros.map((registro, index) => (
                                <div key={registro.id || index} className="mb-8 ml-6">
                                    {/* Punto en la línea de tiempo */}
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-teal-100 rounded-full -left-3 ring-8 ring-white">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                  </span>

                                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                        {registro.tipoEvento || "Evento General"}
                      </span>
                                            <time className="text-xs text-gray-400 font-medium">
                                                {registro.fecha || "Fecha no especificada"}
                                            </time>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 mb-1">
                                            Mascota ID: {registro.mascotaId || "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {registro.descripcion || "Sin descripción proporcionada."}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Historial;