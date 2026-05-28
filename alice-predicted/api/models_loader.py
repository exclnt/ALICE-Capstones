"""
Model Loader — Memuat semua model .keras untuk inference.
Custom class harus didefinisikan sebelum load_model() dipanggil.
"""
import os
import pickle
import numpy as np
import tensorflow as tf
import keras

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAVED_DIR = os.path.join(BASE_DIR, "models", "saved")


# ============================================================
# Custom Keras Classes (wajib ada sebelum load_model)
# ============================================================

@keras.saving.register_keras_serializable()
class EarlyWarningLSTM(keras.Model):
    def __init__(self, forecast_days=10, **kwargs):
        super().__init__(**kwargs)
        self.forecast_days = forecast_days
        self.lstm1 = keras.layers.LSTM(64, return_sequences=True)
        self.dropout1 = keras.layers.Dropout(0.2)
        self.lstm2 = keras.layers.LSTM(32)
        self.dropout2 = keras.layers.Dropout(0.2)
        self.dense1 = keras.layers.Dense(16, activation="relu")
        self.output_layer = keras.layers.Dense(forecast_days)

    def call(self, inputs, training=False):
        x = self.dropout1(self.lstm1(inputs), training=training)
        x = self.dropout2(self.lstm2(x), training=training)
        return self.output_layer(self.dense1(x))

    def get_config(self):
        c = super().get_config()
        c.update({"forecast_days": self.forecast_days})
        return c


@keras.saving.register_keras_serializable()
class BudgetOptimizer(keras.Model):
    def __init__(self, n_output=8, **kwargs):
        super().__init__(**kwargs)
        self.n_output = n_output
        self.dense1 = keras.layers.Dense(64, activation="relu")
        self.bn1 = keras.layers.BatchNormalization()
        self.dropout1 = keras.layers.Dropout(0.2)
        self.dense2 = keras.layers.Dense(128, activation="relu")
        self.bn2 = keras.layers.BatchNormalization()
        self.dropout2 = keras.layers.Dropout(0.2)
        self.dense3 = keras.layers.Dense(64, activation="relu")
        self.output_layer = keras.layers.Dense(n_output, activation="softmax")

    def call(self, inputs, training=False):
        x = self.dropout1(self.bn1(self.dense1(inputs), training=training), training=training)
        x = self.dropout2(self.bn2(self.dense2(x), training=training), training=training)
        return self.output_layer(self.dense3(x))

    def get_config(self):
        c = super().get_config()
        c.update({"n_output": self.n_output})
        return c


@keras.saving.register_keras_serializable()
class SpendingAutoencoder(keras.Model):
    def __init__(self, n_features=5, latent_dim=2, **kwargs):
        super().__init__(**kwargs)
        self.n_features = n_features
        self.latent_dim = latent_dim
        self.enc1 = keras.layers.Dense(16, activation="relu")
        self.enc2 = keras.layers.Dense(8, activation="relu")
        self.bottleneck = keras.layers.Dense(latent_dim, activation="relu", name="latent")
        self.dec1 = keras.layers.Dense(8, activation="relu")
        self.dec2 = keras.layers.Dense(16, activation="relu")
        self.dec_out = keras.layers.Dense(n_features)

    def call(self, inputs, training=False):
        latent = self.bottleneck(self.enc2(self.enc1(inputs)))
        return self.dec_out(self.dec2(self.dec1(latent)))

    def encode(self, inputs):
        return self.bottleneck(self.enc2(self.enc1(inputs)))

    def get_config(self):
        c = super().get_config()
        c.update({"n_features": self.n_features, "latent_dim": self.latent_dim})
        return c


@keras.saving.register_keras_serializable()
class RiskClassifier(keras.Model):
    def __init__(self, n_features=15, **kwargs):
        super().__init__(**kwargs)
        self.n_feat = n_features
        self.dense1 = keras.layers.Dense(64, activation="relu")
        self.bn1 = keras.layers.BatchNormalization()
        self.drop1 = keras.layers.Dropout(0.3)
        self.dense2 = keras.layers.Dense(128, activation="relu")
        self.bn2 = keras.layers.BatchNormalization()
        self.drop2 = keras.layers.Dropout(0.3)
        self.dense3 = keras.layers.Dense(64, activation="relu")
        self.drop3 = keras.layers.Dropout(0.2)
        self.out = keras.layers.Dense(1, activation="sigmoid")

    def call(self, inputs, training=False):
        x = self.drop1(self.bn1(self.dense1(inputs), training=training), training=training)
        x = self.drop2(self.bn2(self.dense2(x), training=training), training=training)
        return self.out(self.drop3(self.dense3(x), training=training))

    def get_config(self):
        c = super().get_config()
        c.update({"n_features": self.n_feat})
        return c


# ============================================================
# Model Registry — Singleton loader
# ============================================================

class ModelRegistry:
    """Memuat dan menyimpan semua model dalam memory."""

    def __init__(self):
        self.lstm_model = None
        self.lstm_config = None
        self.lstm_scaler = None
        self.budget_model = None
        self.budget_scaler = None
        self.autoencoder = None
        self.ae_scaler = None
        self.risk_classifier = None
        self.clf_scaler = None
        self.label_encoder = None
        self._loaded = False

    @staticmethod
    def _load_pickle(filename):
        path = os.path.join(SAVED_DIR, filename)
        if os.path.exists(path):
            with open(path, "rb") as f:
                print(f"  [OK] {filename}")
                return pickle.load(f)
        print(f"  [SKIP] {filename} not found")
        return None

    @staticmethod
    def _load_model(filename):
        path = os.path.join(SAVED_DIR, filename)
        if os.path.exists(path):
            model = keras.models.load_model(path)
            print(f"  [OK] {filename}")
            return model
        print(f"  [SKIP] {filename} not found")
        return None

    def load_all(self):
        if self._loaded:
            return
        print("[ModelRegistry] Loading models...")

        # Model A: LSTM
        self.lstm_model = self._load_model("lstm_model.keras")
        self.lstm_config = self._load_pickle("lstm_config.pkl")
        self.lstm_scaler = self._load_pickle("lstm_scaler.pkl")

        # Model B: Budget Optimizer
        self.budget_model = self._load_model("budget_model.keras")
        self.budget_scaler = self._load_pickle("budget_scaler.pkl")

        # Model C-1: Autoencoder
        self.autoencoder = self._load_model("autoencoder_model.keras")
        self.ae_scaler = self._load_pickle("ae_scaler.pkl")

        # Model C-2: Risk Classifier
        self.risk_classifier = self._load_model("risk_classifier.keras")
        self.clf_scaler = self._load_pickle("clf_scaler.pkl")
        self.label_encoder = self._load_pickle("label_encoder.pkl")

        self._loaded = True
        print("[ModelRegistry] Model loading complete!")


# Global instance
registry = ModelRegistry()
