import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google import genai

router = APIRouter(prefix="/api/ai", tags=["ai"])

class AdviceRequest(BaseModel):
    product: str
    market: str
    demand_score: int
    predicted_price: float
    lang: str = "en"

@router.post("/recommend")
def get_recommendation(req: AdviceRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not set in environment")

    language_instruction = (
        "Respond entirely in Hindi, written in Devanagari script."
        if req.lang == "hi"
        else "Respond in plain English."
    )

    prompt = f"""You are a market advisor for small farmers and artisans in Uttarakhand.
Product: {req.product}, Market: {req.market},
Demand score: {req.demand_score}/100, Predicted price: ₹{req.predicted_price}

Give a short, practical recommendation (3-4 sentences) on whether to sell now,
what price to expect, and one actionable tip. Keep it simple. {language_instruction}"""

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt,
        )
        return {"recommendation": response.text}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI service failed: {str(e)}")
