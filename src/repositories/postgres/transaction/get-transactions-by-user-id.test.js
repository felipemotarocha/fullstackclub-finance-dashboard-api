import dayjs from 'dayjs'
import { prisma } from '../../../../prisma/prisma'
import { user, transaction } from '../../../tests'
import { PostgresGetTransactionsByUserIdRepository } from './get-transactions-by-user-id'

describe('PostgresGetTransactionsByUserIdRepository', () => {
    it('should get transactions by user id on db', async () => {
        const sut = new PostgresGetTransactionsByUserIdRepository()
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })

        const result = await sut.execute(user.id)

        expect(result.length).toBe(1)
        expect(result[0].name).toBe(transaction.name)
        expect(result[0].type).toBe(transaction.type)
        expect(result[0].user_id).toBe(user.id)
        expect(String(result[0].amount)).toBe(String(transaction.amount))
        expect(dayjs(result[0].date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        )
        expect(dayjs(result[0].date).month()).toBe(
            dayjs(transaction.date).month(),
        )
        expect(dayjs(result[0].date).year()).toBe(
            dayjs(transaction.date).year(),
        )
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetTransactionsByUserIdRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'findMany')

        await sut.execute(user.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
            },
        })
    })
})
