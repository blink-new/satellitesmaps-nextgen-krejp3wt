import React, { useEffect, useRef } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, useMap } from 'react-leaflet';
import { Map as LeafletMap } from 'leaflet';
import { MapProvider, MapType } from '../types/map';
import 'leaflet/dist/leaflet.css';

interface MapContainerProps {
  provider: MapProvider;
  type: MapType;
  lat: number;
  lng: number;
  zoom: number;
  onMapChange: (lat: number, lng: number, zoom: number) => void;
  className?: string;
}

const MapUpdater: React.FC<{
  lat: number;
  lng: number;
  zoom: number;
  onMapChange: (lat: number, lng: number, zoom: number) => void;
}> = ({ lat, lng, zoom, onMapChange }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], zoom);
  }, [map, lat, lng, zoom]);

  useEffect(() => {
    const handleMoveEnd = () => {
      const center = map.getCenter();
      const currentZoom = map.getZoom();
      onMapChange(center.lat, center.lng, currentZoom);
    };

    map.on('moveend', handleMoveEnd);
    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, onMapChange]);

  return null;
};

const getTileUrl = (provider: MapProvider, type: MapType): string => {
  const urls = {
    gmaps: {
      s: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      p: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
    },
    mapbox: {
      s: 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
      p: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    },
    esri: {
      s: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      p: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
    },
    here: {
      s: 'https://2.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/512/png8?apiKey=demo',
      p: 'https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/512/png8?apiKey=demo'
    },
    osm: {
      s: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      p: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    }
  };

  return urls[provider][type];
};

const getAttribution = (provider: MapProvider): string => {
  const attributions = {
    gmaps: '© Google',
    mapbox: '© Mapbox © OpenStreetMap',
    esri: '© Esri',
    here: '© HERE',
    osm: '© OpenStreetMap contributors'
  };

  return attributions[provider];
};

export const MapContainer: React.FC<MapContainerProps> = ({
  provider,
  type,
  lat,
  lng,
  zoom,
  onMapChange,
  className = ''
}) => {
  const mapRef = useRef<LeafletMap>(null);

  return (
    <div className={`relative ${className}`}>
      <LeafletMapContainer
        ref={mapRef}
        center={[lat, lng]}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          key={`${provider}-${type}`}
          url={getTileUrl(provider, type)}
          attribution={getAttribution(provider)}
          maxZoom={18}
        />
        <MapUpdater
          lat={lat}
          lng={lng}
          zoom={zoom}
          onMapChange={onMapChange}
        />
      </LeafletMapContainer>
    </div>
  );
};