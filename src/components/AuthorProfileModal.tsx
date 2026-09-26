import React from 'react';
import { X, ShieldCheck, Award, BookOpen, ExternalLink, Linkedin, Github, CheckCircle2 } from 'lucide-react';
import { AuthorProfile } from '../types';

interface AuthorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  author: AuthorProfile | null;
}

export const AuthorProfileModal: React.FC<AuthorProfileModalProps> = ({
  isOpen,
  onClose,
  author,
}) => {
  if (!isOpen || !author) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-6">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-16 h-16 rounded-2xl border-2 border-emerald-500/30 object-cover shadow-lg"
          />
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-emerald-400 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Technical Editorial Board</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">{author.name}</h3>
            <p className="text-xs text-slate-300 font-medium">{author.role}</p>
            <p className="text-xs text-slate-400">{author.company}</p>
          </div>
        </div>

        {/* Credentials & Stats */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 mb-5 text-center">
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400">Articles & Peer Reviews</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">
              {author.articlesReviewed}+ Guides
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400">Domain Authority</div>
            <div className="text-xl font-bold text-white mt-0.5">
              Distributed Systems
            </div>
          </div>
        </div>

        {/* Credentials badge */}
        <div className="mb-4">
          <div className="text-[11px] font-mono uppercase text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Verified Credentials</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 text-xs text-slate-200 font-mono">
            {author.credentials}
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <div className="text-[11px] font-mono uppercase text-slate-400 mb-1.5 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Engineering Background</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {author.bio}
          </p>
        </div>

        {/* Links & Verification Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {author.linkedInUrl && (
              <a
                href={author.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-sky-400" />
                <span>LinkedIn</span>
              </a>
            )}
            {author.githubUrl && (
              <a
                href={author.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Github className="w-4 h-4 text-slate-300" />
                <span>GitHub</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
