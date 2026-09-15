import React from 'react';
import { Tag, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

interface PlaceholderManagerProps {
  placeholders: Record<string, string>;
  onUpdatePlaceholder: (key: string, value: string) => void;
  onAutoPopulateDefaults: () => void;
}

export const PlaceholderManager: React.FC<PlaceholderManagerProps> = ({
  placeholders,
  onUpdatePlaceholder,
  onAutoPopulateDefaults,
}) => {
  const entries = Object.entries(placeholders);
  const filledCount = entries.filter(
    ([k, v]) => typeof v === 'string' && v.trim().length > 0 && v !== k
  ).length;
  const totalCount = entries.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-indigo-600" />
          <h3 className="font-semibold text-slate-900 text-sm">
            Editable Placeholders
          </h3>
          <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
            {filledCount}/{totalCount} completed
          </span>
        </div>

        <button
          onClick={onAutoPopulateDefaults}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
          title="Fill sample corporate placeholder values"
        >
          <Sparkles className="w-3 h-3" />
          Fill sample data
        </button>
      </div>

      <p className="text-xs text-slate-500 mb-3">
        Variables formatted in brackets <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-[11px]">[Like This]</code> update live in the corporate letter.
      </p>

      {entries.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg">
          <p className="text-xs text-slate-400">No bracketed placeholders found in current draft.</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          {entries.map(([key, value]) => {
            const isFilled =
              typeof value === 'string' && value.trim().length > 0 && value !== key;
            const cleanLabel = key.replace(/^\[|\]$/g, '');

            return (
              <div
                key={key}
                className="group p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-700 font-mono tracking-tight flex items-center gap-1.5">
                    {isFilled ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                    <span className="truncate max-w-[200px]" title={key}>{cleanLabel}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {isFilled ? 'Resolved' : 'Pending'}
                  </span>
                </div>

                <input
                  type="text"
                  value={value}
                  onChange={(e) => onUpdatePlaceholder(key, e.target.value)}
                  placeholder={`Enter ${cleanLabel}...`}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-md outline-hidden text-slate-900 placeholder:text-slate-400"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
