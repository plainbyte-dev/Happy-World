"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import BrandMark from "@/components/brand-mark";

const FADE_MS = 350;
const HOLD_MS = 350;
const MIN_VISIBLE_MS = FADE_MS + HOLD_MS;

function PageTransitionOverlay() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const previousPathname = useRef(pathname);
  const shownAtRef = useRef<number | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (/^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (href === pathname) return;

      shownAtRef.current = Date.now();
      setVisible(true);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    const elapsed = shownAtRef.current ? Date.now() - shownAtRef.current : MIN_VISIBLE_MS;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    const timeout = setTimeout(() => {
      setVisible(false);
      shownAtRef.current = null;
    }, remaining);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div className={`page-transition-overlay ${visible ? "is-visible" : ""}`} aria-hidden={!visible}>
      <div className="page-transition-logo">
        <BrandMark />
      </div>
    </div>
  );
}

export default PageTransitionOverlay;
