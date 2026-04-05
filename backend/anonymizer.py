"""
anonymizer.py
ユーザーから提供された売上データを匿名化して保存する。

匿名化の方針：
1. 日付をランダムオフセットでシフト（実際の時期を隠す）
2. 売上を正規化（0〜1スケール）して絶対値を消す
3. ユーザーを識別できる情報は一切保存しない
"""

import uuid
import json
import random
import hashlib
from pathlib import Path
from datetime import datetime, timedelta

import pandas as pd
from io import StringIO

# 匿名化データの保存先
STORE_DIR = Path("./contributed_data")
STORE_DIR.mkdir(exist_ok=True)


def anonymize_and_save(csv_text: str) -> str:
    """
    CSVテキストを匿名化してJSONで保存する。
    戻り値: 保存したファイルのID（追跡不可能なUUID）
    """
    df = _parse_csv(csv_text)
    df = _anonymize(df)
    file_id = _save(df)
    return file_id


def load_all_contributed() -> pd.DataFrame:
    """
    保存済みの匿名化データを全件読み込んでDataFrameとして返す。
    モデル再学習時に使用する。
    """
    frames = []
    for path in STORE_DIR.glob("*.json"):
        try:
            with open(path) as f:
                records = json.load(f)
            frames.append(pd.DataFrame(records))
        except Exception:
            continue  # 壊れたファイルはスキップ

    if not frames:
        return pd.DataFrame(columns=["ds", "y"])

    combined = pd.concat(frames, ignore_index=True)
    combined["ds"] = pd.to_datetime(combined["ds"])
    combined["y"] = pd.to_numeric(combined["y"], errors="coerce")
    return combined.dropna()


# ---- 内部処理 ----

def _parse_csv(csv_text: str) -> pd.DataFrame:
    df = pd.read_csv(StringIO(csv_text))

    # 日付列・数値列を自動検出
    date_col = None
    value_col = None

    for col in df.columns:
        if date_col is None:
            try:
                pd.to_datetime(df[col])
                date_col = col
                continue
            except Exception:
                pass
        if value_col is None and col != date_col:
            try:
                pd.to_numeric(df[col], errors="raise")
                value_col = col
            except Exception:
                pass

    if not date_col or not value_col:
        raise ValueError("日付列または数値列が見つかりません")

    result = df[[date_col, value_col]].copy()
    result.columns = ["ds", "y"]
    result["ds"] = pd.to_datetime(result["ds"])
    result["y"] = pd.to_numeric(result["y"], errors="coerce")
    return result.dropna()


def _anonymize(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    # 1. 日付をランダムにシフト（±180日）
    offset_days = random.randint(-180, 180)
    df["ds"] = df["ds"] + timedelta(days=offset_days)

    # 2. 売上を 0〜1 に正規化（絶対値を消す）
    y_min = df["y"].min()
    y_max = df["y"].max()
    if y_max > y_min:
        df["y"] = (df["y"] - y_min) / (y_max - y_min)
    else:
        df["y"] = 0.5  # 全部同じ値の場合

    # 3. 日付を文字列に戻す
    df["ds"] = df["ds"].dt.strftime("%Y-%m-%d")

    return df


def _save(df: pd.DataFrame) -> str:
    # 追跡不可能なランダムIDを生成
    file_id = uuid.uuid4().hex
    path = STORE_DIR / f"{file_id}.json"
    df.to_json(path, orient="records", force_ascii=False)
    return file_id
