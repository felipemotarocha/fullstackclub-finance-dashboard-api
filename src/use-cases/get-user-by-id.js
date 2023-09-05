export class GetUserByIdUseCase {
    constructor(getUserByIdRepository) {
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(userId) {
        const user = await this.getUserByIdRepository.execute(userId)

        return user
    }
}
