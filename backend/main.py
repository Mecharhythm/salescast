from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from predictor import run_prediction

app = FastAPI(title="売上予測API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番では実際のドメインに変更する
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok"}


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    periods: int = Query(default=30, ge=7, le=180),
):
    """
    CSVファイルをアップロードして売上予測を返す。
    - periods: 予測する日数（7〜180日）
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="CSVファイルをアップロードしてください")

    content = await file.read()
    try:
        csv_text = content.decode("utf-8")
    except UnicodeDecodeError:
        try:
            csv_text = content.decode("shift_jis")
        except Exception:
            raise HTTPException(status_code=400, detail="文字コードを認識できませんでした（UTF-8またはShift-JISに対応）")

    try:
        result = run_prediction(csv_text, periods=periods)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"予測処理中にエラーが発生しました: {str(e)}")

    return result
