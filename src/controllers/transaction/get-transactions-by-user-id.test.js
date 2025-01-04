import { UserNotFoundError } from '../../errors/user'
import { transaction } from '../../tests'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id'
import { faker } from '@faker-js/faker'

describe('Get Transaction By User ID Controller', () => {
    const from = '2024-01-01'
    const to = '2024-01-31'

    class GetUserByIdUseCaseStub {
        async execute() {
            return [transaction]
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(getUserByIdUseCase)

        return { sut, getUserByIdUseCase }
    }

    it('should return 200 when finding transaction by user id successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            query: { userId: faker.string.uuid(), from, to },
        })

        // assert
        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when missing userId param', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            query: { userId: undefined, from, to },
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when userId param is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            query: { userId: 'invalid_user_id', from, to },
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 404 when GetUserByIdUseCase throws UserNotFoundError', async () => {
        // arrange
        const { sut, getUserByIdUseCase } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdUseCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())

        // act
        const response = await sut.execute({
            query: { userId: faker.string.uuid(), from, to },
        })

        // assert
        expect(response.statusCode).toBe(404)
    })

    it('should return 500 when GetUserByIdUseCase throws generic error', async () => {
        // arrange
        const { sut, getUserByIdUseCase } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const response = await sut.execute({
            query: { userId: faker.string.uuid(), from, to },
        })

        // assert
        expect(response.statusCode).toBe(500)
    })

    it('should call GetUserByIdUseCase with correct params', async () => {
        // arrange
        const { sut, getUserByIdUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(getUserByIdUseCase, 'execute')
        const userId = faker.string.uuid()

        // act
        await sut.execute({
            query: { userId: userId, from, to },
        })

        // assert
        expect(executeSpy).toHaveBeenCalledWith(userId, from, to)
    })
})
