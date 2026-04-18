// HowToGuide.jsx
// トップページ上部に差し込む静的コンポーネント（AdSense審査対策）
// 使い方：<HowToGuide /> を App.jsx のCSVアップロードUIの直前に追加

import { useTranslation } from "react-i18next";

const STEPS = [
  {
    key: "step1",
    icon: "📂",
    en: { title: "Upload CSV", desc: "Prepare a CSV with a date column and a sales/value column. Upload it with the button below." },
    ja: { title: "CSVをアップロード", desc: "日付列と売上（数値）列を含むCSVを用意して、下のボタンからアップロード。" },
  },
  {
    key: "step2",
    icon: "⚙️",
    en: { title: "Configure Forecast", desc: "Select the date column, value column, and how many days ahead to forecast." },
    ja: { title: "予測設定を選ぶ", desc: "日付列・数値列を選択し、何日先まで予測するか指定。" },
  },
  {
    key: "step3",
    icon: "📈",
    en: { title: "Get Your Forecast", desc: "View the interactive chart and download the results as CSV." },
    ja: { title: "予測結果を確認", desc: "グラフで予測を確認し、CSVでダウンロードも可能。" },
  },
];

const USE_CASES = [
  {
    icon: "🛒",
    en: { title: "Retail Sales", desc: "Forecast weekly product sales to optimize inventory and reduce overstock." },
    ja: { title: "小売・販売管理", desc: "週次の商品別売上を予測し、在庫の過不足を削減。" },
  },
  {
    icon: "🌐",
    en: { title: "Web Traffic", desc: "Predict page views or sessions to plan content publishing schedules." },
    ja: { title: "Webトラフィック", desc: "PV数・セッションを予測してコンテンツ配信スケジュールを最適化。" },
  },
  {
    icon: "📦",
    en: { title: "Demand Planning", desc: "Estimate future demand to align production or procurement plans." },
    ja: { title: "需要予測", desc: "製造・仕入れ計画を立てるための将来需要を推計。" },
  },
  {
    icon: "💰",
    en: { title: "Revenue Forecasting", desc: "Project monthly revenue trends to support business planning and reporting." },
    ja: { title: "売上予測", desc: "月次売上のトレンドを可視化し、経営計画・報告資料に活用。" },
  },
];

export default function HowToGuide() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("ja") ? "ja" : "en";

  return (
    <section style={styles.wrapper}>
      {/* ── How to Use ── */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          {lang === "ja" ? "使い方（3ステップ）" : "How to Use (3 Steps)"}
        </h2>
        <div style={styles.stepsRow}>
          {STEPS.map((step, i) => (
            <div key={step.key} style={styles.stepCard}>
              <div style={styles.stepNum}>{i + 1}</div>
              <div style={styles.stepIcon}>{step.icon}</div>
              <div style={styles.stepTitle}>{step[lang].title}</div>
              <div style={styles.stepDesc}>{step[lang].desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Use Cases ── */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          {lang === "ja" ? "活用例" : "Use Cases"}
        </h2>
        <div style={styles.casesGrid}>
          {USE_CASES.map((uc, i) => (
            <div key={i} style={styles.caseCard}>
              <span style={styles.caseIcon}>{uc.icon}</span>
              <div>
                <div style={styles.caseTitle}>{uc[lang].title}</div>
                <div style={styles.caseDesc}>{uc[lang].desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CSV format hint ── */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          {lang === "ja" ? "CSVフォーマット例" : "CSV Format Example"}
        </h2>
        <pre style={styles.codeBlock}>
{`date,sales
2024-01-01,1200
2024-01-02,980
2024-01-03,1450
...`}
        </pre>
        <p style={styles.hint}>
          {lang === "ja"
            ? "日付列の形式は YYYY-MM-DD を推奨。数値列は整数・小数どちらも対応。"
            : "Date column should be YYYY-MM-DD format. Numeric column supports both integers and decimals."}
        </p>
      </div>
    </section>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    maxWidth: 860,
    margin: "0 auto 2rem",
    fontFamily: "inherit",
  },
  section: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.05rem",
    fontWeight: 700,
    marginBottom: "0.85rem",
    borderLeft: "3px solid #4f7ef7",
    paddingLeft: "0.6rem",
    color: "inherit",
  },
  stepsRow: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  stepCard: {
    flex: "1 1 180px",
    background: "rgba(79,126,247,0.07)",
    border: "1px solid rgba(79,126,247,0.2)",
    borderRadius: 10,
    padding: "1rem 0.85rem",
    position: "relative",
  },
  stepNum: {
    position: "absolute",
    top: 8,
    right: 10,
    fontSize: "0.7rem",
    fontWeight: 800,
    color: "#4f7ef7",
    opacity: 0.5,
  },
  stepIcon: {
    fontSize: "1.5rem",
    marginBottom: 6,
  },
  stepTitle: {
    fontWeight: 700,
    fontSize: "0.88rem",
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: "0.78rem",
    lineHeight: 1.5,
    opacity: 0.75,
  },
  casesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "0.65rem",
  },
  caseCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.6rem",
    background: "rgba(0,0,0,0.03)",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 8,
    padding: "0.7rem 0.8rem",
  },
  caseIcon: {
    fontSize: "1.3rem",
    lineHeight: 1,
    marginTop: 2,
    flexShrink: 0,
  },
  caseTitle: {
    fontWeight: 700,
    fontSize: "0.82rem",
    marginBottom: 2,
  },
  caseDesc: {
    fontSize: "0.76rem",
    lineHeight: 1.5,
    opacity: 0.72,
  },
  codeBlock: {
    background: "rgba(0,0,0,0.05)",
    border: "1px solid rgba(0,0,0,0.1)",
    borderRadius: 6,
    padding: "0.75rem 1rem",
    fontSize: "0.8rem",
    fontFamily: "monospace",
    lineHeight: 1.6,
    overflowX: "auto",
    margin: 0,
  },
  hint: {
    marginTop: "0.5rem",
    fontSize: "0.78rem",
    opacity: 0.65,
  },
};
