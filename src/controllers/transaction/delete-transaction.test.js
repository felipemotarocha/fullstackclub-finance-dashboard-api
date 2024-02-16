import { DeleteTransactionController } from './delete-transaction'
import { faker } from '@faker-js/faker'

describe('Delete Transaction Controller', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return {
                user_id: faker.string.uuid(),
                id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                type: 'EXPENSE',
                amount: Number(faker.finance.amount()),
            }
        }
    }

    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub()
        const sut = new DeleteTransactionController(deleteTransactionUseCase)

        return { sut, deleteTransactionUseCase }
    }
    it('should return 200 when deleting a transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            params: { transactionId: faker.string.uuid() },
        })

        // assert
        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when id is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            params: { transactionId: 'invalid_id' },
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 404 when transaction is not found', async () => {
        // arrange
        const { sut, deleteTransactionUseCase } = makeSut()
        jest.spyOn(deleteTransactionUseCase, 'execute').mockResolvedValueOnce(
            null,
        )

        // act
        const response = await sut.execute({
            params: { transactionId: faker.string.uuid() },
        })

        // assert
        expect(response.statusCode).toBe(404)
    })

    it('should return 500 when DeleteTransactionUseCase throws', async () => {
        // arrange
        const { sut, deleteTransactionUseCase } = makeSut()
        jest.spyOn(deleteTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const response = await sut.execute({
            params: { transactionId: faker.string.uuid() },
        })

        // assert
        expect(response.statusCode).toBe(500)
    })
})
