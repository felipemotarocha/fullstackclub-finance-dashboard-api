import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserByEmailRepository {
    async execute(email) {
        return await prisma.user.findUnique({
            where: {
                email,
            },
        })
    }
}
