import React, { useState } from 'react';
import { Camera, Sparkles, Check, Plus, Trash2, ArrowRight, ShieldCheck, Heart, UserCheck, Shield } from 'lucide-react';
import { UserProfile, Language } from '../../types/dating';
import { translations } from '../../constants/translations';
import { AIBioGeneratorModal } from '../AIBioGeneratorModal';

interface ProfileBuilderViewProps {
  initialProfile: UserProfile;
  language: Language;
  onSaveProfile: (profile: UserProfile) => void;
  onNavigateToVerification?: () => void;
}

const INDIAN_INTERESTS_OPTIONS = [
  'Chai Lover ☕',
  'Sufi Music 🎵',
  'Heritage Walks 🏛️',
  'Kathak Dance 💃',
  'Cricket 🏏',
  'Filter Coffee ☕',
  'Punjabi Folk 🪕',
  'Bollywood 🎬',
  'Street Photography 📸',
  'Sourdough Baking 🥖',
  'Badminton 🏸',
  'Yoga & Meditation 🧘'
];

const DIET_OPTIONS = ['Vegetarian', 'Pure Veg (Jain)', 'Eggetarian', 'Non-Vegetarian', 'Vegan'];

const RELIGIONS = [
  'Sikh',
  'Hindu',
  'Muslim',
  'Christian',
  'Jain',
  'Buddhist',
  'Spiritual / Other'
] as const;

const CASTES = [
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
  'Gujjar',
  'Other / Open to all'
];

const MARITAL_STATUSES = [
  'Never Married',
  'Divorced',
  'Awaiting Divorce',
  'Widowed'
] as const;

export const ProfileBuilderView: React.FC<ProfileBuilderViewProps> = ({
  initialProfile,
  language,
  onSaveProfile,
  onNavigateToVerification
}) => {
  const t = translations[language];
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [showAiModal, setShowAiModal] = useState(false);

  const toggleInterest = (interest: string) => {
    setProfile((prev) => {
      const exists = prev.interests.includes(interest);
      const newInterests = exists
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: newInterests };
    });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    } else {
      onSaveProfile(profile);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-gradient-to-b from-[#140b1c] to-[#0a0510] text-slate-100 overflow-y-auto">
      <div>
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <h2 className="text-base font-bold text-white">
              {t.profileBuilderTitle}
            </h2>
          </div>
          <span className="text-[11px] text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-400/10">
            Step {step} of 4
          </span>
        </div>

        {/* Step 1: Basic Information & Photos */}
        {step === 1 && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Profile Photos (At least 1 required)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {profile.photos.map((photo, idx) => (
                  <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 group">
                    <img src={photo} alt="Photo" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded font-medium">
                        Main
                      </span>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="aspect-[3/4] rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <Plus className="w-5 h-5 mb-1" />
                  <span className="text-[10px]">Add Photo</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.nameLabel}
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Age &amp; DOB
                </label>
                <input
                  type="date"
                  value={profile.birthDate}
                  onChange={(e) => {
                    const dob = e.target.value;
                    const calculatedAge = Math.max(18, new Date().getFullYear() - new Date(dob).getFullYear());
                    setProfile({ ...profile, birthDate: dob, age: calculatedAge });
                  }}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Gender
                </label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#1d1427] border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
                >
                  <option value="Man">Man</option>
                  <option value="Woman">Woman</option>
                  <option value="Non-Binary">Non-Binary</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.cityLabel}
                </label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Area / Neighborhood
                </label>
                <input
                  type="text"
                  value={profile.area}
                  onChange={(e) => setProfile({ ...profile, area: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.professionLabel}
              </label>
              <input
                type="text"
                value={profile.profession}
                onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        )}

        {/* Step 2: Optional Indian Matchmaking Details (Caste, Religion, Marital Status) */}
        {step === 2 && (
          <div className="space-y-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
              <span className="font-bold block">Optional Cultural &amp; Matchmaking Details</span>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                These optional fields help find culturally aligned partners in India and Punjab. You can choose whether to display them publicly.
              </p>
            </div>

            {/* Religion */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Religion (ਧਰਮ)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {RELIGIONS.map((rel) => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => setProfile({ ...profile, religion: rel })}
                    className={`p-2 rounded-xl border text-xs text-left transition-colors ${
                      profile.religion === rel
                        ? 'bg-amber-500/20 border-amber-500 text-white font-semibold'
                        : 'bg-white/5 border-white/10 text-slate-300'
                    }`}
                  >
                    {rel}
                  </button>
                ))}
              </div>
            </div>

            {/* Caste */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Caste / Community (ਜਾਤੀ)
              </label>
              <select
                value={profile.caste || ''}
                onChange={(e) => setProfile({ ...profile, caste: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#1d1427] border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="">Select Community (Optional)</option>
                {CASTES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Marital Status (ਵਿਆਹੁਤਾ ਸਥਿਤੀ)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {MARITAL_STATUSES.map((ms) => (
                  <button
                    key={ms}
                    type="button"
                    onClick={() => setProfile({ ...profile, maritalStatus: ms })}
                    className={`p-2 rounded-xl border text-xs text-left transition-colors ${
                      profile.maritalStatus === ms
                        ? 'bg-rose-500/20 border-rose-500 text-white font-semibold'
                        : 'bg-white/5 border-white/10 text-slate-300'
                    }`}
                  >
                    {ms}
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy toggle */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Display on Profile Card</span>
                <span className="text-[11px] text-slate-400">Allow matches to view Caste, Religion &amp; Marital Status</span>
              </div>
              <input
                type="checkbox"
                checked={profile.showOptionalDetails}
                onChange={(e) => setProfile({ ...profile, showOptionalDetails: e.target.checked })}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Step 3: About Me & AI Assistant */}
        {step === 3 && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300">
                {t.bioLabel}
              </label>
              <button
                type="button"
                onClick={() => setShowAiModal(true)}
                className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full transition-colors"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{t.aiGenerateBio}</span>
              </button>
            </div>

            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              placeholder="Tell others about your passions, cultural heritage, and what brings you joy..."
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-rose-500"
            />

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {t.interestsTitle} (Select 3 or more)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {INDIAN_INTERESTS_OPTIONS.map((interest) => {
                  const isSelected = profile.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        isSelected
                          ? 'bg-rose-600 border-rose-500 text-white font-medium shadow-sm'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Lifestyle & Govt Verification Badge */}
        {step === 4 && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.dietLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DIET_OPTIONS.map((diet) => (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => setProfile({
                      ...profile,
                      lifestyle: { ...profile.lifestyle, diet }
                    })}
                    className={`p-2 rounded-xl border text-xs text-left transition-colors ${
                      profile.lifestyle.diet === diet
                        ? 'bg-rose-500/20 border-rose-500 text-white font-semibold'
                        : 'bg-white/5 border-white/10 text-slate-300'
                    }`}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>

            {/* Govt ID Online Verification Option */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-950/70 to-indigo-950/70 border border-sky-400/30 text-xs text-sky-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-sky-400" />
                  <span className="font-bold text-white">Govt Document Verification</span>
                </div>
                {profile.govtVerification?.isVerified ? (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    VERIFIED ✓
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    OPTIONAL
                  </span>
                )}
              </div>

              <p className="text-[11px] text-sky-300/80 leading-relaxed">
                Confirm your identity with Aadhaar Card, PAN Card, Indian Passport, or Voter ID to obtain the authentic verified tick on your profile.
              </p>

              {onNavigateToVerification && (
                <button
                  type="button"
                  onClick={onNavigateToVerification}
                  className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-sky-950"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{profile.govtVerification?.isVerified ? 'Manage Verified Document' : 'Verify with Govt ID Online'}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-3 flex gap-2">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)}
            className="flex-1 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-medium"
          >
            Previous
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
        >
          <span>{step === 4 ? 'Save Profile' : 'Next Step'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* AI Bio Generator Modal */}
      <AIBioGeneratorModal
        isOpen={showAiModal}
        currentBio={profile.bio}
        name={profile.name}
        interests={profile.interests}
        profession={profile.profession}
        onClose={() => setShowAiModal(false)}
        onApplyBio={(newBio) => setProfile({ ...profile, bio: newBio })}
      />
    </div>
  );
};
