"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

export function CalEmbed({
  calLink,
  namespace = "consultoria",
}: {
  calLink: string;
  namespace?: string;
}) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace });
      cal("ui", {
        cssVarsPerTheme: {
          dark: { "cal-brand": "#E6B800" },
          light: { "cal-brand": "#E6B800" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, [namespace]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
      <Cal
        namespace={namespace}
        calLink={calLink}
        style={{ width: "100%", height: "680px", overflow: "scroll" }}
        config={{ layout: "month_view", theme: "dark" }}
      />
    </div>
  );
}
