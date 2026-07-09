import React from "react";
import { useState, useRef } from "react";
import { Loader2 } from "lucide-react"; // Importación limpia para el estado de carga
import { toast } from "sonner"; // Usamos Sonner para notificaciones consistentes con el Panel Staff

const API_BASE_URL = "http://localhost:8080/ms-reportes/api";

export default function ReportarMascota() {
    // 1. Estados para la selección de tipo de reporte (Activo por defecto: AVISTAMIENTO)
    const [tipo, setTipo] = useState("AVISTAMIENTO");

    // 2. Estados para los campos de texto del formulario
    const [nombre, setNombre] = useState("");
    const [especie, setEspecie] = useState("");
    const [color, setColor] = useState("");
    const [tamano, setTamano] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [foto, setFoto] = useState(null);
    const [nombreFoto, setNombreFoto] = useState("");

    // Estado para deshabilitar botones y controlar cargas asíncronas
    const [submitting, setSubmitting] = useState(false);

    // Referencia para abrir el explorador de la PC al hacer clic en el cuadro gris
    const fileInputRef = useRef(null);

    const handleZonaClick = () => {
        if (!submitting) fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validación de tamaño del archivo en el cliente (Máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("El archivo excede el límite permitido de 5MB.");
                return;
            }
            setFoto(file);
            setNombreFoto(file.name);
            toast.info(`Archivo seleccionado: ${file.name}`);
        }
    };

    // 📡 ENVÍO TRANSACCIONAL MULTIPART DIRECTO AL API GATEWAY
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!foto) {
            toast.error("Por favor, adjunta una foto de la mascota para iniciar el motor de coincidencias.");
            return;
        }

        setSubmitting(true);

        // Construcción del contenedor multipart nativo
        const formData = new FormData();
        formData.append("tipo", tipo);
        formData.append("nombre", nombre.trim() || "Sin nombre");
        formData.append("especie", especie.trim().toUpperCase());
        formData.append("color", color.trim().toUpperCase());
        formData.append("tamano", tamano.trim().toUpperCase());
        formData.append("ubicacion", ubicacion.trim());
        formData.append("foto", foto); // Archivo binario físico

        try {
            const response = await fetch(`${API_BASE_URL}/reportes`, {
                method: "POST",
                // NOTA DE ARQUITECTURA: Omitimos Content-Type. El navegador inyectará multipart/form-data con su boundary dinámico.
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.mensaje || "Error interno del servidor al procesar el reporte.");
            }

            toast.success(`¡Reporte de ${tipo} guardado y publicado en la Base de Datos con éxito!`);

            // Restablecimiento completo del estado del formulario únicamente tras confirmación del servidor
            setNombre("");
            setEspecie("");
            setColor("");
            setTamano("");
            setUbicacion("");
            setFoto(null);
            setNombreFoto("");
            if (fileInputRef.current) fileInputRef.current.value = "";

        } catch (error) {
            console.error("Error transaccional en ms-reportes:", error);
            toast.error(error.message || "No se pudo conectar con el microservicio. Verifica la red.");
        } finally {
            setSubmitting(false);
        }
    };

    // Estilos dinámicos para los botones/tarjetas de selección
    const getTabStyle = (tabName) => {
        const isActive = tipo === tabName;
        return {
            flex: 1,
            padding: "20px",
            borderRadius: "12px",
            cursor: submitting ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            textAlign: "center",
            backgroundColor: "#fff",
            border: isActive ? "2px solid #2e7d32" : "1px solid #e0e0e0",
            boxShadow: isActive ? "0 4px 12px rgba(46, 125, 50, 0.15)" : "none",
            transform: isActive ? "scale(1.02)" : "scale(1)",
            opacity: submitting && !isActive ? 0.6 : 1
        };
    };

    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', padding: '40px', maxWidth: '900px', margin: '0 auto', color: '#2c3e50' }}>

            {/* ENCABEZADO */}
            <span style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                🐾 MÓDULO DE REPORTES MULTIMEDIA
            </span>
            <h1 style={{ fontSize: '36px', margin: '15px 0 5px 0', fontWeight: '700' }}>
                Cada minuto cuenta. <span style={{ color: '#2e7d32', fontStyle: 'italic' }}>Comencemos.</span>
            </h1>
            <p style={{ color: '#7f8c8d', margin: '0 0 30px 0', fontSize: '14px' }}>
                Tu reporte se publica al instante y nuestro motor de coincidencias compara automáticamente con todas las mascotas registradas en la base de datos.
            </p>

            {/* TABS INTERACTIVOS */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                <button type="button" disabled={submitting} onClick={() => setTipo("PERDIDO")} style={getTabStyle("PERDIDO")}>
                    <span style={{ fontSize: '20px' }}>⚠️</span>
                    <h4 style={{ margin: '10px 0 5px 0', fontWeight: '600' }}>Perdí a mi mascota</h4>
                    <small style={{ color: '#95a5a6' }}>Quiero registrar una desaparición</small>
                </button>

                <button type="button" disabled={submitting} onClick={() => setTipo("ENCONTRADO")} style={getTabStyle("ENCONTRADO")}>
                    <span style={{ fontSize: '20px' }}>✅</span>
                    <h4 style={{ margin: '10px 0 5px 0', fontWeight: '600' }}>Encontré una mascota</h4>
                    <small style={{ color: '#95a5a6' }}>Quiero ayudar a regresarla a casa</small>
                </button>

                <button type="button" disabled={submitting} onClick={() => setTipo("AVISTAMIENTO")} style={getTabStyle("AVISTAMIENTO")}>
                    <span style={{ fontSize: '20px' }}>👁️</span>
                    <h4 style={{ margin: '10px 0 5px 0', fontWeight: '600' }}>Avistamiento</h4>
                    <small style={{ color: '#95a5a6' }}>La vi en la calle pero no la tengo</small>
                </button>
            </div>

            {/* FORMULARIO PRINCIPAL */}
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '16px', border: '1px solid #f0f0f0' }}>

                {/* CUADRO PARA CARGAR FOTO */}
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Foto de la mascota</label>
                <div
                    onClick={handleZonaClick}
                    style={{
                        border: '2px dashed #dcdde1',
                        borderRadius: '12px',
                        padding: '40px',
                        textAlign: 'center',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        backgroundColor: '#fafafa',
                        marginBottom: '25px',
                        opacity: submitting ? 0.7 : 1
                    }}
                >
                    <span style={{ fontSize: '30px', color: '#95a5a6' }}>📤</span>
                    <p style={{ margin: '10px 0 0 0', fontWeight: '500', fontSize: '15px' }}>
                        {nombreFoto ? `Seleccionada: ${nombreFoto}` : "Arrastra una foto o haz clic"}
                    </p>
                    <small style={{ color: '#b2bec3' }}>PNG, JPG hasta 5MB</small>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                        disabled={submitting}
                    />
                </div>

                {/* FILA 1: NOMBRE Y ESPECIE */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Nombre (si lo sabes)</label>
                        <input type="text" placeholder="Ej: Toby" value={nombre} onChange={(e) => setNombre(e.target.value)} disabled={submitting} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dcdde1', fontSize: '14px', backgroundColor: submitting ? '#f5f5f5' : '#fff' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Especie</label>
                        <input type="text" placeholder="Perro / Gato / Otro" value={especie} onChange={(e) => setEspecie(e.target.value)} required disabled={submitting} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dcdde1', fontSize: '14px', backgroundColor: submitting ? '#f5f5f5' : '#fff' }} />
                    </div>
                </div>

                {/* FILA 2: COLOR Y TAMAÑO */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Color</label>
                        <input type="text" placeholder="Ej: Café con manchas" value={color} onChange={(e) => setColor(e.target.value)} required disabled={submitting} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dcdde1', fontSize: '14px', backgroundColor: submitting ? '#f5f5f5' : '#fff' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Tamaño</label>
                        <input type="text" placeholder="Pequeño / Mediano / Grande" value={tamano} onChange={(e) => setTamano(e.target.value)} required disabled={submitting} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dcdde1', fontSize: '14px', backgroundColor: submitting ? '#f5f5f5' : '#fff' }} />
                    </div>
                </div>

                {/* FILA 3: UBICACIÓN */}
                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Última ubicación conocida o avistada</label>
                    <input type="text" placeholder="Ej: Calle Regimiento / Sede Puerto Montt" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} required disabled={submitting} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dcdde1', fontSize: '14px', backgroundColor: submitting ? '#f5f5f5' : '#fff' }} />
                </div>

                {/* BOTÓN ENVIAR */}
                <button
                    type="submit"
                    disabled={submitting}
                    style={{
                        padding: '14px 28px',
                        backgroundColor: submitting ? '#558b2f' : '#1b5e20',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        fontSize: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginLeft: 'auto'
                    }}
                >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {submitting ? "Publicando en Postgres..." : "Publicar Reporte"}
                </button>
            </form>
        </div>
    );
}