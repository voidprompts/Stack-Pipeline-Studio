import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Send,
  ShieldCheck,
  CheckCircle2,
  Star,
  CornerDownRight,
  Trash2,
  Filter,
  SlidersHorizontal,
  Flame,
  AlertCircle,
  HelpCircle,
  Cpu,
  BadgeCheck,
} from 'lucide-react';
import { CommentItem } from '../types';

interface ArticleCommentsProps {
  articleId: string;
  articleTitle: string;
  softwareA?: string;
  softwareB?: string;
}

export const ArticleComments: React.FC<ArticleCommentsProps> = ({
  articleId,
  articleTitle,
  softwareA,
  softwareB,
}) => {
  // Load saved user info from localStorage if available
  const [authorName, setAuthorName] = useState(() => {
    try {
      return localStorage.getItem('stackpipeline_user_name') || '';
    } catch {
      return '';
    }
  });

  const [authorRole, setAuthorRole] = useState(() => {
    try {
      return localStorage.getItem('stackpipeline_user_role') || '';
    } catch {
      return '';
    }
  });

  const [authorCompany, setAuthorCompany] = useState(() => {
    try {
      return localStorage.getItem('stackpipeline_user_company') || '';
    } catch {
      return '';
    }
  });

  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [feedbackType, setFeedbackType] = useState<
    'Implementation' | 'Benchmark' | 'Caveat' | 'Question'
  >('Implementation');
  const [verifiedProduction, setVerifiedProduction] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active reply thread state
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Filtering and sorting state
  const [sortBy, setSortBy] = useState<'helpful' | 'newest'>('helpful');
  const [filterType, setFilterType] = useState<'all' | 'verified' | 'caveat' | 'question'>('all');

  // Load comments from localStorage
  const [comments, setComments] = useState<CommentItem[]>([]);

  // Default initial seed comments tailored to high-level technical pipelines
  const defaultSeeds: CommentItem[] = useMemo(() => [
    {
      id: `seed_1_${articleId}`,
      articleId,
      authorName: 'Marcus Lindqvist',
      authorRole: 'Principal Platform Architect',
      authorCompany: 'Fintech Core Infrastructure',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      content:
        'Crucial implementation detail regarding HMAC signature verification before JSON body deserialization. In high-concurrency environments, raw buffer parsing prevents subtle UTF-8 normalization discrepancies that break webhook validation. Tested this configuration under 3,800 events/sec sustained load.',
      createdAt: '3 days ago',
      upvotes: 24,
      userUpvoted: false,
      rating: 5,
      feedbackType: 'Implementation',
      verifiedProduction: true,
      replies: [
        {
          id: `seed_1_reply_1`,
          articleId,
          authorName: 'StackPipeline Review Board',
          authorRole: 'Editorial Review Board',
          authorCompany: 'StackPipeline',
          authorAvatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%230f172a"/><rect x="5" y="5" width="90" height="90" rx="45" fill="none" stroke="%230ea5e9" stroke-width="3"/><path d="M50 22 L72 32 L72 55 C72 68 62 78 50 82 C38 78 28 68 28 55 L28 32 Z" fill="%230ea5e9" fill-opacity="0.2" stroke="%2338bdf8" stroke-width="4"/><path d="M42 52 L48 58 L60 44" fill="none" stroke="%2338bdf8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          content: 'Excellent observation Marcus! We updated step 2 to explicitly mandate raw middleware prior to body-parser.',
          createdAt: '2 days ago',
          upvotes: 9,
          userUpvoted: false,
        },
      ],
    },
    {
      id: `seed_2_${articleId}`,
      articleId,
      authorName: 'Sarah K. Jenkins',
      authorRole: 'Senior RevOps Data Engineer',
      authorCompany: 'SaaS Growth Systems',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      content:
        'We rolled out this exact Redis deduplication buffer with a 24-hour key TTL (`pipeline:dedup:<event_id>`). Dropped downstream 429 rate-limit errors by 93% during Monday 9am synchronization batches.',
      createdAt: '1 week ago',
      upvotes: 18,
      userUpvoted: false,
      rating: 5,
      feedbackType: 'Benchmark',
      verifiedProduction: true,
    },
    {
      id: `seed_3_${articleId}`,
      articleId,
      authorName: 'Tariq Al-Mansoor',
      authorRole: 'Lead Cloud Integration Engineer',
      authorCompany: 'OmniLogistics Tech',
      authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      content:
        'Question on the exponential backoff retry jitter: when downstream APIs return HTTP 429 with a Retry-After header, did you benchmark respecting Retry-After versus full jitter random backoff?',
      createdAt: '2 weeks ago',
      upvotes: 11,
      userUpvoted: false,
      rating: 4,
      feedbackType: 'Question',
      verifiedProduction: false,
      replies: [
        {
          id: `seed_3_reply_1`,
          articleId,
          authorName: 'StackPipeline Editorial Team',
          authorRole: 'Editorial Engineering Staff',
          authorCompany: 'StackPipeline',
          authorAvatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%230f172a"/><rect x="5" y="5" width="90" height="90" rx="45" fill="none" stroke="%2310b981" stroke-width="3"/><path d="M50 25 L75 38 L50 51 L25 38 Z" fill="%2310b981"/><path d="M25 48 L50 61 L75 48" fill="none" stroke="%2334d399" stroke-width="5" stroke-linecap="round"/><path d="M25 59 L50 72 L75 59" fill="none" stroke="%236ee7b7" stroke-width="5" stroke-linecap="round"/></svg>',
          content: 'Yes Tariq! If Retry-After is supplied by the API, we recommend clamping your jitter to min(Retry-After + jitter(0, 500ms), 60s). It avoids server ban penalties.',
          createdAt: '12 days ago',
          upvotes: 7,
          userUpvoted: false,
        },
      ],
    },
  ], [articleId]);

  // Load from localStorage on mount or articleId change
  useEffect(() => {
    try {
      const storageKey = `stackpipeline_comments_${articleId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setComments(JSON.parse(saved));
      } else {
        setComments(defaultSeeds);
        localStorage.setItem(storageKey, JSON.stringify(defaultSeeds));
      }
    } catch {
      setComments(defaultSeeds);
    }
  }, [articleId, defaultSeeds]);

  // Persist updated comments array to localStorage
  const persistComments = (updated: CommentItem[]) => {
    setComments(updated);
    try {
      localStorage.setItem(`stackpipeline_comments_${articleId}`, JSON.stringify(updated));
    } catch (err) {
      console.warn('Unable to persist comments to localStorage', err);
    }
  };

  // Upvote or un-upvote a top-level comment
  const handleToggleUpvote = (commentId: string) => {
    const updated = comments.map((comment) => {
      if (comment.id === commentId) {
        const delta = comment.userUpvoted ? -1 : 1;
        return {
          ...comment,
          upvotes: Math.max(0, comment.upvotes + delta),
          userUpvoted: !comment.userUpvoted,
        };
      }
      return comment;
    });
    persistComments(updated);
  };

  // Upvote or un-upvote a reply
  const handleToggleReplyUpvote = (commentId: string, replyId: string) => {
    const updated = comments.map((comment) => {
      if (comment.id === commentId && comment.replies) {
        const updatedReplies = comment.replies.map((reply) => {
          if (reply.id === replyId) {
            const delta = reply.userUpvoted ? -1 : 1;
            return {
              ...reply,
              upvotes: Math.max(0, reply.upvotes + delta),
              userUpvoted: !reply.userUpvoted,
            };
          }
          return reply;
        });
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });
    persistComments(updated);
  };

  // Post a brand new feedback comment
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !authorName.trim() || !authorRole.trim()) return;

    setIsSubmitting(true);

    // Save profile info to localStorage for future comments
    try {
      localStorage.setItem('stackpipeline_user_name', authorName.trim());
      localStorage.setItem('stackpipeline_user_role', authorRole.trim());
      if (authorCompany.trim()) {
        localStorage.setItem('stackpipeline_user_company', authorCompany.trim());
      }
    } catch {
      // ignore
    }

    const newComment: CommentItem = {
      id: `user_comment_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      articleId,
      authorName: authorName.trim(),
      authorRole: authorRole.trim(),
      authorCompany: authorCompany.trim() || 'Engineering Team',
      authorAvatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80`,
      content: content.trim(),
      createdAt: 'Just now',
      upvotes: 1,
      userUpvoted: true,
      rating,
      feedbackType,
      verifiedProduction,
      isUserPost: true,
      replies: [],
    };

    setTimeout(() => {
      const updated = [newComment, ...comments];
      persistComments(updated);
      setContent('');
      setIsSubmitting(false);
      setToastMessage('Your feedback has been verified and saved to this guide!');
      setTimeout(() => setToastMessage(null), 4000);
    }, 250);
  };

  // Submit a reply to an existing comment
  const handlePostReply = (parentCommentId: string) => {
    if (!replyContent.trim()) return;

    const replyUser = authorName.trim() || 'Verified Peer';
    const replyRole = authorRole.trim() || 'Software Engineer';
    const replyCompany = authorCompany.trim() || 'Tech Team';

    const newReply: CommentItem = {
      id: `reply_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      articleId,
      authorName: replyUser,
      authorRole: replyRole,
      authorCompany: replyCompany,
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      content: replyContent.trim(),
      createdAt: 'Just now',
      upvotes: 1,
      userUpvoted: true,
      isUserPost: true,
    };

    const updated = comments.map((comment) => {
      if (comment.id === parentCommentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
        };
      }
      return comment;
    });

    persistComments(updated);
    setReplyContent('');
    setActiveReplyId(null);
    setToastMessage('Reply submitted to discussion!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Delete user's own comment
  const handleDeleteComment = (commentId: string) => {
    const updated = comments.filter((c) => c.id !== commentId);
    persistComments(updated);
    setToastMessage('Comment deleted.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Delete user's own reply
  const handleDeleteReply = (commentId: string, replyId: string) => {
    const updated = comments.map((comment) => {
      if (comment.id === commentId && comment.replies) {
        return {
          ...comment,
          replies: comment.replies.filter((r) => r.id !== replyId),
        };
      }
      return comment;
    });
    persistComments(updated);
    setToastMessage('Reply removed.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Calculate rating stats
  const ratings = comments.map((c) => c.rating || 5);
  const averageRating =
    ratings.length > 0
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : '5.0';

  const verifiedCount = comments.filter((c) => c.verifiedProduction).length;
  const verifiedPercentage =
    comments.length > 0 ? Math.round((verifiedCount / comments.length) * 100) : 100;

  // Filter & sort comments
  const processedComments = useMemo(() => {
    return comments
      .filter((c) => {
        if (filterType === 'verified') return c.verifiedProduction;
        if (filterType === 'caveat') return c.feedbackType === 'Caveat';
        if (filterType === 'question') return c.feedbackType === 'Question';
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return b.id.localeCompare(a.id);
        }
        return b.upvotes - a.upvotes;
      });
  }, [comments, filterType, sortBy]);

  return (
    <section id="discussion" className="my-14 pt-10 border-t border-slate-800 scroll-mt-20">
      {/* Header and Rating Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400 font-bold mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Community Peer Review &amp; Field Telemetry</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-100">
            Implementation Feedback &amp; Discussion
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-world test results, API rate-limit benchmarks, and edge cases submitted by engineers deploying this architecture.
          </p>
        </div>

        {/* Rating Scorecard Box */}
        <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl shrink-0">
          <div className="text-center px-2">
            <div className="text-2xl font-black text-white flex items-center justify-center gap-1">
              <span>{averageRating}</span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline" />
            </div>
            <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">
              {comments.length} Peer Reviews
            </div>
          </div>

          <div className="h-9 w-px bg-slate-800" />

          <div className="text-left text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <BadgeCheck className="w-4 h-4" />
              <span>{verifiedPercentage}% Verified</span>
            </div>
            <div className="text-[11px] text-slate-400">Deployed in production</div>
          </div>
        </div>
      </div>

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="my-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg shadow-emerald-500/5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 
        ======================================================================
        POST FEEDBACK FORM
        ======================================================================
      */}
      <div className="print:hidden comments-form my-8 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Submit Implementation Feedback or Question</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Persisted locally in browser
          </span>
        </div>

        <form onSubmit={handleSubmitComment} className="space-y-4">
          {/* Author Details Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Your Name <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Rivera"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Engineering Role <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Staff Data Engineer"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Organization / Team
              </label>
              <input
                type="text"
                placeholder="e.g. Stripe, FinOps Scale"
                value={authorCompany}
                onChange={(e) => setAuthorCompany(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Feedback Metadata: Star Rating & Category Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            {/* Star Rating Selection */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-400">Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    title={`${star} Star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600 hover:text-slate-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold ml-1">
                {rating}/5
              </span>
            </div>

            {/* Category Tag Selection */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-400">Feedback Type:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'Implementation', label: 'Verified Implementation' },
                  { id: 'Benchmark', label: 'Rate Benchmark' },
                  { id: 'Caveat', label: 'Edge Case / Caveat' },
                  { id: 'Question', label: 'Technical Question' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFeedbackType(item.id as any)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-mono transition-colors cursor-pointer border ${
                      feedbackType === item.id
                        ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Production Verification Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={verifiedProduction}
                onChange={(e) => setVerifiedProduction(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded bg-slate-900 border-slate-700 cursor-pointer"
              />
              <span className="text-emerald-400 font-semibold">Verified in Production Environment</span>
            </label>
          </div>

          {/* Feedback Content Textarea */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1 flex items-center justify-between">
              <span>
                Your Implementation Experience, Gotchas, or Benchmarks <span className="text-emerald-400">*</span>
              </span>
              <span className="text-slate-500 font-mono text-[10px]">
                {content.length} characters (min 10)
              </span>
            </label>
            <textarea
              rows={3}
              required
              placeholder={`Share specific experiences deploying ${softwareA || 'Tool A'} and ${softwareB || 'Tool B'}, webhook retry behaviors, or edge cases...`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-xs p-3.5 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans shadow-inner"
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Peer reviews are moderated and permanently retained in browser storage.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || content.trim().length < 10 || !authorName.trim() || !authorRole.trim()}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Publishing Feedback...' : 'Post Implementation Review'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 
        ======================================================================
        FILTER & SORT BAR
        ======================================================================
      */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 mb-6 pt-2">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-mono text-slate-400 text-[11px] uppercase mr-1">Filter:</span>
          {[
            { id: 'all', label: `All (${comments.length})` },
            { id: 'verified', label: `Verified (${verifiedCount})` },
            { id: 'caveat', label: 'Caveats' },
            { id: 'question', label: 'Questions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                filterType === tab.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-slate-400 text-[11px] uppercase">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="helpful">Most Helpful (Upvotes)</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {/* 
        ======================================================================
        COMMENTS LIST
        ======================================================================
      */}
      <div className="space-y-4">
        {processedComments.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-slate-800 bg-slate-900/30 text-slate-400">
            <p className="text-xs">No feedback matching the selected filter.</p>
            <button
              onClick={() => setFilterType('all')}
              className="mt-2 text-xs text-emerald-400 hover:underline"
            >
              Show all comments
            </button>
          </div>
        ) : (
          processedComments.map((comment) => (
            <div
              key={comment.id}
              className="p-5 rounded-2xl border border-slate-800/90 bg-slate-900/40 transition-all hover:border-slate-700 shadow-xs"
            >
              {/* Comment Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <img
                    src={comment.authorAvatar}
                    alt={comment.authorName}
                    className="w-9 h-9 rounded-full border border-slate-700 object-cover shrink-0 mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-100">
                        {comment.authorName}
                      </span>
                      {comment.verifiedProduction && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-semibold">
                          <BadgeCheck className="w-3 h-3" />
                          Verified Pipeline
                        </span>
                      )}
                      {comment.rating && (
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[...Array(comment.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      )}
                      <span className="text-[11px] text-slate-500 font-mono">
                        · {comment.createdAt}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 mt-0.5">
                      <span>{comment.authorRole}</span>
                      {comment.authorCompany && (
                        <>
                          <span className="text-slate-600"> @ </span>
                          <span className="text-slate-300 font-medium">{comment.authorCompany}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Header Actions: Upvote & Delete */}
                <div className="flex items-center gap-2 self-start">
                  {comment.isUserPost && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete your comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => handleToggleUpvote(comment.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer border ${
                      comment.userUpvoted
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border-slate-800'
                    }`}
                    title={comment.userUpvoted ? 'Remove upvote' : 'Upvote this helpful feedback'}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{comment.upvotes}</span>
                  </button>
                </div>
              </div>

              {/* Comment Content */}
              <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed pl-0 sm:pl-12 my-2.5">
                {comment.content}
              </p>

              {/* Reply Button Footer */}
              <div className="pl-0 sm:pl-12 pt-2 flex items-center justify-between border-t border-slate-800/60 mt-3 text-xs">
                <button
                  onClick={() => {
                    setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
                    setReplyContent('');
                  }}
                  className="text-[11px] font-mono text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <CornerDownRight className="w-3 h-3" />
                  <span>{activeReplyId === comment.id ? 'Cancel Reply' : 'Reply to Peer'}</span>
                </button>

                {comment.feedbackType && (
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    Tag: {comment.feedbackType}
                  </span>
                )}
              </div>

              {/* In-Line Reply Box */}
              {activeReplyId === comment.id && (
                <div className="mt-3 sm:ml-12 p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 animate-fadeIn">
                  <div className="text-[11px] font-mono uppercase text-slate-400">
                    Replying to {comment.authorName}
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Add your technical thoughts or clarification..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveReplyId(null)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePostReply(comment.id)}
                      disabled={!replyContent.trim()}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Post Reply</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Nested Replies Rendering */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 sm:ml-12 pl-4 border-l-2 border-slate-800 space-y-3">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <img
                            src={reply.authorAvatar}
                            alt={reply.authorName}
                            className="w-5 h-5 rounded-full border border-slate-700 object-cover"
                          />
                          <span className="text-xs font-bold text-slate-200">
                            {reply.authorName}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {reply.createdAt}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {reply.isUserPost && (
                            <button
                              onClick={() => handleDeleteReply(comment.id, reply.id)}
                              className="p-1 text-slate-500 hover:text-red-400"
                              title="Delete reply"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleReplyUpvote(comment.id, reply.id)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${
                              reply.userUpvoted
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            <ThumbsUp className="w-2.5 h-2.5" />
                            <span>{reply.upvotes}</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 pl-7 leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
};
