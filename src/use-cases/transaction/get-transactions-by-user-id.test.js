import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id'

describe('GetTransactionsByUserIdUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    class GetTransactionsByUserIdRepositoryStub {
        async execute() {
            return []
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdRepository =
            new GetTransactionsByUserIdRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetTransactionsByUserIdUseCase(
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        )

        return {
            sut,
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        }
    }

    it('should get transactions by user id successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(faker.string.uuid())

        // assert
        expect(result).toEqual([])
    })
})
