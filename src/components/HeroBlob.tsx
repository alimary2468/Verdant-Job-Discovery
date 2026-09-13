import React from 'react';

export const HeroBlob: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      {/* Soft organic gradient blob 1 - Top Left mint to sage */}
      <div
        className="absolute -top-24 -left-20 w-[480px] h-[480px] rounded-full blur-3xl opacity-70"
        style={{
          background: 'radial-gradient(circle, #D1FAE5 0%, #A7F3D0 50%, rgba(209, 250, 229, 0) 75%)',
        }}
      />

      {/* Soft organic gradient blob 2 - Top Right cream to peach */}
      <div
        className="absolute top-10 -right-20 w-[420px] h-[420px] rounded-full blur-3xl opacity-60"
        style={{
          background: 'radial-gradient(circle, #FEF3C7 0%, #FED7AA 50%, rgba(254, 243, 199, 0) 75%)',
        }}
      />

      {/* Soft organic gradient blob 3 - Center subtle green glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-[100px] blur-3xl opacity-45"
        style={{
          background: 'radial-gradient(ellipse, #D1FAE5 0%, #A7F3D0 40%, rgba(254, 243, 199, 0.3) 70%, transparent 100%)',
        }}
      />
    </div>
  );
};
