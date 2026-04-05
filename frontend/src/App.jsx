import { useState, useRef, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from "recharts";

const API_BASE = "https://salescast-api.onrender.com";

function generateSampleCSV() {
  const rows = ["date,sales"];
  const base = 500000;
  let d = new Date("2023-01-01");
  for (let i = 0; i < 180; i++) {
    const trend = i * 800;
    const weekly = Math.sin((i % 7) * Math.PI / 3.5) * 30000;
    const noise = (Math.random() - 0.5) * 40000;
    rows.push(`${d.toISOString().slice(0, 10)},${Math.round(base + trend + weekly + noise)}`);
    d.setDate(d.getDate() + 1);
  }
  return rows.join("\n");
}

// タブ区切り（Excel）またはカンマ区切りを正規化してFileに変換
function pasteTextToFile(text) {
  const normalized = text
    .trim()
    .split("\n")
    .map((line) => line.trim().replace(/\t+/g, ","))
    .join("\n");
  const firstLine = normalized.split("\n")[0];
  const hasHeader = /[a-zA-Zぁ-ん一-龯]/.test(firstLine.replace(/,/g, ""));
  const csv = hasHeader ? normalized : "date,sales\n" + normalized;
  return new File([csv], "pasted_data.csv", { type: "text/csv" });
}

const fmt = (n) => n == null ? "—" : "¥" + Math.round(n).toLocaleString();

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0f1117", border: "1px solid #2a2d3a",
      borderRadius: 8, padding: "10px 14px", fontSize: 13
    }}>
      <div style={{ color: "#888", marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}：{fmt(p.value)}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("csv");
  const [file, setFile] = useState(null);
  const [pasteText, setPasteText] = useState("");
  const [pasteError, setPasteError] = useState(null);
  const [periods, setPeriods] = useState(30);
  const [contribute, setContribute] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setResult(null);
    setError(null);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const downloadSample = () => {
    const blob = new Blob([generateSampleCSV()], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sample_sales.csv";
    a.click();
  };

  const applyPaste = () => {
    setPasteError(null);
    if (!pasteText.trim()) { setPasteError("データを貼り付けてください"); return; }
    const lines = pasteText.trim().split("\n").filter((l) => l.trim());
    if (lines.length < 5) { setPasteError("最低5行以上のデータが必要です"); return; }
    try {
      setFile(pasteTextToFile(pasteText));
      setResult(null);
      setError(null);
    } catch {
      setPasteError("データの解析に失敗しました。形式を確認してください。");
    }
  };

  const predict = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("contribute", contribute ? "true" : "false");
      const res = await fetch(`${API_BASE}/predict?periods=${periods}`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "予測に失敗しました");
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const chartData = (() => {
    if (!result) return [];
    const actualMap = Object.fromEntries(result.actual.map((r) => [r.date, r.value]));
    return result.full_forecast.map((r) => ({
      date: r.date,
      実績: actualMap[r.date] ?? null,
      予測: r.yhat,
      予測下限: r.yhat_lower,
      予測上限: r.yhat_upper,
    }));
  })();

  const S = {
    app: { minHeight: "100vh", background: "#080b12", color: "#e8eaf0", fontFamily: "'DM Sans','Noto Sans JP',sans-serif", padding: "0 0 80px" },
    header: { borderBottom: "1px solid #1a1d2a", padding: "24px 40px", display: "flex", alignItems: "center", gap: 12 },
    logo: { fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px", background: "linear-gradient(135deg,#4f8ef7,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    main: { maxWidth: 900, margin: "0 auto", padding: "40px 24px" },
    card: { background: "#0f1117", border: "1px solid #1e2130", borderRadius: 16, padding: "28px 32px", marginBottom: 24 },
    label: { fontSize: 12, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 },
    btn: (disabled) => ({
      width: "100%", padding: "14px", borderRadius: 10,
      background: disabled ? "#1e2130" : "linear-gradient(135deg,#4f8ef7,#a78bfa)",
      color: disabled ? "#4b5563" : "#fff", border: "none",
      cursor: disabled ? "not-allowed" : "pointer", fontSize: 15, fontWeight: 600,
    }),
    tab: (active) => ({
      padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
      fontSize: 14, fontWeight: 500, transition: "all 0.15s",
      background: active ? "#1e2130" : "transparent",
      color: active ? "#e8eaf0" : "#6b7280",
    }),
    drop: (active) => ({
      border: `2px dashed ${active ? "#4f8ef7" : "#2a2d3a"}`, borderRadius: 12,
      padding: "40px 24px", textAlign: "center", cursor: "pointer",
      background: active ? "rgba(79,142,247,0.05)" : "transparent",
    }),
    metric: { background: "#080b12", border: "1px solid #1e2130", borderRadius: 12, padding: "20px 24px", flex: 1 },
  };

  const pasteLineCount = pasteText.trim().split("\n").filter((l) => l.trim()).length;

  return (
    <div style={S.app}>
      <div style={S.header}>
        <div style={S.logo}>SalesCast</div>
        <div style={{ fontSize: 13, color: "#4b5563", marginLeft: 4 }}>売上・需要予測AI</div>
      </div>

      <div style={S.main}>
        <div style={S.card}>

          {/* タブ切り替え */}
          <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#080b12", borderRadius: 10, padding: 4, width: "fit-content" }}>
            <button style={S.tab(tab === "csv")} onClick={() => { setTab("csv"); setFile(null); setResult(null); setError(null); }}>
              📂 CSVアップロード
            </button>
            <button style={S.tab(tab === "paste")} onClick={() => { setTab("paste"); setFile(null); setResult(null); setError(null); }}>
              📋 コピペ入力
            </button>
          </div>

          {/* CSVタブ */}
          {tab === "csv" && (
            <>
              <div style={S.label}>CSVファイル</div>
              <div style={S.drop(dragging)}
                onClick={() => inputRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
              >
                <input ref={inputRef} type="file" accept=".csv" style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files[0])} />
                {file ? (
                  <div>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
                    <div style={{ fontWeight: 600 }}>{file.name}</div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>☁️</div>
                    <div style={{ fontWeight: 500 }}>CSVをドロップ、またはクリックして選択</div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>日付列・売上列を含むCSV（UTF-8 / Shift-JIS対応）</div>
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right", marginTop: 10 }}>
                <button onClick={downloadSample} style={{ background: "none", border: "none", color: "#4f8ef7", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
                  サンプルCSVをダウンロード
                </button>
              </div>
            </>
          )}

          {/* コピペタブ */}
          {tab === "paste" && (
            <>
              <div style={S.label}>データをここに貼り付け</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
                ExcelやスプレッドシートからCtrl+C → Ctrl+Vで貼り付けできます。タブ区切り・カンマ区切り両対応。
              </div>

              {/* フォーマット例 */}
              <div style={{ background: "#080b12", border: "1px solid #1e2130", borderRadius: 8, padding: "12px 16px", marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>対応フォーマット例</div>
                <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                  {[
                    { label: "タブ区切り（Excel）", ex: "2024-01-01\t500000\n2024-01-02\t480000" },
                    { label: "カンマ区切り", ex: "2024-01-01,500000\n2024-01-02,480000" },
                    { label: "ヘッダーあり", ex: "日付,売上\n2024-01-01,500000" },
                  ].map((f) => (
                    <div key={f.label}>
                      <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: 4 }}>{f.label}</div>
                      <pre style={{ color: "#4f8ef7", fontSize: 12, margin: 0 }}>{f.ex}</pre>
                    </div>
                  ))}
                </div>
              </div>

              <textarea
                value={pasteText}
                onChange={(e) => { setPasteText(e.target.value); setPasteError(null); setFile(null); }}
                placeholder={"2024-01-01\t500000\n2024-01-02\t480000\n2024-01-03\t510000\n..."}
                style={{
                  width: "100%", height: 200, background: "#080b12",
                  border: "1px solid #2a2d3a", borderRadius: 10, color: "#e8eaf0",
                  fontSize: 13, fontFamily: "monospace", padding: "12px 14px",
                  resize: "vertical", boxSizing: "border-box", outline: "none",
                }}
              />

              {pasteText.trim() && (
                <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}>{pasteLineCount} 行検出</div>
              )}
              {pasteError && (
                <div style={{ marginTop: 6, color: "#f87171", fontSize: 13 }}>⚠️ {pasteError}</div>
              )}

              <button onClick={applyPaste} disabled={!pasteText.trim()}
                style={{ ...S.btn(!pasteText.trim()), marginTop: 12 }}>
                データを確定する
              </button>

              {file && tab === "paste" && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(79,142,247,0.1)", border: "1px solid rgba(79,142,247,0.3)", borderRadius: 8, fontSize: 13, color: "#4f8ef7" }}>
                  ✅ {pasteLineCount} 行確定済み — 下の「予測を実行」で予測できます
                </div>
              )}
            </>
          )}

          {/* オプトイン：データ提供 */}
          <div style={{
            marginTop: 24, padding: "16px 20px",
            background: "#080b12", border: "1px solid #1e2130", borderRadius: 12,
          }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={contribute}
                onChange={(e) => setContribute(e.target.checked)}
                style={{ marginTop: 2, accentColor: "#4f8ef7", width: 16, height: 16, cursor: "pointer" }}
              />
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#e8eaf0", marginBottom: 4 }}>
                  予測精度の向上に協力する（任意）― <a href="/privacy" style={{ color: "#4f8ef7" }}>プライバシーポリシー</a>
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>
                  チェックを入れると、アップロードしたデータが<strong style={{ color: "#9ca3af" }}>匿名化</strong>された上でモデルの改善に利用されます。
                  日付のランダムシフトと売上の正規化により、元のデータを復元することはできません。
                  個人・企業を特定できる情報は一切保存されません。
                </div>
              </div>
            </label>
          </div>

          {/* 予測期間（共通） */}
          <div style={{ marginTop: 24 }}>
            <div style={S.label}>予測期間：{periods}日</div>
            <input type="range" min={7} max={180} value={periods}
              onChange={(e) => setPeriods(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#4f8ef7" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#4b5563", marginTop: 4 }}>
              <span>7日</span><span>180日</span>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <button style={S.btn(!file || loading)} onClick={predict} disabled={!file || loading}>
              {loading ? "予測中..." : "予測を実行"}
            </button>
          </div>

          {error && (
            <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, color: "#f87171", fontSize: 14 }}>
              ⚠️ {error}
            </div>
          )}

          {result?.contributed && (
            <div style={{ marginTop: 12, padding: "10px 16px", background: "rgba(79,142,247,0.08)", border: "1px solid rgba(79,142,247,0.2)", borderRadius: 8, fontSize: 13, color: "#6b9ff7" }}>
              🙏 データの提供ありがとうございます。匿名化して保存しました。
            </div>
          )}
        </div>

        {/* 結果 */}
        {result && (
          <>
            <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
              {[
                { label: "学習データ数", value: `${result.summary.data_points} 日分` },
                { label: "最終実績日", value: result.summary.last_actual },
                { label: `今後${periods}日の平均予測`, value: fmt(result.summary.next_30_avg) },
              ].map((m) => (
                <div key={m.label} style={S.metric}>
                  <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{m.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px" }}>{m.value}</div>
                </div>
              ))}
            </div>

            <div style={S.card}>
              <div style={S.label}>売上推移と予測</div>
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2130" />
                  <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} tickFormatter={(v) => v.slice(5)} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} tickFormatter={(v) => "¥" + (v / 10000).toFixed(0) + "万"} width={64} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 13, color: "#9ca3af" }} />
                  <ReferenceLine x={result.summary.last_actual} stroke="#4b5563" strokeDasharray="4 2" label={{ value: "予測開始", fill: "#6b7280", fontSize: 11 }} />
                  <Line dataKey="実績" stroke="#4f8ef7" dot={false} strokeWidth={2} connectNulls={false} />
                  <Line dataKey="予測" stroke="#a78bfa" dot={false} strokeWidth={2} strokeDasharray="5 3" connectNulls />
                  <Line dataKey="予測上限" stroke="#374151" dot={false} strokeWidth={1} />
                  <Line dataKey="予測下限" stroke="#374151" dot={false} strokeWidth={1} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={S.card}>
              <div style={S.label}>予測テーブル（直近30日）</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1e2130" }}>
                      {["日付", "予測売上", "下限（95%）", "上限（95%）"].map((h) => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#6b7280", fontWeight: 500, fontSize: 12 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.forecast.slice(0, 30).map((r) => (
                      <tr key={r.date} style={{ borderBottom: "1px solid #1a1d2a" }}>
                        <td style={{ padding: "8px 12px", color: "#9ca3af" }}>{r.date}</td>
                        <td style={{ padding: "8px 12px", fontWeight: 600 }}>{fmt(r.yhat)}</td>
                        <td style={{ padding: "8px 12px", color: "#6b7280" }}>{fmt(r.yhat_lower)}</td>
                        <td style={{ padding: "8px 12px", color: "#6b7280" }}>{fmt(r.yhat_upper)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}