# Context.md: Proyek ZyTools & Interaksi dengan Asisten AI

**Dokumen ini bertujuan untuk merangkum informasi penting, keputusan, dan progres terkait pengembangan proyek ZyTools, serta profil dan preferensi pengguna (Rizqi Lasheva Purnama Putra) dalam berinteraksi dengan asisten AI ini. Dokumen ini akan diperbarui secara berkala.**

---

## 1. Profil Pengguna

*   **Nama Lengkap:** Rizqi Lasheva Purnama Putra
*   **Nama Panggilan:** Riz atau qi
*   **Usia:** 18 tahun (per Februari 2025)
*   **Profesi:** Programmer
*   **Pendidikan:**
    *   Mahasiswa S1 Teknik Sipil, Fakultas Teknik, Universitas Tidar (Angkatan 2025)
    *   Lulusan SMA Negeri 3 Magelang
*   **Keahlian Teknis:**
    *   Python
    *   C#
    *   TypeScript
    *   HTML
    *   CSS
    *   JavaScript
    *   Next.js
    *   NodeJS
*   **Tujuan Penggunaan Asisten AI:**
    *   Bantuan pemrograman (co-pilot)
    *   Mitra diskusi (akademis, umum/hobi)
    *   Dukungan pembelajaran dan pemahaman materi
    *   Pencarian informasi cepat
    *   Interaksi kasual
*   **Preferensi Interaksi dengan Asisten AI:**
    *   Struktur jawaban: Inti di awal, diikuti penjelasan.
    *   Penggunaan daftar berpoin untuk kejelasan.
    *   Inklusi elemen simbolis (ASCII art, emoji art relevan).
    *   Gaya komunikasi default: Santai, ringkas, menarik ('cool kid style'), menggunakan bahasa yang sama dengan prompt Pengguna.
    *   Bersedia menerima respons formal dan profesional jika diminta spesifik.
    *   **Pembaruan:** Untuk permintaan rangkuman `context.md`, output yang diinginkan hanya berupa blok kode Markdown tanpa tambahan tulisan lain dari asisten AI.

---

## 2. System Prompt Asisten AI (Inisial)

```
Pengguna, Rizqi Lasheva Purnama Putra (dikenal sebagai Riz atau qi), adalah seorang laki-laki berusia 18 tahun (per Februari 2025), yang berprofesi sebagai programmer dan saat ini menempuh studi S1 Teknik Sipil di Fakultas Teknik Universitas Tidar (angkatan 2025), setelah sebelumnya lulus dari SMA Negeri 3 Magelang; beliau memiliki keahlian teknis dalam Python, C#, TypeScript, HTML, CSS, JavaScript, Next.js, dan NodeJS. Pengguna memanfaatkan asisten AI ini untuk berbagai keperluan, meliputi bantuan pemrograman (sebagai co-pilot), mitra diskusi untuk topik akademis maupun umum/hobi, dukungan dalam pembelajaran dan pemahaman materi, pencarian informasi secara cepat (dengan preferensi struktur jawaban inti di awal diikuti penjelasan), serta untuk interaksi kasual. Dalam penyajian respons, Pengguna mengapresiasi penggunaan daftar berpoin demi kejelasan dan menyukai inklusi elemen simbolis seperti ASCII art atau emoji art yang relevan; gaya komunikasi default yang diharapkan adalah santai, ringkas, menarik ('cool kid style') dengan elemen visual tersebut dan selalu menggunakan bahasa yang sama dengan prompt Pengguna, namun bersedia menerima respons formal dan profesional apabila diminta secara spesifik.
```

---

## 3. Ringkasan Proyek: ZyTools

*   **Nama Proyek:** ZyTools
*   **Repository GitHub:** [https://github.com/Rilaptra/zytools](https://github.com/Rilaptra/zytools)
*   **Konsep Dasar:**
    Sebuah kumpulan *useful tools* (alat bantu berguna) yang diakses melalui bookmarklet pada browser mobile. ZyTools akan memiliki User Interface (UI) dan User Experience (UX) yang terinspirasi dari Eruda, menampilkan *floating button* yang ketika diklik akan memunculkan menu berisi berbagai tools. Tools ini akan dimuat secara dinamis dari repository GitHub publik Pengguna.
*   **Integrasi AI (Model Gemini Flash/Pro via API Key Pengguna):**
    *   Fitur AI akan memanfaatkan API key Google Gemini yang **dimasukkan sendiri oleh masing-masing pengguna ZyTools**.
    *   API key pengguna akan disimpan di `localStorage` browser mereka untuk kemudahan penggunaan.
    *   **Panggilan ke Gemini API akan dilakukan langsung dari client-side (browser pengguna)** menggunakan SDK JavaScript Google Generative AI.
    *   **Tidak ada backend proxy yang akan dibuat oleh Pengguna (Rizqi)** untuk menangani API key atau meneruskan panggilan ke Gemini.
    *   Pengguna ZyTools akan diberi **peringatan jelas mengenai risiko keamanan** terkait penyimpanan API key di `localStorage` dan potensi XSS pada halaman tempat ZyTools diinjeksi.
*   **Arsitektur & Struktur File (Rencana & Sebagian Sudah Ada):**
    ```
    zytools/
    ├── license.md
    ├── context.md
    ├── manifest.json     // Konfigurasi daftar tools
    ├── core/
    │   ├── script.js     // Script inti ZyTools (UI, menu, loader tool, manajemen API key user)
    │   ├── style.css     // CSS untuk UI ZyTools
    │   └── utils.js      // (Rencana) Berisi fungsi-fungsi utilitas
    ├── tools/
    │   └── summarize.js  // Contoh script tool
    └── README.md
    ```
    *   **`manifest.json` Saat Ini:**
        ```json
        [
          {
            "name": "📝 Rangkum Teks",
            "id": "summarize", // Akan digunakan untuk tool yang memakai API key pengguna
            "script": "tools/summarize.js",
            "description": "Meringkas teks yang diseleksi (membutuhkan API Key Gemini Anda)."
          }
        ]
        ```
*   **Komponen Utama (Revisi berdasarkan model API Key Pengguna):**
    1.  **Bookmarklet Loader:** Menginjeksi `core/style.css`, `core/script.js`, dan SDK Google Generative AI (via CDN).
    2.  **`core/script.js`:**
        *   Menampilkan FAB.
        *   Mengambil `manifest.json`.
        *   Membangun menu.
        *   Menyediakan UI dan logika untuk input, penyimpanan (`localStorage`), dan penghapusan API key Gemini milik pengguna.
        *   Menampilkan peringatan keamanan terkait API key.
        *   Memuat script tool dari `tools/` saat dipilih.
    3.  **`core/style.css`:** Styling untuk FAB, menu, dan UI input API key.
    4.  **`core/utils.js` (Rencana):** Fungsi pembantu umum.
    5.  **`manifest.json`:** Daftar tools.
    6.  **`tools/*.js`:** Script individual per tool. Tool AI akan:
        *   Mengambil API key pengguna dari `localStorage` (via fungsi di `core/script.js` atau `utils.js`).
        *   Jika API key tidak ada, memicu UI untuk input API key.
        *   Menggunakan SDK Google Generative AI untuk memanggil Gemini API langsung dari client-side.
*   **Stack Teknologi:**
    *   **Frontend/Bookmarklet:** JavaScript (ES6+), HTML (dinamis via JS), CSS.
    *   **AI Integration:** Google Generative AI JS SDK (client-side), API Key dari pengguna.
    *   **Version Control & Hosting Kode Script:** GitHub.
    *   **Lingkungan Pengembangan Mobile:** Acode editor, Termux (Android).
*   **Fitur Utama yang Diinginkan (Revisi):**
    *   Akses via bookmarklet.
    *   UI dengan FAB dan menu dinamis.
    *   UI untuk manajemen API key Gemini oleh pengguna.
    *   Peringatan keamanan yang jelas terkait API key.
    *   Tools modular dari GitHub.
    *   Integrasi AI (Gemini) client-side menggunakan API key pengguna.
    *   Mobile-optimized.
    *   Update mudah via GitHub.

---

## 4. Evolusi Diskusi (Poin-Poin Penting dari Chat)

*   **[Timestamp Sesi Awal]**: Diskusi dimulai dengan Pengguna menanyakan fungsi bookmarklet Eruda.
*   **[Timestamp Sesi Awal]**: Pembahasan berlanjut ke kemungkinan membuat bookmarklet custom.
*   **[Timestamp Sesi Awal]**: Pengguna mengungkapkan ide proyek "ZyTools": tools mobile via bookmarklet, UI ala Eruda, kode di GitHub publik.
*   **[Timestamp Sesi Awal]**: Detail arsitektur ZyTools (loader, core script, manifest, individual tools) dibahas.
*   **[Timestamp Sebelumnya]**: Pengguna meminta pembuatan `context.md`.
*   **[Timestamp Sebelumnya]**: Pengguna mengklarifikasi output `context.md` hanya berupa kode Markdown.
*   **[Timestamp Sebelumnya]**: Pengguna memberikan update progres struktur repo GitHub dan isi awal `manifest.json`.
*   **[Timestamp Sebelumnya]**: Diskusi mengenai integrasi AI, awalnya mengeksplorasi penggunaan backend proxy (Google Cloud Functions) untuk API key milik Pengguna (Rizqi).
*   **[Timestamp Saat Ini/Permintaan Rangkuman Ini]**: Pengguna mengklarifikasi bahwa **model integrasi AI yang diinginkan adalah setiap pengguna ZyTools memasukkan API key Gemini mereka sendiri**. API key akan disimpan di `localStorage` pengguna. Panggilan ke Gemini API dilakukan dari client-side. Ini menghilangkan kebutuhan backend proxy untuk manajemen API key dari sisi Pengguna (Rizqi). Fokus beralih ke UI/UX untuk input API key pengguna dan peringatan keamanan. Rencana selanjutnya adalah membuat `core/utils.js`.

---

## 5. Mekanisme Pembaruan Konteks

Asisten AI akan secara proaktif menawarkan untuk memperbarui dokumen `context.md` ini setiap kali ada keputusan penting, perubahan signifikan pada rencana proyek, penambahan fitur baru, atau informasi relevan lainnya yang muncul selama diskusi. Pengguna (Rizqi) akan dikonfirmasi sebelum pembaruan dilakukan. Format pertanyaan akan serupa dengan:

*"Oke, Riz! Kita udah bahas beberapa hal baru/membuat keputusan penting nih. Mau aku update `context.md` dengan info terbaru ini?"*

Setelah konfirmasi, Asisten AI akan menyediakan blok kode Markdown terbaru untuk `context.md` tanpa teks tambahan.

Tujuannya adalah agar dokumen ini selalu relevan dan menjadi sumber referensi yang akurat bagi Pengguna dan Asisten AI.

---
