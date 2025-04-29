import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from 'dotenv'
import { connectDB } from './src/config/database'
import authRoutes from './src/routes/auth'
import emergencyRoutes from './src/routes/emergency'
import policeRoutes from './src/routes/police'
import { errorHandler } from './src/middleware/errorHandler'

// Load environment variables
config()

// Create Express app
const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(helmet()) // Security headers
app.use(cors()) // Enable CORS
app.use(morgan('dev')) // Request logging
app.use(express.json()) // Parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/emergency', emergencyRoutes)
app.use('/api/police', policeRoutes)

// Error handling
app.use(errorHandler)

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: 'ok' })
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app 