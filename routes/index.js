const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')

module.exports = (app, passport) => {
    const authenticated = (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/signin')
    }
    const authenticatedAdmin = (req, res, next) => {
        if (req.isAuthenticated()) {
            if (req.user.isAdmin) { return next() }
            return res.redirect('/')
        }
        res.redirect('/signin')
    }

    app.get('/', authenticated, (req, res) => res.redirect('/restaurants')) //如果使用者訪問首頁，就導向 /restaurants 的頁面
    app.get('/restaurants', authenticated, restController.getRestaurants) //在 /restaurants 底下則交給 restController.getRestaurants 來處理

    app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants')) // 連到 /admin 頁面就轉到 /admin/restaurants
    app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants) // 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理

    app.get('/signup', userController.signUpPage)
    app.post('/signup', userController.signUp)

    app.get('/signin', userController.signInPage)
    app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
    app.get('/logout', userController.logout)
}