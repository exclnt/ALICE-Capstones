import numpy as np
import tensorflow as tf

# 1. Load Model yang sudah disimpan
print("Loading model...")
model_budget = tf.keras.models.load_model('alice_budget_optimizer.keras')

# 2. Siapkan Data Dummy Baru (Data seolah-olah dari input user di website)
# Ingat urutan fiturnya: ['total_income', 'total_expense', 'savings_ratio', 'fun_ratio']
# Pastikan data ini sudah melalui proses Scaling yang sama seperti saat training!
dummy_input = np.array([[
    0.5,  # total_income (scaled)
    0.8,  # total_expense (scaled - pengeluaran tinggi)
    0.05, # savings_ratio (rendah)
    0.6   # fun_ratio (tinggi - banyak foya-foya)
]])

# 3. Lakukan Prediksi (Inference)
print("\nMelakukan Prediksi...")
prediction = model_budget.predict(dummy_input)

# 4. Terjemahkan Output Model
predicted_class = np.argmax(prediction, axis=1)[0]
confidence = np.max(prediction) * 100

print(f"Hasil Prediksi Array: {prediction}")
if predicted_class == 0:
    print(f"Rekomendasi: SAFE (50/30/20) - Confidence: {confidence:.2f}%")
elif predicted_class == 1:
    print(f"Rekomendasi: WARNING (60/20/20) - Confidence: {confidence:.2f}%")
else:
    print(f"Rekomendasi: DANGER (80/10/10) - Confidence: {confidence:.2f}%")