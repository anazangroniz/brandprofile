import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3001;

app.use(express.json({ limit: "50mb" }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// 1. Scan Domain URL to fill in details
app.post("/api/scan-domain", async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const prompt = `You are an expert brand analyst. Analyze this URL/domain: "${url}".
Since you cannot browse live, provide highly realistic, professional, and intelligent predictions/extrapolations for this company based on public knowledge of its domain (or the domain's name if it is lesser known). 
Return a JSON object matching this schema exactly:
{
  "brandName": "A professional polished brand name matching the domain or extrapolated beautifully",
  "industry": "One of: 'Technology & SaaS', 'Financial Services', 'Healthcare', 'Consumer Goods', 'Media & Entertainment'",
  "tagline": "An inspiring, elegant brand tagline",
  "about": "A detailed mission statement and company value proposition (2-3 sentences)",
  "city": "A US City name where the target market or headquarters is based (e.g. 'San Francisco', 'New York', 'Austin')",
  "state": "A US State name where the target market or headquarters is based (e.g. 'California', 'New York', 'Texas')",
  "primaryMarketRegion": "A US State name where the target market or headquarters is based (e.g. 'California', 'New York', 'Texas', 'Washington', 'Florida')",
  "facebook": "an appropriate facebook page handle e.g. 'brandname'",
  "instagram": "an appropriate instagram handle e.g. 'brandname'",
  "googleBusiness": "An appropriate Google Business Profile listing name e.g. 'Brand Name HQ'",
  "socialContext": "Briefly describe the brand's tone of voice and core messaging strategy on social channels."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            brandName: { type: Type.STRING },
            industry: { type: Type.STRING },
            tagline: { type: Type.STRING },
            about: { type: Type.STRING },
            city: { type: Type.STRING },
            state: { type: Type.STRING },
            primaryMarketRegion: { type: Type.STRING },
            facebook: { type: Type.STRING },
            instagram: { type: Type.STRING },
            googleBusiness: { type: Type.STRING },
            socialContext: { type: Type.STRING }
          },
          required: [
            "brandName", "industry", "tagline", "about", 
            "city", "state", "primaryMarketRegion", 
            "facebook", "instagram", "googleBusiness", "socialContext"
          ]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Error scanning domain with Gemini:", error);
    // Return graceful fallback data if API key is missing or fails
    res.json({
      brandName: url.replace(/https?:\/\/(www\.)?/, '').split('.')[0].toUpperCase(),
      industry: "Technology & SaaS",
      tagline: "Empowering Next-Generation Operations",
      about: `An innovative platform built to expand global outreach and drive enterprise-ready execution for ${url}.`,
      city: "San Francisco",
      state: "California",
      primaryMarketRegion: "California",
      facebook: "brandname",
      instagram: "brandname",
      googleBusiness: "Brand Name HQ",
      socialContext: "Professional, clean corporate intelligence voice focused on industry insights."
    });
  }
});

// 2. Synthesize complete brand profile
app.post("/api/run-profile", async (req, res) => {
  const brandData = req.body;

  try {
    const prompt = `You are an elite corporate brand strategist. Create a highly detailed, executive brand strategy profile from the following data:
Brand Name: ${brandData.brandName || "Untitled"}
Industry: ${brandData.industry || "General"}
Tagline: ${brandData.tagline || ""}
About the Company: ${brandData.about || ""}
Primary Region: ${brandData.primaryMarketRegion || "California"}
Social Context: ${brandData.socialContext || ""}
Uploaded Assets/Documents: ${brandData.documentNames ? brandData.documentNames.join(", ") : "None"}
Uploaded Brand Transcripts (Interviews/Meetings): ${brandData.transcriptNames ? brandData.transcriptNames.join(", ") : "None"}

Please produce a stunning, deep-scan Brand Strategy report in JSON matching this schema exactly:
{
  "positioningStatement": "A comprehensive, high-value brand positioning statement that defines who they serve, the value, and key differentiator (3-4 sentences)",
  "visionStatement": "An ambitious and inspiring vision statement pointing towards long-term cultural impact",
  "brandArchetype": "One core brand archetype (e.g. Creator, Ruler, Sage, Explorer, Everyman, Hero, etc.) with a brief explanation",
  "brandVoice": {
    "primaryAdjective": "Adjective 1",
    "secondaryAdjective": "Adjective 2",
    "tertiaryAdjective": "Adjective 3",
    "guidelines": "Tone of voice guidelines outlining DOs and DONTs for copywriting"
  },
  "swot": {
    "strengths": ["Strength 1", "Strength 2", "Strength 3"],
    "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
    "opportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3"],
    "threats": ["Threat 1", "Threat 2", "Threat 3"]
  },
  "targetPersona": {
    "name": "E.g. Corporate Director Sarah",
    "age": "E.g. 34-45",
    "title": "E.g. VP of Operations",
    "painPoints": ["Pain Point 1", "Pain Point 2"],
    "buyingMotivations": ["Motivation 1", "Motivation 2"]
  },
  "contentPillars": [
    {
      "title": "Pillar 1 Title (e.g., Tech Excellence)",
      "description": "Pillar 1 narrative description",
      "exampleTopic": "Example topic or hook idea"
    },
    {
      "title": "Pillar 2 Title",
      "description": "Pillar 2 narrative",
      "exampleTopic": "Example topic or hook"
    },
    {
      "title": "Pillar 3 Title",
      "description": "Pillar 3 narrative",
      "exampleTopic": "Example topic or hook"
    }
  ],
  "competitiveEdge": "A sharp, strategic analysis of where this brand can win over current competitors."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            positioningStatement: { type: Type.STRING },
            visionStatement: { type: Type.STRING },
            brandArchetype: { type: Type.STRING },
            brandVoice: {
              type: Type.OBJECT,
              properties: {
                primaryAdjective: { type: Type.STRING },
                secondaryAdjective: { type: Type.STRING },
                tertiaryAdjective: { type: Type.STRING },
                guidelines: { type: Type.STRING }
              },
              required: ["primaryAdjective", "secondaryAdjective", "tertiaryAdjective", "guidelines"]
            },
            swot: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                threats: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["strengths", "weaknesses", "opportunities", "threats"]
            },
            targetPersona: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                age: { type: Type.STRING },
                title: { type: Type.STRING },
                painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                buyingMotivations: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["name", "age", "title", "painPoints", "buyingMotivations"]
            },
            contentPillars: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  exampleTopic: { type: Type.STRING }
                },
                required: ["title", "description", "exampleTopic"]
              }
            },
            competitiveEdge: { type: Type.STRING }
          },
          required: [
            "positioningStatement", "visionStatement", "brandArchetype",
            "brandVoice", "swot", "targetPersona", "contentPillars", "competitiveEdge"
          ]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Error generating brand strategy with Gemini:", error);
    // Robust fallback if Gemini is inoperative or missing key
    res.json({
      positioningStatement: `For ambitious organizations positioned in the ${brandData.industry || "market"}, ${brandData.brandName || "the Brand"} delivers high-integrity strategic execution and modern outreach. Unlike typical alternatives, our deep domain scanning enables client-side acceleration and verified structural clarity.`,
      visionStatement: `To establish a transparent, authoritative global baseline for brand strategy and strategic messaging across all platforms.`,
      brandArchetype: "The Sage - Focused on bringing structural clarity, data-driven reasoning, and authoritative intelligence to the marketplace.",
      brandVoice: {
        primaryAdjective: "Authoritative",
        secondaryAdjective: "Serene",
        tertiaryAdjective: "Clear-headed",
        guidelines: "Write with simple, active verbs. Avoid promotional hype or flowery adjectives. Let the structure of the data command respect and interest."
      },
      swot: {
        strengths: [
          "Strong niche positioning in " + (brandData.industry || "its field"),
          "Unified multi-channel footprint coverage",
          "Durable core mission foundation"
        ],
        weaknesses: [
          "Resource limits for immediate global market expansion",
          "Initial brand awareness friction relative to established giants",
          "Synthesizing diverse product narratives into a single focus"
        ],
        opportunities: [
          "Tapping into secondary target markets e.g. Northeast Corridor or Pacific Northwest",
          "Establishing domain thought-leadership on social channels",
          "Using structured intelligence pipelines to save operational overhead"
        ],
        threats: [
          "Fast-evolving customer expectation cycles",
          "Hyper-saturated digital spaces and ad-blindness",
          "Competitor imitation of key value propositions"
        ]
      },
      targetPersona: {
        name: "Director of Enterprise Development",
        age: "35-50",
        title: "VP Brand / Chief Growth Officer",
        painPoints: [
          "Disjointed brand messaging across disparate geographic teams",
          "Lack of a centralized, authoritative single-source strategy document"
        ],
        buyingMotivations: [
          "Desire for swift, zero-overhead tactical alignment",
          "Unwavering focus on clear, structured messaging and ROI"
        ]
      },
      contentPillars: [
        {
          "title": "Strategic Leadership",
          "description": "Publish authoritative reports and system outlooks showing deep regional competence.",
          "exampleTopic": "How geographic density shapes market fit in the upcoming quarter."
        },
        {
          "title": "Behind the Positioning",
          "description": "Demystify core operations and celebrate high-integrity processes.",
          "exampleTopic": "An inside look at our Tier 4 intelligence protocol operations."
        },
        {
          "title": "Optimized Engagement",
          "description": "Provide actionable, clutter-free advice on executing messaging without standard noise.",
          "exampleTopic": "3 critical errors in multi-channel brand layouts."
        }
      ],
      competitiveEdge: `Our competitive edge lies in the combination of localized geographical focus in ${brandData.primaryMarketRegion || "markets"} and highly specialized social intelligence rules.`
    });
  }
});

// Server-side static delivery & Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
