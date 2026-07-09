import { apiFetch } from "./api";

export const mascotasService = {
    // Obtener el padrón completo de mascotas registradas
    obtenerTodas: async () => {
        return await apiFetch("/api/mascotas/listar");
    },

    // Obtener los detalles de una mascota específica
    obtenerPorId: async (id) => {
        return await apiFetch(`/api/mascotas/${id}`);
    },

    // Registrar una nueva mascota en la plataforma
    registrar: async (datosMascota) => {
        return await apiFetch("/api/mascotas/registrar", {
            method: "POST",
            body: JSON.stringify(datosMascota),
        });
    }
};