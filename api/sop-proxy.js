// api/sop-proxy.js
// Vercel Serverless Function that proxies frontend requests to OpenAI.

const MODEL = 'gpt-5';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { folderId, googleAccessToken: requestGoogleAccessToken } = req.body || {};
    const googleAccessToken = process.env.GOOGLE_DRIVE_ACCESS_TOKEN || requestGoogleAccessToken;

    if (!folderId) {
      return res.status(400).json({ error: 'folderId is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });
    }

    if (!googleAccessToken) {
      return res.status(500).json({
        error:
          'Google Drive access is not configured. Add GOOGLE_DRIVE_ACCESS_TOKEN or send googleAccessToken in the request.',
      });
    }

    const tools = [];
    tools.push({
      type: 'mcp',
      server_label: 'google_drive',
      connector_id: 'connector_googledrive',
      authorization: googleAccessToken,
      require_approval: 'never',
    });

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_output_tokens: 4000,
        tools,
        instructions:
          'You are a SOP navigator. Return only valid JSON. Do not include Markdown, explanations, or extra text.',
        input: `Analyze the Google Drive folder with ID: ${folderId}.

Return this exact JSON structure:
{
  "folders": [
    {
      "id": "folder_id",
      "name": "Category name",
      "files": [
        {
          "id": "file_id",
          "name": "SOP name",
          "url": "https://drive.google.com/file/d/FILE_ID/view"
        }
      ]
    }
  ],
  "totalFiles": 0
}

Find subfolders as SOP categories. For each category, include Word documents only (.docx, .doc).`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI API error:', data);
      return res.status(response.status).json({
        error: 'Failed to fetch from OpenAI API',
        details: data,
      });
    }

    const responseText =
      data.output_text ||
      (Array.isArray(data.output)
        ? data.output
            .flatMap((item) => item.content || [])
            .filter((content) => content.type === 'output_text' && content.text)
            .map((content) => content.text)
            .join('')
        : '');

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(400).json({
        error: 'No JSON found in response',
        rawResponse: responseText.substring(0, 500),
      });
    }

    return res.status(200).json(JSON.parse(jsonMatch[0]));
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
}

