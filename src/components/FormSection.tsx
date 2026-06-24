import React, { useRef, useState } from "react";
import { BrandFormData, UploadedFile } from "../types";
import { Globe, Building2, Share2, UploadCloud, FileText, Trash2, Search, CheckSquare, Square, Rocket, Map, Info, AlertCircle } from "lucide-react";

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

  const validateField = (name: string, value: any): string | null => {
    switch (name) {
      case "url":
        if (!value) {
          return "Primary Domain URL is required (e.g., https://www.yourbrand.com).";
        }
        try {
          const parsed = new URL(value);
          if (!parsed.protocol.startsWith("http")) {
            return "URL protocol must be http or https (e.g., https://www.yourbrand.com).";
          }
        } catch (_) {
          return "Please enter a valid URL (e.g., https://www.yourbrand.com).";
        }
        return null;

      case "brandName":
        if (!value || !value.trim()) {
          return "Brand Name is required (e.g., Apple, Acme Corp).";
        }
        if (value.trim().length < 2) {
          return "Brand Name must be at least 2 characters long.";
        }
        return null;

      case "industry":
        if (!value) {
          return "Please select an industry from the dropdown menu.";
        }
        return null;

      case "tagline":
        if (!value || !value.trim()) {
          return "Brand Tagline is required to summarize your value proposition.";
        }
        if (value.trim().length < 5) {
          return "Brand Tagline must be at least 5 characters long.";
        }
        return null;

      case "about":
        if (!value || !value.trim()) {
          return "About the Company description is required to provide brand context.";
        }
        if (value.trim().length < 15) {
          return "Please provide more details about the company (at least 15 characters).";
        }
        return null;

      case "city":
        if (!value || !value.trim()) {
          return "City name is required (e.g., San Francisco, Austin).";
        }
        if (value.trim().length < 2) {
          return "City name must be at least 2 characters long.";
        }
        return null;

      case "state":
        if (!value) {
          return "Please select a primary State from the dropdown menu.";
        }
        return null;

      case "primaryMarketRegion":
        if (!value) {
          return "Please select a primary market region from the dropdown.";
        }
        return null;

      case "facebook":
        if (!value || !value.trim()) {
          return "Facebook Page username is required (e.g., brandname).";
        }
        const fbRegex = /^[a-zA-Z0-9.]{3,}$/;
        if (!fbRegex.test(value.trim())) {
          return "Please enter a valid Facebook username (at least 3 characters, alphanumeric or periods).";
        }
        return null;

      case "instagram":
        if (!value || !value.trim()) {
          return "Instagram Handle is required (e.g., brandname).";
        }
        const igRegex = /^[a-zA-Z0-9._]{3,}$/;
        if (!igRegex.test(value.trim())) {
          return "Please enter a valid Instagram handle (at least 3 characters, alphanumeric, periods, or underscores).";
        }
        return null;

      case "googleBusiness":
        if (!value || !value.trim()) {
          return "Google Business Profile name is required.";
        }
        if (value.trim().length < 3) {
          return "Google Business Profile name must be at least 3 characters.";
        }
        return null;

      case "socialContext":
        if (!value || !value.trim()) {
          return "Social Positioning Context is required to guide messaging.";
        }
        if (value.trim().length < 10) {
          return "Please enter at least 10 characters describing your social strategy.";
        }
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

  React.useEffect(() => {
    if (uploadedFiles.length > 0 && errors.uploadedFiles) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.uploadedFiles;
        return next;
      });
    }
  }, [uploadedFiles, errors.uploadedFiles]);

  React.useEffect(() => {
    if (uploadedTranscripts.length > 0 && errors.uploadedTranscripts) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.uploadedTranscripts;
        return next;
      });
    }
  }, [uploadedTranscripts, errors.uploadedTranscripts]);

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
      onAddFiles(e.dataTransfer.files);
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
      onAddTranscripts(e.dataTransfer.files);
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
    const newErrors: Record<string, string> = {};

    // URL Validation
    if (!formData.url) {
      newErrors.url = "Primary Domain URL is required.";
    } else {
      try {
        const parsed = new URL(formData.url);
        if (!parsed.protocol.startsWith("http")) {
          newErrors.url = "URL protocol must be http or https.";
        }
      } catch (_) {
        newErrors.url = "Please enter a valid URL (e.g., https://www.yourbrand.com).";
      }
    }

    // Brand Name Validation
    if (!formData.brandName.trim()) {
      newErrors.brandName = "Brand Name is required.";
    } else if (formData.brandName.trim().length < 2) {
      newErrors.brandName = "Brand Name must be at least 2 characters long.";
    }

    // Industry Validation
    if (!formData.industry) {
      newErrors.industry = "Please select an industry.";
    }

    // Tagline Validation
    if (!formData.tagline.trim()) {
      newErrors.tagline = "Brand Tagline is required.";
    } else if (formData.tagline.trim().length < 5) {
      newErrors.tagline = "Brand Tagline must be at least 5 characters long.";
    }

    // About/Backstory Validation
    if (!formData.about.trim()) {
      newErrors.about = "About the Company description is required.";
    } else if (formData.about.trim().length < 15) {
      newErrors.about = "Please provide more details about the company (at least 15 characters).";
    }

    // Primary City Validation
    if (!formData.city || !formData.city.trim()) {
      newErrors.city = "City name is required.";
    } else if (formData.city.trim().length < 2) {
      newErrors.city = "City name must be at least 2 characters long.";
    }

    // State Validation
    if (!formData.state) {
      newErrors.state = "Please select a State from the dropdown.";
    }

    // Primary Market Region Validation (synced with state)
    if (!formData.primaryMarketRegion) {
      newErrors.primaryMarketRegion = "Please select a primary market region.";
    }

    // Facebook Validation
    if (!formData.facebook.trim()) {
      newErrors.facebook = "Facebook Page username is required.";
    } else {
      const fbRegex = /^[a-zA-Z0-9.]{3,}$/;
      if (!fbRegex.test(formData.facebook.trim())) {
        newErrors.facebook = "Please enter a valid Facebook username (at least 3 characters, alphanumeric or periods).";
      }
    }

    // Instagram Validation
    if (!formData.instagram.trim()) {
      newErrors.instagram = "Instagram Handle is required.";
    } else {
      const igRegex = /^[a-zA-Z0-9._]{3,}$/;
      if (!igRegex.test(formData.instagram.trim())) {
        newErrors.instagram = "Please enter a valid Instagram handle (at least 3 characters, alphanumeric, periods, or underscores).";
      }
    }

    // Google Business Validation
    if (!formData.googleBusiness.trim()) {
      newErrors.googleBusiness = "Google Business Profile is required.";
    } else if (formData.googleBusiness.trim().length < 3) {
      newErrors.googleBusiness = "Google Business Profile name must be at least 3 characters.";
    }

    // Social Context Validation
    if (!formData.socialContext.trim()) {
      newErrors.socialContext = "Social Positioning Context is required.";
    } else if (formData.socialContext.trim().length < 10) {
      newErrors.socialContext = "Please enter at least 10 characters describing your social strategy.";
    }

    // Knowledge Base Documents Validation
    if (uploadedFiles.length === 0) {
      newErrors.uploadedFiles = "Please upload at least one brand guideline, whitepaper, or report.";
    }

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
              Primary Domain URL
            </label>
            <input
              type="url"
              name="url"
              id="url"
              value={formData.url}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full bg-[#fafafc] border rounded px-4 py-3 focus:ring-2 outline-none transition-all placeholder:text-secondary/40 text-primary text-sm ${
                errors.url
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-secondary/20 focus:ring-primary focus:border-transparent"
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
              Brand Name
            </label>
            <input
              type="text"
              name="brandName"
              id="brandName"
              value={formData.brandName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full bg-[#fafafc] border rounded px-4 py-3 focus:ring-2 outline-none transition-all text-primary text-sm ${
                errors.brandName
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-secondary/20 focus:ring-primary focus:border-transparent"
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
              Industry
            </label>
            <select
              name="industry"
              id="industry"
              value={formData.industry}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full bg-[#fafafc] border rounded px-4 py-3 focus:ring-2 outline-none transition-all text-primary text-sm ${
                errors.industry
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-secondary/20 focus:ring-primary focus:border-transparent"
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
              className={`w-full bg-[#fafafc] border rounded px-4 py-3 focus:ring-2 outline-none transition-all text-primary text-sm ${
                errors.tagline
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-secondary/20 focus:ring-primary focus:border-transparent"
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
              className={`w-full bg-[#fafafc] border rounded px-4 py-3 focus:ring-2 outline-none transition-all text-primary resize-none text-sm ${
                errors.about
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-secondary/20 focus:ring-primary focus:border-transparent"
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
                className={`w-full bg-[#fafafc] border rounded px-4 py-3 focus:ring-2 outline-none transition-all text-primary text-sm ${
                  errors.city
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-secondary/20 focus:ring-primary focus:border-transparent"
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
                className={`w-full bg-[#fafafc] border rounded px-4 py-3 focus:ring-2 outline-none transition-all text-primary text-sm ${
                  errors.state
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-secondary/20 focus:ring-primary focus:border-transparent"
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

          <div className="lg:col-span-2 relative h-full min-h-[300px] rounded overflow-hidden border border-secondary/15 group">
            <div className="absolute inset-0 bg-[#0d1d33] flex items-center justify-center">
              <Map className="text-white/30 w-12 h-12 animate-pulse" />
            </div>
            <img
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
              alt="USA Market Map"
              referrerPolicy="no-referrer"
              src="/src/assets/images/usa_map_slate_1782228469009.jpg"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded border border-secondary/20 shadow-sm">
              <span className="font-sans text-[10px] font-bold text-primary uppercase tracking-wider">
                MARKET DENSITY PREVIEW
              </span>
            </div>
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
                className={`w-full bg-[#fafafc] border rounded pl-8 pr-4 py-3 focus:ring-2 outline-none transition-all text-primary text-sm ${
                  errors.facebook
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-secondary/20 focus:ring-primary focus:border-transparent"
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
                className={`w-full bg-[#fafafc] border rounded pl-8 pr-4 py-3 focus:ring-2 outline-none transition-all text-primary text-sm ${
                  errors.instagram
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-secondary/20 focus:ring-primary focus:border-transparent"
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
              className={`w-full bg-[#fafafc] border rounded px-4 py-3 focus:ring-2 outline-none transition-all text-primary text-sm ${
                errors.googleBusiness
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-secondary/20 focus:ring-primary focus:border-transparent"
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
              className={`w-full bg-[#fafafc] border rounded px-4 py-3 focus:ring-2 outline-none transition-all text-primary resize-none text-sm ${
                errors.socialContext
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-secondary/20 focus:ring-primary focus:border-transparent"
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
            Supported formats: PDF, DOCX, PPTX (Max 25MB per file)
          </p>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            onChange={(e) => e.target.files && onAddFiles(e.target.files)}
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
            Supported formats: TXT, PDF, DOCX (Max 25MB per file)
          </p>
          <input
            type="file"
            ref={transcriptInputRef}
            multiple
            onChange={(e) => e.target.files && onAddTranscripts(e.target.files)}
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
        <div className="flex items-center gap-2 text-secondary">
          <Info className="w-5 h-5 text-secondary shrink-0" />
          <p className="text-xs italic">All data is processed securely through our Tier 4 intelligence protocols.</p>
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
