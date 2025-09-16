'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Thermometer, Droplets, Wind, AlertTriangle } from 'lucide-react';

// Import JSON data
import forestsData from '@/data/forests.json';
import sensorsData from '@/data/sensors.json';
import alertsData from '@/data/alerts.json';
import analyticsData from '@/data/analytics.json';

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  selectedForest: string | null;
  activeView: 'overview' | 'monitoring' | 'alerts' | 'analytics';
}

// Extract forest boundaries from JSON data
const forestBoundaries = forestsData.forests.reduce((acc, forest) => {
  acc[forest.id] = forest.boundaries;
  return acc;
}, {} as Record<string, number[][]>);

// Use imported data
const sensors = sensorsData.sensors;
const alerts = alertsData.alerts;
const analyticsZones = analyticsData.analyticsZones;

// Custom icons for different marker types
const createCustomIcon = (type: string, status?: string) => {
  const color = status === 'alert' ? '#ef4444' : type === 'sensor' ? '#3b82f6' : '#10b981';
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

function MapController({ selectedForest }: { selectedForest: string | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedForest && forestBoundaries[selectedForest as keyof typeof forestBoundaries]) {
      const bounds = forestBoundaries[selectedForest as keyof typeof forestBoundaries];
      map.fitBounds(bounds as L.LatLngBoundsExpression);
    } else {
      // Default view of continental US
      map.setView([39.8283, -98.5795], 4);
    }
  }, [selectedForest, map]);

  return null;
}

export default function InteractiveMap({ selectedForest, activeView }: InteractiveMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'temperature': return <Thermometer className="h-4 w-4" />;
      case 'humidity': return <Droplets className="h-4 w-4" />;
      case 'wind': return <Wind className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <MapContainer
      center={[39.8283, -98.5795]}
      zoom={4}
      className="h-full w-full"
      zoomControl={true}
    >
      <TileLayer
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Satellite layer option */}
      <TileLayer
        // attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        opacity={0.7}
      />

      <MapController selectedForest={selectedForest} />

      {/* Forest boundaries */}
      {Object.entries(forestBoundaries).map(([forestId, boundary]) => (
        <Polygon
          key={forestId}
          positions={boundary as L.LatLngExpression[]}
          pathOptions={{
            color: selectedForest === forestId ? '#10b981' : '#6b7280',
            weight: selectedForest === forestId ? 3 : 2,
            opacity: 0.8,
            fillOpacity: selectedForest === forestId ? 0.2 : 0.1,
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold capitalize">{forestId.replace('_', ' ')} National Forest</h3>
              <p className="text-sm text-gray-600">Click to view details</p>
            </div>
          </Popup>
        </Polygon>
      ))}

      {/* Sensors (monitoring view) */}
      {activeView === 'monitoring' && sensors.map((sensor) => (
        <Marker
          key={sensor.id}
          position={[sensor.lat, sensor.lng]}
          icon={createCustomIcon('sensor')}
        >
          <Popup>
            <div className="p-3 min-w-[200px]">
              <div className="flex items-center space-x-2 mb-2">
                {getSensorIcon(sensor.type)}
                <h3 className="font-semibold capitalize">{sensor.type.replace('_', ' ')} Sensor</h3>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-blue-600">{sensor.value}</p>
                <p className="text-sm text-gray-600">Status: {sensor.status}</p>
                <p className="text-xs text-gray-500">Last updated: 2 min ago</p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Alerts */}
      {activeView === 'alerts' && alerts.map((alert) => (
        <Marker
          key={alert.id}
          position={[alert.lat, alert.lng]}
          icon={createCustomIcon('alert', 'alert')}
        >
          <Popup>
            <div className="p-3 min-w-[250px]">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <h3 className="font-semibold capitalize">{alert.type.replace('_', ' ')} Alert</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Level:</span>
                  <span
                    className="px-2 py-1 rounded text-xs font-medium text-white"
                    style={{ backgroundColor: getAlertColor(alert.level) }}
                  >
                    {alert.level.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{alert.message}</p>
                <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                  View Details
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Analytics view - heat maps and zones */}
      {activeView === 'analytics' && (
        <>
          {analyticsZones.map((zone) => (
            <Circle
              key={zone.id}
              center={zone.center as L.LatLngExpression}
              radius={zone.radius}
              pathOptions={{ color: zone.color, fillOpacity: zone.fillOpacity }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{zone.name}</h3>
                  <p className="text-sm">{zone.metrics.description}</p>
                </div>
              </Popup>
            </Circle>
          ))}
        </>
      )}
    </MapContainer>
  );
}
