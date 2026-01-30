import { authRouter, directoryRouter, fileRouter } from './src/routes/index.js'
import { checkAuthHelper, requestLogger } from './src/middleware/index.js'

import { connectToDB } from './src/config/mongo.connection.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { seedUser } from './src/utils/seedUser.js'

dotenv.config()

const PORT = process.env.PORT || 3000
const app = express()
app.use(cookieParser(process.env.MY_SECRET_KEY))
app.use(express.json())
app.use(requestLogger)

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : [],
    credentials: true,
  })
)

// 3. Static File Serving
app.use(express.static('storage'))
app.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Server is running' })
})
app.use('/files', checkAuthHelper, fileRouter)
app.use('/directory', checkAuthHelper, directoryRouter)
app.use('/auth', authRouter)

app.use((err, req, res, next) => {
  console.log('[❌Some Error Occured]')
  console.log(err)
  console.log('[ERROR] : ', err.message)
  res.status(500).json({ error: err.message || 'Internal Server Error' })
})

app.listen(PORT, '0.0.0.0', async () => {
  await connectToDB()
  // await seedUser()
  console.log(`Server is running on port ${PORT}`)
  console.log(`Network access via: http://<your-ip-address>:${PORT}`)
})
