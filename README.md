# SOP Navigator with OpenAI

This version uses the OpenAI Responses API.

## Vercel environment variables

Add these in Vercel Project Settings -> Environment Variables:

```text
OPENAI_API_KEY=your_openai_api_key
GOOGLE_DRIVE_ACCESS_TOKEN=your_google_oauth_access_token
```

`OPENAI_API_KEY` lets the app call OpenAI.

`GOOGLE_DRIVE_ACCESS_TOKEN` lets the OpenAI Google Drive connector read the Drive folder. An OpenAI key alone cannot read private Google Drive files.

## Deploy

1. Upload this project to GitHub.
2. Import the GitHub repo into Vercel.
3. Add the environment variables above.
4. Redeploy the project.

## Notes

The backend file is:

```text
api/sop-proxy.js
```

The frontend file is:

```text
public/index.html
```
