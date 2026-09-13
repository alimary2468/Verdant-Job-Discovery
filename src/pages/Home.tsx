import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Briefcase, Building2, MapPin, CheckCircle2, UserCheck, Send } from 'lucide-react';
import { HeroBlob } from '../components/HeroBlob';
import { SearchBar } from '../components/SearchBar';
import { JobCard } from '../components/JobCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { fetchFeaturedJobs, fetchDatasetStats, DatasetStats } from '../utils/api';
import { ClientJob } from '../utils/matcherClient';
import { useProfile } from '../context/ProfileContext';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { hasProfile, profile } = useProfile();

  const [featuredJobs, setFeaturedJobs] = useState<ClientJob[]>([]);
  const [stats, setStats] = useState<DatasetStats>({ totalJobs: 0, totalCompanies: 0, totalLocations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadHomeData() {
      try {
        setLoading(true);
        const [jobsData, statsData] = await Promise.all([
          fetchFeaturedJobs(),
          fetchDatasetStats(),
        ]);
        if (mounted) {
          setFeaturedJobs(jobsData);
          setStats(statsData);
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadHomeData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSearchSubmit = (term: string) => {
    if (term.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(term.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <HeroBlob />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Subtle brand tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#A7F3D0] shadow-xs text-xs font-semibold text-[#065F46] mb-6 animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Intelligent Job Discovery Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span className="text-[#059669]">AI-Powered</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#0F172A] leading-[1.1] mb-6">
            Grow into your <span className="text-[#10B981] relative inline-block">next role.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-[#64748B] font-normal max-w-2xl mx-auto leading-relaxed mb-10">
            AI-powered job matching for people who care about their career. Compare your skills with verified opportunities and understand exactly why each job fits.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar
              size="large"
              placeholder="Search jobs, skills, companies (e.g. Python, Motive, Remote)..."
              onSubmit={handleSearchSubmit}
            />
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/jobs"
              id="hero-cta-browse"
              className="px-8 py-3.5 rounded-full bg-[#10B981] text-white font-semibold hover:bg-[#059669] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-verdant flex items-center gap-2 text-sm sm:text-base"
            >
              <span>Browse Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {hasProfile ? (
              <Link
                to="/recommendations"
                id="hero-cta-matches"
                className="px-8 py-3.5 rounded-full bg-white border border-[#10B981] text-[#059669] font-semibold hover:bg-[#D1FAE5]/40 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm sm:text-base flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#10B981]" />
                <span>See My Recommendations</span>
              </Link>
            ) : (
              <Link
                to="/profile"
                id="hero-cta-profile"
                className="px-8 py-3.5 rounded-full bg-white border border-[#10B981] text-[#059669] font-semibold hover:bg-[#D1FAE5]/40 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm sm:text-base"
              >
                Build Profile
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Real Dataset Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAFBFC] border border-[#F1F5F9]">
            <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] border border-[#A7F3D0] flex items-center justify-center text-[#10B981] shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
                {stats.totalJobs || '—'}
              </p>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mt-0.5">
                Total Verified Jobs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAFBFC] border border-[#F1F5F9]">
            <div className="w-12 h-12 rounded-2xl bg-[#FED7AA]/50 border border-[#FDBA74] flex items-center justify-center text-[#EA580C] shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
                {stats.totalCompanies || '—'}
              </p>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mt-0.5">
                Hiring Companies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAFBFC] border border-[#F1F5F9]">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706] shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
                {stats.totalLocations || '—'}
              </p>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mt-0.5">
                Global & Local Hubs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Opportunities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#10B981] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Handpicked Listings</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">
              Featured Opportunities
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              Top roles from industry-leading companies, updated directly from the verified dataset.
            </p>
          </div>

          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#10B981] hover:text-[#059669] group shrink-0"
          >
            <span>View all {stats.totalJobs} jobs</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Featured Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : featuredJobs.length > 0 ? (
            featuredJobs.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <div className="col-span-full text-center py-12 text-[#64748B]">
              No featured jobs available at the moment.
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white/80 border-y border-[#E5E7EB] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
              Simple & Transparent
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A] mt-2">
              How Verdant Works
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] mt-3">
              We replace black-box job search with mathematical transparency and personalized skill matching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative p-8 rounded-3xl bg-[#FAFBFC] border border-[#E5E7EB] hover:border-[#A7F3D0] transition-colors shadow-xs group">
              <div className="w-14 h-14 rounded-2xl bg-[#D1FAE5] border border-[#A7F3D0] flex items-center justify-center mb-6 shadow-xs group-hover:scale-105 transition-transform">
                <UserCheck className="w-7 h-7 text-[#10B981]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                Build your profile
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Add your skills, education, experience level, and preferred career field. No lengthy resumes required — just pure competencies.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-3xl bg-[#FAFBFC] border border-[#E5E7EB] hover:border-[#FDBA74] transition-colors shadow-xs group">
              <div className="w-14 h-14 rounded-2xl bg-[#FED7AA]/60 border border-[#FDBA74] flex items-center justify-center mb-6 shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-7 h-7 text-[#D97706]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                Get your matches
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Our local TF-IDF & cosine similarity engine calculates exact match percentages and provides clear, human explanations of why a role fits.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-3xl bg-[#FAFBFC] border border-[#E5E7EB] hover:border-[#A7F3D0] transition-colors shadow-xs group">
              <div className="w-14 h-14 rounded-2xl bg-[#D1FAE5] border border-[#A7F3D0] flex items-center justify-center mb-6 shadow-xs group-hover:scale-105 transition-transform">
                <Send className="w-7 h-7 text-[#10B981]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                Apply directly
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Review full job descriptions, examine matched skills, and apply directly either through verified company career portals or our integrated one-click application queue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#D1FAE5] via-[#A7F3D0]/60 to-[#FEF3C7] p-8 sm:p-12 md:p-16 border border-[#A7F3D0] overflow-hidden shadow-verdant flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#065F46] bg-white/80 px-3 py-1 rounded-full border border-[#A7F3D0]">
              Start Growing Today
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
              Ready to find your ideal career environment?
            </h2>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Create your profile in 60 seconds and see which roles match your background with mathematical clarity.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              to="/profile"
              className="px-8 py-3.5 rounded-full bg-[#10B981] text-white font-semibold hover:bg-[#059669] shadow-verdant text-sm sm:text-base text-center transition-all hover:scale-[1.02]"
            >
              Build Profile Now
            </Link>
            <Link
              to="/jobs"
              className="px-8 py-3.5 rounded-full bg-white text-[#0F172A] font-semibold border border-[#E5E7EB] hover:bg-[#FAFBFC] text-sm sm:text-base text-center transition-all hover:scale-[1.02]"
            >
              Search Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
