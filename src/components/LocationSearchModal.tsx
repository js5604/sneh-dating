import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LocationData } from '../types/weather';
import { PRESET_LOCATIONS, searchCities } from '../services/weatherService';
import { Search, MapPin, Navigation, X, Check, Globe } from 'lucide-react';

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
  onRequestGeolocation: () => void;
  isLocating: boolean;
}

export const LocationSearchModal: React.FC<LocationSearchModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
  onRequestGeolocation,
  isLocating,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 2) {
      setIsSearching(true);
      const results = await searchCities(query);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md max-h-[85vh] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 z-10"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-sky-400" />
                <h3 className="font-display font-bold text-base text-white">Select Location</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/10 text-white/70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input & GPS */}
            <div className="p-4 border-b border-white/5 space-y-3 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search city, state or country..."
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
                  autoFocus
                />
              </div>

              {/* Geolocation Button */}
              <button
                onClick={() => {
                  onRequestGeolocation();
                  onClose();
                }}
                disabled={isLocating}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-semibold transition-all active:scale-98"
              >
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Acquiring GPS Signal...' : 'Use My Current GPS Location'}</span>
              </button>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Dynamic Search Results */}
              {searchQuery.trim().length >= 2 ? (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">
                    {isSearching ? 'Searching...' : `Search Results (${searchResults.length})`}
                  </div>
                  {searchResults.length === 0 && !isSearching && (
                    <div className="text-center py-6 text-white/50 text-xs">
                      No matching locations found for "{searchQuery}"
                    </div>
                  )}
                  <div className="space-y-1.5">
                    {searchResults.map(loc => (
                      <button
                        key={`${loc.latitude}-${loc.longitude}`}
                        onClick={() => {
                          onSelectLocation(loc);
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-xl hover:bg-white/10 text-left flex items-center justify-between transition-colors border border-transparent hover:border-white/10"
                      >
                        <div className="flex items-center gap-2.5">
                          <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                          <div>
                            <span className="text-xs font-semibold text-white block">{loc.name}</span>
                            <span className="text-[10px] text-white/50">
                              {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Preset Popular Weather Cities */
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">
                    Popular Weather Hotspots
                  </div>
                  <div className="space-y-1.5">
                    {PRESET_LOCATIONS.map(loc => {
                      const isSelected = currentLocation.name === loc.name;
                      return (
                        <button
                          key={loc.id}
                          onClick={() => {
                            onSelectLocation(loc);
                            onClose();
                          }}
                          className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors border ${
                            isSelected
                              ? 'bg-sky-500/20 border-sky-400/50 text-white'
                              : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/80'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <MapPin className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-white/40'}`} />
                            <div>
                              <span className="text-xs font-semibold text-white block">{loc.name}</span>
                              <span className="text-[10px] text-white/50">{loc.country}</span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-sky-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
