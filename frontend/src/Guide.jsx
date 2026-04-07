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
  h1: { fontSize: 24, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.3px" },
  h2: { fontSize: 16, fontWeight: 600, marginTop: 28, marginBottom: 10, color: "#2563eb" },
  p: { fontSize: 14, lineHeight: 1.8, color: "#6b7280", marginBottom: 10 },
  tag: { display: "inline-block", background: "#eff6ff", border: "0.5px solid #bfdbfe", borderRadius: 6, padding: "2px 10px", fontSize: 12, color: "#1d4ed8", marginRight: 8, marginBottom: 8 },
  step: { display: "flex", gap: 18, marginBottom: 28, alignItems: "flex-start" },
  stepNum: { minWidth: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 14, color: "#fff", flexShrink: 0 },
  code: { background: "#f9fafb", border: "0.5px solid #e5e7eb", borderRadius: 7, padding: "10px 14px", fontSize: 12, fontFamily: "monospace", color: "#2563eb", marginTop: 8, display: "block", whiteSpace: "pre" },
  faqQ: { fontSize: 14, fontWeight: 600, marginBottom: 6, color: "#111827" },
  faqA: { fontSize: 14, lineHeight: 1.8, color: "#6b7280", marginBottom: 20 },
  langBtn: (active) => ({ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? "#2563eb" : "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: "2px 4px" }),
};

export default function Guide() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isJa = i18n.language === "ja";

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const steps = t("guide.steps", { returnObjects: true });
  const tags  = t("guide.tags",  { returnObjects: true });
  const faqs  = t("guide.faqs",  { returnObjects: true });

  return (
    <div style={S.app}>
      <div style={S.header}>
        <div style={S.logo} onClick={() => navigate("/")}> SalesCast</div>
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
        {/* イントロカード */}
        <div style={S.card}>
          <div style={S.h1}>{t("guide.title")}</div>
          <p style={{ ...S.p, marginBottom: 16 }}>{t("guide.intro")}</p>
          <div>{tags.map((tag) => <span key={tag} style={S.tag}>{tag}</span>)}</div>
        </div>

        {/* ステップカード */}
        <div style={S.card}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>{t("guide.stepsTitle")}</div>
          {steps.map((step, i) => (
            <div key={i} style={S.step}>
              <div style={S.stepNum}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{step.title}</div>
                <p style={S.p}>{step.body}</p>
                {step.example && <code style={S.code}>{step.example}</code>}
              </div>
            </div>
          ))}
        </div>

        {/* データ形式カード */}
        <div style={S.card}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{t("guide.formatsTitle")}</div>
          <div style={S.h2}>{t("guide.csvTitle")}</div>
          <p style={S.p}>{t("guide.csvDesc")}</p>
          <code style={S.code}>{t("guide.csvExample")}</code>
          <div style={S.h2}>{t("guide.pasteTitle")}</div>
          <p style={S.p}>{t("guide.pasteDesc")}</p>
          <code style={S.code}>{t("guide.pasteExample")}</code>
          <div style={S.h2}>{t("guide.minDataTitle")}</div>
          <p style={S.p}>{t("guide.minDataDesc")}</p>
        </div>

        {/* FAQカード */}
        <div style={S.card}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>{t("guide.faqTitle")}</div>
          {faqs.map((faq, i) => (
            <div key={i}>
              <div style={S.faqQ}>Q. {faq.q}</div>
              <div style={S.faqA}>A. {faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}