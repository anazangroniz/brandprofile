import React, { useState, useEffect } from "react";
import { BrandFormData, BrandProfile, UploadedFile, CreatedBrand } from "./types";
import { Bell, Settings2, Info } from "lucide-react";
import FormSection from "./components/FormSection";
import ProfileView from "./components/ProfileView";
import EvidenceView from "./components/EvidenceView";

const initialFormData: BrandFormData = {
  url: "",
  brandName: "",
  industry: "",
  tagline: "",
  about: "",
  city: "",
  state: "",
  primaryMarketRegion: "",
  facebook: "",
  instagram: "",
  googleBusiness: "",
  socialContext: "",
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"forms" | "evidence" | "extracted">("forms");
  const [formData, setFormData] = useState<BrandFormData>(initialFormData);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadedTranscripts, setUploadedTranscripts] = useState<UploadedFile[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeProfile, setActiveProfile] = useState<BrandProfile | null>(null);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
  
  // Track list of scanned brands
  const [scannedBrands, setScannedBrands] = useState<CreatedBrand[]>(() => {
    const saved = localStorage.getItem("bvm_scanned_brands");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("bvm_scanned_brands", JSON.stringify(scannedBrands));
  }, [scannedBrands]);

  const handleFormDataChange = (data: Partial<BrandFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleScanDomain = async () => {
    if (!formData.url) return;
    setIsScanning(true);
    try {
      const res = await fetch("/api/scan-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formData.url }),
      });
      if (res.ok) {
        const result = await res.json();
        setFormData((prev) => ({
          ...prev,
          brandName: result.brandName || prev.brandName,
          industry: result.industry || prev.industry,
          tagline: result.tagline || prev.tagline,
          about: result.about || prev.about,
          city: result.city || prev.city,
          state: result.state || result.primaryMarketRegion || prev.state,
          primaryMarketRegion: result.state || result.primaryMarketRegion || prev.primaryMarketRegion,
          facebook: result.facebook || prev.facebook,
          instagram: result.instagram || prev.instagram,
          googleBusiness: result.googleBusiness || prev.googleBusiness,
          socialContext: result.socialContext || prev.socialContext,
        }));
      }
    } catch (e) {
      console.error("Scanning failed, utilizing graceful fallbacks", e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddFiles = (files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2) + " MB",
      type: f.type,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAddTranscripts = (files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2) + " MB",
      type: f.type,
    }));
    setUploadedTranscripts((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveTranscript = (id: string) => {
    setUploadedTranscripts((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const payload = {
        ...formData,
        documentNames: uploadedFiles.map((f) => f.name),
        transcriptNames: uploadedTranscripts.map((f) => f.name),
      };

      const res = await fetch("/api/run-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const profileResult: BrandProfile = await res.json();
        setActiveProfile(profileResult);

        // Add to history
        const newBrand: CreatedBrand = {
          id: Math.random().toString(36).substring(2, 9),
          name: formData.brandName || "Extracted Brand Scan",
          url: formData.url,
          timestamp: new Date().toISOString(),
          formData: { ...formData },
          profile: profileResult,
          files: [...uploadedFiles],
          transcripts: [...uploadedTranscripts],
        };

        setScannedBrands((prev) => [newBrand, ...prev]);
        setActiveTab("extracted");
      }
    } catch (error) {
      console.error("Strategy generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectBrand = (brand: CreatedBrand) => {
    setFormData(brand.formData);
    setUploadedFiles(brand.files);
    setUploadedTranscripts(brand.transcripts || []);
    if (brand.profile) {
      setActiveProfile(brand.profile);
      setActiveTab("extracted");
    } else {
      setActiveTab("forms");
    }
  };

  const handleClearHistory = () => {
    setShowPurgeConfirm(true);
  };

  return (
    <div className="bg-surface text-on-surface font-sans overflow-x-hidden selection:bg-primary-fixed selection:text-primary min-h-screen flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="bg-surface-bright sticky top-0 z-50 flex justify-between items-center w-full px-5 md:px-16 py-4 border-b border-secondary/15">
        <div className="flex items-center gap-3">
          <span className="font-headline text-2xl font-extrabold text-primary tracking-tight">
            BVM Profiler
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => setActiveTab("forms")}
            className={`cursor-pointer font-bold pb-1 font-headline text-md border-b-2 transition-all ${
              activeTab === "forms"
                ? "text-primary border-primary"
                : "text-secondary border-transparent hover:text-primary"
            }`}
          >
            Forms
          </button>
          <button
            onClick={() => setActiveTab("evidence")}
            className={`cursor-pointer font-bold pb-1 font-headline text-md border-b-2 transition-all ${
              activeTab === "evidence"
                ? "text-primary border-primary"
                : "text-secondary border-transparent hover:text-primary"
            }`}
          >
            Evidence
          </button>
          <button
            onClick={() => {
              if (activeProfile) {
                setActiveTab("extracted");
              } else if (scannedBrands.length > 0 && scannedBrands[0].profile) {
                setActiveProfile(scannedBrands[0].profile);
                setFormData(scannedBrands[0].formData);
                setUploadedFiles(scannedBrands[0].files);
                setActiveTab("extracted");
              } else {
                setActiveTab("extracted");
              }
            }}
            className={`cursor-pointer font-bold pb-1 font-headline text-md border-b-2 transition-all ${
              activeTab === "extracted"
                ? "text-primary border-primary"
                : "text-secondary border-transparent hover:text-primary"
            }`}
          >
            Extracted Profile
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 text-secondary hover:text-primary transition-colors cursor-pointer rounded-full hover:bg-secondary/10">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-secondary hover:text-primary transition-colors cursor-pointer rounded-full hover:bg-secondary/10">
            <Settings2 className="w-5 h-5" />
          </button>
          
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border border-[#c5c6ce]">
            <img
              className="w-full h-full object-cover"
              alt="Professional Headshot"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMZHPniajyf6nPRXhCkfGWuNWZWtx0vVP_HAXsbTMCu7jpY9SXOf7dfrIn17pPRnHW9a1OdTvph5qyADQWWMGoz_eJIApcn2X8HIG3WnwnCgL98-RuCQmMcf75Iv1iwzA2vbA4EMr9Wyi7g2BQmMLHwaFgkg_7FLfHPuBcmJHBIgOf8XSHvXXKjF0-WRpKmrAWoGDlcbgc4i0jH9t9LHUxjc3RY3kbuy8tL6zFzR78MdnrEmKSdI3jkkcfHuPPWf3Ep6pZQZREFlHv"
            />
          </div>
        </div>
      </header>

      {/* Main content wrapper */}
      <main className="max-w-7xl mx-auto px-5 md:px-16 py-12 md:py-20 flex-grow w-full">
        {/* Page Header */}
        <div className="mb-16">
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-primary mb-4">
            {activeTab === "forms" && "Intelligent Profiling Dashboard"}
            {activeTab === "evidence" && "Evidence & Stored Audits"}
            {activeTab === "extracted" && "Extracted Strategy Asset"}
          </h1>
          <p className="font-sans text-md md:text-lg text-secondary max-w-2xl">
            {activeTab === "forms" &&
              "Consolidate your brand intelligence into a single authoritative profile. Complete the sections below to initiate the deep-scan profiling engine."}
            {activeTab === "evidence" &&
              "Inspect scanned domains, processed document guidelines, and full audit logs of verified brand strategic profiles."}
            {activeTab === "extracted" &&
              "Your complete, deep-scan strategic brand roadmap. Refined via corporate parameters and document guidelines."}
          </p>
        </div>

        {/* Dynamic Panels */}
        {activeTab === "forms" && (
          <FormSection
            formData={formData}
            onChange={handleFormDataChange}
            onScan={handleScanDomain}
            isScanning={isScanning}
            uploadedFiles={uploadedFiles}
            onAddFiles={handleAddFiles}
            onRemoveFile={handleRemoveFile}
            uploadedTranscripts={uploadedTranscripts}
            onAddTranscripts={handleAddTranscripts}
            onRemoveTranscript={handleRemoveTranscript}
            onSubmit={handleSubmitProfile}
            isGenerating={isGenerating}
          />
        )}

        {activeTab === "evidence" && (
          <EvidenceView
            scannedBrands={scannedBrands}
            onSelectBrand={handleSelectBrand}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === "extracted" && activeProfile && (
          <ProfileView
            profile={activeProfile}
            brandData={formData}
            files={uploadedFiles}
            transcripts={uploadedTranscripts}
            onBackToForm={() => setActiveTab("forms")}
          />
        )}

        {activeTab === "extracted" && !activeProfile && (
          <div className="text-center py-20 bg-surface-container-lowest border border-secondary/15 rounded-lg">
            <Info className="w-12 h-12 text-secondary mb-4 mx-auto" />
            <h3 className="font-headline text-xl font-bold text-primary mb-2">No Active Strategy Report Extracted</h3>
            <p className="text-secondary text-sm max-w-md mx-auto mb-6">
              Complete the profiling dashboard fields on the forms tab and hit "Run Brand Profile" to generate.
            </p>
            <button
              onClick={() => setActiveTab("forms")}
              className="px-6 py-2 bg-primary text-white font-semibold rounded text-xs uppercase tracking-wider hover:bg-secondary transition cursor-pointer"
            >
              Go Code Parameters
            </button>
          </div>
        )}
      </main>



      {showPurgeConfirm && (
        <div className="fixed inset-0 bg-[#020813]/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest border border-secondary/15 rounded-xl max-w-md w-full p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 text-[#ba1a1a] mb-4">
              <Info className="w-6 h-6 shrink-0" />
              <h4 className="font-headline text-lg font-bold">Purge Scans Archive</h4>
            </div>
            <p className="text-sm text-secondary leading-relaxed mb-6">
              Are you sure you want to permanently purge all stored scans? This operation will remove all historic evidence logs and cannot be undone.
            </p>
            <div className="flex justify-end gap-3 font-sans text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setShowPurgeConfirm(false)}
                className="cursor-pointer border border-secondary/20 text-primary px-5 py-2.5 rounded hover:bg-secondary/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setScannedBrands([]);
                  setShowPurgeConfirm(false);
                }}
                className="cursor-pointer bg-[#ba1a1a] text-white px-5 py-2.5 rounded hover:bg-[#93000a] transition-all shadow-md"
              >
                Purge All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
