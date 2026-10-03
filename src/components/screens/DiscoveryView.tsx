import React, { useState, useMemo } from 'react';
import { 
  Heart, X, Star, ShieldCheck, MapPin, MoreVertical, Sparkles, 
  Info, Calendar, SlidersHorizontal, RotateCcw, Check, CheckCircle2 
} from 'lucide-react';
import { MatchProfile, Language } from '../../types/dating';
import { translations } from '../../constants/translations';

interface DiscoveryViewProps {
  profiles: MatchProfile[];
  language: Language;
  onLike: (profile: MatchProfile) => void;
  onPass: (profile: MatchProfile) => void;
  onSuperLike: (profile: MatchProfile) => void;
  onOpenReport: (profile: MatchProfile) => void;
  onResetDeck: () => void;
}

const RELIGION_OPTIONS = [
  'All',
  'Sikh',
  'Hindu',
  'Muslim',
  'Christian',
  'Jain',
  'Buddhist',
  'Spiritual / Other'
];

const CASTE_OPTIONS = [
  'All',
  'Jatt / Jat',
  'Khatri',
  'Arora',
  'Ramgarhia',
  'Saini',
  'Kamboj',
  'Rajput',
  'Brahmin',
  'Ahluwalia',
  'Aggarwal / Bania',
  'Gursikh / Mazhabi Sikh',
  'Ravidasia',
  'Other / Open to all'
];

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  profiles,
  language,
  onLike,
  onPass,
  onSuperLike,
  onOpenReport,
  onResetDeck
}) => {
  const t = translations[language];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBioDetails, setShowBioDetails] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Filter States
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(50);
  const [selectedReligion, setSelectedReligion] = useState<string>('All');
  const [selectedCaste, setSelectedCaste] = useState<string>('All');
  const [onlyGovtVerified, setOnlyGovtVerified] = useState<boolean>(false);

  // Compute active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (maxDistanceKm < 50) count++;
    if (selectedReligion !== 'All') count++;
    if (selectedCaste !== 'All') count++;
    if (onlyGovtVerified) count++;
    return count;
  }, [maxDistanceKm, selectedReligion, selectedCaste, onlyGovtVerified]);

  // Apply filters
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      // 1. Distance filter
      if (p.approxDistanceKm > maxDistanceKm) return false;

      // 2. Religion filter
      if (selectedReligion !== 'All') {
        if (!p.religion || p.religion.toLowerCase() !== selectedReligion.toLowerCase()) {
          return false;
        }
      }

      // 3. Caste filter
      if (selectedCaste !== 'All') {
        if (!p.caste) return false;
        // Check partial match, e.g. "Jatt" matches "Jatt (Sidhu)" or "Jatt (Dhillon)"
        const targetClean = selectedCaste.split(' ')[0].toLowerCase();
        if (!p.caste.toLowerCase().includes(targetClean)) {
          return false;
        }
      }

      // 4. Govt Verified filter
      if (onlyGovtVerified && !p.govtVerification?.isVerified) {
        return false;
      }

      return true;
    });
  }, [profiles, maxDistanceKm, selectedReligion, selectedCaste, onlyGovtVerified]);

  const currentProfile = filteredProfiles[currentIndex];

  const handleLike = () => {
    if (!currentProfile) return;
    onLike(currentProfile);
    setCurrentIndex((prev) => prev + 1);
    setShowBioDetails(false);
  };

  const handlePass = () => {
    if (!currentProfile) return;
    onPass(currentProfile);
    setCurrentIndex((prev) => prev + 1);
    setShowBioDetails(false);
  };

  const handleSuperLike = () => {
    if (!currentProfile) return;
    onSuperLike(currentProfile);
    setCurrentIndex((prev) => prev + 1);
    setShowBioDetails(false);
  };

  const handleResetFilters = () => {
    setMaxDistanceKm(50);
    setSelectedReligion('All');
    setSelectedCaste('All');
    setOnlyGovtVerified(false);
    setCurrentIndex(0);
    onResetDeck();
  };

  // Format DOB nicely
  const formattedDob = currentProfile?.birthDate
    ? new Date(currentProfile.birthDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <div className="flex-1 flex flex-col justify-between p-3.5 bg-[#0e0816] text-slate-100 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between px-1 py-1 z-10">
        <div className="flex items-center gap-1.5">
          <span className="text-xl font-black text-rose-400 font-display">
            {language === 'pa' ? 'ਸਨੇਹ' : 'Sneh'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Drawer Toggle Button */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
              activeFiltersCount > 0
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
                : 'bg-white/10 hover:bg-white/15 text-slate-300 border-white/10'
            }`}
            title="Filter by distance, religion, and caste"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Govt Verified Indicator */}
          {currentProfile?.govtVerification?.isVerified && (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-[10px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>{currentProfile.govtVerification.docType} Verified</span>
            </div>
          )}

          {currentProfile && (
            <button
              onClick={() => onOpenReport(currentProfile)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/15 text-slate-300 transition-colors"
              title="Report or Block"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Card OR Empty State */}
      {!currentProfile ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#140b1c] to-[#0a0510] text-slate-100 rounded-3xl border border-white/5 my-2">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
            <Sparkles className="w-8 h-8 text-rose-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1.5">
            {activeFiltersCount > 0 ? 'No Matches with Current Filters' : t.emptyDeckTitle}
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mb-5 leading-relaxed">
            {activeFiltersCount > 0
              ? `No profiles found within ${maxDistanceKm} km for ${selectedReligion !== 'All' ? selectedReligion : 'any religion'} and ${selectedCaste !== 'All' ? selectedCaste : 'any caste'}. Expand your criteria to discover more mindful connections.`
              : t.emptyDeckSub}
          </p>
          <div className="flex gap-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
            <button
              onClick={() => {
                setCurrentIndex(0);
                onResetDeck();
              }}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all active:scale-[0.98]"
            >
              {t.resetDeck}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 my-2 relative rounded-[32px] overflow-hidden shadow-2xl border border-white/10 group bg-slate-900 flex flex-col justify-end">
          {/* Profile Image */}
          <img
            src={currentProfile.photo}
            alt={currentProfile.name}
            className="absolute inset-0 w-full h-full object-cover select-none"
          />

          {/* Gradient shadow for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none" />

          {/* Tap to expand overlay */}
          <button
            onClick={() => setShowBioDetails(!showBioDetails)}
            className="absolute top-3 right-3 py-1 px-2.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1 border border-white/10 z-10 transition-colors"
          >
            <Info className="w-3 h-3 text-amber-300" />
            <span>{showBioDetails ? 'Less' : 'View Full Details'}</span>
          </button>

          {/* Profile Details Content */}
          <div className="relative z-10 p-4 space-y-1.5 select-none">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white tracking-wide">
                {currentProfile.name}, {currentProfile.age}
              </h2>
              {currentProfile.govtVerification?.isVerified && (
                <div className="flex items-center text-sky-400" title={`Govt ID Verified (${currentProfile.govtVerification.docType})`}>
                  <ShieldCheck className="w-5 h-5 fill-sky-400/20 text-sky-400" />
                </div>
              )}
            </div>

            {/* Age + DOB Badge */}
            <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentProfile.age} Years</span>
                {formattedDob && <span>• Born {formattedDob}</span>}
              </span>
            </div>

            {/* Optional Indian Matchmaking Badges: Caste, Religion, Marital Status */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {currentProfile.religion && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-200 border border-amber-500/30 font-medium">
                  {currentProfile.religion}
                </span>
              )}
              {currentProfile.caste && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-200 border border-rose-500/30 font-medium">
                  {currentProfile.caste}
                </span>
              )}
              {currentProfile.maritalStatus && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-200 border border-purple-500/30 font-medium">
                  {currentProfile.maritalStatus}
                </span>
              )}
            </div>

            {/* Approximate Location */}
            <div className="flex items-center gap-1 text-slate-300 text-xs">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>
                {currentProfile.area}, {currentProfile.city} • {t.approxKm.replace('%d', currentProfile.approxDistanceKm.toString())}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              {currentProfile.profession}
            </p>

            {/* Interests Tags */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {currentProfile.interests.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Expanded Bio & Detailed Cultural Info */}
            {showBioDetails && (
              <div className="mt-2.5 pt-2.5 border-t border-white/10 text-xs text-slate-200 space-y-2 animate-in fade-in duration-200">
                <p className="italic">"{currentProfile.bio}"</p>

                {/* Cultural & Lifestyle Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <div>Religion: <span className="font-semibold text-white">{currentProfile.religion || 'Not specified'}</span></div>
                  <div>Caste: <span className="font-semibold text-white">{currentProfile.caste || 'Not specified'}</span></div>
                  <div>Marital: <span className="font-semibold text-white">{currentProfile.maritalStatus || 'Never Married'}</span></div>
                  <div>Diet: <span className="font-semibold text-white">{currentProfile.lifestyle.diet}</span></div>
                </div>

                {currentProfile.govtVerification?.isVerified && (
                  <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-400/20 text-[11px] text-sky-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Verified via {currentProfile.govtVerification.docType} ({currentProfile.govtVerification.maskedNumber})</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Action Buttons: Pass, Super Like, Like */}
      {currentProfile && (
        <div className="flex items-center justify-center gap-5 py-2 z-10">
          {/* Pass Button */}
          <button
            onClick={handlePass}
            className="w-14 h-14 rounded-full bg-slate-800/90 hover:bg-slate-700/90 text-rose-400 border border-white/10 flex items-center justify-center shadow-lg transition-transform active:scale-90"
            title="Pass"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Super Like Button */}
          <button
            onClick={handleSuperLike}
            className="w-12 h-12 rounded-full bg-sky-600/90 hover:bg-sky-500/90 text-white border border-white/10 flex items-center justify-center shadow-lg transition-transform active:scale-90"
            title="Super Like"
          >
            <Star className="w-5 h-5 fill-white" />
          </button>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white shadow-xl shadow-rose-600/40 flex items-center justify-center transition-transform active:scale-90"
            title="Like"
          >
            <Heart className="w-6 h-6 fill-white" />
          </button>
        </div>
      )}

      {/* MATCHMAKING FILTER DRAWER (MODAL BOTTOM SHEET) */}
      {isFilterDrawerOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#170e22] border-t border-white/15 rounded-t-[32px] p-5 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-rose-400" />
                <h3 className="font-bold text-sm text-white">Discovery Filters</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter 1: Maximum Distance Range */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Distance Range</span>
                </span>
                <span className="font-mono text-rose-300 font-bold">
                  Within {maxDistanceKm} km
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={maxDistanceKm}
                onChange={(e) => {
                  setMaxDistanceKm(Number(e.target.value));
                  setCurrentIndex(0);
                }}
                className="w-full accent-rose-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>5 km (Local)</span>
                <span>50 km</span>
                <span>100 km (Regional)</span>
              </div>
            </div>

            {/* Filter 2: Religion */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Religion (ਧਰਮ)</span>
                <span className="text-[10px] text-amber-300 font-medium">{selectedReligion}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {RELIGION_OPTIONS.map((rel) => {
                  const isSelected = selectedReligion === rel;
                  return (
                    <button
                      key={rel}
                      onClick={() => {
                        setSelectedReligion(rel);
                        setCurrentIndex(0);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-semibold shadow-sm ring-1 ring-amber-500/40'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {rel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter 3: Caste / Community */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Caste / Community (ਜਾਤੀ)</span>
                <span className="text-[10px] text-rose-300 font-medium truncate max-w-[120px]">{selectedCaste}</span>
              </div>
              <select
                value={selectedCaste}
                onChange={(e) => {
                  setSelectedCaste(e.target.value);
                  setCurrentIndex(0);
                }}
                className="w-full p-2.5 rounded-xl bg-[#22162e] border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
              >
                {CASTE_OPTIONS.map((caste) => (
                  <option key={caste} value={caste}>{caste}</option>
                ))}
              </select>
            </div>

            {/* Filter 4: Only Govt Verified Profiles */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="space-y-0.5 max-w-[80%]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-xs font-semibold text-white">Govt Verified Profiles Only</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Only show matches authenticated via Aadhaar, PAN, or Passport.
                </p>
              </div>
              <input
                type="checkbox"
                checked={onlyGovtVerified}
                onChange={(e) => {
                  setOnlyGovtVerified(e.target.checked);
                  setCurrentIndex(0);
                }}
                className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
              />
            </div>

            {/* Apply Button */}
            <div className="pt-2">
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Check className="w-4 h-4" />
                <span>Show {filteredProfiles.length} Matches</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
