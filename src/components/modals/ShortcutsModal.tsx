import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  const shortcuts = [
    { key: '1', action: 'Alternar para Google Maps' },
    { key: '2', action: 'Alternar para Mapbox' },
    { key: '3', action: 'Alternar para Esri' },
    { key: '4', action: 'Alternar para HERE' },
    { key: '5', action: 'Alternar para OpenStreetMap' },
    { key: 'S', action: 'Alternar entre Satélite/Mapa' },
    { key: 'F', action: 'Adicionar aos favoritos' },
    { key: 'H', action: 'Abrir histórico' },
    { key: 'R', action: 'Voltar ao local inicial' },
    { key: 'C', action: 'Copiar link atual' },
    { key: '/', action: 'Focar na busca' },
    { key: 'Esc', action: 'Fechar painéis/modais' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Keyboard className="h-5 w-5" />
            <span>Atalhos de Teclado</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {shortcut.action}
              </span>
              <kbd className="px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            💡 <strong>Dica:</strong> Use os atalhos numéricos (1-5) para alternar rapidamente entre os provedores de mapa mantendo a mesma localização e zoom.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};