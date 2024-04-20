import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction'
import { transaction } from '../../tests'

describe('DeleteTransactionUseCase', () => {
    class DeleteTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        const sut = new DeleteTransactionUseCase(deleteTransactionRepository)

        return {
            sut,
            deleteTransactionRepository,
        }
    }

    it('should delete transaction successfully', async () => {
        // arrange
        const { sut } = makeSut()
        const id = faker.string.uuid()

        // act
        const result = await sut.execute(id)

        // expect
        expect(result).toEqual(transaction)
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        // arrange
        const { sut, deleteTransactionRepository } = makeSut()
        const deleteTransactionRepositorySpy = import.meta.jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )
        const id = faker.string.uuid()

        // act
        await sut.execute(id)

        // expect
        expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(id)
    })

    it('should throw if DeleteTransactionRepository throws', async () => {
        // arrange
        const { sut, deleteTransactionRepository } = makeSut()
        import.meta.jest
            .spyOn(deleteTransactionRepository, 'execute')
            .mockRejectedValueOnce(new Error())
        const id = faker.string.uuid()

        // act
        const promise = sut.execute(id)

        // expect
        await expect(promise).rejects.toThrow()
    })
})
