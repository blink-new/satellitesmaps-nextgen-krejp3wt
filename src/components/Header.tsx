import React from 'react';
import { Button } from './ui/button';
import { Moon, Sun, Monitor, Satellite, Map, Share2, Heart, History } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { MapProvider, MapType } from '../types/map';

interface HeaderProps {
  provider: MapProvider;
  type: MapType;
  onProviderChange: (provider: MapProvider) => void;
  onTypeChange: (type: MapType) => void;
  onShare: () => void;
  onToggleFavorites: () => void;
  onToggleHistory: () => void;
}

const providerNames = {
  gmaps: 'Google',
  mapbox: 'Mapbox',
  esri: 'Esri',
  here: 'HERE',
  osm: 'OSM'
};

export const Header: React.FC<HeaderProps> = ({
  provider,
  type,
  onProviderChange,
  onTypeChange,
  onShare,
  onToggleFavorites,
  onToggleHistory
}) => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'] as const;
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="h-4 w-4" />;
      case 'dark': return <Moon className="h-4 w-4" />;
      case 'system': return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Satellite className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            SatellitesMaps
          </h1>
        </div>

        {/* Provider Selector */}
        <div className="hidden md:flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {Object.entries(providerNames).map(([key, name]) => (
            <Button
              key={key}
              variant={provider === key ? "default" : "ghost"}
              size="sm"
              onClick={() => onProviderChange(key as MapProvider)}
              className="text-xs"
            >
              {name}
            </Button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {/* Map Type Toggle */}
          <Button
            variant={type === 's' ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeChange(type === 's' ? 'p' : 's')}
            className="hidden sm:flex"
          >
            {type === 's' ? <Satellite className="h-4 w-4 mr-1" /> : <Map className="h-4 w-4 mr-1" />}
            {type === 's' ? 'Satélite' : 'Mapa'}
          </Button>

          {/* Action Buttons */}
          <Button variant="outline" size="sm" onClick={onToggleHistory}>
            <History className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="sm" onClick={onToggleFavorites}>
            <Heart className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={onShare}>
            <Share2 className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          <Button variant="outline" size="sm" onClick={cycleTheme}>
            {getThemeIcon()}
          </Button>
        </div>
      </div>
    </header>
  );
};