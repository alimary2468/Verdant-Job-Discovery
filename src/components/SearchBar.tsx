import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  initialValue?: string;
  placeholder?: string;
  onSearch?: (value: string) => void;
  onSubmit?: (value: string) => void;
  size?: 'normal' | 'large';
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = '',
  placeholder = 'Search jobs, skills, companies, locations...',
  onSearch,
  onSubmit,
  size = 'normal',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(query.trim());
    } else if (onSearch) {
      onSearch(query.trim());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearch && !onSubmit) {
      onSearch(val);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
    if (onSubmit) onSubmit('');
  };

  const isLarge = size === 'large';

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full flex items-center transition-all ${
        isLarge
          ? 'bg-white rounded-full shadow-verdant hover:shadow-verdant-hover border border-[#E5E7EB] p-1.5 sm:p-2'
          : 'bg-white rounded-xl shadow-xs border border-[#E5E7EB] p-1'
      }`}
    >
      <div className={`flex items-center pl-3 sm:pl-4 text-[#64748B]`}>
        <Search className={`${isLarge ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-4 h-4'} text-[#10B981]`} />
      </div>

      <input
        type="text"
        id="search-input"
        value={query}
        onChange={handleChange}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className={`w-full bg-transparent px-3 text-[#0F172A] placeholder-[#94A3B8] focus:outline-none ${
          isLarge ? 'py-3 text-base sm:text-lg' : 'py-2 text-sm'
        }`}
      />

      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="p-1.5 rounded-full text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#FAFBFC] mr-1 focus:outline-none"
          aria-label="Clear search input"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <button
        type="submit"
        id="search-submit-btn"
        className={`flex items-center justify-center rounded-full bg-[#10B981] text-white font-medium hover:bg-[#059669] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shrink-0 ${
          isLarge
            ? 'px-5 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base'
            : 'px-4 py-2 text-xs sm:text-sm'
        }`}
      >
        <span>Search</span>
        {isLarge && <ArrowRight className="w-4 h-4 ml-1.5 hidden sm:inline-block" />}
      </button>
    </form>
  );
};
