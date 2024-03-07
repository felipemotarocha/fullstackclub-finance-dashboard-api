import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests'
import { PostgresUpdateUserRepository } from './update-user.js'

describe('PostgresUpdateUserRepository', () => {
    const updateUserParams = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }

    it('should update user on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresUpdateUserRepository()

        const result = await sut.execute(user.id, updateUserParams)

        expect(result).toStrictEqual(updateUserParams)
    })

    it('should call Prisma with correct params', async () => {
        // arrange
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresUpdateUserRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'update')

        // act
        await sut.execute(user.id, updateUserParams)

        // assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
            data: updateUserParams,
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresUpdateUserRepository()
        jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(new Error())

        const promise = sut.execute(updateUserParams)

        await expect(promise).rejects.toThrow()
    })
})
