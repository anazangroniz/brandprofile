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

// Matches Alex's Context Object spec §6.4 — 14 stable keys
export interface BrandProfile {
  business_context: {
    brandName: string;
    about: string;
    category: string;
    awards: string[];
    socialProfiles: string[];
  };
  offerings: {
    services: { name: string; priceRange?: string; mostProfitable?: boolean }[];
    products: { name: string; priceRange?: string }[];
    brands: string[];
    availability: string[];
    buyingFactors: string[];
  };
  service_areas: {
    areas: string[];
    locations: { address?: string; phone?: string; email?: string }[];
  };
  audience_context: {
    customerProfile: string;
    customerSegments: { segment: string; percent?: number }[];
    personaName: string;
    personaTitle: string;
    personaAge: string;
    painPoints: string[];
    buyingMotivations: string[];
  };
  positioning: {
    positioningStatement: string;
    visionStatement: string;
    brandArchetype: string;
    competitiveEdge: string;
  };
  voice_and_tone: {
    designDirection: string;
    primaryAdjective: string;
    secondaryAdjective: string;
    tertiaryAdjective: string;
    guidelines: string;
    colors: {
      primary: string;
      secondary: string;
      lightBackground: string;
      darkBackground: string;
    };
  };
  offers_and_ctas: {
    offerType: string;
    specialOffers: string[];
    primaryCta: { type: string; wording: string };
    secondaryCta: { type: string; wording: string };
  };
  brand_assets: {
    galleryUrl: string;
    libraryOk: string;
  };
  industry_context: {
    summary: string;
    trends: string[];
    swot: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
  };
  content_guidance: {
    pillars: { title: string; description: string; exampleTopic: string }[];
  };
  objections: string[];
  restrictions: {
    notesAvoid: string;
    do_not_say: string[];
  };
  approved_facts: string[];
  source_references: { url: string; type: string }[];
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
