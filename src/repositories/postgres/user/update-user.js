import { prisma } from '../../../../prisma/prisma.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'
import { UserNotFoundError } from '../../../errors/user.js'

export class PostgresUpdateUserRepository {
    async execute(userId, updateUserParams) {
        try {
            return await prisma.user.update({
                where: {
                    id: userId,
                },
                data: updateUserParams,
            })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // P2025 = "An operation failed because it depends on one or more records that were required but not found" (from Prisma docs)
                if (error.code === 'P2025') {
                    throw new UserNotFoundError(userId)
                }
            }

            throw error
        }
    }
}
