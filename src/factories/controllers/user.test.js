import {
    CreateUserController,
    DeleteUserController,
    GetUserByIdController,
    UpdateUserController,
} from '../../controllers'
import {
    makeCreateUserController,
    makeDeleteUserController,
    makeGetUserByIdController,
    makeUpdateUserController,
} from './user'

describe('User Controller Factories', () => {
    it('should return a valid GetUserByIdController instance', () => {
        expect(makeGetUserByIdController()).toBeInstanceOf(
            GetUserByIdController,
        )
    })

    it('should return a valid CreateUserController instance', () => {
        expect(makeCreateUserController()).toBeInstanceOf(CreateUserController)
    })

    it('should return a valid UpdateUserController instance', () => {
        expect(makeUpdateUserController()).toBeInstanceOf(UpdateUserController)
    })

    it('should return a valid DeleteUserController instance', () => {
        expect(makeDeleteUserController()).toBeInstanceOf(DeleteUserController)
    })
})
