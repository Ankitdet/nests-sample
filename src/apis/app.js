const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { createUser, getUsers } = require('./db')

const app = express()

app.use(bodyParser({
    extended: true,
}))
app.use(cors())


app.get('/users', async (req, res, next) => {

    const { limit, offset } = req.params

    const listUsers = await getUsers({ limit, offset })

    return res.status(200).json(listUsers)
})


app.post('/user', async (req, res, next) => {
    const { username, password } = req.body
    await createUser({ username, password })
    return res.status(200).json({ message: 'user created success' })
})

app.on('unhandledError', (error) => {
    console.error('unhandled exception.')
})

app.listen(8000, () => {
    console.log('server started on Port 8000')
})