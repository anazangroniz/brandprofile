import React, { useState } from "react";

interface USMapProps {
  selectedState: string;
}

// Population density per sq mile — 2020 US Census
const DENSITY: Record<string, number> = {
  AL: 100, AK: 1, AZ: 64, AR: 57, CA: 254, CO: 56, CT: 741, DE: 504,
  FL: 401, GA: 186, HI: 224, ID: 22, IL: 232, IN: 189, IA: 57, KS: 35,
  KY: 114, LA: 107, ME: 43, MD: 636, MA: 902, MI: 178, MN: 71, MS: 63,
  MO: 89, MT: 7, NE: 25, NV: 29, NH: 153, NJ: 1263, NM: 17, NY: 428,
  NC: 214, ND: 11, OH: 289, OK: 57, OR: 44, PA: 290, RI: 1061, SC: 170,
  SD: 11, TN: 167, TX: 111, UT: 40, VT: 68, VA: 216, WA: 116, WV: 77,
  WI: 108, WY: 6,
};

const ABBR_TO_NAME: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina",
  ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee",
  TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington",
  WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

// Standard tile-grid layout — geographic approximation (11 cols × 8 rows)
const GRID: (string | null)[][] = [
  ["AK", null, null, null, null, null, null, null, null, null, "ME"],
  [null, null, null, null, null, null, null, null, "VT", "NH", null],
  ["WA", "ID", "MT", "ND", "MN", "WI", null, "MI", "NY", "MA", "RI"],
  ["OR", "NV", "WY", "SD", "IA", "IL", "IN", "OH", "PA", "CT", "NJ"],
  ["CA", "UT", "CO", "NE", "MO", "KY", "WV", "VA", "MD", "DE", null],
  [null, "AZ", "NM", "KS", "AR", "TN", "NC", "SC", null, null, null],
  [null, null, null, "OK", "LA", "MS", "AL", "GA", null, null, null],
  ["HI", null, null, "TX", null, null, null, "FL", null, null, null],
];

function getDensityColor(density: number): string {
  if (density >= 500) return { bg: "#1d5a8e", text: "#ffffff" }.bg;
  if (density >= 200) return "#4a7db5";
  if (density >= 75)  return "#7aa8d4";
  if (density >= 20)  return "#b3cfea";
  return "#dce8f7";
}

function getDensityTextColor(density: number): string {
  if (density >= 200) return "#ffffff";
  return "#0a1a30";
}

function getDensityLabel(density: number): string {
  if (density >= 500) return "Very High";
  if (density >= 200) return "High";
  if (density >= 75)  return "Medium";
  if (density >= 20)  return "Low";
  return "Very Low";
}

export default function USMap({ selectedState }: USMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  // Convert full state name → abbreviation for matching
  const selectedAbbr = Object.entries(ABBR_TO_NAME).find(
    ([, name]) => name === selectedState
  )?.[0] ?? null;

  const activeAbbr = hovered || selectedAbbr;
  const activeName = activeAbbr ? ABBR_TO_NAME[activeAbbr] : null;
  const activeDensity = activeAbbr ? (DENSITY[activeAbbr] ?? null) : null;

  return (
    <div className="w-full">
      {/* Tile grid */}
      <div className="w-full overflow-x-auto">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(11, 1fr)",
            gap: "3px",
            maxWidth: "100%",
          }}
        >
          {GRID.map((row, r) =>
            row.map((abbr, c) => {
              if (!abbr) {
                return <div key={`${r}-${c}`} />;
              }
              const density = DENSITY[abbr] ?? 0;
              const isSelected = abbr === selectedAbbr;
              const isHovered = abbr === hovered;
              const bg = isSelected ? "#0a1a30" : getDensityColor(density);
              const textColor = isSelected ? "#ffffff" : getDensityTextColor(density);

              return (
                <div
                  key={abbr}
                  title={`${ABBR_TO_NAME[abbr]}: ${density.toLocaleString()} people/mi²`}
                  onMouseEnter={() => setHovered(abbr)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    backgroundColor: bg,
                    color: textColor,
                    aspectRatio: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "clamp(7px, 1.1vw, 11px)",
                    fontWeight: isSelected || isHovered ? 700 : 500,
                    letterSpacing: "0.02em",
                    transition: "all 0.12s ease",
                    outline: isHovered && !isSelected ? "2px solid #4a7db5" : "none",
                    outlineOffset: "1px",
                    transform: isHovered && !isSelected ? "scale(1.08)" : "scale(1)",
                  }}
                >
                  {abbr}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Active state info */}
      {activeName && activeDensity !== null && (
        <div className="mt-3 flex items-center justify-between border-t border-secondary/10 pt-3">
          <div>
            <span className="block text-xs font-bold text-primary">{activeName}</span>
            <span className="text-[10px] text-secondary">
              {activeDensity.toLocaleString()} people/mi²
            </span>
          </div>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{
              background: getDensityColor(activeDensity) + "33",
              color: getDensityColor(activeDensity) === "#dce8f7" ? "#4a7db5" : getDensityColor(activeDensity),
            }}
          >
            {getDensityLabel(activeDensity)}
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <span className="text-[9px] text-secondary font-bold uppercase tracking-wider shrink-0">pop/mi²</span>
        {[
          { color: "#dce8f7", label: "< 20" },
          { color: "#b3cfea", label: "20–75" },
          { color: "#7aa8d4", label: "75–200" },
          { color: "#4a7db5", label: "200–500" },
          { color: "#1d5a8e", label: "500+" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
            <span className="text-[9px] text-secondary">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
