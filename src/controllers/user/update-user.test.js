import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors/user'
import { user } from '../../tests'
import { UpdateUserController } from './update-user'
import { faker } from '@faker-js/faker'

describe('UpdateUserController', () => {
    class UpdateUserUseCaseStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const updateUserUseCase = new UpdateUserUseCaseStub()
        const sut = new UpdateUserController(updateUserUseCase)

        return { sut, updateUserUseCase }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 7,
            }),
        },
    }

    it('should return 200 when updating a user successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute(httpRequest)

        // assert
        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when an invalid email is provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                email: 'invalid_email',
            },
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when an invalid password is provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                password: faker.internet.password({ length: 5 }),
            },
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when an invalid id is provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            params: {
                userId: 'invalid_id',
            },
            body: httpRequest.body,
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when an unallowed field is provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const response = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                unallowed_field: 'unallowed_value',
            },
        })

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 500 if UpdateUserUseCase throws with generic error', async () => {
        // arrange
        const { sut, updateUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(updateUserUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const response = await sut.execute(httpRequest)

        // assert
        expect(response.statusCode).toBe(500)
    })

    it('should return 400 if UpdateUserUseCase throws EmailAlreadyInUseError', async () => {
        // arrange
        const { sut, updateUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(updateUserUseCase, 'execute')
            .mockRejectedValueOnce(
                new EmailAlreadyInUseError(faker.internet.email()),
            )

        // act
        const response = await sut.execute(httpRequest)

        // assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 404 if UpdateUserUseCase throws UserNotFoundError', async () => {
        // arrange
        const { sut, updateUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(updateUserUseCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError(faker.string.uuid()))

        // act
        const response = await sut.execute(httpRequest)

        // assert
        expect(response.statusCode).toBe(404)
    })

    it('should call UpdateUserUseCase with correct params', async () => {
        // arrange
        const { sut, updateUserUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(updateUserUseCase, 'execute')

        // act
        await sut.execute(httpRequest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.userId,
            httpRequest.body,
        )
    })
})
