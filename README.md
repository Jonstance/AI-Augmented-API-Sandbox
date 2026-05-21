# API Sandbox — AI-Powered REST Client

**Test any API endpoint and get instant AI explanations of the response**

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Claude AI](https://img.shields.io/badge/Claude-Sonnet-orange?logo=anthropic)
![License](https://img.shields.io/badge/License-MIT-green)

A Postman-style API sandbox with a Claude AI explainer panel built in. Make requests to preloaded collections or any custom endpoint — then ask the AI to explain the response, suggest next steps, or diagnose errors in real time.

---

## Features

- **4 preloaded collections** — Paystack, GitHub, OpenWeatherMap, CoinGecko
- **Custom request mode** — hit any URL with full control over method, headers, body, and auth
- **AI Explainer panel** — streamed Claude explanations for every response
- **Follow-up Q&A** — continue the conversation about the same response
- **CORS proxy** — all requests proxied server-side, no browser CORS issues
- **Mock responses** — Paystack and OpenWeatherMap work without API keys
- **Live API calls** — GitHub and CoinGecko use real endpoints (no key needed)
- **Syntax-highlighted JSON** — color-coded response viewer
- **Dark terminal aesthetic** — JetBrains Mono, teal accent, GitHub-dark palette

---

## Supported Collections

| Collection | Auth | Live calls |
|---|---|---|
| **Paystack** | Bearer token (optional — mocks without) | With key |
| **GitHub** | None required | Always |
| **OpenWeatherMap** | API key (optional — mocks without) | With key |
| **CoinGecko** | None required | Always |

---

## Getting Started

```bash
# 1. Clone
git clone https://github.com/your-username/ai-api-sandbox.git
cd ai-api-sandbox

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local and add your Anthropic API key

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
ANTHROPIC_API_KEY=sk-ant-...
```

Get an Anthropic API key at [console.anthropic.com](https://console.anthropic.com).

---

## Architecture

### `/api/proxy`

All requests go through this server-side route to avoid CORS issues in the browser.

- Receives `{ url, method, headers, body, collectionId, endpointId, authKey }`
- Returns mock responses for Paystack and OpenWeatherMap when no API key is provided
- Forwards live requests for GitHub, CoinGecko, and custom endpoints
- Strips sensitive headers before forwarding

### `/api/explain`

Streams Claude explanations using the Vercel AI SDK.

- Receives request metadata + response JSON + optional follow-up question + conversation history
- Uses `streamText` with `claude-sonnet-4-20250514`
- Returns a data stream response compatible with the AI SDK client

---

## Project Structure

```
/app
  /api
    /proxy/route.ts       — Server-side CORS proxy
    /explain/route.ts     — Claude streaming endpoint
  /page.tsx               — Main app with full state management
  /layout.tsx
/components
  /layout
    TitleBar.tsx          — macOS-style titlebar
    ThreeColumnLayout.tsx — Three-column responsive shell
  /sidebar
    CollectionSwitcher.tsx — Tab row for switching collections
    EndpointList.tsx       — Grouped endpoint navigator
    AuthInput.tsx          — API key / bearer token input
  /request
    RequestPanel.tsx       — Method pill + URL + param/body editors
    ParamEditor.tsx        — :param path variable editor
    HeadersEditor.tsx      — Key-value header editor
    BodyEditor.tsx         — JSON body textarea with format button
  /response
    ResponsePanel.tsx      — Status, timing, size + JSON output
    JsonHighlighter.tsx    — Syntax-colored JSON renderer
    StatusPill.tsx         — HTTP status badge
  /ai
    AIExplainer.tsx        — AI panel with action buttons + stream
    AIMessage.tsx          — Individual chat bubble
    FollowUpInput.tsx      — Follow-up question textarea
  /custom
    CustomRequestForm.tsx  — Full manual request form
/lib
  /collections
    paystack.ts / github.ts / openweathermap.ts / coingecko.ts / index.ts
  mockData.ts             — Realistic mock responses
  proxy.ts                — Fetch wrapper used by the proxy route
  types.ts                — Shared TypeScript interfaces
```

---

## Adding a New Collection

1. Create `/lib/collections/mycollection.ts` following the `Collection` interface in `lib/types.ts`
2. Add mock data to `lib/mockData.ts` if the API requires a key
3. Register it in `lib/collections/index.ts`
4. Add the tab to `CollectionSwitcher.tsx`
5. Handle auth/mock logic in `app/api/proxy/route.ts`

---

## Screenshots

_Coming soon_

---

## Contributing

Pull requests are welcome. For major changes, open an issue first.

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/my-collection`)
3. Commit your changes
4. Open a PR

---

## License

MIT
