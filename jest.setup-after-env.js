import { prisma } from './prisma/prisma'

beforeEach(async () => {
    await prisma.user.deleteMany({})
    await prisma.transaction.deleteMany({})
})
