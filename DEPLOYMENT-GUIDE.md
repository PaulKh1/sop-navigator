<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SOP Навігатор - ДЗМК</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            background-color: #f9fafb;
            color: #111827;
        }

        .container {
            display: flex;
            height: 100vh;
            overflow: hidden;
        }

        /* Sidebar */
        .sidebar {
            width: 288px;
            background-color: #ffffff;
            border-right: 1px solid #e5e7eb;
            display: flex;
            flex-direction: column;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .sidebar-header {
            padding: 24px;
            border-bottom: 1px solid #e5e7eb;
        }

        .sidebar-header h1 {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 8px;
        }

        .sidebar-header p {
            font-size: 12px;
            color: #6b7280;
        }

        .sidebar-content {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
        }

        .category-btn {
            width: 100%;
            text-align: left;
            padding: 12px 16px;
            margin-bottom: 8px;
            border: 1px solid transparent;
            border-radius: 8px;
            background-color: transparent;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 14px;
            color: #374151;
        }

        .category-btn:hover {
            background-color: #f3f4f6;
        }

        .category-btn.active {
            background-color: #eff6ff;
            color: #1e40af;
            border-color: #bfdbfe;
        }

        .category-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .category-icon {
            width: 18px;
            height: 18px;
            flex-shrink: 0;
        }

        .category-name {
            flex: 1;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .category-badge {
            font-size: 11px;
            background-color: #d1d5db;
            padding: 2px 8px;
            border-radius: 4px;
            white-space: nowrap;
            flex-shrink: 0;
        }

        .category-btn.active .category-badge {
            background-color: #93c5fd;
            color: #1e40af;
        }

        .sidebar-loader {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 32px 16px;
            color: #9ca3af;
        }

        .spinner {
            width: 24px;
            height: 24px;
            border: 3px solid #e5e7eb;
            border-top-color: #9ca3af;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Main Content */
        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            background-color: #f9fafb;
        }

        .search-section {
            background-color: #ffffff;
            border-bottom: 1px solid #e5e7eb;
            padding: 24px;
        }

        .search-box {
            position: relative;
            max-width: 512px;
        }

        .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            color: #9ca3af;
            pointer-events: none;
        }

        .search-input {
            width: 100%;
            padding-left: 40px;
            padding-right: 16px;
            padding-top: 8px;
            padding-bottom: 8px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.2s;
        }

        .search-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* Files Container */
        .files-container {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
        }

        .files-grid {
            display: grid;
            gap: 16px;
        }

        .file-card {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            text-decoration: none;
            color: inherit;
            transition: all 0.2s;
            display: flex;
            gap: 16px;
            align-items: flex-start;
            cursor: pointer;
        }

        .file-card:hover {
            border-color: #3b82f6;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
        }

        .file-icon {
            width: 24px;
            height: 24px;
            flex-shrink: 0;
            color: #3b82f6;
            margin-top: 2px;
        }

        .file-content {
            flex: 1;
            min-width: 0;
        }

        .file-name {
            font-weight: 600;
            color: #111827;
            margin-bottom: 4px;
            word-break: break-word;
        }

        .file-card:hover .file-name {
            color: #2563eb;
        }

        .file-folder {
            font-size: 12px;
            color: #6b7280;
        }

        .file-link-icon {
            width: 18px;
            height: 18px;
            flex-shrink: 0;
            color: #9ca3af;
            margin-top: 3px;
        }

        .file-card:hover .file-link-icon {
            color: #3b82f6;
        }

        /* Empty State */
        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            text-align: center;
            color: #6b7280;
        }

        .empty-icon {
            width: 48px;
            height: 48px;
            margin-bottom: 16px;
            color: #d1d5db;
        }

        .empty-state p {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 8px;
        }

        .empty-state span {
            font-size: 14px;
            color: #9ca3af;
        }

        /* Error State */
        .error-box {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 16px;
            color: #b91c1c;
            margin: 24px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }

        .error-icon {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
            margin-top: 2px;
        }

        .error-details {
            font-size: 13px;
            margin-top: 8px;
            opacity: 0.8;
        }

        /* Footer */
        .footer {
            background-color: #ffffff;
            border-top: 1px solid #e5e7eb;
            padding: 12px 24px;
            font-size: 12px;
            color: #6b7280;
            text-align: right;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: transparent;
        }

        ::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
        }

        svg {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="sidebar-header">
                <h1>СОП Навігатор</h1>
                <p>Категорії документів</p>
            </div>
            <div class="sidebar-content" id="categoriesContainer">
                <div class="sidebar-loader">
                    <div class="spinner"></div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Search -->
            <div class="search-section">
                <div class="search-box">
                    <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <input 
                        type="text" 
                        class="search-input" 
                        id="searchInput" 
                        placeholder="Пошук СОПів за назвою..."
                        disabled
                    >
                </div>
            </div>

            <!-- Files -->
            <div class="files-container" id="filesContainer">
                <div class="empty-state">
                    <div class="spinner empty-icon"></div>
                    <p>Завантаження структури папок...</p>
                </div>
            </div>

            <!-- Footer -->
            <div class="footer" id="footerStats"></div>
        </div>
    </div>

    <script>
        // Configuration
        const FOLDER_ID = '1z37M1cgaYuayt9F48pNoDqhDIQbPd7Ib';
        const API_ENDPOINT = '/api/sop-proxy'; // Vercel will handle this

        // State
        let allFolders = [];
        let selectedFolder = null;

        // DOM Elements
        const categoriesContainer = document.getElementById('categoriesContainer');
        const filesContainer = document.getElementById('filesContainer');
        const searchInput = document.getElementById('searchInput');
        const footerStats = document.getElementById('footerStats');

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            fetchFolderStructure();
            searchInput.addEventListener('input', renderFiles);
        });

        async function fetchFolderStructure() {
            try {
                const response = await fetch(API_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        folderId: FOLDER_ID,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP ${response.status}`);
                }

                const data = await response.json();
                allFolders = data.folders || [];
                
                searchInput.disabled = false;
                renderCategories();
                renderFiles();
            } catch (error) {
                console.error('Error:', error);
                showError(`Помилка: ${error.message}`);
            }
        }

        function renderCategories() {
            categoriesContainer.innerHTML = '';

            // All SOPs button
            const allBtn = createCategoryButton(
                null,
                'Всі СОПи',
                allFolders.reduce((sum, f) => sum + (f.files?.length || 0), 0)
            );
            categoriesContainer.appendChild(allBtn);

            // Folder buttons
            allFolders.forEach(folder => {
                const btn = createCategoryButton(
                    folder.id,
                    folder.name,
                    folder.files?.length || 0
                );
                categoriesContainer.appendChild(btn);
            });
        }

        function createCategoryButton(folderId, name, fileCount) {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            if (selectedFolder === folderId) {
                btn.classList.add('active');
            }

            btn.innerHTML = `
                <div class="category-content">
                    <svg class="category-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                    </svg>
                    <span class="category-name">${escapeHtml(name)}</span>
                    <span class="category-badge">${fileCount}</span>
                </div>
            `;

            btn.addEventListener('click', () => {
                selectedFolder = folderId;
                renderCategories();
                renderFiles();
            });

            return btn;
        }

        function renderFiles() {
            const searchQuery = searchInput.value.toLowerCase();
            let files = [];

            if (selectedFolder === null) {
                // All files
                files = allFolders.flatMap(folder => 
                    (folder.files || []).map(file => ({
                        ...file,
                        folderName: folder.name
                    }))
                );
            } else {
                // Files from selected folder
                const folder = allFolders.find(f => f.id === selectedFolder);
                files = (folder?.files || []).map(file => ({
                    ...file,
                    folderName: folder.name
                }));
            }

            // Filter by search
            const filtered = files.filter(file =>
                file.name.toLowerCase().includes(searchQuery)
            );

            // Render
            if (filtered.length === 0) {
                filesContainer.innerHTML = `
                    <div class="empty-state">
                        <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p>СОПи не знайдені</p>
                        <span>${searchQuery ? 'Спробуйте змінити критерії пошуку' : 'Виберіть категорію'}</span>
                    </div>
                `;
            } else {
                filesContainer.innerHTML = `<div class="files-grid">${filtered.map(file => `
                    <a href="${escapeHtml(file.url)}" target="_blank" rel="noopener noreferrer" class="file-card">
                        <svg class="file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <div class="file-content">
                            <div class="file-name">${escapeHtml(file.name)}</div>
                            <div class="file-folder">${escapeHtml(file.folderName)}</div>
                        </div>
                        <svg class="file-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                    </a>
                `).join('')}</div>`;
            }

            // Update footer
            const totalFiles = allFolders.reduce((sum, f) => sum + (f.files?.length || 0), 0);
            footerStats.textContent = `Показано ${filtered.length} з ${totalFiles} документів`;
        }

        function showError(message) {
            filesContainer.innerHTML = `
                <div class="error-box">
                    <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                    </svg>
                    <div>
                        <div>${message}</div>
                        <div class="error-details">Перевірте наявність API ключа на Vercel та з'єднання з інтернетом</div>
                    </div>
                </div>
            `;
        }

        function escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return String(text).replace(/[&<>"']/g, m => map[m]);
        }
    </script>
</body>
</html>