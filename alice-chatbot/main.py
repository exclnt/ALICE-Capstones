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
     konteks_finansial: Optional[dict] = {}  # Data finansial dari Request Body (Microservice V2)


# Mock Database telah dihapus untuk implementasi V2


# Endpoint RESTful API Utama
@app.post("/api/v1/chat")
async def proses_chat_alice(payload: ChatRequest):
     """
     Endpoint POST untuk memproses chat secara dinamis menggunakan konteks finansial dari Express.js.
     """
     # Mengambil konteks finansial langsung dari payload body
     konteks_dinamis = payload.konteks_finansial
     
     # Konversi objek history Pydantic menjadi format list of dict standar Python
     riwayat_formatted = [{"role": h.role, "text": h.text} for h in payload.history]
     
     try:
          # Kirim data finansial dari payload & riwayat chat ke Otak AI
          respons_ai = dapatkan_respons_alice(
               input_pengguna=payload.message,
               konteks_pengguna=konteks_dinamis,
               riwayat_chat=riwayat_formatted
          )
          
          # Ambil nama user dari konteks untuk response (fallback ke 'Sobat' jika tidak ada)
          nama = konteks_dinamis.get("nama", "Sobat") if konteks_dinamis else "Sobat"
          
          # Kembalikan respon RESTful dalam format JSON standar resmi
          return {
               "success": True,
               "message": "Respons AI berhasil dibuat secara dinamis",
               "data": {
                    "user_id": payload.user_id,
                    "nama_user": nama,
                    "reply": respons_ai
               }
          }
          
     except Exception as e:
          raise HTTPException(status_code=500, detail=f"Gagal memproses AI: {str(e)}")