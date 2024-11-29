import { Router } from 'express'
import {
    makeCreateUserController,
    makeDeleteUserController,
    makeGetUserBalanceController,
    makeGetUserByIdController,
    makeLoginUserController,
    makeUpdateUserController,
} from '../factories/controllers/user.js'
import { auth } from '../middlewares/auth.js'

export const usersRouter = Router()

usersRouter.get('/:userId', auth, async (request, response) => {
    const getUserByIdController = makeGetUserByIdController()

    console.log('Usuário autenticado: ', request.userId)

    const { statusCode, body } = await getUserByIdController.execute(request)

    response.status(statusCode).send(body)
})

usersRouter.get('/:userId/balance', auth, async (request, response) => {
    const getUserBalanceController = makeGetUserBalanceController()

    const { statusCode, body } = await getUserBalanceController.execute(request)

    response.status(statusCode).send(body)
})

usersRouter.post('/', async (request, response) => {
    const createUserController = makeCreateUserController()

    const { statusCode, body } = await createUserController.execute(request)

    response.status(statusCode).send(body)
})

usersRouter.patch('/:userId', auth, async (request, response) => {
    const updateUserController = makeUpdateUserController()

    const { statusCode, body } = await updateUserController.execute(request)

    response.status(statusCode).send(body)
})

usersRouter.delete('/:userId', auth, async (request, response) => {
    const deleteUserController = makeDeleteUserController()

    const { statusCode, body } = await deleteUserController.execute(request)

    response.status(statusCode).send(body)
})

usersRouter.post('/login', async (request, response) => {
    const loginUserController = makeLoginUserController()

    const { statusCode, body } = await loginUserController.execute(request)

    response.status(statusCode).send(body)
})
