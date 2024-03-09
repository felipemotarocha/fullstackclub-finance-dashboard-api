import { PasswordHasherAdapter } from './password-hasher'
import { faker } from '@faker-js/faker'

describe('PasswordHasherAdapter', () => {
    it('should return a hashed password', async () => {
        const sut = new PasswordHasherAdapter()
        const password = faker.internet.password()

        const result = await sut.execute(password)

        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(result).not.toBe(password)
    })
})
