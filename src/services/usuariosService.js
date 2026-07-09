import { apiFetch } from "./api";

export const usuariosService = {
    // Obtener todos los usuarios registrados en el sistema
    obtenerTodos: async () => {
        return await apiFetch("/api/usuarios/listar"); // 👈 Cambiado de /api/usuarios a /api/usuarios/listar
    },

    // Obtener un usuario específico por su ID
    obtenerPorId: async (id) => {
        return await apiFetch(`/api/usuarios/${id}`);
    },

    // Registrar un nuevo usuario
    registrar: async (datosUsuario) => {
        // 🚨 CORREGIDO: Ahora apunta exactamente al endpoint de tu controlador Java
        return await apiFetch("/api/usuarios/registrar", {
            method: "POST",
            body: JSON.stringify(datosUsuario),
        });
    },

    // Cambiar el estado de un usuario (activo/inactivo) o actualizar su rol
    actualizarEstado: async (id, datosActualizacion) => {
        return await apiFetch(`/api/usuarios/${id}`, {
            method: "PATCH",
            body: JSON.stringify(datosActualizacion),
        });
    }
};