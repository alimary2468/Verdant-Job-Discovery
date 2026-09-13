import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] border-l-4 border-l-[#D1FAE5] shadow-xs space-y-4 animate-pulse">
      {/* Top company avatar + save button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#E6FDF2] animate-shimmer-mint" />
          <div className="space-y-1.5">
            <div className="w-24 h-3.5 bg-slate-200 rounded-md" />
            <div className="w-32 h-2.5 bg-slate-100 rounded-md" />
          </div>
        </div>
        <div className="w-8 h-8 rounded-xl bg-slate-100" />
      </div>

      {/* Match pill placeholder */}
      <div className="w-20 h-5 bg-[#D1FAE5]/60 rounded-full" />

      {/* Job title */}
      <div className="space-y-2">
        <div className="w-3/4 h-5 bg-slate-200 rounded-md" />
        <div className="w-1/2 h-4 bg-slate-100 rounded-md" />
      </div>

      {/* Meta badges */}
      <div className="flex gap-2">
        <div className="w-16 h-5 bg-slate-100 rounded-full" />
        <div className="w-20 h-5 bg-slate-100 rounded-full" />
      </div>

      {/* Skill tags */}
      <div className="flex flex-wrap gap-1.5 pt-2">
        <div className="w-14 h-5 bg-[#E6FDF2] rounded-full" />
        <div className="w-16 h-5 bg-[#FEF3C7] rounded-full" />
        <div className="w-12 h-5 bg-[#FED7AA]/50 rounded-full" />
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="w-16 h-3 bg-slate-100 rounded" />
        <div className="w-20 h-3 bg-emerald-100 rounded" />
      </div>
    </div>
  );
};
