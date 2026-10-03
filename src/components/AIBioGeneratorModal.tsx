import React, { useState } from 'react';
import { Sparkles, X, Check, RefreshCw, ShieldAlert } from 'lucide-react';

interface AIBioGeneratorModalProps {
  currentBio: string;
  name: string;
  interests: string[];
  profession: string;
  isOpen: boolean;
  onClose: () => void;
  onApplyBio: (newBio: string) => void;
}

const PRESET_STYLES = [
  { id: 'mindful', label: 'Mindful & Culturally Rooted', tone: 'warm, thoughtful, respecting family and traditions' },
  { id: 'witty', label: 'Witty & Conversational', tone: 'lighthearted with subtle humor, chai, and weekend passions' },
  { id: 'intellectual', label: 'Poetic & Intellectual', tone: 'philosophical, curious, fond of books, art, and Sufi melodies' }
];

export const AIBioGeneratorModal: React.FC<AIBioGeneratorModalProps> = ({
  currentBio,
  name,
  interests,
  profession,
  isOpen,
  onClose,
  onApplyBio
}) => {
  const [selectedStyle, setSelectedStyle] = useState(PRESET_STYLES[0].id);
  const [customKeywords, setCustomKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBio, setGeneratedBio] = useState('');

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      let result = '';
      if (selectedStyle === 'mindful') {
        result = `Building with intent as a ${profession || 'creative soul'}. Weekends are reserved for family brunches, quiet bookstores, and soulful Sufi melodies. Believer in mutual respect, shared laughter, and meaningful conversations over steaming cups of adrak chai.`;
      } else if (selectedStyle === 'witty') {
        result = `${profession || 'Dreamer'} by day, enthusiastic chai sommelier by night. If you appreciate good standup comedy, impromptu heritage walks, and debate over whether mountains or beaches make better getaways, we will get along wonderfully.`;
      } else {
        result = `Guided by quiet curiosity and timeless aesthetics. Passionate about ${interests.slice(0, 2).join(' and ') || 'art and poetry'}. Looking for someone grounded, kind-hearted, and ready to explore life's subtleties together.`;
      }

      if (customKeywords.trim()) {
        result += ` Always excited about ${customKeywords.trim()}.`;
      }

      setGeneratedBio(result);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-[#1c1325] border border-amber-500/20 p-5 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-amber-400">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">AI Profile Assistant</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-3 space-y-4">
          <p className="text-xs text-slate-300">
            Generate an authentic, respectful dating bio based on your selected interests and career.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Choose Tone
            </label>
            <div className="space-y-1.5">
              {PRESET_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-colors ${
                    selectedStyle === style.id
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-200'
                      : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="font-semibold">{style.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{style.tone}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Add Specific Keywords / Quirks (Optional)
            </label>
            <input
              type="text"
              value={customKeywords}
              onChange={(e) => setCustomKeywords(e.target.value)}
              placeholder="e.g. Filter coffee lover, amateur badminton player"
              className="w-full p-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-semibold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Crafting respectful bio...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Suggestion</span>
              </>
            )}
          </button>

          {generatedBio && (
            <div className="p-3.5 rounded-2xl bg-white/5 border border-amber-500/30 space-y-2">
              <div className="text-[11px] font-semibold text-amber-300 flex items-center justify-between">
                <span>AI Generated Draft</span>
                <span className="text-[10px] text-slate-400">Respectful &amp; Safe</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "{generatedBio}"
              </p>
              <button
                type="button"
                onClick={() => {
                  onApplyBio(generatedBio);
                  onClose();
                }}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Use This Bio</span>
              </button>
            </div>
          )}

          {/* Statutory AI Safety & Privacy Disclosure */}
          <div className="flex items-start gap-1.5 p-2 rounded-xl bg-white/5 text-[10px] text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <span>AI assistance never evaluates personal worth, shares private identity tokens, or infers sensitive traits.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
