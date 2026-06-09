// api/sop-proxy.js
// Vercel Serverless Function that reads a public Google Drive folder.

const DRIVE_API = 'https://www.googleapis.com/drive/v3/files';
const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { folderId } = req.body || {};
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!folderId) {
      return res.status(400).json({ error: 'folderId is required' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'GOOGLE_API_KEY is not configured' });
    }

    const folders = await listChildren(folderId, apiKey, FOLDER_MIME_TYPE);
    const results = [];
    let totalFiles = 0;

    for (const folder of folders) {
      const files = await listFilesRecursive(folder.id, apiKey);
      const visibleFiles = files
        .map((file) => ({
          id: file.id,
          name: file.path ? `${file.path} / ${file.name}` : file.name,
          url: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
        }));

      totalFiles += visibleFiles.length;
      results.push({
        id: folder.id,
        name: folder.name,
        files: visibleFiles,
      });
    }

    return res.status(200).json({
      folders: results,
      totalFiles,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
}

async function listChildren(parentId, apiKey, mimeType) {
  const queryParts = [`'${parentId}' in parents`, 'trashed = false'];
  if (mimeType) {
    queryParts.push(`mimeType = '${mimeType}'`);
  }

  const params = new URLSearchParams({
    key: apiKey,
    q: queryParts.join(' and '),
    fields: 'files(id,name,mimeType,webViewLink)',
    pageSize: '1000',
    supportsAllDrives: 'true',
    includeItemsFromAllDrives: 'true',
  });

  const response = await fetch(`${DRIVE_API}?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to read Google Drive folder');
  }

  return data.files || [];
}

async function listFilesRecursive(folderId, apiKey, path = '') {
  const children = await listChildren(folderId, apiKey);
  const files = [];

  for (const item of children) {
    if (item.mimeType === FOLDER_MIME_TYPE) {
      const nestedPath = path ? `${path} / ${item.name}` : item.name;
      const nestedFiles = await listFilesRecursive(item.id, apiKey, nestedPath);
      files.push(...nestedFiles);
    } else {
      files.push({
        ...item,
        path,
      });
    }
  }

  return files;
}
