import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: string[];
}

interface SearchResult {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  displayName: string;
}

interface SearchBarProps {
  onLocationSelect: (lat: number, lng: number, name: string) => void;
  onCurrentLocation: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onLocationSelect,
  onCurrentLocation
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Search using Nominatim OpenStreetMap API
  const searchLocations = async (searchQuery: string): Promise<SearchResult[]> => {
    try {
      const encodedQuery = encodeURIComponent(searchQuery);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=8&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'SatellitesMaps-NextGen/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NominatimResult[] = await response.json();
      
      return data.map((item) => ({
        id: item.place_id.toString(),
        name: item.name || item.display_name.split(',')[0],
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.addresstype || item.type || item.class,
        displayName: item.display_name
      }));
    } catch (error) {
      console.error('Nominatim search error:', error);
      return [];
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length > 2) {
        setIsLoading(true);
        try {
          const searchResults = await searchLocations(query);
          setResults(searchResults);
          setShowResults(searchResults.length > 0);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
          setShowResults(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
        setIsLoading(false);
      }
    }, 500); // Increased debounce time to reduce API calls

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleLocationSelect = (result: SearchResult) => {
    setQuery(result.name);
    setShowResults(false);
    onLocationSelect(result.lat, result.lng, result.name);
  };

  const handleCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationSelect(latitude, longitude, 'Localização Atual');
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsGettingLocation(false);
          alert('Não foi possível obter sua localização. Verifique as permissões do navegador.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setIsGettingLocation(false);
      alert('Geolocalização não é suportada pelo seu navegador.');
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md mx-auto">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Buscar localização..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4"
            onFocus={() => results.length > 0 && setShowResults(true)}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
          )}
        </div>
        
        <Button
          variant="outline"
          size="default"
          onClick={handleCurrentLocation}
          disabled={isGettingLocation}
          className="flex-shrink-0"
        >
          {isGettingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Search Results */}
      {(showResults || (query.length > 2 && !isLoading && results.length === 0)) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {results.length > 0 ? (
            results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleLocationSelect(result)}
                className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-600 last:border-b-0 flex items-center space-x-3"
              >
                <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 dark:text-white truncate">
                    {result.name}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    {result.displayName}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-center text-slate-500 dark:text-slate-400">
              Nenhum resultado encontrado para "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};