import React, { useState, useEffect, useCallback } from "react";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";

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

// FIPS → state name (US Census codes)
const FIPS: Record<string, string> = {
  "01": "Alabama", "02": "Alaska", "04": "Arizona", "05": "Arkansas",
  "06": "California", "08": "Colorado", "09": "Connecticut", "10": "Delaware",
  "12": "Florida", "13": "Georgia", "15": "Hawaii", "16": "Idaho",
  "17": "Illinois", "18": "Indiana", "19": "Iowa", "20": "Kansas",
  "21": "Kentucky", "22": "Louisiana", "23": "Maine", "24": "Maryland",
  "25": "Massachusetts", "26": "Michigan", "27": "Minnesota", "28": "Mississippi",
  "29": "Missouri", "30": "Montana", "31": "Nebraska", "32": "Nevada",
  "33": "New Hampshire", "34": "New Jersey", "35": "New Mexico", "36": "New York",
  "37": "North Carolina", "38": "North Dakota", "39": "Ohio", "40": "Oklahoma",
  "41": "Oregon", "42": "Pennsylvania", "44": "Rhode Island", "45": "South Carolina",
  "46": "South Dakota", "47": "Tennessee", "48": "Texas", "49": "Utah",
  "50": "Vermont", "51": "Virginia", "53": "Washington", "54": "West Virginia",
  "55": "Wisconsin", "56": "Wyoming",
};

function getDensityColor(density: number, isSelected: boolean): string {
  if (isSelected) return "#0a1a30";
  if (density >= 500) return "#1d5a8e";
  if (density >= 200) return "#4a7db5";
  if (density >= 75)  return "#7aa8d4";
  if (density >= 20)  return "#b3cfea";
  return "#dce8f7";
}

function getDensityLabel(density: number): string {
  if (density >= 500) return "Very High";
  if (density >= 200) return "High";
  if (density >= 75)  return "Medium";
  if (density >= 20)  return "Low";
  return "Very Low";
}

export default function USMap({ selectedState }: USMapProps) {
  const [paths, setPaths] = useState<{ id: string; name: string; d: string }[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
      .then((r) => r.json())
      .then((topology: Topology<{ states: GeometryCollection }>) => {
        const geojson = feature(topology, topology.objects.states);
        const result = geojson.features.map((f) => {
          const fips = String(f.id).padStart(2, "0");
          const name = FIPS[fips] || fips;
          // Convert GeoJSON coordinates to SVG path string
          const d = coordsToPath(f.geometry);
          return { id: fips, name, d };
        });
        setPaths(result.filter((p) => p.d));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const activeState = hovered || selectedState;
  const activeDensity = activeState ? (DENSITY[activeState] ?? null) : null;

  // The US Atlas uses Albers USA pre-projected to ~960×600
  // We render at that size and let the SVG scale via viewBox
  return (
    <div className="w-full">
      {loading ? (
        <div className="w-full h-48 flex items-center justify-center text-xs text-secondary animate-pulse">
          Loading map…
        </div>
      ) : (
        <svg
          viewBox="0 0 960 600"
          className="w-full h-auto"
          style={{ maxHeight: "360px" }}
          role="img"
          aria-label="US population density map"
        >
          {paths.map(({ id, name, d }) => {
            const density = DENSITY[name] ?? 0;
            const isSelected = name === selectedState;
            const isHovered = name === hovered;
            const fill = getDensityColor(density, isSelected);

            return (
              <path
                key={id}
                d={d}
                fill={fill}
                stroke="#ffffff"
                strokeWidth={isSelected ? 2 : isHovered ? 1.5 : 0.5}
                strokeLinejoin="round"
                style={{ transition: "fill 0.15s ease, stroke-width 0.1s ease", cursor: "pointer" }}
                onMouseEnter={() => setHovered(name)}
                onMouseLeave={() => setHovered(null)}
              >
                <title>{name}: {(DENSITY[name] ?? 0).toLocaleString()} people/mi²</title>
              </path>
            );
          })}
        </svg>
      )}

      {/* Active state info */}
      {activeState && activeDensity !== null && (
        <div className="mt-3 flex items-center justify-between border-t border-secondary/10 pt-3">
          <div>
            <span className="block text-xs font-bold text-primary">{activeState}</span>
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

// Convert a GeoJSON geometry to an SVG path string
// Coordinates from US Atlas are already in Albers USA screen space (~960×600)
function coordsToPath(geometry: GeoJSON.Geometry | null): string {
  if (!geometry) return "";

  const ringToPath = (ring: number[][]): string =>
    ring.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("") + "Z";

  if (geometry.type === "Polygon") {
    return geometry.coordinates.map(ringToPath).join(" ");
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates
      .map((poly) => poly.map(ringToPath).join(" "))
      .join(" ");
  }
  return "";
}
