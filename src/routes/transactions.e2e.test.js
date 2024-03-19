import request from 'supertest'
import { app } from '../app.js'
import { transaction, user } from '../tests/index.js'
import { TransactionType } from '@prisma/client'

describe('Transaction Routes E2E Tests', () => {
    it('POST /api/transactions should return 201 when creating a transaction successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .post('/api/transactions')
            .send({ ...transaction, user_id: createdUser.id, id: undefined })

        expect(response.status).toBe(201)
        expect(response.body.user_id).toBe(createdUser.id)
        expect(response.body.type).toBe(transaction.type)
        expect(response.body.amount).toBe(String(transaction.amount))
    })

    it('GET /api/transaction?userId should return 200 when fetching transactions successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send({ ...transaction, user_id: createdUser.id, id: undefined })

        const response = await request(app).get(
            `/api/transactions?userId=${createdUser.id}`,
        )

        expect(response.status).toBe(200)
        expect(response.body[0].id).toBe(createdTransaction.id)
    })

    it('PATCH /api/transactions/:transactionId should return 200 when updating a transaction successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send({ ...transaction, user_id: createdUser.id, id: undefined })

        const response = await request(app)
            .patch(`/api/transactions/${createdTransaction.id}`)
            .send({ amount: 100, type: TransactionType.INVESTMENT })

        expect(response.status).toBe(200)
        expect(response.body.amount).toBe('100')
        expect(response.body.type).toBe(TransactionType.INVESTMENT)
    })

    it('DELETE /api/transactions/:transactionId should return 200 when deleting a transaction successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send({ ...transaction, user_id: createdUser.id, id: undefined })

        const response = await request(app).delete(
            `/api/transactions/${createdTransaction.id}`,
        )

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(createdTransaction.id)
    })

    it('PATCH /api/transactions/:transactionId should return 404 when updating a non-existing transaction', async () => {
        const response = await request(app)
            .patch(`/api/transactions/${transaction.id}`)
            .send({ amount: 100, type: TransactionType.INVESTMENT })

        expect(response.status).toBe(404)
    })
})
