import { ForbiddenError, TransactionNotFoundError } from '../../errors'

export class DeleteTransactionUseCase {
    constructor(deleteTransactionRepository, getTransactionByIdRepository) {
        this.getTransactionByIdRepository = getTransactionByIdRepository
        this.deleteTransactionRepository = deleteTransactionRepository
    }

    async execute(transactionId, userId) {
        const transaction =
            await this.getTransactionByIdRepository.execute(transactionId)
        if (!transaction) {
            throw new TransactionNotFoundError(transactionId)
        }
        if (transaction.user_id !== userId) {
            throw new ForbiddenError()
        }
        const deletedTransaction =
            await this.deleteTransactionRepository.execute(transactionId)
        return deletedTransaction
    }
}
