import { UserNotFoundError } from '../../errors/user.js'
import {
    serverError,
    userNotFoundResponse,
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
} from '../helpers/index.js'

export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserBalanceUseCase = getUserBalanceUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const idIsValid = checkIfIdIsValid(userId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const balance = await this.getUserBalanceUseCase.execute(userId)

            return ok(balance)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            console.error(error)

            return serverError()
        }
    }
}
