import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { usersRouter, transactionsRouter } from './routes/index.js'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)

const swaggerDocument = JSON.parse(
    fs.readFileSync(join(__dirname, '../docs/swagger.json'), 'utf8'),
)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

export { app }
