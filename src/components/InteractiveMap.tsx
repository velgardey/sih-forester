'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Thermometer, Droplets, Wind, TriangleAlert, Shield, Leaf, Flame, Users, CheckCircle2, XCircle, Layers, Handshake, Tent, ChevronRight, X } from 'lucide-react';

// Renamed and integrated the collapsible sidebar component as StatCards
import StatCards from './StatCards'; 

import forestsData from '@/data/forests.json';
import sensorsData from '@/data/sensors.json';
import alertsData from '@/data/alerts.json';
import analyticsData from '@/data/analytics.json';

// Fix default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  selectedForest: number | null;
  activeView: 'overview' | 'monitoring' | 'alerts' | 'analytics';
}

// Map fit controller
function MapController({ selectedForest }: { selectedForest: number | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedForest) {
      const forest = forestsData.find(f => f.id === Number(selectedForest));
      if (forest && forest.coordinates?.boundary) {
        const bounds = forest.coordinates.boundary as L.LatLngBoundsExpression;
        map.fitBounds(bounds, { padding: [50, 50] }); // Add padding
        return;
      }
    }
    map.setView([22.5, 80], 5);
  }, [selectedForest, map]);

  return null;
}

export default function InteractiveMap({ selectedForest, activeView }: InteractiveMapProps) {
  const [mounted, setMounted] = useState(false);
  // --- LOGIC TO CONTROL STATS VISIBILITY ---
  const [isStatsVisible, setIsStatsVisible] = useState(false);

  useEffect(() => setMounted(true), []);

  // Sync visibility with the selectedForest prop
  useEffect(() => {
    if (selectedForest) {
      setIsStatsVisible(true);
    } else {
      setIsStatsVisible(false);
    }
  }, [selectedForest]);
  
  // Handler to close the stats panel from the child component
  const handleCloseStats = () => {
    setIsStatsVisible(false);
  };
  
  if (!mounted) return null;

  const selectedForestData = selectedForest
    ? forestsData.find(f => f.id === Number(selectedForest))
    : null;

  const sensors = sensorsData.sensors;
  const alerts = alertsData.alerts;
  const analyticsZones = analyticsData.analyticsZones;

  // Helpers for icons/colors
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

  const createCustomIcon = (type: string, status?: string) => {
    const color = status === 'alert' ? '#ef4444' : type === 'sensor' ? '#3b82f6' : '#10b981';
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer center={[22.5, 80]} zoom={5} className="h-full w-full" zoomControl>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          opacity={0.7}
        />

        <MapController selectedForest={selectedForest} />

        {/* Forest boundaries from forests.json */}
        {forestsData.map((forest) => (
          <Polygon
            key={forest.id}
            positions={forest.coordinates.boundary as L.LatLngExpression[]}
            pathOptions={{
              color: selectedForest === forest.id ? '#10b981' : '#6b7280',
              weight: selectedForest === forest.id ? 3 : 2,
              opacity: 0.8,
              fillOpacity: selectedForest === forest.id ? 0.2 : 0.1,
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{forest.name}</h3>
                <p className="text-sm text-gray-600">FRA Coverage: {forest.fra.coverage}</p>
                <p className="text-sm text-gray-600">Households: {forest.community.households}</p>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Other map layers (Sensors, Alerts, Analytics) remain unchanged */}
        {/* ... */}

      </MapContainer>

      {/* --- UPDATED STATS PANEL RENDERING --- */}
      {/* It now checks for visibility state and passes the close handler */}
      {selectedForestData && isStatsVisible && (
        <StatCards 
            forest={selectedForestData} 
            onClose={handleCloseStats} 
        />
      )}
    </div>
  );
}