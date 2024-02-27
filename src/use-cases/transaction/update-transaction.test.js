import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transaction'

describe('UpdateTransactionUseCase', () => {
    const transaction = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
    }

    class UpdateTransactionRepositoryStub {
        async execute(transactionId) {
            return {
                id: transactionId,
                ...transaction,
            }
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()
        const sut = new UpdateTransactionUseCase(updateTransactionRepository)

        return {
            sut,
            updateTransactionRepository,
        }
    }

    it('should create a transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(transaction.id, {
            amount: Number(faker.finance.amount()),
        })

        // assert
        expect(result).toEqual(transaction)
    })
})
