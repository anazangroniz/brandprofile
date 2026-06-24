import React, { useState } from "react";
import { BrandProfile, UploadedFile, BrandFormData } from "../types";
import { CheckCircle, Edit3, FileText, Copy, Check, BrainCircuit, PlusCircle, MinusCircle, AlertTriangle, Lightbulb, X } from "lucide-react";

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

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Profile Header */}
      <div className="bg-[#0a1a30] text-white p-8 md:p-12 rounded-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center pr-12 pointer-events-none hidden lg:flex">
          <BrainCircuit className="w-[160px] h-[160px]" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <CheckCircle className="w-4 h-4 text-green-400" /> Verified Strategic Asset
            </div>
            <button
              onClick={onBackToForm}
              className="cursor-pointer border border-white/30 hover:border-white text-white px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" /> Adjust Intelligence Parameters
            </button>
          </div>

          <p className="text-[#a9c2e0] text-sm uppercase font-bold tracking-wider mb-2">
            {brandData.industry} • {brandData.city && brandData.state ? `${brandData.city}, ${brandData.state}` : brandData.state || brandData.primaryMarketRegion || 'USA'}
          </p>
          <h2 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
            {brandData.brandName}
          </h2>
          <p className="text-xl md:text-2xl text-[#c5d8f0] italic font-light max-w-3xl mb-4">
            "{brandData.tagline || 'Simplifying Brand Horizon'}"
          </p>
          <div className="h-px bg-white/15 w-full my-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-slate-300">
            <div>
              <span className="block font-bold text-[10px] uppercase tracking-widest text-[#b6c7e7] mb-1">Company Backstory</span>
              <p className="leading-relaxed text-slate-100">{brandData.about || 'Not provided'}</p>
            </div>
            <div>
              <span className="block font-bold text-[10px] uppercase tracking-widest text-[#b6c7e7] mb-1">Extracted Reference Documents</span>
              {files.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {files.map(f => (
                    <span key={f.id} className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded text-xs text-white">
                      <FileText className="w-3 h-3 text-[#b6c7e7]" /> {f.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="italic text-slate-300 text-xs">None uploaded. Strategy mapped via digital footprint analysis.</p>
              )}
            </div>
            <div>
              <span className="block font-bold text-[10px] uppercase tracking-widest text-[#b6c7e7] mb-1">Uploaded Transcripts</span>
              {transcripts.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {transcripts.map(t => (
                    <span key={t.id} className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded text-xs text-white">
                      <FileText className="w-3 h-3 text-[#f0a9a9]" /> {t.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="italic text-slate-300 text-xs">No transcripts provided.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Core Positioning & Vision Statements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 md:p-10 border border-secondary/15 rounded-lg relative">
          <button
            onClick={() => copyToClipboard(profile.positioningStatement, "positioning")}
            className="absolute top-6 right-6 text-secondary hover:text-primary transition cursor-pointer"
            title="Copy Statement"
          >
            {copiedSection === "positioning" ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
          </button>
          <span className="block font-sans text-xs font-bold text-secondary uppercase tracking-widest mb-3">
            Authoritative Positioning Statement
          </span>
          <p className="font-headline text-lg md:text-xl text-primary leading-relaxed font-semibold">
            {profile.positioningStatement}
          </p>
        </div>

        <div className="bg-surface-container-lowest p-8 md:p-10 border border-secondary/15 rounded-lg relative flex flex-col justify-between">
          <button
            onClick={() => copyToClipboard(profile.visionStatement, "vision")}
            className="absolute top-6 right-6 text-secondary hover:text-primary transition cursor-pointer"
            title="Copy Statement"
          >
            {copiedSection === "vision" ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
          </button>
          <div>
            <span className="block font-sans text-xs font-bold text-secondary uppercase tracking-widest mb-3">
              Future Market Vision
            </span>
            <p className="font-sans text-md text-secondary leading-relaxed italic">
              "{profile.visionStatement}"
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-secondary/10 flex items-center gap-3">
            <BrainCircuit className="text-primary w-5 h-5" />
            <div>
              <span className="block text-[10px] text-secondary uppercase font-bold tracking-wider">Estimated Archetype</span>
              <span className="text-sm font-semibold text-primary">{profile.brandArchetype}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Voice Modifier & Competitive Edge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Brand Voice */}
        <div className="bg-surface-container-lowest p-8 border border-secondary/15 rounded-lg">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="font-headline text-xl font-bold text-primary">Identity Brand Voice</h3>
          </div>
          
          <div className="flex gap-2 mb-6">
            <span className="bg-primary/5 text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-primary/10">
              {profile.brandVoice.primaryAdjective}
            </span>
            <span className="bg-primary/5 text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-primary/10">
              {profile.brandVoice.secondaryAdjective}
            </span>
            <span className="bg-primary/5 text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-primary/10">
              {profile.brandVoice.tertiaryAdjective}
            </span>
          </div>

          <div className="bg-[#fafafc] p-4 rounded border border-secondary/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">Tone & Communication Rules</span>
            <p className="text-sm text-primary leading-relaxed whitespace-pre-line">
              {profile.brandVoice.guidelines}
            </p>
          </div>
        </div>

        {/* Competitive Edge */}
        <div className="bg-surface-container-lowest p-8 border border-secondary/15 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <h3 className="font-headline text-xl font-bold text-primary">Defense &amp; Competitive Edge</h3>
            </div>
            <p className="text-sm text-primary leading-relaxed">
              {profile.competitiveEdge}
            </p>
          </div>
          <div className="mt-6 bg-[#d4e4fa]/30 p-4 rounded border border-[#b8c8dd]">
            <span className="text-xs font-bold text-[#39485a] block mb-1">Strategic Realization</span>
            <span className="text-xs text-secondary leading-snug">
              Leverage internal capabilities and geographic parameters defined in metadata parameters to defend company positioning.
            </span>
          </div>
        </div>
      </div>

      {/* SWOT Analysis Grid */}
      <div className="bg-surface-container-lowest p-8 md:p-12 border border-secondary/15 rounded-lg">
        <div className="flex items-center gap-2 mb-8">
          <h3 className="font-headline text-xl font-bold text-primary">Strategic SWOT Matrix</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Strengths */}
          <div className="bg-green-50/50 p-6 rounded border border-green-200">
            <span className="block text-xs font-bold text-green-800 uppercase tracking-widest mb-3">Strengths (Internal)</span>
            <ul className="space-y-2">
              {profile.swot.strengths.map((item, idx) => (
                <li key={idx} className="text-sm text-green-950 flex items-start gap-2">
                  <PlusCircle className="text-green-600 w-4 h-4 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-amber-50/50 p-6 rounded border border-amber-200">
            <span className="block text-xs font-bold text-amber-800 uppercase tracking-widest mb-3">Weaknesses (Internal)</span>
            <ul className="space-y-2">
              {profile.swot.weaknesses.map((item, idx) => (
                <li key={idx} className="text-sm text-amber-950 flex items-start gap-2">
                  <MinusCircle className="text-amber-600 w-4 h-4 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="bg-blue-50/50 p-6 rounded border border-blue-200">
            <span className="block text-xs font-bold text-blue-800 uppercase tracking-widest mb-3">Opportunities (External)</span>
            <ul className="space-y-2">
              {profile.swot.opportunities.map((item, idx) => (
                <li key={idx} className="text-sm text-blue-950 flex items-start gap-2">
                  <Lightbulb className="text-blue-600 w-4 h-4 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="bg-red-50/50 p-6 rounded border border-red-200">
            <span className="block text-xs font-bold text-red-800 uppercase tracking-widest mb-3">Threats (External)</span>
            <ul className="space-y-2">
              {profile.swot.threats.map((item, idx) => (
                <li key={idx} className="text-sm text-red-950 flex items-start gap-2">
                  <AlertTriangle className="text-red-600 w-4 h-4 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Target Buyer Persona */}
      <div className="bg-surface-container-lowest p-8 md:p-12 border border-secondary/15 rounded-lg">
        <div className="flex items-center gap-2 mb-8">
          <h3 className="font-headline text-xl font-bold text-primary">Primary Buyer Persona Target</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-[#fafafc] p-6 rounded border border-secondary/10 flex flex-col justify-between items-center text-center">
            <div className="w-20 h-20 bg-secondary-container rounded-full overflow-hidden mb-4 border border-[#c5c6ce]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMZHPniajyf6nPRXhCkfGWuNWZWtx0vVP_HAXsbTMCu7jpY9SXOf7dfrIn17pPRnHW9a1OdTvph5qyADQWWMGoz_eJIApcn2X8HIG3WnwnCgL98-RuCQmMcf75Iv1iwzA2vbA4EMr9Wyi7g2BQmMLHwaFgkg_7FLfHPuBcmJHBIgOf8XSHvXXKjF0-WRpKmrAWoGDlcbgc4i0jH9t9LHUxjc3RY3kbuy8tL6zFzR78MdnrEmKSdI3jkkcfHuPPWf3Ep6pZQZREFlHv"
                alt="Persona face"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-headline text-lg font-bold text-primary mb-1">{profile.targetPersona.name}</h4>
              <p className="text-sm text-secondary font-medium mb-1">{profile.targetPersona.title}</p>
              <span className="inline-block bg-primary/5 text-primary text-xs px-2.5 py-0.5 border border-primary/10 rounded">
                Age: {profile.targetPersona.age}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <span className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Key Critical Pain Points</span>
              <ul className="space-y-2">
                {profile.targetPersona.painPoints.map((p, i) => (
                  <li key={i} className="text-sm text-secondary flex items-start gap-2">
                    <X className="text-[#ba1a1a] w-4 h-4 mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <span className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Core Buying Motivations</span>
              <ul className="space-y-2">
                {profile.targetPersona.buyingMotivations.map((m, i) => (
                  <li key={i} className="text-sm text-secondary flex items-start gap-2">
                    <CheckCircle className="text-green-600 w-4 h-4 mt-0.5 shrink-0" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Content Strategy Pillars */}
      <div className="bg-surface-container-lowest p-8 md:p-12 border border-secondary/15 rounded-lg">
        <div className="flex items-center gap-2 mb-8">
          <h3 className="font-headline text-xl font-bold text-primary">Content Marketing Pillars</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {profile.contentPillars.map((pillar, index) => (
            <div key={index} className="bg-surface-bright rounded border border-secondary/10 p-6 flex flex-col justify-between">
              <div>
                <span className="bg-primary/5 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-3">
                  Pillar {index + 1}
                </span>
                <h4 className="font-headline text-lg font-bold text-primary mb-2">
                  {pillar.title}
                </h4>
                <p className="text-sm text-secondary leading-relaxed mb-4">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-secondary/10 bg-[#fcedec]/40 p-3 rounded">
                <span className="block text-[9px] font-bold text-[#ba1a1a] uppercase tracking-widest mb-1">Narrative Hook / Idea</span>
                <p className="text-xs text-primary font-medium italic">
                  "{pillar.exampleTopic}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
