import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        const {
            _sum: { amount: totalExpenses },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: 'EXPENSE',
            },
            _sum: {
                amount: true,
            },
        })

        const {
            _sum: { amount: totalEarnings },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: 'EARNING',
            },
            _sum: {
                amount: true,
            },
        })

        const {
            _sum: { amount: totalInvestments },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: 'INVESTMENT',
            },
            _sum: {
                amount: true,
            },
        })

        const _totalEarnings = totalEarnings || 0
        const _totalExpenses = totalExpenses || 0
        const _totalInvestments = totalInvestments || 0

        const balance = _totalEarnings - _totalExpenses - _totalInvestments

        return {
            earnings: _totalEarnings,
            expenses: _totalExpenses,
            investments: _totalInvestments,
            balance,
        }
    }
}
