import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Briefcase, Compass } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] border border-[#6EE7B7] flex items-center justify-center shadow-xs mb-6">
        <Compass className="w-10 h-10 text-[#059669]" />
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-[#10B981] mb-2">
        Page Not Found (404)
      </span>

      <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] mb-3">
        Looking for a path that hasn't grown yet?
      </h1>

      <p className="text-sm text-[#64748B] leading-relaxed mb-8">
        The page or job role you are looking for doesn't exist or has moved. Let's get you back on track to exploring opportunities.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#10B981] text-white text-xs sm:text-sm font-semibold hover:bg-[#059669] shadow-verdant transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#E5E7EB] bg-white text-xs sm:text-sm font-semibold text-[#0F172A] hover:bg-[#FAFBFC] transition-all"
        >
          <Briefcase className="w-4 h-4 text-[#10B981]" />
          <span>Explore Jobs</span>
        </Link>
      </div>
    </div>
  );
};
