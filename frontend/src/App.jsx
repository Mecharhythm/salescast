import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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

function pasteTextToFile(text) {
  const normalized = text.trim().split("\n")
    .map((line) => line.trim().replace(/\t+/g, ",")).join("\n");
  const firstLine = normalized.split("\n")[0];
  const hasHeader = /[a-zA-Zぁ-ん一-龯]/.test(firstLine.replace(/,/g, ""));
  const csv = hasHeader ? normalized : "date,sales\n" + normalized;
  return new File([csv], "pasted_data.csv", { type: "text/csv" });
}

const fmt = (n) => n == null ? "—" : "¥" + Math.round(n).toLocaleString();

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", fontSize: 13, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <div style={{ color: "#6b7280", marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>{p.name}：{fmt(p.value)}</div>
      ))}
    </div>
  );
}

const S = {
  app: { minHeight: "100vh", background: "#f8f9fb", color: "#111827", fontFamily: "'DM Sans','Noto Sans JP',sans-serif" },
  header: { background: "#fff", borderBottom: "0.5px solid #e5e7eb", padding: "14px 32px", display: "flex", alignItems: "center", gap: 10 },
  logo: { fontSize: 18, fontWeight: 600, letterSpacing: "-0.3px", background: "linear-gradient(135deg,#2563eb,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", cursor: "pointer" },
  navLink: { fontSize: 13, color: "#6b7280", textDecoration: "none", cursor: "pointer" },
  main: { maxWidth: 860, margin: "0 auto", padding: "32px 20px 80px" },
  card: { background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 14, padding: "24px 28px", marginBottom: 16 },
  label: { fontSize: 11, color: "#6b7280", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 },
  tab: (active) => ({
    padding: "7px 18px", borderRadius: 7, border: active ? "0.5px solid #e5e7eb" : "none",
    background: active ? "#fff" : "transparent", color: active ? "#111827" : "#6b7280",
    fontSize: 13, fontWeight: 500, cursor: "pointer",
  }),
  drop: (active) => ({
    border: `1.5px dashed ${active ? "#2563eb" : "#d1d5db"}`, borderRadius: 10,
    padding: "36px 20px", textAlign: "center", cursor: "pointer",
    background: active ? "#eff6ff" : "transparent", transition: "all 0.15s",
  }),
  btn: (disabled) => ({
    width: "100%", padding: "12px", borderRadius: 8,
    background: disabled ? "#f3f4f6" : "linear-gradient(135deg,#2563eb,#7c3aed)",
    color: disabled ? "#9ca3af" : "#fff", border: "none",
    cursor: disabled ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 500, marginTop: 16,
  }),
  metric: { background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 10, padding: "16px 20px", flex: 1 },
  optIn: { background: "#eff6ff", border: "0.5px solid #bfdbfe", borderRadius: 10, padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start", marginTop: 16 },
};

export default function App() {
  const navigate = useNavigate();
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

  const handleFile = (f) => { if (!f) return; setFile(f); setResult(null); setError(null); };
  const onDrop = useCallback((e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }, []);

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
    try { setFile(pasteTextToFile(pasteText)); setResult(null); setError(null); }
    catch { setPasteError("データの解析に失敗しました"); }
  };

  const predict = async () => {
    if (!file) return;
    setLoading(true); setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("contribute", contribute ? "true" : "false");
      const res = await fetch(`${API_BASE}/predict?periods=${periods}`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "予測に失敗しました");
      setResult(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const chartData = (() => {
    if (!result) return [];
    const actualMap = Object.fromEntries(result.actual.map((r) => [r.date, r.value]));
    return result.full_forecast.map((r) => ({ date: r.date, 実績: actualMap[r.date] ?? null, 予測: r.yhat, 予測下限: r.yhat_lower, 予測上限: r.yhat_upper }));
  })();

  const pasteLineCount = pasteText.trim().split("\n").filter((l) => l.trim()).length;

  return (
    <div style={S.app}>
      <div style={S.header}>
        <div style={S.logo} onClick={() => navigate("/")}>SalesCast</div>
        <div style={{ fontSize: 12, color: "#9ca3af", marginLeft: 4 }}>売上・需要予測AI</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 24 }}>
          <span style={S.navLink} onClick={() => navigate("/guide")}>使い方</span>
          <span style={S.navLink} onClick={() => navigate("/usecases")}>活用事例</span>
          <span style={S.navLink} onClick={() => navigate("/privacy")}>プライバシーポリシー</span>
        </div>
      </div>

      <div style={S.main}>
        <div style={S.card}>
          {/* タブ */}
          <div style={{ display: "flex", gap: 4, background: "#f3f4f6", borderRadius: 9, padding: 3, width: "fit-content", marginBottom: 20 }}>
            <button style={S.tab(tab === "csv")} onClick={() => { setTab("csv"); setFile(null); setResult(null); setError(null); }}>📂 CSVアップロード</button>
            <button style={S.tab(tab === "paste")} onClick={() => { setTab("paste"); setFile(null); setResult(null); setError(null); }}>📋 コピペ入力</button>
          </div>

          {/* CSVタブ */}
          {tab === "csv" && (
            <>
              <div style={S.label}>CSVファイル</div>
              <div style={S.drop(dragging)} onClick={() => inputRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)} onDrop={onDrop}>
                <input ref={inputRef} type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
                {file ? (
                  <div><div style={{ fontSize: 26, marginBottom: 6 }}>📄</div>
                    <div style={{ fontWeight: 500 }}>{file.name}</div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                ) : (
                  <div><div style={{ fontSize: 26, marginBottom: 6 }}>☁️</div>
                    <div style={{ fontWeight: 500, color: "#111827" }}>CSVをドロップ、またはクリックして選択</div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>日付列・売上列を含むCSV（UTF-8 / Shift-JIS対応）</div>
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right", marginTop: 8 }}>
                <button onClick={downloadSample} style={{ background: "none", border: "none", color: "#2563eb", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>サンプルCSVをダウンロード</button>
              </div>
            </>
          )}

          {/* コピペタブ */}
          {tab === "paste" && (
            <>
              <div style={S.label}>データをここに貼り付け</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 10 }}>ExcelやスプレッドシートからCtrl+C → Ctrl+Vで貼り付けできます。</div>
              <div style={{ background: "#f9fafb", border: "0.5px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 13 }}>
                <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>対応フォーマット例</div>
                <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
                  {[{ label: "タブ区切り（Excel）", ex: "2024-01-01\t500000" }, { label: "カンマ区切り", ex: "2024-01-01,500000" }, { label: "ヘッダーあり", ex: "日付,売上\n2024-01-01,500000" }].map((f) => (
                    <div key={f.label}>
                      <div style={{ color: "#6b7280", marginBottom: 4, fontSize: 12 }}>{f.label}</div>
                      <pre style={{ color: "#2563eb", fontSize: 12, margin: 0 }}>{f.ex}</pre>
                    </div>
                  ))}
                </div>
              </div>
              <textarea value={pasteText} onChange={(e) => { setPasteText(e.target.value); setPasteError(null); setFile(null); }}
                placeholder={"2024-01-01\t500000\n2024-01-02\t480000\n..."}
                style={{ width: "100%", height: 180, background: "#f9fafb", border: "0.5px solid #e5e7eb", borderRadius: 8, color: "#111827", fontSize: 13, fontFamily: "monospace", padding: "10px 12px", resize: "vertical", boxSizing: "border-box", outline: "none" }} />
              {pasteText.trim() && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{pasteLineCount} 行検出</div>}
              {pasteError && <div style={{ marginTop: 6, color: "#dc2626", fontSize: 13 }}>⚠️ {pasteError}</div>}
              <button onClick={applyPaste} disabled={!pasteText.trim()} style={{ ...S.btn(!pasteText.trim()), marginTop: 10 }}>データを確定する</button>
              {file && tab === "paste" && (
                <div style={{ marginTop: 10, padding: "10px 14px", background: "#eff6ff", border: "0.5px solid #bfdbfe", borderRadius: 8, fontSize: 13, color: "#1d4ed8" }}>
                  ✅ {pasteLineCount} 行確定済み — 下の「予測を実行」で予測できます
                </div>
              )}
            </>
          )}

          {/* オプトイン */}
          <div style={S.optIn}>
            <input type="checkbox" checked={contribute} onChange={(e) => setContribute(e.target.checked)} style={{ marginTop: 2, accentColor: "#2563eb", width: 15, height: 15, cursor: "pointer" }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#111827", marginBottom: 4 }}>予測精度の向上に協力する（任意）― <a href="/privacy" style={{ color: "#2563eb" }}>プライバシーポリシー</a></div>
              <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>チェックを入れると、データが<strong style={{ color: "#374151" }}>匿名化</strong>された上でモデルの改善に利用されます。</div>
            </div>
          </div>

          {/* スライダー */}
          <div style={{ marginTop: 20 }}>
            <div style={S.label}>予測期間：{periods}日</div>
            <input type="range" min={7} max={180} value={periods} onChange={(e) => setPeriods(Number(e.target.value))} style={{ width: "100%", accentColor: "#2563eb" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9ca3af", marginTop: 4 }}><span>7日</span><span>180日</span></div>
          </div>

          <button style={S.btn(!file || loading)} onClick={predict} disabled={!file || loading}>{loading ? "予測中..." : "予測を実行"}</button>

          {error && <div style={{ marginTop: 12, padding: "10px 14px", background: "#fef2f2", border: "0.5px solid #fecaca", borderRadius: 8, color: "#dc2626", fontSize: 13 }}>⚠️ {error}</div>}
          {result?.contributed && <div style={{ marginTop: 10, padding: "10px 14px", background: "#eff6ff", border: "0.5px solid #bfdbfe", borderRadius: 8, fontSize: 13, color: "#1d4ed8" }}>🙏 データの提供ありがとうございます。匿名化して保存しました。</div>}
        </div>

        {/* 結果 */}
        {result && (
          <>
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              {[{ label: "学習データ数", value: `${result.summary.data_points} 日分` }, { label: "最終実績日", value: result.summary.last_actual }, { label: `今後${periods}日の平均予測`, value: fmt(result.summary.next_30_avg) }].map((m) => (
                <div key={m.label} style={S.metric}>
                  <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{m.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.3px" }}>{m.value}</div>
                </div>
              ))}
            </div>

            <div style={S.card}>
              <div style={S.label}>売上推移と予測</div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={(v) => v.slice(5)} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={(v) => "¥" + (v / 10000).toFixed(0) + "万"} width={64} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 13, color: "#6b7280" }} />
                  <ReferenceLine x={result.summary.last_actual} stroke="#d1d5db" strokeDasharray="4 2" label={{ value: "予測開始", fill: "#9ca3af", fontSize: 11 }} />
                  <Line dataKey="実績" stroke="#2563eb" dot={false} strokeWidth={2} connectNulls={false} />
                  <Line dataKey="予測" stroke="#7c3aed" dot={false} strokeWidth={2} strokeDasharray="5 3" connectNulls />
                  <Line dataKey="予測上限" stroke="#e5e7eb" dot={false} strokeWidth={1} />
                  <Line dataKey="予測下限" stroke="#e5e7eb" dot={false} strokeWidth={1} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={S.card}>
              <div style={S.label}>予測テーブル（直近30日）</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: "0.5px solid #e5e7eb" }}>
                      {["日付", "予測売上", "下限（95%）", "上限（95%）"].map((h) => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#6b7280", fontWeight: 500, fontSize: 12 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.forecast.slice(0, 30).map((r) => (
                      <tr key={r.date} style={{ borderBottom: "0.5px solid #f3f4f6" }}>
                        <td style={{ padding: "8px 12px", color: "#6b7280" }}>{r.date}</td>
                        <td style={{ padding: "8px 12px", fontWeight: 600 }}>{fmt(r.yhat)}</td>
                        <td style={{ padding: "8px 12px", color: "#9ca3af" }}>{fmt(r.yhat_lower)}</td>
                        <td style={{ padding: "8px 12px", color: "#9ca3af" }}>{fmt(r.yhat_upper)}</td>
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
