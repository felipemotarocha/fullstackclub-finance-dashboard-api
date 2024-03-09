export class TransactionNotFoundError extends Error {
    constructor(transactionId) {
        super(`Transaction with id ${transactionId} was not found.`)
        this.name = 'TransactionNotFoundError'
    }
}
