import React from "react";
import { useState, useEffect } from "react";
import { mascotasService } from "../services/mascotasService";
import { toast } from "sonner";

const Mascotas = () => {
    const [mascotas, setMascotas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Estado para el formulario de registro de la mascota
    const [nuevaMascota, setNuevaMascota] = useState({
        nombre: "",
        especie: "Perro",
        raza: "",
        edadAprox: "",
        estado: "Rescatado", // Rescatado, Perdido, En Adopción
        descripcion: ""
    });

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const data = await mascotasService.obtenerTodas();
            setMascotas(data || []);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("No se pudo conectar con el servicio de registro de mascotas.");
            toast.error("Error al cargar el padrón de mascotas");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleRegistrarMascota = async (e) => {
        e.preventDefault();
        if (!nuevaMascota.nombre || !nuevaMascota.especie) {
            toast.warning("El nombre y la especie son obligatorios");
            return;
        }

        try {
            const resultado = await mascotasService.registrar(nuevaMascota);
            toast.success("Mascota registrada exitosamente");

            // Actualizar la vista localmente
            if (resultado) setMascotas((prev) => [resultado, ...prev]);

            // Limpiar el formulario
            setNuevaMascota({
                nombre: "",
                especie: "Perro",
                raza: "",
                edadAprox: "",
                estado: "Rescatado",
                descripcion: ""
            });
        } catch (err) {
            console.error(err);
            toast.error("Error al registrar la mascota en la base de datos");
        }
    };

    // Función auxiliar para definir el color del badge según el estado
    const getBadgeColor = (estado) => {
        switch(estado) {
            case 'Perdido': return 'bg-red-100 text-red-700';
            case 'En Adopción': return 'bg-emerald-100 text-emerald-700';
            case 'Rescatado': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Padrón de Mascotas
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Registro central, perfiles y estado actual de los animales en el sistema.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Columna Izquierda: Formulario de Registro */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Ingresar Nuevo Perfil</h2>
                    <form onSubmit={handleRegistrarMascota} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Nombre</label>
                            <input
                                type="text"
                                value={nuevaMascota.nombre}
                                onChange={(e) => setNuevaMascota({ ...nuevaMascota, nombre: e.target.value })}
                                className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="Ej. Firulais (o 'Desconocido')"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Especie</label>
                                <select
                                    value={nuevaMascota.especie}
                                    onChange={(e) => setNuevaMascota({ ...nuevaMascota, especie: e.target.value })}
                                    className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                                >
                                    <option value="Perro">Canino</option>
                                    <option value="Gato">Felino</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Raza / Tipo</label>
                                <input
                                    type="text"
                                    value={nuevaMascota.raza}
                                    onChange={(e) => setNuevaMascota({ ...nuevaMascota, raza: e.target.value })}
                                    className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="Ej. Mestizo"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Edad Aprox.</label>
                                <input
                                    type="text"
                                    value={nuevaMascota.edadAprox}
                                    onChange={(e) => setNuevaMascota({ ...nuevaMascota, edadAprox: e.target.value })}
                                    className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="Ej. 2 años"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Estado Actual</label>
                                <select
                                    value={nuevaMascota.estado}
                                    onChange={(e) => setNuevaMascota({ ...nuevaMascota, estado: e.target.value })}
                                    className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                                >
                                    <option value="Rescatado">Rescatado / A salvo</option>
                                    <option value="En Adopción">En Adopción</option>
                                    <option value="Perdido">Perdido</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Señas Particulares / Descripción</label>
                            <textarea
                                rows="3"
                                value={nuevaMascota.descripcion}
                                onChange={(e) => setNuevaMascota({ ...nuevaMascota, descripcion: e.target.value })}
                                className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="Manchas, collar, comportamiento, etc..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                            Guardar Registro
                        </button>
                    </form>
                </div>

                {/* Columna Derecha: Tarjetas del Padrón */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Registros Recientes</h2>
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium">
              {mascotas.length} en el sistema
            </span>
                    </div>

                    {cargando && (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                            {error}
                        </div>
                    )}

                    {!cargando && !error && mascotas.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
                            <p className="text-gray-400 text-sm">No hay mascotas registradas actualmente.</p>
                        </div>
                    )}

                    {!cargando && !error && mascotas.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {mascotas.map((mascota, index) => (
                                <div key={mascota.id || index} className="border border-gray-200 rounded-lg p-5 hover:border-emerald-300 hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{mascota.nombre || "Sin Nombre"}</h3>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                                                ID: #{mascota.id || "N/A"} • {mascota.especie}
                                            </p>
                                        </div>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${getBadgeColor(mascota.estado)}`}>
                      {mascota.estado}
                    </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mb-3 bg-gray-50 p-2 rounded text-sm">
                                        <div>
                                            <span className="block text-xs text-gray-400">Raza</span>
                                            <span className="font-medium text-gray-700">{mascota.raza || "No especificada"}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-gray-400">Edad</span>
                                            <span className="font-medium text-gray-700">{mascota.edadAprox || "No especificada"}</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {mascota.descripcion || "Sin descripción adicional."}
                                    </p>

                                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-2">
                                        <button className="text-xs font-medium text-emerald-600 hover:text-emerald-800 transition-colors">
                                            Ver Ficha Completa &rarr;
                                        </button>
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

export default Mascotas;