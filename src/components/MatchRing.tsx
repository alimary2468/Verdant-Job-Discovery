import React from 'react';

interface MatchRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const MatchRing: React.FC<MatchRingProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Determine color scheme based on match quality
  let strokeColor = '#10B981'; // Primary Green
  let trackColor = '#D1FAE5'; // Soft Mint
  let textColor = '#065F46';
  let badgeLabel = 'Strong Match';

  if (clampedScore < 40) {
    strokeColor = '#94A3B8'; // Slate 400
    trackColor = '#E2E8F0'; // Slate 200
    textColor = '#475569';
    badgeLabel = 'Low Match';
  } else if (clampedScore < 70) {
    strokeColor = '#F97316'; // Orange / Peach tone
    trackColor = '#FED7AA'; // Soft Peach
    textColor = '#9A3412';
    badgeLabel = 'Good Match';
  }

  // Dimensions
  const dims = {
    sm: { size: 48, strokeWidth: 4, textClass: 'text-xs font-bold', subText: 'text-[9px]' },
    md: { size: 68, strokeWidth: 5.5, textClass: 'text-sm font-bold', subText: 'text-[10px]' },
    lg: { size: 96, strokeWidth: 7.5, textClass: 'text-2xl font-bold', subText: 'text-xs' },
  }[size];

  const radius = (dims.size - dims.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative flex items-center justify-center" style={{ width: dims.size, height: dims.size }}>
        <svg
          className="transform -rotate-90"
          width={dims.size}
          height={dims.size}
        >
          {/* Background Track */}
          <circle
            cx={dims.size / 2}
            cy={dims.size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={dims.strokeWidth}
            fill="transparent"
          />
          {/* Animated Value Stroke */}
          <circle
            cx={dims.size / 2}
            cy={dims.size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={dims.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`${dims.textClass}`} style={{ color: textColor }}>
            {clampedScore}%
          </span>
          {showLabel && size !== 'sm' && (
            <span className={`${dims.subText} font-medium leading-none`} style={{ color: textColor }}>
              Match
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
