import {
    CreateTransactionController,
    DeleteTransactionController,
    GetTransactionsByUserIdController,
    UpdateTransactionController,
} from '../../controllers'
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionController,
} from './transaction'

describe('Transaction Controller Factories', () => {
    it('should return a valid CreateTransactionController instance', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })

    it('should return a valid UpdateTransactionController instance', () => {
        expect(makeUpdateTransactionController()).toBeInstanceOf(
            UpdateTransactionController,
        )
    })

    it('should return a valid DeleteTransactionController instance', () => {
        expect(makeDeleteTransactionController()).toBeInstanceOf(
            DeleteTransactionController,
        )
    })

    it('should return a valid GetTransactionsByUserIdController instance', () => {
        expect(makeGetTransactionsByUserIdController()).toBeInstanceOf(
            GetTransactionsByUserIdController,
        )
    })
})
