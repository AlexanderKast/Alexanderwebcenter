"use client";
import { useEffect, useState } from "react";

export function DaviesScrollTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!show) return null;

  return (
    <button id="goTop" onClick={scrollTop} style={{ display: "flex" }} aria-label="Volver al inicio">
      <span className="border-progress"></span>
      <span className="ic-wrap">
        <span className="icon icon-arrow-caret-right"></span>
      </span>
    </button>
  );
}
