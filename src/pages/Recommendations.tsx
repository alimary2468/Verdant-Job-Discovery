import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, UserCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { getRecommendations, RecommendResponse, RecommendationItem } from '../utils/api';
import { JobCard } from '../components/JobCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { EmptyState } from '../components/EmptyState';
import { MatchRing } from '../components/MatchRing';

export const Recommendations: React.FC = () => {
  const { profile, hasProfile } = useProfile();

  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [totalConsidered, setTotalConsidered] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchMatches() {
      if (!profile || !profile.skills || profile.skills.length === 0) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data: RecommendResponse = await getRecommendations(profile);
        if (mounted) {
          setRecommendations(data.recommendations);
          setTotalConsidered(data.total_considered);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Unable to generate matches right now.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchMatches();
    return () => {
      mounted = false;
    };
  }, [profile]);

  // If user hasn't created a profile yet
  if (!hasProfile || !profile) {
    return (
      <div className="min-h-screen py-16 px-4">
        <EmptyState
          icon="sparkles"
          title="Build your profile to unlock recommendations"
          description="Verdant's AI matching engine evaluates your skills, experience level, and preferred career field against every available role to score and rank opportunities."
          actionLabel="Build Your Profile"
          onAction={() => window.location.assign('/profile')}
          secondaryActionLabel="Explore all jobs first"
          onSecondaryAction={() => window.location.assign('/jobs')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E5E7EB]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#10B981] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Personalized Ranking</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
              Recommended for {profile.name || 'You'}
            </h1>
            <p className="text-sm sm:text-base text-[#64748B] mt-1.5 max-w-2xl">
              Top 10 matches based on your skills, experience, and preferred career field, scored via local TF-IDF cosine similarity.
            </p>
          </div>

          {/* Active Profile Pill Card */}
          <div className="p-4 rounded-2xl bg-white border border-[#A7F3D0] shadow-xs flex items-center justify-between gap-4 max-w-sm shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#065F46]">
                <UserCheck className="w-4 h-4 text-[#10B981]" />
                <span>Active Profile</span>
              </div>
              <p className="text-xs text-[#64748B]">
                {profile.skills.length} skills · {profile.experience_level} · {profile.preferred_field}
              </p>
            </div>

            <Link
              to="/profile"
              className="px-3 py-1.5 rounded-full border border-[#10B981] text-xs font-semibold text-[#065F46] hover:bg-[#D1FAE5] transition-colors shrink-0"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Highest Match Spotlight Banner (if top recommendation exists) */}
        {!loading && recommendations.length > 0 && (
          <div className="bg-gradient-to-r from-[#D1FAE5]/60 via-[#A7F3D0]/30 to-[#FEF3C7]/40 rounded-3xl p-6 sm:p-8 border border-[#A7F3D0] shadow-verdant flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <MatchRing score={recommendations[0].match_score} size="lg" />
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#065F46] bg-white/80 px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                  Highest Match ({recommendations[0].match_score}%)
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                  {recommendations[0].job.title} at {recommendations[0].job.company}
                </h3>
                <p className="text-xs sm:text-sm text-[#166534] max-w-xl">
                  {recommendations[0].match_reason}
                </p>
              </div>
            </div>

            <Link
              to={`/jobs/${recommendations[0].job.id}`}
              className="px-6 py-3 rounded-full bg-[#10B981] text-white text-xs sm:text-sm font-semibold hover:bg-[#059669] shrink-0 shadow-verdant flex items-center gap-2 hover:scale-[1.02] transition-all"
            >
              <span>View Top Role</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Recommendations Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#0F172A]">
              All Top Matched Roles ({recommendations.length})
            </h2>
            {totalConsidered > 0 && (
              <span className="text-xs text-[#64748B]">
                Scored across {totalConsidered} available jobs
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((item) => (
                <JobCard
                  key={item.job.id}
                  job={item.job}
                  explicitMatchScore={item.match_score}
                  explicitMatchReason={item.match_reason}
                  showMatchReason={true}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="sparkles"
              title="No recommendations generated yet"
              description="Make sure your skills and career preferences are saved on your profile."
              actionLabel="Update Profile"
              onAction={() => window.location.assign('/profile')}
            />
          )}
        </div>
      </div>
    </div>
  );
};
