import 'dotenv/config.js'
import express from 'express'

import { PostgresHelper } from './src/db/postgres/helper.js'

const app = express()

app.get('/', async (req, res) => {
    const results = await PostgresHelper.query('SELECT * FROM users;')

    res.send(JSON.stringify(results))
})

app.listen(3000, () => console.log('listening on port 3000'))
