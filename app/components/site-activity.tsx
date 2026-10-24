"use client";

import { useEffect, useRef } from "react";
import { reportSiteActivity } from "../lib/site-activity";

export function PageActivity() {
  const reported = useRef(false);
  useEffect(() => {
    if (reported.current) return;
    reported.current = true;
    reportSiteActivity({ kind: "page_view" });
  }, []);
  return null;
}
