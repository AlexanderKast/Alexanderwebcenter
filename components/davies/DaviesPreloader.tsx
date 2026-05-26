"use client";
import { useEffect, useState } from "react";

export function DaviesPreloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="preloader overflow-hidden">
      <div className="site-name">
        <span>
          Estrateg<span className="text-primary">IA</span>
        </span>
      </div>
      <div className="preloader-gutters">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="bar">
            <div className="inner-bar"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
