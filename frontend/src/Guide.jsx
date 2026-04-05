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
  h2: { fontSize: 18, fontWeight: 700, marginTop: 40, marginBottom: 12, color: "#4f8ef7" },
  p: { fontSize: 14, lineHeight: 1.9, color: "#9ca3af", marginBottom: 12 },
  step: {
    display: "flex", gap: 20, marginBottom: 32, alignItems: "flex-start",
  },
  stepNum: {
    minWidth: 36, height: 36, borderRadius: "50%",
    background: "linear-gradient(135deg,#4f8ef7,#a78bfa)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 16, flexShrink: 0,
  },
  stepBody: { flex: 1 },
  stepTitle: { fontSize: 16, fontWeight: 700, marginBottom: 8 },
  code: {
    background: "#080b12", border: "1px solid #1e2130", borderRadius: 8,
    padding: "12px 16px", fontSize: 13, fontFamily: "monospace",
    color: "#4f8ef7", marginTop: 8, display: "block",
  },
  tag: {
    display: "inline-block", background: "rgba(79,142,247,0.1)",
    border: "1px solid rgba(79,142,247,0.3)", borderRadius: 6,
    padding: "2px 10px", fontSize: 12, color: "#4f8ef7", marginRight: 8, marginBottom: 8,
  },
  backBtn: {
    background: "none", border: "1px solid #2a2d3a", color: "#9ca3af",
    borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer",
    marginLeft: "auto",
  },
  faqQ: { fontSize: 15, fontWeight: 700, marginBottom: 8, color: "#e8eaf0" },
  faqA: { fontSize: 14, lineHeight: 1.9, color: "#9ca3af", marginBottom: 24 },
};

export default function Guide() {
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
          <div style={S.h1}>SalesCast 使い方ガイド</div>
          <p style={{ ...S.p, marginBottom: 20 }}>
            SalesCastは、売上データをアップロードするだけでAIが将来の売上・需要を予測するサービスです。
            専門的な知識は不要で、CSVファイルまたはExcelからのコピペで簡単に使えます。
          </p>
          <div>
            {["無料", "登録不要", "CSV対応", "Excel対応", "日本語UI"].map((t) => (
              <span key={t} style={S.tag}>{t}</span>
            ))}
          </div>
        </div>

        {/* ステップガイド */}
        <div style={S.card}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 32 }}>📋 手順</div>

          {[
            {
              title: "データを用意する",
              body: "日付と売上金額が入ったデータを用意します。ExcelやGoogleスプレッドシートで管理しているデータをそのままコピーできます。",
              extra: (
                <code style={S.code}>
                  {"例：\n2024-01-01\t500000\n2024-01-02\t480000\n2024-01-03\t510000"}
                </code>
              )
            },
            {
              title: "データを入力する",
              body: "「CSVアップロード」または「コピペ入力」タブを選択します。Excelからそのままコピー＆ペーストする場合は「コピペ入力」が便利です。",
            },
            {
              title: "予測期間を設定する",
              body: "スライダーで予測したい日数を選択します。7日〜180日の範囲で設定できます。",
            },
            {
              title: "予測を実行する",
              body: "「予測を実行」ボタンを押します。数秒でAIが分析を完了し、グラフと予測テーブルが表示されます。",
            },
            {
              title: "結果を確認する",
              body: "グラフで実績と予測の推移を確認できます。予測テーブルでは日別の予測値と95%信頼区間（上限・下限）を確認できます。",
            },
          ].map((step, i) => (
            <div key={i} style={S.step}>
              <div style={S.stepNum}>{i + 1}</div>
              <div style={S.stepBody}>
                <div style={S.stepTitle}>{step.title}</div>
                <p style={S.p}>{step.body}</p>
                {step.extra}
              </div>
            </div>
          ))}
        </div>

        {/* 対応フォーマット */}
        <div style={S.card}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>📁 対応データ形式</div>
          <div style={S.h2}>CSVファイル</div>
          <p style={S.p}>UTF-8・Shift-JIS両方に対応しています。列名は自動で検出されるため、どんな列名でも構いません。</p>
          <code style={S.code}>{"日付,売上\n2024-01-01,500000\n2024-01-02,480000"}</code>

          <div style={S.h2}>コピペ入力（タブ区切り）</div>
          <p style={S.p}>ExcelやGoogleスプレッドシートからそのままコピー＆ペーストできます。ヘッダー行がなくても自動で認識されます。</p>
          <code style={S.code}>{"2024-01-01\t500000\n2024-01-02\t480000"}</code>

          <div style={S.h2}>必要なデータ量</div>
          <p style={S.p}>最低10行以上のデータが必要です。精度を高めるためには90日以上のデータを推奨します。</p>
        </div>

        {/* FAQ */}
        <div style={S.card}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 28 }}>❓ よくある質問</div>

          {[
            { q: "データはサーバーに保存されますか？", a: "原則として保存されません。予測処理完了後、アップロードされたデータは即座に破棄されます。「予測精度の向上に協力する」にチェックを入れた場合のみ、匿名化した上で保存されます。" },
            { q: "どのくらいの期間のデータがあれば使えますか？", a: "最低10行（10日分）から利用可能ですが、週次・月次のパターンを学習するには90日以上のデータを推奨します。データが多いほど予測精度が上がります。" },
            { q: "予測の精度はどのくらいですか？", a: "データの規則性によって異なります。季節性や曜日パターンが明確なデータほど精度が高くなります。予測結果は95%信頼区間（上限・下限）とともに表示されるため、不確実性も確認できます。" },
            { q: "売上以外のデータも予測できますか？", a: "はい。来客数・注文数・アクセス数など、日付と数値の組み合わせであれば何でも予測できます。" },
            { q: "無料で使えますか？", a: "はい、現在は完全無料でご利用いただけます。" },
          ].map((faq, i) => (
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
