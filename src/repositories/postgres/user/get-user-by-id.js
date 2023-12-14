import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserByIdRepository {
    async execute(userId) {
        return await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })
    }
}
