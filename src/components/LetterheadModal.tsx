import React, { useState } from 'react';
import { LetterheadConfig } from '../types';
import { X, Building2, Check, RotateCcw } from 'lucide-react';
import { DEFAULT_LETTERHEAD } from '../data/defaultTemplates';

interface LetterheadModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LetterheadConfig;
  onSave: (config: LetterheadConfig) => void;
}

export const LetterheadModal: React.FC<LetterheadModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<LetterheadConfig>({ ...config });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const handleReset = () => {
    setForm({ ...DEFAULT_LETTERHEAD });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Customize Corporate Letterhead
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto grow space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Company / Enterprise Legal Name
            </label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Department / Corporate Division
            </label>
            <input
              type="text"
              value={form.division}
              onChange={(e) => setForm({ ...form, division: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Corporate Tagline / Slogan
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Street Address &amp; Suite
              </label>
              <input
                type="text"
                value={form.streetAddress}
                onChange={(e) => setForm({ ...form, streetAddress: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                City, State, Zip
              </label>
              <input
                type="text"
                value={form.cityStateZip}
                onChange={(e) => setForm({ ...form, cityStateZip: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Direct Line Phone
              </label>
              <input
                type="text"
                value={form.directPhone}
                onChange={(e) => setForm({ ...form, directPhone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={form.officialEmail}
                onChange={(e) => setForm({ ...form, officialEmail: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Corporate Portal / Website
            </label>
            <input
              type="text"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Confidentiality Notice (Letterhead Footer)
            </label>
            <textarea
              rows={2}
              value={form.confidentialityNotice}
              onChange={(e) =>
                setForm({ ...form, confidentialityNotice: e.target.value })
              }
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Save Letterhead</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
