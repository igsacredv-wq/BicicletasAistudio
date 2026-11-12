import React, { useState, useCallback, useEffect } from 'react';
import L from 'leaflet';
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import {
  Flag,
  Navigation,
  Mountain,
  Compass,
  ArrowRight,
  Layers,
  Sparkles,
  Video,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export interface RoutePoint {
  id: string;
  name: string;
  type: 'start' | 'end' | 'waypoint';
  position: { lat: number; lng: number };
  altitude: string;
  desc: string;
  photoCue?: string;
}

export interface TourMapData {
  id: string;
  name: string;
  shortName: string;
  color: string;
  strokeColor: string;
  distanceKm: string;
  durationHours: string;
  difficulty: 'Moderado' | 'Intermedio' | 'Desafiante';
  elevationGain: string;
  startPoint: RoutePoint;
  endPoint: RoutePoint;
  waypoints: RoutePoint[];
  path: { lat: number; lng: number }[];
  center: { lat: number; lng: number };
  zoom: number;
  highlightNote: string;
}

export const SACRED_VALLEY_MAP_DATA: TourMapData[] = [
  {
    id: 'maras-salt-mines',
    name: 'Maras y las salineras',
    shortName: 'Maras (36.5 km)',
    color: '#1e7e4c',
    strokeColor: '#1d8348',
    distanceKm: '36.5 km',
    durationHours: '5.5 h',
    difficulty: 'Intermedio',
    elevationGain: '+456 m / -1,036 m',
    center: { lat: -13.385, lng: -72.105 },
    zoom: 11,
    highlightNote: 'Ruta completa desde Cachimayo cruzando la puna hasta el cañón y el río Vilcanota',
    startPoint: {
      id: 'maras-start',
      name: 'Punto de Inicio: Cachimayo',
      type: 'start',
      position: { lat: -13.4862, lng: -72.0465 },
      altitude: '3,450 msnm',
      desc: 'Punto de encuentro y chequeo de bicicletas de montaña. Comienzo del pedaleo por pistas rurales hacia la meseta.',
      photoCue: 'Revisión técnica de cambios y frenos previa a la subida.',
    },
    endPoint: {
      id: 'maras-end',
      name: 'Punto de Llegada: Puente Vilcanota / Urubamba',
      type: 'end',
      position: { lat: -13.3148, lng: -72.1645 },
      altitude: '2,870 msnm',
      desc: 'Meta junto a las vías férreas y el puente sobre el río Vilcanota en el fondo del valle. Vehículo de apoyo esperando.',
      photoCue: 'Llegada triunfal con el rugir del río sagrado.',
    },
    waypoints: [
      {
        id: 'maras-wp-1',
        name: 'Mirador de Puna (Punto más alto)',
        type: 'waypoint',
        position: { lat: -13.4350, lng: -72.0850 },
        altitude: '3,791 msnm',
        desc: 'Cima de la travesía con vista panorámica a la cordillera de Urubamba.',
      },
      {
        id: 'maras-wp-2',
        name: 'Chequerec & Laguna Piuray',
        type: 'waypoint',
        position: { lat: -13.3980, lng: -72.1020 },
        altitude: '3,750 msnm',
        desc: 'Laguna de altura y planicies doradas con pastores andinos.',
      },
      {
        id: 'maras-wp-3',
        name: 'Pueblo Histórico de Maras',
        type: 'waypoint',
        position: { lat: -13.3325, lng: -72.1585 },
        altitude: '3,380 msnm',
        desc: 'Poblado colonial de portadas de piedra labrada e iglesias del s. XVI.',
      },
      {
        id: 'maras-wp-4',
        name: 'Salineras de Maras & Pozas',
        type: 'waypoint',
        position: { lat: -13.3039, lng: -72.1553 },
        altitude: '3,050 msnm',
        desc: 'Más de 3,000 pozas artesanales de sal rosada milenaria.',
      },
    ],
    path: [
      { lat: -13.4862, lng: -72.0465 },
      { lat: -13.4680, lng: -72.0610 },
      { lat: -13.4490, lng: -72.0720 },
      { lat: -13.4350, lng: -72.0850 }, // Mirador Puna
      { lat: -13.4150, lng: -72.0940 },
      { lat: -13.3980, lng: -72.1020 }, // Chequerec
      { lat: -13.3820, lng: -72.1150 },
      { lat: -13.3650, lng: -72.1320 }, // Mahuaypampa
      { lat: -13.3480, lng: -72.1480 }, // Anccoto
      { lat: -13.3325, lng: -72.1585 }, // Maras Pueblo
      { lat: -13.3180, lng: -72.1560 },
      { lat: -13.3039, lng: -72.1553 }, // Salineras
      { lat: -13.3090, lng: -72.1590 }, // Cañón
      { lat: -13.3148, lng: -72.1645 }, // Fin Puente
    ],
  },
  {
    id: 'pisac-terraces',
    name: 'Terrazas de Pisac',
    shortName: 'Pisac (22 km)',
    color: '#c27803',
    strokeColor: '#b86d00',
    distanceKm: '22 km',
    durationHours: '4.5 h',
    difficulty: 'Moderado',
    elevationGain: '+180 m / -850 m',
    center: { lat: -13.428, lng: -71.865 },
    zoom: 12,
    highlightNote: 'Descenso panorámico por senderos de montaña con vista a los andenes agrícolas incas',
    startPoint: {
      id: 'pisac-start',
      name: 'Punto de Inicio: Mirador de Taray / Abra Corao',
      type: 'start',
      position: { lat: -13.4420, lng: -71.8845 },
      altitude: '3,650 msnm',
      desc: 'Salida en descenso con viento a favor y vistas incomparables de la garganta del río Vilcanota.',
      photoCue: 'El Valle se abre ante los ojos con el sol de la mañana.',
    },
    endPoint: {
      id: 'pisac-end',
      name: 'Punto de Llegada: Plaza Colonial de Pisac',
      type: 'end',
      position: { lat: -13.4225, lng: -71.8480 },
      altitude: '2,972 msnm',
      desc: 'Meta en la tradicional plaza empedrada de Pisac frente a los hornos de empanadas y mercado artesanal.',
      photoCue: 'Café caliente y descanso merecido en el pueblo.',
    },
    waypoints: [
      {
        id: 'pisac-wp-1',
        name: 'Mirador Intihuatana & Alta Cordillera',
        type: 'waypoint',
        position: { lat: -13.4210, lng: -71.8510 },
        altitude: '3,300 msnm',
        desc: 'Vista a los templos del sol y recintos ceremoniales de piedra pulida.',
      },
      {
        id: 'pisac-wp-2',
        name: 'Andenes Reales de Pisac',
        type: 'waypoint',
        position: { lat: -13.4150, lng: -71.8440 },
        altitude: '3,150 msnm',
        desc: 'Sistema de terrazas que desafía la verticalidad de la montaña andina.',
      },
    ],
    path: [
      { lat: -13.4420, lng: -71.8845 }, // Inicio Taray
      { lat: -13.4380, lng: -71.8760 },
      { lat: -13.4320, lng: -71.8680 },
      { lat: -13.4260, lng: -71.8590 },
      { lat: -13.4210, lng: -71.8510 }, // Mirador
      { lat: -13.4150, lng: -71.8440 }, // Andenes
      { lat: -13.4185, lng: -71.8455 },
      { lat: -13.4225, lng: -71.8480 }, // Fin Plaza
    ],
  },
  {
    id: 'sacred-valley-day',
    name: 'El gran Valle Sagrado',
    shortName: 'Gran Valle (42 km)',
    color: '#0d6efd',
    strokeColor: '#0a58ca',
    distanceKm: '42 km',
    durationHours: '7 h',
    difficulty: 'Desafiante',
    elevationGain: '+620 m / -1,180 m',
    center: { lat: -13.315, lng: -72.160 },
    zoom: 11,
    highlightNote: 'Travesía épica de día completo atravesando Chinchero, Urubamba y los caminos a Ollantaytambo',
    startPoint: {
      id: 'valley-start',
      name: 'Punto de Inicio: Chinchero / Meseta de Huaypo',
      type: 'start',
      position: { lat: -13.3912, lng: -72.0485 },
      altitude: '3,762 msnm',
      desc: 'Comienzo en el pueblo de los tejedores andinos con vista a los picos nevados Chicón y Verónica.',
      photoCue: 'Amanecer con luz dorada sobre la meseta.',
    },
    endPoint: {
      id: 'valley-end',
      name: 'Punto de Llegada: Fortaleza de Ollantaytambo',
      type: 'end',
      position: { lat: -13.2580, lng: -72.2635 },
      altitude: '2,792 msnm',
      desc: 'Cierre del recorrido en la última ciudad inca viviente a las puertas del cañón de Machu Picchu.',
      photoCue: 'Calles incas de canales de agua viva.',
    },
    waypoints: [
      {
        id: 'valley-wp-1',
        name: 'Laguna de Huaypo',
        type: 'waypoint',
        position: { lat: -13.3750, lng: -72.1220 },
        altitude: '3,510 msnm',
        desc: 'Reflejos cristalinos de montañas y avistamiento de aves altoandinas.',
      },
      {
        id: 'valley-wp-2',
        name: 'Urubamba & Valle Central',
        type: 'waypoint',
        position: { lat: -13.3050, lng: -72.1158 },
        altitude: '2,870 msnm',
        desc: 'Almuerzo campestre con productos locales de las huertas del valle.',
      },
      {
        id: 'valley-wp-3',
        name: 'Yanahuara & Bosques de Queñua',
        type: 'waypoint',
        position: { lat: -13.2840, lng: -72.1930 },
        altitude: '2,840 msnm',
        desc: 'Senderos rápidos bordeando el río Vilcanota y maizales gigantes.',
      },
    ],
    path: [
      { lat: -13.3912, lng: -72.0485 }, // Inicio Chinchero
      { lat: -13.3850, lng: -72.0820 },
      { lat: -13.3750, lng: -72.1220 }, // Huaypo
      { lat: -13.3400, lng: -72.1200 },
      { lat: -13.3050, lng: -72.1158 }, // Urubamba
      { lat: -13.2950, lng: -72.1520 },
      { lat: -13.2840, lng: -72.1930 }, // Yanahuara
      { lat: -13.2720, lng: -72.2280 }, // Pachar
      { lat: -13.2580, lng: -72.2635 }, // Fin Ollantaytambo
    ],
  },
];

function MapCameraController({
  activeTour,
}: {
  activeTour: TourMapData | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (activeTour) {
      map.fitBounds(
        L.latLngBounds(activeTour.path.map(({ lat, lng }) => [lat, lng] as [number, number])),
        { padding: [36, 36], maxZoom: activeTour.zoom, animate: true },
      );
    } else {
      map.setView([-13.36, -72.06], 10, { animate: true });
    }
  }, [map, activeTour]);

  return null;
}

const START_MARKER_ICON = L.divIcon({
  className: 'tour-map-marker tour-map-marker-start',
  html: '<span aria-hidden="true">I</span>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const END_MARKER_ICON = L.divIcon({
  className: 'tour-map-marker tour-map-marker-end',
  html: '<span aria-hidden="true">F</span>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const MAP_TILES = {
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data © OpenStreetMap contributors, SRTM | Map style © OpenTopoMap',
  },
  roadmap: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
  },
  cycling: {
    url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors | CyclOSM',
  },
} as const;

type MapStyle = keyof typeof MAP_TILES;

interface TourMapProps {
  onSelectTourForBooking: (tourId: string) => void;
  onOpenTourVideo?: (tourId: string) => void;
}

export default function TourMap({
  onSelectTourForBooking,
  onOpenTourVideo,
}: TourMapProps) {
  const [selectedTourId, setSelectedTourId] = useState<string>('all');
  const [selectedPoint, setSelectedPoint] = useState<RoutePoint | null>(null);
  const [mapType, setMapType] = useState<MapStyle>('terrain');

  const activeTour = selectedTourId === 'all'
    ? null
    : SACRED_VALLEY_MAP_DATA.find((t) => t.id === selectedTourId) || null;

  const toursToRender = activeTour ? [activeTour] : SACRED_VALLEY_MAP_DATA;

  const handlePointClick = useCallback((point: RoutePoint) => {
    setSelectedPoint(point);
  }, []);

  return (
    <div className="tour-map-component">
      {/* Map Control Toolbar */}
      <div className="tour-map-toolbar">
        <div className="tour-map-selector-group">
          <span className="tour-map-selector-label">
            <Compass size={14} /> Rutas:
          </span>
          <button
            type="button"
            className={`tour-map-tab ${selectedTourId === 'all' ? 'active' : ''}`}
            onClick={() => {
              setSelectedTourId('all');
              setSelectedPoint(null);
            }}
          >
            Todas las rutas ({SACRED_VALLEY_MAP_DATA.length})
          </button>
          {SACRED_VALLEY_MAP_DATA.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`tour-map-tab ${selectedTourId === t.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedTourId(t.id);
                setSelectedPoint(null);
              }}
              style={
                selectedTourId === t.id
                  ? { borderColor: t.color, color: t.color, fontWeight: 700 }
                  : undefined
              }
            >
              <span
                className="tour-color-dot"
                style={{ backgroundColor: t.color }}
              />
              {t.shortName}
            </button>
          ))}
        </div>

        <div className="tour-map-controls-group">
          <div className="tour-map-type-toggle">
            <Layers size={13} />
            <button
              type="button"
              className={mapType === 'terrain' ? 'active' : ''}
              onClick={() => setMapType('terrain')}
              title="Vista de relieve topográfico"
            >
              Relieve
            </button>
            <button
              type="button"
              className={mapType === 'roadmap' ? 'active' : ''}
              onClick={() => setMapType('roadmap')}
              title="Mapa de caminos y vías"
            >
              Caminos
            </button>
            <button
              type="button"
              className={mapType === 'cycling' ? 'active' : ''}
              onClick={() => setMapType('cycling')}
              title="Mapa con rutas y caminos para bicicleta"
            >
              Ciclista
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Canvas Wrap */}
      <div className="tour-map-canvas-container">
        <MapContainer
          className="tour-leaflet-map"
          center={[-13.36, -72.06]}
          zoom={10}
          minZoom={5}
          maxZoom={19}
          scrollWheelZoom
          keyboard
          aria-label="Mapa interactivo de rutas en el Valle Sagrado"
          style={{ width: '100%', height: '100%' }}
        >
          <MapCameraController activeTour={activeTour} />
          <TileLayer
            key={mapType}
            attribution={MAP_TILES[mapType].attribution}
            url={MAP_TILES[mapType].url}
            maxZoom={19}
          />

          {toursToRender.map((tour) => {
            const isFocused = activeTour?.id === tour.id;
            return (
              <Polyline
                key={`route-${tour.id}`}
                positions={tour.path}
                pathOptions={{
                  color: tour.strokeColor,
                  opacity: isFocused ? 0.95 : 0.75,
                  weight: isFocused ? 5 : 3.5,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            );
          })}

          {toursToRender.map((tour) => (
            <React.Fragment key={`markers-${tour.id}`}>
              <Marker
                position={tour.startPoint.position}
                icon={START_MARKER_ICON}
                title={`${tour.name} - ${tour.startPoint.name}`}
                alt={`Inicio: ${tour.startPoint.name}`}
                eventHandlers={{ click: () => handlePointClick(tour.startPoint) }}
              />
              <Marker
                position={tour.endPoint.position}
                icon={END_MARKER_ICON}
                title={`${tour.name} - ${tour.endPoint.name}`}
                alt={`Llegada: ${tour.endPoint.name}`}
                eventHandlers={{ click: () => handlePointClick(tour.endPoint) }}
              />
              {activeTour?.id === tour.id &&
                tour.waypoints.map((waypoint, index) => (
                  <Marker
                    key={waypoint.id}
                    position={waypoint.position}
                    icon={L.divIcon({
                      className: 'tour-waypoint-icon',
                      html: `<span class="tour-waypoint-pin" aria-hidden="true">${index + 1}</span>`,
                      iconSize: [24, 24],
                      iconAnchor: [12, 12],
                    })}
                    title={waypoint.name}
                    alt={`Hito: ${waypoint.name}`}
                    eventHandlers={{ click: () => handlePointClick(waypoint) }}
                  />
                ))}
            </React.Fragment>
          ))}

          {selectedPoint && (
            <Popup
              position={selectedPoint.position}
              maxWidth={280}
              eventHandlers={{ remove: () => setSelectedPoint(null) }}
            >
              <div className="map-infowindow">
                <div
                  className="map-infowindow-badge"
                  style={{
                    background:
                      selectedPoint.type === 'start'
                        ? '#dcfce7'
                        : selectedPoint.type === 'end'
                          ? '#fef3c7'
                          : '#f1f5f9',
                    color:
                      selectedPoint.type === 'start'
                        ? '#166534'
                        : selectedPoint.type === 'end'
                          ? '#92400e'
                          : '#334155',
                  }}
                >
                  {selectedPoint.type === 'start' && 'PUNTO DE INICIO'}
                  {selectedPoint.type === 'end' && 'PUNTO DE LLEGADA'}
                  {selectedPoint.type === 'waypoint' && 'HITO EN RUTA'}
                </div>
                <h4>{selectedPoint.name}</h4>
                <div className="map-infowindow-altitude">
                  <Mountain size={12} /> {selectedPoint.altitude}
                </div>
                <p>{selectedPoint.desc}</p>
                {selectedPoint.photoCue && (
                  <div className="map-infowindow-cue">
                    <Sparkles size={11} /> {selectedPoint.photoCue}
                  </div>
                )}
              </div>
            </Popup>
          )}
        </MapContainer>

        {/* Legend Overlay at bottom left */}
        <div className="tour-map-legend">
          <div className="tour-map-legend-item">
            <span className="legend-pin legend-start">
              <Flag size={10} />
            </span>
            <span>Inicio de ruta (Punto de partida)</span>
          </div>
          <div className="tour-map-legend-item">
            <span className="legend-pin legend-end">
              <Navigation size={10} />
            </span>
            <span>Fin de ruta (Punto de llegada)</span>
          </div>
          <div className="tour-map-legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#1e7e4c' }} />
            <span>Maras (36.5 km)</span>
            <span className="legend-dot" style={{ backgroundColor: '#c27803' }} />
            <span>Pisac (22 km)</span>
            <span className="legend-dot" style={{ backgroundColor: '#0d6efd' }} />
            <span>Gran Valle (42 km)</span>
          </div>
        </div>

        {/* Active Tour Detail Flyout (at bottom right) */}
        {activeTour ? (
          <div className="tour-map-card">
            <div className="tour-map-card-header">
              <span className="tour-badge" style={{ position: 'static' }}>
                {activeTour.difficulty}
              </span>
              <span style={{ fontSize: '11px', color: '#68736b', fontWeight: 600 }}>
                {activeTour.distanceKm} · {activeTour.durationHours}
              </span>
            </div>
            <h4>{activeTour.name}</h4>
            <p className="tour-map-card-desc">{activeTour.highlightNote}</p>

            <div className="tour-map-card-points">
              <div className="point-row">
                <span className="badge-tag start">INICIO</span>
                <div>
                  <strong>{activeTour.startPoint.name.replace('Punto de Inicio: ', '')}</strong>
                  <small>{activeTour.startPoint.altitude}</small>
                </div>
              </div>
              <div className="point-connector" />
              <div className="point-row">
                <span className="badge-tag end">LLEGADA</span>
                <div>
                  <strong>{activeTour.endPoint.name.replace('Punto de Llegada: ', '')}</strong>
                  <small>{activeTour.endPoint.altitude}</small>
                </div>
              </div>
            </div>

            <div className="tour-map-card-actions">
              {activeTour.id === 'maras-salt-mines' && onOpenTourVideo && (
                <button
                  type="button"
                  className="tour-map-video-btn"
                  onClick={() => onOpenTourVideo(activeTour.id)}
                >
                  <Video size={12} /> Ver video 3D Relive
                </button>
              )}
              <button
                type="button"
                className="tour-map-book-btn"
                onClick={() => onSelectTourForBooking(activeTour.id)}
              >
                Reservar {activeTour.name} <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ) : (
          <div className="tour-map-card tour-map-card-hint">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#bf9a58', fontWeight: 600, fontSize: '10px' }}>
              <Compass size={13} /> EXPLORA EL VALLE
            </div>
            <h4>3 rutas únicas en bicicleta</h4>
            <p style={{ margin: '4px 0 8px', fontSize: '11px', color: '#68736b' }}>
              Haz clic en cualquiera de los marcadores de <strong>Inicio (bandera verde)</strong> o <strong>Llegada (flecha dorada)</strong> para ver la altitud y descripción del punto.
            </p>
            <span style={{ fontSize: '10px', color: '#233e31', fontWeight: 600 }}>
              Selecciona una ruta arriba para aislar su trazado y desniveles.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
