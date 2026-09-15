import React, { useState } from 'react';
import { ROLE_CARD_DATA } from '../data/roleCardData';
import {
  Network,
  Users,
  Shield,
  FileText,
  Send,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  FileCheck,
  Bookmark,
  ExternalLink,
} from 'lucide-react';

interface DiagramNode {
  id: string;
  title: string;
  subtitle: string;
  category: 'input' | 'ghostwriter' | 'rules' | 'jargon' | 'letterhead' | 'dispatch';
  icon: any;
  roleCardMapping: string;
  description: string;
  keyRules: string[];
  associatedStickies: string[];
}

const NODES: DiagramNode[] = [
  {
    id: 'node-intake',
    title: '1. User Intake & Perspective',
    subtitle: 'Vague input, emotional grievances, hesitation',
    category: 'input',
    icon: Users,
    roleCardMapping: 'Required Inputs: Tone -> Content -> Length -> Base Rules',
    description:
      'Captures the user\'s real feelings, frustrations with boss or client relations, and desired exit timeline without judgment.',
    keyRules: [
      'Accommodate vague or hesitant user inputs (Knowledge Base)',
      'Embrace the user perspective completely (Prompt Directive)',
      'Respect user ownership: User is in charge of direction (Boundaries)',
    ],
    associatedStickies: [
      'User is giving inputs which are vague. The writer writes down the information given by the user.',
      'Asking a lot of questions specific to the letter writer: Hesitant to tell the information, leave with style. Emotional support.',
      'User has demands being communicated to the writer.',
    ],
  },
  {
    id: 'node-interaction-loop',
    title: '2. Ghostwriter Socratic Loop',
    subtitle: 'Iterative questioning & empathetic listening',
    category: 'ghostwriter',
    icon: Cpu,
    roleCardMapping: 'Interaction Loop (Role Card)',
    description:
      'The ghostwriter assumes the formal letter structure and asks targeted follow-up questions to understand nuances before drafting.',
    keyRules: [
      'Ask questions according to standard resignation/workplace format',
      'Use words on own after understanding tone and user requirements',
      'Build continuously on earlier versions as user adds feedback',
      'Never disagree with the decision of the user (Does Not Do)',
    ],
    associatedStickies: [
      'Writer and then asks follow up questions. The follow up questions let the user give information.',
      'The writer is given instructions about the letter. The writer has built on the earlier version as user adds to the input.',
      'Writer asks questions when they can\'t understand.',
    ],
  },
  {
    id: 'node-constraints',
    title: '3. Role Card Constraints Filter',
    subtitle: '100-150 words, zero profanity, neutral tone',
    category: 'rules',
    icon: Shield,
    roleCardMapping: 'Behavioral Rules (Role Card)',
    description:
      'Rigid algorithmic guardrails that sanitize venting, enforce strict word economy, and guarantee impenetrable composure.',
    keyRules: [
      'MUST BE UNDER 100-150 WORDS (Strict Word Count Constraint)',
      'NOT TO USE CUSS WORDS (Zero Profanity Sanitizer)',
      'MAINTAIN A NEUTRAL TONE (Boardroom Composure)',
      'DO NOT CREATE DETAILS ON THEIR OWN (Stick to user facts)',
    ],
    associatedStickies: [
      'The writer is dictated the tone by the user.',
      'The employee is talking about her old job... The boss laughs. Convert to sterile neutral prose.',
    ],
  },
  {
    id: 'node-jargon',
    title: '4. Corporate Jargon Transformer',
    subtitle: 'Convert grievances into C-suite synergies',
    category: 'jargon',
    icon: Sparkles,
    roleCardMapping: 'User Prompt: "make them feel more corporate and use a bunch of jargon"',
    description:
      'Translates burnout, micromanagement, and scope creep into enterprise corporate buzzwords (operational realignment, bandwidth constraints).',
    keyRules: [
      'Replace quitting with "operational realignment & strategic pivot"',
      'Replace burnout with "professional bandwidth prioritization"',
      'Guarantee client peace-of-mind with "knowledge-transfer matrix"',
      'Insulate sender with diplomatic corporate armor',
    ],
    associatedStickies: [
      'Used words on their own after they understood the tone, and what the user wanted to say.',
      'The writer is making sure to accommodate the user\'s request.',
    ],
  },
  {
    id: 'node-letterhead',
    title: '5. Letterhead & Placeholders',
    subtitle: 'Branded stationery with [Bracketed Variables]',
    category: 'letterhead',
    icon: FileText,
    roleCardMapping: 'User Prompt: "corporate letterhead... editable placeholders for names/dates"',
    description:
      'Formats the letter into executive company stationery with verified reference IDs and interactive two-way placeholder binding.',
    keyRules: [
      'Insert bracketed placeholders: [Recipient Name], [Effective Date], [Designated Successor]',
      'Interactive bidirectional synchronization between fields and letter body',
      'Crisp letterhead with executive monogram, reference code, and confidentiality footer',
    ],
    associatedStickies: [
      'Knows the format of a letter.',
      'Still has the ability to make edits to the letter.',
    ],
  },
  {
    id: 'node-dispatch',
    title: '6. Finalization & Client Dispatch',
    subtitle: 'Verification audit, email mailto, corporate outbox',
    category: 'dispatch',
    icon: Send,
    roleCardMapping: 'User Prompt: "able to be sent to clients once finalized"',
    description:
      'Pre-flight placeholder audit ensuring zero unpopulated brackets remain before sending via mail client, secure outbox, or PDF print.',
    keyRules: [
      'Audit check for unpopulated [Placeholders]',
      'Generate mailto link with resolved letterhead text',
      'Simulate enterprise TLS secure outbox with delivery tracking ID',
      'Clean print styling for paper or PDF export',
    ],
    associatedStickies: [
      'Uses language that mirrors the user\'s requirement.',
      'Finalized output ready for client / boss submission.',
    ],
  },
];

export const SystemDiagram: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-constraints');
  const [viewRoleCardModal, setViewRoleCardModal] = useState<boolean>(false);

  const selectedNode = NODES.find((n) => n.id === selectedNodeId) || NODES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Network className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              System Architecture &amp; Role Card Engine
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Illustrating how the application translates the physical Role Card (<span className="font-semibold text-slate-700">Team: GREY, Chunzi, Vicky, Rohan</span>) into an automated AI ghostwriting pipeline with strict behavioral boundaries, 100-150 word constraints, corporate jargon synthesis, and client dispatch.
          </p>
        </div>

        <button
          onClick={() => setViewRoleCardModal(true)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-colors shadow-xs"
        >
          <Bookmark className="w-3.5 h-3.5 text-amber-400" />
          <span>View Physical Role Card Digital Twin</span>
        </button>
      </div>

      {/* Main Grid: Architecture Flow + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Diagram Flowchart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>End-to-End Pipeline Architecture</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Click any stage to inspect logic
            </span>
          </div>

          {/* Connected Flowchart Nodes */}
          <div className="space-y-3 relative my-auto">
            {NODES.map((node, index) => {
              const isSelected = selectedNodeId === node.id;
              const Icon = node.icon;

              return (
                <div key={node.id} className="relative">
                  <button
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 relative z-10 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/40 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="grow min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span
                          className={`font-bold text-xs sm:text-sm ${
                            isSelected ? 'text-indigo-950' : 'text-slate-900'
                          }`}
                        >
                          {node.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                          Stage 0{index + 1}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {node.subtitle}
                      </p>
                    </div>
                  </button>

                  {/* Flow Arrow between nodes */}
                  {index < NODES.length - 1 && (
                    <div className="flex justify-center py-1">
                      <div className="w-0.5 h-3 bg-slate-200" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Node Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Stage Inspector &amp; Logic
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {selectedNode.roleCardMapping}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
                {React.createElement(selectedNode.icon, { className: 'w-5 h-5' })}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{selectedNode.title}</h4>
                <p className="text-xs text-slate-500">{selectedNode.subtitle}</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/80 mb-4">
              {selectedNode.description}
            </p>

            {/* Behavioral Constraints Enforced */}
            <div className="space-y-2 mb-4">
              <h5 className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Enforced Behavioral Rules:</span>
              </h5>
              <div className="space-y-1.5">
                {selectedNode.keyRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-white border border-slate-200 text-[11px] text-slate-700 flex items-start gap-2 font-mono"
                  >
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sticky Notes Connection from Knowledge Base */}
            <div className="space-y-2">
              <h5 className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                <span>Associated Role Card Stickies (from Photo):</span>
              </h5>
              <div className="space-y-1.5">
                {selectedNode.associatedStickies.map((sticky, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 italic font-serif leading-snug"
                  >
                    "{sticky}"
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Status: Verified &amp; Compliant</span>
            <span>Role Card v1.0</span>
          </div>
        </div>
      </div>

      {/* Role Card Physical Twin Modal */}
      {viewRoleCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-300 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Computational Design Cookbook: From Play to Prototype
                </span>
                <h3 className="font-bold text-slate-900 text-lg">
                  ROLE CARD: RESIGNATION LETTER GHOSTWRITER
                </h3>
                <p className="text-xs text-slate-600 font-mono">
                  Team Members: {ROLE_CARD_DATA.teamMembers.join(', ')} • Date: September 03, 2026
                </p>
              </div>

              <button
                onClick={() => setViewRoleCardModal(false)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Close View
              </button>
            </div>

            {/* Role Card Body Form */}
            <div className="p-6 overflow-y-auto grow space-y-6 text-xs font-mono">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase text-indigo-700">
                    Purpose
                  </h4>
                  <p className="text-slate-800">{ROLE_CARD_DATA.purpose}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase text-indigo-700">
                    Engagement Context
                  </h4>
                  <p className="text-slate-800">{ROLE_CARD_DATA.engagementContext}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase text-emerald-700">
                    Behavioral Rules
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-800">
                    {ROLE_CARD_DATA.behavioralRules.map((rule, rIdx) => (
                      <li key={rIdx}>{rule}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase text-amber-700">
                    Boundaries &amp; Does Not Do
                  </h4>
                  <div className="space-y-1 text-slate-800">
                    <p className="font-semibold text-[11px] text-slate-600">Boundaries:</p>
                    {ROLE_CARD_DATA.boundaries.map((b, bIdx) => (
                      <p key={bIdx}>• {b}</p>
                    ))}
                    <p className="font-semibold text-[11px] text-slate-600 pt-1">Does Not Do:</p>
                    {ROLE_CARD_DATA.doesNotDo.map((d, dIdx) => (
                      <p key={dIdx}>• {d}</p>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase text-indigo-700">
                    Required Inputs &amp; Outputs
                  </h4>
                  <div className="space-y-1 text-slate-800">
                    <p className="font-semibold text-[11px] text-slate-600">Inputs:</p>
                    {ROLE_CARD_DATA.requiredInputs.map((i, iIdx) => (
                      <p key={iIdx}>→ {i}</p>
                    ))}
                    <p className="font-semibold text-[11px] text-slate-600 pt-1">Outputs:</p>
                    {ROLE_CARD_DATA.outputs.map((o, oIdx) => (
                      <p key={oIdx}>→ {o}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sticky Notes Replica Grid */}
              <div className="pt-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                  Knowledge Base Sticky Notes (Photo Transcript):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {ROLE_CARD_DATA.knowledgeBaseNotes.map((note, nIdx) => (
                    <div
                      key={nIdx}
                      className={`p-3.5 rounded-lg border shadow-xs transform rotate-[-0.5deg] hover:rotate-0 transition-transform ${
                        note.color === 'pink'
                          ? 'bg-rose-100/90 border-rose-300 text-rose-950 font-serif'
                          : 'bg-amber-100/90 border-amber-300 text-amber-950 font-serif'
                      }`}
                    >
                      <span className="block text-[9px] uppercase tracking-wider font-mono opacity-60 mb-1">
                        Sticky Note #{nIdx + 1}
                      </span>
                      <p className="leading-snug">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
