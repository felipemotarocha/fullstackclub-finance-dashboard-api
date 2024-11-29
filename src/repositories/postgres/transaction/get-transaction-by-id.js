import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetTransactionByIdRepository {
    async execute(transactionId) {
        return await prisma.transaction.findUnique({
            where: {
                id: transactionId,
            },
        })
    }
}
