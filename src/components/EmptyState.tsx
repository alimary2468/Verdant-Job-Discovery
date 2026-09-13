import React from 'react';
import { Sparkles, Briefcase, Search, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'search' | 'sparkles' | 'briefcase' | 'alert' | string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'sparkles',
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  const renderIcon = () => {
    if (icon === 'search') return <Search className="w-8 h-8 text-[#10B981]" />;
    if (icon === 'briefcase') return <Briefcase className="w-8 h-8 text-[#10B981]" />;
    if (icon === 'alert') return <AlertCircle className="w-8 h-8 text-[#10B981]" />;
    return <Sparkles className="w-8 h-8 text-[#10B981]" />;
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
      {/* Icon badge */}
      <div className="w-16 h-16 rounded-3xl bg-[#D1FAE5] border border-[#A7F3D0] flex items-center justify-center shadow-xs mb-5 select-none">
        {renderIcon()}
      </div>

      <h3 className="text-xl font-bold text-[#0F172A] tracking-tight mb-2">
        {title}
      </h3>

      <p className="text-sm text-[#64748B] leading-relaxed mb-6">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="px-6 py-2.5 rounded-full bg-[#10B981] text-white text-xs sm:text-sm font-semibold hover:bg-[#059669] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-verdant"
          >
            {actionLabel}
          </button>
        )}

        {secondaryActionLabel && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="px-5 py-2.5 rounded-full border border-[#E5E7EB] bg-white text-xs sm:text-sm font-semibold text-[#0F172A] hover:bg-[#FAFBFC] transition-colors"
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
