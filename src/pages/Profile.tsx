import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Save, CheckCircle, RotateCcw, User, GraduationCap, Briefcase, Compass, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { SkillInput } from '../components/SkillInput';
import { useProfile } from '../context/ProfileContext';
import { UserProfile } from '../utils/matcherClient';

const EXPERIENCE_LEVELS = [
  { id: 'Intern', label: 'Intern', desc: 'Seeking internships or student co-ops' },
  { id: 'Entry', label: 'Entry Level', desc: '0 - 2 years of professional experience' },
  { id: 'Mid', label: 'Mid Level', desc: '2 - 5 years of industry experience' },
  { id: 'Senior', label: 'Senior Level', desc: '5+ years of proven leadership or mastery' },
];

const EDUCATION_OPTIONS = [
  "Bachelor's Degree",
  "Master's Degree",
  'Ph.D. / Doctorate',
  'Associate Degree',
  'Self-Taught / Bootcamp',
  'High School Diploma',
];

const CAREER_FIELDS = [
  { id: 'AI/ML', label: 'AI & Machine Learning', icon: '🤖' },
  { id: 'Web Development', label: 'Web & Software Engineering', icon: '💻' },
  { id: 'Data', label: 'Data Science & Analytics', icon: '📊' },
  { id: 'Design', label: 'UI/UX & Product Design', icon: '🎨' },
  { id: 'Marketing', label: 'Growth & Digital Marketing', icon: '📈' },
  { id: 'Other', label: 'General Technology & Systems', icon: '⚙️' },
];

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { profile, saveProfile, clearProfile } = useProfile();

  const [name, setName] = useState(profile?.name || '');
  const [skills, setSkills] = useState<string[]>(profile?.skills || ['Python', 'SQL', 'React']);
  const [experienceLevel, setExperienceLevel] = useState(profile?.experience_level || 'Entry');
  const [education, setEducation] = useState(profile?.education || "Bachelor's Degree");
  const [preferredField, setPreferredField] = useState(profile?.preferred_field || 'Web Development');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Synchronize internal inputs if profile changes externally or loads
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setSkills(profile.skills || []);
      setExperienceLevel(profile.experience_level || 'Entry');
      setEducation(profile.education || "Bachelor's Degree");
      setPreferredField(profile.preferred_field || 'Web Development');
    }
  }, [profile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (skills.length === 0) {
      toast.error('Please add at least one skill to generate recommendations.');
      return;
    }

    const updated: UserProfile = {
      name: name.trim(),
      skills,
      experience_level: experienceLevel,
      education,
      preferred_field: preferredField,
    };

    saveProfile(updated);
    setSavedSuccess(true);

    toast.success('Profile saved successfully!', {
      duration: 3500,
      style: {
        borderRadius: '16px',
        background: '#FFFFFF',
        color: '#0F172A',
        border: '1px solid #A7F3D0',
        boxShadow: '0 4px 16px rgba(16,185,129,0.12)',
      },
    });
  };

  const handleReset = () => {
    clearProfile();
    setName('');
    setSkills([]);
    setExperienceLevel('Entry');
    setEducation("Bachelor's Degree");
    setPreferredField('Web Development');
    setSavedSuccess(false);
    setShowResetConfirm(false);

    toast.success('Profile reset successfully', {
      duration: 3000,
      style: {
        borderRadius: '16px',
        background: '#FFFFFF',
        color: '#0F172A',
        border: '1px solid #E5E7EB',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      },
    });
  };

  return (
    <div className="min-h-screen py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D1FAE5] border border-[#A7F3D0] text-xs font-semibold text-[#065F46]">
            <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Step 1: Career Profile</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
            Your Career Profile
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            Tell Verdant what you know and where you want to grow. We compare your profile against all 50 verified jobs to compute mathematical match scores.
          </p>
        </div>

        {/* Saved notice banner */}
        {savedSuccess && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0" />
              <p className="text-xs sm:text-sm font-semibold text-[#065F46]">
                Profile active with {skills.length} skills. Ready to see personalized matches!
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/recommendations')}
              className="px-5 py-2 rounded-full bg-[#10B981] text-white text-xs font-bold hover:bg-[#059669] shrink-0 shadow-verdant flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>See Recommendations →</span>
            </button>
          </div>
        )}

        {/* Profile Form Card */}
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E7EB] shadow-verdant space-y-8"
        >
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#F1F5F9]">
              <User className="w-5 h-5 text-[#10B981]" />
              <h2 className="text-base font-bold text-[#0F172A]">Basic Details</h2>
            </div>

            <div>
              <label htmlFor="profile-name-input" className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                Your Name (Optional)
              </label>
              <input
                type="text"
                id="profile-name-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Chen"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#FAFBFC] focus:bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
              />
            </div>
          </div>

          {/* Section 2: Skills (Primary matching factor: 60%) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#10B981]" />
                <h2 className="text-base font-bold text-[#0F172A]">
                  Skills & Proficiencies *
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#D1FAE5] text-[#065F46]">
                60% Match Weight
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              Add languages, frameworks, libraries, and core domains. Synonyms (like ReactJS / React) are mapped automatically.
            </p>

            <SkillInput skills={skills} onChange={setSkills} />
          </div>

          {/* Section 3: Experience Level (20%) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-5 h-5 text-[#10B981]" />
                <h2 className="text-base font-bold text-[#0F172A]">
                  Experience Level
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FED7AA]/60 text-[#9A3412]">
                20% Match Weight
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {EXPERIENCE_LEVELS.map((lvl) => {
                const isSelected = experienceLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setExperienceLevel(lvl.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#D1FAE5]/50 border-[#10B981] shadow-xs'
                        : 'bg-[#FAFBFC] border-[#E5E7EB] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${isSelected ? 'text-[#065F46]' : 'text-[#0F172A]'}`}>
                        {lvl.label}
                      </span>
                      {isSelected && <span className="text-[#10B981] text-xs font-bold">● Active</span>}
                    </div>
                    <p className="text-xs text-[#64748B]">{lvl.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Preferred Career Field (20%) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-[#10B981]" />
                <h2 className="text-base font-bold text-[#0F172A]">
                  Preferred Career Field
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E]">
                20% Match Weight
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {CAREER_FIELDS.map((field) => {
                const isSelected = preferredField === field.id;
                return (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => setPreferredField(field.id)}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#D1FAE5] border-[#10B981] text-[#065F46] font-bold shadow-xs'
                        : 'bg-[#FAFBFC] border-[#E5E7EB] text-[#475569] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <span className="text-2xl">{field.icon}</span>
                    <span className="text-xs font-semibold">{field.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Education */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#F1F5F9]">
              <GraduationCap className="w-5 h-5 text-[#10B981]" />
              <h2 className="text-base font-bold text-[#0F172A]">
                Education Level
              </h2>
            </div>

            <div>
              <label htmlFor="education-select" className="sr-only">Highest Education Attained</label>
              <select
                id="education-select"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#FAFBFC] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
              >
                {EDUCATION_OPTIONS.map((edu) => (
                  <option key={edu} value={edu}>
                    {edu}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              {showResetConfirm ? (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-2xl animate-fadeIn">
                  <span className="text-xs text-red-700 font-medium">Reset all saved data?</span>
                  <button
                    type="button"
                    id="confirm-reset-btn"
                    onClick={handleReset}
                    className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-full transition-colors shadow-xs"
                  >
                    Yes, Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] px-2.5 py-1 rounded-full transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                (profile || skills.length > 0 || name.length > 0) && (
                  <button
                    type="button"
                    id="reset-profile-btn"
                    onClick={() => setShowResetConfirm(true)}
                    className="text-xs font-semibold text-[#EF4444] hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset profile data</span>
                  </button>
                )
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="submit"
                id="save-profile-btn"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#10B981] text-white text-sm font-semibold hover:bg-[#059669] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-verdant flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
            </div>
          </div>
        </form>

        {/* Direct Link to Recommendations if already saved */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => navigate('/recommendations')}
            className="text-xs font-semibold text-[#10B981] hover:text-[#059669] hover:underline inline-flex items-center gap-1"
          >
            <span>Skip directly to Recommendations</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
