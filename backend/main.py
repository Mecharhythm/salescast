from fastapi import FastAPI, UploadFile, File, HTTPException, Query, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from typing import Optional
import io
import csv

from predictor import run_prediction
#from anonymizer import anonymize_and_save

# ---- レートリミット設定 ----
# 同一IPから1分間に10回までリクエストを許可
limiter = Limiter(key_func=get_remote_address, default_limits=["10/minute"])

app = FastAPI(title="売上予測API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://salescast.vercel.app",
        "http://localhost:5173",
        "http://localhost:4173",
    ],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# ---- 定数 ----
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
MIN_ROWS = 10


@app.get("/")
def root():
    return {"status": "ok"}


@app.post("/predict")
@limiter.limit("10/minute")
async def predict(
    request: Request,
    file: UploadFile = File(...),
    periods: int = Query(default=30, ge=7, le=180),
):
    # ---- 1. 拡張子チェック ----
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="CSVファイルをアップロードしてください")

    # ---- 2. ファイルサイズチェック ----
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="ファイルサイズは5MB以下にしてください")

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="ファイルが空です")

    # ---- 3. 文字コード変換 ----
    try:
        csv_text = content.decode("utf-8")
    except UnicodeDecodeError:
        try:
            csv_text = content.decode("shift_jis")
        except Exception:
            raise HTTPException(status_code=400, detail="文字コードを認識できませんでした（UTF-8またはShift-JISに対応）")

    # ---- 4. CSVフォーマット検証（中身チェック） ----
    try:
        reader = csv.reader(io.StringIO(csv_text))
        rows = list(reader)

        if len(rows) < MIN_ROWS:
            raise HTTPException(status_code=422, detail=f"最低{MIN_ROWS}行以上のデータが必要です（現在{len(rows)}行）")

        # 各行の列数が一致しているか確認
        col_counts = [len(row) for row in rows if row]
        if len(set(col_counts)) > 2:
            raise HTTPException(status_code=422, detail="CSVの形式が不正です。列数が一定ではありません")

        # 最低2列あるか確認
        if min(col_counts) < 2:
            raise HTTPException(status_code=422, detail="日付列と数値列の最低2列が必要です")

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=422, detail="CSVファイルの解析に失敗しました。形式を確認してください")

    # ---- 5. 予測実行 ----
    try:
        result = run_prediction(csv_text, periods=periods)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"予測処理中にエラーが発生しました: {str(e)}")

    # ---- 6. オプトイン時のみ匿名化保存 ----
    
    result["contributed"] = False
    return result