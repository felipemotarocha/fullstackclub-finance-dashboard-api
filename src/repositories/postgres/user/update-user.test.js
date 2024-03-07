import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests'
import { PostgresUpdateUserRepository } from './update-user.js'

describe('PostgresUpdateUserRepository', () => {
    it('should update user on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })

        const sut = new PostgresUpdateUserRepository()

        const updateUserParams = {
            id: faker.string.uuid(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }

        const result = await sut.execute(user.id, updateUserParams)

        expect(result).toStrictEqual(updateUserParams)
    })
})
