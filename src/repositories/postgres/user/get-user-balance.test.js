import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { user as fakeUser } from '../../../tests'
import { PostgresGetUserBalanceRepository } from './get-user-balance'
import { TransactionType } from '@prisma/client'

describe('PostgresGetUserBalanceRepository', () => {
    it('should get user balance on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })
        const date = new Date('2021-01-01')
        await prisma.transaction.createMany({
            data: [
                {
                    name: faker.string.sample(),
                    amount: 5000,
                    date,
                    type: 'EARNING',
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    date,
                    amount: 5000,
                    type: 'EARNING',
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    date,
                    amount: 1000,
                    type: 'EXPENSE',
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    date,
                    amount: 1000,
                    type: 'EXPENSE',
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    date,
                    amount: 3000,
                    type: 'INVESTMENT',
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    date,
                    amount: 3000,
                    type: 'INVESTMENT',
                    user_id: user.id,
                },
            ],
        })

        const sut = new PostgresGetUserBalanceRepository()

        const result = await sut.execute(user.id, '2021-01-01', '2021-01-31')

        expect(result.earnings.toString()).toBe('10000')
        expect(result.expenses.toString()).toBe('2000')
        expect(result.investments.toString()).toBe('6000')
        expect(result.balance.toString()).toBe('2000')
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserBalanceRepository()
        const prismaSpy = import.meta.jest.spyOn(
            prisma.transaction,
            'aggregate',
        )

        await sut.execute(fakeUser.id, '2021-01-01', '2021-12-31')

        expect(prismaSpy).toHaveBeenCalledTimes(3)
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: TransactionType.EXPENSE,
                date: {
                    gte: new Date('2021-01-01'),
                    lte: new Date('2021-12-31'),
                },
            },
            _sum: {
                amount: true,
            },
        })
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: TransactionType.EARNING,
                date: {
                    gte: new Date('2021-01-01'),
                    lte: new Date('2021-12-31'),
                },
            },
            _sum: {
                amount: true,
            },
        })
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: fakeUser.id,
                type: TransactionType.INVESTMENT,
                date: {
                    gte: new Date('2021-01-01'),
                    lte: new Date('2021-12-31'),
                },
            },
            _sum: {
                amount: true,
            },
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresGetUserBalanceRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'aggregate')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(fakeUser.id)

        await expect(promise).rejects.toThrow()
    })
})
