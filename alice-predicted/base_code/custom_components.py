"""
Custom Components untuk A.L.I.C.E — Memenuhi Main Quest
1. Custom Loss Function (WeightedBinaryCrossEntropy)
2. Custom Callback (F1EarlyStopping)
"""
import tensorflow as tf
import keras
import numpy as np


# ============================================================
# 1. CUSTOM LOSS FUNCTION
# ============================================================

@keras.saving.register_keras_serializable()
class WeightedBinaryCrossEntropy(keras.losses.Loss):
    """
    Custom Loss: Binary Cross-Entropy dengan class weight bawaan.
    Mengatasi class imbalance dengan memberi bobot lebih pada minority class.
    """
    def __init__(self, pos_weight=1.0, name="weighted_bce", **kwargs):
        super().__init__(name=name, **kwargs)
        self.pos_weight = pos_weight

    def call(self, y_true, y_pred):
        y_pred = tf.clip_by_value(y_pred, 1e-7, 1.0 - 1e-7)
        y_true = tf.cast(y_true, tf.float32)
        bce = -(
            self.pos_weight * y_true * tf.math.log(y_pred)
            + (1.0 - y_true) * tf.math.log(1.0 - y_pred)
        )
        return tf.reduce_mean(bce)

    def get_config(self):
        config = super().get_config()
        config.update({"pos_weight": self.pos_weight})
        return config


# ============================================================
# 2. CUSTOM CALLBACK
# ============================================================

class F1EarlyStopping(keras.callbacks.Callback):
    """
    Custom Callback: Early stopping berdasarkan F1-Score.
    Menghentikan training jika F1-score tidak membaik selama 'patience' epoch.
    Juga menyimpan model terbaik (best weights).
    """
    def __init__(self, patience=10, min_delta=0.001, verbose=True):
        super().__init__()
        self.patience = patience
        self.min_delta = min_delta
        self.verbose = verbose
        self.best_f1 = 0.0
        self.wait = 0
        self.best_weights = None
        self.stopped_epoch = 0
        self.f1_history = []
        self._model_ref = None  # Reference terpisah dari parent

    def set_model_ref(self, model):
        """Set reference ke model untuk save/restore weights."""
        self._model_ref = model

    def _compute_f1(self, precision, recall):
        if precision + recall == 0:
            return 0.0
        return 2 * (precision * recall) / (precision + recall)

    def on_epoch_end_manual(self, epoch, precision, recall):
        """Dipanggil manual dari custom training loop."""
        f1 = self._compute_f1(precision, recall)
        self.f1_history.append(f1)

        if f1 > self.best_f1 + self.min_delta:
            self.best_f1 = f1
            self.wait = 0
            self.best_weights = self._model_ref.get_weights() if self._model_ref else None
            if self.verbose:
                print(f"  [F1Callback] F1={f1:.4f} (best) ✓")
        else:
            self.wait += 1
            if self.verbose and self.wait >= self.patience - 2:
                print(f"  [F1Callback] F1={f1:.4f} (no improve {self.wait}/{self.patience})")

        if self.wait >= self.patience:
            self.stopped_epoch = epoch
            if self.verbose:
                print(f"  [F1Callback] Early stopping at epoch {epoch+1}")
            return True  # Signal to stop
        return False

    def restore_best_weights(self, model):
        if self.best_weights is not None:
            model.set_weights(self.best_weights)
            if self.verbose:
                print(f"  [F1Callback] Restored best weights (F1={self.best_f1:.4f})")
