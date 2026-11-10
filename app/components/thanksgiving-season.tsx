"use client";

import { useSyncExternalStore, type ReactNode } from "react";

// Midnight after November 30, 2026, in America/Los_Angeles.
export const thanksgivingEndsAt = Date.parse("2026-12-01T00:00:00-08:00");
export const isThanksgivingSeason = (now = Date.now()) => now < thanksgivingEndsAt;
const serverSeason = () => true;

function subscribeToSeason(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>;
  const schedule = () => {
    onChange();
    if (isThanksgivingSeason()) {
      timer = setTimeout(schedule, Math.min(thanksgivingEndsAt - Date.now() + 1, 2_147_483_647));
    }
  };
  schedule();
  window.addEventListener("focus", onChange);
  return () => {
    clearTimeout(timer);
    window.removeEventListener("focus", onChange);
  };
}

export function useThanksgivingSeason() {
  return useSyncExternalStore(subscribeToSeason, isThanksgivingSeason, serverSeason);
}

export function ThanksgivingSeason({ children }: { children: ReactNode }) {
  const active = useThanksgivingSeason();
  return <div className={active ? "thanksgiving-theme" : "site-theme"}>
    {active && <div className="thanksgiving-note"><span aria-hidden="true">❧</span><span>A season to gather &amp; give thanks</span><span aria-hidden="true">❧</span></div>}
    {children}
  </div>;
}
