import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Info, Globe, Satellite, Map } from 'lucide-react';
import { MapProvider } from '../../types/map';

interface ProviderInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: MapProvider;
}

const providerInfo = {
  gmaps: {
    name: 'Google Maps',
    description: 'Mapas e imagens de satélite do Google com alta qualidade e cobertura global.',
    features: ['Imagens de alta resolução', 'Cobertura global', 'Atualizações frequentes'],
    icon: <Globe className="h-6 w-6" />
  },
  mapbox: {
    name: 'Mapbox',
    description: 'Plataforma de mapas personalizáveis com design moderno e dados atualizados.',
    features: ['Design customizável', 'Dados OpenStreetMap', 'API moderna'],
    icon: <Map className="h-6 w-6" />
  },
  esri: {
    name: 'Esri ArcGIS',
    description: 'Líder em sistemas de informação geográfica com imagens de satélite profissionais.',
    features: ['Dados profissionais', 'Análise geoespacial', 'Imagens de alta qualidade'],
    icon: <Satellite className="h-6 w-6" />
  },
  here: {
    name: 'HERE Maps',
    description: 'Mapas e dados de localização da HERE Technologies com foco em navegação.',
    features: ['Dados de tráfego', 'Navegação precisa', 'Cobertura global'],
    icon: <Globe className="h-6 w-6" />
  },
  osm: {
    name: 'OpenStreetMap',
    description: 'Projeto colaborativo de mapeamento mundial criado por uma comunidade de voluntários.',
    features: ['Código aberto', 'Dados colaborativos', 'Atualizações da comunidade'],
    icon: <Map className="h-6 w-6" />
  }
};

export const ProviderInfoModal: React.FC<ProviderInfoModalProps> = ({
  isOpen,
  onClose,
  provider
}) => {
  const info = providerInfo[provider];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>Informações do Provedor</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              {info.icon}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {info.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Provedor atual
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300">
            {info.description}
          </p>

          <div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-2">
              Características principais:
            </h4>
            <ul className="space-y-1">
              {info.features.map((feature, index) => (
                <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              💡 <strong>Dica:</strong> Use as teclas 1-5 para alternar rapidamente entre os provedores e compare as diferentes visualizações do mesmo local.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};