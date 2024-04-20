import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests'
import { PostgresGetUserByIdRepository } from './get-user-by-id'

describe('PostgresGetUserByIdRepository', () => {
    it('should get user by id on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })

        const sut = new PostgresGetUserByIdRepository()

        const result = await sut.execute(user.id)

        expect(result).toStrictEqual(user)
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserByIdRepository()

        const prismaSpy = import.meta.jest.spyOn(prisma.user, 'findUnique')

        await sut.execute(fakeUser.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: fakeUser.id,
            },
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresGetUserByIdRepository()
        import.meta.jest
            .spyOn(prisma.user, 'findUnique')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(fakeUser.email)

        await expect(promise).rejects.toThrow()
    })
})
