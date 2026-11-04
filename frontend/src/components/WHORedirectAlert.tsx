"use client";

import React, { useState } from "react";
import { ExternalLink, ShieldAlert, CheckCircle2, X } from "lucide-react";

interface WHORedirectAlertProps {
  showResults: boolean;
  targetUrl?: string;
}

export default function WHORedirectAlert({
  showResults,
  targetUrl = "https://www.who.int/health-topics/air-pollution",
}: WHORedirectAlertProps) {
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [consentGranted, setConsentGranted] = useState<boolean>(false);

  if (!showResults || dismissed) return null;

  const handleOpenWHOWithConsent = () => {
    setConsentGranted(true);
    // Explicit user-consented action: opens official WHO health portal in new tab
    if (typeof window !== "undefined") {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <aside
      aria-label="WHO Air Pollution Health Impact Advisory"
      className="max-w-5xl mx-auto px-4 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-7 border border-amber-500/40 bg-gradient-to-r from-amber-950/70 via-slate-900/95 to-amber-950/50 shadow-[0_0_30px_rgba(255,215,0,0.14)]">
        {/* Shimmer top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600"></div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          title="Dismiss advisory"
          aria-label="Dismiss advisory"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pr-6">
          {/* Advisory Content */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex-shrink-0 mt-0.5 shadow-[0_0_12px_rgba(255,215,0,0.2)]">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                  Global Health Advisory
                </span>
                <span className="text-xs text-slate-400">
                  World Health Organization (WHO)
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                Understand the health impact of these emissions
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Fine particulate matter (PM2.5) and sulfur dioxide penetrate deep into
                the pulmonary alveoli and enter the bloodstream. Click below to review the official
                World Health Organization guidance on air pollution exposure thresholds.
              </p>
            </div>
          </div>

          {/* Explicit User Consent Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto flex-shrink-0">
            {/* Primary Action Button (User Consent Required) */}
            <button
              type="button"
              onClick={handleOpenWHOWithConsent}
              className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-[0_0_18px_rgba(255,215,0,0.4)] hover:shadow-[0_0_26px_rgba(255,215,0,0.6)] cursor-pointer"
            >
              <span>Read WHO Guidelines</span>
              <ExternalLink className="w-4 h-4 text-slate-950" />
            </button>

            {/* Dismiss / Keep Exploring Button */}
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="px-4 py-3 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Stay on Page</span>
            </button>
          </div>
        </div>

        {consentGranted && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Opened official WHO Air Pollution Portal in a new tab.</span>
          </div>
        )}
      </div>
    </aside>
  );
}
