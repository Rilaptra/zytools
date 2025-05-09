// tools/summarize.js

/**
 * ZyTools - Summarize Text Tool
 *
 * This tool summarizes the selected text on the current page using the
 * Google Gemini API. It requires the user to have configured their
 * Gemini API key in ZyTools settings.
 */

async function run_summarize() {
    console.log("ZyTools: summarize.js - run_summarize() called");

    const ZYTOOLS_UI_PREFIX = 'zytools-summarize';

    // Helper function to show messages or results in a modal
    const showResultModal = (title, contentHTML, isError = false) => {
        // Remove existing modal if any
        const existingModal = document.getElementById(`${ZYTOOLS_UI_PREFIX}-modal`);
        if (existingModal) {
            existingModal.remove();
        }

        if (typeof window.createElement !== 'function' || typeof document.body.appendChild !== 'function') {
            // Fallback to alert if core UI functions are not available
            alert(`${title}\n\n${isError ? 'Error: ' : ''}${contentHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')}`);
            return null;
        }

        const modal = window.createElement('div', {
            id: `${ZYTOOLS_UI_PREFIX}-modal`,
            style: `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #fff;
                color: #333;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 6px 20px rgba(0,0,0,0.25);
                z-index: 2147483647;
                max-width: 90%;
                width: 500px; /* Max width */
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                border: 1px solid #ddd;
            `
        });

        const titleElement = window.createElement('h3', {
            textContent: title,
            style: `
                margin-top: 0;
                margin-bottom: 15px;
                color: ${isError ? '#d9534f' : '#007bff'};
                font-size: 1.2em;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
            `
        });

        const contentElement = window.createElement('div', {
            style: `
                margin-bottom: 20px;
                white-space: pre-wrap;
                word-wrap: break-word;
                overflow-y: auto;
                max-height: 60vh; /* Limit content height */
                font-size: 0.95em;
                line-height: 1.6;
            `
        });
        // Safely set HTML content if it's not an error message (which might be plain text)
        // For summaries, we expect text, so innerText is safer. If HTML is intended, use innerHTML.
        contentElement.innerText = contentHTML;


        const closeButton = window.createElement('button', {
            textContent: 'Tutup',
            style: `
                padding: 10px 18px;
                background-color: #6c757d;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                align-self: flex-end;
                font-size: 0.9em;
            `
        });
        closeButton.onclick = () => modal.remove();

        modal.appendChild(titleElement);
        modal.appendChild(contentElement);
        modal.appendChild(closeButton);
        document.body.appendChild(modal);
        
        // Call show from utils if available, otherwise assume it's visible
        if (typeof window.show === 'function') {
            window.show(modal);
        } else {
            modal.style.display = 'flex';
        }
        return modal;
    };

    // 1. Get selected text
    const selectedText = window.getSelection().toString().trim();
    if (!selectedText) {
        showResultModal("📝 Rangkum Teks", "Tidak ada teks yang dipilih. Silakan pilih teks pada halaman terlebih dahulu untuk diringkas.", true);
        return;
    }

    // 2. Check for GoogleGenerativeAI SDK
    if (typeof window.GoogleGenerativeAI === 'undefined') {
        showResultModal("📝 Rangkum Teks", "SDK Google Generative AI belum termuat. Ini diperlukan untuk fitur rangkuman. Pastikan koneksi internet Anda stabil dan coba muat ulang ZyTools.", true);
        console.error("ZyTools Summarize: GoogleGenerativeAI SDK not found.");
        return;
    }

    // 3. Get API Key (assuming utils.js functions are available)
    let apiKey;
    if (typeof window.getApiKey === 'function') {
        apiKey = window.getApiKey();
    } else {
        // Fallback, though core/script.js should ensure utils.js is loaded
        console.warn("ZyTools Summarize: getApiKey() function not found. Attempting direct localStorage access.");
        apiKey = localStorage.getItem('zytools_gemini_api_key');
    }

    if (!apiKey) {
        showResultModal("📝 Rangkum Teks", "API Key Gemini tidak ditemukan. Harap konfigurasikan API Key Anda melalui menu Pengaturan ZyTools untuk menggunakan fitur ini.", true);
        // Potentially, core/script.js could trigger the API key input UI here
        return;
    }

    // 4. Initialize Gemini API and make the call
    const loadingModal = showResultModal("📝 Rangkum Teks", "Sedang memproses permintaan rangkuman dengan Gemini...\nMohon tunggu sebentar.", false);

    try {
        const genAI = new window.GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash" }); // Using gemini-flash for speed and cost-effectiveness

        const prompt = `Anda adalah asisten AI yang sangat ahli dalam meringkas teks. Tugas Anda adalah untuk membaca teks yang diberikan dan membuat ringkasan yang singkat, padat, jelas, dan akurat.
Fokus pada poin-poin utama dan hilangkan detail yang tidak esensial.
Gunakan bahasa Indonesia yang baik dan benar.

Teks asli untuk diringkas:
---
${selectedText}
---

Ringkasan:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        if (loadingModal) loadingModal.remove(); // Remove loading modal
        showResultModal("📝 Hasil Rangkuman", summary);

    } catch (error) {
        if (loadingModal) loadingModal.remove(); // Remove loading modal on error too
        console.error("ZyTools Summarize: Error during Gemini API call:", error);
        let errorMessage = "Gagal mendapatkan rangkuman dari Gemini.";
        if (error.message) {
            if (error.message.includes("API key not valid") || error.message.includes("permission denied")) {
                errorMessage = "API Key Gemini tidak valid atau tidak memiliki izin. Mohon periksa kembali API Key Anda di Pengaturan ZyTools.";
            } else if (error.message.toLowerCase().includes("quota")) {
                errorMessage = "Kuota penggunaan API Gemini Anda mungkin telah terlampaui. Silakan periksa status kuota Anda di Google AI Studio.";
            } else if (error.message.includes("timed out") || error.message.includes("network error")) {
                errorMessage = "Permintaan ke Gemini API kehabisan waktu atau ada masalah jaringan. Coba lagi nanti.";
            } else {
                errorMessage += ` Detail: ${error.message}`;
            }
        }
        showResultModal("📝 Rangkum Teks - Error", errorMessage, true);
    }
}

// Expose the function to the global scope so core/script.js can call it
window.run_summarize = run_summarize;

// (Optional) init function if ZyTools requires it for setup specific to this tool
// function init_summarize() {
//     console.log("ZyTools: summarize.js initialized and ready.");
// }
// window.init_summarize = init_summarize;
