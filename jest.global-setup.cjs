const { execSync } = require('child_process')

module.exports = async () => {
    execSync('docker compose up -d --wait postgres-test')
    execSync('npx prisma db push --skip-generate')
}
