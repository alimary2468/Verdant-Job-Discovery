import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { JobCard } from '../components/JobCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { EmptyState } from '../components/EmptyState';
import { fetchJobs, JobsResponse } from '../utils/api';
import { ClientJob } from '../utils/matcherClient';
import { useProfile } from '../context/ProfileContext';
import { Bookmark, ChevronLeft, ChevronRight, Sparkles, Briefcase } from 'lucide-react';

export const Jobs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { savedJobIds, hasProfile } = useProfile();

  // Read URL search params
  const initialSearch = searchParams.get('search') || '';
  const initialLocation = searchParams.get('location') || 'all';
  const initialType = searchParams.get('type') || 'all';
  const initialLevel = searchParams.get('level') || 'all';
  const initialRemote = searchParams.get('remote') || 'all';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const showOnlySaved = searchParams.get('saved') === 'true';

  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const [jobType, setJobType] = useState(initialType);
  const [experienceLevel, setExperienceLevel] = useState(initialLevel);
  const [isRemote, setIsRemote] = useState(initialRemote);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [jobsData, setJobsData] = useState<JobsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync state to URL params
  const updateUrlParams = useCallback((overrides: Record<string, any> = {}) => {
    const nextParams = new URLSearchParams();

    const curSearch = overrides.search !== undefined ? overrides.search : search;
    const curLoc = overrides.location !== undefined ? overrides.location : location;
    const curType = overrides.type !== undefined ? overrides.type : jobType;
    const curLevel = overrides.level !== undefined ? overrides.level : experienceLevel;
    const curRemote = overrides.remote !== undefined ? overrides.remote : isRemote;
    const curPage = overrides.page !== undefined ? overrides.page : currentPage;
    const curSaved = overrides.saved !== undefined ? overrides.saved : showOnlySaved;

    if (curSearch) nextParams.set('search', curSearch);
    if (curLoc && curLoc !== 'all') nextParams.set('location', curLoc);
    if (curType && curType !== 'all') nextParams.set('type', curType);
    if (curLevel && curLevel !== 'all') nextParams.set('level', curLevel);
    if (curRemote && curRemote !== 'all') nextParams.set('remote', curRemote);
    if (curPage > 1) nextParams.set('page', String(curPage));
    if (curSaved) nextParams.set('saved', 'true');

    setSearchParams(nextParams, { replace: true });
  }, [search, location, jobType, experienceLevel, isRemote, currentPage, showOnlySaved, setSearchParams]);

  // Load jobs from API
  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetchJobs({
        search: search || undefined,
        location: location !== 'all' ? location : undefined,
        type: jobType !== 'all' ? jobType : undefined,
        level: experienceLevel !== 'all' ? experienceLevel : undefined,
        remote: isRemote !== 'all' ? isRemote : undefined,
        page: currentPage,
        limit: 12,
      });

      setJobsData(res);
    } catch (err: any) {
      console.error('Failed to fetch jobs:', err);
      setError(err.message || "We couldn't load jobs right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, location, jobType, experienceLevel, isRemote, currentPage]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Handle filter changes with page reset
  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setCurrentPage(1);
    updateUrlParams({ search: newSearch, page: 1 });
  };

  const handleLocationChange = (newLoc: string) => {
    setLocation(newLoc);
    setCurrentPage(1);
    updateUrlParams({ location: newLoc, page: 1 });
  };

  const handleTypeChange = (newType: string) => {
    setJobType(newType);
    setCurrentPage(1);
    updateUrlParams({ type: newType, page: 1 });
  };

  const handleLevelChange = (newLevel: string) => {
    setExperienceLevel(newLevel);
    setCurrentPage(1);
    updateUrlParams({ level: newLevel, page: 1 });
  };

  const handleRemoteChange = (newRemote: string) => {
    setIsRemote(newRemote);
    setCurrentPage(1);
    updateUrlParams({ remote: newRemote, page: 1 });
  };

  const handleClearFilters = () => {
    setSearch('');
    setLocation('all');
    setJobType('all');
    setExperienceLevel('all');
    setIsRemote('all');
    setCurrentPage(1);
    setSearchParams(showOnlySaved ? { saved: 'true' } : {});
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSavedFilter = () => {
    const nextSaved = !showOnlySaved;
    updateUrlParams({ saved: nextSaved, page: 1 });
  };

  // Active filter count
  const activeFilterCount = [
    location !== 'all',
    jobType !== 'all',
    experienceLevel !== 'all',
    isRemote !== 'all',
    Boolean(search.trim()),
  ].filter(Boolean).length;

  // Filter jobs by saved status if toggle is on
  const displayedJobs = (jobsData?.jobs || []).filter((job) => {
    if (showOnlySaved) {
      return savedJobIds.includes(job.id);
    }
    return true;
  });

  return (
    <div className="min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#10B981] mb-2">
              <Briefcase className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Career Opportunities</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
              Explore Opportunities
            </h1>
            <p className="text-sm sm:text-base text-[#64748B] mt-1.5 max-w-2xl">
              Discover roles from top companies matching your experience and interests, normalized from verified LinkedIn listings.
            </p>
          </div>

          {/* Quick toggle for saved jobs */}
          <div className="flex items-center gap-3 shrink-0">
            {savedJobIds.length > 0 && (
              <button
                type="button"
                id="saved-jobs-toggle-btn"
                onClick={toggleSavedFilter}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                  showOnlySaved
                    ? 'bg-[#10B981] text-white border-[#10B981] shadow-xs'
                    : 'bg-white text-[#64748B] border-[#E5E7EB] hover:border-[#A7F3D0]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${showOnlySaved ? 'fill-white' : 'text-[#10B981]'}`} />
                <span>Saved Jobs ({savedJobIds.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl">
          <SearchBar
            initialValue={search}
            onSubmit={handleSearchChange}
            placeholder="Search by title, skill, company, description, or keyword..."
          />
        </div>

        {/* Filter Bar */}
        <FilterBar
          location={location}
          onLocationChange={handleLocationChange}
          experienceLevel={experienceLevel}
          onExperienceLevelChange={handleLevelChange}
          jobType={jobType}
          onJobTypeChange={handleTypeChange}
          isRemote={isRemote}
          onRemoteChange={handleRemoteChange}
          onClearFilters={handleClearFilters}
          availableLocations={jobsData?.locations || []}
          availableTypes={jobsData?.jobTypes || []}
          availableLevels={jobsData?.experienceLevels || []}
          activeFilterCount={activeFilterCount}
        />

        {/* Active Filters / Results Summary Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-[#64748B] pt-2">
          <div>
            {!loading && (
              <span>
                Showing <strong className="text-[#0F172A]">{displayedJobs.length}</strong> of{' '}
                <strong className="text-[#0F172A]">{showOnlySaved ? savedJobIds.length : jobsData?.total || 0}</strong>{' '}
                {showOnlySaved ? 'saved roles' : 'opportunities'}
                {search && (
                  <span>
                    {' '}
                    matching &ldquo;<span className="text-[#0F172A]">{search}</span>&rdquo;
                  </span>
                )}
              </span>
            )}
          </div>

          {hasProfile && !loading && (
            <div className="flex items-center gap-1.5 text-xs text-[#065F46] bg-[#D1FAE5] px-3 py-1 rounded-full font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Match scores calculated from your active profile</span>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : displayedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedJobs.map((job: ClientJob) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="seedling"
            title={showOnlySaved ? 'No saved jobs yet' : 'No jobs found'}
            description={
              showOnlySaved
                ? 'Bookmark jobs you are interested in using the bookmark icon on any card to save them here for later.'
                : 'Try adjusting your search terms, removing filters, or clearing your search to see more opportunities.'
            }
            actionLabel={showOnlySaved ? 'Browse all jobs' : 'Clear filters'}
            onAction={showOnlySaved ? () => updateUrlParams({ saved: false }) : handleClearFilters}
          />
        )}

        {/* Pagination Controls */}
        {!loading && jobsData && jobsData.totalPages > 1 && !showOnlySaved && (
          <div className="flex items-center justify-center gap-2 pt-8 pb-4">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-[#FAFBFC] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: jobsData.totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isCurrent = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-xl text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-[#10B981] text-white shadow-xs'
                      : 'bg-white border border-[#E5E7EB] text-[#64748B] hover:text-[#0F172A] hover:bg-[#FAFBFC]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage >= jobsData.totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-[#FAFBFC] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
