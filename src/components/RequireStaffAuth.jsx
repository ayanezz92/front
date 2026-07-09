import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Protege rutas internas (panel staff): si no hay una sesión de staff válida
 * guardada por Auth.jsx, redirige a /auth en vez de mostrar el panel vacío
 * o con datos sin sentido.
 */
const ROLES_STAFF = ["ADMIN", "VETERINARIO", "OPERADOR"];

const RequireStaffAuth = ({ children }) => {
    let usuario;
    try {
        usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    } catch {
        usuario = null;
    }

    const autorizado = usuario && ROLES_STAFF.includes((usuario.rol || "").toUpperCase());

    if (!autorizado) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

export default RequireStaffAuth;
