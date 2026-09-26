import React, { useState, useEffect } from 'react';
import { ThumbsUp, Lightbulb, Bookmark, Share2, Check, Printer } from 'lucide-react';
import { ArticleReactionsState } from '../types';

interface ArticleReactionsProps {
  articleId: string;
  title: string;
  url: string;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const ArticleReactions: React.FC<ArticleReactionsProps> = ({
  articleId,
  title,
  url,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [reactions, setReactions] = useState<ArticleReactionsState>({
    helpful: 42,
    insightful: 28,
    saved: 19,
    userReacted: {},
  });
  const [copiedShare, setCopiedShare] = useState(false);

  // Load reactions from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`stackpipeline_reactions_${articleId}`);
      if (stored) {
        setReactions(JSON.parse(stored));
      } else {
        // Deterministic pseudo-random seed based on articleId string length
        const baseHelpful = 30 + (articleId.length % 25);
        const baseInsightful = 18 + (articleId.length % 15);
        const baseSaved = 12 + (articleId.length % 10);
        setReactions({
          helpful: baseHelpful,
          insightful: baseInsightful,
          saved: baseSaved,
          userReacted: {},
        });
      }
    } catch {
      // ignore
    }
  }, [articleId]);

  const handleReact = (type: 'helpful' | 'insightful') => {
    setReactions((prev) => {
      const already = prev.userReacted?.[type];
      const delta = already ? -1 : 1;
      const updated: ArticleReactionsState = {
        ...prev,
        [type]: Math.max(0, prev[type] + delta),
        userReacted: {
          ...prev.userReacted,
          [type]: !already,
        },
      };
      try {
        localStorage.setItem(`stackpipeline_reactions_${articleId}`, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out this technical pipeline guide on StackPipeline: ${title}`,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-4 my-6 border-y border-slate-800/80 bg-slate-900/30 px-4 rounded-xl">
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 font-mono uppercase text-[11px] mr-1">Feedback:</span>

        {/* Helpful */}
        <button
          onClick={() => handleReact('helpful')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            reactions.userReacted?.helpful
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/10'
              : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:text-white'
          }`}
          title="Mark this guide as helpful"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>Helpful</span>
          <span className="text-slate-400 font-mono text-[10px] ml-0.5">({reactions.helpful})</span>
        </button>

        {/* Insightful */}
        <button
          onClick={() => handleReact('insightful')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            reactions.userReacted?.insightful
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm shadow-amber-500/10'
              : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:text-white'
          }`}
          title="Mark this architecture breakdown as insightful"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Insightful</span>
          <span className="text-slate-400 font-mono text-[10px] ml-0.5">({reactions.insightful})</span>
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs">
        {/* Bookmark */}
        <button
          onClick={onToggleBookmark}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            isBookmarked
              ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
              : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:text-white'
          }`}
          title={isBookmarked ? 'Article bookmarked in your library' : 'Save article to your reading library'}
        >
          <Bookmark className="w-3.5 h-3.5 fill-current" />
          <span>{isBookmarked ? 'Saved in Library' : 'Save Article'}</span>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:text-white text-xs font-medium transition-colors"
          title="Share or copy article link"
        >
          {copiedShare ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </>
          )}
        </button>

        {/* Print / Clean View */}
        <button
          onClick={handlePrint}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200 text-xs transition-colors"
          title="Print or export clean PDF"
        >
          <Printer className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
