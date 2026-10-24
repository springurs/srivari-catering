"use client";

import { createContext, useContext, useState, type CSSProperties, type ReactNode } from "react";

const DiwaliMotion = createContext({ paused: false, toggle: () => {} });

/** Code-drawn artwork keeps the seasonal decorations small and crisp at every size. */
export function FestiveDiya({ className = "" }: { className?: string }) {
  return (
    <span className={`festive-diya ${className}`} aria-hidden="true">
      <span className="diya-glow" />
      <svg viewBox="0 0 120 120" fill="none" focusable="false">
        <g className="diya-flame">
          <path d="M61 10C69 30 83 39 76 55C70 69 49 66 46 53C42 40 59 28 61 10Z" fill="#F9AA37" />
          <path d="M61 29C64 42 72 47 67 55C63 63 53 58 54 51C54 45 60 38 61 29Z" fill="#FFF4B8" />
        </g>
        <path d="M60 63L64 71" stroke="#5D371D" strokeWidth="3" strokeLinecap="round" />
        <path d="M14 72C22 114 97 114 106 72Z" fill="#A74D29" />
        <path d="M20 78C36 99 84 99 100 78" stroke="#E99E45" strokeWidth="3" />
        <ellipse cx="60" cy="72" rx="46" ry="10" fill="#D68B37" stroke="#F9D58A" strokeWidth="2" />
        <ellipse cx="60" cy="72" rx="35" ry="5" fill="#F4BA54" />
        <path d="M33 90L36 92M47 95L50 96M63 97H66M79 94L82 93" stroke="#FFE1A1" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function Firework({ className }: { className: string }) {
  return (
    <span className={`festive-firework ${className}`}>
      {Array.from({ length: 12 }, (_, index) => (
        <i key={index} style={{ "--spark-angle": `${index * 30}deg` } as CSSProperties} />
      ))}
    </span>
  );
}

export function DiwaliStringLights() {
  return (
    <svg className="diwali-string-lights" viewBox="0 0 1200 90" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
      <path d="M0 8Q150 80 300 8Q450 80 600 8Q750 80 900 8Q1050 80 1200 8" stroke="#CEAE68" strokeOpacity=".65" />
      {Array.from({ length: 20 }, (_, index) => {
        const x = index * 60 + 30;
        const position = (x % 300) / 300;
        const y = 8 + 144 * position * (1 - position);
        return (
          <g key={index} className="diwali-string-bulb" style={{ animationDelay: `${(index % 4) * -.8}s` }}>
            <path d={`M${x} ${y}v9`} stroke="#CEAE68" />
            <ellipse cx={x} cy={y + 14} rx="3" ry="5" fill="#FFD78A" />
            <ellipse cx={x} cy={y + 14} rx="9" ry="11" fill="#FFC15A" opacity=".13" />
          </g>
        );
      })}
    </svg>
  );
}

export function DiwaliLightsControl() {
  const { paused, toggle } = useContext(DiwaliMotion);
  return (
    <button className="diwali-lights-control" type="button" onClick={toggle} aria-pressed={paused}>
      <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
      {paused ? "Play festive lights" : "Pause festive lights"}
    </button>
  );
}

/** Seasonal styling is isolated here so a future occasion can replace this theme. */
export function DiwaliSeason({ children, active = true }: { children: ReactNode; active?: boolean }) {
  const [paused, setPaused] = useState(false);

  if (!active) return children;

  return (
    <DiwaliMotion.Provider value={{ paused, toggle: () => setPaused((value) => !value) }}>
      <div className="diwali-season" data-paused={paused}>
        <div className="diwali-page-decorations" aria-hidden="true">
          <FestiveDiya className="diya-page-left" />
          <FestiveDiya className="diya-page-right" />
          <Firework className="firework-one" />
          <Firework className="firework-two" />
          <Firework className="firework-three" />
          <div className="diwali-embers">
            {Array.from({ length: 8 }, (_, index) => <i key={index} style={{ "--ember-index": index } as CSSProperties} />)}
          </div>
        </div>
        {children}
      </div>
    </DiwaliMotion.Provider>
  );
}
