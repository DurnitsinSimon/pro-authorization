require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const router = require('./router/index')
const errorMiddleware = require('./middlewares/errorMiddleware')
const playerRouter = require('./router/playerRouter')
const fileUpload = require('express-fileupload')
const passport = require('passport')
const app = express()
const PORT = process.env.PORT || 5050




app.use(express.json())
app.use(express.static('static'))
app.use(cookieParser())
app.use(passport.initialize())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(fileUpload({}))
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => {
            console.log('server was started on PORT - ' + PORT);
        })
    } catch (e) {
        console.log(e);
    }
}

start()