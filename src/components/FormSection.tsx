import React, { useRef, useState } from "react";
import { BrandFormData, UploadedFile } from "../types";
import { Globe, Building2, Share2, UploadCloud, FileText, Trash2, Search, Rocket, Info, AlertCircle } from "lucide-react";
import USMap from "./USMap";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", 
  "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", 
  "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

interface FormSectionProps {
  formData: BrandFormData;
  onChange: (data: Partial<BrandFormData>) => void;
  onScan: () => void;
  isScanning: boolean;
  uploadedFiles: UploadedFile[];
  onAddFiles: (files: FileList) => void;
  onRemoveFile: (id: string) => void;
  uploadedTranscripts?: UploadedFile[];
  onAddTranscripts?: (files: FileList) => void;
  onRemoveTranscript?: (id: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isGenerating: boolean;
}

export default function FormSection({
  formData,
  onChange,
  onScan,
  isScanning,
  uploadedFiles,
  onAddFiles,
  onRemoveFile,
  uploadedTranscripts = [],
  onAddTranscripts = () => {},
  onRemoveTranscript = () => {},
  onSubmit,
  isGenerating,
}: FormSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transcriptInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [transcriptDragOver, setTranscriptDragOver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileError, setFileError] = useState<string | null>(null);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);

  const ALLOWED_TYPES: Record<string, string> = {
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "application/pdf": ".pdf",
    "application/vnd.ms-excel": ".xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
    "text/csv": ".csv",
    "image/png": ".png",
    "image/jpeg": ".jpg",
  };
  const MAX_FILE_BYTES = 6 * 1024 * 1024; // 6 MB

  const filterFiles = (
    files: FileList,
    setError: (msg: string | null) => void
  ): FileList => {
    const rejected: string[] = [];
    const dt = new DataTransfer();
    Array.from(files).forEach((f) => {
      if (!ALLOWED_TYPES[f.type]) {
        rejected.push(`"${f.name}" — unsupported format`);
      } else if (f.size > MAX_FILE_BYTES) {
        rejected.push(`"${f.name}" — exceeds 6 MB`);
      } else {
        dt.items.add(f);
      }
    });
    setError(rejected.length > 0 ? rejected.join("; ") : null);
    return dt.files;
  };

  const validateField = (name: string, value: any): string | null => {
    switch (name) {
      case "url":
        if (!value) return "Required — e.g. https://www.yourbrand.com";
        try {
          const parsed = new URL(value);
          if (!parsed.protocol.startsWith("http")) return "Must start with http:// or https://";
        } catch (_) {
          return "Enter a valid URL — e.g. https://www.yourbrand.com";
        }
        return null;

      case "brandName":
        if (!value || !value.trim()) return "Required";
        if (value.trim().length < 2) return "At least 2 characters";
        return null;

      case "industry":
        if (!value) return "Please select an industry";
        return null;

      case "tagline":
        if (value && value.trim().length > 0 && value.trim().length < 5) return "At least 5 characters";
        return null;

      case "about":
        if (value && value.trim().length > 0 && value.trim().length < 15) return "At least 15 characters";
        return null;

      case "city":
        if (value && value.trim().length > 0 && value.trim().length < 2) return "At least 2 characters";
        return null;

      case "state":
      case "primaryMarketRegion":
        return null;

      case "facebook": {
        if (!value || !value.trim()) return null;
        const fbRegex = /^[a-zA-Z0-9.]{3,}$/;
        if (!fbRegex.test(value.trim())) return "Letters, numbers or periods only (min 3)";
        return null;
      }

      case "instagram": {
        if (!value || !value.trim()) return null;
        const igRegex = /^[a-zA-Z0-9._]{3,}$/;
        if (!igRegex.test(value.trim())) return "Letters, numbers, periods or underscores (min 3)";
        return null;
      }

      case "googleBusiness":
        if (value && value.trim().length > 0 && value.trim().length < 3) return "At least 3 characters";
        return null;

      case "socialContext":
        if (value && value.trim().length > 0 && value.trim().length < 10) return "At least 10 characters";
        return null;

      default:
        return null;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "state") {
      onChange({ state: value, primaryMarketRegion: value });
    } else {
      onChange({ [name]: value });
    }
    
    const errorMsg = validateField(name, value);
    if (!errorMsg) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    } else {
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: errorMsg,
        }));
      }
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    if (errorMsg) {
      setErrors((prev) => ({
        ...prev,
        [name]: errorMsg,
      }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };


  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => {
    setDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const valid = filterFiles(e.dataTransfer.files, setFileError);
      if (valid.length > 0) onAddFiles(valid);
    }
  };

  const onTranscriptDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setTranscriptDragOver(true);
  };

  const onTranscriptDragLeave = () => {
    setTranscriptDragOver(false);
  };

  const onTranscriptDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setTranscriptDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const valid = filterFiles(e.dataTransfer.files, setTranscriptError);
      if (valid.length > 0) onAddTranscripts(valid);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fields = ["url", "brandName", "industry", "tagline", "about", "city", "facebook", "instagram", "googleBusiness", "socialContext"];
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const err = validateField(field, (formData as any)[field]);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(e);
    } else {
      // Find the first error element and scroll to it smoothly
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.getElementsByName(firstErrorKey)[0] || document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          element.focus();
        }, 500);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* URL Analysis Section */}
      <section id="url-analysis" className="bg-surface-container-lowest p-8 md:p-12 border border-secondary/15 rounded-lg transition-all hover:shadow-[0_10px_40px_rgba(26,43,68,0.06)]">
        <div className="flex items-center gap-3 mb-8">
          <Globe className="text-primary w-6 h-6" />
          <h2 className="font-headline text-2xl font-bold text-primary">URL Analysis</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-grow w-full">
            <label className="block font-sans text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
              Primary Domain URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="url"
              id="url"
              value={formData.url}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full border rounded px-4 py-3 focus:ring-2 outline-none transition-all placeholder:text-secondary/40 text-primary text-sm ${
                errors.url
                  ? "bg-red-50/50 border-red-400 focus:ring-red-400 focus:border-red-400"
                  : "bg-[#fafafc] border-secondary/20 focus:ring-primary focus:border-transparent"
              }`}
              placeholder="https://www.yourbrand.com"
            />
            {errors.url && (
              <p className="text-red-600 text-xs font-semibold mt-1.5 flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.url}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onScan}
            disabled={isScanning || !formData.url}
            className="cursor-pointer bg-[#0a1a30] text-white px-8 py-3 rounded font-sans text-xs font-bold uppercase tracking-widest hover:bg-secondary transition-colors flex items-center justify-center gap-2 h-[50px] min-w-[180px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScanning ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {isScanning ? "Scanning..." : "Scan Domain"}
          </button>
        </div>
        <p className="mt-4 text-secondary text-xs">
          Automated analysis will identify tech stack, metadata, and core positioning.
        </p>
      </section>

      {/* Business Details Section */}
      <section id="business-details" className="bg-surface-container-lowest p-8 md:p-12 border border-secondary/15 rounded-lg transition-all hover:shadow-[0_10px_40px_rgba(26,43,68,0.06)]">
        <div className="flex items-center gap-3 mb-8">
          <Building2 className="text-primary w-6 h-6" />
          <h2 className="font-headline text-2xl font-bold text-primary">Business Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block font-sans text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="brandName"
              id="brandName"
              value={formData.brandName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full border rounded px-4 py-3 focus:ring-2 outline-none transition-all text-primary text-sm ${
                errors.brandName
                  ? "bg-red-50/50 border-red-400 focus:ring-red-400 focus:border-red-400"
                  : "bg-[#fafafc] border-secondary/20 focus:ring-primary focus:border-transparent"
              }`}
              placeholder="Official Brand Name"
            />
            {errors.brandName && (
              <p className="text-red-600 text-xs font-semibold mt-1.5 flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.brandName}
              </p>
            )}
          </div>

          <div>
            <label className="block font-sans text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
              Industry <span className="text-red-500">*</span>
            </label>
            <select
              name="industry"
              id="industry"
              value={formData.industry}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full border rounded px-4 py-3 focus:ring-2 outline-none transition-all text-primary text-sm ${
                errors.industry
                  ? "bg-red-50/50 border-red-400 focus:ring-red-400 focus:border-red-400"
                  : "bg-[#fafafc] border-secondary/20 focus:ring-primary focus:border-transparent"
              }`}
            >
              <option value="">Select Industry</option>
              <option value="Technology & SaaS">Technology &amp; SaaS</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Consumer Goods">Consumer Goods</option>
              <option value="Media & Entertainment">Media &amp; Entertainment</option>
            </select>
            {errors.industry && (
              <p className="text-red-600 text-xs font-semibold mt-1.5 flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.industry}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block font-sans text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
              Brand Tagline
            </label>
            <input
              type="text"
              name="tagline"
              id="tagline"
              value={formData.tagline}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full border rounded px-4 py-3 focus:ring-2 outline-none transition-all text-primary text-sm ${
                errors.tagline
                  ? "bg-red-50/50 border-red-400 focus:ring-red-400 focus:border-red-400"
                  : "bg-[#fafafc] border-secondary/20 focus:ring-primary focus:border-transparent"
              }`}
              placeholder="e.g. Empowering the Future of Enterprise Finance"
            />
            {errors.tagline && (
              <p className="text-red-600 text-xs font-semibold mt-1.5 flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.tagline}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block font-sans text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
              About the Company
            </label>
            <textarea
              name="about"
              id="about"
              value={formData.about}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full border rounded px-4 py-3 focus:ring-2 outline-none transition-all text-primary resize-none text-sm ${
                errors.about
                  ? "bg-red-50/50 border-red-400 focus:ring-red-400 focus:border-red-400"
                  : "bg-[#fafafc] border-secondary/20 focus:ring-primary focus:border-transparent"
              }`}
              placeholder="Detailed mission statement and value proposition..."
              rows={4}
            />
            {errors.about && (
              <p className="text-red-600 text-xs font-semibold mt-1.5 flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.about}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Geographic Profile Section */}
      <section id="geography" className="bg-surface-container-lowest p-8 md:p-12 border border-secondary/15 rounded-lg overflow-hidden transition-all hover:shadow-[0_10px_40px_rgba(26,43,68,0.06)]">
        <div className="flex items-center gap-3 mb-8">
          <Globe className="text-primary w-6 h-6" />
          <h2 className="font-headline text-2xl font-bold text-primary">Geographic Profile</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-6">
            <div>
              <label className="block font-sans text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
                City Name
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={formData.city}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full border rounded px-4 py-3 focus:ring-2 outline-none transition-all text-primary text-sm ${
                  errors.city
                    ? "bg-red-50/50 border-red-400 focus:ring-red-400 focus:border-red-400"
                    : "bg-[#fafafc] border-secondary/20 focus:ring-primary focus:border-transparent"
                }`}
                placeholder="e.g. San Francisco"
              />
              {errors.city && (
                <p className="text-red-600 text-xs font-semibold mt-1.5 flex items-center gap-1 animate-fadeIn">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.city}
                </p>
              )}
            </div>

            <div>
              <label className="block font-sans text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
                State (USA)
              </label>
              <select
                name="state"
                id="state"
                value={formData.state}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full border rounded px-4 py-3 focus:ring-2 outline-none transition-all text-primary text-sm ${
                  errors.state
                    ? "bg-red-50/50 border-red-400 focus:ring-red-400 focus:border-red-400"
                    : "bg-[#fafafc] border-secondary/20 focus:ring-primary focus:border-transparent"
                }`}
              >
                <option value="">Select Primary State</option>
                {US_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-600 text-xs font-semibold mt-1.5 flex items-center gap-1 animate-fadeIn">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.state}
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-surface-bright rounded border border-secondary/15 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-sans text-[10px] font-bold text-primary uppercase tracking-wider">
                Market Density Preview
              </span>
              {formData.state && (
                <span className="text-[10px] text-secondary italic">
                  Hover any state for details
                </span>
              )}
            </div>
            <USMap selectedState={formData.state} />
          </div>
        </div>
      </section>

      {/* Social Intelligence Section */}
      <section id="social-content" className="bg-surface-container-lowest p-8 md:p-12 border border-secondary/15 rounded-lg transition-all hover:shadow-[0_10px_40px_rgba(26,43,68,0.06)]">
        <div className="flex items-center gap-3 mb-8">
          <Share2 className="text-primary w-6 h-6" />
          <h2 className="font-headline text-2xl font-bold text-primary">Social Intelligence</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="block font-sans text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
              Facebook Page
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-medium">/</span>
              <input
                type="text"
                name="facebook"
                id="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full border rounded pl-8 pr-4 py-3 focus:ring-2 outline-none transition-all text-primary text-sm ${
                  errors.facebook
                    ? "bg-red-50/50 border-red-400 focus:ring-red-400 focus:border-red-400"
                    : "bg-[#fafafc] border-secondary/20 focus:ring-primary focus:border-transparent"
                }`}
                placeholder="username"
              />
            </div>
            {errors.facebook && (
              <p className="text-red-600 text-xs font-semibold mt-1.5 flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.facebook}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-sans text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
              Instagram Handle
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-medium">@</span>
              <input
                type="text"
                name="instagram"
                id="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full border rounded pl-8 pr-4 py-3 focus:ring-2 outline-none transition-all text-primary text-sm ${
                  errors.instagram
                    ? "bg-red-50/50 border-red-400 focus:ring-red-400 focus:border-red-400"
                    : "bg-[#fafafc] border-secondary/20 focus:ring-primary focus:border-transparent"
                }`}
                placeholder="brand"
              />
            </div>
            {errors.instagram && (
              <p className="text-red-600 text-xs font-semibold mt-1.5 flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.instagram}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-sans text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
              Google Business Profile
            </label>
            <input
              type="text"
              name="googleBusiness"
              id="googleBusiness"
              value={formData.googleBusiness}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full border rounded px-4 py-3 focus:ring-2 outline-none transition-all text-primary text-sm ${
                errors.googleBusiness
                  ? "bg-red-50/50 border-red-400 focus:ring-red-400 focus:border-red-400"
                  : "bg-[#fafafc] border-secondary/20 focus:ring-primary focus:border-transparent"
              }`}
              placeholder="Search listing name"
            />
            {errors.googleBusiness && (
              <p className="text-red-600 text-xs font-semibold mt-1.5 flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.googleBusiness}
              </p>
            )}
          </div>

          <div className="md:col-span-3">
            <label className="block font-sans text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
              Social Positioning Context
            </label>
            <textarea
              name="socialContext"
              id="socialContext"
              value={formData.socialContext}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full border rounded px-4 py-3 focus:ring-2 outline-none transition-all text-primary resize-none text-sm ${
                errors.socialContext
                  ? "bg-red-50/50 border-red-400 focus:ring-red-400 focus:border-red-400"
                  : "bg-[#fafafc] border-secondary/20 focus:ring-primary focus:border-transparent"
              }`}
              placeholder="Briefly describe the brand's tone of voice and core messaging strategy on social channels."
              rows={3}
            />
            {errors.socialContext && (
              <p className="text-red-600 text-xs font-semibold mt-1.5 flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.socialContext}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Knowledge Base Section */}
      <section id="documents" className="bg-surface-container-lowest p-8 md:p-12 border border-secondary/15 rounded-lg transition-all hover:shadow-[0_10px_40px_rgba(26,43,68,0.06)]">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="text-primary w-6 h-6" />
          <h2 className="font-headline text-2xl font-bold text-primary">Knowledge Base (Documents)</h2>
        </div>

        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed rounded p-12 text-center group transition-all cursor-pointer ${
            errors.uploadedFiles
              ? "border-red-500 bg-red-50/10 hover:bg-red-50/20"
              : "border-secondary/20 hover:border-primary/40 hover:bg-secondary/5"
          }`}
          id="documents"
        >
          <UploadCloud className="w-12 h-12 text-secondary group-hover:text-primary transition-colors mb-4 mx-auto" />
          <p className="font-headline text-lg font-semibold text-primary mb-2">
            Drag and drop brand guidelines, whitepapers, or reports
          </p>
          <p className="text-secondary text-xs">
            .doc, .docx, .pdf, .xls, .xlsx, .csv, .png, .jpg — max 6 MB per file
          </p>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept=".doc,.docx,.pdf,.xls,.xlsx,.csv,.png,.jpg,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,image/png,image/jpeg"
            onChange={(e) => {
              if (e.target.files) {
                const valid = filterFiles(e.target.files, setFileError);
                if (valid.length > 0) onAddFiles(valid);
              }
              e.target.value = "";
            }}
            className="hidden"
            id="file-upload"
          />
          <button
            type="button"
            className="mt-6 border border-secondary/20 text-primary px-6 py-2 rounded font-sans text-xs font-bold uppercase hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer"
          >
            Select Files
          </button>
        </div>

        {errors.uploadedFiles && (
          <p className="text-red-600 text-xs font-semibold mt-3 flex items-center gap-1 animate-fadeIn">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.uploadedFiles}
          </p>
        )}
        {fileError && (
          <p className="text-red-600 text-xs font-semibold mt-3 flex items-center gap-1 animate-fadeIn">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {fileError}
          </p>
        )}

        {/* Uploaded File list */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3" id="file-list">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="bg-secondary-container text-primary px-4 py-2 rounded flex items-center gap-2 text-xs font-medium border border-[#c5c6ce] hover:border-primary transition"
              >
                <FileText className="w-4 h-4" />
                <span>{file.name} ({file.size})</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(file.id);
                  }}
                  className="hover:text-red-600 transition-colors cursor-pointer ml-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Transcripts Section */}
      <section id="transcripts" className="bg-surface-container-lowest p-8 md:p-12 border border-secondary/15 rounded-lg transition-all hover:shadow-[0_10px_40px_rgba(26,43,68,0.06)]">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="text-primary w-6 h-6" />
          <h2 className="font-headline text-2xl font-bold text-primary">Brand Transcripts (Interviews & Meetings)</h2>
        </div>

        <div
          onDragOver={onTranscriptDragOver}
          onDragLeave={onTranscriptDragLeave}
          onDrop={onTranscriptDrop}
          onClick={() => transcriptInputRef.current?.click()}
          className={`border border-dashed rounded p-12 text-center group transition-all cursor-pointer ${
            errors.uploadedTranscripts
              ? "border-red-500 bg-red-50/10 hover:bg-red-50/20"
              : "border-secondary/20 hover:border-primary/40 hover:bg-secondary/5"
          }`}
          id="transcripts-upload"
        >
          <UploadCloud className="w-12 h-12 text-secondary group-hover:text-primary transition-colors mb-4 mx-auto" />
          <p className="font-headline text-lg font-semibold text-primary mb-2">
            Drag and drop customer interview transcripts, sales recordings, or focus group files
          </p>
          <p className="text-secondary text-xs">
            .doc, .docx, .pdf, .xls, .xlsx, .csv, .png, .jpg — max 6 MB per file
          </p>
          <input
            type="file"
            ref={transcriptInputRef}
            multiple
            accept=".doc,.docx,.pdf,.xls,.xlsx,.csv,.png,.jpg,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,image/png,image/jpeg"
            onChange={(e) => {
              if (e.target.files) {
                const valid = filterFiles(e.target.files, setTranscriptError);
                if (valid.length > 0) onAddTranscripts(valid);
              }
              e.target.value = "";
            }}
            className="hidden"
            id="transcript-file-upload"
          />
          <button
            type="button"
            className="mt-6 border border-secondary/20 text-primary px-6 py-2 rounded font-sans text-xs font-bold uppercase hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer"
          >
            Select Transcripts
          </button>
        </div>

        {errors.uploadedTranscripts && (
          <p className="text-red-600 text-xs font-semibold mt-3 flex items-center gap-1 animate-fadeIn">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.uploadedTranscripts}
          </p>
        )}
        {transcriptError && (
          <p className="text-red-600 text-xs font-semibold mt-3 flex items-center gap-1 animate-fadeIn">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {transcriptError}
          </p>
        )}

        {/* Uploaded Transcript list */}
        {uploadedTranscripts.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3" id="transcript-file-list">
            {uploadedTranscripts.map((file) => (
              <div
                key={file.id}
                className="bg-secondary-container text-primary px-4 py-2 rounded flex items-center gap-2 text-xs font-medium border border-[#c5c6ce] hover:border-primary transition"
              >
                <FileText className="w-4 h-4 text-[#cf4a4a]" />
                <span>{file.name} ({file.size})</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTranscript(file.id);
                  }}
                  className="hover:text-red-600 transition-colors cursor-pointer ml-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <div className="pt-12 border-t border-secondary/15 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          {Object.keys(errors).length > 0 && (
            <p className="flex items-center gap-1.5 text-red-600 text-xs font-semibold animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {Object.keys(errors).length} {Object.keys(errors).length === 1 ? "field requires" : "fields require"} attention
            </p>
          )}
          <div className="flex items-center gap-2 text-secondary">
            <Info className="w-5 h-5 text-secondary shrink-0" />
            <p className="text-xs italic">All data is processed securely through our Tier 4 intelligence protocols.</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isGenerating}
          className="cursor-pointer w-full md:w-auto bg-[#0a1a30] text-white px-10 py-4 rounded font-headline text-sm font-bold tracking-tight shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              Generating Strategy Report...
            </>
          ) : (
            <>
              Run Brand Profile
              <Rocket className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
