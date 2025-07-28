import { useState, useEffect } from 'react';
import { MapProvider, MapType, MapConfig } from '../types/map';

export const useMapConfig = () => {
  const [config, setConfig] = useState<MapConfig>({
    provider: 'gmaps',
    type: 's',
    lat: 40.7128,
    lng: -74.0060,
    zoom: 10
  });

  // Parse URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const provider = (urlParams.get('m') as MapProvider) || 'gmaps';
    const type = (urlParams.get('t') as MapType) || 's';
    const lat = parseFloat(urlParams.get('lat') || '40.7128');
    const lng = parseFloat(urlParams.get('lng') || '-74.0060');
    const zoom = parseInt(urlParams.get('z') || '10');

    setConfig({ provider, type, lat, lng, zoom });
  }, []);

  // Update URL when config changes
  const updateConfig = (newConfig: Partial<MapConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);

    // Update URL without page reload
    const params = new URLSearchParams();
    params.set('m', updatedConfig.provider);
    params.set('t', updatedConfig.type);
    params.set('lat', updatedConfig.lat.toString());
    params.set('lng', updatedConfig.lng.toString());
    params.set('z', updatedConfig.zoom.toString());

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  return { config, updateConfig };
};