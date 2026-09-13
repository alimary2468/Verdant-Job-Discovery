import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, User, Briefcase, Home as HomeIcon, Bookmark } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { hasProfile, profile, savedJobIds } = useProfile();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Jobs', path: '/jobs', icon: Briefcase },
    {
      name: 'Recommendations',
      path: '/recommendations',
      icon: Sparkles,
      badge: hasProfile ? 'AI' : undefined
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
      indicator: hasProfile
    },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-[#E5E7EB] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          id="navbar-logo"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] rounded-lg p-1"
          onClick={closeMobileMenu}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-[#0F172A] flex items-center gap-1">
              Verdant
            </span>
            <span className="text-[10px] tracking-wide text-[#64748B] font-medium -mt-1 hidden sm:inline-block">
              Grow into your next role
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                id={`nav-link-${link.name.toLowerCase()}`}
                className={({ isActive }) => `
                  relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
                  ${isActive
                    ? 'bg-[#D1FAE5] text-[#065F46] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#FAFBFC]'
                  }
                `}
              >
                <Icon className="w-4 h-4 opacity-75" />
                <span>{link.name}</span>
                {link.badge && (
                  <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold tracking-wider rounded-full bg-[#10B981] text-white">
                    {link.badge}
                  </span>
                )}
                {link.indicator && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block" title="Profile active" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Action Controls on right */}
        <div className="hidden md:flex items-center gap-3">
          {savedJobIds.length > 0 && (
            <Link
              to="/jobs?saved=true"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#FAFBFC] border border-[#E5E7EB] text-[#64748B] hover:text-[#065F46] hover:border-[#A7F3D0] transition-colors"
              title="View Saved Jobs"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#10B981] fill-[#10B981]" />
              <span>{savedJobIds.length} Saved</span>
            </Link>
          )}

          {hasProfile ? (
            <Link
              to="/recommendations"
              id="navbar-cta-recommendations"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981] text-white text-sm font-semibold hover:bg-[#059669] hover:scale-[1.02] shadow-xs transition-all duration-200"
            >
              <Sparkles className="w-4 h-4" />
              <span>Matches for {profile?.name ? profile.name.split(' ')[0] : 'You'}</span>
            </Link>
          ) : (
            <Link
              to="/profile"
              id="navbar-cta-profile"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981] text-white text-sm font-semibold hover:bg-[#059669] hover:scale-[1.02] shadow-xs transition-all duration-200"
            >
              <span>Build Profile</span>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {savedJobIds.length > 0 && (
            <Link
              to="/jobs?saved=true"
              className="p-2 rounded-full text-[#64748B] hover:text-[#10B981] hover:bg-[#FAFBFC]"
              aria-label="View saved jobs"
            >
              <Bookmark className="w-5 h-5 fill-[#10B981] text-[#10B981]" />
            </Link>
          )}

          <button
            type="button"
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#FAFBFC] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#0F172A]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E7EB] bg-white px-4 pt-3 pb-5 shadow-lg space-y-1.5 animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-[#D1FAE5] text-[#065F46]'
                    : 'text-[#64748B] hover:bg-[#FAFBFC] hover:text-[#0F172A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 opacity-80" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#10B981] text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-[#E5E7EB] mt-2">
            {hasProfile ? (
              <Link
                to="/recommendations"
                onClick={closeMobileMenu}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#10B981] text-white text-sm font-semibold hover:bg-[#059669]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Matches for {profile?.name || 'You'}</span>
              </Link>
            ) : (
              <Link
                to="/profile"
                onClick={closeMobileMenu}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#10B981] text-white text-sm font-semibold hover:bg-[#059669]"
              >
                <span>Build Profile</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
