const express = require('express')
const exphbs  = require('express-handlebars')
const db = require('./models') // 引入資料庫
const bodyParser = require('body-parser')
const Port = 3000
const app = express()

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))

app.listen(Port, () => {
    db.sequelize.sync()
    console.log(`App is now listening on Port ${Port}`)
})

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require('./routes')(app)