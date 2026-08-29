import http from 'node:http'
import express from 'express'
import cors from 'cors'
import { WebSocketServer } from 'ws'
import { registerSignaling } from './signaling.js'

const PORT = Number(process.env.PORT) || 4001

const app = express()
app.use(cors())

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'dreamweavers-realtime', time: new Date().toISOString() })
})

const server = http.createServer(app)
const wss = new WebSocketServer({ server, path: '/ws' })

registerSignaling(wss)

server.listen(PORT, () => {
  console.log(`DreamWeavers realtime signaling server ready:`)
  console.log(`  → HTTP   http://localhost:${PORT}/health`)
  console.log(`  → WS     ws://localhost:${PORT}/ws`)
})
