import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationMap.css';

// Fix leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Known locations with coordinates
const LOCATIONS = {
  'douala': { lat: 4.0511, lng: 9.7679, name: 'Douala' },
  'yaoundé': { lat: 3.8480, lng: 11.5021, name: 'Yaoundé' },
  'yaounde': { lat: 3.8480, lng: 11.5021, name: 'Yaoundé' },
  'bafoussam': { lat: 5.4737, lng: 10.4176, name: 'Bafoussam' },
  'garoua': { lat: 9.3017, lng: 13.3981, name: 'Garoua' },
  'bamenda': { lat: 5.9527, lng: 10.1460, name: 'Bamenda' },
  'kribi': { lat: 2.9400, lng: 9.9100, name: 'Kribi' },
  'limbé': { lat: 4.0186, lng: 9.2043, name: 'Limbé' },
  'limbe': { lat: 4.0186, lng: 9.2043, name: 'Limbé' },
  'maroua': { lat: 10.5953, lng: 14.3157, name: 'Maroua' },
  'ngaoundéré': { lat: 7.3217, lng: 13.5847, name: 'Ngaoundéré' },
  'bertoua': { lat: 4.5773, lng: 13.6845, name: 'Bertoua' },
  'ebolowa': { lat: 2.9000, lng: 11.1500, name: 'Ebolowa' },
  'aéroport douala': { lat: 4.0061, lng: 9.7194, name: 'Aéroport Douala' },
  'aéroport yaoundé': { lat: 3.7200, lng: 11.5533, name: 'Aéroport Yaoundé-Nsimalen' },
  'paris': { lat: 48.8566, lng: 2.3522, name: 'Paris' },
  'abidjan': { lat: 5.3600, lng: -4.0083, name: 'Abidjan' },
  'libreville': { lat: 0.4162, lng: 9.4673, name: 'Libreville' },
};

const getCoords = (locationStr) => {
  if (!locationStr) return null;
  const lower = locationStr.toLowerCase().trim();
  for (const [key, val] of Object.entries(LOCATIONS)) {
    if (lower.includes(key)) return val;
  }
  return null;
};

const FitBounds = ({ markers }) => {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }, [markers, map]);
  return null;
};

const LocationMap = ({ locations = [], height = '300px' }) => {
  const markers = locations
    .map(loc => {
      if (loc.lat && loc.lng) return { ...loc };
      const coords = getCoords(loc.address);
      if (!coords) return null;
      return { ...coords, ...loc };
    })
    .filter(Boolean);

  const center = markers.length > 0
    ? [markers[0].lat, markers[0].lng]
    : [4.0511, 9.7679]; // Default: Douala

  return (
    <div className="location-map-wrapper" style={{ height }}>
      <MapContainer center={center} zoom={7} style={{ height: '100%', width: '100%', borderRadius: '14px' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.length > 1 && <FitBounds markers={markers} />}
        {markers.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lng]} icon={m.type === 'vehicle' ? greenIcon : redIcon}>
            <Popup>
              <strong>{m.label || m.name}</strong>
              {m.detail && <div style={{ fontSize: '0.85em', marginTop: '2px' }}>{m.detail}</div>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

// Get all unique location names for autocomplete
const getAllLocationNames = () => {
  const seen = new Set();
  return Object.values(LOCATIONS)
    .filter(loc => { if (seen.has(loc.name)) return false; seen.add(loc.name); return true; })
    .map(loc => loc.name);
};

// Search locations matching a query (local fallback)
const searchLocations = (query) => {
  if (!query || query.length < 1) return [];
  const lower = query.toLowerCase();
  const seen = new Set();
  return Object.values(LOCATIONS)
    .filter(loc => {
      if (seen.has(loc.name)) return false;
      seen.add(loc.name);
      return loc.name.toLowerCase().includes(lower);
    })
    .slice(0, 6);
};

// Online address autocomplete via Nominatim (OpenStreetMap)
const searchAddressOnline = async (query) => {
  if (!query || query.length < 3) return [];
  try {
    const params = new URLSearchParams({
      format: 'json',
      q: query,
      limit: '10',
      addressdetails: '1',
      'accept-language': 'fr',
      dedupe: '1',
      layer: 'address,poi',
      countrycodes: 'cm,fr,ci,ga',
      bounded: '0',
      viewbox: '1.5,13.5,16.5,1.5',
    });
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      { headers: { 'Accept-Language': 'fr', 'User-Agent': 'StelleCard/1.0' } }
    );
    const data = await res.json();
    return data.map(item => {
      const a = item.address || {};
      const parts = [
        a.house_number,
        a.road,
        a.suburb || a.neighbourhood || a.quarter,
        a.city || a.town || a.village || a.municipality,
        a.county || a.state_district,
        a.state,
        a.postcode,
        a.country
      ].filter(Boolean);
      return {
        name: parts.join(', ') || item.display_name,
        fullName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type,
      };
    });
  } catch {
    return searchLocations(query);
  }
};

export { getCoords, LOCATIONS, getAllLocationNames, searchLocations, searchAddressOnline };
export default LocationMap;
