export interface BrandFormData {
  url: string;
  brandName: string;
  industry: string;
  tagline: string;
  about: string;
  city: string;
  state: string;
  primaryMarketRegion: string; // Target State / Region (USA)
  facebook: string;
  instagram: string;
  googleBusiness: string;
  socialContext: string;
}

export interface BrandProfile {
  positioningStatement: string;
  visionStatement: string;
  brandArchetype: string;
  brandVoice: {
    primaryAdjective: string;
    secondaryAdjective: string;
    tertiaryAdjective: string;
    guidelines: string;
  };
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  targetPersona: {
    name: string;
    age: string;
    title: string;
    painPoints: string[];
    buyingMotivations: string[];
  };
  contentPillars: {
    title: string;
    description: string;
    exampleTopic: string;
  }[];
  competitiveEdge: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface CreatedBrand {
  id: string;
  name: string;
  url: string;
  timestamp: string;
  formData: BrandFormData;
  profile?: BrandProfile;
  files: UploadedFile[];
  transcripts?: UploadedFile[];
}
