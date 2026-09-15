import React, { useState } from 'react';
import {
  LetterDocument,
  LetterheadConfig,
  JargonLevel,
} from '../types';
import {
  Building2,
  Calendar,
  CheckCircle,
  FileCheck,
  Eye,
  Edit3,
  Sliders,
  ShieldAlert,
  Info,
  Layers,
  Sparkles,
  Printer,
  ChevronDown,
} from 'lucide-react';
import { CORPORATE_JARGON_GLOSSARY } from '../data/jargonGlossary';

interface LetterPreviewProps {
  letter: LetterDocument;
  letterhead: LetterheadConfig;
  onUpdateBody: (newBody: string) => void;
  onUpdatePlaceholder: (key: string, value: string) => void;
  onEditLetterhead: () => void;
  isCompliant: boolean;
}

export const LetterPreview: React.FC<LetterPreviewProps> = ({
  letter,
  letterhead,
  onUpdateBody,
  onUpdatePlaceholder,
  onEditLetterhead,
  isCompliant,
}) => {
  const [viewMode, setViewMode] = useState<'interactive' | 'resolved'>('interactive');
  const [activePlaceholderKey, setActivePlaceholderKey] = useState<string | null>(null);
  const [showJargonExplanations, setShowJargonExplanations] = useState(true);

  // Render text with clickable placeholders and jargon tooltips
  const renderInteractiveBody = () => {
    let rawText = letter.letterBody;

    // Split text by lines
    const paragraphs = rawText.split(/\n\n+/);

    return paragraphs.map((para, pIdx) => {
      // Split paragraph by bracketed placeholders: [Something]
      const parts = para.split(/(\[[^\]]+\])/g);

      return (
        <p key={pIdx} className="mb-4 leading-relaxed text-slate-800 text-[15px] font-letterhead-serif">
          {parts.map((part, partIdx) => {
            // Check if this part is a bracketed placeholder
            if (part.startsWith('[') && part.endsWith(']')) {
              const currentVal = letter.placeholders[part] || '';
              const isResolved = currentVal && currentVal.trim().length > 0 && currentVal !== part;

              if (viewMode === 'resolved') {
                return (
                  <span
                    key={partIdx}
                    className="font-medium text-slate-900 border-b border-dotted border-slate-400/60 pb-0.5"
                    title={`Placeholder: ${part}`}
                  >
                    {isResolved ? currentVal : part}
                  </span>
                );
              }

              // Interactive mode: show clickable highlighted badge
              return (
                <span key={partIdx} className="relative inline-block mx-1">
                  <button
                    type="button"
                    onClick={() =>
                      setActivePlaceholderKey(activePlaceholderKey === part ? null : part)
                    }
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium transition-all ${
                      isResolved
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                        : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse hover:bg-amber-200'
                    }`}
                    title="Click to edit placeholder value"
                  >
                    <span>{isResolved ? currentVal : part}</span>
                    <Edit3 className="w-2.5 h-2.5 opacity-60" />
                  </button>

                  {/* Inline Edit Popover */}
                  {activePlaceholderKey === part && (
                    <div className="absolute left-0 top-full mt-1.5 z-40 bg-white rounded-lg shadow-xl border border-slate-300 p-3 min-w-[260px] animate-in fade-in zoom-in-95">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase">
                          {part.replace(/^\[|\]$/g, '')}
                        </span>
                        <button
                          onClick={() => setActivePlaceholderKey(null)}
                          className="text-[11px] text-slate-400 hover:text-slate-600"
                        >
                          Close
                        </button>
                      </div>
                      <input
                        type="text"
                        autoFocus
                        value={currentVal}
                        onChange={(e) => onUpdatePlaceholder(part, e.target.value)}
                        placeholder={`Value for ${part}...`}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded outline-hidden"
                      />
                      <div className="mt-2 text-[10px] text-slate-400">
                        Updates all occurrences across this letter
                      </div>
                    </div>
                  )}
                </span>
              );
            }

            // Regular text: check for corporate jargon highlighting if enabled
            if (showJargonExplanations && viewMode === 'interactive') {
              // Highlight matching jargon terms
              return renderWithJargonHighlights(part, pIdx * 100 + partIdx);
            }

            return <span key={partIdx}>{part}</span>;
          })}
        </p>
      );
    });
  };

  const renderWithJargonHighlights = (text: string, keyPrefix: number) => {
    // Check known jargon words
    let rendered: React.ReactNode[] = [text];

    for (const item of CORPORATE_JARGON_GLOSSARY) {
      const newRendered: React.ReactNode[] = [];
      const regex = new RegExp(`(${item.term})`, 'gi');

      rendered.forEach((node, nodeIdx) => {
        if (typeof node === 'string') {
          const split = node.split(regex);
          split.forEach((seg, sIdx) => {
            if (seg.toLowerCase() === item.term.toLowerCase()) {
              newRendered.push(
                <span
                  key={`${keyPrefix}-${item.term}-${nodeIdx}-${sIdx}`}
                  className="group relative inline cursor-help border-b-2 border-indigo-300/80 bg-indigo-50/50 hover:bg-indigo-100/60 rounded-xs px-0.5 transition-colors"
                >
                  <span className="text-slate-900">{seg}</span>
                  {/* Tooltip */}
                  <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-50 pointer-events-none transition-all">
                    <span className="block font-semibold text-indigo-300 text-[11px] mb-0.5">
                      Corporate Subtext:
                    </span>
                    <span className="block text-slate-200 text-[11px] leading-snug mb-1">
                      "{item.plainMeaning}"
                    </span>
                    <span className="block text-slate-400 text-[10px] italic">
                      Strategic purpose: {item.corporateContext}
                    </span>
                  </span>
                </span>
              );
            } else if (seg) {
              newRendered.push(seg);
            }
          });
        } else {
          newRendered.push(node);
        }
      });
      rendered = newRendered;
    }

    return <React.Fragment key={keyPrefix}>{rendered}</React.Fragment>;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Document Controls Bar (Hidden during print) */}
      <div className="no-print bg-white rounded-t-xl border border-slate-200 border-b-0 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="bg-slate-100 p-1 rounded-lg flex items-center border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('interactive')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                viewMode === 'interactive'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Interactive Draft</span>
            </button>
            <button
              onClick={() => setViewMode('resolved')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                viewMode === 'resolved'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>Clean Letterhead View</span>
            </button>
          </div>

          {viewMode === 'interactive' && (
            <button
              onClick={() => setShowJargonExplanations(!showJargonExplanations)}
              className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1 transition-colors ${
                showJargonExplanations
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="Show interactive tooltips explaining corporate jargon"
            >
              <Sparkles className="w-3 h-3" />
              <span>Jargon Insights</span>
            </button>
          )}
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onEditLetterhead}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Customize Letterhead</span>
          </button>

          <div
            className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${
              isCompliant
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isCompliant ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{letter.wordCount} words</span>
          </div>
        </div>
      </div>

      {/* The Printable Executive Letterhead Sheet */}
      <div className="grow overflow-y-auto bg-slate-200/60 p-4 sm:p-6 lg:p-8 flex justify-center no-scrollbar">
        <div className="print-sheet bg-white w-full max-w-[850px] min-h-[1050px] shadow-xl rounded-b-xl sm:rounded-xl p-8 sm:p-12 lg:p-16 border border-slate-200/90 text-slate-900 flex flex-col justify-between relative transition-all">
          {/* Subtle Watermark or Security Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* MAIN LETTERHEAD HEADER */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-slate-900 pb-5 mb-8 gap-4">
              {/* Left branding & corporate identity */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-slate-900 bg-slate-900 text-white flex items-center justify-center font-letterhead-brand text-xl font-bold tracking-widest">
                    V
                  </div>
                  <div>
                    <h1 className="font-letterhead-brand text-lg sm:text-xl font-bold tracking-widest text-slate-900 uppercase">
                      {letterhead.companyName}
                    </h1>
                    <p className="text-xs font-medium tracking-wide text-slate-600 uppercase">
                      {letterhead.division}
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 tracking-wider uppercase pt-1">
                  {letterhead.tagline}
                </p>
              </div>

              {/* Right corporate address block */}
              <div className="text-left sm:text-right text-[11px] text-slate-600 space-y-0.5 font-mono">
                <p className="font-semibold text-slate-800">{letterhead.streetAddress}</p>
                <p>{letterhead.cityStateZip}</p>
                <p>Direct: {letterhead.directPhone}</p>
                <p>Email: {letterhead.officialEmail}</p>
                <p className="text-indigo-600 font-medium">{letterhead.website}</p>
              </div>
            </div>

            {/* DOCUMENT METADATA BAR */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 font-mono mb-8 pb-3 border-b border-slate-200 gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-800">{letter.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                  {letter.referenceNumber || letterhead.referenceNumber}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  Official Communication
                </span>
              </div>
            </div>

            {/* RECIPIENT BLOCK */}
            <div className="mb-6 font-letterhead-serif text-[15px] leading-snug space-y-0.5 text-slate-800">
              <p className="font-bold text-slate-900 text-base">
                {viewMode === 'resolved'
                  ? letter.placeholders['[Recipient Name]'] || letter.recipientName
                  : letter.recipientName}
              </p>
              <p className="text-slate-700">
                {viewMode === 'resolved'
                  ? letter.placeholders['[Recipient Title / Managing Director]'] ||
                    letter.placeholders['[Recipient Title]'] ||
                    letter.recipientTitle
                  : letter.recipientTitle}
              </p>
              <p className="text-slate-600">
                {viewMode === 'resolved'
                  ? letter.placeholders['[Client / Parent Corporation Name]'] ||
                    letter.placeholders['[Company Name]'] ||
                    letter.recipientOrganization
                  : letter.recipientOrganization}
              </p>
              {letter.recipientEmail && (
                <p className="text-xs font-mono text-slate-500">{letter.recipientEmail}</p>
              )}
            </div>

            {/* SUBJECT LINE */}
            <div className="mb-6 py-2 px-3 bg-slate-50 border-l-3 border-slate-900 text-xs sm:text-sm font-semibold text-slate-900 tracking-tight">
              RE: {letter.subjectLine}
            </div>

            {/* LETTER BODY CONTENT */}
            <div className="letter-body-area text-justify">
              {renderInteractiveBody()}
            </div>

            {/* SIGNATURE & CLOSE BLOCK */}
            <div className="mt-8 pt-4 font-letterhead-serif">
              <div className="space-y-1 text-slate-800">
                {/* Simulated Executive Signature */}
                <div className="py-2">
                  <div className="font-serif italic text-2xl text-slate-800 tracking-tight select-none opacity-90 pl-1">
                    {letter.placeholders['[Sender Name]'] || 'Alex Mercer'}
                  </div>
                  <div className="w-48 h-px bg-slate-300 mt-1" />
                </div>

                <p className="font-bold text-slate-900 text-base">
                  {viewMode === 'resolved'
                    ? letter.placeholders['[Sender Name]'] || letter.senderName
                    : letter.senderName}
                </p>
                <p className="text-sm text-slate-700">
                  {viewMode === 'resolved'
                    ? letter.placeholders['[Sender Title]'] ||
                      letter.placeholders['[Your Job Title / Senior Operations Lead]'] ||
                      letter.senderTitle
                    : letter.senderTitle}
                </p>
                <p className="text-xs text-slate-500 font-sans">
                  {letterhead.companyName} • {letterhead.division}
                </p>
              </div>

              {/* Enclosure Note */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-mono text-slate-500 space-y-1">
                <p>
                  <span className="font-bold text-slate-700">ENCLOSURES:</span> Executive
                  Knowledge-Transfer Matrix // Operational Handover Schedule
                </p>
                <p>
                  <span className="font-bold text-slate-700">DISTRIBUTION:</span> Executive
                  Leadership, Corporate Operations &amp; Client Registry
                </p>
              </div>
            </div>
          </div>

          {/* LETTERHEAD FOOTER / LEGAL & TAMPER STAMP */}
          <div className="mt-12 pt-6 border-t border-slate-200 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-400 font-mono">
            <div className="max-w-md">
              <p className="leading-tight">{letterhead.confidentialityNotice}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center font-bold text-[9px] text-slate-500">
                §
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-600">VERIFIED LETTERHEAD</p>
                <p>SHA-256: 8f9c2a...e041</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
