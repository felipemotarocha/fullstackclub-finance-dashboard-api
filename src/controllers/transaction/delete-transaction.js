import { TransactionNotFoundError } from '../../errors/transaction.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    transactionNotFoundResponse,
} from '../helpers/index.js'

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId
            const userId = httpRequest.params.user_id

            const transactionIdIsValid = checkIfIdIsValid(transactionId)
            const userIdIsValid = checkIfIdIsValid(userId)

            if (!transactionIdIsValid || !userIdIsValid) {
                return invalidIdResponse()
            }

            const deletedTransaction =
                await this.deleteTransactionUseCase.execute(
                    transactionId,
                    userId,
                )

            return ok(deletedTransaction)
        } catch (error) {
            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse()
            }

            console.error(error)

            return serverError()
        }
    }
}
