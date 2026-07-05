"use client";

import * as React from "react";

/** True when the viewport is narrower than `breakpointPx` (default: Tailwind's `sm`, 640px). */
export function useIsMobile(breakpointPx = 640): boolean {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [breakpointPx]);

  return isMobile;
}
