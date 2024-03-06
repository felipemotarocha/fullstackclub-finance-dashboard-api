import { execSync } from 'child_process'

async function init() {
    execSync('docker-compose up -d --wait postgres-test')
    execSync('npx prisma db push')
}

export default init
