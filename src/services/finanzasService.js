// src/services/finanzasService.js
import { apiFetch } from "./api";

export const finanzasService = {
    // Historial de donaciones (Donaciones.jsx llama a este método)
    obtenerDonaciones: async () => {
        return apiFetch("/api/donaciones");
    },
    registrarDonacion: async (donacion) => {
        return apiFetch("/api/donaciones/registrar", {
            method: "POST",
            body: JSON.stringify(donacion),
        });
    },
};