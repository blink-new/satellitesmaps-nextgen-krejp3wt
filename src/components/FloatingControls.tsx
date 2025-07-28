import React from 'react';
import { Button } from './ui/button';
import { Heart, RotateCcw, Keyboard, Info } from 'lucide-react';
import { MapProvider } from '../types/map';

interface FloatingControlsProps {
  onAddFavorite: () => void;
  onResetView: () => void;
  onShowShortcuts: () => void;
  onShowInfo: () => void;
  currentProvider: MapProvider;
}

const providerShortcuts = {
  gmaps: '1',
  mapbox: '2',
  esri: '3',
  here: '4',
  osm: '5'
};

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  onAddFavorite,
  onResetView,
  onShowShortcuts,
  onShowInfo,
  currentProvider
}) => {
  return (
    <div className="fixed bottom-6 left-6 flex flex-col space-y-2 z-40">
      {/* Add to Favorites */}
      <Button
        variant="secondary"
        size="sm"
        onClick={onAddFavorite}
        className="shadow-lg"
        title="Adicionar aos favoritos"
      >
        <Heart className="h-4 w-4" />
      </Button>

      {/* Reset View */}
      <Button
        variant="secondary"
        size="sm"
        onClick={onResetView}
        className="shadow-lg"
        title="Voltar ao local inicial"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>

      {/* Keyboard Shortcuts */}
      <Button
        variant="secondary"
        size="sm"
        onClick={onShowShortcuts}
        className="shadow-lg"
        title="Atalhos de teclado"
      >
        <Keyboard className="h-4 w-4" />
      </Button>

      {/* Provider Info */}
      <Button
        variant="secondary"
        size="sm"
        onClick={onShowInfo}
        className="shadow-lg"
        title="Informações do provedor"
      >
        <Info className="h-4 w-4" />
      </Button>

      {/* Current Provider Indicator */}
      <div className="bg-white dark:bg-slate-800 rounded-lg px-3 py-2 shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
          Provedor Atual
        </div>
        <div className="text-sm font-semibold text-slate-900 dark:text-white">
          {currentProvider.toUpperCase()}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Tecla: {providerShortcuts[currentProvider]}
        </div>
      </div>
    </div>
  );
};