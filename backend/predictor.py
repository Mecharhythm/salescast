import pandas as pd
from prophet import Prophet
from io import StringIO


def run_prediction(csv_text: str, periods: int = 30) -> dict:
    """
    CSVテキストを受け取り、Prophet で売上予測を行う。
    CSVは「日付列」と「売上列」の2列を想定。
    列名は自動検出する。
    """
    df = pd.read_csv(StringIO(csv_text))

    # --- 列検出 ---
    date_col = _detect_date_column(df)
    value_col = _detect_value_column(df, date_col)

    # Prophet 用に列名変換
    prophet_df = df[[date_col, value_col]].rename(
        columns={date_col: "ds", value_col: "y"}
    )
    prophet_df["ds"] = pd.to_datetime(prophet_df["ds"])
    prophet_df["y"] = pd.to_numeric(prophet_df["y"], errors="coerce")
    prophet_df = prophet_df.dropna()

    if len(prophet_df) < 10:
        raise ValueError("データが少なすぎます（最低10行必要です）")

    # --- Prophet 学習 ---
    model = Prophet(
        yearly_seasonality='auto',
        weekly_seasonality=True,
        daily_seasonality=False,
        interval_width=0.95,
    )
    model.fit(prophet_df)

    # --- 予測 ---
    future = model.make_future_dataframe(periods=periods)
    forecast = model.predict(future)

    # --- レスポンス用データ整形 ---
    # 実績データ
    actual = prophet_df.rename(columns={"ds": "date", "y": "value"})
    actual["date"] = actual["date"].dt.strftime("%Y-%m-%d")

    # 予測データ（将来分のみ）
    last_actual_date = prophet_df["ds"].max()
    future_forecast = forecast[forecast["ds"] > last_actual_date][
        ["ds", "yhat", "yhat_lower", "yhat_upper"]
    ].copy()
    future_forecast["ds"] = future_forecast["ds"].dt.strftime("%Y-%m-%d")
    future_forecast = future_forecast.rename(columns={"ds": "date"})

    # 全期間のトレンド（グラフ用）
    full_forecast = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].copy()
    full_forecast["ds"] = full_forecast["ds"].dt.strftime("%Y-%m-%d")
    full_forecast = full_forecast.rename(columns={"ds": "date"})

    return {
        "actual": actual[["date", "value"]].to_dict(orient="records"),
        "forecast": future_forecast.to_dict(orient="records"),
        "full_forecast": full_forecast.to_dict(orient="records"),
        "summary": {
            "data_points": len(prophet_df),
            "predict_days": periods,
            "last_actual": last_actual_date.strftime("%Y-%m-%d"),
            "next_30_avg": round(future_forecast["yhat"].mean(), 0),
        },
    }


def _detect_date_column(df: pd.DataFrame) -> str:
    """日付っぽい列を自動検出"""
    for col in df.columns:
        try:
            converted = pd.to_datetime(df[col], errors="coerce")
            # NaT でない値が10行以上あることを確認
            if converted.notna().sum() >= 10:
                return col
        except Exception:
            continue
    raise ValueError("日付列が見つかりませんでした")


def _detect_value_column(df: pd.DataFrame, date_col: str) -> str:
    """数値列を自動検出（日付列以外で最初の数値列）"""
    for col in df.columns:
        if col == date_col:
            continue
        try:
            converted = pd.to_numeric(df[col], errors="coerce")
            # NaN でない値が10行以上あることを確認
            if converted.notna().sum() >= 10:
                return col
        except Exception:
            continue
    raise ValueError("数値列が見つかりませんでした")
