import { authRouter, directoryRouter, fileRouter } from './src/routes/index.js'
import { checkAuthHelper, requestLogger } from './src/middleware/index.js'
import { connectToDB } from './src/config/mongo.connection.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const PORT = process.env.PORT || 3000
const app = express()
app.use(cookieParser(process.env.MY_SECRET_KEY))
app.use(express.json())
app.use(requestLogger)

// app.use(
//   cors({
//     origin: ['http://localhost:5173', 'http://192.168.1.3:5173'],
//     credentials: true,
//   })
// )
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(','),
    credentials: true,
  })
)

// 3. Static File Serving
app.use(express.static('storage'))
app.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Welcome to File Server' })
})

app.use('/files', checkAuthHelper, fileRouter)
app.use('/directory', checkAuthHelper, directoryRouter)
app.use('/auth', authRouter)

app.use((err, req, res, next) => {
  console.log(err)
  console.log('[ERROR] : ', err.message)
  res.status(500).json({ error: err.message || 'Internal Server Error' })
})

app.listen(PORT, '0.0.0.0', async () => {
  await connectToDB()
  console.log(`Server is running on port ${PORT}`)
})
