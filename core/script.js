// core/script.js

(function() {
  // Pastikan utils.js sudah di-load
  if (typeof qs === 'undefined' || typeof createElement === 'undefined' ||
      typeof show === 'undefined' || typeof hide === 'undefined' ||
      typeof getApiKey === 'undefined' || typeof setApiKey === 'undefined' ||
      typeof removeApiKey === 'undefined' || typeof hasApiKey === 'undefined') {
    console.error('ZyTools Error: Fungsi dari utils.js tidak ditemukan atau belum ter-load.');
    alert('ZyTools Error: Gagal memuat komponen inti (utils). Coba muat ulang halaman.');
    return;
  }

  // Pengecekan SDK Google Generative AI (diasumsikan di-load oleh bookmarklet)
  if (typeof window.GoogleGenerativeAI === 'undefined') {
    console.warn('ZyTools Warning: SDK Google Generative AI (window.GoogleGenerativeAI) tidak ditemukan. Fitur AI mungkin tidak berfungsi. Pastikan SDK dimuat oleh bookmarklet loader.');
    // Tidak menghentikan ZyTools, tapi beri peringatan di console.
    // Pengguna akan mendapat alert lebih spesifik jika mencoba memakai tool AI.
  }

  const ZYTOOLS_FAB_ID = 'zytools-fab';
  const ZYTOOLS_MENU_ID = 'zytools-menu';
  const ZYTOOLS_API_KEY_MODAL_ID = 'zytools-api-key-modal';
  const GITHUB_USER_REPO = 'Rilaptra/zytools';
  const GITHUB_BRANCH = 'main';
  const GITHUB_RAW_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USER_REPO}/${GITHUB_BRANCH}/`;
  const MANIFEST_URL = `${GITHUB_RAW_BASE_URL}manifest.json`;

  let fabElement;
  let menuElement;
  let apiKeyModalElement;
  let toolsData = [];
  const loadedToolScripts = new Set();

  let fabIsDragging = false, fabIsMoved = false, fabStartX, fabStartY, fabInitialLeft, fabInitialTop;
  const fabDragThreshold = 10;

  let currentToolWaitingForApiKey = null;

  function toggleZyToolsMenu() {
    if (!menuElement) {
      console.error('ZyTools: Menu belum diinisialisasi.');
      return;
    }
    if (menuElement.style.display === 'none' || menuElement.style.display === '') {
      show(menuElement);
    } else {
      hide(menuElement);
    }
    console.log('ZyTools Menu Toggled.');
  }

  function showApiKeyModal(toolRequiringKey = null) {
    currentToolWaitingForApiKey = toolRequiringKey;

    if (!apiKeyModalElement) {
      apiKeyModalElement = createElement('div', { id: ZYTOOLS_API_KEY_MODAL_ID });
      Object.assign(apiKeyModalElement.style, {
        position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: '1000000' // Pastikan modal di atas segalanya
      });

      const modalContent = createElement('div', { style: 'background: white; padding: 20px; border-radius: 8px; width: 90%; max-width: 400px; box-shadow: 0 0 15px rgba(0,0,0,0.2);' });
      
      const title = createElement('h3', { style: 'margin-top: 0;'}, ['Masukkan API Key Gemini Anda']);
      const description = createElement('p', { style: 'font-size: 14px; margin-bottom: 10px;'}, [
          'Tool ini membutuhkan API Key Google AI Gemini untuk berfungsi. API Key Anda akan disimpan di localStorage browser ini saja.'
      ]);
      
      const warning = createElement('p', { style: 'font-size: 12px; color: #d9534f; background-color: #f2dede; border: 1px solid #ebccd1; padding: 8px; border-radius: 4px; margin-bottom: 15px;'}, [
          'PERINGATAN: Menyimpan API Key di localStorage memiliki risiko keamanan. Pastikan Anda memahami implikasinya, terutama jika Anda menggunakan ZyTools di halaman yang tidak Anda percayai sepenuhnya (risiko XSS).'
      ]);

      const input = createElement('input', { type: 'text', placeholder: 'Masukkan API Key Anda...', style: 'width: calc(100% - 22px); padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;' });
      const currentApiKeyDisplay = createElement('p', { style: 'font-size: 12px; word-break: break-all; margin-bottom: 15px;'}); // Added margin-bottom
      
      const updateApiKeyDisplay = () => {
          const existingKey = getApiKey();
          if (existingKey) {
              currentApiKeyDisplay.textContent = `API Key saat ini: ${existingKey.substring(0,5)}...${existingKey.substring(existingKey.length - 5)}`;
          } else {
              currentApiKeyDisplay.textContent = 'Belum ada API Key tersimpan.';
          }
      };
      updateApiKeyDisplay();

      const buttonContainer = createElement('div', { style: 'display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px;' }); // Flex container for buttons

      const saveButton = createElement('button', { style: 'padding: 10px 15px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; flex-grow: 1;'}, ['Simpan']); // flex-grow
      const cancelButton = createElement('button', { style: 'padding: 10px 15px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; flex-grow: 1;'}, ['Batal']); // flex-grow
      const removeButton = createElement('button', { style: 'padding: 10px 15px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%; margin-top: 10px;'}, ['Hapus Key Tersimpan']); // Full width for remove

      saveButton.onclick = () => {
        const newApiKey = input.value.trim();
        if (newApiKey) {
          setApiKey(newApiKey);
          alert('API Key berhasil disimpan!');
          updateApiKeyDisplay();
          input.value = '';
          hide(apiKeyModalElement);
          if (currentToolWaitingForApiKey) {
            console.log(`API Key disimpan, mencoba menjalankan tool: ${currentToolWaitingForApiKey.name}`);
            actuallyLoadAndRunTool(currentToolWaitingForApiKey);
            currentToolWaitingForApiKey = null;
          }
        } else {
          alert('API Key tidak boleh kosong.');
        }
      };

      cancelButton.onclick = () => {
        hide(apiKeyModalElement);
        currentToolWaitingForApiKey = null;
      };

      removeButton.onclick = () => {
        if (hasApiKey()) {
            if (confirm('Anda yakin ingin menghapus API Key yang tersimpan?')) {
                removeApiKey();
                alert('API Key berhasil dihapus.');
                updateApiKeyDisplay();
            }
        } else {
            alert('Tidak ada API Key yang tersimpan untuk dihapus.');
        }
      };
      
      buttonContainer.append(saveButton, cancelButton);
      modalContent.append(title, description, warning, input, currentApiKeyDisplay, buttonContainer, removeButton);
      apiKeyModalElement.appendChild(modalContent);
      document.body.appendChild(apiKeyModalElement);
    }
    show(apiKeyModalElement);
  }

  async function actuallyLoadAndRunTool(tool) {
    // Pengecekan SDK jika tool membutuhkan API Key (karena tool AI pasti butuh SDK)
    if (tool.requiresApiKey) {
        if (typeof window.GoogleGenerativeAI === 'undefined') {
            console.error(`ZyTools Error: SDK Google Generative AI tidak ditemukan saat mencoba menjalankan tool "${tool.name}".`);
            alert(`SDK Google Generative AI tidak termuat. Tool "${tool.name}" tidak dapat dijalankan. Pastikan SDK dimuat dengan benar oleh bookmarklet.`);
            return; // Hentikan pemuatan/penjalanan tool ini
        }
    }

    const scriptPath = tool.script;
    const scriptURL = `${GITHUB_RAW_BASE_URL}${scriptPath}`;
    const scriptId = `zytools-tool-${tool.id}`;

    if (loadedToolScripts.has(scriptId)) {
      console.log(`Tool script "${tool.name}" (${scriptId}) sudah dimuat. Mencoba menjalankan 'run' function.`);
      if (typeof window[`run_${tool.id}`] === 'function') {
        try { window[`run_${tool.id}`](); }
        catch (e) { console.error(`Error saat menjalankan kembali tool ${tool.name}:`, e); alert(`Error saat menjalankan kembali tool: ${tool.name}`); }
      } else {
        console.warn(`Tool ${tool.name} sudah dimuat, tapi tidak ada fungsi run_${tool.id} untuk dijalankan kembali.`);
      }
      return;
    }

    let scriptElement = qs(`#${scriptId}`);
    if (scriptElement) {
        console.warn(`Elemen script ${scriptId} sudah ada, menghapus dan membuat ulang.`);
        scriptElement.remove();
    }
    
    console.log(`Memuat tool: ${tool.name} dari ${scriptURL}`);
    scriptElement = createElement('script', { id: scriptId, src: scriptURL, type: 'text/javascript', async: true });

    scriptElement.onload = () => {
      console.log(`Tool script "${tool.name}" (${scriptId}) berhasil dimuat.`);
      loadedToolScripts.add(scriptId);
      if (typeof window[`init_${tool.id}`] === 'function') {
        console.log(`Menginisialisasi tool: ${tool.name}`);
        try { window[`init_${tool.id}`](); }
        catch (e) { console.error(`Error saat inisialisasi tool ${tool.name}:`, e); alert(`Error saat inisialisasi tool: ${tool.name}`); }
      } else {
        console.warn(`Tool ${tool.name} dimuat, tapi tidak ada fungsi init_${tool.id} ditemukan.`);
      }
    };
    scriptElement.onerror = (event) => { // Added event parameter for more details if needed
      console.error(`Gagal memuat tool script "${tool.name}" (${scriptId}) dari ${scriptURL}. Event:`, event);
      alert(`Gagal memuat tool: ${tool.name}. Cek console untuk detail.`);
      qs(`#${scriptId}`)?.remove(); // Hapus script yang gagal agar bisa dicoba lagi
    };
    document.head.appendChild(scriptElement);
  }
  
  async function loadToolScript(tool) {
    console.log(`Mencoba memuat tool: ${tool.name}, requiresApiKey: ${!!tool.requiresApiKey}`);
    if (tool.requiresApiKey && !hasApiKey()) {
      console.log(`Tool "${tool.name}" membutuhkan API Key. Menampilkan modal.`);
      showApiKeyModal(tool);
    } else {
      // Jika tidak butuh API Key, atau API Key sudah ada
      // Pengecekan SDK akan dilakukan di dalam actuallyLoadAndRunTool jika tool.requiresApiKey true
      actuallyLoadAndRunTool(tool);
    }
  }

  function createMenu() {
    if (qs(`#${ZYTOOLS_MENU_ID}`)) {
      menuElement = qs(`#${ZYTOOLS_MENU_ID}`);
      menuElement.innerHTML = ''; 
    } else {
      menuElement = createElement('div', { id: ZYTOOLS_MENU_ID });
      document.body.appendChild(menuElement);
    }
    Object.assign(menuElement.style, {
      position: 'fixed', bottom: '80px', right: '20px', width: '250px', maxHeight: '70vh',
      overflowY: 'auto', backgroundColor: 'white', borderRadius: '8px',
      boxShadow: '0 6px 12px rgba(0,0,0,0.15)', zIndex: '999998', padding: '10px', display: 'none'
    });
    if (toolsData.length === 0) {
      menuElement.appendChild(createElement('p', { style: 'color: #555; text-align: center;' }, ['Tidak ada tools yang tersedia atau gagal dimuat.']));
    } else {
      const toolList = createElement('ul', { style: 'list-style: none; padding: 0; margin: 0;' });
      toolsData.forEach(tool => {
        const listItem = createElement('li', { style: 'margin-bottom: 8px;' });
        const toolButton = createElement('button', {
          'data-tool-id': tool.id,
          style: 'width: 100%; padding: 10px; text-align: left; background-color: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 14px;'
        });
        const toolNameText = tool.requiresApiKey ? `🔑 ${tool.name}` : tool.name;
        toolButton.textContent = toolNameText;
        if (tool.description) toolButton.setAttribute('title', tool.description);
        toolButton.addEventListener('click', () => {
          console.log(`Tombol tool "${tool.name}" diklik.`);
          hide(menuElement);
          loadToolScript(tool);
        });
        toolButton.onmouseover = () => toolButton.style.backgroundColor = '#e0e0e0';
        toolButton.onmouseout = () => toolButton.style.backgroundColor = '#f0f0f0';
        listItem.appendChild(toolButton);
        toolList.appendChild(listItem);
      });
      menuElement.appendChild(toolList);
    }
    const manageApiKeyButton = createElement('button', {
        style: 'width: 100%; padding: 10px; text-align: left; background-color: #e9ecef; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 14px; margin-top: 10px;'
    }, ['🔑 Kelola API Key']);
    manageApiKeyButton.onclick = () => { hide(menuElement); showApiKeyModal(); };
    menuElement.appendChild(manageApiKeyButton);
    console.log('ZyTools Menu berhasil dibuat/diperbarui.');
  }

  async function loadManifestAndCreateMenu() {
    try {
      const response = await fetch(MANIFEST_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Gagal memuat manifest: ${response.status} ${response.statusText}`);
      toolsData = await response.json();
      console.log('Manifest berhasil dimuat:', toolsData);
    } catch (error) {
      console.error('ZyTools Error saat memuat manifest:', error);
      toolsData = [];
      alert('ZyTools: Gagal memuat daftar tools dari server. Beberapa fungsionalitas mungkin tidak tersedia.');
    }
    createMenu();
  }

  function handleFabTouchStart(event) { if (event.touches.length !== 1) return; fabIsMoved = false; fabIsDragging = false; const touch = event.touches[0]; fabStartX = touch.clientX; fabStartY = touch.clientY; const rect = fabElement.getBoundingClientRect(); fabInitialLeft = rect.left; fabInitialTop = rect.top; }
  function handleFabTouchMove(event) { if (event.touches.length !== 1) return; const touch = event.touches[0]; const deltaX = touch.clientX - fabStartX; const deltaY = touch.clientY - fabStartY; if (!fabIsMoved && (Math.abs(deltaX) > fabDragThreshold || Math.abs(deltaY) > fabDragThreshold)) { fabIsMoved = true; fabIsDragging = true; } if (fabIsDragging) { event.preventDefault(); let newLeft = fabInitialLeft + deltaX; let newTop = fabInitialTop + deltaY; const fabWidth = fabElement.offsetWidth; const fabHeight = fabElement.offsetHeight; const viewportWidth = window.innerWidth; const viewportHeight = window.innerHeight; newLeft = Math.max(0, Math.min(newLeft, viewportWidth - fabWidth)); newTop = Math.max(0, Math.min(newTop, viewportHeight - fabHeight)); fabElement.style.left = newLeft + 'px'; fabElement.style.top = newTop + 'px'; fabElement.style.right = 'auto'; fabElement.style.bottom = 'auto'; } }
  function handleFabTouchEnd(event) { if (typeof fabStartX === 'undefined') return; if (!fabIsMoved) { toggleZyToolsMenu(); } if (fabIsDragging) { /* localStorage.setItem('zytools_fab_pos', JSON.stringify({left: fabElement.style.left, top: fabElement.style.top})); */ } fabIsDragging = false; fabIsMoved = false; fabStartX = undefined; fabStartY = undefined; }
  function handleFabClick(event) { if (typeof fabStartX !== 'undefined') return; toggleZyToolsMenu(); }
  function createFab() { if (qs(`#${ZYTOOLS_FAB_ID}`)) { fabElement = qs(`#${ZYTOOLS_FAB_ID}`); console.warn('ZyTools FAB sudah ada, menggunakan yang sudah ada.'); return; } fabElement = createElement('div', { id: ZYTOOLS_FAB_ID, role: 'button', tabindex: '0', 'aria-label': 'Buka Menu ZyTools' }); fabElement.textContent = 'ZT'; Object.assign(fabElement.style, { position: 'fixed', bottom: '20px', right: '20px', width: '50px', height: '50px', backgroundColor: '#007bff', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', zIndex: '999999', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', userSelect: 'none', touchAction: 'none' }); fabElement.addEventListener('touchstart', handleFabTouchStart, { passive: false }); fabElement.addEventListener('touchmove', handleFabTouchMove, { passive: false }); fabElement.addEventListener('touchend', handleFabTouchEnd); fabElement.addEventListener('click', handleFabClick); document.body.appendChild(fabElement); console.log('ZyTools FAB berhasil dibuat dan ditambahkan!'); }

  function init() {
    console.log('ZyTools Inisialisasi...');
    createFab();
    loadManifestAndCreateMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 0);
  }
})();
