import React from "react";
import { CreatedBrand } from "../types";
import { ShieldCheck, Trash2, SearchX, ChevronRight } from "lucide-react";

interface EvidenceViewProps {
  scannedBrands: CreatedBrand[];
  onSelectBrand: (brand: CreatedBrand) => void;
  onClearHistory: () => void;
}

export default function EvidenceView({
  scannedBrands,
  onSelectBrand,
  onClearHistory,
}: EvidenceViewProps) {
  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Evidence Banner */}
      <div className="bg-surface-container p-8 rounded-lg border border-secondary/15 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/5 p-3 rounded-full border border-primary/10">
            <ShieldCheck className="text-primary w-8 h-8" />
          </div>
          <div>
            <h3 className="font-headline text-xl font-bold text-primary">Intelligence &amp; Evidence Log</h3>
            <p className="text-secondary text-sm max-w-xl">
              Centralized repository containing primary brand intelligence parameters, structured metadata, and audit records processed by the system.
            </p>
          </div>
        </div>
        {scannedBrands.length > 0 && (
          <button
            onClick={onClearHistory}
            className="cursor-pointer border border-red-200 text-[#ba1a1a] hover:bg-red-50 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" /> Purge Saved Scans
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scanned Brands List */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 border border-secondary/15 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-headline text-lg font-bold text-primary">Stored Scan Records</h4>
            <span className="bg-primary text-white text-xs px-2.5 py-1 rounded font-bold">
              {scannedBrands.length} Scans Found
            </span>
          </div>

          {scannedBrands.length === 0 ? (
            <div className="text-center py-12 text-secondary">
              <SearchX className="w-12 h-12 mb-3 mx-auto text-secondary" />
              <p className="font-medium">No brands have been scanned yet</p>
              <p className="text-xs max-w-sm mx-auto mt-1">
                Navigate back to the forms panel, key in your domain URL, scanned and generated reports will persist here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {scannedBrands.map((brand) => (
                <div
                  key={brand.id}
                  onClick={() => onSelectBrand(brand)}
                  className="p-5 bg-surface-bright border border-secondary/10 hover:border-primary/40 rounded transition-all cursor-pointer group flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block font-mono">
                      ID: {brand.id.substring(0, 8)}
                    </span>
                    <h5 className="font-headline text-lg font-bold text-primary group-hover:text-primary-container transition-colors">
                      {brand.name || "Untitled Brand"}
                    </h5>
                    <p className="text-xs text-secondary italic">
                      Domain: {brand.url || "N/A"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="block text-[10px] text-secondary font-bold uppercase">Scanned Time</span>
                      <span className="text-xs text-primary">{new Date(brand.timestamp).toLocaleString()}</span>
                    </div>

                    <ChevronRight className="text-secondary group-hover:translate-x-1 transition-transform w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Evidence Parameters card */}
        <div className="space-y-8">
          <div className="bg-surface-container-lowest p-8 border border-secondary/15 rounded-lg">
            <h4 className="font-headline text-md font-bold text-primary mb-4 uppercase tracking-wider">
              Verification Engine
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-secondary/10">
                <span className="text-secondary font-medium">Core Model Engine:</span>
                <span className="font-semibold text-primary">Gemini 3.5 Flash</span>
              </div>
              <div className="flex justify-between py-2 border-b border-secondary/10">
                <span className="text-secondary font-medium">Security Protocols:</span>
                <span className="font-semibold text-primary">Tier 4 Encrypted</span>
              </div>
              <div className="flex justify-between py-2 border-b border-secondary/10">
                <span className="text-secondary font-medium">Session Status:</span>
                <span className="font-semibold text-green-600 flex items-center gap-1">
                  Active
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-secondary font-medium">Integration Mode:</span>
                <span className="font-semibold text-primary">Full-Stack Server</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1a2b44] text-[#d5e3ff] p-6 rounded-lg border border-secondary/15">
            <h4 className="font-headline text-md font-bold mb-2">Evidence-First Assurance</h4>
            <p className="text-xs leading-relaxed opacity-80">
              When scanning domains using the BVM intelligence protocols, AI predictions are coupled with document guidelines. This guarantees that strategic positioning conforms with internal objectives and matches current global parameters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
