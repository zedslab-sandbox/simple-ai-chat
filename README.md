# Simple AI Chat

A minimalist, ephemeral AI chat application. Bring your own API key.

## Features

- **Multi-provider support**: OpenAI, Anthropic (Claude), and Google AI (Gemini)
- **Zero persistence**: All data is stored in memory only - refresh to clear everything
- **Privacy-first**: Your API key never leaves your browser except to make API calls
- **Clean UI**: Simple, distraction-free chat interface

## Supported Providers

| Provider | Model | API Key Format |
|----------|-------|----------------|
| OpenAI | gpt-4o-mini | `sk-...` |
| Anthropic | claude-3-5-sonnet | `sk-ant-...` |
| Google AI | gemini-1.5-flash | `AIza...` |

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Security Note

This app stores your API key only in browser memory (React state). It is **not** saved to localStorage, cookies, or any persistent storage. Simply refresh the page to clear all data.

---

Built with Vite + React
