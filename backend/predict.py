import hashlib
from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/forecasts", tags=["predict"])

# Rule-based, deterministic estimator — NOT a trained ML model.
# Same product+market always gives the same base numbers; a small
# seasonal boost is added based on the current month.
SEASONAL_KEYWORDS = {
    "shawl": [10, 11, 12, 1], "wool": [10, 11, 12, 1],
    "honey": [3, 4, 5], "apple": [8, 9, 10],
    "rajma": [9, 10], "yatra": [5, 6, 7],
}

class PredictRequest(BaseModel):
    product: str
    market: str

@router.post("/predict")
def predict_demand(req: PredictRequest):
    seed = int(hashlib.md5(f"{req.product.lower()}{req.market.lower()}".encode()).hexdigest(), 16)
    base_score = 50 + (seed % 30)  # 50-79

    month = datetime.now().month
    text = (req.product + " " + req.market).lower()
    boost = sum(15 for kw, months in SEASONAL_KEYWORDS.items() if kw in text and month in months)

    demand_score = min(98, base_score + boost)
    base_price = 50 + (seed % 500)
    predicted_price = round(base_price * (1 + demand_score / 200), 2)

    return {"demand_score": demand_score, "predicted_price": predicted_price}
