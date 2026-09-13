import React, { useState, KeyboardEvent } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';

interface SkillInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  suggestedSkills?: string[];
}

const BADGE_STYLES = [
  'bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]',
  'bg-[#A7F3D0]/60 text-[#047857] border-[#6EE7B7]',
  'bg-[#FED7AA]/60 text-[#9A3412] border-[#FDBA74]',
  'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
];

const DEFAULT_SUGGESTIONS = [
  'Python', 'Machine Learning', 'SQL', 'React', 'Node.js',
  'TypeScript', 'Docker', 'Figma', 'AWS', 'Data Science',
  'PostgreSQL', 'Tailwind CSS', 'NLP', 'Next.js', 'PyTorch'
];

export const SkillInput: React.FC<SkillInputProps> = ({
  skills,
  onChange,
  suggestedSkills = DEFAULT_SUGGESTIONS,
}) => {
  const [inputVal, setInputVal] = useState('');

  const addSkill = (rawSkill: string) => {
    const trimmed = rawSkill.trim();
    if (!trimmed) return;

    // Avoid exact duplicate
    const exists = skills.some(s => s.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      onChange([...skills, trimmed]);
    }
    setInputVal('');
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(skills.filter(s => s !== skillToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(inputVal);
    }
  };

  // Remaining suggestions that aren't already added
  const remainingSuggestions = suggestedSkills.filter(
    s => !skills.some(existing => existing.toLowerCase() === s.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {/* Active Skills Pills */}
      <div className="flex flex-wrap gap-2 min-h-[42px] p-2.5 rounded-xl border border-[#E5E7EB] bg-white focus-within:ring-2 focus-within:ring-[#10B981] focus-within:border-transparent transition-all">
        {skills.map((skill, index) => {
          const badgeColor = BADGE_STYLES[index % BADGE_STYLES.length];
          return (
            <span
              key={skill}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all hover:scale-105 select-none ${badgeColor}`}
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="p-0.5 rounded-full hover:bg-black/10 transition-colors focus:outline-none"
                aria-label={`Remove skill ${skill}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}

        {/* Text Input inside the box */}
        <input
          type="text"
          id="skill-input-field"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={skills.length === 0 ? 'Type a skill and press Enter (e.g. Python, SQL, React)...' : 'Add another skill...'}
          className="flex-1 min-w-[180px] bg-transparent text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none py-1 px-1"
        />

        {inputVal.trim() && (
          <button
            type="button"
            onClick={() => addSkill(inputVal)}
            className="px-2.5 py-1 rounded-lg bg-[#10B981] text-white text-xs font-semibold hover:bg-[#059669] flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>
        )}
      </div>

      <p className="text-xs text-[#64748B]">
        Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono">Enter</kbd> or comma to add each skill.
      </p>

      {/* Quick suggestions */}
      {remainingSuggestions.length > 0 && (
        <div className="pt-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748B] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Popular suggestions (click to add):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {remainingSuggestions.slice(0, 10).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addSkill(s)}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#FAFBFC] hover:bg-[#D1FAE5] border border-[#E5E7EB] hover:border-[#A7F3D0] text-[#475569] hover:text-[#065F46] transition-all hover:scale-102 flex items-center gap-1"
              >
                <Plus className="w-2.5 h-2.5 opacity-60" />
                <span>{s}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
