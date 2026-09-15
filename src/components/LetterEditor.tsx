import React, { useState } from 'react';
import {
  LetterDocument,
  JargonLevel,
  LetterScenario,
  ChatMessage,
} from '../types';
import { SAMPLE_SCENARIOS } from '../data/defaultTemplates';
import {
  Sparkles,
  Send,
  MessageSquare,
  Wand2,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  FileText,
  UserCheck,
  Building,
  RefreshCw,
  HelpCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface LetterEditorProps {
  letter: LetterDocument;
  onUpdateLetter: (updated: Partial<LetterDocument>) => void;
  onGenerateNewLetter: (params: any) => Promise<void>;
  isGenerating: boolean;
  onSendMessageToGhostwriter: (msg: string) => Promise<void>;
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  onApplyChatDraft: (draft: string) => void;
}

export const LetterEditor: React.FC<LetterEditorProps> = ({
  letter,
  onUpdateLetter,
  onGenerateNewLetter,
  isGenerating,
  onSendMessageToGhostwriter,
  chatMessages,
  isChatLoading,
  onApplyChatDraft,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'intake' | 'chat' | 'rawEditor'>('intake');

  // Intake form state
  const [scenario, setScenario] = useState<LetterScenario>(letter.scenario);
  const [recipientName, setRecipientName] = useState(letter.recipientName);
  const [recipientRole, setRecipientRole] = useState(letter.recipientTitle);
  const [recipientRelation, setRecipientRelation] = useState(letter.recipientRelation);
  const [userPerspective, setUserPerspective] = useState(
    'My boss has been micromanaging me, dismissing my project proposals, and laughing off legitimate burnout concerns. I need to resign immediately without burning bridges or losing my composure.'
  );
  const [customDemands, setCustomDemands] = useState(
    'Strict 2-week transition period, zero involvement in legacy sprints after departure date, full knowledge-transfer handover.'
  );
  const [jargonLevel, setJargonLevel] = useState<JargonLevel>(letter.jargonLevel);
  const [enforceLength, setEnforceLength] = useState(true);

  // Chat input
  const [chatInput, setChatInput] = useState('');

  const handleScenarioSelect = (sc: (typeof SAMPLE_SCENARIOS)[0]) => {
    setScenario(sc.id as LetterScenario);
    setUserPerspective(sc.defaultPerspective);
    setRecipientRelation(sc.recipientRelation);
    setRecipientRole(sc.recipientRole);
  };

  const handleRunGenerate = () => {
    onGenerateNewLetter({
      scenario,
      recipientName,
      recipientRole,
      recipientRelation,
      userPerspective,
      customDemands,
      jargonLevel,
      enforceLength,
      senderName: letter.senderName,
      senderTitle: letter.senderTitle,
      companyName: letter.placeholders['[Company Name]'] || 'Vanguard Strategic Holdings',
      keyDates: letter.placeholders['[Effective Departure Date]'] || '[Effective Date / Two Weeks Notice]',
    });
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    const msg = chatInput.trim();
    setChatInput('');
    onSendMessageToGhostwriter(msg);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Sub-tab navigation */}
      <div className="border-b border-slate-200 px-4 pt-3 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('intake')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeSubTab === 'intake'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Perspective &amp; Generator</span>
          </button>

          <button
            onClick={() => setActiveSubTab('chat')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeSubTab === 'chat'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
            <span>Ghostwriter Interview</span>
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
          </button>

          <button
            onClick={() => setActiveSubTab('rawEditor')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeSubTab === 'rawEditor'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Direct Text Editor</span>
          </button>
        </div>

        {/* Word count check */}
        <div className="text-[11px] font-mono text-slate-500 pb-2 hidden sm:block">
          Role Card: <span className="font-semibold text-slate-700">&lt;100-150 words</span>
        </div>
      </div>

      {/* Tab 1: Perspective & Generator */}
      {activeSubTab === 'intake' && (
        <div className="p-4 sm:p-5 overflow-y-auto grow space-y-4 text-xs">
          {/* Preset scenarios */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">
              Workplace Scenario
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => handleScenarioSelect(sc)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    scenario === sc.id
                      ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600/30 text-indigo-950'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <p className="font-semibold text-[11px]">{sc.title}</p>
                  <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                    {sc.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Recipient & Relationship */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Recipient Name / Placeholder
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. [Recipient Name] or Marcus Sterling"
                className="w-full px-3 py-1.5 border border-slate-300 focus:border-indigo-500 rounded-md outline-hidden text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Recipient Role &amp; Relation to You
              </label>
              <input
                type="text"
                value={recipientRelation}
                onChange={(e) => setRecipientRelation(e.target.value)}
                placeholder="e.g. Dismissive Boss, Key Enterprise Client"
                className="w-full px-3 py-1.5 border border-slate-300 focus:border-indigo-500 rounded-md outline-hidden text-xs"
              />
            </div>
          </div>

          {/* User's Unfiltered Perspective (Role Card requirement) */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-900 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Your Unfiltered Perspective &amp; Real Situation</span>
              </label>
              <span className="text-[10px] text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                Ghostwriter validates &amp; converts safely
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
              Describe what really happened (even if emotional or frustrating). The ghostwriter adheres strictly to the Role Card by converting your grievances into impenetrable corporate diplomacy.
            </p>
            <textarea
              rows={3}
              value={userPerspective}
              onChange={(e) => setUserPerspective(e.target.value)}
              placeholder="e.g. I have had enough of being dismissed and made to feel small. I am moving on to a better role, but I must remain calm, neutral, and protected..."
              className="w-full p-2.5 bg-white border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-md outline-hidden text-xs text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Terms, Handover & Key Dates */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Transition Terms &amp; Specific Demands
            </label>
            <input
              type="text"
              value={customDemands}
              onChange={(e) => setCustomDemands(e.target.value)}
              placeholder="e.g. 2-week transition, knowledge transfer documentation, no overtime..."
              className="w-full px-3 py-1.5 border border-slate-300 focus:border-indigo-500 rounded-md outline-hidden text-xs"
            />
          </div>

          {/* Corporate Jargon Slider */}
          <div className="p-3 bg-indigo-50/40 rounded-lg border border-indigo-100/80">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                <span>Corporate Jargon &amp; Buzzword Density</span>
              </span>
              <span className="text-[11px] font-bold text-indigo-700 uppercase">
                {jargonLevel === 'moderate'
                  ? 'Boardroom Diplomatic'
                  : jargonLevel === 'heavy'
                    ? 'C-Suite Synergies'
                    : 'Maximum Bureaucracy'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setJargonLevel('moderate')}
                className={`py-1.5 px-2 rounded-md text-center text-xs font-medium border transition-all ${
                  jargonLevel === 'moderate'
                    ? 'bg-white text-indigo-900 border-indigo-500 shadow-2xs'
                    : 'bg-white/50 text-slate-600 border-slate-200 hover:bg-white'
                }`}
              >
                Moderate
              </button>
              <button
                type="button"
                onClick={() => setJargonLevel('heavy')}
                className={`py-1.5 px-2 rounded-md text-center text-xs font-medium border transition-all ${
                  jargonLevel === 'heavy'
                    ? 'bg-white text-indigo-900 border-indigo-500 shadow-2xs font-semibold'
                    : 'bg-white/50 text-slate-600 border-slate-200 hover:bg-white'
                }`}
              >
                Heavy (Recommended)
              </button>
              <button
                type="button"
                onClick={() => setJargonLevel('maximum')}
                className={`py-1.5 px-2 rounded-md text-center text-xs font-medium border transition-all ${
                  jargonLevel === 'maximum'
                    ? 'bg-white text-indigo-900 border-indigo-500 shadow-2xs font-semibold'
                    : 'bg-white/50 text-slate-600 border-slate-200 hover:bg-white'
                }`}
              >
                Maximum Jargon
              </button>
            </div>
          </div>

          {/* Role Card Behavioral Rules Enforcers */}
          <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={enforceLength}
                onChange={(e) => setEnforceLength(e.target.checked)}
                className="w-3.5 h-3.5 text-indigo-600 rounded"
              />
              <span className="text-[11px] font-medium">
                Enforce Role Card length limit (&lt;100–150 words)
              </span>
            </label>

            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200/60">
              <ShieldCheck className="w-3 h-3" />
              Zero Profanity &amp; Neutral Tone Enforced
            </span>
          </div>

          {/* Action Generate Button */}
          <div className="pt-2">
            <button
              id="btn-draft-letter"
              type="button"
              disabled={isGenerating}
              onClick={handleRunGenerate}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Corporate Letterhead Draft...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Generate Jargon-Infused Corporate Letter</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Ghostwriter Interview Chat (Interaction Loop from Role Card) */}
      {activeSubTab === 'chat' && (
        <div className="flex flex-col grow overflow-hidden">
          {/* Role Card Persona Badge */}
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Ghostwriter Persona: Empathetic Workplace Advocate &amp; Jargon Specialist
            </span>
            <span className="text-slate-400">Role Card Compliant</span>
          </div>

          {/* Messages list */}
          <div className="grow p-4 overflow-y-auto space-y-3.5 text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-3 leading-relaxed shadow-2xs ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* If assistant proposed a draft */}
                  {msg.suggestedDraft && (
                    <div className="mt-3 pt-2.5 border-t border-slate-300/80">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-slate-900 text-[11px]">
                          Proposed Letter Draft:
                        </span>
                        <button
                          onClick={() => onApplyChatDraft(msg.suggestedDraft!)}
                          className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-semibold flex items-center gap-1 shadow-2xs"
                        >
                          <ArrowRight className="w-3 h-3" />
                          Apply to Letterhead
                        </button>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-200 text-slate-700 font-serif text-[12px] max-h-40 overflow-y-auto">
                        {msg.suggestedDraft}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Ghostwriter is analyzing your perspective...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts based on Role Card Knowledge Base sticky notes */}
          <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-slate-400 font-medium shrink-0">
              Quick prompts:
            </span>
            <button
              onClick={() =>
                onSendMessageToGhostwriter(
                  'My boss laughed when I brought up workload concerns. Help me frame my resignation so it is sterile, unemotional, and bulletproof.'
                )
              }
              className="text-[11px] px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full shrink-0 whitespace-nowrap transition-colors"
            >
              "Boss dismissed my workload"
            </button>
            <button
              onClick={() =>
                onSendMessageToGhostwriter(
                  'Can you dial up the corporate jargon even more? Use terms like cross-functional synergy and bandwidth realignment.'
                )
              }
              className="text-[11px] px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full shrink-0 whitespace-nowrap transition-colors"
            >
              "Dial up the jargon"
            </button>
            <button
              onClick={() =>
                onSendMessageToGhostwriter(
                  'Make sure the letter stays strictly under 120 words to meet our Role Card length constraint.'
                )
              }
              className="text-[11px] px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full shrink-0 whitespace-nowrap transition-colors"
            >
              "Shorten &lt; 120 words"
            </button>
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendChat} className="p-3 border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Tell the ghostwriter what you're thinking or how to adjust..."
              className="grow px-3 py-2 text-xs border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg outline-hidden"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isChatLoading}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Direct Text Editor */}
      {activeSubTab === 'rawEditor' && (
        <div className="p-4 overflow-y-auto grow space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Subject Line
            </label>
            <input
              type="text"
              value={letter.subjectLine}
              onChange={(e) => onUpdateLetter({ subjectLine: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-md outline-hidden text-xs font-medium text-slate-900"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-800">
                Letter Body (with [Bracketed Placeholders])
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {letter.letterBody.trim().split(/\s+/).length} words
              </span>
            </div>
            <textarea
              rows={14}
              value={letter.letterBody}
              onChange={(e) => {
                const words = e.target.value.trim().split(/\s+/).length;
                onUpdateLetter({
                  letterBody: e.target.value,
                  wordCount: words,
                  isCompliantWithRoleCard: words <= 150,
                });
              }}
              className="w-full p-3 font-letterhead-serif text-sm leading-relaxed border border-slate-300 rounded-md outline-hidden text-slate-900"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">Editor Tip:</p>
            <p className="text-[11px]">
              Any phrase in brackets like <code className="font-mono bg-white px-1 py-0.5 border rounded">[Effective Date]</code> automatically becomes an interactive editable placeholder in the letter preview.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
