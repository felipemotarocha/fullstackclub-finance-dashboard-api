import { CreateTransactionUseCase } from './create-transaction'
import { faker } from '@faker-js/faker'

describe('CreateTransactionUseCase', () => {
    const createTransactionParams = {
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
    }

    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    class CreateTransactionRepositoryStub {
        async execute(transaction) {
            return transaction
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'random_id'
        }
    }

    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return { ...user, id: userId }
        }
    }

    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        )

        return {
            sut,
            createTransactionRepository,
            idGeneratorAdapter,
            getUserByIdRepository,
        }
    }
    it('should create transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(createTransactionParams)

        // assert
        expect(result).toEqual({ ...createTransactionParams, id: 'random_id' })
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            'execute',
        )

        // act
        await sut.execute(createTransactionParams)

        // assert
        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(
            createTransactionParams.user_id,
        )
    })
})
