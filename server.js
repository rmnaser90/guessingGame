const express = require('express')
const dotEnv = require('dotenv').config()
const app = express()
const mongoose = require('mongoose')
const api = require('./server/routes/api')
mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', api)




const PORT = process.env.PORT
const server = app.listen(PORT, () => console.log(`up and listening on port ${PORT}!`))