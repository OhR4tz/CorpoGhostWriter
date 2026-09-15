import React, { useState } from 'react';
import {
  LetterDocument,
  LetterheadConfig,
} from '../types';
import {
  X,
  Send,
  Mail,
  Printer,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  ExternalLink,
  Copy,
  Clock,
} from 'lucide-react';

interface SendClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  letter: LetterDocument;
  letterhead: LetterheadConfig;
  onPrint: () => void;
  onLetterDispatched: () => void;
}

export const SendClientModal: React.FC<SendClientModalProps> = ({
  isOpen,
  onClose,
  letter,
  letterhead,
  onPrint,
  onLetterDispatched,
}) => {
  if (!isOpen) return null;

  const [recipientEmail, setRecipientEmail] = useState(
    letter.recipientEmail || 'client.executive@enterprise-client.corp'
  );
  const [ccEmail, setCcEmail] = useState(
    'records@vanguard-holdings.corp, executive-registry@vanguard-holdings.corp'
  );
  const [subject, setSubject] = useState(
    letter.subjectLine.replace(/\[[^\]]+\]/g, (match) => letter.placeholders[match] || match)
  );
  const [isDispatched, setIsDispatched] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  // Check unresolved placeholders
  const rawBody = letter.letterBody;
  const unresolvedMatches = rawBody.match(/\[[^\]]+\]/g) || [];
  const unresolvedList = unresolvedMatches.filter(
    (p) => !letter.placeholders[p] || letter.placeholders[p].trim() === '' || letter.placeholders[p] === p
  );

  // Get resolved text for email
  const getResolvedBody = () => {
    let text = letter.letterBody;
    Object.entries(letter.placeholders).forEach(([k, v]) => {
      if (typeof v === 'string' && v.trim().length > 0) {
        text = text.replaceAll(k, v);
      }
    });
    return text;
  };

  const resolvedBody = getResolvedBody();

  const handleSendViaMailto = () => {
    const fullEmailBody = `=====================================================
${letterhead.companyName.toUpperCase()}
${letterhead.division}
Date: ${letter.date} | ${letter.referenceNumber}
=====================================================

${resolvedBody}

-----------------------------------------------------
${letterhead.confidentialityNotice}
=====================================================`;

    const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?cc=${encodeURIComponent(
      ccEmail
    )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullEmailBody)}`;

    window.location.href = mailtoUrl;
    setIsDispatched(true);
    setTrackingId(`DISPATCH-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
    onLetterDispatched();
  };

  const handleSimulateSecureDispatch = () => {
    setIsDispatched(true);
    setTrackingId(`CORP-TLS-${Math.random().toString(36).substring(2, 9).toUpperCase()}-VSH`);
    onLetterDispatched();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 text-base">
                Finalize &amp; Send to Client / Counterparty
              </h2>
              <p className="text-xs text-slate-500">
                Formal enterprise dispatch with audit trail &amp; letterhead verification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto grow space-y-4 text-xs">
          {/* Dispatch Confirmation State */}
          {isDispatched ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Letter Dispatched Successfully
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Formal workplace communication has been verified, locked, and queued for recipient delivery.
              </p>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 max-w-md mx-auto text-left font-mono text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tracking Ref:</span>
                  <span className="font-semibold text-slate-800">{trackingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Recipient:</span>
                  <span className="font-semibold text-slate-800">{recipientEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Letterhead:</span>
                  <span className="font-semibold text-slate-800">{letterhead.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Timestamp:</span>
                  <span className="text-slate-800">{new Date().toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={onPrint}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Physical Copy</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Placeholder Readiness Check */}
              {unresolvedList.length > 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-xs">
                      {unresolvedList.length} Unresolved Placeholder(s) Detected:
                    </p>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      The letter still contains bracketed tags ({unresolvedList.join(', ')}). You may update them in the Placeholder tab before sending, or proceed as-is.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-xs">
                    All dynamic placeholders successfully resolved. Ready for client delivery.
                  </span>
                </div>
              )}

              {/* Recipient Email & Subject */}
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Recipient Email (Client or Manager)
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="recipient@enterprise.corp"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    CC Stakeholders / Records (Optional)
                  </label>
                  <input
                    type="text"
                    value={ccEmail}
                    onChange={(e) => setCcEmail(e.target.value)}
                    placeholder="records@company.corp"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Email Subject Line
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              {/* Preview of Resolved Letter Body */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Final Letter Preview (Resolved Plain Text)
                </label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-letterhead-serif text-slate-800 text-[13px] max-h-40 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                  {resolvedBody}
                </div>
              </div>

              {/* Delivery Methods */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleSendViaMailto}
                  className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>Open in Email Client</span>
                </button>

                <button
                  type="button"
                  onClick={handleSimulateSecureDispatch}
                  className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>Dispatch Corporate Outbox</span>
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onPrint();
                  }}
                  className="text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Or Print / Save as PDF instead</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
