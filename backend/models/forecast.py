import os
import certifi
from pymongo import MongoClient

FORECAST_SCHEMA = {
    "product": str,
    "market": str,
    "demand_score": int,
    "predicted_price": float,
}

_client = None
_db = None

def get_db():
    global _client, _db
    if _db is None:
        mongo_uri = os.getenv("MONGO_URI")
        db_name = os.getenv("DB_NAME", "pahadpulse")
        _client = MongoClient(mongo_uri, tlsCAFile=certifi.where())
        _db = _client[db_name]
    return _db

def get_forecasts_collection():
    return get_db()["forecasts"]

def serialize_forecast(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "product": doc["product"],
        "market": doc["market"],
        "demand_score": doc["demand_score"],
        "predicted_price": doc["predicted_price"],
    }