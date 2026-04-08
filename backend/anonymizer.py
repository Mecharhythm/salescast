"""
関数名は残す。
"""

from pathlib import Path
import pandas as pd
from io import StringIO

# 保存先（互換性維持
STORE_DIR = Path("./contributed_data")
STORE_DIR.mkdir(exist_ok=True)


def anonymize_and_save(csv_text: str) -> str:
    """
    必要ならCSVの形式チェックだけ実施。
    """
    _ = _parse_csv(csv_text)  
    return "disabled"


def load_all_contributed() -> pd.DataFrame:
    """
    ユーザー提供データの学習利用を停止
    """
    return pd.DataFrame(columns=["ds", "y"])


def _parse_csv(csv_text: str) -> pd.DataFrame:
    df = pd.read_csv(StringIO(csv_text))

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