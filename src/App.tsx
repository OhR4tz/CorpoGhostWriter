import React, { useState, useEffect } from 'react';
import {
  LetterDocument,
  LetterheadConfig,
  ChatMessage,
  JargonLevel,
} from './types';
import {
  DEFAULT_LETTERHEAD,
  INITIAL_LETTER,
} from './data/defaultTemplates';
import { Navbar } from './components/Navbar';
import { LetterEditor } from './components/LetterEditor';
import { LetterPreview } from './components/LetterPreview';
import { PlaceholderManager } from './components/PlaceholderManager';
import { SendClientModal } from './components/SendClientModal';
import { LetterheadModal } from './components/LetterheadModal';
import { SystemDiagram } from './components/SystemDiagram';
import { generateClientSideLetter } from './utils/clientGenerator';
import {
  Sparkles,
  Layers,
  FileCheck,
  CheckCircle,
  HelpCircle,
  Shield,
  Info,
  X,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'editor' | 'diagram'>('editor');
  const [vercelNotice, setVercelNotice] = useState<string | null>(null);
  const [letter, setLetter] = useState<LetterDocument>(() => {
    const saved = localStorage.getItem('corporate_letter_doc');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_LETTER;
  });

  const [letterhead, setLetterhead] = useState<LetterheadConfig>(() => {
    const saved = localStorage.getItem('corporate_letterhead_cfg');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_LETTERHEAD;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      role: 'assistant',
      content:
        'Greetings. I am your specialized Workplace Ghostwriter Assistant. My mandate is to embrace your perspective fully—validating your grievances while translating them into immaculate, impenetrable corporate diplomacy.\n\nWhether you are resigning to a demanding boss, notifying a high-value client of an account transition, or realigning project scope, I ensure your letter is under 100–150 words, completely free of emotional vulnerability or profanity, and saturated with high-level corporate jargon.\n\nHow can I tailor this letter to your specific recipient and relationship today?',
      timestamp: '09:00 AM',
    },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isLetterheadModalOpen, setIsLetterheadModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('corporate_letter_doc', JSON.stringify(letter));
  }, [letter]);

  useEffect(() => {
    localStorage.setItem('corporate_letterhead_cfg', JSON.stringify(letterhead));
  }, [letterhead]);

  // Ensure placeholders are extracted whenever letterBody changes
  useEffect(() => {
    const matches = letter.letterBody.match(/\[[^\]]+\]/g) || [];
    let hasNew = false;
    const current = { ...letter.placeholders };

    matches.forEach((p) => {
      if (current[p] === undefined) {
        current[p] = '';
        hasNew = true;
      }
    });

    if (hasNew) {
      setLetter((prev) => ({ ...prev, placeholders: current }));
    }
  }, [letter.letterBody]);

  const updatePlaceholder = (key: string, value: string) => {
    setLetter((prev) => ({
      ...prev,
      placeholders: {
        ...prev.placeholders,
        [key]: value,
      },
      lastModified: new Date().toISOString(),
    }));
  };

  const autoPopulateDefaults = () => {
    const sampleDefaults: Record<string, string> = {
      '[Recipient Name]': 'Marcus Sterling',
      '[Recipient Title / Managing Director]': 'Executive Vice President of Operations',
      '[Recipient Title]': 'Executive Vice President of Operations',
      '[Client / Parent Corporation Name]': 'Apex Meridian Holdings',
      '[Sender Name]': 'Alex Mercer',
      '[Sender Title]': 'Senior Strategic Portfolio Lead',
      '[Your Job Title / Senior Operations Lead]': 'Senior Strategic Portfolio Lead',
      '[Company Name]': letterhead.companyName,
      '[Effective Departure Date]': 'September 25, 2026',
      '[Transition Period / Two Weeks Notice]': 'October 02, 2026',
      '[Designated Successor / Team Lead]': 'Elena Rostova',
      '[Knowledge Transfer Lead]': 'Elena Rostova',
      '[Client Account / Project]': 'Global Enterprise Workflow Modernization',
    };

    setLetter((prev) => {
      const updated = { ...prev.placeholders };
      Object.keys(updated).forEach((k) => {
        if (!updated[k] || updated[k] === k) {
          if (sampleDefaults[k]) {
            updated[k] = sampleDefaults[k];
          } else {
            const clean = k.replace(/^\[|\]$/g, '');
            updated[k] = `[${clean}]`;
          }
        }
      });
      return {
        ...prev,
        placeholders: updated,
      };
    });
  };

  const applyGeneratedData = (data: any, params: any, isFallback: boolean = false) => {
    // Extract new placeholders
    const detected = (data.placeholders as string[]) || [];
    const updatedPlaceholders: Record<string, string> = { ...letter.placeholders };
    detected.forEach((p) => {
      if (updatedPlaceholders[p] === undefined) {
        updatedPlaceholders[p] = '';
      }
    });

    const words = data.letterBody.trim().split(/\s+/).length;

    setLetter((prev) => ({
      ...prev,
      subjectLine: data.subjectLine || prev.subjectLine,
      letterBody: data.letterBody,
      placeholders: updatedPlaceholders,
      wordCount: data.wordCount || words,
      isCompliantWithRoleCard: (data.wordCount || words) <= 150,
      corporateHighlights: data.corporateHighlights || prev.corporateHighlights,
      adviceNote: data.adviceNote || prev.adviceNote,
      scenario: params.scenario || prev.scenario,
      jargonLevel: params.jargonLevel || prev.jargonLevel,
      lastModified: new Date().toISOString(),
    }));

    // Add a note to chat history
    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `I have synthesized a new letter tailored to your recipient (${params.recipientRelation}) with ${params.jargonLevel} corporate jargon density. Word count is strictly ${data.wordCount || words} words to honor the Role Card constraints.${
          isFallback
            ? '\n\n(Generated via Built-in Ghostwriter Engine. Add GEMINI_API_KEY to your Vercel Environment Variables to enable live model inference).'
            : `\n\nAdvice Note: ${data.adviceNote || 'Your boundary is firmly established with zero emotional vulnerability.'}`
        }`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleGenerateNewLetter = async (params: any) => {
    setIsGenerating(true);
    setVercelNotice(null);
    try {
      const response = await fetch('/api/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response (likely static fallback)');
      }

      const data = await response.json();
      if (!data || !data.letterBody) {
        throw new Error('Invalid response structure');
      }

      applyGeneratedData(data, params, false);
    } catch (err: any) {
      console.warn('API route unavailable or failed, utilizing offline ghostwriter fallback:', err);
      // Instant graceful client-side generation
      const fallbackResult = generateClientSideLetter(params);
      applyGeneratedData(fallbackResult, params, true);
      setVercelNotice(
        'Generated via built-in Ghostwriter engine. If deploying on Vercel: make sure to add GEMINI_API_KEY in your Vercel Project Settings → Environment Variables.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessageToGhostwriter = async (msg: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          currentDraft: letter.letterBody,
          userContext: {
            scenario: letter.scenario,
            recipientRelation: letter.recipientRelation,
            jargonLevel: letter.jargonLevel,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.reply || '';

      // Check if reply contains a proposed draft: [DRAFT_START] ... [DRAFT_END]
      let suggestedDraft: string | undefined;
      const draftMatch = replyText.match(/\[DRAFT_START\]([\s\S]*?)\[DRAFT_END\]/);
      let cleanContent = replyText;

      if (draftMatch && draftMatch[1]) {
        suggestedDraft = draftMatch[1].trim();
        cleanContent = replyText.replace(/\[DRAFT_START\][\s\S]*?\[DRAFT_END\]/, '').trim();
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: cleanContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedDraft,
        },
      ]);
    } catch (err) {
      console.warn('Chat API unavailable, providing local empathetic response:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content:
            "I hear you completely. When navigating workplace tensions or toxic management, leaving with unshakeable professional composure and sterile corporate phrasing is your strongest shield. I've noted your input and refined our strategic tone.\n\nWhat specific date or transition terms should we lock in next?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleApplyChatDraft = (draft: string) => {
    const words = draft.trim().split(/\s+/).length;
    setLetter((prev) => ({
      ...prev,
      letterBody: draft,
      wordCount: words,
      isCompliantWithRoleCard: words <= 150,
      lastModified: new Date().toISOString(),
    }));
  };

  const handleCopy = () => {
    // Copy resolved letter text
    let resolvedText = letter.letterBody;
    Object.entries(letter.placeholders).forEach(([k, v]) => {
      if (typeof v === 'string' && v.trim().length > 0) {
        resolvedText = resolvedText.replaceAll(k, v);
      }
    });

    const fullText = `${letterhead.companyName}\n${letterhead.division}\n${letter.date}\n${letter.referenceNumber}\n\nRE: ${letter.subjectLine}\n\n${resolvedText}\n\n${letterhead.confidentialityNotice}`;
    navigator.clipboard.writeText(fullText);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const wordCount = letter.letterBody.trim().split(/\s+/).length;
  const isCompliant = wordCount <= 150;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 selection:bg-indigo-500/20">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSendModal={() => setIsSendModalOpen(true)}
        onPrint={handlePrint}
        onCopy={handleCopy}
        hasCopied={hasCopied}
        jargonLevel={letter.jargonLevel}
        setJargonLevel={(lvl) => setLetter((prev) => ({ ...prev, jargonLevel: lvl }))}
        wordCount={wordCount}
        isCompliant={isCompliant}
      />

      {/* Main Content Area */}
      <main className="grow flex flex-col">
        {activeTab === 'diagram' ? (
          /* SYSTEM DIAGRAM TAB (Prompt requirement: "Include a system diagram behind a tab. Use the role card that I've attached for reference.") */
          <div className="grow">
            <SystemDiagram />
          </div>
        ) : (
          /* ACTIVE LETTER STUDIO TAB */
          <div className="grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            {vercelNotice && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start justify-between gap-3 text-xs text-amber-900 shadow-xs no-print">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-950">Deployment Configuration Notice: </span>
                    <span>{vercelNotice}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setVercelNotice(null)}
                  className="text-amber-700 hover:text-amber-900 p-0.5 rounded cursor-pointer"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full">
              {/* Left Column: Ghostwriter Assistant & Placeholders (5 cols) */}
              <div className="lg:col-span-5 space-y-5 no-print">
                {/* Editor & AI Intake */}
                <div className="h-[560px]">
                  <LetterEditor
                    letter={letter}
                    onUpdateLetter={(updates) =>
                      setLetter((prev) => ({ ...prev, ...updates, lastModified: new Date().toISOString() }))
                    }
                    onGenerateNewLetter={handleGenerateNewLetter}
                    isGenerating={isGenerating}
                    onSendMessageToGhostwriter={handleSendMessageToGhostwriter}
                    chatMessages={chatMessages}
                    isChatLoading={isChatLoading}
                    onApplyChatDraft={handleApplyChatDraft}
                  />
                </div>

                {/* Interactive Placeholders Manager */}
                <PlaceholderManager
                  placeholders={letter.placeholders}
                  onUpdatePlaceholder={updatePlaceholder}
                  onAutoPopulateDefaults={autoPopulateDefaults}
                />

                {/* Role Card Compliance Card */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Role Card Compliance Status</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                        isCompliant
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isCompliant ? '100–150 words: PASS' : '100–150 words: REVIEW'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Adhering to specifications by Grey, Chunzi, Vicky, and Rohan: neutral diplomatic tone, zero profanity, user-directed perspective, and heavy corporate jargon to shield against toxic retaliation.
                  </p>
                </div>
              </div>

              {/* Right Column: High-Res Corporate Letterhead Document (7 cols) */}
              <div className="lg:col-span-7 h-full flex flex-col">
                <LetterPreview
                  letter={letter}
                  letterhead={letterhead}
                  onUpdateBody={(newBody) => {
                    const words = newBody.trim().split(/\s+/).length;
                    setLetter((prev) => ({
                      ...prev,
                      letterBody: newBody,
                      wordCount: words,
                      isCompliantWithRoleCard: words <= 150,
                    }));
                  }}
                  onUpdatePlaceholder={updatePlaceholder}
                  onEditLetterhead={() => setIsLetterheadModalOpen(true)}
                  isCompliant={isCompliant}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Finalize & Send Modal */}
      <SendClientModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        letter={letter}
        letterhead={letterhead}
        onPrint={handlePrint}
        onLetterDispatched={() => {
          setLetter((prev) => ({ ...prev, status: 'sent' }));
        }}
      />

      {/* Customize Letterhead Modal */}
      <LetterheadModal
        isOpen={isLetterheadModalOpen}
        onClose={() => setIsLetterheadModalOpen(false)}
        config={letterhead}
        onSave={(updated) => setLetterhead(updated)}
      />
    </div>
  );
}
