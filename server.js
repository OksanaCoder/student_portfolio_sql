const express = require('express')

 const cors = require('cors')
 const dotenv = require('dotenv')
 dotenv.config()
const db = require('./db')
 const server = express()

 const studentRoute = require('./routes/users')
 
 server.use(cors())
 server.use(express.json())
server.use('/users', studentRoute)

 server.get('/', function (req, res) {
res.send('The server is running')
})


server.listen(process.env.PORT || 3456, () => console.log('Running on ', process.env.PORT || 3456)) 