import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../utils/matcherClient';

interface ProfileContextType {
  profile: UserProfile | null;
  saveProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => boolean; // returns true if now saved, false if unsaved
  isJobSaved: (jobId: string) => boolean;
  appliedJobIds: string[];
  markJobApplied: (jobId: string) => void;
  isJobApplied: (jobId: string) => boolean;
  hasProfile: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const PROFILE_STORAGE_KEY = 'verdant_user_profile_v1';
const SAVED_JOBS_KEY = 'verdant_saved_jobs_v1';
const APPLIED_JOBS_KEY = 'verdant_applied_jobs_v1';

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.skills)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read user profile from localStorage', e);
    }
    // Default initial demonstration profile for student convenience if empty or null
    return null;
  });

  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_JOBS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [appliedJobIds, setAppliedJobIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(APPLIED_JOBS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save profile to state & localStorage
  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
    } catch (e) {
      console.error('Error saving profile to localStorage', e);
    }
  };

  const clearProfile = () => {
    setProfile(null);
    try {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing profile from localStorage', e);
    }
  };

  const toggleSaveJob = (jobId: string): boolean => {
    let nextSaved: string[];
    let wasSaved = savedJobIds.includes(jobId);
    if (wasSaved) {
      nextSaved = savedJobIds.filter(id => id !== jobId);
    } else {
      nextSaved = [...savedJobIds, jobId];
    }
    setSavedJobIds(nextSaved);
    try {
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(nextSaved));
    } catch (e) {
      console.error('Error updating saved jobs', e);
    }
    return !wasSaved;
  };

  const isJobSaved = (jobId: string): boolean => {
    return savedJobIds.includes(jobId);
  };

  const markJobApplied = (jobId: string) => {
    if (!appliedJobIds.includes(jobId)) {
      const next = [...appliedJobIds, jobId];
      setAppliedJobIds(next);
      try {
        localStorage.setItem(APPLIED_JOBS_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Error saving applied job state', e);
      }
    }
  };

  const isJobApplied = (jobId: string): boolean => {
    return appliedJobIds.includes(jobId);
  };

  const hasProfile = Boolean(profile && profile.skills && profile.skills.length > 0);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        saveProfile,
        clearProfile,
        savedJobIds,
        toggleSaveJob,
        isJobSaved,
        appliedJobIds,
        markJobApplied,
        isJobApplied,
        hasProfile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export function useProfile(): ProfileContextType {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
