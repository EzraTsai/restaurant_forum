const express = require('express')
const exphbs = require('express-handlebars')
const Port = 3000
const app = express()

app.engine('hbs', exphbs({ defaultLayout: 'main'}))
app.set('view engine', 'hbs')
// app.get('/', (req, res) => {
//     res.render('')
// })

app.listen(Port, () => {
    console.log(`App is now listening on Port ${Port}`)
})