import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
};

const cases = [
  {
    icon: "🍜", industry: "飲食店",
    title: "飲食店での活用例",
    description: "日次の売上データをSalesCastに入力することで、来週・来月の売上を予測できます。食材の仕入れ量の最適化や、アルバイトのシフト計画に活用できます。",
    benefits: ["曜日・季節ごとの売上パターンを自動で学習", "年末年始・お盆などの繁忙期を事前に把握", "食材ロスを減らして原価率を改善", "アルバイトのシフトを需要に合わせて最適化"],
    dataExample: "レジの日次売上データ（POSレジのCSV出力をそのまま利用可能）",
  },
  {
    icon: "🛒", industry: "ECサイト",
    title: "ECサイトでの活用例",
    description: "受注数・売上の時系列データを分析することで、在庫切れや過剰在庫を防ぎます。セール後の需要変動も考慮した予測が可能です。",
    benefits: ["需要予測に基づいた適切な在庫量の確保", "セール・キャンペーン前後の需要変動を把握", "商品カテゴリ別の予測で細かい在庫管理が可能", "物流・倉庫コストの最適化"],
    dataExample: "Shopify・BASE・楽天などの売上CSVをそのまま利用可能",
  },
  {
    icon: "🏪", industry: "小売店",
    title: "小売店・スーパーでの活用例",
    description: "商品カテゴリ別・店舗別の売上データを分析し、発注計画の精度を高めます。天候や季節による需要変動も学習します。",
    benefits: ["商品カテゴリ別の需要予測で発注精度を向上", "季節商品の仕入れタイミングを最適化", "欠品による機会損失を削減", "余剰在庫の廃棄コストを削減"],
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
        <div style={{ fontSize: 12, color: "#9ca3af", marginLeft: 4 }}>売上・需要予測AI</div>
        <button style={S.backBtn} onClick={() => navigate("/")}>← トップに戻る</button>
      </div>

      <div style={S.main}>
        <div style={S.card}>
          <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.3px" }}>業種別 活用事例</div>
          <p style={S.p}>SalesCastは飲食店・ECサイト・小売店など、売上データを持つあらゆる業種で活用できます。専門知識不要ですぐに使えます。</p>
        </div>

        {cases.map((c) => (
          <div key={c.industry} style={S.card}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
            <span style={S.tag}>{c.industry}</span>
            <div style={{ fontSize: 17, fontWeight: 600, marginTop: 12, marginBottom: 10 }}>{c.title}</div>
            <p style={S.p}>{c.description}</p>
            <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", margin: "16px 0 10px" }}>活用メリット</div>
            {c.benefits.map((b, i) => (
              <div key={i} style={S.benefit}>
                <span style={{ color: "#2563eb", flexShrink: 0 }}>✓</span><span>{b}</span>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: "10px 14px", background: "#f9fafb", border: "0.5px solid #e5e7eb", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>使用するデータ例</div>
              <div style={{ fontSize: 13, color: "#374151" }}>📄 {c.dataExample}</div>
            </div>
          </div>
        ))}

        <div style={{ ...S.card, textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>さっそく試してみる</div>
          <p style={S.p}>無料・登録不要。CSVをアップロードするだけで予測が始まります。</p>
          <button style={S.ctaBtn} onClick={() => navigate("/")}>無料で予測を始める →</button>
        </div>
      </div>
    </div>
  );
}
