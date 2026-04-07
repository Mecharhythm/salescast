import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from "recharts";

const API_BASE = "https://salescast-api.onrender.com";

// 通貨オプション（言語と独立）
const CURRENCY_OPTIONS = [
  { code: "JPY", symbol: "¥", label: "JPY（円）",  locale: "ja-JP" },
  { code: "USD", symbol: "$", label: "USD ($)",    locale: "en-US" },
  { code: "EUR", symbol: "€", label: "EUR (€)",    locale: "de-DE" },
  { code: "GBP", symbol: "£", label: "GBP (£)",    locale: "en-GB" },
];

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

function CustomTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null;
  const fmt = (n) => n == null ? "—" : new Intl.NumberFormat(currency.locale, {
    style: "currency", currency: currency.code, maximumFractionDigits: 0
  }).format(n);
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
  select: { fontSize: 13, color: "#374151", background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 7, padding: "5px 10px", cursor: "pointer", outline: "none" },
  langBtn: (active) => ({
    fontSize: 12, fontWeight: active ? 600 : 400,
    color: active ? "#2563eb" : "#9ca3af",
    background: "none", border: "none", cursor: "pointer", padding: "2px 4px",
  }),
};

export default function App() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // 言語・通貨の状態
  const [currency, setCurrency] = useState(CURRENCY_OPTIONS[0]); // JPYデフォルト

  const fmt = (n) => n == null ? "—" : new Intl.NumberFormat(currency.locale, {
    style: "currency", currency: currency.code, maximumFractionDigits: 0
  }).format(n);

  const switchLang = (lang) => i18n.changeLanguage(lang);

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
    if (!pasteText.trim()) { setPasteError(t("paste.errorEmpty")); return; }
    const lines = pasteText.trim().split("\n").filter((l) => l.trim());
    if (lines.length < 5) { setPasteError(t("paste.errorTooFew")); return; }
    try { setFile(pasteTextToFile(pasteText)); setResult(null); setError(null); }
    catch { setPasteError(t("paste.errorParse")); }
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
      if (!res.ok) throw new Error(data.detail || t("forecast.run"));
      setResult(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const chartData = (() => {
    if (!result) return [];
    const actualMap = Object.fromEntries(result.actual.map((r) => [r.date, r.value]));
    return result.full_forecast.map((r) => ({
      date: r.date,
      [t("result.actual")]: actualMap[r.date] ?? null,
      [t("result.predicted")]: r.yhat,
      [t("result.lowerBound")]: r.yhat_lower,
      [t("result.upperBound")]: r.yhat_upper,
    }));
  })();

  const pasteLineCount = pasteText.trim().split("\n").filter((l) => l.trim()).length;
  const isJa = i18n.language === "ja";

  // Y軸フォーマット（通貨に応じて単位を変える）
  const yAxisFormatter = (v) => {
    if (currency.code === "JPY") return currency.symbol + (v / 10000).toFixed(0) + t("result.yAxisUnit");
    return currency.symbol + (v / 1000).toFixed(0) + t("result.yAxisUnit");
  };

  return (
    <div style={S.app}>
      {/* ヘッダー */}
      <div style={S.header}>
        <div style={S.logo} onClick={() => navigate("/")}>SalesCast</div>
        <div style={{ fontSize: 12, color: "#9ca3af", marginLeft: 4 }}>{t("nav.subtitle")}</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 20, alignItems: "center" }}>
          {/* 言語切替 */}
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button style={S.langBtn(isJa)} onClick={() => switchLang("ja")}>JA</button>
            <span style={{ color: "#d1d5db", fontSize: 12 }}>|</span>
            <button style={S.langBtn(!isJa)} onClick={() => switchLang("en")}>EN</button>
          </div>
          {/* 通貨選択 */}
          <select
            style={S.select}
            value={currency.code}
            onChange={(e) => setCurrency(CURRENCY_OPTIONS.find((c) => c.code === e.target.value))}
          >
            {CURRENCY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
          {/* ナビ */}
          <span style={S.navLink} onClick={() => navigate("/guide")}>{t("nav.guide")}</span>
          <span style={S.navLink} onClick={() => navigate("/usecases")}>{t("nav.usecases")}</span>
          <span style={S.navLink} onClick={() => navigate("/privacy")}>{t("nav.privacy")}</span>
        </div>
      </div>

      <div style={S.main}>
        <div style={S.card}>
          {/* タブ */}
          <div style={{ display: "flex", gap: 4, background: "#f3f4f6", borderRadius: 9, padding: 4, marginBottom: 20, width: "fit-content" }}>
            <button style={S.tab(tab === "csv")} onClick={() => { setTab("csv"); setFile(null); setResult(null); setError(null); }}>{t("tabs.csv")}</button>
            <button style={S.tab(tab === "paste")} onClick={() => { setTab("paste"); setFile(null); setResult(null); setError(null); }}>{t("tabs.paste")}</button>
          </div>

          {/* CSVタブ */}
          {tab === "csv" && (
            <>
              <div style={S.label}>{t("csv.label")}</div>
              <div style={S.drop(dragging)} onClick={() => inputRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)} onDrop={onDrop}>
                <input ref={inputRef} type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
                {file ? (
                  <div>
                    <div style={{ fontSize: 26, marginBottom: 6 }}>📄</div>
                    <div style={{ fontWeight: 500 }}>{file.name}</div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 26, marginBottom: 6 }}>☁️</div>
                    <div style={{ fontWeight: 500, color: "#111827" }}>{t("csv.drop")}</div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>{t("csv.hint")}</div>
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right", marginTop: 8 }}>
                <button onClick={downloadSample} style={{ background: "none", border: "none", color: "#2563eb", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>{t("csv.sampleDownload")}</button>
              </div>
            </>
          )}

          {/* コピペタブ */}
          {tab === "paste" && (
            <>
              <div style={S.label}>{t("paste.label")}</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 10 }}>{t("paste.hint")}</div>
              <div style={{ background: "#f9fafb", border: "0.5px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 13 }}>
                <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{t("paste.formatLabel")}</div>
                <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
                  {t("paste.formats", { returnObjects: true }).map((f) => (
                    <div key={f.label}>
                      <div style={{ color: "#6b7280", marginBottom: 4, fontSize: 12 }}>{f.label}</div>
                      <pre style={{ color: "#2563eb", fontSize: 12, margin: 0 }}>{f.ex}</pre>
                    </div>
                  ))}
                </div>
              </div>
              <textarea
                value={pasteText}
                onChange={(e) => { setPasteText(e.target.value); setPasteError(null); setFile(null); }}
                placeholder={t("paste.placeholder")}
                style={{ width: "100%", height: 180, background: "#f9fafb", border: "0.5px solid #e5e7eb", borderRadius: 8, color: "#111827", fontSize: 13, fontFamily: "monospace", padding: "10px 12px", resize: "vertical", boxSizing: "border-box", outline: "none" }}
              />
              {pasteText.trim() && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{t("paste.linesDetected", { count: pasteLineCount })}</div>}
              {pasteError && <div style={{ marginTop: 6, color: "#dc2626", fontSize: 13 }}>⚠️ {pasteError}</div>}
              <button onClick={applyPaste} disabled={!pasteText.trim()} style={{ ...S.btn(!pasteText.trim()), marginTop: 10 }}>{t("paste.confirm")}</button>
              {file && tab === "paste" && (
                <div style={{ marginTop: 10, padding: "10px 14px", background: "#eff6ff", border: "0.5px solid #bfdbfe", borderRadius: 8, fontSize: 13, color: "#1d4ed8" }}>
                  {t("paste.confirmed", { count: pasteLineCount })}
                </div>
              )}
            </>
          )}

          {/* オプトイン */}
          <div style={S.optIn}>
            <input type="checkbox" checked={contribute} onChange={(e) => setContribute(e.target.checked)} style={{ marginTop: 2, accentColor: "#2563eb", width: 15, height: 15, cursor: "pointer" }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#111827", marginBottom: 4 }}>
                {t("optIn.label")}<a href="/privacy" style={{ color: "#2563eb" }}>{t("optIn.privacyLink")}</a>
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>
                {t("optIn.description")}<strong style={{ color: "#374151" }}>{t("optIn.anonymized")}</strong>{t("optIn.descriptionSuffix")}
              </div>
            </div>
          </div>

          {/* スライダー */}
          <div style={{ marginTop: 20 }}>
            <div style={S.label}>{t("forecast.periodLabel", { days: periods })}</div>
            <input type="range" min={7} max={180} value={periods} onChange={(e) => setPeriods(Number(e.target.value))} style={{ width: "100%", accentColor: "#2563eb" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
              <span>{t("forecast.periodMin")}</span>
              <span>{t("forecast.periodMax")}</span>
            </div>
          </div>

          <button style={S.btn(!file || loading)} onClick={predict} disabled={!file || loading}>
            {loading ? t("forecast.running") : t("forecast.run")}
          </button>

          {error && <div style={{ marginTop: 12, padding: "10px 14px", background: "#fef2f2", border: "0.5px solid #fecaca", borderRadius: 8, color: "#dc2626", fontSize: 13 }}>⚠️ {error}</div>}
          {result?.contributed && <div style={{ marginTop: 10, padding: "10px 14px", background: "#eff6ff", border: "0.5px solid #bfdbfe", borderRadius: 8, fontSize: 13, color: "#1d4ed8" }}>{t("forecast.contributed")}</div>}
        </div>

        {/* 結果 */}
        {result && (
          <>
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              {[
                { label: t("result.dataPoints"),                          value: t("result.dataPointsUnit", { count: result.summary.data_points }) },
                { label: t("result.lastActual"),                          value: result.summary.last_actual },
                { label: t("result.avgForecast", { days: periods }),      value: fmt(result.summary.next_30_avg) },
              ].map((m) => (
                <div key={m.label} style={S.metric}>
                  <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{m.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.3px" }}>{m.value}</div>
                </div>
              ))}
            </div>

            <div style={S.card}>
              <div style={S.label}>{t("result.chartLabel")}</div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={(v) => v.slice(5)} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={yAxisFormatter} width={64} />
                  <Tooltip content={<CustomTooltip currency={currency} />} />
                  <Legend wrapperStyle={{ fontSize: 13, color: "#6b7280" }} />
                  <ReferenceLine x={result.summary.last_actual} stroke="#d1d5db" strokeDasharray="4 2" label={{ value: t("result.forecastStart"), fill: "#9ca3af", fontSize: 11 }} />
                  <Line dataKey={t("result.actual")}     stroke="#2563eb" dot={false} strokeWidth={2} connectNulls={false} />
                  <Line dataKey={t("result.predicted")}  stroke="#7c3aed" dot={false} strokeWidth={2} strokeDasharray="5 3" connectNulls />
                  <Line dataKey={t("result.upperBound")} stroke="#e5e7eb" dot={false} strokeWidth={1} />
                  <Line dataKey={t("result.lowerBound")} stroke="#e5e7eb" dot={false} strokeWidth={1} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={S.card}>
              <div style={S.label}>{t("result.tableLabel")}</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: "0.5px solid #e5e7eb" }}>
                      {[t("result.tableHeaders.date"), t("result.tableHeaders.predicted"), t("result.tableHeaders.lower"), t("result.tableHeaders.upper")].map((h) => (
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
