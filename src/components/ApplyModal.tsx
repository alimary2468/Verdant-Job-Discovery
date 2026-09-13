import React, { useState } from 'react';
import { X, Send, CheckCircle2, Building, MapPin, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ClientJob } from '../utils/matcherClient';
import { submitApplication } from '../utils/api';
import { useProfile } from '../context/ProfileContext';

interface ApplyModalProps {
  job: ClientJob;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ job, isOpen, onClose }) => {
  const { profile, markJobApplied } = useProfile();

  const [fullName, setFullName] = useState(profile?.name || '');
  const [email, setEmail] = useState('');
  const [coverLetter, setCoverLetter] = useState(
    profile
      ? `Dear Hiring Team at ${job.company},\n\nI am excited to submit my application for the ${job.title} position. With my background in ${profile.skills.slice(0, 3).join(', ')} and my focus on ${profile.preferred_field || 'technology'}, I am confident in contributing effectively to your team.\n\nThank you for considering my application.`
      : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'Full name is required (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!coverLetter.trim() || coverLetter.trim().length < 15) {
      errs.coverLetter = 'Cover letter must be at least 15 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await submitApplication({
        job_id: job.id,
        name: fullName.trim(),
        email: email.trim(),
        cover_letter: coverLetter.trim(),
      });

      markJobApplied(job.id);
      toast.success(res.message || 'Application submitted successfully!', {
        duration: 4000,
        style: {
          borderRadius: '16px',
          background: '#FFFFFF',
          color: '#0F172A',
          border: '1px solid #A7F3D0',
          boxShadow: '0 4px 16px rgba(16,185,129,0.12)',
        },
      });

      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5E7EB] relative animate-scaleUp overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#D1FAE5] text-[#065F46] mb-1.5">
              <Send className="w-3 h-3 text-[#10B981]" />
              <span>Fast Track Application</span>
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] leading-tight">
              Apply to {job.company}
            </h2>
            <p className="text-sm font-medium text-[#64748B] flex items-center gap-2 mt-1">
              <span className="text-[#0F172A]">{job.title}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#10B981]" />
                {job.location}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#FAFBFC] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 overflow-y-auto flex-1 pr-1">
          {/* Full Name */}
          <div>
            <label htmlFor="apply-name" className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              id="apply-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#0F172A] bg-[#FAFBFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all ${
                errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-[#E5E7EB]'
              }`}
            />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="apply-email" className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              id="apply-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#0F172A] bg-[#FAFBFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all ${
                errors.email ? 'border-red-400 bg-red-50/20' : 'border-[#E5E7EB]'
              }`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Cover Letter / Note */}
          <div>
            <label htmlFor="apply-cover-letter" className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
              Brief Cover Note *
            </label>
            <textarea
              id="apply-cover-letter"
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Describe your background and why you are interested in this position..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#0F172A] bg-[#FAFBFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all ${
                errors.coverLetter ? 'border-red-400 bg-red-50/20' : 'border-[#E5E7EB]'
              }`}
            />
            {errors.coverLetter && <p className="text-xs text-red-500 mt-1">{errors.coverLetter}</p>}
          </div>

          {/* Security & Submission Note */}
          <p className="text-[11px] text-[#94A3B8] leading-relaxed">
            Your application will be saved directly to the employer's review queue. We will never share your personal information.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-[#FAFBFC] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              id="apply-modal-submit-btn"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#10B981] text-white text-xs font-semibold hover:bg-[#059669] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-verdant disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
