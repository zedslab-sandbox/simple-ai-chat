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
| Google AI | gemini-2.5-flash | `AIza...` |

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

### Option 1: Static File Server (Recommended)

After building, serve the `dist/` folder with any static file server.

### Option 2: Node.js Server (for reverse proxy deployments)

A custom `server.js` is included for deployments behind a reverse proxy with subpath routing (e.g., `/apps/2/`).

```bash
# Build first
npm run build

# Run the server
PORT=3002 BASE_PATH=/apps/2 node server.js
```

**Environment Variables:**
- `PORT` - Server port (default: 3000)
- `BASE_PATH` - URL path prefix for reverse proxy (e.g., `/apps/2`)

### Deployment with Subpath (e.g., Tailscale Serve)

When deploying behind a reverse proxy that routes a subpath to your app:

1. **Update `vite.config.js`** - Set the `base` option to match your subpath:
   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/apps/2/'  // Your subpath here
   })
   ```

2. **Rebuild the app:**
   ```bash
   npm run build
   ```

3. **Start with the Node server:**
   ```bash
   PORT=3002 BASE_PATH=/apps/2 node server.js
   ```

The `base` option ensures asset URLs in the built HTML include the subpath prefix, and the server strips the prefix when serving files.

### Common Deployment Issues

**Blank page / assets not loading:**
- The `base` option in `vite.config.js` must match your proxy subpath
- Rebuild after changing the base option

**"Host not allowed" error (Vite dev/preview mode):**
- Add your hostname to `server.allowedHosts` or `preview.allowedHosts` in `vite.config.js`
- Or use the production Node.js server instead

**Port already in use:**
- The previous process may still be running
- Kill existing processes or use a different port

## Security Note

This app stores your API key only in browser memory (React state). It is **not** saved to localStorage, cookies, or any persistent storage. Simply refresh the page to clear all data.

## Project Structure

```
simple-ai-chat/
├── src/
│   ├── App.jsx      # Main React component with provider configs
│   ├── App.css      # Styles
│   ├── main.jsx     # Entry point
│   └── index.css    # Global styles
├── public/
│   └── chat-icon.svg
├── server.js        # Production server for subpath deployments
├── vite.config.js   # Vite configuration
└── package.json
```

---

Built with Vite + React
