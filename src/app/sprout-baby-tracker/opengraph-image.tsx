import { ImageResponse } from "next/og";

export const alt = "Sprout Baby Tracker — free, private and offline";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1e2922",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "#81b29a",
            }}
          />
          <div
            style={{
              display: "flex",
              color: "#fbf9f5",
              fontSize: "34px",
              fontWeight: 700,
            }}
          >
            Sprout Baby
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              display: "flex",
              color: "#fbf9f5",
              fontSize: "72px",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            The calm baby tracker
          </div>
          <div style={{ display: "flex", color: "#a9d3bd", fontSize: "32px" }}>
            Free · Private · Works offline
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "28px",
            color: "#ece6d9",
            fontSize: "26px",
          }}
        >
          <div style={{ display: "flex" }}>Feeds</div>
          <div style={{ display: "flex" }}>Sleep</div>
          <div style={{ display: "flex" }}>Diapers</div>
          <div style={{ display: "flex" }}>Growth</div>
          <div style={{ display: "flex" }}>Milestones</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
