import 'dotenv/config'

const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret) {
  throw new Error('JWT_SECRET must be set in the environment before starting the API.')
}

export const config = {
  port: Number(process.env.PORT ?? 3001),
  jwtSecret,
  corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  adminEmail: process.env.ADMIN_EMAIL ?? 'dweavers788@gmail.com',
  groqApiKey: process.env.GROQ_API_KEY,
  aiModel: process.env.AI_MODEL ?? 'qwen/qwen3.8-27b',
  jwtExpiresIn: '7d',
} as const
