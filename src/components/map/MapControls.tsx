'use client';

import { ZoomIn, ZoomOut, Locate, Map } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocate: () => void;
  onAssetsMap?: () => void;
}

export default function MapControls({
  onZoomIn,
  onZoomOut,
  onLocate,
  onAssetsMap,
}: MapControlsProps) {
  return (
    <>
      {/* Zoom and Location Controls - Left Side */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-[1000] flex flex-col gap-2">
        {/* Zoom In */}
        <button
          onClick={onZoomIn}
          className="bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-lg shadow-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="h-5 w-5" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={onZoomOut}
          className="bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-lg shadow-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="h-5 w-5" />
        </button>

        {/* Center Location */}
        <button
          onClick={onLocate}
          className="bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-lg shadow-lg transition-colors"
          title="Center Map"
        >
          <Locate className="h-5 w-5" />
        </button>
      </div>

      {/* See Assets Map Button - Top Right */}
      {onAssetsMap && (
        <div className="absolute top-4 right-4 z-[1000]">
          <button
            onClick={onAssetsMap}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center gap-2 font-medium"
          >
            <Map className="h-5 w-5" />
            See Assets Map
          </button>
        </div>
      )}
    </>
  );
}
