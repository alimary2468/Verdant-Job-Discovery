import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loader: React.FC<LoaderProps> = ({ message = 'Loading opportunities...', size = 'md' }) => {
  const dim = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-14 h-14 border-4',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className={`${dim} rounded-full border-[#D1FAE5] border-t-[#10B981] animate-spin`} />
        <Sparkles className="absolute w-4 h-4 text-[#10B981] animate-pulse" />
      </div>
      {message && <p className="text-xs sm:text-sm font-medium text-[#64748B]">{message}</p>}
    </div>
  );
};
