import React, { useState } from "react";
import { BrandProfile, UploadedFile, BrandFormData } from "../types";
import {
  CheckCircle, Edit3, FileText, Copy, Check, BrainCircuit,
  PlusCircle, MinusCircle, AlertTriangle, Lightbulb, X,
  MapPin, ShoppingBag, Megaphone, ShieldOff, BadgeCheck,
  Table2, LayoutDashboard, ExternalLink,
} from "lucide-react";

interface ProfileViewProps {
  profile: BrandProfile;
  brandData: BrandFormData;
  files: UploadedFile[];
  transcripts?: UploadedFile[];
  onBackToForm: () => void;
}

export default function ProfileView({
  profile,
  brandData,
  files,
  transcripts = [],
  onBackToForm,
}: ProfileViewProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"profile" | "evidence">("profile");

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const { business_context, offerings, service_areas, audience_context, positioning,
    voice_and_tone, offers_and_ctas, industry_context, content_guidance,
    objections, restrictions, approved_facts, source_references } = profile;

  return (
    <div className="space-y-12 animate-fadeIn">

      {/* ── View toggle ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode("profile")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            viewMode === "profile"
              ? "bg-primary text-white"
              : "bg-surface-container-lowest border border-secondary/20 text-secondary hover:text-primary"
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" /> Profile View
        </button>
        <button
          onClick={() => setViewMode("evidence")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            viewMode === "evidence"
              ? "bg-primary text-white"
              : "bg-surface-container-lowest border border-secondary/20 text-secondary hover:text-primary"
          }`}
        >
          <Table2 className="w-3.5 h-3.5" /> Evidence Table
        </button>
      </div>

      {/* ── Evidence traceability table ── */}
      {viewMode === "evidence" && (
        <div className="animate-fadeIn">
          <div className="mb-4">
            <h3 className="font-headline text-xl font-bold text-primary mb-1">
              Extracted Profile — evidence traceability
            </h3>
            <p className="text-xs text-secondary">
              Every value shown with the source snippet + URL it came from. Unsupported fields were left null (not shown).
            </p>
          </div>
          <div className="overflow-x-auto rounded-lg border border-secondary/15">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#f8fafc]">
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-secondary border-b border-secondary/15 w-48">Field</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-secondary border-b border-secondary/15 w-48">Value</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-secondary border-b border-secondary/15 w-12">Conf.</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-secondary border-b border-secondary/15">Evidence Snippet</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-secondary border-b border-secondary/15 w-40">Source</th>
                </tr>
              </thead>
              <tbody>
                {profile._evidence.filter(r => r.value !== null).map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}>
                    <td className="px-4 py-3 border-b border-secondary/10 align-top">
                      <code className="text-[11px] text-[#2563eb] font-mono">{row.field}</code>
                    </td>
                    <td className="px-4 py-3 border-b border-secondary/10 align-top text-xs text-primary font-medium">
                      {row.value}
                    </td>
                    <td className="px-4 py-3 border-b border-secondary/10 align-top">
                      <span className={`text-xs font-bold tabular-nums ${
                        row.confidence >= 0.9 ? "text-green-700" :
                        row.confidence >= 0.75 ? "text-amber-700" : "text-red-600"
                      }`}>
                        {row.confidence.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-secondary/10 align-top">
                      {row.evidenceSnippet ? (
                        <p className="text-xs text-secondary italic leading-relaxed">{row.evidenceSnippet}</p>
                      ) : (
                        <span className="text-[10px] text-secondary/40">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 border-b border-secondary/10 align-top">
                      {row.sourceUrl ? (
                        <a
                          href={row.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-[#2563eb] hover:underline flex items-center gap-1 break-all"
                        >
                          {row.sourceUrl.replace(/^https?:\/\//, "").split("/")[0]}
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-secondary/40">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === "profile" && <>

      {/* ── Profile Header ── */}
      <div className="bg-[#0a1a30] text-white p-8 md:p-12 rounded-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center pr-12 pointer-events-none hidden lg:flex">
          <BrainCircuit className="w-[160px] h-[160px]" />
        </div>
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <CheckCircle className="w-4 h-4 text-green-400" /> Context Object Generated
            </div>
            <button
              onClick={onBackToForm}
              className="cursor-pointer border border-white/30 hover:border-white text-white px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" /> Adjust Parameters
            </button>
          </div>
          <p className="text-[#a9c2e0] text-sm uppercase font-bold tracking-wider mb-2">
            {business_context.category} • {brandData.city && brandData.state
              ? `${brandData.city}, ${brandData.state}`
              : brandData.state || brandData.primaryMarketRegion || "USA"}
          </p>
          <h2 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
            {business_context.brandName}
          </h2>
          <p className="text-xl md:text-2xl text-[#c5d8f0] italic font-light max-w-3xl mb-4">
            "{brandData.tagline || "Simplifying Brand Horizon"}"
          </p>
          <div className="h-px bg-white/15 w-full my-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-slate-300">
            <div>
              <span className="block font-bold text-[10px] uppercase tracking-widest text-[#b6c7e7] mb-1">About</span>
              <p className="leading-relaxed text-slate-100">{business_context.about}</p>
            </div>
            <div>
              <span className="block font-bold text-[10px] uppercase tracking-widest text-[#b6c7e7] mb-1">Source References</span>
              {source_references.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {source_references.map((ref, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded text-xs text-white">
                      <FileText className="w-3 h-3 text-[#b6c7e7]" /> {ref.type}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="italic text-slate-300 text-xs">No external references scanned.</p>
              )}
            </div>
            <div>
              <span className="block font-bold text-[10px] uppercase tracking-widest text-[#b6c7e7] mb-1">Uploaded Documents</span>
              {files.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {files.map(f => (
                    <span key={f.id} className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded text-xs text-white">
                      <FileText className="w-3 h-3 text-[#f0a9a9]" /> {f.name}
                    </span>
                  ))}
                  {transcripts.map(t => (
                    <span key={t.id} className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded text-xs text-white">
                      <FileText className="w-3 h-3 text-[#f0a9a9]" /> {t.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="italic text-slate-300 text-xs">None uploaded. Strategy mapped via digital footprint.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Positioning + Vision + Archetype ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 md:p-10 border border-secondary/15 rounded-lg relative">
          <button
            onClick={() => copyToClipboard(positioning.positioningStatement, "positioning")}
            className="absolute top-6 right-6 text-secondary hover:text-primary transition cursor-pointer"
          >
            {copiedSection === "positioning" ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
          </button>
          <span className="block font-sans text-xs font-bold text-secondary uppercase tracking-widest mb-3">
            positioning
          </span>
          <p className="font-headline text-lg md:text-xl text-primary leading-relaxed font-semibold">
            {positioning.positioningStatement}
          </p>
        </div>
        <div className="bg-surface-container-lowest p-8 md:p-10 border border-secondary/15 rounded-lg relative flex flex-col justify-between">
          <button
            onClick={() => copyToClipboard(positioning.visionStatement, "vision")}
            className="absolute top-6 right-6 text-secondary hover:text-primary transition cursor-pointer"
          >
            {copiedSection === "vision" ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
          </button>
          <div>
            <span className="block font-sans text-xs font-bold text-secondary uppercase tracking-widest mb-3">
              vision_statement
            </span>
            <p className="font-sans text-md text-secondary leading-relaxed italic">
              "{positioning.visionStatement}"
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-secondary/10 flex items-center gap-3">
            <BrainCircuit className="text-primary w-5 h-5" />
            <div>
              <span className="block text-[10px] text-secondary uppercase font-bold tracking-wider">brand_archetype</span>
              <span className="text-sm font-semibold text-primary">{positioning.brandArchetype}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Voice & Tone + Competitive Edge ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest p-8 border border-secondary/15 rounded-lg">
          <span className="block font-sans text-xs font-bold text-secondary uppercase tracking-widest mb-4">
            voice_and_tone
          </span>
          <div className="flex flex-wrap gap-2 mb-4">
            {[voice_and_tone.primaryAdjective, voice_and_tone.secondaryAdjective, voice_and_tone.tertiaryAdjective].map((adj) => (
              <span key={adj} className="bg-primary/5 text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-primary/10">
                {adj}
              </span>
            ))}
            <span className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-1.5 rounded-full border border-secondary/10">
              {voice_and_tone.designDirection}
            </span>
          </div>
          <div className="bg-[#fafafc] p-4 rounded border border-secondary/10 mb-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">guidelines</span>
            <p className="text-sm text-primary leading-relaxed whitespace-pre-line">{voice_and_tone.guidelines}</p>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary mr-1">brand colors</span>
            {Object.entries(voice_and_tone.colors).map(([key, hex]) => (
              <div key={key} className="group relative">
                <div className="w-7 h-7 rounded border border-secondary/20 cursor-default" style={{ background: hex }} />
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] bg-primary text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                  {hex}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 border border-secondary/15 rounded-lg flex flex-col justify-between">
          <div>
            <span className="block font-sans text-xs font-bold text-secondary uppercase tracking-widest mb-4">
              positioning.competitive_edge
            </span>
            <p className="text-sm text-primary leading-relaxed">{positioning.competitiveEdge}</p>
          </div>
          <div className="mt-6 bg-[#d4e4fa]/30 p-4 rounded border border-[#b8c8dd]">
            <span className="text-xs font-bold text-[#39485a] block mb-2">buying_factors</span>
            <ul className="space-y-1">
              {offerings.buyingFactors.map((f, i) => (
                <li key={i} className="text-xs text-secondary flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-green-600 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Offerings + CTAs ── */}
      <div className="bg-surface-container-lowest p-8 md:p-12 border border-secondary/15 rounded-lg">
        <div className="flex items-center gap-2 mb-8">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <span className="font-sans text-xs font-bold text-secondary uppercase tracking-widest">offerings + offers_and_ctas</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <span className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Services</span>
            <div className="space-y-2">
              {offerings.services.map((s, i) => (
                <div key={i} className="flex items-center justify-between bg-[#fafafc] px-4 py-2.5 rounded border border-secondary/10">
                  <div className="flex items-center gap-2">
                    {s.mostProfitable && <span className="text-[9px] font-bold bg-green-100 text-green-800 px-1.5 py-0.5 rounded">TOP</span>}
                    <span className="text-sm text-primary font-medium">{s.name}</span>
                  </div>
                  {s.priceRange && <span className="text-xs text-secondary">{s.priceRange}</span>}
                </div>
              ))}
            </div>
            {offerings.availability.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {offerings.availability.map((a, i) => (
                  <span key={i} className="text-[10px] font-bold bg-secondary/10 text-secondary px-2 py-1 rounded">{a}</span>
                ))}
              </div>
            )}
          </div>
          <div>
            <span className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">Calls to Action</span>
            <div className="space-y-3 mb-4">
              <div className="bg-primary text-white px-5 py-3 rounded flex items-center justify-between">
                <span className="text-sm font-bold">{offers_and_ctas.primaryCta.wording}</span>
                <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded font-bold uppercase">{offers_and_ctas.primaryCta.type}</span>
              </div>
              <div className="bg-[#fafafc] border border-secondary/15 px-5 py-3 rounded flex items-center justify-between">
                <span className="text-sm font-medium text-primary">{offers_and_ctas.secondaryCta.wording}</span>
                <span className="text-[9px] bg-secondary/10 text-secondary px-2 py-0.5 rounded font-bold uppercase">{offers_and_ctas.secondaryCta.type}</span>
              </div>
            </div>
            {offers_and_ctas.specialOffers.length > 0 && (
              <div>
                <span className="block text-[10px] font-bold text-secondary uppercase tracking-wider mb-2">Special Offers</span>
                {offers_and_ctas.specialOffers.map((o, i) => (
                  <p key={i} className="text-xs text-secondary flex items-center gap-1.5">
                    <Megaphone className="w-3 h-3 text-primary shrink-0" /> {o}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Audience Context ── */}
      <div className="bg-surface-container-lowest p-8 md:p-12 border border-secondary/15 rounded-lg">
        <span className="block font-sans text-xs font-bold text-secondary uppercase tracking-widest mb-8">audience_context</span>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-[#fafafc] p-6 rounded border border-secondary/10 flex flex-col justify-between items-center text-center">
            <div className="w-20 h-20 bg-secondary-container rounded-full overflow-hidden mb-4 border border-[#c5c6ce]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMZHPniajyf6nPRXhCkfGWuNWZWtx0vVP_HAXsbTMCu7jpY9SXOf7dfrIn17pPRnHW9a1OdTvph5qyADQWWMGoz_eJIApcn2X8HIG3WnwnCgL98-RuCQmMcf75Iv1iwzA2vbA4EMr9Wyi7g2BQmMLHwaFgkg_7FLfHPuBcmJHBIgOf8XSHvXXKjF0-WRpKmrAWoGDlcbgc4i0jH9t9LHUxjc3RY3kbuy8tL6zFzR78MdnrEmKSdI3jkkcfHuPPWf3Ep6pZQZREFlHv"
                alt="Persona"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-headline text-lg font-bold text-primary mb-1">{audience_context.personaName}</h4>
              <p className="text-sm text-secondary font-medium mb-1">{audience_context.personaTitle}</p>
              <span className="inline-block bg-primary/5 text-primary text-xs px-2.5 py-0.5 border border-primary/10 rounded">
                Age: {audience_context.personaAge}
              </span>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <span className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Pain Points</span>
              <ul className="space-y-2">
                {audience_context.painPoints.map((p, i) => (
                  <li key={i} className="text-sm text-secondary flex items-start gap-2">
                    <X className="text-[#ba1a1a] w-4 h-4 mt-0.5 shrink-0" /> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Segments</span>
              {audience_context.customerSegments.map((s, i) => (
                <div key={i} className="flex items-center gap-2 mb-1.5">
                  <div className="flex-1 h-1.5 bg-secondary/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary/40 rounded-full" style={{ width: `${s.percent || 33}%` }} />
                  </div>
                  <span className="text-xs text-secondary w-28 shrink-0">{s.segment}</span>
                  {s.percent && <span className="text-[10px] font-bold text-secondary w-7 text-right">{s.percent}%</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <span className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Buying Motivations</span>
              <ul className="space-y-2">
                {audience_context.buyingMotivations.map((m, i) => (
                  <li key={i} className="text-sm text-secondary flex items-start gap-2">
                    <CheckCircle className="text-green-600 w-4 h-4 mt-0.5 shrink-0" /> {m}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Customer Profile</span>
              <p className="text-sm text-secondary leading-relaxed">{audience_context.customerProfile}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Service Areas ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest p-8 border border-secondary/15 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-sans text-xs font-bold text-secondary uppercase tracking-widest">service_areas</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {service_areas.areas.map((a, i) => (
              <span key={i} className="text-xs font-medium bg-primary/5 text-primary border border-primary/10 px-3 py-1 rounded-full">
                {a}
              </span>
            ))}
          </div>
          {service_areas.locations.filter(l => l.address).map((loc, i) => (
            <div key={i} className="bg-[#fafafc] p-3 rounded border border-secondary/10 text-xs text-secondary">
              {loc.address && <p>{loc.address}</p>}
              {loc.phone && <p>{loc.phone}</p>}
              {loc.email && <p>{loc.email}</p>}
            </div>
          ))}
        </div>

        {/* Approved Facts */}
        <div className="bg-surface-container-lowest p-8 border border-secondary/15 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <BadgeCheck className="w-4 h-4 text-green-600" />
            <span className="font-sans text-xs font-bold text-secondary uppercase tracking-widest">approved_facts</span>
          </div>
          <ul className="space-y-2">
            {approved_facts.map((fact, i) => (
              <li key={i} className="text-sm text-primary flex items-start gap-2">
                <BadgeCheck className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> {fact}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── SWOT + Industry Context ── */}
      <div className="bg-surface-container-lowest p-8 md:p-12 border border-secondary/15 rounded-lg">
        <span className="block font-sans text-xs font-bold text-secondary uppercase tracking-widest mb-2">industry_context.swot</span>
        <p className="text-sm text-secondary mb-8 max-w-3xl">{industry_context.summary}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-green-50/50 p-6 rounded border border-green-200">
            <span className="block text-xs font-bold text-green-800 uppercase tracking-widest mb-3">Strengths</span>
            <ul className="space-y-2">
              {industry_context.swot.strengths.map((item, i) => (
                <li key={i} className="text-sm text-green-950 flex items-start gap-2">
                  <PlusCircle className="text-green-600 w-4 h-4 mt-0.5 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-50/50 p-6 rounded border border-amber-200">
            <span className="block text-xs font-bold text-amber-800 uppercase tracking-widest mb-3">Weaknesses</span>
            <ul className="space-y-2">
              {industry_context.swot.weaknesses.map((item, i) => (
                <li key={i} className="text-sm text-amber-950 flex items-start gap-2">
                  <MinusCircle className="text-amber-600 w-4 h-4 mt-0.5 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-50/50 p-6 rounded border border-blue-200">
            <span className="block text-xs font-bold text-blue-800 uppercase tracking-widest mb-3">Opportunities</span>
            <ul className="space-y-2">
              {industry_context.swot.opportunities.map((item, i) => (
                <li key={i} className="text-sm text-blue-950 flex items-start gap-2">
                  <Lightbulb className="text-blue-600 w-4 h-4 mt-0.5 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50/50 p-6 rounded border border-red-200">
            <span className="block text-xs font-bold text-red-800 uppercase tracking-widest mb-3">Threats</span>
            <ul className="space-y-2">
              {industry_context.swot.threats.map((item, i) => (
                <li key={i} className="text-sm text-red-950 flex items-start gap-2">
                  <AlertTriangle className="text-red-600 w-4 h-4 mt-0.5 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <span className="block text-xs font-bold text-secondary uppercase tracking-widest mb-3">Industry Trends</span>
          <div className="flex flex-wrap gap-2">
            {industry_context.trends.map((t, i) => (
              <span key={i} className="text-xs bg-secondary/10 text-secondary px-3 py-1.5 rounded border border-secondary/10">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content Guidance ── */}
      <div className="bg-surface-container-lowest p-8 md:p-12 border border-secondary/15 rounded-lg">
        <span className="block font-sans text-xs font-bold text-secondary uppercase tracking-widest mb-8">content_guidance.pillars</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content_guidance.pillars.map((pillar, index) => (
            <div key={index} className="bg-surface-bright rounded border border-secondary/10 p-6 flex flex-col justify-between">
              <div>
                <span className="bg-primary/5 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-3">
                  Pillar {index + 1}
                </span>
                <h4 className="font-headline text-lg font-bold text-primary mb-2">{pillar.title}</h4>
                <p className="text-sm text-secondary leading-relaxed mb-4">{pillar.description}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-secondary/10 bg-[#fcedec]/40 p-3 rounded">
                <span className="block text-[9px] font-bold text-[#ba1a1a] uppercase tracking-widest mb-1">Narrative Hook</span>
                <p className="text-xs text-primary font-medium italic">"{pillar.exampleTopic}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Restrictions + Objections ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest p-8 border border-secondary/15 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <ShieldOff className="w-4 h-4 text-[#ba1a1a]" />
            <span className="font-sans text-xs font-bold text-secondary uppercase tracking-widest">restrictions</span>
          </div>
          {restrictions.notesAvoid && (
            <p className="text-sm text-secondary mb-4 bg-red-50/50 border border-red-100 p-3 rounded">{restrictions.notesAvoid}</p>
          )}
          <span className="block text-[10px] font-bold text-secondary uppercase tracking-wider mb-2">do_not_say</span>
          <div className="flex flex-wrap gap-2">
            {restrictions.do_not_say.map((term, i) => (
              <span key={i} className="text-xs font-medium bg-red-50 text-[#ba1a1a] border border-red-200 px-3 py-1 rounded line-through">
                {term}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 border border-secondary/15 rounded-lg">
          <span className="block font-sans text-xs font-bold text-secondary uppercase tracking-widest mb-4">objections</span>
          <ul className="space-y-3">
            {objections.map((obj, i) => (
              <li key={i} className="text-sm text-secondary flex items-start gap-2 bg-amber-50/40 border border-amber-100 p-3 rounded">
                <AlertTriangle className="text-amber-600 w-4 h-4 mt-0.5 shrink-0" /> {obj}
              </li>
            ))}
          </ul>
        </div>
      </div>

      </> }

    </div>
  );
}
