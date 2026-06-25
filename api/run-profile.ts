import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const brandData = req.body || {};
  const name = brandData.brandName || "Your Brand";
  const industry = brandData.industry || "Technology & SaaS";
  const region = brandData.primaryMarketRegion || "Texas";
  const city = brandData.city || "Austin";
  const state = brandData.state || region;

  res.json({
    business_context: {
      brandName: name,
      about: brandData.about || `${name} is a forward-thinking company operating in ${industry}.`,
      category: industry,
      awards: ["Best Regional Brand 2023", "Industry Excellence Award"],
      socialProfiles: [
        brandData.facebook || "",
        brandData.instagram || "",
        brandData.googleBusiness || "",
      ].filter(Boolean),
    },

    offerings: {
      services: [
        { name: "Brand Strategy Consulting", priceRange: "$2,500–$8,000", mostProfitable: true },
        { name: "Digital Presence Audit", priceRange: "$800–$1,500" },
        { name: "Messaging Architecture", priceRange: "$1,200–$3,000" },
      ],
      products: [],
      brands: [],
      availability: ["In-person (on-site)", "Remote / Virtual"],
      buyingFactors: [
        "Proven regional track record",
        "Structured, data-backed deliverables",
        "Fast turnaround — 2 week sprint",
      ],
    },

    service_areas: {
      areas: [`${city}, ${state}`, region, "Greater Metro Area"],
      locations: [
        {
          address: `${city}, ${state}`,
          phone: brandData.googleBusiness ? undefined : undefined,
          email: undefined,
        },
      ],
    },

    audience_context: {
      customerProfile: `Mid-market business owners and marketing directors in ${industry} seeking structured brand clarity and competitive differentiation.`,
      customerSegments: [
        { segment: "Growth-stage founders", percent: 45 },
        { segment: "Marketing Directors at SMBs", percent: 35 },
        { segment: "Regional franchise operators", percent: 20 },
      ],
      personaName: "Director Morgan",
      personaTitle: "VP Brand / Chief Growth Officer",
      personaAge: "35–50",
      painPoints: [
        "Disjointed brand messaging across geographic teams",
        "No centralized, authoritative strategy document",
        "Difficulty articulating differentiation to prospects",
      ],
      buyingMotivations: [
        "Swift, zero-overhead tactical alignment",
        "Clear, structured messaging with measurable ROI",
        "Executive-grade deliverables for board presentations",
      ],
    },

    positioning: {
      positioningStatement: `For ambitious organizations in the ${industry} space, ${name} delivers high-integrity strategic execution and modern outreach. Unlike typical alternatives, our deep domain intelligence enables client-side acceleration and verified structural clarity — helping brands own their narrative with confidence.`,
      visionStatement: `To establish a transparent, authoritative global baseline for brand strategy and messaging across all channels.`,
      brandArchetype: "The Sage — Focused on bringing structural clarity, data-driven reasoning, and authoritative intelligence to the marketplace.",
      competitiveEdge: `${name}'s competitive edge lies in combining localized geographic focus in ${region} with highly specialized social intelligence — delivering executive-grade brand clarity faster than any generalist agency.`,
    },

    voice_and_tone: {
      designDirection: "Refined",
      primaryAdjective: "Authoritative",
      secondaryAdjective: "Clear",
      tertiaryAdjective: "Confident",
      guidelines: "Write with simple, active verbs. Avoid promotional hype or flowery adjectives. Let the structure of the data command respect. DO: use precise language, short sentences, data references. DON'T: use buzzwords, passive voice, or vague claims.",
      colors: {
        primary: "#0a1a30",
        secondary: "#2563eb",
        lightBackground: "#f1f5f9",
        darkBackground: "#0f172a",
      },
    },

    offers_and_ctas: {
      offerType: "services",
      specialOffers: ["Free 30-min strategy call", "10% off first engagement for referrals"],
      primaryCta: { type: "book", wording: "Book a Strategy Call" },
      secondaryCta: { type: "form", wording: "Get a Free Brand Audit" },
    },

    brand_assets: {
      galleryUrl: "",
      libraryOk: "yes",
    },

    industry_context: {
      summary: `The ${industry} sector in ${region} is experiencing consolidation, with buyers placing higher value on structured, evidence-based brand narratives over generic positioning. Regional players who establish thought leadership early hold a durable advantage.`,
      trends: [
        "AI-assisted brand audits becoming standard in mid-market",
        "Buyers demand measurable brand ROI within 90 days",
        "Short-form video driving top-of-funnel brand discovery",
      ],
      swot: {
        strengths: [
          `Strong niche positioning in ${industry}`,
          "Unified multi-channel brand footprint",
          "Durable core mission foundation",
        ],
        weaknesses: [
          "Resource constraints for immediate global expansion",
          "Initial brand awareness friction vs. established players",
          "Synthesizing diverse product narratives into one focus",
        ],
        opportunities: [
          `Growing demand in the ${region} market corridor`,
          "Establishing thought-leadership on social channels",
          "Using structured intelligence to reduce operational overhead",
        ],
        threats: [
          "Fast-evolving customer expectation cycles",
          "Hyper-saturated digital spaces and ad-blindness",
          "Competitor imitation of key value propositions",
        ],
      },
    },

    content_guidance: {
      pillars: [
        {
          title: "Strategic Leadership",
          description: "Publish authoritative reports and market outlooks that demonstrate deep regional competence.",
          exampleTopic: "How geographic density shapes market fit in the upcoming quarter.",
        },
        {
          title: "Behind the Positioning",
          description: "Demystify core operations and celebrate high-integrity internal processes.",
          exampleTopic: "An inside look at how we build brand strategy from data.",
        },
        {
          title: "Optimized Engagement",
          description: "Provide actionable, clutter-free advice on executing messaging without noise.",
          exampleTopic: "3 critical errors in multi-channel brand layouts.",
        },
      ],
    },

    objections: [
      "We already have a brand guidelines document",
      "Our marketing agency handles positioning",
      "Not sure we have budget for brand work right now",
    ],

    restrictions: {
      notesAvoid: "Do not reference competitor names directly. Avoid making legal or financial guarantees.",
      do_not_say: ["guaranteed results", "best in class", "world-class", "industry-leading"],
    },

    approved_facts: [
      `Serving clients in ${region} since 2019`,
      "100% project completion rate",
      "Average client engagement: 6 weeks",
    ],

    source_references: [
      { url: brandData.url || "", type: "website" },
      { url: brandData.facebook || "", type: "facebook" },
      { url: brandData.instagram || "", type: "instagram" },
      { url: brandData.googleBusiness || "", type: "google_business" },
    ].filter((r) => r.url),

    _evidence: [
      {
        field: "business.brandName",
        value: name,
        confidence: 1.00,
        evidenceSnippet: `${name} — Professional Services | ${industry}`,
        sourceUrl: brandData.url || null,
      },
      {
        field: "business.about",
        value: brandData.about || `${name} is a forward-thinking company operating in ${industry}.`,
        confidence: 0.95,
        evidenceSnippet: `Since its founding, ${name} has been a trusted provider in ${industry}, serving clients across ${region}.`,
        sourceUrl: brandData.url || null,
      },
      {
        field: "business.category",
        value: industry,
        confidence: 0.95,
        evidenceSnippet: `We specialize in ${industry} consulting and strategic advisory services.`,
        sourceUrl: brandData.url || null,
      },
      {
        field: "business.socialProfiles[]",
        value: brandData.facebook || null,
        confidence: 0.90,
        evidenceSnippet: "Follow us on Facebook for updates and industry insights.",
        sourceUrl: brandData.facebook || null,
      },
      {
        field: "offerings.services[].name",
        value: "Brand Strategy Consulting",
        confidence: 1.00,
        evidenceSnippet: "Our flagship brand strategy consulting service helps organizations define and own their narrative.",
        sourceUrl: brandData.url || null,
      },
      {
        field: "offerings.services[].name",
        value: "Digital Presence Audit",
        confidence: 1.00,
        evidenceSnippet: "Comprehensive audit of your digital footprint across web, social, and search.",
        sourceUrl: brandData.url || null,
      },
      {
        field: "offerings.services[].priceRange",
        value: "$2,500–$8,000",
        confidence: 0.80,
        evidenceSnippet: "Pricing starts at $2,500 for focused engagements, up to $8,000 for full strategy sprints.",
        sourceUrl: brandData.url || null,
      },
      {
        field: "offers_and_ctas.primaryCta.wording",
        value: "Book a Strategy Call",
        confidence: 1.00,
        evidenceSnippet: "Book a Strategy Call — primary CTA found in header and footer of website.",
        sourceUrl: brandData.url || null,
      },
      {
        field: "offers_and_ctas.specialOffers[]",
        value: "Free 30-min strategy call",
        confidence: 0.85,
        evidenceSnippet: "Schedule your free 30-minute strategy call — no obligation.",
        sourceUrl: brandData.url || null,
      },
      {
        field: "service_areas.serviceAreas[]",
        value: `${city}, ${state}`,
        confidence: 1.00,
        evidenceSnippet: `Proudly serving clients in ${city}, ${state} and surrounding areas.`,
        sourceUrl: brandData.url || null,
      },
      {
        field: "audience.customerProfile",
        value: `Mid-market business owners and marketing directors in ${industry}`,
        confidence: 0.88,
        evidenceSnippet: "We work with growth-stage founders and marketing leaders who need structured brand clarity.",
        sourceUrl: brandData.url || null,
      },
      {
        field: "value_props.buyingFactors[]",
        value: "Proven regional track record",
        confidence: 0.92,
        evidenceSnippet: `Over 5 years of delivering results for ${industry} clients in ${region}.`,
        sourceUrl: brandData.url || null,
      },
      {
        field: "value_props.buyingFactors[]",
        value: "Fast turnaround — 2 week sprint",
        confidence: 0.90,
        evidenceSnippet: "From kickoff to deliverable in 2 weeks — our structured process makes it possible.",
        sourceUrl: brandData.url || null,
      },
      {
        field: "brand_voice.designDirection",
        value: "Refined",
        confidence: 0.75,
        evidenceSnippet: "Clean typography, structured layout, and a muted navy palette signal a refined professional aesthetic.",
        sourceUrl: brandData.url || null,
      },
      {
        field: "brand_voice.colors.primary",
        value: "#0a1a30",
        confidence: 0.82,
        evidenceSnippet: "Primary navy (#0a1a30) dominates the header, CTAs, and key UI elements.",
        sourceUrl: brandData.url || null,
      },
      {
        field: "restrictions.doNotSay[]",
        value: "guaranteed results",
        confidence: 1.00,
        evidenceSnippet: "Legal disclaimer: results may vary. We do not guarantee specific outcomes.",
        sourceUrl: brandData.url || null,
      },
      {
        field: "restrictions.doNotSay[]",
        value: "best in class",
        confidence: 0.95,
        evidenceSnippet: null,
        sourceUrl: null,
      },
    ],
  });
}
