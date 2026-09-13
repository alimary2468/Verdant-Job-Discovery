import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#E5E7EB] bg-white/60 backdrop-blur-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#0F172A]">Verdant</span>
            </div>
            <p className="text-sm text-[#64748B] max-w-sm">
              Grow into your next role. AI-powered job discovery comparing your skills, experience, and career aspirations with real LinkedIn job opportunities.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                Live Job Dataset Active
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0F172A]">Platform</h4>
            <ul className="space-y-2 text-sm text-[#64748B]">
              <li>
                <Link to="/" className="hover:text-[#10B981] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-[#10B981] transition-colors">
                  Explore Jobs
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="hover:text-[#10B981] transition-colors">
                  AI Recommendations
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-[#10B981] transition-colors">
                  Career Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Methodology */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0F172A]">Matching Engine</h4>
            <ul className="space-y-1.5 text-xs text-[#64748B]">
              <li className="flex items-center justify-between">
                <span>Skill Match (Synonyms + TF-IDF)</span>
                <span className="font-semibold text-[#0F172A]">60%</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Experience Alignment</span>
                <span className="font-semibold text-[#0F172A]">20%</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Field Specialization</span>
                <span className="font-semibold text-[#0F172A]">20%</span>
              </li>
              <li className="pt-2 text-[11px] text-[#94A3B8]">
                Pure client & server JavaScript cosine similarity.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© {new Date().getFullYear()} Verdant. University Software Engineering Portfolio Project.</p>
          <p className="flex items-center gap-1">
            Built with React, Express & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
};
