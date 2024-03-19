import express from 'express'
import { usersRouter, transactionsRouter } from './routes/index.js'

export const app = express()

app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)
