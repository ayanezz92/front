// Antes este archivo apuntaba TODO ("/api/mascotas", "/api/organizacion", etc.)
// al puerto de ms-usuarios (8081), así que solo /api/usuarios funcionaba y el
// resto de la app fallaba en silencio. Ahora se enruta a través del API
// Gateway (puerto 8080) usando el mismo patrón "/ms-servicio/..." que ya
// funciona en Usuarios.jsx, aprovechando el discovery locator de Spring
// Cloud Gateway (spring.cloud.gateway.discovery.locator.enabled=true).
// En build local (npm run dev) usa localhost:8080. En build de producción
// (Docker/CI) se inyecta VITE_GATEWAY_URL con el DNS del LoadBalancer del
// api-gateway en EKS (ver .github/workflows/frontend-ci-cd.yml).
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || "http://localhost:8080";

const PREFIJO_A_SERVICIO = {
    "/api/usuarios": "ms-usuarios",
    "/api/adopciones": "ms-adopciones",
    "/api/coincidencias": "ms-coincidencias",
    "/api/geolocalizacion": "ms-geolocalizacion",
    "/api/donaciones": "ms-donaciones",
    "/api/mascotas": "ms-registro-mascotas",
    "/api/historial": "ms-historial",
    "/api/notificaciones": "ms-notificaciones",
    "/api/reportes": "ms-reportes",
    "/api/organizacion": "ms-organizacion",
};

const resolverUrl = (endpoint) => {
    const prefijo = Object.keys(PREFIJO_A_SERVICIO).find((p) => endpoint.startsWith(p));
    const servicio = prefijo ? PREFIJO_A_SERVICIO[prefijo] : null;
    return servicio ? `${GATEWAY_URL}/${servicio}${endpoint}` : `${GATEWAY_URL}${endpoint}`;
};

export const apiFetch = async (endpoint, options = {}) => {
    const url = resolverUrl(endpoint);
    const defaultHeaders = { "Content-Type": "application/json" };

    const config = {
        ...options,
        headers: { ...defaultHeaders, ...options.headers },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
    }

    // Aceptamos cualquier respuesta exitosa en el rango 200-299
    if (response.status >= 200 && response.status < 300) {
        // Por si acaso el backend responde texto plano o un JSON estructurado
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        return response;
    }

    return response;
};