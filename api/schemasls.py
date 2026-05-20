"""
Pydantic Schemas — Request/Response models untuk FastAPI endpoints.
"""
from pydantic import BaseModel, Field
from typing import List, Optional


# ============================================================
# Model A: Early Warning (LSTM)
# ============================================================

class BalancePredictionRequest(BaseModel):
    """Input: data 30 hari terakhir per hari (daily_spending, daily_net, balance)."""
    daily_spending: List[float] = Field(..., description="Pengeluaran harian 30 hari terakhir")
    daily_net: List[float] = Field(..., description="Net harian (income - spending) 30 hari terakhir")
    balance: List[float] = Field(..., description="Saldo harian 30 hari terakhir")

class BalancePredictionResponse(BaseModel):
    predictions: List[float] = Field(..., description="Prediksi saldo 10 hari ke depan (normalized)")
    warnings: List[dict] = Field(default=[], description="Alert jika prediksi saldo rendah")
    status: str = "success"


# ============================================================
# Model B: Budget Optimization
# ============================================================

class BudgetOptimizationRequest(BaseModel):
    """Input: proporsi spending per kategori + income + budget."""
    category_proportions: List[float] = Field(
        ..., min_length=7, max_length=7,
        description="Proporsi spending 7 kategori [Bills, Entertainment, Food, Hobby, Investment, Shopping, Transport]"
    )
    monthly_income: float = Field(..., description="Pendapatan bulanan")
    weekly_budget: float = Field(..., description="Batas budget mingguan")

class BudgetAllocation(BaseModel):
    category: str
    current_pct: float
    optimal_pct: float
    optimal_amount: float

class BudgetOptimizationResponse(BaseModel):
    allocations: List[BudgetAllocation]
    monthly_savings_potential: float
    status: str = "success"


# ============================================================
# Model C-1: User Segmentation (Autoencoder)
# ============================================================

class UserSegmentRequest(BaseModel):
    avg_spending: float
    impulsive_ratio: float
    spending_cv: float
    end_month_ratio: float
    overbudget_freq: float

class UserSegmentResponse(BaseModel):
    latent_features: List[float]
    segment_label: Optional[str] = None
    status: str = "success"


# ============================================================
# Model C-2: Risk Prediction (Classifier)
# ============================================================

class RiskPredictionRequest(BaseModel):
    day_of_week: int = Field(..., ge=0, le=6, description="0=Senin, 6=Minggu")
    day_of_month: int = Field(..., ge=1, le=31)
    hour_of_day: int = Field(..., ge=0, le=23)
    segment: int = Field(..., ge=0, le=2, description="Segmen user (0/1/2)")
    category: str = Field(..., description="Kategori transaksi")
    amount: float = Field(..., description="Jumlah transaksi (Rp)")
    weekly_budget: float = Field(..., description="Batas budget mingguan user")
    is_impulsive: int = Field(..., ge=0, le=1, description="Apakah transaksi impulsif (0/1)")
    impulsive_ratio: float = Field(0.0, ge=0, le=1, description="Rasio impulsif user")
    overbudget_freq: float = Field(0.0, ge=0, le=1, description="Frekuensi overbudget user")

class RiskPredictionResponse(BaseModel):
    risk_probability: float
    is_risky: bool
    risk_level: str = Field(..., description="LOW / MEDIUM / HIGH")
    nudge_message: Optional[str] = None
    status: str = "success"


# ============================================================
# Health Check
# ============================================================

class HealthResponse(BaseModel):
    status: str
    models_loaded: bool
    model_count: int
