import 'dotenv/config.js'
import express from 'express'

import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionController,
} from './src/factories/controllers/transaction.js'
import { usersRouter } from './src/routes/users.js'

const app = express()

app.use(express.json())

app.use('/api/users', usersRouter)

app.get('/api/transactions', async (request, response) => {
    const getTransactionsByUserIdController =
        makeGetTransactionsByUserIdController()

    const { statusCode, body } =
        await getTransactionsByUserIdController.execute(request)

    response.status(statusCode).send(body)
})

app.post('/api/transactions', async (request, response) => {
    const createTransactionController = makeCreateTransactionController()

    const { statusCode, body } =
        await createTransactionController.execute(request)

    response.status(statusCode).send(body)
})

app.patch('/api/transactions/:transactionId', async (request, response) => {
    const updateTransactionController = makeUpdateTransactionController()

    const { statusCode, body } =
        await updateTransactionController.execute(request)

    response.status(statusCode).send(body)
})

app.delete('/api/transactions/:transactionId', async (request, response) => {
    const deleteTransactionController = makeDeleteTransactionController()

    const { statusCode, body } =
        await deleteTransactionController.execute(request)

    response.status(statusCode).send(body)
})

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
)
