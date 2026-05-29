import os
import sys
import numpy as np
import pickle
import keras
import traceback

# Setup paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SAVED_DIR = os.path.join(BASE_DIR, "models", "saved")
sys.path.append(os.path.join(BASE_DIR, "api"))

# Import custom class
from models_loader import BudgetOptimizer

def test_budget():
    try:
        print("Loading model and scaler...")
        model = keras.models.load_model(os.path.join(SAVED_DIR, "budget_model.keras"))
        with open(os.path.join(SAVED_DIR, "budget_scaler.pkl"), "rb") as f:
            scaler = pickle.load(f)
            
        print("Model input shape:", model.input_shape if hasattr(model, 'input_shape') else "unknown")
            
        category_proportions = [0.20, 0.15, 0.30, 0.05, 0.00, 0.20, 0.10]
        monthly_income = 8500000
        weekly_budget = 1500000

        raw = np.array(category_proportions + [monthly_income, weekly_budget], dtype=np.float32).reshape(1, -1)
        print("Raw features shape:", raw.shape)
        
        scaled = scaler.transform(raw).astype(np.float32)
        print("Scaled features shape:", scaled.shape)
        
        pred = model.predict(scaled, verbose=0)
        print("Prediction successful:", pred)
    except Exception as e:
        print("ERROR OCCURRED:")
        traceback.print_exc()

if __name__ == "__main__":
    test_budget()
