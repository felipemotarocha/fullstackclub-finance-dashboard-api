import { ZodError } from 'zod'
import { UserNotFoundError } from '../../errors/user.js'
import { getTransactionsByUserIdSchema } from '../../schemas/transaction.js'
import {
    badRequest,
    ok,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'

export class GetTransactionsByUserIdController {
    constructor(getTransactionsByUserIdUseCase) {
        this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId
            const from = httpRequest.query.from
            const to = httpRequest.query.to

            await getTransactionsByUserIdSchema.parseAsync({
                user_id: userId,
                from,
                to,
            })

            const transactions =
                await this.getTransactionsByUserIdUseCase.execute(
                    userId,
                    from,
                    to,
                )

            return ok(transactions)
        } catch (error) {
            console.error(error)

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            if (error instanceof ZodError) {
                return badRequest({
                    message: error.errors[0].message,
                })
            }
            return serverError()
        }
    }
}
