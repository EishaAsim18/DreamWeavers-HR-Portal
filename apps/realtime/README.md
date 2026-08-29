# @dreamweavers/realtime

A minimal, standalone realtime signaling server for **Meet Dreams** calling.
It carries presence (who's online) and WebRTC handshake messages (call
invites, offers/answers, ICE candidates) between two browser clients — it
never touches the actual audio/video, which flows peer-to-peer once WebRTC
negotiation completes.

Deliberately independent of `apps/api` and the Postgres database — calling
shouldn't require the DB to be up, and vice versa.

## Run it

```bash
cd apps/realtime
npm install
npm run dev
```

Listens on `http://localhost:4001` by default (override with `PORT`),
exposing:

- `GET /health` — liveness check
- `ws://localhost:4001/ws` — signaling WebSocket

`apps/web`'s Vite dev server proxies `/ws` to this server, so the frontend
only needs `npm run dev` running here alongside the usual `apps/web` dev
server — no database, no extra setup.

## Protocol

Every message is a JSON object with a `type` field:

| Type | Direction | Purpose |
|---|---|---|
| `register` | client → server | Announce `{ userId }`, marking the connection online |
| `presence:list` | server → client | `{ onlineUserIds: string[] }`, sent on connect and on any change |
| `call:invite` | client → client (relayed) | Start a call: `{ toUserId, callId, conversationId, kind }` |
| `call:accept` / `call:decline` / `call:cancel` / `call:hangup` | client → client (relayed) | Call lifecycle |
| `call:unavailable` | server → caller | Sent back when the callee isn't currently connected |
| `webrtc:offer` / `webrtc:answer` / `webrtc:ice-candidate` | client → client (relayed) | Standard WebRTC handshake payloads |

The server holds no persistent state — presence is purely in-memory, keyed
by `userId`. Restarting it just means everyone reconnects and re-registers.
