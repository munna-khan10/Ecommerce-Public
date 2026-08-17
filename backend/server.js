import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import fs from 'fs'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true })
}

const app = express()
const port = process.env.PORT || 8000

connectDB()
connectCloudinary()

const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL]
  .filter(Boolean)
  .flatMap(value => value.split(',').map(v => v.trim()))

app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/uploads', express.static('uploads'))
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.get('/', (req, res) => res.status(200).send('Ecommerce App Backend is running'))
app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok' }))

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }))
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ success: false, message: 'Internal server error' })
})

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});