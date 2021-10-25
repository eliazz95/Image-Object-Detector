const express = require('express')
const app = express()

app.use(function (req, res, next) {
    console.log(`${new Date()} - ${req.method} request for ${req.url}`)
    next()
})

app.use(express.static('./static'))

app.listen(process.env.PORT || 3000)