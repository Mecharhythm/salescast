import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const S = {
  app: { minHeight: "100vh", background: "#f8f9fb", color: "#111827", fontFamily: "'DM Sans','Noto Sans JP',sans-serif", paddingBottom: 80 },
  header: { background: "#fff", borderBottom: "0.5px solid #e5e7eb", padding: "14px 32px", display: "flex", alignItems: "center", gap: 10 },
  logo: { fontSize: 18, fontWeight: 600, background: "linear-gradient(135deg,#2563eb,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", cursor: "pointer" },
  backBtn: { marginLeft: "auto", background: "none", border: "0.5px solid #e5e7eb", color: "#6b7280", borderRadius: 7, padding: "6px 14px", fontSize: 13, cursor: "pointer" },
  main: { maxWidth: 780, margin: "0 auto", padding: "32px 20px" },
  card: { background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 14, padding: "28px 36px", marginBottom: 16 },
  p: { fontSize: 14, lineHeight: 1.8, color: "#6b7280", marginBottom: 10 },
  tag: { display: "inline-block", background: "#eff6ff", border: "0.5px solid #bfdbfe", borderRadius: 6, padding: "2px 10px", fontSize: 12, color: "#1d4ed8", marginRight: 8 },
  benefit: { background: "#f9fafb", border: "0.5px solid #e5e7eb", borderRadius: 8, padding: "12px 16px", marginBottom: 8, fontSize: 14, color: "#374151", display: "flex", gap: 10 },
  ctaBtn: { display: "block", width: "100%", padding: "14px", background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff", border: "none", borderRadius: 9, fontSize: 15, fontWeight: 500, cursor: "pointer", marginTop: 20 },
  langBtn: (active) => ({ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? "#2563eb" : "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: "2px 4px" }),
};

export default function UseCases() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isJa = i18n.language === "ja";

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const cases = t("usecases.cases", { returnObjects: true });

  return (
    <div style={S.app}>
      <div style={S.header}>
        <div style={S.logo} onClick={() => navigate("/")}>SalesCast</div>
        <div style={{ fontSize: 12, color: "#9ca3af", marginLeft: 4 }}>{t("nav.subtitle")}</div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button style={S.langBtn(isJa)}  onClick={() => i18n.changeLanguage("ja")}>JA</button>
            <span style={{ color: "#d1d5db", fontSize: 12 }}>|</span>
            <button style={S.langBtn(!isJa)} onClick={() => i18n.changeLanguage("en")}>EN</button>
          </div>
          <button style={S.backBtn} onClick={() => navigate("/")}>{t("nav.back")}</button>
        </div>
      </div>

      <div style={S.main}>
        {/* イントロ */}
        <div style={S.card}>
          <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.3px" }}>{t("usecases.title")}</div>
          <p style={S.p}>{t("usecases.intro")}</p>
        </div>

        {/* ケースカード */}
        {cases.map((c) => (
          <div key={c.industry} style={S.card}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
            <span style={S.tag}>{c.industry}</span>
            <div style={{ fontSize: 17, fontWeight: 600, marginTop: 12, marginBottom: 10 }}>{c.title}</div>
            <p style={S.p}>{c.description}</p>
            <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", margin: "16px 0 10px" }}>{t("usecases.benefitsLabel")}</div>
            {c.benefits.map((b, i) => (
              <div key={i} style={S.benefit}>
                <span style={{ color: "#2563eb", flexShrink: 0 }}>✓</span><span>{b}</span>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: "10px 14px", background: "#f9fafb", border: "0.5px solid #e5e7eb", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{t("usecases.dataExampleLabel")}</div>
              <div style={{ fontSize: 13, color: "#374151" }}>📄 {c.dataExample}</div>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div style={{ ...S.card, textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{t("usecases.ctaTitle")}</div>
          <p style={S.p}>{t("usecases.ctaDesc")}</p>
          <button style={S.ctaBtn} onClick={() => navigate("/")}>{t("usecases.ctaBtn")}</button>
        </div>
      </div>
    </div>
  );
}