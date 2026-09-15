import React from 'react';
import {
  FileText,
  Network,
  Send,
  Printer,
  Copy,
  Check,
  Building2,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { JargonLevel } from '../types';

interface NavbarProps {
  activeTab: 'editor' | 'diagram';
  setActiveTab: (tab: 'editor' | 'diagram') => void;
  onOpenSendModal: () => void;
  onPrint: () => void;
  onCopy: () => void;
  hasCopied: boolean;
  jargonLevel: JargonLevel;
  setJargonLevel: (level: JargonLevel) => void;
  wordCount: number;
  isCompliant: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSendModal,
  onPrint,
  onCopy,
  hasCopied,
  jargonLevel,
  setJargonLevel,
  wordCount,
  isCompliant,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-letterhead-brand text-lg font-bold shadow-sm ring-1 ring-slate-800">
              CL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 tracking-tight text-base sm:text-lg">
                  Corporate Letter Assistant
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/70 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Ghostwriter Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Tailored workplace correspondence • Role-Card Compliant • Jargon-Infused
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              id="tab-letter-editor"
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'editor'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Letter Studio</span>
            </button>

            <button
              id="tab-system-diagram"
              onClick={() => setActiveTab('diagram')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'diagram'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Network className="w-4 h-4 text-emerald-600" />
              <span>System Diagram &amp; Role Card</span>
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Word Count Indicator Badge */}
            <div
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                isCompliant
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
              title="Role Card constraint: Under 100-150 words"
            >
              <span className={`w-2 h-2 rounded-full ${isCompliant ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>{wordCount} words</span>
              <span className="text-[10px] text-slate-400">({isCompliant ? '100-150 rule OK' : 'review length'})</span>
            </div>

            <button
              id="btn-copy-letter"
              onClick={onCopy}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors"
              title="Copy current letter text"
            >
              {hasCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              id="btn-print-letter"
              onClick={onPrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors"
              title="Print or export letterhead as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print / PDF</span>
            </button>

            <button
              id="btn-finalize-send"
              onClick={onOpenSendModal}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all hover:shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Finalize &amp; Send</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
