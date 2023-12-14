import { prisma } from '../../../../prisma/prisma.js'

export class PostgresUpdateUserRepository {
    async execute(userId, updateUserParams) {
        return await prisma.user.update({
            where: {
                id: userId,
            },
            data: updateUserParams,
        })
    }
}
