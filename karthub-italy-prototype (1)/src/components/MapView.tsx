import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Track, Race } from '../types';
import { MapPin, Calendar, ChevronRight, X, Search, Crosshair, Layers, RotateCcw, AlertCircle, Compass } from 'lucide-react';

interface MapViewProps {
  tracks: Track[];
  races: Race[];
  onSelectRace: (race: Race) => void;
  onSelectTrack: (track: Track) => void;
  selectedTrack: Track | null;
  onCloseTrackDrawer: () => void;
}

// Fix Leaflet's default icon URLs if ever instantiated
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Helper for distance calculation in KM
function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Tile layers configurations
const TILE_LAYERS = {
  osm: {
    name: 'Stradale',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    subdomains: [],
    maxZoom: 18
  },
  voyager: {
    name: 'Chiara',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 19
  }
};

export const MapView: React.FC<MapViewProps> = ({
  tracks,
  races,
  onSelectRace,
  onSelectTrack,
  selectedTrack,
  onCloseTrackDrawer
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const activeTileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('Tutte');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatusMessage, setLocationStatusMessage] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<'osm' | 'satellite' | 'voyager'>('osm');
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  // Available regions
  const regions = useMemo(() => {
    const set = new Set<string>();
    tracks.forEach(t => {
      if (t.region) set.add(t.region);
    });
    return ['Tutte', ...Array.from(set).sort()];
  }, [tracks]);

  // Filter and sort tracks by proximity if location is set
  const filteredTracks = useMemo(() => {
    return tracks.filter(track => {
      const matchRegion = selectedRegion === 'Tutte' || track.region === selectedRegion;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        track.name.toLowerCase().includes(q) ||
        track.city.toLowerCase().includes(q) ||
        track.province.toLowerCase().includes(q) ||
        track.region.toLowerCase().includes(q);
      return matchRegion && matchSearch;
    }).sort((a, b) => {
      if (!userLocation) return 0;
      const distA = haversineDistanceKm(userLocation.lat, userLocation.lng, a.lat, a.lng);
      const distB = haversineDistanceKm(userLocation.lat, userLocation.lng, b.lat, b.lng);
      return distA - distB;
    });
  }, [tracks, searchQuery, selectedRegion, userLocation]);

  // Initialize Leaflet map safely (handles React 18/19 StrictMode and Fast Refresh)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Safety: if container was previously assigned a Leaflet internal ID, remove it
    if ((mapContainerRef.current as any)._leaflet_id) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {
        console.warn('Map cleanup error:', e);
      }
      mapInstanceRef.current = null;
    }

    try {
      // Center on Italy
      const map = L.map(mapContainerRef.current, {
        center: [42.8000, 12.6000],
        zoom: 6,
        zoomControl: false,
        attributionControl: true
      });

      // Add zoom control at top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Add initial tile layer
      const config = TILE_LAYERS[mapStyle];
      const layer = L.tileLayer(config.url, {
        attribution: config.attribution,
        subdomains: config.subdomains.length ? config.subdomains : undefined,
        maxZoom: config.maxZoom
      }).addTo(map);
      activeTileLayerRef.current = layer;

      mapInstanceRef.current = map;

      // Force recalculation of container bounds after DOM layout settles
      const t1 = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);

      const t2 = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 400);

      // Resize observer to ensure the map redraws when drawer/container dimensions change
      const resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      if (mapContainerRef.current) {
        resizeObserver.observe(mapContainerRef.current);
      }

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        resizeObserver.disconnect();
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.remove();
          } catch (e) {
            console.warn('Error during map unmount:', e);
          }
          mapInstanceRef.current = null;
        }
        if (mapContainerRef.current && (mapContainerRef.current as any)._leaflet_id) {
          delete (mapContainerRef.current as any)._leaflet_id;
        }
      };
    } catch (err) {
      console.error('Fatal Leaflet init error:', err);
    }
  }, []);

  // Switch Tile Layer when mapStyle changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (activeTileLayerRef.current) {
      map.removeLayer(activeTileLayerRef.current);
    }

    const config = TILE_LAYERS[mapStyle];
    const newLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      subdomains: config.subdomains.length ? config.subdomains : undefined,
      maxZoom: config.maxZoom
    }).addTo(map);

    activeTileLayerRef.current = newLayer;
  }, [mapStyle]);

  // Update track markers when filtered tracks or selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing track markers
    Object.values(markersRef.current).forEach((m: L.Marker) => {
      try {
        m.remove();
      } catch (e) {}
    });
    markersRef.current = {};

    filteredTracks.forEach(track => {
      if (typeof track.lat !== 'number' || typeof track.lng !== 'number' || isNaN(track.lat) || isNaN(track.lng)) {
        return;
      }

      const upcomingCount = races.filter(r => r.trackId === track.id && r.status === 'Upcoming').length;
      const isSelected = selectedTrack?.id === track.id;

      // Custom Kart Pin Icon
      const customIcon = L.divIcon({
        className: 'custom-kart-pin',
        html: `
          <div class="relative group cursor-pointer transition-transform duration-200 ${isSelected ? 'scale-125 z-50' : 'hover:scale-115'}">
            <div class="w-10 h-10 rounded-full ${isSelected ? 'bg-red-600 border-2 border-white ring-4 ring-red-400 shadow-2xl' : upcomingCount > 0 ? 'bg-slate-900 border-2 border-red-500 shadow-lg shadow-red-600/40' : 'bg-slate-800 border-2 border-slate-300 shadow-md'} flex items-center justify-center text-white">
              <span class="text-sm select-none">🏎️</span>
            </div>
            ${upcomingCount > 0 ? `
              <span class="absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded-full bg-red-600 border border-white text-[10px] font-black text-white shadow">
                ${upcomingCount}
              </span>
            ` : ''}
            <div class="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded bg-slate-900/90 text-white text-[9px] font-bold whitespace-nowrap shadow pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              ${track.name}
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker([track.lat, track.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectTrack(track);
        try {
          map.flyTo([track.lat, track.lng], Math.max(map.getZoom(), 11), { duration: 1.0 });
        } catch (e) {
          map.setView([track.lat, track.lng], 11);
        }
      });

      marker.addTo(map);
      markersRef.current[track.id] = marker;
    });
  }, [filteredTracks, races, selectedTrack, onSelectTrack]);

  // Update user location marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer">
            <div class="w-6 h-6 rounded-full bg-cyan-500 border-2 border-white shadow-xl flex items-center justify-center text-[10px] text-white font-bold">
              📍
            </div>
            <div class="absolute w-8 h-8 rounded-full bg-cyan-400/40 animate-ping pointer-events-none"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
      marker.bindPopup('<b class="text-xs">La tua posizione attuale</b>');
      userMarkerRef.current = marker;
    }
  }, [userLocation]);

  // Handle locating user
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      setLocationStatusMessage('Geolocalizzazione non supportata dal browser.');
      setTimeout(() => setLocationStatusMessage(null), 4000);
      return;
    }

    setIsLocating(true);
    setLocationStatusMessage('Rilevamento coordinate GPS in corso...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const userCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(userCoords);
        setLocationStatusMessage('Posizione rilevata! Circuiti ordinati per vicinanza.');
        setTimeout(() => setLocationStatusMessage(null), 3500);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([userCoords.lat, userCoords.lng], 9, { duration: 1.5 });
        }
      },
      (err) => {
        setIsLocating(false);
        setLocationStatusMessage(`Impossibile rilevare posizione: ${err.message}`);
        setTimeout(() => setLocationStatusMessage(null), 4500);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Center on Italy
  const handleCenterItaly = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([42.8000, 12.6000], 6, { duration: 1.2 });
    }
  };

  const TODAY_STR = '2026-10-09';
  const selectedTrackRaces = selectedTrack
    ? races.filter(r => r.trackId === selectedTrack.id && r.date >= TODAY_STR)
    : [];

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem-3.5rem)] flex flex-col md:flex-row overflow-hidden bg-slate-900">
      {/* Search & Region Filter Floating Bar */}
      <div className="absolute top-3 left-3 right-3 md:left-6 md:right-auto md:w-96 z-20 space-y-2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-2.5 shadow-xl flex items-center space-x-2">
          <Search className="w-4 h-4 text-slate-400 ml-1 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca circuito, città o regione..."
            className="w-full bg-transparent border-none text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-sans font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleLocateUser}
            disabled={isLocating}
            className={`p-2 rounded-xl ${isLocating ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 hover:bg-slate-200 text-red-600'} border border-slate-200 transition cursor-pointer shrink-0`}
            title="Localizza piste più vicine"
          >
            <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Region Pills & Status */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight whitespace-nowrap transition cursor-pointer shadow-sm ${
                selectedRegion === r
                  ? 'bg-red-600 text-white shadow-red-500/30'
                  : 'bg-white/90 text-slate-700 hover:bg-white border border-slate-200/80 backdrop-blur-sm'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Status Toast message */}
        {locationStatusMessage && (
          <div className="bg-slate-900/90 text-white text-xs px-3 py-2 rounded-xl shadow-lg border border-slate-700 flex items-center space-x-2 animate-fadeIn">
            <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{locationStatusMessage}</span>
          </div>
        )}
      </div>

      {/* Floating Map Controls at top right */}
      <div className="absolute top-16 right-3 md:top-3 md:right-14 z-20 flex flex-col space-y-2 pointer-events-auto">
        {/* Reset Center Italy */}
        <button
          onClick={handleCenterItaly}
          className="p-2.5 rounded-xl bg-white/95 hover:bg-white text-slate-700 border border-slate-200 shadow-lg transition cursor-pointer flex items-center justify-center group"
          title="Centra su Italia"
        >
          <Compass className="w-4 h-4 text-slate-700 group-hover:text-red-600 transition" />
        </button>

        {/* Layer Selector */}
        <div className="relative">
          <button
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className={`p-2.5 rounded-xl bg-white/95 hover:bg-white border border-slate-200 shadow-lg transition cursor-pointer flex items-center justify-center ${isLayerMenuOpen ? 'text-red-600 ring-2 ring-red-400' : 'text-slate-700'}`}
            title="Cambia tipo mappa"
          >
            <Layers className="w-4 h-4" />
          </button>

          {isLayerMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-2xl border border-slate-200 p-1.5 space-y-1 z-30">
              {(Object.keys(TILE_LAYERS) as Array<keyof typeof TILE_LAYERS>).map(key => (
                <button
                  key={key}
                  onClick={() => {
                    setMapStyle(key);
                    setIsLayerMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                    mapStyle === key ? 'bg-red-50 text-red-600 font-extrabold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{TILE_LAYERS[key].name}</span>
                  {mapStyle === key && <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Map Container Canvas */}
      <div className="w-full h-full relative z-0">
        <div
          ref={mapContainerRef}
          id="leaflet-kart-map"
          className="w-full h-full min-h-[350px] outline-none"
        />
      </div>

      {/* Selected Track Detail Drawer / Bottom Sheet */}
      {selectedTrack && (
        <div className="absolute inset-x-3 bottom-16 md:bottom-auto md:top-16 md:right-6 md:left-auto md:w-[420px] z-30 bg-white/98 backdrop-blur-2xl border border-slate-200 rounded-2xl p-5 shadow-2xl max-h-[78vh] overflow-y-auto space-y-4 text-slate-900 pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-red-600 text-white text-[10px] font-extrabold uppercase shadow-sm">
                  {selectedTrack.region}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {selectedTrack.city} ({selectedTrack.province})
                </span>
                {userLocation && (
                  <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 text-[10px] font-extrabold">
                    📍 {haversineDistanceKm(userLocation.lat, userLocation.lng, selectedTrack.lat, selectedTrack.lng)} km
                  </span>
                )}
              </div>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight mt-1">
                {selectedTrack.name}
              </h2>
            </div>
            <button
              onClick={onCloseTrackDrawer}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Track Specs */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Lunghezza</div>
              <div className="text-xs font-black text-slate-800">{selectedTrack.lengthMeters}m</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Curve</div>
              <div className="text-xs font-black text-slate-800">{selectedTrack.turnCount}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Top Speed</div>
              <div className="text-xs font-black text-red-600">{selectedTrack.topSpeedKmh} km/h</div>
            </div>
          </div>

          {/* All-time record if exists */}
          {selectedTrack.allTimeRecord && (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-base">⏱️</span>
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-900">Record Pista</div>
                  <div className="font-extrabold text-amber-950">{selectedTrack.allTimeRecord.timeFormatted} ({selectedTrack.allTimeRecord.driverName})</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                {selectedTrack.allTimeRecord.kartType}
              </span>
            </div>
          )}

          {/* Scheduled Races at this track */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider flex items-center justify-between">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5 text-red-600" />
                GARE IN QUESTO CIRCUITO ({selectedTrackRaces.length})
              </span>
            </h4>

            {selectedTrackRaces.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs font-medium">
                Nessuna gara programmata al momento in questa pista.
              </div>
            ) : (
              <div className="space-y-2.5">
                {selectedTrackRaces.map(race => (
                  <div
                    key={race.id}
                    onClick={() => onSelectRace(race)}
                    className="group bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-red-400 rounded-xl p-3 transition cursor-pointer flex items-center justify-between shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-xs text-slate-900 group-hover:text-red-600 transition">
                          {race.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg text-[9px] bg-red-100 text-red-700 font-extrabold uppercase">
                          {race.format}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 font-medium">
                        <span>📅 {race.date} @ {race.time}</span>
                        <span className="text-emerald-600 font-extrabold">💶 €{race.entryFee}</span>
                        <span>👥 {race.registeredTeamsCount}/{race.maxGridSize} Team</span>
                      </div>
                      {race.championshipName && (
                        <div className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2 py-0.5 mt-1">
                          🏆 {race.championshipName} {race.championshipRound ? `(Tappa ${race.championshipRound}/${race.totalChampionshipRaces})` : ''}
                        </div>
                      )}
                    </div>

                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-red-600 transition shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
