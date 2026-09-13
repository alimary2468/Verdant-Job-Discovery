import React, { useState } from 'react';
import { Filter, X, RotateCcw, Check, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  location: string;
  onLocationChange: (loc: string) => void;
  experienceLevel: string;
  onExperienceLevelChange: (level: string) => void;
  jobType: string;
  onJobTypeChange: (type: string) => void;
  isRemote: string; // 'all' | 'true' | 'false'
  onRemoteChange: (remote: string) => void;
  onClearFilters: () => void;
  availableLocations?: string[];
  availableTypes?: string[];
  availableLevels?: string[];
  activeFilterCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  location,
  onLocationChange,
  experienceLevel,
  onExperienceLevelChange,
  jobType,
  onJobTypeChange,
  isRemote,
  onRemoteChange,
  onClearFilters,
  availableLocations = [],
  availableTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'],
  availableLevels = ['Intern', 'Entry', 'Mid', 'Senior'],
  activeFilterCount,
}) => {
  const [mobileModalOpen, setMobileModalOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Desktop Filter Bar (Horizontal) */}
      <div className="hidden lg:flex items-center flex-wrap gap-3 bg-white p-3 rounded-2xl border border-[#E5E7EB] shadow-xs">
        {/* Location Dropdown */}
        <div className="relative min-w-[180px]">
          <label htmlFor="filter-location-select" className="sr-only">Filter by Location</label>
          <select
            id="filter-location-select"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className={`w-full appearance-none pl-3.5 pr-8 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#10B981] ${
              location && location !== 'all'
                ? 'bg-[#D1FAE5]/60 border-[#10B981] text-[#065F46] font-semibold'
                : 'bg-[#FAFBFC] border-[#E5E7EB] text-[#0F172A] hover:border-[#CBD5E1]'
            }`}
          >
            <option value="all">📍 All Locations</option>
            {availableLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
        </div>

        {/* Experience Level Dropdown */}
        <div className="relative min-w-[160px]">
          <label htmlFor="filter-level-select" className="sr-only">Filter by Experience Level</label>
          <select
            id="filter-level-select"
            value={experienceLevel}
            onChange={(e) => onExperienceLevelChange(e.target.value)}
            className={`w-full appearance-none pl-3.5 pr-8 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#10B981] ${
              experienceLevel && experienceLevel !== 'all'
                ? 'bg-[#D1FAE5]/60 border-[#10B981] text-[#065F46] font-semibold'
                : 'bg-[#FAFBFC] border-[#E5E7EB] text-[#0F172A] hover:border-[#CBD5E1]'
            }`}
          >
            <option value="all">🎓 All Experience</option>
            {availableLevels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl} Level
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
        </div>

        {/* Job Type Dropdown */}
        <div className="relative min-w-[160px]">
          <label htmlFor="filter-type-select" className="sr-only">Filter by Job Type</label>
          <select
            id="filter-type-select"
            value={jobType}
            onChange={(e) => onJobTypeChange(e.target.value)}
            className={`w-full appearance-none pl-3.5 pr-8 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#10B981] ${
              jobType && jobType !== 'all'
                ? 'bg-[#D1FAE5]/60 border-[#10B981] text-[#065F46] font-semibold'
                : 'bg-[#FAFBFC] border-[#E5E7EB] text-[#0F172A] hover:border-[#CBD5E1]'
            }`}
          >
            <option value="all">💼 All Job Types</option>
            {availableTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
        </div>

        {/* Remote Toggle Pill */}
        <button
          type="button"
          id="filter-remote-toggle"
          onClick={() => onRemoteChange(isRemote === 'true' ? 'all' : 'true')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
            isRemote === 'true'
              ? 'bg-[#D1FAE5] border-[#10B981] text-[#065F46] font-semibold'
              : 'bg-[#FAFBFC] border-[#E5E7EB] text-[#64748B] hover:border-[#CBD5E1] hover:text-[#0F172A]'
          }`}
        >
          <span className="text-sm">🌐</span>
          <span>Remote Only</span>
          {isRemote === 'true' && <Check className="w-3.5 h-3.5 text-[#10B981]" />}
        </button>

        {/* Clear Filters Button */}
        {activeFilterCount > 0 && (
          <button
            type="button"
            id="clear-filters-btn"
            onClick={onClearFilters}
            className="ml-auto flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#EF4444] hover:text-[#B91C1C] hover:bg-[#FEF2F2] rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear filters ({activeFilterCount})</span>
          </button>
        )}
      </div>

      {/* Mobile / Tablet Filter Bar trigger */}
      <div className="flex lg:hidden items-center justify-between gap-3">
        <button
          type="button"
          id="mobile-filters-trigger"
          onClick={() => setMobileModalOpen(true)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            activeFilterCount > 0
              ? 'bg-[#D1FAE5] border-[#10B981] text-[#065F46]'
              : 'bg-white border-[#E5E7EB] text-[#0F172A]'
          }`}
        >
          <Filter className="w-4 h-4 text-[#10B981]" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#10B981] text-white text-xs font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-semibold text-[#EF4444] flex items-center gap-1 hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear ({activeFilterCount})</span>
          </button>
        )}
      </div>

      {/* Mobile Slide-Up Filter Modal / Bottom Sheet */}
      {mobileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-xl max-h-[85vh] overflow-y-auto p-6 space-y-6 animate-slideUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-base font-bold text-[#0F172A]">Filter Opportunities</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileModalOpen(false)}
                className="p-1.5 rounded-full text-[#64748B] hover:bg-[#FAFBFC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#E5E7EB] bg-[#FAFBFC]"
              >
                <option value="all">📍 All Locations</option>
                {availableLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Experience Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['all', ...availableLevels].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => onExperienceLevelChange(lvl)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      (experienceLevel || 'all') === lvl
                        ? 'bg-[#D1FAE5] border-[#10B981] text-[#065F46]'
                        : 'bg-[#FAFBFC] border-[#E5E7EB] text-[#64748B]'
                    }`}
                  >
                    {lvl === 'all' ? 'All Experience' : lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => onJobTypeChange(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#E5E7EB] bg-[#FAFBFC]"
              >
                <option value="all">💼 All Job Types</option>
                {availableTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Remote */}
            <div className="pt-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] bg-[#FAFBFC] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRemote === 'true'}
                  onChange={(e) => onRemoteChange(e.target.checked ? 'true' : 'all')}
                  className="w-4 h-4 rounded text-[#10B981] focus:ring-[#10B981]"
                />
                <span className="text-sm font-medium text-[#0F172A]">🌐 Remote positions only</span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#E5E7EB]">
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onClearFilters();
                    setMobileModalOpen(false);
                  }}
                  className="flex-1 py-3 rounded-full border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-[#FAFBFC]"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={() => setMobileModalOpen(false)}
                className="flex-1 py-3 rounded-full bg-[#10B981] text-white text-xs font-semibold hover:bg-[#059669]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
