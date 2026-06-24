import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { url } = req.body || {};
  const slug = url
    ? url.replace(/https?:\/\/(www\.)?/, "").split(".")[0].toUpperCase()
    : "BRAND";

  res.json({
    brandName: slug.charAt(0) + slug.slice(1).toLowerCase(),
    industry: "Technology & SaaS",
    tagline: "Empowering Next-Generation Operations",
    about: `An innovative platform built to expand global outreach and drive enterprise-ready execution for ${url || "your brand"}.`,
    city: "Austin",
    state: "Texas",
    primaryMarketRegion: "Texas",
    facebook: slug.toLowerCase(),
    instagram: slug.toLowerCase(),
    googleBusiness: `${slug.charAt(0) + slug.slice(1).toLowerCase()} HQ`,
    socialContext:
      "Professional, clear corporate voice focused on industry insights and thought leadership.",
  });
}
