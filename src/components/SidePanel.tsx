import React from 'react';
import { X, Heart, History, Trash2, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { FavoriteLocation, HistoryLocation } from '../types/map';

interface SidePanelProps {
  isOpen: boolean;
  type: 'favorites' | 'history';
  onClose: () => void;
  favorites: FavoriteLocation[];
  history: HistoryLocation[];
  onLocationSelect: (lat: number, lng: number, name: string) => void;
  onRemoveFavorite: (id: string) => void;
  onClearHistory: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  type,
  onClose,
  favorites,
  history,
  onLocationSelect,
  onRemoveFavorite,
  onClearHistory
}) => {
  if (!isOpen) return null;

  const items = type === 'favorites' ? favorites : history;
  const title = type === 'favorites' ? 'Favoritos' : 'Histórico';
  const icon = type === 'favorites' ? <Heart className="h-5 w-5" /> : <History className="h-5 w-5" />;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 z-50 shadow-xl">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-2">
          {icon}
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4">
        {type === 'history' && history.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearHistory}
            className="w-full mb-4"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar Histórico
          </Button>
        )}

        <ScrollArea className="h-[calc(100vh-140px)]">
          {items.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <div className="mb-2">
                {type === 'favorites' ? (
                  <Heart className="h-8 w-8 mx-auto opacity-50" />
                ) : (
                  <History className="h-8 w-8 mx-auto opacity-50" />
                )}
              </div>
              <p>
                {type === 'favorites' 
                  ? 'Nenhum local favorito ainda'
                  : 'Nenhum histórico ainda'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer group"
                  onClick={() => onLocationSelect(item.lat, item.lng, item.name)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <h3 className="font-medium text-slate-900 dark:text-white truncate">
                          {item.name}
                        </h3>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                        <div>
                          {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                        </div>
                        <div>
                          {type === 'favorites' 
                            ? new Date(item.createdAt).toLocaleDateString('pt-BR')
                            : new Date(item.visitedAt).toLocaleDateString('pt-BR')
                          }
                        </div>
                      </div>
                    </div>
                    
                    {type === 'favorites' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFavorite(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};