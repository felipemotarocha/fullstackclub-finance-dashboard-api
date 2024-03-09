export class TransactionNotFoundError extends Error {
    constructor(userId) {
        super(`Transaction with id ${userId} was not found.`)
        this.name = 'TransactionNotFoundError'
    }
}
