import {
    checkIfIdIsValid,
    invalidIdResponse,
    serverError,
    badRequest,
    checkIfAmountIsValid,
    invalidAmountResponse,
    checkIfTypeIsValid,
    invalidTypeResponse,
    ok,
} from '../helpers/index.js'

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const params = httpRequest.body

            const allowedFields = ['name', 'date', 'amount', 'type']

            const someFieldIsNotAllowed = Object.keys(params).some(
                (field) => !allowedFields.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some provided field is not allowed.',
                })
            }

            if (params.amount) {
                const amountIsValid = checkIfAmountIsValid(params.amount)

                if (!amountIsValid) {
                    return invalidAmountResponse()
                }
            }

            if (params.type) {
                const typeIsValid = checkIfTypeIsValid(params.type)

                if (!typeIsValid) {
                    return invalidTypeResponse()
                }
            }

            const transaction = await this.updateTransactionUseCase.execute(
                httpRequest.params.transactionId,
                params,
            )

            return ok(transaction)
        } catch (error) {
            console.error(error)

            return serverError()
        }
    }
}
