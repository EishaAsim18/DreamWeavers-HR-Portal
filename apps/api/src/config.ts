import 'dotenv/config'

export const config = {
  port: Number(process.env.PORT ?? 3001),
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-in-production',
  corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  adminEmail: process.env.ADMIN_EMAIL ?? 'dweavers788@gmail.com',
  groqApiKey: process.env.GROQ_API_KEY,
  aiModel: process.env.AI_MODEL ?? 'llama-3.1-8b-instant',
  jwtExpiresIn: '7d',
} as const
