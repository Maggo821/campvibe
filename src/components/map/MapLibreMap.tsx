"use client";

import { useEffect, useMemo, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { PlaceSummary } from "@/types/database";

const osmStyle: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
    },
  ],
};

interface MapLibreMapProps {
  places: PlaceSummary[];
}

const statusColors: Record<NonNullable<PlaceSummary["status"]>, string> = {
  favorite: "#111827",
  visited: "#0f766e",
  wishlist: "#b45309",
  planned: "#2563eb",
  never_again: "#b91c1c",
};

const statusLabels: Record<NonNullable<PlaceSummary["status"]>, string> = {
  favorite: "Favorit",
  visited: "Besucht",
  wishlist: "Merkliste",
  planned: "Geplant",
  never_again: "Nie wieder",
};

function isCoordinate(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) && value !== 0;
}

function createPopupHtml(place: PlaceSummary) {
  const status = place.status ?? "visited";
  return `
    <div style="min-width:220px;max-width:260px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#111827;">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
        <div>
          <div style="font-size:15px;font-weight:700;line-height:1.3;margin-bottom:2px;">${place.name}</div>
          <div style="font-size:12px;color:#6b7280;">${place.city}, ${place.country}</div>
        </div>
        <span style="font-size:11px;font-weight:600;padding:4px 10px;border-radius:999px;background:#fef3c7;color:#92400e;">${statusLabels[status]}</span>
      </div>
      <div style="margin-top:10px;font-size:13px;line-height:1.45;color:#374151;">${place.description}</div>
      <a href="/places/${place.id}" style="display:inline-block;margin-top:12px;font-size:13px;font-weight:600;color:#111827;text-decoration:none;">Zur Platz-Detailseite →</a>
    </div>
  `;
}

export function MapLibreMap({ places }: MapLibreMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const validPlaces = useMemo(
    () => places.filter((place) => isCoordinate(place.latitude) && isCoordinate(place.longitude)),
    [places],
  );

  const center = useMemo(() => {
    if (validPlaces.length === 0) {
      return { lng: 10.45, lat: 51.16, zoom: 4.2 };
    }

    const total = validPlaces.reduce(
      (accumulator, place) => {
        accumulator.lng += place.longitude;
        accumulator.lat += place.latitude;
        return accumulator;
      },
      { lng: 0, lat: 0 },
    );

    return {
      lng: total.lng / validPlaces.length,
      lat: total.lat / validPlaces.length,
      zoom: 4.8,
    };
  }, [validPlaces]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: osmStyle,
      center: [center.lng, center.lat],
      zoom: center.zoom,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center.lat, center.lng, center.zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (validPlaces.length === 0) {
      return;
    }

    const bounds = new maplibregl.LngLatBounds();

    validPlaces.forEach((place) => {
      const status = place.status ?? "visited";
      const markerElement = document.createElement("button");
      markerElement.type = "button";
      markerElement.setAttribute(
        "aria-label",
        `${place.name} (${statusLabels[status]})`,
      );
      markerElement.style.width = "18px";
      markerElement.style.height = "18px";
      markerElement.style.borderRadius = "999px";
      markerElement.style.border = "2px solid white";
      markerElement.style.background = statusColors[status];
      markerElement.style.boxShadow = "0 6px 16px rgba(0,0,0,0.25)";
      markerElement.style.cursor = "pointer";
      markerElement.style.padding = "0";

      const popup = new maplibregl.Popup({ offset: 22, closeButton: true, closeOnClick: false }).setHTML(
        createPopupHtml(place),
      );

      const marker = new maplibregl.Marker({ element: markerElement, anchor: "center" })
        .setLngLat([place.longitude, place.latitude])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
      bounds.extend([place.longitude, place.latitude]);
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 56, maxZoom: 14, duration: 700 });
    } else {
      map.easeTo({ center: [center.lng, center.lat], zoom: center.zoom, duration: 700 });
    }
  }, [center.lat, center.lng, center.zoom, validPlaces]);

  return <div ref={mapContainerRef} className="h-[70vh] min-h-[520px] w-full rounded-[1.75rem]" />;
}
