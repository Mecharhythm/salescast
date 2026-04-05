import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const S = {
  app: {
    minHeight: "100vh", background: "#080b12", color: "#e8eaf0",
    fontFamily: "'DM Sans','Noto Sans JP',sans-serif", padding: "0 0 80px",
  },
  header: {
    borderBottom: "1px solid #1a1d2a", padding: "24px 40px",
    display: "flex", alignItems: "center", gap: 12,
  },
  logo: {
    fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px",
    background: "linear-gradient(135deg,#4f8ef7,#a78bfa)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    cursor: "pointer",
  },
  main: { maxWidth: 800, margin: "0 auto", padding: "40px 24px" },
  card: {
    background: "#0f1117", border: "1px solid #1e2130",
    borderRadius: 16, padding: "40px 48px", marginBottom: 24,
  },
  h1: { fontSize: 28, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.5px" },
  h2: { fontSize: 20, fontWeight: 700, marginBottom: 16, color: "#e8eaf0" },
  p: { fontSize: 14, lineHeight: 1.9, color: "#9ca3af", marginBottom: 12 },
  icon: { fontSize: 36, marginBottom: 16 },
  tag: {
    display: "inline-block", background: "rgba(167,139,250,0.1)",
    border: "1px solid rgba(167,139,250,0.3)", borderRadius: 6,
    padding: "2px 10px", fontSize: 12, color: "#a78bfa", marginRight: 8, marginBottom: 8,
  },
  benefit: {
    background: "#080b12", border: "1px solid #1e2130", borderRadius: 10,
    padding: "14px 18px", marginBottom: 10, fontSize: 14, color: "#9ca3af",
    display: "flex", gap: 10, alignItems: "flex-start",
  },
  backBtn: {
    background: "none", border: "1px solid #2a2d3a", color: "#9ca3af",
    borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer",
    marginLeft: "auto",
  },
  ctaBtn: {
    display: "block", width: "100%", padding: "16px",
    background: "linear-gradient(135deg,#4f8ef7,#a78bfa)",
    color: "#fff", border: "none", borderRadius: 10,
    fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 24,
  },
};

const cases = [
  {
    icon: "🍜",
    industry: "飲食店",
    title: "飲食店での活用例",
    description: "日次の売上データをSalesCastに入力することで、来週・来月の売上を予測できます。食材の仕入れ量の最適化や、アルバイトのシフト計画に活用できます。",
    benefits: [
      "曜日・季節ごとの売上パターンを自動で学習",
      "年末年始・お盆などの繁忙期を事前に把握",
      "食材ロスを減らして原価率を改善",
      "アルバイトのシフトを需要に合わせて最適化",
    ],
    dataExample: "レジの日次売上データ（POSレジのCSV出力をそのまま利用可能）",
  },
  {
    icon: "🛒",
    industry: "ECサイト",
    title: "ECサイトでの活用例",
    description: "受注数・売上の時系列データを分析することで、在庫切れや過剰在庫を防ぎます。セール後の需要変動も考慮した予測が可能です。",
    benefits: [
      "需要予測に基づいた適切な在庫量の確保",
      "セール・キャンペーン前後の需要変動を把握",
      "商品カテゴリ別の予測で細かい在庫管理が可能",
      "物流・倉庫コストの最適化",
    ],
    dataExample: "Shopify・BASE・楽天などの売上CSVをそのまま利用可能",
  },
  {
    icon: "🏪",
    industry: "小売店",
    title: "小売店・スーパーでの活用例",
    description: "商品カテゴリ別・店舗別の売上データを分析し、発注計画の精度を高めます。天候や季節による需要変動も学習します。",
    benefits: [
      "商品カテゴリ別の需要予測で発注精度を向上",
      "季節商品の仕入れタイミングを最適化",
      "欠品による機会損失を削減",
      "余剰在庫の廃棄コストを削減",
    ],
    dataExample: "POSシステムの日次売上データ（商品別・カテゴリ別）",
  },
];

export default function UseCases() {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={S.app}>
      <div style={S.header}>
        <div style={S.logo} onClick={() => navigate("/")}>SalesCast</div>
        <div style={{ fontSize: 13, color: "#4b5563", marginLeft: 4 }}>売上・需要予測AI</div>
        <button style={S.backBtn} onClick={() => navigate("/")}>← トップに戻る</button>
      </div>

      <div style={S.main}>

        {/* タイトル */}
        <div style={S.card}>
          <div style={S.h1}>業種別 活用事例</div>
          <p style={{ ...S.p, marginBottom: 0 }}>
            SalesCastは飲食店・ECサイト・小売店など、売上データを持つあらゆる業種で活用できます。
            専門知識不要で、すぐに予測を始められます。
          </p>
        </div>

        {/* 業種別カード */}
        {cases.map((c) => (
          <div key={c.industry} style={S.card}>
            <div style={S.icon}>{c.icon}</div>
            <span style={S.tag}>{c.industry}</span>
            <div style={{ ...S.h2, marginTop: 12 }}>{c.title}</div>
            <p style={S.p}>{c.description}</p>

            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12, marginTop: 20, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              活用メリット
            </div>
            {c.benefits.map((b, i) => (
              <div key={i} style={S.benefit}>
                <span style={{ color: "#4f8ef7", flexShrink: 0 }}>✓</span>
                <span>{b}</span>
              </div>
            ))}

            <div style={{ marginTop: 20, padding: "12px 16px", background: "#080b12", border: "1px solid #1e2130", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>使用するデータ例</div>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>📄 {c.dataExample}</div>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div style={{ ...S.card, textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>さっそく試してみる</div>
          <p style={S.p}>無料・登録不要。CSVをアップロードするだけで予測が始まります。</p>
          <button style={S.ctaBtn} onClick={() => navigate("/")}>
            無料で予測を始める →
          </button>
        </div>

      </div>
    </div>
  );
}
