import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Globe,
  Calendar,
  Building,
  Bookmark,
  ExternalLink,
  Share2,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchJobById } from '../utils/api';
import { ClientJob, evaluateJobMatch, ClientMatchInfo } from '../utils/matcherClient';
import { useProfile } from '../context/ProfileContext';
import { MatchRing } from '../components/MatchRing';
import { ApplyModal } from '../components/ApplyModal';
import { Loader } from '../components/Loader';

const BADGE_STYLES = [
  'bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]',
  'bg-[#A7F3D0]/60 text-[#047857] border-[#6EE7B7]',
  'bg-[#FED7AA]/60 text-[#9A3412] border-[#FDBA74]',
  'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
];

export const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, hasProfile, isJobSaved, toggleSaveJob, isJobApplied } = useProfile();

  const [job, setJob] = useState<ClientJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadJob() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await fetchJobById(id);
        if (mounted) setJob(data);
      } catch (err: any) {
        if (mounted) setError(err.message || 'Job not found');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadJob();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <Loader message="Loading job specifications..." size="lg" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-lg mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto text-2xl">
          ⚠️
        </div>
        <h2 className="text-2xl font-bold text-[#0F172A]">Job Not Found</h2>
        <p className="text-sm text-[#64748B]">
          The position you are looking for might have been closed or removed from the dataset.
        </p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#10B981] text-white text-xs font-semibold hover:bg-[#059669]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all jobs</span>
        </Link>
      </div>
    );
  }

  // Calculate Match info if profile exists
  let matchInfo: ClientMatchInfo | null = null;
  if (profile && profile.skills && profile.skills.length > 0) {
    matchInfo = evaluateJobMatch(job, profile);
  }

  const saved = isJobSaved(job.id);
  const applied = isJobApplied(job.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard! 📋', {
      duration: 3000,
      style: {
        borderRadius: '16px',
        background: '#FFFFFF',
        color: '#0F172A',
        border: '1px solid #E5E7EB',
      },
    });
  };

  const handleApplyClick = () => {
    if (job.apply_url && job.apply_url.startsWith('http')) {
      window.open(job.apply_url, '_blank', 'noopener,noreferrer');
    } else {
      setApplyModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] p-2 rounded-xl hover:bg-white border border-transparent hover:border-[#E5E7EB] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to jobs</span>
          </button>
        </div>

        {/* Job Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E7EB] shadow-verdant relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-[#10B981] bg-[#D1FAE5] px-3 py-1 rounded-full border border-[#A7F3D0]">
                  {job.company}
                </span>
                {job.is_remote && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-[#FAFBFC] border border-[#E5E7EB] text-[#64748B] px-3 py-1 rounded-full">
                    <Globe className="w-3 h-3 text-[#10B981]" />
                    Remote Eligible
                  </span>
                )}
                <span className="text-xs text-[#94A3B8]">
                  Posted on {new Date(job.posted_date).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A] leading-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#64748B] pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#10B981]" />
                  {job.location}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-[#64748B]" />
                  {job.job_type}
                </span>
                <span>·</span>
                <span>{job.experience_level} Level</span>
                {job.salary_range && (
                  <>
                    <span>·</span>
                    <span className="font-semibold text-[#065F46]">{job.salary_range}</span>
                  </>
                )}
              </div>
            </div>

            {/* Header Right Actions: Match Ring & Apply */}
            <div className="flex items-center gap-4 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-[#F1F5F9]">
              {matchInfo ? (
                <div className="flex items-center gap-3 bg-[#F0FDF4] p-3.5 rounded-2xl border border-[#DCFCE7]">
                  <MatchRing score={matchInfo.match_score} size="md" />
                  <div className="text-left pr-2">
                    <p className="text-xs font-bold text-[#065F46] uppercase tracking-wider">
                      Match Fit
                    </p>
                    <p className="text-xs text-[#166534] font-medium">
                      Based on your profile
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-[#FAFBFC] border border-[#E5E7EB] max-w-[200px] text-center">
                  <Sparkles className="w-4 h-4 text-[#10B981] mx-auto mb-1" />
                  <p className="text-[11px] text-[#64748B] mb-2 leading-tight">
                    See how well you match this role.
                  </p>
                  <Link
                    to="/profile"
                    className="inline-block text-xs font-semibold text-[#10B981] hover:underline"
                  >
                    Build profile →
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleSaveJob(job.id)}
                  className={`p-3 rounded-2xl border transition-colors ${
                    saved
                      ? 'bg-[#D1FAE5] border-[#A7F3D0] text-[#10B981]'
                      : 'bg-[#FAFBFC] border-[#E5E7EB] text-[#94A3B8] hover:text-[#0F172A]'
                  }`}
                  title={saved ? 'Remove saved' : 'Save job'}
                >
                  <Bookmark className={`w-5 h-5 ${saved ? 'fill-[#10B981]' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="p-3 rounded-2xl border border-[#E5E7EB] bg-[#FAFBFC] text-[#64748B] hover:text-[#0F172A] transition-colors"
                  title="Share job link"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Match Explanation Card (if profile active) */}
        {matchInfo && (
          <div className="bg-gradient-to-r from-[#F0FDF4] to-[#ECFDF5] rounded-3xl p-6 sm:p-8 border border-[#A7F3D0] shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#10B981]" />
              <h3 className="text-base font-bold text-[#065F46]">
                Why this role matches your profile ({matchInfo.match_score}% fit)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {matchInfo.bullet_points.map((pt, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#166534]">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            {matchInfo.matched_skills.length > 0 && (
              <div className="pt-2 border-t border-[#A7F3D0]/50 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-[#065F46]">Overlapping skills:</span>
                {matchInfo.matched_skills.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white border border-[#10B981] text-[#065F46]"
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Grid: Description + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Full Description & Required Skills */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skills Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#0F172A]">
                Key Skills & Technologies
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => {
                  const badgeClass = BADGE_STYLES[index % BADGE_STYLES.length];
                  const isUserSkill = profile?.skills.some(
                    (us) => us.toLowerCase() === skill.toLowerCase()
                  );

                  return (
                    <span
                      key={skill}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${badgeClass} ${
                        isUserSkill ? 'ring-2 ring-[#10B981] ring-offset-1' : ''
                      }`}
                    >
                      {skill} {isUserSkill && '✓'}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-[#0F172A]">
                About the Role
              </h2>

              <div className="text-sm text-[#334155] leading-relaxed whitespace-pre-line space-y-4">
                {job.description}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-6">
            {/* Primary Action Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-verdant space-y-5 sticky top-24">
              <h3 className="text-base font-bold text-[#0F172A]">
                Application Summary
              </h3>

              <div className="space-y-3 text-xs text-[#64748B] pb-4 border-b border-[#F1F5F9]">
                <div className="flex justify-between">
                  <span>Seniority:</span>
                  <strong className="text-[#0F172A]">{job.experience_level}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Employment Type:</span>
                  <strong className="text-[#0F172A]">{job.job_type}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <strong className="text-[#0F172A]">{job.location}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Remote:</span>
                  <strong className="text-[#0F172A]">{job.is_remote ? 'Yes' : 'On-site / Hybrid'}</strong>
                </div>
                {job.company_size && (
                  <div className="flex justify-between">
                    <span>Company Size:</span>
                    <strong className="text-[#0F172A]">{job.company_size}</strong>
                  </div>
                )}
                {job.industry && (
                  <div className="flex justify-between">
                    <span>Industry:</span>
                    <strong className="text-[#0F172A]">{job.industry}</strong>
                  </div>
                )}
              </div>

              {/* Apply Button */}
              <div>
                <button
                  type="button"
                  onClick={handleApplyClick}
                  id="job-detail-apply-btn"
                  className={`w-full py-3.5 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-verdant ${
                    applied
                      ? 'bg-[#D1FAE5] border border-[#A7F3D0] text-[#065F46]'
                      : 'bg-[#10B981] text-white hover:bg-[#059669] hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {applied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      <span>Applied ✓</span>
                    </>
                  ) : job.apply_url && job.apply_url.startsWith('http') ? (
                    <>
                      <span>Apply on Career Portal</span>
                      <ExternalLink className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Apply Now</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-[#94A3B8] text-center mt-2.5">
                  {job.apply_url ? 'Direct employer link verified' : 'Submits fast-track review to Verdant queue'}
                </p>
              </div>

              {/* Company Info Box */}
              <div className="p-4 rounded-2xl bg-[#FAFBFC] border border-[#F1F5F9] space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#10B981]" />
                  <span className="text-xs font-bold text-[#0F172A]">About {job.company}</span>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Verified hiring employer from the LinkedIn talent dataset. Applications undergo review by their human talent acquisition team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        job={job}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />
    </div>
  );
};
