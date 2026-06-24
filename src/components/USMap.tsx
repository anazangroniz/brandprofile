import React, { useState } from "react";

interface USMapProps {
  selectedState: string;
}

// Population density per sq mile — 2020 US Census
const DENSITY: Record<string, number> = {
  Alabama: 100, Alaska: 1, Arizona: 64, Arkansas: 57, California: 254,
  Colorado: 56, Connecticut: 741, Delaware: 504, Florida: 401, Georgia: 186,
  Hawaii: 224, Idaho: 22, Illinois: 232, Indiana: 189, Iowa: 57, Kansas: 35,
  Kentucky: 114, Louisiana: 107, Maine: 43, Maryland: 636, Massachusetts: 902,
  Michigan: 178, Minnesota: 71, Mississippi: 63, Missouri: 89, Montana: 7,
  Nebraska: 25, Nevada: 29, "New Hampshire": 153, "New Jersey": 1263,
  "New Mexico": 17, "New York": 428, "North Carolina": 214, "North Dakota": 11,
  Ohio: 289, Oklahoma: 57, Oregon: 44, Pennsylvania: 290, "Rhode Island": 1061,
  "South Carolina": 170, "South Dakota": 11, Tennessee: 167, Texas: 111,
  Utah: 40, Vermont: 68, Virginia: 216, Washington: 116, "West Virginia": 77,
  Wisconsin: 108, Wyoming: 6,
};

// Tile grid: [abbreviation, row, col, full name]
const TILES: [string, number, number, string][] = [
  ["ME", 0, 11, "Maine"],
  ["VT", 1, 9, "Vermont"], ["NH", 1, 10, "New Hampshire"],
  ["WA", 2, 0, "Washington"], ["MT", 2, 1, "Montana"], ["ND", 2, 2, "North Dakota"],
  ["MN", 2, 3, "Minnesota"], ["WI", 2, 6, "Wisconsin"], ["MI", 2, 7, "Michigan"],
  ["NY", 2, 9, "New York"], ["MA", 2, 10, "Massachusetts"],
  ["OR", 3, 0, "Oregon"], ["ID", 3, 1, "Idaho"], ["SD", 3, 2, "South Dakota"],
  ["IA", 3, 3, "Iowa"], ["IL", 3, 5, "Illinois"], ["IN", 3, 6, "Indiana"],
  ["OH", 3, 7, "Ohio"], ["PA", 3, 8, "Pennsylvania"], ["NJ", 3, 9, "New Jersey"],
  ["CT", 3, 10, "Connecticut"], ["RI", 3, 11, "Rhode Island"],
  ["CA", 4, 0, "California"], ["NV", 4, 1, "Nevada"], ["WY", 4, 2, "Wyoming"],
  ["NE", 4, 3, "Nebraska"], ["MO", 4, 4, "Missouri"], ["KY", 4, 5, "Kentucky"],
  ["WV", 4, 6, "West Virginia"], ["VA", 4, 7, "Virginia"], ["MD", 4, 8, "Maryland"],
  ["DE", 4, 9, "Delaware"],
  ["UT", 5, 1, "Utah"], ["CO", 5, 2, "Colorado"], ["KS", 5, 3, "Kansas"],
  ["TN", 5, 5, "Tennessee"], ["NC", 5, 6, "North Carolina"], ["SC", 5, 7, "South Carolina"],
  ["AZ", 6, 1, "Arizona"], ["NM", 6, 2, "New Mexico"], ["OK", 6, 3, "Oklahoma"],
  ["AR", 6, 4, "Arkansas"], ["MS", 6, 5, "Mississippi"], ["AL", 6, 6, "Alabama"],
  ["GA", 6, 7, "Georgia"],
  ["TX", 7, 3, "Texas"], ["LA", 7, 5, "Louisiana"], ["FL", 7, 7, "Florida"],
  ["HI", 8, 0, "Hawaii"], ["AK", 8, 1, "Alaska"],
];

function getDensityColor(density: number, isSelected: boolean): string {
  if (isSelected) return "#0a1a30";
  if (density >= 500) return "#1d5a8e";
  if (density >= 200) return "#4a7db5";
  if (density >= 75) return "#7aa8d4";
  if (density >= 20) return "#b3cfea";
  return "#dce8f7";
}

function getDensityLabel(density: number): string {
  if (density >= 500) return "Very High";
  if (density >= 200) return "High";
  if (density >= 75) return "Medium";
  if (density >= 20) return "Low";
  return "Very Low";
}

export default function USMap({ selectedState }: USMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const TILE = 48;
  const GAP = 3;
  const STEP = TILE + GAP;
  const W = 12 * STEP;
  const H = 9 * STEP;

  const activeState = hovered || selectedState;
  const activeDensity = activeState ? (DENSITY[activeState] ?? null) : null;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        style={{ maxHeight: "340px" }}
        role="img"
        aria-label="US population density map"
      >
        {TILES.map(([abbr, row, col, name]) => {
          const density = DENSITY[name] ?? 0;
          const isSelected = name === selectedState;
          const isHovered = name === hovered;
          const fill = getDensityColor(density, isSelected);
          const x = col * STEP;
          const y = row * STEP;
          const lightText = isSelected || density >= 200;

          return (
            <g
              key={abbr}
              onMouseEnter={() => setHovered(name)}
              onMouseLeave={() => setHovered(null)}
            >
              <rect
                x={x} y={y}
                width={TILE} height={TILE}
                fill={fill}
                stroke={isSelected ? "#0a1a30" : isHovered ? "#4a7db5" : "#ffffff"}
                strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 0.8}
                rx={4}
                style={{ transition: "all 0.12s ease" }}
              />
              <text
                x={x + TILE / 2}
                y={y + TILE / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10}
                fontWeight={isSelected ? "700" : "500"}
                fill={lightText ? "#ffffff" : "#1a2b44"}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {abbr}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Active state info */}
      {activeState && activeDensity !== null && (
        <div className="mt-3 flex items-center justify-between border-t border-secondary/10 pt-3">
          <div>
            <span className="block text-xs font-bold text-primary">
              {activeState}
            </span>
            <span className="text-[10px] text-secondary">
              {activeDensity.toLocaleString()} people/mi²
            </span>
          </div>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{
              background: getDensityColor(activeDensity, false) + "33",
              color: getDensityColor(activeDensity, false),
            }}
          >
            {getDensityLabel(activeDensity)}
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <span className="text-[9px] text-secondary font-bold uppercase tracking-wider shrink-0">
          pop/mi²
        </span>
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
