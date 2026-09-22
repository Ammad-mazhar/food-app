import { ImageResponse } from "next/og";
import { restaurantInfo } from "@/lib/restaurant";

export const alt = `${restaurantInfo.name} — ${restaurantInfo.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Share card for links to the site. Drawn rather than photographed so it needs
 * no font or image files at build time, and stays in the site's dark/gold
 * palette. Individual dish pages override this with their own photo via
 * generateMetadata.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0b0908 0%, #15100d 55%, #1e1712 100%)",
          color: "#f3ead9",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 26,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#c9a24b",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#b3432b",
            }}
          />
          Saddar, Rawalpindi · Est. 2011
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 92,
            fontWeight: 700,
            lineHeight: 1.05,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>{restaurantInfo.name}</span>
          <span style={{ color: "#e8cd8a" }}>Texas-sized flavor.</span>
        </div>

        <div style={{ marginTop: 32, fontSize: 34, color: "rgba(243,234,217,0.7)" }}>
          Fresh, never-frozen steaks — fire-grilled to order.
        </div>

        <div
          style={{
            marginTop: 44,
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: 26,
            color: "#c9a24b",
          }}
        >
          {/* Plain ASCII only: Satori fetches a remote font for glyphs outside
              the bundled set (a star, an em dash), which fails offline and at
              build time on a sandboxed CI box. */}
          <div style={{ width: 120, height: 3, background: "#c9a24b" }} />
          {restaurantInfo.rating.toFixed(1)} stars ·{" "}
          {restaurantInfo.reviewCount}+ reviews · {restaurantInfo.ranking}
        </div>
      </div>
    ),
    size
  );
}
