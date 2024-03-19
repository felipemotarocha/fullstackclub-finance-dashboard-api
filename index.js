import 'dotenv/config.js'
import express from 'express'

import { usersRouter, transactionsRouter } from './src/routes/index.js'

export const app = express()

app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
)
