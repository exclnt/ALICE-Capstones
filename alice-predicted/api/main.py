"""
A.L.I.C.E — FastAPI REST API
Artificial Intelligence for Literacy, Investment, and Cost Efficiency

Endpoints:
  GET  /health                    → Health check
  POST /api/v1/predict-balance    → Model A: LSTM saldo forecasting
  POST /api/v1/optimize-budget    → Model B: DNN budget optimization
  POST /api/v1/segment-user       → Model C-1: Autoencoder segmentation
  POST /api/v1/predict-risk       → Model C-2: DNN risk classification
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import numpy as np
import tensorflow as tf

from .models_loader import registry
from .schemas import (
    BalancePredictionRequest, BalancePredictionResponse,
    BudgetOptimizationRequest, BudgetOptimizationResponse, BudgetAllocation,
    UserSegmentRequest, UserSegmentResponse,
    RiskPredictionRequest, RiskPredictionResponse,
    HealthResponse,
)


# ============================================================
# App Lifecycle — load models on startup
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    registry.load_all()
    yield
    # cleanup (if needed)


app = FastAPI(
    title="A.L.I.C.E API",
    description="REST API untuk model AI keuangan A.L.I.C.E",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — izinkan frontend memanggil API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Sesuaikan dengan domain frontend di production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Constants
# ============================================================

CATEGORIES = ["Bills", "Entertainment", "Food & Beverage", "Hobby",
              "Investment", "Shopping", "Transport"]
LABELS = CATEGORIES + ["Savings"]
RISK_THRESHOLD = 0.4


# ============================================================
# Health Check
# ============================================================

@app.get("/health", response_model=HealthResponse)
async def health_check():
    models_loaded = registry._loaded
    count = sum([
        registry.lstm_model is not None,
        registry.budget_model is not None,
        registry.autoencoder is not None,
        registry.risk_classifier is not None,
    ])
    return HealthResponse(
        status="healthy" if models_loaded else "models not loaded",
        models_loaded=models_loaded,
        model_count=count,
    )


# ============================================================
# Model A: Predict Balance (LSTM)
# ============================================================

@app.post("/api/v1/predict-balance", response_model=BalancePredictionResponse)
async def predict_balance(req: BalancePredictionRequest):
    try:
        if registry.lstm_model is None or registry.lstm_scaler is None:
            raise HTTPException(status_code=503, detail="Model A (LSTM) belum siap. Pastikan model dan scaler sudah di-generate.")

        lookback = registry.lstm_config["LOOKBACK"]

        if len(req.daily_spending) != lookback:
            raise HTTPException(
                status_code=400,
                detail=f"Butuh {lookback} data point, dapat {len(req.daily_spending)}"
            )

        # Susun input [lookback, 3]
        raw = np.column_stack([req.daily_spending, req.daily_net, req.balance])
        scaled = registry.lstm_scaler.transform(raw).astype(np.float32)
        x = scaled.reshape(1, lookback, 3)

        # Predict
        pred = registry.lstm_model.predict(x, verbose=0)[0]
        predictions = pred.tolist()

        # Early warning logic
        warnings = []
        for i, val in enumerate(predictions):
            if val < 0.1:
                warnings.append({
                    "day": i + 1,
                    "predicted_balance_normalized": round(val, 4),
                    "status": "DANGER" if val < 0.05 else "WARNING",
                })

        return BalancePredictionResponse(
            predictions=[round(p, 6) for p in predictions],
            warnings=warnings,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# Model B: Optimize Budget (DNN)
# ============================================================

@app.post("/api/v1/optimize-budget", response_model=BudgetOptimizationResponse)
async def optimize_budget(req: BudgetOptimizationRequest):
    try:
        if registry.budget_model is None or registry.budget_scaler is None:
            raise HTTPException(
                status_code=503, 
                detail="Model B (Budget Optimization) belum siap. Silakan 'Run All' pada notebook budget_optimization_ga.ipynb terlebih dahulu untuk men-generate budget_scaler.pkl."
            )

        # Input: 7 proportions + income + budget = 9 features
        raw = np.array(
            req.category_proportions + [req.monthly_income, req.weekly_budget],
            dtype=np.float32
        ).reshape(1, -1)

        scaled = registry.budget_scaler.transform(raw).astype(np.float32)
        pred = registry.budget_model.predict(scaled, verbose=0)[0]

        allocations = []
        for i, label in enumerate(LABELS):
            current = req.category_proportions[i] * 100 if i < 7 else 0.0
            optimal = float(pred[i]) * 100
            amount = req.weekly_budget * float(pred[i])
            allocations.append(BudgetAllocation(
                category=label,
                current_pct=round(current, 2),
                optimal_pct=round(optimal, 2),
                optimal_amount=round(amount, 0),
            ))

        savings = req.weekly_budget * float(pred[-1]) * 4  # Monthly

        return BudgetOptimizationResponse(
            allocations=allocations,
            monthly_savings_potential=round(savings, 0),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# Model C-1: Segment User (Autoencoder)
# ============================================================

@app.post("/api/v1/segment-user", response_model=UserSegmentResponse)
async def segment_user(req: UserSegmentRequest):
    try:
        if registry.autoencoder is None or registry.ae_scaler is None:
            raise HTTPException(status_code=503, detail="Model C-1 (Autoencoder) belum siap. Run behavior_nudging.ipynb terlebih dahulu.")

        raw = np.array([[
            req.avg_spending, req.impulsive_ratio, req.spending_cv,
            req.end_month_ratio, req.overbudget_freq,
        ]], dtype=np.float32)

        scaled = registry.ae_scaler.transform(raw).astype(np.float32)
        latent = registry.autoencoder.encode(tf.constant(scaled)).numpy()[0]

        # Simple segment labeling based on latent features
        latent_list = [round(float(v), 4) for v in latent]

        # Determine segment label based on input features
        if req.impulsive_ratio > 0.45:
            label = "Impulsif Tinggi"
        elif req.overbudget_freq < 0.35:
            label = "Konsisten Hemat"
        else:
            label = "Moderat"

        # Mapping label ke number untuk digunakan sebagai input Model C-2
        SEGMENT_MAP = {
            "Konsisten Hemat": 0,
            "Moderat": 1,
            "Impulsif Tinggi": 2,
        }
        segment_number = SEGMENT_MAP.get(label, 1)  # default 1 (Moderat)

        return UserSegmentResponse(
            latent_features=latent_list,
            segment_label=label,
            segment_number=segment_number,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# Model C-2: Predict Risk (Classifier)
# ============================================================

@app.post("/api/v1/predict-risk", response_model=RiskPredictionResponse)
async def predict_risk(req: RiskPredictionRequest):
    try:
        # Encode category
        if registry.label_encoder is not None:
            if req.category in registry.label_encoder.classes_:
                cat_enc = int(registry.label_encoder.transform([req.category])[0])
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"Kategori '{req.category}' tidak valid. "
                           f"Pilihan: {list(registry.label_encoder.classes_)}"
                )
        else:
            cat_enc = CATEGORIES.index(req.category) if req.category in CATEGORIES else 0

        # Derived features
        weekly_prog = req.day_of_week / 6.0
        monthly_prog = req.day_of_month / 31.0
        is_weekend = 1 if req.day_of_week >= 5 else 0
        budget_usage = req.amount / req.weekly_budget if req.weekly_budget > 0 else 0.0

        # Category medians (approximate dari dataset training)
        CAT_MEDIANS = {
            "Bills": 150000, "Entertainment": 300000, "Food & Beverage": 60000,
            "Hobby": 200000, "Investment": 250000, "Shopping": 180000, "Transport": 120000,
        }
        cat_median = CAT_MEDIANS.get(req.category, 150000)
        amount_norm = req.amount / cat_median if cat_median > 0 else 1.0

        # Latent features (dummy — idealnya dari autoencoder per user)
        latent_1, latent_2 = 0.0, 0.0

        # 15 fitur sesuai CLF_FEATURES di notebook
        features = np.array([[
            req.day_of_week, req.day_of_month, req.hour_of_day,
            req.segment, cat_enc, weekly_prog, monthly_prog,
            latent_1, latent_2,
            req.is_impulsive, amount_norm, is_weekend, budget_usage,
            req.impulsive_ratio, req.overbudget_freq,
        ]], dtype=np.float32)

        # Scale if scaler exists
        if registry.clf_scaler is not None:
            features = registry.clf_scaler.transform(features).astype(np.float32)

        prob = float(registry.risk_classifier.predict(features, verbose=0)[0][0])
        is_risky = prob > RISK_THRESHOLD

        # Risk level
        if prob > 0.7:
            level = "HIGH"
        elif prob > RISK_THRESHOLD:
            level = "MEDIUM"
        else:
            level = "LOW"

        # Nudge message
        nudge = None
        if is_risky:
            day_names = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]
            nudge = (
                f"⚠️ Hati-hati! Transaksi {req.category} sebesar Rp{req.amount:,.0f} "
                f"pada hari {day_names[req.day_of_week]} jam {req.hour_of_day}:00 "
                f"terdeteksi berisiko ({level}). Pertimbangkan untuk menunda "
                f"pengeluaran ini."
            )

        return RiskPredictionResponse(
            risk_probability=round(prob, 4),
            is_risky=is_risky,
            risk_level=level,
            nudge_message=nudge,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# Root
# ============================================================

@app.get("/")
async def root():
    return {
        "name": "A.L.I.C.E API",
        "version": "1.0.0",
        "description": "Artificial Intelligence for Literacy, Investment, and Cost Efficiency",
        "docs": "/docs",
        "endpoints": [
            "GET  /health",
            "POST /api/v1/predict-balance",
            "POST /api/v1/optimize-budget",
            "POST /api/v1/segment-user",
            "POST /api/v1/predict-risk",
        ],
    }
