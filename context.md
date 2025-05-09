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
    *   **Pembaruan (dari chat terakhir):** Untuk permintaan rangkuman `context.md`, output yang diinginkan hanya berupa blok kode Markdown tanpa tambahan tulisan lain dari asisten AI.

---

## 2. System Prompt Asisten AI (Inisial)

```
Pengguna, Rizqi Lasheva Purnama Putra (dikenal sebagai Riz atau qi), adalah seorang laki-laki berusia 18 tahun (per Februari 2025), yang berprofesi sebagai programmer dan saat ini menempuh studi S1 Teknik Sipil di Fakultas Teknik Universitas Tidar (angkatan 2025), setelah sebelumnya lulus dari SMA Negeri 3 Magelang; beliau memiliki keahlian teknis dalam Python, C#, TypeScript, HTML, CSS, JavaScript, Next.js, dan NodeJS. Pengguna memanfaatkan asisten AI ini untuk berbagai keperluan, meliputi bantuan pemrograman (sebagai co-pilot), mitra diskusi untuk topik akademis maupun umum/hobi, dukungan dalam pembelajaran dan pemahaman materi, pencarian informasi secara cepat (dengan preferensi struktur jawaban inti di awal diikuti penjelasan), serta untuk interaksi kasual. Dalam penyajian respons, Pengguna mengapresiasi penggunaan daftar berpoin demi kejelasan dan menyukai inklusi elemen simbolis seperti ASCII art atau emoji art yang relevan; gaya komunikasi default yang diharapkan adalah santai, ringkas, menarik ('cool kid style') dengan elemen visual tersebut dan selalu menggunakan bahasa yang sama dengan prompt Pengguna, namun bersedia menerima respons formal dan profesional apabila diminta secara spesifik.
```

---

## 3. Ringkasan Proyek: ZyTools

*   **Nama Proyek:** ZyTools
*   **Konsep Dasar:**
    Sebuah kumpulan *useful tools* (alat bantu berguna) yang diakses melalui bookmarklet pada browser mobile. ZyTools akan memiliki User Interface (UI) dan User Experience (UX) yang terinspirasi dari Eruda, menampilkan *floating button* yang ketika diklik akan memunculkan menu berisi berbagai tools. Tools ini akan dimuat secara dinamis dari sebuah repository GitHub publik milik Pengguna. Beberapa tools direncanakan akan terintegrasi dengan Gemini Flash API (atau model AI lain yang gratis/memiliki free tier) melalui sebuah backend proxy untuk menjaga keamanan API key. Fokus utama pengembangan adalah untuk penggunaan di perangkat mobile (*mobile-only*).
*   **Arsitektur Umum:**
    1.  **Bookmarklet Loader:** Kode JavaScript singkat yang disimpan sebagai bookmark. Bertugas untuk menginjeksi CSS dasar dan script inti ZyTools ke halaman web yang sedang dibuka.
    2.  **Script Inti ZyTools (`zytools-core.js`):** Di-hosting di GitHub. Bertugas untuk:
        *   Menampilkan *Floating Action Button* (FAB).
        *   Ketika FAB diklik, mengambil `manifest.json` dari GitHub.
        *   Membangun dan menampilkan UI menu berdasarkan `manifest.json`.
        *   Ketika sebuah tool dari menu dipilih, memuat dan mengeksekusi script spesifik untuk tool tersebut dari GitHub.
    3.  **Styling ZyTools (`zytools-style.css`):** Di-hosting di GitHub. Berisi CSS untuk FAB, menu, dan elemen UI ZyTools lainnya.
    4.  **Manifest File (`manifest.json`):** Di-hosting di GitHub. Berisi daftar tools yang tersedia, meliputi nama tool, deskripsi, dan path ke script tool-nya di GitHub.
    5.  **Script Tool Individual (`tools/*.js`):** Kumpulan file JavaScript terpisah, masing-masing untuk satu fungsi/tool spesifik, di-hosting di GitHub.
    6.  **Backend Proxy:** Sebuah layanan backend (misalnya, Serverless Function) yang bertindak sebagai perantara aman antara script tool ZyTools (yang berjalan di browser klien) dan Gemini API. API key Gemini akan disimpan dengan aman di backend ini.
*   **Stack Teknologi yang Dibahas/Direncanakan:**
    *   **Frontend/Bookmarklet:** JavaScript (ES6+), HTML (dinamis via JS), CSS.
    *   **Backend Proxy:** Serverless Functions (Vercel Functions, Netlify Functions, Google Cloud Functions, AWS Lambda, Cloudflare Workers) atau PaaS dengan free tier (Render, Railway.app). Bahasa potensial: Node.js, Python.
    *   **AI Integration:** Gemini Flash API (atau alternatif dengan free tier).
    *   **Version Control & Hosting Kode Script:** GitHub (repository publik).
    *   **Lingkungan Pengembangan Mobile:**
        *   Editor Teks: Acode editor (Android), Spck Editor (Android/iOS via web).
        *   Terminal & Runtime: Termux (Android) untuk Git, Node.js, Python, dll.
*   **Fitur Utama yang Diinginkan:**
    *   Aksesibilitas via bookmarklet tunggal.
    *   UI non-intrusif dengan FAB dan menu pop-up/slide-in.
    *   Daftar tools yang dinamis, dimuat dari `manifest.json` di GitHub.
    *   Pemuatan modular untuk script setiap tool dari GitHub.
    *   Integrasi AI (Gemini) untuk fungsionalitas tertentu, dengan keamanan API key terjaga.
    *   Desain dan fungsionalitas yang dioptimalkan untuk browser mobile.
    *   Kemudahan update tools dengan hanya mengubah kode di repository GitHub.
*   **Contoh Ide Tools untuk ZyTools:**
    *   Quick Summary: Meringkas teks yang diseleksi.
    *   Explain This: Menjelaskan istilah atau kalimat yang diseleksi.
    *   Draft Reply: Membantu membuat draf balasan email/chat.
    *   Brainstorm Ideas: Memberikan ide berdasarkan input topik.
    *   Code Formatter (potensial): Merapikan format kode.
*   **Workflow Pengembangan (Mobile):**
    *   Penulisan dan pengujian kode (HTML, CSS, JS, backend) dilakukan di perangkat mobile menggunakan Acode dan Termux.
    *   Manajemen versi dan kolaborasi kode menggunakan Git (via Termux) dengan GitHub.
    *   Deployment backend (jika menggunakan serverless/PaaS) di-trigger dari push ke GitHub.

---

## 4. Evolusi Diskusi (Poin-Poin Penting dari Chat)

*   **[Timestamp Sesi Awal]**: Diskusi dimulai dengan Pengguna menanyakan fungsi sebuah kode JavaScript (bookmarklet Eruda).
*   **[Timestamp Sesi Awal]**: Pembahasan berlanjut ke kemungkinan membuat bookmarklet custom sendiri.
*   **[Timestamp Sesi Awal]**: Pengguna mengungkapkan ide untuk mengembangkan "useful tools" yang terintegrasi dengan AI (Gemini Flash), dinamai "ZyTools". Fokus pada penggunaan mobile, kode di GitHub publik, dan UI/UX mirip Eruda.
*   **[Timestamp Sesi Awal]**: Detail arsitektur ZyTools dibahas, termasuk penggunaan bookmarklet loader, script inti, `manifest.json` untuk daftar tools dinamis, script tool individual, dan pentingnya backend proxy untuk keamanan API key Gemini.
*   **[Timestamp Sesi Sebelumnya]**: Pengguna meminta pembuatan `context.md` untuk merangkum diskusi dan menyetujui mekanisme pembaruan konteks oleh Asisten AI.
*   **[Timestamp Saat Ini/Permintaan Rangkuman Ini]**: Pengguna mengklarifikasi bahwa output untuk `context.md` hanya berupa kode Markdown tanpa teks tambahan. Poin ini dicatat dalam "Preferensi Interaksi" di atas.

---

## 5. Mekanisme Pembaruan Konteks

Asisten AI akan secara proaktif menawarkan untuk memperbarui dokumen `context.md` ini setiap kali ada keputusan penting, perubahan signifikan pada rencana proyek, penambahan fitur baru, atau informasi relevan lainnya yang muncul selama diskusi. Pengguna (Rizqi) akan dikonfirmasi sebelum pembaruan dilakukan. Format pertanyaan akan serupa dengan:

*"Oke, Riz! Kita udah bahas beberapa hal baru/membuat keputusan penting nih. Mau aku update `context.md` dengan info terbaru ini?"*

Setelah konfirmasi, Asisten AI akan menyediakan blok kode Markdown terbaru untuk `context.md` tanpa teks tambahan.

Tujuannya adalah agar dokumen ini selalu relevan dan menjadi sumber referensi yang akurat bagi Pengguna dan Asisten AI.

---
