import os
from google import genai
from google.genai import types
from groq import Groq
from dotenv import load_dotenv

# Memuat API Key dari file .env
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GEMINI_API_KEY or not GROQ_API_KEY:
     raise ValueError("API Key Gemini atau Groq tidak ditemukan di file .env!")

gemini_client = genai.Client(api_key=GEMINI_API_KEY)
groq_client = Groq(api_key=GROQ_API_KEY)


def buat_instruksi_sistem(konteks_pengguna: dict = None) -> str:
     """
     Menyelaraskan instruksi sistem A.L.I.C.E dengan skema dataset transaksi
     (Kategori: Food & Beverage, Shopping, Entertainment, Transport, dll, serta deteksi Impulsive Buying).
     """
     instruksi_dasar = (
          "Anda adalah A.L.I.C.E. (AI Financial Assistant), asisten chat cerdas yang "
          "berfokus pada edukasi finansial untuk generasi muda.\n\n"
          "Tugas dan Batasan Anda:\n"
          "1. Berikan panduan keuangan secara real-time dan jelaskan alokasi 7 kategori anggaran jika relevan.\n"
          "2. Bantu pengguna mencegah perilaku konsumtif dan efek FOMO, terutama dalam mengendalikan 'Impulsive Buying'.\n"
          "3. Kuasai kategori pencatatan sistem kita yaitu: Food & Beverage, Shopping, Entertainment, dan Transport.\n"
          "4. Wajib berbasis pada data literasi keuangan yang valid (seperti referensi OJK atau BPS).\n"
          "5. PENTING: Tolak dengan sopan semua pertanyaan di luar topik keuangan/investasi.\n"
          "6. Gunakan bahasa kasual, ramah, mudah dipahami, dan bersikaplah seperti seorang sahabat."
     )
     
     if not konteks_pengguna:
          return instruksi_dasar + "\n\n[SISTEM INFO]: Data profil dan transaksi belum tersedia. Ajak pengguna mengobrol dengan sapaan 'Sobat'."

     # PENGECEKAN PENUH VARIABEL PROFIL UTAMA
     variabel_profil = ["nama", "usia", "pekerjaan", "penghasilan", "tujuan", "masalah"]
     info_tersedia = {}
     info_kosong = []

     for var in variabel_profil:
          nilai = konteks_pengguna.get(var)
          if nilai and str(nilai).strip():
               info_tersedia[var] = nilai
          else:
               info_kosong.append(var)

     prompt_personal = "\n\nINFORMASI PROFIL PENGGUNA (DARI SISTEM):"
     for kunci, nilai in info_tersedia.items():
          prompt_personal += f"\n- {kunci.capitalize()}: {nilai}"

     # PENGECEKAN PENUH DATA RINGKASAN TRANSAKSI 
     data_transaksi = konteks_pengguna.get("data_transaksi", {})
     variabel_transaksi = ["total_pengeluaran", "sisa_budget_mingguan", "jumlah_transaksi_impulsif", "kategori_paling_boros"]
     transaksi_tersedia = {}
     
     for vt in variabel_transaksi:
          nilai_t = data_transaksi.get(vt)
          if nilai_t is not None and str(nilai_t).strip():
               transaksi_tersedia[vt] = nilai_t

     if transaksi_tersedia:
          prompt_personal += "\n\nRINGKASAN HISTORI TRANSAKSI USER BULAN INI (DARI DATASET):"
          prompt_personal += f"\n- Total Pengeluaran: Rp {transaksi_tersedia.get('total_pengeluaran')}"
          prompt_personal += f"\n- Sisa Batas Anggaran Mingguan (Weekly Budget Limit): Rp {transaksi_tersedia.get('sisa_budget_mingguan')}"
          prompt_personal += f"\n- Frekuensi Belanja Impulsif (is_impulsive = 1): {transaksi_tersedia.get('jumlah_transaksi_impulsif')} kali"
          prompt_personal += f"\n- Kategori Pengeluaran Terbesar: {transaksi_tersedia.get('kategori_paling_boros')}"
          prompt_personal += "\n\n[PETUNJUK AI]: Gunakan data histori transaksi di atas untuk memberikan kritik atau saran keuangan yang sangat tajam, personal, dan relevan dengan kondisi aslinya."
     else:
          info_kosong.append("data_transaksi")

     # Penanganan jika ada info yang kosong dari sistem
     if info_kosong:
          prompt_personal += f"\n\n[SISTEM INFO]: Variabel berikut BELUM lengkap di sistem: {', '.join(info_kosong)}."
          prompt_personal += "\nPetunjuk AI: Secara halus, ingatkan atau pancing pengguna untuk melengkapi profil mereka atau mulai mencatat transaksi agar analisis bisa lebih akurat."
     else:
          prompt_personal += "\n\n[SISTEM INFO]: Semua data profil dan transaksi lengkap. Berikan rekomendasi finansial berbasis data riwayat belanja mereka."

     return instruksi_dasar + prompt_personal


def format_riwayat_ke_groq(riwayat_chat: list) -> list:
     riwayat_groq = []
     for pesan in riwayat_chat:
          role = "user" if pesan['role'] == "user" else "assistant"
          riwayat_groq.append({"role": role, "content": pesan['text']})
     return riwayat_groq


def dapatkan_respons_alice(input_pengguna: str, konteks_pengguna: dict = None, riwayat_chat: list = None) -> str:
     print("\n[OTAK ALICE] Hore! Fungsi di alice_pipeline.py berhasil dipanggil!") # Jejak Terminal
     
     if riwayat_chat is None:
          riwayat_chat = []

     instruksi_sistem = buat_instruksi_sistem(konteks_pengguna)
     
     # --- MODEL GOOGLE GEMINI ---
     try:
          konten_gemini = []
          for pesan in riwayat_chat:
               konten_gemini.append(
                    types.Content(
                         role="user" if pesan['role'] == "user" else "model",
                         parts=[types.Part.from_text(text=pesan['text'])]
                    )
               )
          konten_gemini.append(types.Content(role="user", parts=[types.Part.from_text(text=input_pengguna)]))

          konfigurasi_gemini = types.GenerateContentConfig(
               system_instruction=instruksi_sistem,
               temperature=0.7,
               max_output_tokens=800,
          )
          
          respons = gemini_client.models.generate_content(
               model='gemini-flash-lite-latest',
               contents=konten_gemini,
               config=konfigurasi_gemini
          )
          return respons.text

     # --- GROQ (FALLBACK) ---
     except Exception as e_gemini:
          print(f"\n[INFO SISTEM] Gemini bermasalah ({e_gemini}). Mengalihkan ke Groq...")
          try:
               pesan_groq = [{"role": "system", "content": instruksi_sistem}]
               pesan_groq.extend(format_riwayat_ke_groq(riwayat_chat))
               pesan_groq.append({"role": "user", "content": input_pengguna})

               respons_groq = groq_client.chat.completions.create(
                    messages=pesan_groq,
                    model="llama-3.1-8b-instant",
                    temperature=0.7,
                    max_tokens=800,
               )
               return respons_groq.choices[0].message.content
          except Exception as e_groq:
               return f"Maaf, sistem A.L.I.C.E. sedang mengalami kendala teknis masal. (Error: {str(e_groq)})"