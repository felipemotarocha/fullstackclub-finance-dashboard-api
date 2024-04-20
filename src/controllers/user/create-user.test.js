import { faker } from '@faker-js/faker'
import { CreateUserController } from './create-user'
import { EmailAlreadyInUseError } from '../../errors/user'
import { user } from '../../tests'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStub()
        const sut = new CreateUserController(createUserUseCase)

        return { createUserUseCase, sut }
    }

    const httpRequest = {
        body: {
            ...user,
            id: undefined,
        },
    }

    it('should return 201 when creating a user successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toEqual(user)
    })

    it('should return 400 if first_name is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                first_name: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if last_name is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                last_name: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                email: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not valid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                email: 'invalid_email',
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                password: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is less than 6 characters', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                password: faker.internet.password({ length: 5 }),
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should call CreateUserUseCase with correct params', async () => {
        // arrange
        const { sut, createUserUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(createUserUseCase, 'execute')

        // act
        await sut.execute(httpRequest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    it('should return 500 if CreateUserUseCase throws', async () => {
        // arrange
        const { sut, createUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(createUserUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })

    it('should return 500 if CreateUserUseCase throws EmailAlreadyInUseError', async () => {
        // arrange
        const { sut, createUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(createUserUseCase, 'execute')
            .mockRejectedValueOnce(
                new EmailAlreadyInUseError(httpRequest.body.email),
            )

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })
})
