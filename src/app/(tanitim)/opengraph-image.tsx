import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { platformName, rootDomain } from "@/lib/config";

// Tanıtım sitesinin paylaşım görseli (WhatsApp, sosyal medya). Derlemede bir kez üretilir. Varsayılan yazı tipinde
// Türkçe harfler (ş, ğ, ı) olmadığı için Geist dosyası verilir.

export const alt = `${platformName}: Esnafa hazır web sitesi`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [medium, bold] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/Geist-500.ttf")),
    readFile(join(process.cwd(), "src/assets/fonts/Geist-700.ttf")),
  ]);
  const [first, ...rest] = platformName.split(" ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #ecfdf5 0%, #ffffff 60%)",
          fontFamily: "Geist",
          color: "#0f172a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 44, fontWeight: 700 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#047857",
              color: "white",
            }}
          >
            {first.charAt(0)}
          </div>
          <span>{first}</span>
          {rest.length > 0 && (
            <span style={{ background: "#fcd34d", color: "#451a03", borderRadius: 12, padding: "2px 14px" }}>{rest.join(" ")}</span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1, letterSpacing: -2 }}>Esnafa hazır web sitesi</div>
          <div style={{ fontSize: 34, fontWeight: 500, color: "#047857" }}>Google&apos;da ve yapay zekâ asistanlarında bulunur.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, fontWeight: 500, color: "#475569" }}>
          <span>Usta · Restoran · Kuaför · Klinik</span>
          <span>{rootDomain}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: medium, weight: 500, style: "normal" },
        { name: "Geist", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
