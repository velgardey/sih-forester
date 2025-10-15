'use client';

import { useState } from 'react';
import { Layers, X, Eye } from 'lucide-react';
import * as Icons from 'lucide-react';
import layersData from '@/data/layers.json';
import type { Layer, LayerCategory } from '@/types/layer';

interface LayerControlProps {
  enabledLayers: string[];
  layerOpacity: Record<string, number>;
  onLayerToggle: (layerId: string) => void;
  onOpacityChange: (layerId: string, opacity: number) => void;
}

export default function LayerControl({
  enabledLayers,
  layerOpacity,
  onLayerToggle,
  onOpacityChange,
}: LayerControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['boundaries', 'data']);

  const layers = layersData.layers as Layer[];
  const categories = layersData.categories as LayerCategory[];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : <Layers className="h-4 w-4" />;
  };

  const isLayerEnabled = (layerId: string) => {
    if (enabledLayers.length === 0) {
      const layer = layers.find(l => l.id === layerId);
      return layer?.defaultEnabled || false;
    }
    return enabledLayers.includes(layerId);
  };

  const getOpacity = (layerId: string) => {
    if (layerOpacity[layerId] !== undefined) {
      return layerOpacity[layerId];
    }
    const layer = layers.find(l => l.id === layerId);
    return layer?.defaultOpacity || 0.6;
  };

  const enabledCount = layers.filter(l => isLayerEnabled(l.id)).length;

  return (
    <>
      {/* Floating Layer Button */}
      {!isOpen && (
        <div className="absolute top-4 right-4 z-[1000]">
          <button
            onClick={() => setIsOpen(true)}
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative ${
              enabledCount > 0 ? 'bg-green-600 text-white shadow-green-200' : 'bg-white text-black hover:bg-green-50'
            }`}
            title="Map Layers"
          >
            <Layers className="w-5 h-5" />
            {enabledCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                {enabledCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Layer Control Panel */}
      {isOpen && (
        <div className="absolute top-4 right-4 w-full md:w-[420px] max-w-[420px] bg-white rounded-xl shadow-lg border border-gray-200 z-[1000] max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-black">Map Layers</h3>
                <p className="text-xs text-gray-600 mt-1">
                  {enabledCount} of {layers.length} layer{layers.length !== 1 ? 's' : ''} active
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-black hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Layer List */}
          <div className="overflow-y-auto flex-1">
            {categories.map((category) => {
              const categoryLayers = layers.filter(l => l.category === category.id);
              const isExpanded = expandedCategories.includes(category.id);
              const enabledInCategory = categoryLayers.filter(l => isLayerEnabled(l.id)).length;

              return (
                <div key={category.id} className="border-b border-gray-100 last:border-b-0">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-green-600">
                        {getIcon(category.icon)}
                      </div>
                      <div className="text-left">
                        <span className="font-semibold text-sm text-black block">{category.name}</span>
                        <span className="text-xs text-gray-600">
                          {enabledInCategory}/{categoryLayers.length} active
                        </span>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Category Layers */}
                  {isExpanded && (
                    <div className="bg-white">
                      {categoryLayers.map((layer) => {
                        const enabled = isLayerEnabled(layer.id);
                        const opacity = getOpacity(layer.id);

                        return (
                          <div key={layer.id} className="p-4 border-t border-gray-100 first:border-t-0">
                            {/* Layer Toggle */}
                            <div className="flex items-start gap-3 mb-3">
                              <button
                                onClick={() => onLayerToggle(layer.id)}
                                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                  enabled
                                    ? 'bg-green-600 border-green-600 shadow-sm'
                                    : 'bg-white border-gray-300 hover:border-green-400'
                                }`}
                              >
                                {enabled && (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 12 12">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 3L4.5 8.5L2 6" />
                                  </svg>
                                )}
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className={enabled ? 'text-green-600' : 'text-gray-400'}>
                                    {getIcon(layer.icon)}
                                  </div>
                                  <span className={`text-sm font-semibold ${enabled ? 'text-black' : 'text-gray-500'}`}>
                                    {layer.name}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">{layer.description}</p>
                              </div>
                            </div>

                            {/* Opacity Slider */}
                            {enabled && (
                              <div className="ml-8 mb-3 p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Eye className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                  <div className="flex-1">
                                    <input
                                      type="range"
                                      min="0"
                                      max="1"
                                      step="0.1"
                                      value={opacity}
                                      onChange={(e) => onOpacityChange(layer.id, parseFloat(e.target.value))}
                                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                                      style={{
                                        background: `linear-gradient(to right, #16a34a 0%, #16a34a ${opacity * 100}%, #e5e7eb ${opacity * 100}%, #e5e7eb 100%)`
                                      }}
                                    />
                                  </div>
                                  <span className="text-xs font-semibold text-gray-700 w-10 text-right">
                                    {Math.round(opacity * 100)}%
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Legend */}
                            {enabled && layer.legend && layer.legend.length > 0 && (
                              <div className="ml-8 p-3 bg-green-50 rounded-lg border border-green-100">
                                <p className="text-xs font-semibold text-green-900 mb-2 flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-green-600"></span>
                                  Legend
                                </p>
                                <div className="space-y-2">
                                  {layer.legend.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                      {item.icon ? (
                                        <>
                                          <div className="text-gray-600">
                                            {getIcon(item.icon)}
                                          </div>
                                          <span className="text-xs text-gray-700">{item.label}</span>
                                        </>
                                      ) : (
                                        <>
                                          <div
                                            className="w-4 h-4 rounded border border-gray-300 shadow-sm flex-shrink-0"
                                            style={{ backgroundColor: item.color }}
                                          />
                                          <span className="text-xs text-gray-700">{item.label}</span>
                                        </>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
