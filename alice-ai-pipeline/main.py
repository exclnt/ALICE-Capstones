from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware # Import modul CORS
from pydantic import BaseModel
from typing import List, Optional
from alice_pipeline import dapatkan_respons_alice

app = FastAPI(
     title="A.L.I.C.E. AI Engine API",
     description="RESTful API untuk menghubungkan Backend Utama dengan Pipeline AI Generatif",
     version="1.0.0"
)

# Tambahkan pengaturan CORS di sini
app.add_middleware(
     CORSMiddleware,
     allow_origins=["*"], # Mengizinkan semua origin (untuk tahap development)
     allow_credentials=True,
     allow_methods=["*"], # Mengizinkan semua metode (GET, POST, dll)
     allow_headers=["*"],
)

# Definisi Struktur Data Request
class PesanRiwayat(BaseModel):
     role: str  # Berisi 'user' atau 'model'
     text: str  # Isi pesan masa lalu

class ChatRequest(BaseModel):
     user_id: str               # ID unik user untuk ditarik datanya dari DB
     message: str              # Pesan baru dari user
     history: Optional[List[PesanRiwayat]] = []  # Memori chat (Contextual Chat)


# Simulasi Fungsi Database (Dinamis Berdasarkan user_id)
def ambil_data_finansial_dari_db(user_id: str) -> dict:
     """
     Simulasi query database. Di sistem nyata, fungsi ini akan melakukan 
     'SELECT * FROM users' dan agregasi data dari tabel transaksi (seperti dataset CSV).
     """
     # Contoh data dinamis hasil tarikan database untuk dua user berbeda
     database_mock = {
          "USR0787": {
               "nama": "Rian",
               "usia": 22,
               "pekerjaan": "Fresh Graduate",
               "penghasilan": "Rp 4.500.000",
               "tujuan": "Ingin menabung dana darurat",
               "masalah": "Sering boncos di akhir bulan",
               "data_transaksi": {
                    "total_pengeluaran": "3.800.000",
                    "sisa_budget_mingguan": "-250.000", # Overbudget
                    "jumlah_transaksi_impulsif": "8",
                    "kategori_paling_boros": "Entertainment"
               }
          },
          "USR0559": {
               "nama": "Siti",
               "usia": 19,
               "pekerjaan": "Mahasiswa",
               "penghasilan": "Rp 1.500.000",
               "tujuan": "Beli laptop baru untuk kuliah",
               "masalah": "Uang saku selalu habis di minggu kedua",
               "data_transaksi": {
                    "total_pengeluaran": "1.200.000",
                    "sisa_budget_mingguan": "50.000",
                    "jumlah_transaksi_impulsif": "1",
                    "kategori_paling_boros": "Food & Beverage"
               }
          }
     }
     
     # Mengembalikan data user sesuai dengan ID yang dikirim frontend
     return database_mock.get(user_id)


# Endpoint RESTful API Utama
@app.post("/api/v1/chat")
async def proses_chat_alice(payload: ChatRequest):
     """
     Endpoint POST untuk memproses chat secara dinamis menggunakan database dan AI Pipeline.
     """
     # Ambil data user secara dinamis dari DB berdasarkan user_id yang dikirim
     konteks_dinamis = ambil_data_finansial_dari_db(payload.user_id)
     
     # Validasi jika user_id tidak ditemukan di database
     if not konteks_dinamis:
          raise HTTPException(
               status_code=404, 
               detail=f"User ID {payload.user_id} tidak terdaftar di database sistem A.L.I.C.E."
          )
     
     # Konversi objek history Pydantic menjadi format list of dict standar Python
     riwayat_formatted = [{"role": h.role, "text": h.text} for h in payload.history]
     
     try:
          # Kirim data dinamis & riwayat chat ke Otak AI
          respons_ai = dapatkan_respons_alice(
               input_pengguna=payload.message,
               konteks_pengguna=konteks_dinamis,
               riwayat_chat=riwayat_formatted
          )
          
          # Kembalikan respon RESTful dalam format JSON standar resmi
          return {
               "success": True,
               "message": "Respons AI berhasil dibuat secara dinamis",
               "data": {
                    "user_id": payload.user_id,
                    "nama_user": konteks_dinamis["nama"],
                    "reply": respons_ai
               }
          }
          
     except Exception as e:
          raise HTTPException(status_code=500, detail=f"Gagal memproses AI: {str(e)}")