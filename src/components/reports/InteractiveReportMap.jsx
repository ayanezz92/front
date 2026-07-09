import React from "react";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const htmlEntities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};

const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => htmlEntities[char]);

const makeIcon = (color) =>
    L.divIcon({
        className: "",
        html: `
      <div style="position:relative;width:36px;height:46px;">
        <div style="position:absolute;inset:0;display:flex;align-items:flex-start;justify-content:center;">
          <svg width="36" height="46" viewBox="0 0 36 46" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 28 18 28s18-14.5 18-28C36 8.06 27.94 0 18 0z" fill="${color}"/>
            <circle cx="18" cy="18" r="7" fill="white"/>
          </svg>
        </div>
      </div>`,
        iconSize: [36, 46],
        iconAnchor: [18, 46],
        popupAnchor: [0, -42],
    });

const createPopupHtml = (reporte, typeMeta) => {
    const meta = typeMeta[reporte.type];

    return `
    <div class="min-w-[200px] font-sans">
      <p class="text-[10px] uppercase tracking-widest font-bold" style="color:${meta.color}">
        ${escapeHtml(meta.label)} · ${escapeHtml(reporte.id.toString())}
      </p>
      <p class="text-base font-bold mt-1 text-slate-800">${escapeHtml(reporte.nombre)}</p>
      <p class="text-xs text-slate-500">${escapeHtml(reporte.especie)} · ${escapeHtml(reporte.zona)}</p>
      <p class="text-xs mt-2 text-slate-600 leading-relaxed">${escapeHtml(reporte.descripcion)}</p>
      <p class="text-[10px] text-slate-400 mt-2 font-medium">${escapeHtml(reporte.fecha)}</p>
      <a href="/reportar" class="inline-block mt-3 text-xs font-bold text-[#1A365D] hover:underline">
        Tengo información →
      </a>
    </div>`;
};

const InteractiveReportMap = ({ reportes, typeMeta }) => {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        // Centrado geográfico por defecto en Puerto Montt
        const map = L.map(containerRef.current, { scrollWheelZoom: true }).setView([-41.4689, -72.9411], 12);
        const markers = L.layerGroup().addTo(map);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        mapRef.current = map;
        markersRef.current = markers;

        window.setTimeout(() => map.invalidateSize(), 0);

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
            mapRef.current = null;
            markersRef.current = null;
        };
    }, []);

    useEffect(() => {
        const markers = markersRef.current;
        if (!markers) return;

        markers.clearLayers();

        reportes.forEach((reporte) => {
            const meta = typeMeta[reporte.type];
            if (meta && reporte.lat && reporte.lng) {
                L.marker([reporte.lat, reporte.lng], { icon: makeIcon(meta.color) })
                    .bindPopup(createPopupHtml(reporte, typeMeta))
                    .addTo(markers);
            }
        });
    }, [reportes, typeMeta]);

    return <div ref={containerRef} className="h-full w-full rounded-[2rem]" aria-label="Mapa de reportes comunitarios" />;
};

export default InteractiveReportMap;