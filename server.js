const express = require('express')
const dotEnv = require('dotenv').config()
const app = express()
const mongoose = require('mongoose')
const api = require('./server/routes/api')
const socket = require('socket.io')
const path = require('path')

mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    next()
})
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'build')))
app.use(express.static(path.join(__dirname, 'node_modules')))
app.use('/', api)
 

const PORT = process.env.PORT
const server = app.listen(PORT, () => console.log(`up and listening on port ${PORT}!`))
const io = socket(server)
io.on('connection', function (socket) {
    console.log("new Connection");
    socket.on('update', function () {
        console.log('new realtime update');
        io.sockets.emit('update')
    })

})