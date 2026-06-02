# 📊 A.L.I.C.E. Financial Dashboard

Dashboard analitik interaktif yang dibangun menggunakan **Streamlit**, **Pandas**, dan **Plotly** untuk memvisualisasikan data profil dan transaksi pengguna A.L.I.C.E. secara komprehensif.

---

## 📖 Deskripsi Singkat

Berbeda dengan _core microservices_ aplikasi, modul ini bertindak sebagai **Dashboard Analitik** khusus. Tujuannya adalah untuk memantau metrik performa pengguna, menganalisis risiko _overbudget_, serta mensimulasikan dampak pengurangan pengeluaran gaya hidup (_lifestyle leakage_) menjadi potensi dana simpanan produktif. Dashboard ini menggunakan dataset berbasis CSV (`alice_transactions_final.csv`).

---

## ✨ Fitur Utama (Tabs)

Dashboard ini memiliki 6 menu tab utama:

1. **📌 Overview:** Ringkasan eksekutif agregasi transaksi (total pengguna, distribusi kategori pengeluaran, tren bulanan).
2. **🚨 Preventive Analytics:** Sistem peringatan dini (*Early Warning*). Menganalisis risiko defisit keuangan ketika pengguna telah menyentuh batas alarm peringatan (pengeluaran >80% batas anggaran).
3. **📈 Productive Analytics:** Simulasi interaktif yang menghitung potensi konversi pengeluaran impulsif/gaya hidup menjadi dana investasi jangka menengah/panjang (hingga 5 tahun).
4. **👤 User Behavior:** Pemetaan profil pengguna berdasarkan kedisiplinan anggaran (dikategorikan ke dalam *Overspending*, *Impulsive*, atau *Controlled*).
5. **🤖 AI Recommendation:** Tampilan simulasi kesimpulan diagnostik dan saran finansial dari AI berdasarkan *expense ratio* per pengguna.
6. **🎯 Business Conclusion:** Kesimpulan *business intelligence* secara kuantitatif yang membuktikan bahwa intervensi model peramalan A.L.I.C.E sangat berdampak dan efektif dalam menyehatkan finansial pengguna muda.

---

## 🛠️ Teknologi yang Digunakan

- **Python** (Pemrosesan Data Utama)
- **Streamlit** (Framework UI Interaktif)
- **Pandas** (Manajemen dan Agregasi Dataset)
- **Plotly Express & Graph Objects** (Visualisasi Grafik Modern)
