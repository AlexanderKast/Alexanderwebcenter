import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const runtime = "edge";
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #000000 0%, #0A0A0A 40%, #0B1A2E 100%)",
          color: "#ffffff",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 28,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#E6B800",
            fontWeight: 600,
          }}
        >
          {site.tagline}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              fontSize: 110,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Alexander Cast
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#c9c9c9",
              maxWidth: 1000,
              lineHeight: 1.3,
            }}
          >
            {site.rol}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 24,
            color: "#9a9a9a",
          }}
        >
          <div style={{ display: "flex" }}>{site.url.replace("https://", "")}</div>
          <div style={{ display: "flex", color: "#E6B800" }}>{site.handle}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
