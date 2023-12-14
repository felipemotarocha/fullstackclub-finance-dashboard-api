import { prisma } from '../../../../prisma/prisma.js'

export class PostgresCreateTransactionRepository {
    async execute(createTransactionParams) {
        return await prisma.transaction.create({
            data: createTransactionParams,
        })
    }
}
