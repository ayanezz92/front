import { apiFetch } from "./api";

export const historialService = {
    // Obtener todo el historial general (o los últimos eventos)
    obtenerTodos: async () => {
        return await apiFetch("/api/historial");
    },

    // Obtener el historial específico de un ID (ej. historial de una mascota en particular)
    obtenerPorMascotaId: async (mascotaId) => {
        return await apiFetch(`/api/historial/mascota/${mascotaId}`);
    },

    // Registrar un nuevo evento en el historial
    registrarEvento: async (datosEvento) => {
        return await apiFetch("/api/historial", {
            method: "POST",
            body: JSON.stringify(datosEvento),
        });
    }
};