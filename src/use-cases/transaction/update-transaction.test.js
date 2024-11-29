import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transaction'
import { transaction } from '../../tests'

describe('UpdateTransactionUseCase', () => {
    class UpdateTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    class GetTransactionByIdStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()
        const getTransactionById = new GetTransactionByIdStub()
        const sut = new UpdateTransactionUseCase(
            updateTransactionRepository,
            getTransactionById,
        )

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

    it('should call UpdateTransactionRepository with correct params', async () => {
        // arrange
        const { sut, updateTransactionRepository } = makeSut()
        const updateTransactionRepositorySpy = import.meta.jest.spyOn(
            updateTransactionRepository,
            'execute',
        )

        // act
        await sut.execute(transaction.id, {
            amount: transaction.amount,
        })

        // assert
        expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(
            transaction.id,
            {
                amount: transaction.amount,
            },
        )
    })

    it('should throw if UpdateTransactionRepository throws', async () => {
        // arrange
        const { sut, updateTransactionRepository } = makeSut()
        import.meta.jest
            .spyOn(updateTransactionRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const promise = sut.execute(transaction.id, {
            amount: transaction.amount,
        })

        // assert
        await expect(promise).rejects.toThrow()
    })
})
