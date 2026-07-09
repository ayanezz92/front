const API_URL = "http://localhost:8088/api/adopciones";

export const adopcionesService = {
    obtenerSolicitudes: async () => {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener adopciones");
        return response.json();
    },

    crearSolicitud: async (datosAdopcion) => {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // Vite convertirá los datos del formulario a JSON para que Spring Boot los entienda
            body: JSON.stringify(datosAdopcion),
        });
        if (!response.ok) throw new Error("Error al crear la solicitud");
        return response.json();
    }
};