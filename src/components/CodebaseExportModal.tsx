import React, { useState } from 'react';
import { X, Copy, Check, FolderGit2, FileCode, Download, Terminal, ChevronRight } from 'lucide-react';
import { ASTRO_PROJECT_FILES, CodeFile } from '../data/codebaseExport';

interface CodebaseExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodebaseExportModal: React.FC<CodebaseExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(ASTRO_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [allCopied, setAllCopied] = useState(false);

  if (!isOpen) return null;

  const copyCurrentFile = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (file: CodeFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyAllAsZipManifest = () => {
    const fullManifest = ASTRO_PROJECT_FILES.map(
      (f) => `/* ==========================================================================\n   FILE: ${f.path}\n   ========================================================================== */\n\n${f.content}\n\n`
    ).join('\n');
    navigator.clipboard.writeText(fullManifest);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[88vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Production Astro + Cloudflare Pages Codebase</h3>
              <p className="text-xs text-slate-400">
                Complete, syntactically flawless configurations, content collections, and CI/CD actions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/api/download-zip"
              download="stackpipeline-complete-project.zip"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Project ZIP</span>
            </a>
            <button
              onClick={copyAllAsZipManifest}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-colors"
            >
              {allCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {allCopied ? 'All Files Copied!' : 'Copy Bundle Text'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Master Explorer Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Tree Sidebar */}
          <div className="w-72 border-r border-slate-800 bg-slate-950/60 p-4 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 mb-2">
                Project Files ({ASTRO_PROJECT_FILES.length})
              </div>
              {ASTRO_PROJECT_FILES.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-left transition-colors ${
                      isSelected
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{file.path}</span>
                    </div>
                    {isSelected && <ChevronRight className="w-3 h-3 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Quick Terminal Command */}
            <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-300 mb-1">
                <Terminal className="w-3 h-3 text-emerald-400" />
                Quick Deploy
              </div>
              <div className="text-emerald-400 font-bold">$ npm run build</div>
              <div className="text-slate-400">$ wrangler pages deploy dist</div>
            </div>
          </div>

          {/* Main Code Editor Panel */}
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
            {/* File Info Bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/40">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 font-semibold">{selectedFile.path}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    {selectedFile.language.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{selectedFile.description}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadFile(selectedFile)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
                  title="Download individual file"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
                <button
                  onClick={copyCurrentFile}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy File'}
                </button>
              </div>
            </div>

            {/* Code Viewer */}
            <div className="flex-1 p-6 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed bg-[#0b0f19]">
              <pre>
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
