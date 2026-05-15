import { useCallback, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { Tag } from 'lucide-react';

interface Scrap {
  id: string;
  imageUrl: string;
  material: string;
  size: number;
  location: { lat: number, lng: number };
  color: string;
}

export function ScrapMap({ scraps, radius, onRadiusChange }: { 
  scraps: Scrap[], 
  radius: number, 
  onRadiusChange: (r: number) => void 
}) {
  const [selectedScrap, setSelectedScrap] = useState<Scrap | null>(null);

  const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';

  const center = { lat: 12.9716, lng: 77.5946 };

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const visibleScraps = scraps.filter(scrap => 
    getDistance(center.lat, center.lng, scrap.location.lat, scrap.location.lng) <= radius
  );

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <div className="relative h-full w-full">
        {/* Radius Filter Overlay */}
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-[#5A5A40]/10">
          <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-2 block">
            Search Radius: {radius}km
          </label>
          <input 
            type="range" 
            min="1" 
            max="50" 
            value={radius}
            onChange={(e) => onRadiusChange(parseInt(e.target.value))}
            className="w-full accent-[#5A5A40]"
          />
        </div>

        <Map
          defaultCenter={center} // Bangalore default
          defaultZoom={11}
          mapId="SCRAP_MAP"
          gestureHandling="greedy"
          disableDefaultUI={true}
          style={{ width: '100%', height: '100%' }}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        >
          {visibleScraps.map((scrap) => (
            <AdvancedMarker
              key={scrap.id}
              position={scrap.location}
              onClick={() => setSelectedScrap(scrap)}
            >
              <Pin background="#5A5A40" borderColor="#fff" glyphColor="#fff">
                <Tag size={12} />
              </Pin>
            </AdvancedMarker>
          ))}

          {selectedScrap && (
            <InfoWindow
              position={selectedScrap.location}
              onCloseClick={() => setSelectedScrap(null)}
            >
              <div className="p-2 max-w-[200px] font-sans">
                <img 
                  src={selectedScrap.imageUrl} 
                  className="w-full h-32 object-cover rounded-xl mb-3 shadow-sm"
                  referrerPolicy="no-referrer"
                  alt="Fabric"
                />
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-serif font-bold text-lg">{selectedScrap.material}</h4>
                  <span className="text-xs font-bold text-[#5A5A40] bg-[#f5f5f0] px-2 py-0.5 rounded-full">
                    {selectedScrap.size}m
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: selectedScrap.color.toLowerCase() }}></div>
                  <span className="text-xs text-gray-500">{selectedScrap.color}</span>
                </div>
                <button className="w-full bg-[#5A5A40] text-white py-2 rounded-lg text-sm font-bold shadow-sm active:scale-95 transition-transform">
                  Request Trade
                </button>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
