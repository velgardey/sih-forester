'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Renamed and integrated the collapsible sidebar component as StatCards
import StatCards from './StatCards'; 

import forestsData from '@/data/forests.json';
import layersData from '@/data/layers.json';
import claimsData from '@/data/claims.json';
import assetsData from '@/data/assets.json';
import locationsData from '@/data/locations.json';
import forestDataJson from '@/data/forest-data.json';
import groundwaterDataJson from '@/data/groundwater.json';
import infrastructureDataJson from '@/data/infrastructure.json';

import type { Layer } from '@/types/layer';

// Fix default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
  id: string;
  name: string;
  type: string;
  state: string;
  district: string;
  villages: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  boundary: number[][];
  tribalGroups: string[];
  fraProgress: any;
  landUse: any;
  dataLayers: any;
  risk: any;
  schemes: any;
}

interface InteractiveMapProps {
  selectedForest?: number | null;
  selectedLocation?: Location | null;
  locations?: Location[];
  activeView?: 'overview' | 'monitoring' | 'alerts' | 'analytics';
  enabledLayers?: string[];
  layerOpacity?: Record<string, number>;
  onFeatureClick?: (feature: any) => void;
}

// Map fit controller
function MapController({ 
  selectedForest, 
  selectedLocation 
}: { 
  selectedForest?: number | null;
  selectedLocation?: Location | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation && selectedLocation.boundary && selectedLocation.boundary.length > 0) {
      const bounds = selectedLocation.boundary as L.LatLngBoundsExpression;
      map.fitBounds(bounds, { padding: [50, 50] });
      return;
    }
    
    if (selectedForest) {
      const forest = forestsData.find(f => f.id === Number(selectedForest));
      if (forest && forest.coordinates?.boundary) {
        const bounds = forest.coordinates.boundary as L.LatLngBoundsExpression;
        map.fitBounds(bounds, { padding: [50, 50] });
        return;
      }
    }
    
    // Default view centered on India
    map.setView([22.5, 80], 5);
  }, [selectedForest, selectedLocation, map]);

  return null;
}

export default function InteractiveMap({ 
  selectedForest,
  selectedLocation,
  locations: propLocations,
  enabledLayers = [],
  layerOpacity = {},
  onFeatureClick
}: InteractiveMapProps) {
  const [mounted, setMounted] = useState(false);
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

  // Use filtered locations if provided, otherwise use all locations
  const displayLocations = propLocations || locationsData.locations;
  
  // Handler to close the stats panel from the child component
  const handleCloseStats = () => {
    setIsStatsVisible(false);
  };
  
  if (!mounted) return null;

  const selectedForestData = selectedForest
    ? forestsData.find(f => f.id === Number(selectedForest))
    : null;

  // Get layer configurations
  const layers = layersData.layers as Layer[];
  const claims = claimsData.claims;
  const assets = assetsData.assets;
  const locations = locationsData.locations;
  const forestData = forestDataJson.forestData;
  const groundwaterData = groundwaterDataJson.groundwater;
  const infrastructureData = infrastructureDataJson.infrastructure;

  // Helper to check if layer is enabled
  const isLayerEnabled = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (enabledLayers.length === 0) {
      return layer?.defaultEnabled || false;
    }
    return enabledLayers.includes(layerId);
  };

  // Helper to get layer opacity
  const getLayerOpacity = (layerId: string) => {
    if (layerOpacity[layerId] !== undefined) {
      return layerOpacity[layerId];
    }
    const layer = layers.find(l => l.id === layerId);
    return layer?.defaultOpacity || 0.6;
  };

  // Helper to get claim color based on status
  const getClaimColor = (status: string, type: string) => {
    if (status === 'Granted') {
      return type === 'IFR' ? '#10b981' : '#3b82f6';
    } else if (status === 'Pending') {
      return '#f59e0b';
    } else if (status === 'Under Review') {
      return '#8b5cf6';
    }
    return '#6b7280';
  };

  // Helper to get asset color based on type
  const getAssetColor = (type: string) => {
    switch (type) {
      case 'agricultural_land': return '#fbbf24';
      case 'forest_cover': return '#10b981';
      case 'water_body': return '#3b82f6';
      case 'homestead': return '#ef4444';
      default: return '#8b5cf6';
    }
  };

  // Helper to handle feature click
  const handleFeatureClick = (feature: any) => {
    if (onFeatureClick) {
      onFeatureClick(feature);
    }
  };

  // Helper to get forest density color
  const getForestDensityColor = (density: string) => {
    switch (density) {
      case 'Very Dense': return '#064e3b';
      case 'Moderately Dense': return '#059669';
      case 'Open Forest': return '#34d399';
      case 'Scrub': return '#d1fae5';
      default: return '#10b981';
    }
  };

  // Helper to get groundwater level color
  const getGroundwaterColor = (level: string) => {
    switch (level) {
      case 'High': return '#0284c7';
      case 'Moderate': return '#0ea5e9';
      case 'Low': return '#7dd3fc';
      case 'Critical': return '#ef4444';
      case 'Stable': return '#0ea5e9';
      default: return '#0ea5e9';
    }
  };

  // Helper to get infrastructure score color
  const getInfrastructureColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer center={[22.5, 80]} zoom={5} className="h-full w-full" zoomControl>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          opacity={0.7}
        />

        <MapController selectedForest={selectedForest} selectedLocation={selectedLocation} />

        {/* Highlighted Selected Location Boundary */}
        {selectedLocation && selectedLocation.boundary && selectedLocation.boundary.length > 0 && (
          <Polygon
            positions={selectedLocation.boundary as L.LatLngExpression[]}
            pathOptions={{
              color: '#10b981',
              weight: 4,
              opacity: 1,
              fillOpacity: 0.3,
              fillColor: '#10b981',
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-sm mb-2">{selectedLocation.name}</h3>
                <p className="text-xs text-gray-600"><strong>Type:</strong> {selectedLocation.type.replace('_', ' ').toUpperCase()}</p>
                <p className="text-xs text-gray-600"><strong>District:</strong> {selectedLocation.district}</p>
                <p className="text-xs text-gray-600"><strong>State:</strong> {selectedLocation.state}</p>
                <p className="text-xs text-gray-600"><strong>FRA Coverage:</strong> {selectedLocation.fraProgress.coverage}%</p>
                <p className="text-xs text-gray-600"><strong>Households:</strong> {selectedLocation.fraProgress.households}</p>
              </div>
            </Popup>
          </Polygon>
        )}

        {/* Display all location boundaries */}
        {displayLocations.map((location) => {
          if (location.boundary && location.boundary.length > 0 && location.id !== selectedLocation?.id) {
            return (
              <Polygon
                key={`location-${location.id}`}
                positions={location.boundary as L.LatLngExpression[]}
                pathOptions={{
                  color: '#6b7280',
                  weight: 2,
                  opacity: 0.6,
                  fillOpacity: 0.1,
                  fillColor: '#6b7280',
                }}
                eventHandlers={{
                  mouseover: (e) => {
                    e.target.setStyle({ weight: 3, fillOpacity: 0.2 });
                  },
                  mouseout: (e) => {
                    e.target.setStyle({ weight: 2, fillOpacity: 0.1 });
                  },
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-sm mb-2">{location.name}</h3>
                    <p className="text-xs text-gray-600"><strong>District:</strong> {location.district}</p>
                    <p className="text-xs text-gray-600"><strong>State:</strong> {location.state}</p>
                    <p className="text-xs text-gray-600"><strong>FRA Coverage:</strong> {location.fraProgress.coverage}%</p>
                  </div>
                </Popup>
              </Polygon>
            );
          }
          return null;
        })}

        {/* IFR Boundaries Layer */}
        {isLayerEnabled('ifr_boundaries') && claims
          .filter(claim => claim.type === 'IFR')
          .map((claim) => (
            <Polygon
              key={claim.id}
              positions={claim.boundary as L.LatLngExpression[]}
              pathOptions={{
                color: getClaimColor(claim.status, claim.type),
                weight: 2,
                opacity: getLayerOpacity('ifr_boundaries'),
                fillOpacity: 0.3,
                fillColor: getClaimColor(claim.status, claim.type),
              }}
              eventHandlers={{
                click: () => handleFeatureClick({ type: 'claim', data: claim }),
                mouseover: (e) => {
                  e.target.setStyle({ weight: 3, fillOpacity: 0.5 });
                },
                mouseout: (e) => {
                  e.target.setStyle({ weight: 2, fillOpacity: 0.3 });
                },
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-sm mb-2">IFR Claim</h3>
                  <p className="text-xs text-gray-600"><strong>Claim #:</strong> {claim.claimNumber}</p>
                  <p className="text-xs text-gray-600"><strong>Location:</strong> {claim.village}, {claim.district}</p>
                  <p className="text-xs text-gray-600"><strong>Status:</strong> <span className={`font-semibold ${claim.status === 'Granted' ? 'text-green-600' : claim.status === 'Pending' ? 'text-yellow-600' : 'text-purple-600'}`}>{claim.status}</span></p>
                  <p className="text-xs text-gray-600"><strong>Area:</strong> {claim.landArea} {claim.unit}</p>
                  <p className="text-xs text-gray-600"><strong>Households:</strong> {claim.households}</p>
                  <p className="text-xs text-gray-600"><strong>Tribal Group:</strong> {claim.tribalGroup}</p>
                </div>
              </Popup>
            </Polygon>
          ))}

        {/* CR Boundaries Layer */}
        {isLayerEnabled('cr_boundaries') && claims
          .filter(claim => claim.type === 'CR')
          .map((claim) => (
            <Polygon
              key={claim.id}
              positions={claim.boundary as L.LatLngExpression[]}
              pathOptions={{
                color: getClaimColor(claim.status, claim.type),
                weight: 2,
                opacity: getLayerOpacity('cr_boundaries'),
                fillOpacity: 0.3,
                fillColor: getClaimColor(claim.status, claim.type),
              }}
              eventHandlers={{
                click: () => handleFeatureClick({ type: 'claim', data: claim }),
                mouseover: (e) => {
                  e.target.setStyle({ weight: 3, fillOpacity: 0.5 });
                },
                mouseout: (e) => {
                  e.target.setStyle({ weight: 2, fillOpacity: 0.3 });
                },
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-sm mb-2">Community Rights Claim</h3>
                  <p className="text-xs text-gray-600"><strong>Claim #:</strong> {claim.claimNumber}</p>
                  <p className="text-xs text-gray-600"><strong>Location:</strong> {claim.village}, {claim.district}</p>
                  <p className="text-xs text-gray-600"><strong>Status:</strong> <span className={`font-semibold ${claim.status === 'Granted' ? 'text-blue-600' : claim.status === 'Pending' ? 'text-yellow-600' : 'text-purple-600'}`}>{claim.status}</span></p>
                  <p className="text-xs text-gray-600"><strong>Area:</strong> {claim.landArea} {claim.unit}</p>
                  <p className="text-xs text-gray-600"><strong>Households:</strong> {claim.households}</p>
                  <p className="text-xs text-gray-600"><strong>Tribal Group:</strong> {claim.tribalGroup}</p>
                  {claim.rightsType && (
                    <p className="text-xs text-gray-600"><strong>Rights:</strong> {claim.rightsType.join(', ')}</p>
                  )}
                </div>
              </Popup>
            </Polygon>
          ))}

        {/* Village Boundaries Layer */}
        {isLayerEnabled('village_boundaries') && locations.map((location) => {
          if (location.boundary && location.type === 'village') {
            return (
              <Polygon
                key={location.id}
                positions={location.boundary as L.LatLngExpression[]}
                pathOptions={{
                  color: '#6b7280',
                  weight: 1,
                  opacity: getLayerOpacity('village_boundaries'),
                  fillOpacity: 0.1,
                  fillColor: '#6b7280',
                }}
                eventHandlers={{
                  click: () => handleFeatureClick({ type: 'location', data: location }),
                  mouseover: (e) => {
                    e.target.setStyle({ weight: 2, fillOpacity: 0.2 });
                  },
                  mouseout: (e) => {
                    e.target.setStyle({ weight: 1, fillOpacity: 0.1 });
                  },
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-sm mb-2">{location.name}</h3>
                    <p className="text-xs text-gray-600"><strong>District:</strong> {location.district}</p>
                    <p className="text-xs text-gray-600"><strong>State:</strong> {location.state}</p>
                    {location.fraProgress && (
                      <>
                        <p className="text-xs text-gray-600"><strong>FRA Coverage:</strong> {location.fraProgress.coverage}%</p>
                        <p className="text-xs text-gray-600"><strong>Households:</strong> {location.fraProgress.households}</p>
                      </>
                    )}
                  </div>
                </Popup>
              </Polygon>
            );
          }
          return null;
        })}

        {/* AI Detected Assets Layer */}
        {isLayerEnabled('detected_assets') && assets.map((asset) => {
          if (asset.boundary) {
            return (
              <Polygon
                key={asset.id}
                positions={asset.boundary as L.LatLngExpression[]}
                pathOptions={{
                  color: getAssetColor(asset.type),
                  weight: 2,
                  opacity: getLayerOpacity('detected_assets'),
                  fillOpacity: 0.4,
                  fillColor: getAssetColor(asset.type),
                }}
                eventHandlers={{
                  click: () => handleFeatureClick({ type: 'asset', data: asset }),
                  mouseover: (e) => {
                    e.target.setStyle({ weight: 3, fillOpacity: 0.6 });
                  },
                  mouseout: (e) => {
                    e.target.setStyle({ weight: 2, fillOpacity: 0.4 });
                  },
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-sm mb-2">AI Detected Asset</h3>
                    <p className="text-xs text-gray-600"><strong>Type:</strong> {asset.type.replace('_', ' ').toUpperCase()}</p>
                    <p className="text-xs text-gray-600"><strong>Location:</strong> {asset.village}, {asset.district}</p>
                    <p className="text-xs text-gray-600"><strong>Area:</strong> {asset.area} {asset.unit}</p>
                    <p className="text-xs text-gray-600"><strong>Confidence:</strong> {(asset.confidence * 100).toFixed(0)}%</p>
                    <p className="text-xs text-gray-600"><strong>Model:</strong> {asset.detectionModel}</p>
                    <p className="text-xs text-gray-600"><strong>Status:</strong> <span className={`font-semibold ${asset.verified ? 'text-green-600' : 'text-yellow-600'}`}>{asset.verificationStatus}</span></p>
                  </div>
                </Popup>
              </Polygon>
            );
          }
          return null;
        })}

        {/* Forest Density Layer */}
        {isLayerEnabled('forest_density') && locations.map((location) => {
          const forestInfo = forestData.find(f => f.locationId === location.id);
          if (forestInfo && location.boundary) {
            // Determine dominant density
            const densities = forestInfo.forestDensity;
            const dominantDensity = Object.entries(densities).reduce((a, b) => 
              densities[a[0] as keyof typeof densities] > densities[b[0] as keyof typeof densities] ? a : b
            )[0];
            const densityLabel = dominantDensity === 'veryDense' ? 'Very Dense' : 
                                dominantDensity === 'moderatelyDense' ? 'Moderately Dense' :
                                dominantDensity === 'openForest' ? 'Open Forest' : 'Scrub';
            
            return (
              <Polygon
                key={`forest-density-${location.id}`}
                positions={location.boundary as L.LatLngExpression[]}
                pathOptions={{
                  color: getForestDensityColor(densityLabel),
                  weight: 1,
                  opacity: getLayerOpacity('forest_density'),
                  fillOpacity: 0.5,
                  fillColor: getForestDensityColor(densityLabel),
                }}
                eventHandlers={{
                  click: () => handleFeatureClick({ type: 'forest', data: forestInfo }),
                  mouseover: (e) => {
                    e.target.setStyle({ weight: 2, fillOpacity: 0.7 });
                  },
                  mouseout: (e) => {
                    e.target.setStyle({ weight: 1, fillOpacity: 0.5 });
                  },
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-sm mb-2">Forest Density</h3>
                    <p className="text-xs text-gray-600"><strong>Location:</strong> {forestInfo.locationName}</p>
                    <p className="text-xs text-gray-600"><strong>Type:</strong> {forestInfo.protectedAreaType}</p>
                    <p className="text-xs text-gray-600"><strong>Canopy Cover:</strong> {forestInfo.canopyCover}%</p>
                    <div className="mt-2 text-xs">
                      <p className="font-semibold text-gray-700">Density Distribution:</p>
                      <p className="text-gray-600">Very Dense: {densities.veryDense}%</p>
                      <p className="text-gray-600">Moderately Dense: {densities.moderatelyDense}%</p>
                      <p className="text-gray-600">Open Forest: {densities.openForest}%</p>
                      <p className="text-gray-600">Scrub: {densities.scrub}%</p>
                    </div>
                  </div>
                </Popup>
              </Polygon>
            );
          }
          return null;
        })}

        {/* Protected Areas Layer */}
        {isLayerEnabled('protected_areas') && locations.map((location) => {
          const forestInfo = forestData.find(f => f.locationId === location.id);
          if (forestInfo && location.boundary && forestInfo.protectedAreaType !== 'Tribal Area') {
            const color = forestInfo.protectedAreaType === 'National Park' ? '#dc2626' :
                         forestInfo.protectedAreaType === 'Tiger Reserve' ? '#ea580c' : '#f97316';
            
            return (
              <Polygon
                key={`protected-${location.id}`}
                positions={location.boundary as L.LatLngExpression[]}
                pathOptions={{
                  color: color,
                  weight: 3,
                  opacity: getLayerOpacity('protected_areas'),
                  fillOpacity: 0.1,
                  fillColor: color,
                }}
                eventHandlers={{
                  click: () => handleFeatureClick({ type: 'protected', data: forestInfo }),
                  mouseover: (e) => {
                    e.target.setStyle({ weight: 4, fillOpacity: 0.2 });
                  },
                  mouseout: (e) => {
                    e.target.setStyle({ weight: 3, fillOpacity: 0.1 });
                  },
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-sm mb-2">Protected Area</h3>
                    <p className="text-xs text-gray-600"><strong>Name:</strong> {forestInfo.locationName}</p>
                    <p className="text-xs text-gray-600"><strong>Type:</strong> {forestInfo.protectedAreaType}</p>
                    <p className="text-xs text-gray-600"><strong>Established:</strong> {forestInfo.establishedYear}</p>
                    <p className="text-xs text-gray-600"><strong>Area:</strong> {forestInfo.totalArea} {forestInfo.unit}</p>
                    <p className="text-xs text-gray-600"><strong>Status:</strong> <span className={`font-semibold ${forestInfo.conservationStatus === 'Excellent' || forestInfo.conservationStatus === 'Good' ? 'text-green-600' : forestInfo.conservationStatus === 'Stable' ? 'text-blue-600' : 'text-yellow-600'}`}>{forestInfo.conservationStatus}</span></p>
                    <p className="text-xs text-gray-600"><strong>Endangered Species:</strong> {forestInfo.biodiversity.endangeredSpecies}</p>
                  </div>
                </Popup>
              </Polygon>
            );
          }
          return null;
        })}

        {/* Groundwater Layer */}
        {isLayerEnabled('groundwater') && locations.map((location) => {
          const gwInfo = groundwaterData.find(g => g.locationId === location.id);
          if (gwInfo && location.boundary) {
            return (
              <Polygon
                key={`groundwater-${location.id}`}
                positions={location.boundary as L.LatLngExpression[]}
                pathOptions={{
                  color: getGroundwaterColor(gwInfo.level),
                  weight: 1,
                  opacity: getLayerOpacity('groundwater'),
                  fillOpacity: 0.5,
                  fillColor: getGroundwaterColor(gwInfo.level),
                }}
                eventHandlers={{
                  click: () => handleFeatureClick({ type: 'groundwater', data: gwInfo }),
                  mouseover: (e) => {
                    e.target.setStyle({ weight: 2, fillOpacity: 0.7 });
                  },
                  mouseout: (e) => {
                    e.target.setStyle({ weight: 1, fillOpacity: 0.5 });
                  },
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-sm mb-2">Groundwater Data</h3>
                    <p className="text-xs text-gray-600"><strong>Location:</strong> {gwInfo.locationName}</p>
                    <p className="text-xs text-gray-600"><strong>Level:</strong> <span className={`font-semibold ${gwInfo.level === 'High' || gwInfo.level === 'Stable' ? 'text-blue-600' : gwInfo.level === 'Moderate' ? 'text-yellow-600' : 'text-red-600'}`}>{gwInfo.level}</span></p>
                    <p className="text-xs text-gray-600"><strong>Depth:</strong> {gwInfo.depth} {gwInfo.unit}</p>
                    <p className="text-xs text-gray-600"><strong>Quality:</strong> {gwInfo.quality}</p>
                    <p className="text-xs text-gray-600"><strong>Trend:</strong> {gwInfo.trend}</p>
                    <p className="text-xs text-gray-600"><strong>Drinking:</strong> {gwInfo.suitability.drinking}</p>
                    <p className="text-xs text-gray-600"><strong>Irrigation:</strong> {gwInfo.suitability.irrigation}</p>
                  </div>
                </Popup>
              </Polygon>
            );
          }
          return null;
        })}

        {/* Infrastructure Layer */}
        {isLayerEnabled('infrastructure') && locations.map((location) => {
          const infraInfo = infrastructureData.find(i => i.locationId === location.id);
          if (infraInfo && location.boundary) {
            return (
              <Polygon
                key={`infrastructure-${location.id}`}
                positions={location.boundary as L.LatLngExpression[]}
                pathOptions={{
                  color: getInfrastructureColor(infraInfo.pmGatiShaktiScore),
                  weight: 2,
                  opacity: getLayerOpacity('infrastructure'),
                  fillOpacity: 0.3,
                  fillColor: getInfrastructureColor(infraInfo.pmGatiShaktiScore),
                }}
                eventHandlers={{
                  click: () => handleFeatureClick({ type: 'infrastructure', data: infraInfo }),
                  mouseover: (e) => {
                    e.target.setStyle({ weight: 3, fillOpacity: 0.5 });
                  },
                  mouseout: (e) => {
                    e.target.setStyle({ weight: 2, fillOpacity: 0.3 });
                  },
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-sm mb-2">Infrastructure (PM Gati Shakti)</h3>
                    <p className="text-xs text-gray-600"><strong>Location:</strong> {infraInfo.locationName}</p>
                    <p className="text-xs text-gray-600"><strong>Score:</strong> <span className={`font-semibold ${infraInfo.pmGatiShaktiScore >= 80 ? 'text-green-600' : infraInfo.pmGatiShaktiScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{infraInfo.pmGatiShaktiScore}/100</span></p>
                    <div className="mt-2 text-xs">
                      <p className="font-semibold text-gray-700">Connectivity:</p>
                      <p className="text-gray-600">Roads: {infraInfo.connectivity.roads.status} ({infraInfo.connectivity.roads.score})</p>
                      <p className="text-gray-600">Railways: {infraInfo.connectivity.railways.status} ({infraInfo.connectivity.railways.score})</p>
                      <p className="text-gray-600">Electricity: {infraInfo.connectivity.electricity.status} ({infraInfo.connectivity.electricity.score})</p>
                      <p className="text-gray-600">Telecom: {infraInfo.connectivity.telecom.status} ({infraInfo.connectivity.telecom.score})</p>
                    </div>
                  </div>
                </Popup>
              </Polygon>
            );
          }
          return null;
        })}

        {/* Forest boundaries from forests.json (legacy) */}
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