import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Bookmark, Sparkles, Globe, Calendar } from 'lucide-react';
import { ClientJob, evaluateJobMatch } from '../utils/matcherClient';
import { useProfile } from '../context/ProfileContext';

interface JobCardProps {
  job: ClientJob;
  explicitMatchScore?: number;
  explicitMatchReason?: string;
  showMatchReason?: boolean;
}

// Rotate skill badge colors across mint, sage, peach, cream
const BADGE_STYLES = [
  'bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]', // Mint
  'bg-[#A7F3D0]/60 text-[#047857] border-[#6EE7B7]', // Sage
  'bg-[#FED7AA]/60 text-[#9A3412] border-[#FDBA74]', // Peach
  'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]', // Cream
];

// Helper for relative date display
function formatRelativeDate(dateStr: string): string {
  try {
    const posted = new Date(dateStr);
    const now = new Date('2025-01-12'); // Normalized baseline or current
    const diffDays = Math.max(0, Math.floor((now.getTime() - posted.getTime()) / (1000 * 3600 * 24)));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays <= 30) return `${diffDays} days ago`;
    return 'Recent';
  } catch {
    return 'Recently posted';
  }
}

// Generate consistent company pastel background from name
function getCompanyBg(name: string): string {
  const colors = [
    'bg-emerald-50 text-emerald-700 border-emerald-200',
    'bg-teal-50 text-teal-700 border-teal-200',
    'bg-amber-50 text-amber-700 border-amber-200',
    'bg-sky-50 text-sky-700 border-sky-200',
    'bg-indigo-50 text-indigo-700 border-indigo-200',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[Math.abs(hash) % colors.length];
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  explicitMatchScore,
  explicitMatchReason,
  showMatchReason = false,
}) => {
  const { profile, isJobSaved, toggleSaveJob } = useProfile();

  // Compute match score if not explicitly passed
  let matchScore: number | null = null;
  let matchReason: string | null = null;

  if (explicitMatchScore !== undefined) {
    matchScore = explicitMatchScore;
    matchReason = explicitMatchReason || null;
  } else if (profile && profile.skills && profile.skills.length > 0) {
    const evalResult = evaluateJobMatch(job, profile);
    if (evalResult) {
      matchScore = evalResult.match_score;
      matchReason = evalResult.match_reason;
    }
  }

  // Left border color according to match level:
  // High match: green
  // Medium match: peach
  // Low/no match: soft grey
  let borderLeftColor = 'border-l-[#E5E7EB]'; // Soft grey
  let matchBadgeColor = 'bg-slate-100 text-slate-700 border-slate-200';

  if (matchScore !== null) {
    if (matchScore >= 70) {
      borderLeftColor = 'border-l-[#10B981]'; // Green
      matchBadgeColor = 'bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]';
    } else if (matchScore >= 40) {
      borderLeftColor = 'border-l-[#FED7AA]'; // Peach
      matchBadgeColor = 'bg-[#FED7AA]/60 text-[#9A3412] border-[#FDBA74]';
    }
  }

  const saved = isJobSaved(job.id);
  const visibleSkills = job.skills.slice(0, 4);
  const remainingSkillsCount = Math.max(0, job.skills.length - 4);
  const companyInitials = (job.company || 'Co')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <article
      id={`job-card-${job.id}`}
      className={`group relative bg-white rounded-2xl p-6 border border-[#E5E7EB] border-l-4 ${borderLeftColor} shadow-verdant hover:shadow-verdant-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between`}
    >
      <div>
        {/* Top bar: Company info & Actions */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Company Avatar */}
            <div
              className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold text-sm tracking-wider shrink-0 ${getCompanyBg(
                job.company
              )}`}
            >
              {companyInitials}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors">
                {job.company}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#64748B] mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#10B981]" />
                  {job.location}
                </span>
                {job.is_remote && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-[#D1FAE5] text-[#065F46] text-[10px] font-medium">
                    <Globe className="w-2.5 h-2.5" />
                    Remote
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleSaveJob(job.id);
            }}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              saved
                ? 'bg-[#D1FAE5] border-[#A7F3D0] text-[#10B981]'
                : 'bg-[#FAFBFC] border-[#E5E7EB] text-[#94A3B8] hover:text-[#0F172A] hover:border-[#CBD5E1]'
            }`}
            aria-label={saved ? 'Remove from saved jobs' : 'Save job'}
            title={saved ? 'Saved' : 'Save job'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#10B981]' : ''}`} />
          </button>
        </div>

        {/* Match score pill (if user profile exists) */}
        {matchScore !== null && (
          <div className="mb-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${matchBadgeColor}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{matchScore}% Match</span>
            </span>
          </div>
        )}

        {/* Job Title */}
        <Link to={`/jobs/${job.id}`} className="block group-hover:text-[#059669] transition-colors">
          <h3 className="text-lg font-bold text-[#0F172A] leading-snug line-clamp-2">
            {job.title}
          </h3>
        </Link>

        {/* Job Meta badges (Job type, Experience, Salary) */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-xs text-[#64748B]">
          <span className="px-2.5 py-1 rounded-full bg-[#FAFBFC] border border-[#E5E7EB] font-medium">
            {job.job_type}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#FAFBFC] border border-[#E5E7EB] font-medium">
            {job.experience_level} Level
          </span>
          {job.salary_range && (
            <span className="px-2.5 py-1 rounded-full bg-[#FAFBFC] border border-[#E5E7EB] text-[#065F46] font-medium">
              {job.salary_range}
            </span>
          )}
        </div>

        {/* Skills list with rotating colors & hover effect */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {visibleSkills.map((skill, index) => {
            const badgeClass = BADGE_STYLES[index % BADGE_STYLES.length];
            return (
              <span
                key={skill}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium border transition-transform duration-200 hover:scale-105 select-none ${badgeClass}`}
              >
                {skill}
              </span>
            );
          })}
          {remainingSkillsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
              +{remainingSkillsCount} more
            </span>
          )}
        </div>

        {/* Optional Match Reason snippet */}
        {showMatchReason && matchReason && (
          <div className="mt-3.5 p-3 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] text-xs text-[#166534] leading-relaxed">
            {matchReason}
          </div>
        )}
      </div>

      {/* Card footer: Posted date & Details link */}
      <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatRelativeDate(job.posted_date)}</span>
        </div>

        <Link
          to={`/jobs/${job.id}`}
          className="text-xs font-semibold text-[#10B981] hover:text-[#059669] flex items-center gap-1 group/link"
        >
          <span>View Details</span>
          <span className="transform group-hover/link:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>
    </article>
  );
};
