import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SERVICE_NAME = "SalesCast";
const SERVICE_URL  = "https://salescast.vercel.app";
const ENACTED_DATE_JA = "2026年4月5日";
const ENACTED_DATE_EN = "April 5, 2026";

const S = {
  app: { minHeight: "100vh", background: "#f8f9fb", color: "#111827", fontFamily: "'DM Sans','Noto Sans JP',sans-serif", paddingBottom: 80 },
  header: { background: "#fff", borderBottom: "0.5px solid #e5e7eb", padding: "14px 32px", display: "flex", alignItems: "center", gap: 10 },
  logo: { fontSize: 18, fontWeight: 600, background: "linear-gradient(135deg,#2563eb,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", cursor: "pointer" },
  backBtn: { marginLeft: "auto", background: "none", border: "0.5px solid #e5e7eb", color: "#6b7280", borderRadius: 7, padding: "6px 14px", fontSize: 13, cursor: "pointer" },
  main: { maxWidth: 780, margin: "0 auto", padding: "32px 20px" },
  card: { background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 14, padding: "36px 44px", marginBottom: 16 },
  h1: { fontSize: 24, fontWeight: 600, marginBottom: 6, letterSpacing: "-0.3px" },
  h2: { fontSize: 15, fontWeight: 600, marginTop: 28, marginBottom: 10, color: "#2563eb" },
  p: { fontSize: 14, lineHeight: 1.8, color: "#6b7280", marginBottom: 10 },
  li: { fontSize: 14, lineHeight: 1.8, color: "#6b7280", marginBottom: 6, paddingLeft: 6 },
  divider: { border: "none", borderTop: "0.5px solid #e5e7eb", margin: "32px 0" },
  date: { fontSize: 13, color: "#9ca3af", marginBottom: 28 },
  sectionTitle: { fontSize: 18, fontWeight: 600, marginBottom: 20 },
  langBtn: (active) => ({ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? "#2563eb" : "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: "2px 4px" }),
};

export default function Privacy() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isJa = i18n.language === "ja";
  const date = isJa ? ENACTED_DATE_JA : ENACTED_DATE_EN;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const pp2Items      = t("privacy.pp2Items",       { returnObjects: true });
  const pp3PItems     = t("privacy.pp3PrincipleItems", { returnObjects: true });
  const pp3OItems     = t("privacy.pp3OptInItems",  { returnObjects: true });
  const tos2Items     = t("privacy.tos2Items",      { returnObjects: true });

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
        <div style={S.card}>
          <div style={S.h1}>{t("privacy.title")}</div>
          <div style={S.date}>{t("privacy.enacted", { date })}</div>

          {/* プライバシーポリシー */}
          <div style={S.sectionTitle}>{t("privacy.ppTitle")}</div>

          <div style={S.h2}>{t("privacy.pp1Title")}</div>
          {t("privacy.pp1Body", { service: SERVICE_NAME, url: SERVICE_URL }).split("\n").map((line, i) => (
            <p key={i} style={S.p}>{line}</p>
          ))}

          <div style={S.h2}>{t("privacy.pp2Title")}</div>
          <p style={S.p}>{t("privacy.pp2Body")}</p>
          <ul style={{ paddingLeft: 20 }}>{pp2Items.map((item, i) => <li key={i} style={S.li}>{item}</li>)}</ul>

          <div style={S.h2}>{t("privacy.pp3Title")}</div>
          <p style={{ ...S.p, fontWeight: 600, color: "#374151" }}>{t("privacy.pp3PrincipleTitle")}</p>
          <ul style={{ paddingLeft: 20 }}>{pp3PItems.map((item, i) => <li key={i} style={S.li}>{item}</li>)}</ul>
          <p style={{ ...S.p, fontWeight: 600, color: "#374151", marginTop: 12 }}>{t("privacy.pp3OptInTitle")}</p>
          <p style={S.p}>{t("privacy.pp3OptInIntro")}</p>
          <ul style={{ paddingLeft: 20 }}>{pp3OItems.map((item, i) => <li key={i} style={S.li}>{item}</li>)}</ul>

          <div style={S.h2}>{t("privacy.pp4Title")}</div>
          <p style={S.p}>{t("privacy.pp4Body")}</p>

          <div style={S.h2}>{t("privacy.pp5Title")}</div>
          <p style={S.p}>{t("privacy.pp5Body")}</p>

          <div style={S.h2}>{t("privacy.pp6Title")}</div>
          <p style={S.p}>{t("privacy.pp6Body")}</p>

          <div style={S.h2}>{t("privacy.pp7Title")}</div>
          <p style={S.p}>{t("privacy.pp7Body")}</p>

          <hr style={S.divider} />

          {/* 利用規約 */}
          <div style={S.sectionTitle}>{t("privacy.tosTitle")}</div>

          <div style={S.h2}>{t("privacy.tos1Title")}</div>
          <p style={S.p}>{t("privacy.tos1Body", { service: SERVICE_NAME })}</p>

          <div style={S.h2}>{t("privacy.tos2Title")}</div>
          <ul style={{ paddingLeft: 20 }}>{tos2Items.map((item, i) => <li key={i} style={S.li}>{item}</li>)}</ul>

          <div style={S.h2}>{t("privacy.tos3Title")}</div>
          <p style={S.p}>{t("privacy.tos3Body")}</p>

          <div style={S.h2}>{t("privacy.tos4Title")}</div>
          <p style={S.p}>{t("privacy.tos4Body")}</p>

          <div style={S.h2}>{t("privacy.tos5Title")}</div>
          <p style={S.p}>{t("privacy.tos5Body")}</p>

          <div style={S.h2}>{t("privacy.tos6Title")}</div>
          <p style={S.p}>{t("privacy.tos6Body")}</p>

          <p style={{ ...S.p, textAlign: "right", marginTop: 32 }}>{t("privacy.enacted2", { date })}</p>
        </div>
      </div>
    </div>
  );
}