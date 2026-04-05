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
  h1: { fontSize: 28, fontWeight: 700, marginBottom: 32, letterSpacing: "-0.5px" },
  h2: { fontSize: 18, fontWeight: 700, marginTop: 40, marginBottom: 12, color: "#4f8ef7" },
  p: { fontSize: 14, lineHeight: 1.9, color: "#9ca3af", marginBottom: 12 },
  li: { fontSize: 14, lineHeight: 1.9, color: "#9ca3af", marginBottom: 6, paddingLeft: 8 },
  divider: { borderColor: "#1e2130", margin: "40px 0" },
  date: { fontSize: 13, color: "#4b5563", marginBottom: 32 },
  backBtn: {
    background: "none", border: "1px solid #2a2d3a", color: "#9ca3af",
    borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer",
    marginLeft: "auto",
  },
};

const today = "2026年4月5日";
const serviceName = "SalesCast";
const serviceUrl = "https://salescast.vercel.app";

export default function Privacy() {
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
        <div style={S.card}>
          <div style={S.h1}>プライバシーポリシー・利用規約</div>
          <div style={S.date}>制定日：{today}</div>

          {/* ===== プライバシーポリシー ===== */}
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>プライバシーポリシー</div>

          <div style={S.h2}>第1条　事業者情報</div>
          <p style={S.p}>本サービス「{serviceName}」（以下「当サービス」）は、個人が運営する売上・需要予測AIサービスです。</p>
          <p style={S.p}>サービスURL：{serviceUrl}</p>

          <div style={S.h2}>第2条　収集する情報</div>
          <p style={S.p}>当サービスは、以下の情報を収集する場合があります。</p>
          <ul>
            <li style={S.li}>アップロードされたCSVファイルの内容（日付・数値データ）</li>
            <li style={S.li}>アクセスログ（IPアドレス、ブラウザ情報、アクセス日時）</li>
            <li style={S.li}>広告配信のためにGoogle AdSenseが収集するCookie情報</li>
          </ul>

          <div style={S.h2}>第3条　CSVデータの取り扱い</div>
          <p style={S.p}>アップロードされたCSVデータについては、以下のとおり取り扱います。</p>
          <p style={{ ...S.p, fontWeight: 600, color: "#e8eaf0" }}>【原則】</p>
          <ul>
            <li style={S.li}>予測処理はサーバー上でリアルタイムに実行され、原則としてデータはサーバーに保存されません。</li>
            <li style={S.li}>予測完了後、アップロードされたデータは即座に破棄されます。</li>
          </ul>
          <p style={{ ...S.p, fontWeight: 600, color: "#e8eaf0", marginTop: 16 }}>【ユーザーの任意同意による提供（オプトイン）】</p>
          <p style={S.p}>ユーザーが「予測精度の向上に協力する」にチェックを入れた場合のみ、以下の匿名化処理を施した上でデータを保存します。</p>
          <ul>
            <li style={S.li}>日付データ：ランダムな日数（±180日）をずらして実際の時期を特定不能にします</li>
            <li style={S.li}>売上データ：0〜1の範囲に正規化し、絶対的な売上規模を特定不能にします</li>
            <li style={S.li}>保存ファイルはランダムなIDで管理され、ユーザーと紐付ける情報は一切記録しません</li>
            <li style={S.li}>匿名化されたデータは予測モデルの改善目的のみに使用し、第三者への提供・販売は行いません</li>
          </ul>

          <div style={S.h2}>第4条　広告について</div>
          <p style={S.p}>当サービスはGoogle AdSenseを利用して広告を配信しています。</p>
          <ul>
            <li style={S.li}>Googleはユーザーのサイト訪問情報に基づいて広告を配信します</li>
            <li style={S.li}>Cookieを無効にすることでパーソナライズ広告を停止できます</li>
            <li style={S.li}>詳細はGoogleのプライバシーポリシー（https://policies.google.com/privacy）をご参照ください</li>
          </ul>

          <div style={S.h2}>第5条　アクセス解析</div>
          <p style={S.p}>当サービスはサービス改善のためアクセス解析ツールを使用する場合があります。収集されるデータは匿名であり、個人を特定するものではありません。</p>

          <div style={S.h2}>第6条　第三者への情報提供</div>
          <p style={S.p}>当サービスは、以下の場合を除き、収集した情報を第三者に提供しません。</p>
          <ul>
            <li style={S.li}>法令に基づく場合</li>
            <li style={S.li}>人の生命・身体・財産の保護のために必要な場合</li>
            <li style={S.li}>ユーザーの同意がある場合</li>
          </ul>

          <div style={S.h2}>第7条　プライバシーポリシーの変更</div>
          <p style={S.p}>当サービスは、本ポリシーを予告なく変更する場合があります。変更後はサービス上に掲示することで通知します。</p>

          <hr style={S.divider} />

          {/* ===== 利用規約 ===== */}
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>利用規約</div>

          <div style={S.h2}>第1条　サービスの目的</div>
          <p style={S.p}>本利用規約は、「{serviceName}」の利用に関する条件を定めるものです。ユーザーは本規約に同意した上でサービスをご利用ください。</p>

          <div style={S.h2}>第2条　禁止事項</div>
          <p style={S.p}>ユーザーは以下の行為を行ってはなりません。</p>
          <ul>
            <li style={S.li}>法令または公序良俗に違反する行為</li>
            <li style={S.li}>当サービスのシステムへの不正アクセス・クラッキング行為</li>
            <li style={S.li}>他のユーザーや第三者の権利を侵害する行為</li>
            <li style={S.li}>当サービスの運営を妨害する行為</li>
            <li style={S.li}>営業目的での大量リクエスト送信</li>
          </ul>

          <div style={S.h2}>第3条　免責事項</div>
          <p style={S.p}>当サービスの予測結果はAIモデルによる統計的推定であり、実際の売上・需要を保証するものではありません。</p>
          <p style={S.p}>予測結果に基づく経営判断・意思決定によって生じた損害について、当サービスは一切の責任を負いません。</p>

          <div style={S.h2}>第4条　知的財産権</div>
          <p style={S.p}>当サービスのシステム・デザイン・コンテンツに関する知的財産権は、運営者に帰属します。</p>

          <div style={S.h2}>第5条　サービスの変更・停止</div>
          <p style={S.p}>運営者は、ユーザーへの事前通知なく、サービスの内容変更・一時停止・終了を行う場合があります。</p>

          <div style={S.h2}>第6条　準拠法・裁判管轄</div>
          <p style={S.p}>本規約は日本法に準拠し、紛争が生じた場合は運営者の所在地を管轄する裁判所を専属的合意管轄とします。</p>

          <p style={{ ...S.p, textAlign: "right", marginTop: 40 }}>{today}　制定</p>
        </div>
      </div>
    </div>
  );
}
