import React from 'react';
import { X, Bookmark, Trash2, ArrowRight, Clock, GitCompare, Layers, Zap } from 'lucide-react';
import { IntegrationTutorial, UnifiedArticle } from '../types';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedIds: string[];
  allTutorials: IntegrationTutorial[];
  allArticles?: UnifiedArticle[];
  onSelectTutorial: (id: string) => void;
  onSelectArticle?: (article: UnifiedArticle) => void;
  onRemoveBookmark: (id: string) => void;
  onClearAll: () => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarkedIds,
  allTutorials,
  allArticles,
  onSelectTutorial,
  onSelectArticle,
  onRemoveBookmark,
  onClearAll,
}) => {
  if (!isOpen) return null;

  // Prefer unified articles if provided, otherwise fallback to tutorials
  const bookmarkedItems: UnifiedArticle[] = (allArticles || allTutorials.map((t) => ({
    id: t.id,
    slug: t.slug,
    title: t.title,
    archetype: 'integration' as const,
    metaDescription: t.metaDescription,
    category: t.softwareA.category || 'Workflow Automation',
    softwareA: t.softwareA,
    softwareB: t.softwareB,
    author: t.author,
    publishDate: t.publishDate,
    estimatedMinutes: t.estimatedMinutes,
    tags: t.tags || [],
    originalTutorial: t,
  }))).filter((item) => bookmarkedIds.includes(item.id));

  const totalMinutes = bookmarkedItems.reduce((acc, curr) => acc + curr.estimatedMinutes, 0);

  const handleOpenItem = (item: UnifiedArticle) => {
    if (onSelectArticle) {
      onSelectArticle(item);
    } else {
      onSelectTutorial(item.originalTutorial?.id || item.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Bookmark className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Saved Reading Library</h3>
              <p className="text-xs text-slate-400">
                {bookmarkedItems.length} {bookmarkedItems.length === 1 ? 'item' : 'items'} · ~{totalMinutes} mins of technical reading
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {bookmarkedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-200">Your Reading Library is Empty</h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Click "Save Article" on any integration guide, architectural showdown, or alternatives hub to save it for offline reading and implementation reference.
              </p>
            </div>
          ) : (
            bookmarkedItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {item.archetype === 'comparison' ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                        <GitCompare className="w-2.5 h-2.5" />
                        VS SHOWDOWN
                      </span>
                    ) : item.archetype === 'alternatives' ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Layers className="w-2.5 h-2.5" />
                        ALTERNATIVES
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5" />
                        INTEGRATION
                      </span>
                    )}

                    <span className="text-[11px] font-mono text-slate-400">
                      {item.softwareA.name} {item.softwareB ? (item.archetype === 'comparison' ? 'vs' : '→') : ''} {item.softwareB?.name || ''}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveBookmark(item.id);
                    }}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4
                  onClick={() => handleOpenItem(item)}
                  className="text-xs font-bold text-slate-200 hover:text-emerald-400 cursor-pointer line-clamp-2 leading-snug mb-2"
                >
                  {item.title}
                </h4>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.estimatedMinutes} min read
                  </span>
                  <button
                    onClick={() => handleOpenItem(item)}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    <span>Read Publication</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {bookmarkedItems.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/40">
            <button
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors cursor-pointer"
            >
              Clear Library
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Done Reading
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
