import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { MapContainer } from './components/MapContainer';
import { SidePanel } from './components/SidePanel';
import { FloatingControls } from './components/FloatingControls';
import { ShortcutsModal } from './components/modals/ShortcutsModal';
import { ProviderInfoModal } from './components/modals/ProviderInfoModal';
import { useMapConfig } from './hooks/useMapConfig';
import { useLocalStorage } from './hooks/useLocalStorage';
import { FavoriteLocation, HistoryLocation, MapProvider, MapType } from './types/map';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/use-toast';

function App() {
  const { config, updateConfig } = useMapConfig();
  const { toast } = useToast();
  
  // Local storage for favorites and history
  const [favorites, setFavorites] = useLocalStorage<FavoriteLocation[]>('satellitesmaps-favorites', []);
  const [history, setHistory] = useLocalStorage<HistoryLocation[]>('satellitesmaps-history', []);
  
  // UI state
  const [sidePanel, setSidePanel] = useState<{ isOpen: boolean; type: 'favorites' | 'history' }>({
    isOpen: false,
    type: 'favorites'
  });
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showProviderInfo, setShowProviderInfo] = useState(false);

  // Add location to history when it changes
  const addToHistory = useCallback((lat: number, lng: number, name: string) => {
    const newHistoryItem: HistoryLocation = {
      id: Date.now().toString(),
      name,
      lat,
      lng,
      zoom: config.zoom,
      provider: config.provider,
      type: config.type,
      visitedAt: new Date().toISOString()
    };

    setHistory(prev => {
      // Remove duplicate if exists
      const filtered = prev.filter(item => 
        Math.abs(item.lat - lat) > 0.001 || Math.abs(item.lng - lng) > 0.001
      );
      // Add to beginning and limit to 50 items
      return [newHistoryItem, ...filtered].slice(0, 50);
    });
  }, [config.zoom, config.provider, config.type, setHistory]);

  // Handler functions
  const handleAddFavorite = useCallback(() => {
    const newFavorite: FavoriteLocation = {
      id: Date.now().toString(),
      name: `Local ${config.lat.toFixed(4)}, ${config.lng.toFixed(4)}`,
      lat: config.lat,
      lng: config.lng,
      zoom: config.zoom,
      provider: config.provider,
      type: config.type,
      createdAt: new Date().toISOString()
    };

    // Check if already exists
    const exists = favorites.some(fav => 
      Math.abs(fav.lat - config.lat) < 0.001 && Math.abs(fav.lng - config.lng) < 0.001
    );

    if (!exists) {
      setFavorites(prev => [newFavorite, ...prev]);
      toast({
        title: "Adicionado aos favoritos",
        description: "Local salvo com sucesso!",
      });
    } else {
      toast({
        title: "Local já existe",
        description: "Este local já está nos seus favoritos.",
        variant: "destructive"
      });
    }
  }, [config, favorites, setFavorites, toast]);

  const handleResetView = useCallback(() => {
    updateConfig({ lat: 40.7128, lng: -74.0060, zoom: 10 });
    toast({
      title: "Visualização resetada",
      description: "Voltou para a localização inicial.",
    });
  }, [updateConfig, toast]);

  const handleShare = useCallback(() => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'SatellitesMaps - Localização',
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copiado",
        description: "URL copiada para a área de transferência!",
      });
    }
  }, [toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case '1':
          updateConfig({ provider: 'gmaps' });
          break;
        case '2':
          updateConfig({ provider: 'mapbox' });
          break;
        case '3':
          updateConfig({ provider: 'esri' });
          break;
        case '4':
          updateConfig({ provider: 'here' });
          break;
        case '5':
          updateConfig({ provider: 'osm' });
          break;
        case 's':
        case 'S':
          updateConfig({ type: config.type === 's' ? 'p' : 's' });
          break;
        case 'f':
        case 'F':
          handleAddFavorite();
          break;
        case 'h':
        case 'H':
          setSidePanel({ isOpen: true, type: 'history' });
          break;
        case 'r':
        case 'R':
          handleResetView();
          break;
        case 'c':
        case 'C':
          handleShare();
          break;
        case '/': {
          e.preventDefault();
          // Focus search input
          const searchInput = document.querySelector('input[placeholder*="Buscar"]') as HTMLInputElement;
          searchInput?.focus();
          break;
        }
        case 'Escape':
          setSidePanel({ isOpen: false, type: 'favorites' });
          setShowShortcuts(false);
          setShowProviderInfo(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [config, updateConfig, handleAddFavorite, handleResetView, handleShare]);

  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    updateConfig({ lat, lng });
    addToHistory(lat, lng, name);
  };

  const handleMapChange = (lat: number, lng: number, zoom: number) => {
    updateConfig({ lat, lng, zoom });
  };

  const handleProviderChange = (provider: MapProvider) => {
    updateConfig({ provider });
  };

  const handleTypeChange = (type: MapType) => {
    updateConfig({ type });
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
    toast({
      title: "Removido dos favoritos",
      description: "Local removido com sucesso!",
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    toast({
      title: "Histórico limpo",
      description: "Todo o histórico foi removido.",
    });
  };

  const handleCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleLocationSelect(latitude, longitude, 'Localização Atual');
          toast({
            title: "Localização encontrada",
            description: "Navegando para sua localização atual.",
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: "Erro de localização",
            description: "Não foi possível obter sua localização.",
            variant: "destructive"
          });
        }
      );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Header
        provider={config.provider}
        type={config.type}
        onProviderChange={handleProviderChange}
        onTypeChange={handleTypeChange}
        onShare={handleShare}
        onToggleFavorites={() => setSidePanel({ isOpen: !sidePanel.isOpen, type: 'favorites' })}
        onToggleHistory={() => setSidePanel({ isOpen: !sidePanel.isOpen, type: 'history' })}
      />

      <div className="flex-1 relative">
        {/* Search Bar */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
          <SearchBar
            onLocationSelect={handleLocationSelect}
            onCurrentLocation={handleCurrentLocation}
          />
        </div>

        {/* Map */}
        <MapContainer
          provider={config.provider}
          type={config.type}
          lat={config.lat}
          lng={config.lng}
          zoom={config.zoom}
          onMapChange={handleMapChange}
          className="w-full h-full"
        />

        {/* Floating Controls */}
        <FloatingControls
          onAddFavorite={handleAddFavorite}
          onResetView={handleResetView}
          onShowShortcuts={() => setShowShortcuts(true)}
          onShowInfo={() => setShowProviderInfo(true)}
          currentProvider={config.provider}
        />

        {/* Side Panel */}
        <SidePanel
          isOpen={sidePanel.isOpen}
          type={sidePanel.type}
          onClose={() => setSidePanel({ isOpen: false, type: 'favorites' })}
          favorites={favorites}
          history={history}
          onLocationSelect={handleLocationSelect}
          onRemoveFavorite={handleRemoveFavorite}
          onClearHistory={handleClearHistory}
        />

        {/* Modals */}
        <ShortcutsModal
          isOpen={showShortcuts}
          onClose={() => setShowShortcuts(false)}
        />

        <ProviderInfoModal
          isOpen={showProviderInfo}
          onClose={() => setShowProviderInfo(false)}
          provider={config.provider}
        />
      </div>

      <Toaster />
    </div>
  );
}

export default App;