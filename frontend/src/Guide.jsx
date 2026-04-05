import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
};

export default function Guide() {
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
          <div style={S.h1}>SalesCast 使い方ガイド</div>
          <p style={{ ...S.p, marginBottom: 16 }}>売上データをアップロードするだけでAIが将来の売上・需要を予測するサービスです。専門的な知識は不要です。</p>
          <div>{["無料", "登録不要", "CSV対応", "Excel対応", "日本語UI"].map((t) => <span key={t} style={S.tag}>{t}</span>)}</div>
        </div>

        <div style={S.card}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>手順</div>
          {[
            { title: "データを用意する", body: "日付と売上金額が入ったデータを用意します。ExcelやGoogleスプレッドシートのデータをそのままコピーできます。", extra: <code style={S.code}>{"例：\n2024-01-01\t500000\n2024-01-02\t480000"}</code> },
            { title: "データを入力する", body: "「CSVアップロード」または「コピペ入力」タブを選択します。ExcelからコピペするならコピペタブがOKです。" },
            { title: "予測期間を設定する", body: "スライダーで予測したい日数を選択します。7日〜180日の範囲で設定できます。" },
            { title: "予測を実行する", body: "「予測を実行」ボタンを押します。数秒でグラフと予測テーブルが表示されます。" },
            { title: "結果を確認する", body: "グラフで実績と予測の推移を確認できます。予測テーブルでは日別の予測値と95%信頼区間を確認できます。" },
          ].map((step, i) => (
            <div key={i} style={S.step}>
              <div style={S.stepNum}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{step.title}</div>
                <p style={S.p}>{step.body}</p>
                {step.extra}
              </div>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>対応データ形式</div>
          <div style={S.h2}>CSVファイル</div>
          <p style={S.p}>UTF-8・Shift-JIS両方に対応しています。列名は自動で検出されます。</p>
          <code style={S.code}>{"日付,売上\n2024-01-01,500000\n2024-01-02,480000"}</code>
          <div style={S.h2}>コピペ入力（タブ区切り）</div>
          <p style={S.p}>ExcelやGoogleスプレッドシートからそのままコピペできます。</p>
          <code style={S.code}>{"2024-01-01\t500000\n2024-01-02\t480000"}</code>
          <div style={S.h2}>必要なデータ量</div>
          <p style={S.p}>最低10行以上必要です。精度を高めるには90日以上を推奨します。</p>
        </div>

        <div style={S.card}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>よくある質問</div>
          {[
            { q: "データはサーバーに保存されますか？", a: "原則として保存されません。予測完了後、データは即座に破棄されます。「精度向上に協力する」にチェックを入れた場合のみ、匿名化して保存されます。" },
            { q: "どのくらいのデータがあれば使えますか？", a: "最低10行から利用可能ですが、90日以上のデータを推奨します。データが多いほど精度が上がります。" },
            { q: "予測の精度はどのくらいですか？", a: "データの規則性によって異なります。季節性や曜日パターンが明確なデータほど精度が高くなります。" },
            { q: "売上以外のデータも予測できますか？", a: "はい。来客数・注文数・アクセス数など、日付と数値の組み合わせであれば予測できます。" },
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
