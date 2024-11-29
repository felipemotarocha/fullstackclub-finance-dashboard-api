import { LoginUserUseCase } from './login-user'
import { user } from '../../tests/fixtures/user.js'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'

describe('LoginUserUseCase', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return user
        }
    }
    class PasswordComparatorAdapterStub {
        async execute() {
            return true
        }
    }
    class TokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            }
        }
    }

    const makeSut = () => {
        const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub()
        const passwordComparatorAdapterStub =
            new PasswordComparatorAdapterStub()
        const tokensGeneratorAdapterStub = new TokensGeneratorAdapterStub()
        const sut = new LoginUserUseCase(
            getUserByEmailRepositoryStub,
            passwordComparatorAdapterStub,
            tokensGeneratorAdapterStub,
        )
        return {
            sut,
            getUserByEmailRepositoryStub,
            passwordComparatorAdapterStub,
            tokensGeneratorAdapterStub,
        }
    }
    it('should throw UserNotFoundError if user is not found', async () => {
        const { sut, getUserByEmailRepositoryStub } = makeSut()
        import.meta.jest
            .spyOn(getUserByEmailRepositoryStub, 'execute')
            .mockResolvedValueOnce(null)
        const promise = sut.execute('any_email', 'any_password')
        await expect(promise).rejects.toThrow(new UserNotFoundError())
    })
    it('should throw InvalidPasswordError if password is invalid', async () => {
        const { sut, passwordComparatorAdapterStub } = makeSut()
        import.meta.jest
            .spyOn(passwordComparatorAdapterStub, 'execute')
            .mockReturnValue(false)
        const promise = sut.execute('any_email', 'any_password')
        await expect(promise).rejects.toThrow(new InvalidPasswordError())
    })
    it('should return user with tokens', async () => {
        const { sut } = makeSut()
        const result = await sut.execute('any_email', 'any_password')
        expect(result.tokens.accessToken).toBeDefined()
    })
})
