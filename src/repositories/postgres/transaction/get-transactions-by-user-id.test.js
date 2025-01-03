import dayjs from 'dayjs'
import { prisma } from '../../../../prisma/prisma'
import { user, transaction } from '../../../tests'
import { PostgresGetTransactionsByUserIdRepository } from './get-transactions-by-user-id'

describe('PostgresGetTransactionsByUserIdRepository', () => {
    it('should get transactions by user id on db', async () => {
        const sut = new PostgresGetTransactionsByUserIdRepository()
        const date = new Date('2021-01-01')
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: {
                ...transaction,
                user_id: user.id,
                date,
            },
        })

        const result = await sut.execute(user.id, '2021-01-01', '2021-01-31')
        expect(result.length).toBe(1)
        expect(result[0].name).toBe(transaction.name)
        expect(result[0].type).toBe(transaction.type)
        expect(result[0].user_id).toBe(user.id)
        expect(String(result[0].amount)).toBe(String(transaction.amount))
        expect(dayjs(result[0].date).daysInMonth()).toBe(
            dayjs(date).daysInMonth(),
        )
        expect(dayjs(result[0].date).month()).toBe(dayjs(date).month())
        expect(dayjs(result[0].date).year()).toBe(dayjs(date).year())
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetTransactionsByUserIdRepository()
        const prismaSpy = import.meta.jest.spyOn(prisma.transaction, 'findMany')

        await sut.execute(user.id, '2021-01-01', '2021-01-31')

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
                date: {
                    gte: new Date('2021-01-01'),
                    lte: new Date('2021-01-31'),
                },
            },
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresGetTransactionsByUserIdRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'findMany')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(user.id, '2021-01-01', '2021-01-31')

        await expect(promise).rejects.toThrow()
    })
})
