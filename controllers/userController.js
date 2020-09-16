const fs = require('fs')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const userController = {
    signUpPage: (req, res) => {
        return res.render('signup')
    },

    signUp: (req, res) => {
        // confirm password
        if (req.body.passwordCheck !== req.body.password) {
            req.flash('error_messages', '兩次密碼輸入不同！')
            return res.redirect('/signup')
        } else {
            // confirm unique user
            User.findOne({ where: { email: req.body.email } }).then(user => {
                if (user) {
                    req.flash('error_messages', '信箱重複！')
                    return res.redirect('/signup')
                } else {
                    User.create({
                        name: req.body.name,
                        email: req.body.email,
                        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
                    }).then(user => {
                        return res.redirect('/signin')
                    })
                }
            })
        }
    },

    signInPage: (req, res) => {
        return res.render('signin')
    },

    signIn: (req, res) => {
        console.log(req.user.email)
        req.flash('success_messages', '成功登入！')
        res.redirect('/restaurants')
    },

    logout: (req, res) => {
        req.flash('success_messages', '登出成功！')
        req.logout()
        res.redirect('/signin')
    },

    getUser: (req, res) => {
        return User.findByPk(req.user.id, {
            include: [
                Comment,
                { model: Comment, include: [Restaurant] }
            ]
        }).then(user => {
            return res.render('users', { user: user.toJSON() })
        })
    },
    editUser: (req, res) => {
        return User.findByPk(req.params.id)
            .then(user => {
                return res.render('profile_edit')
            })
    },
    putUser: (req, res) => {
        console.log(req.body.name)
        if (!req.body.name) {
            req.flash('error_messages', "name didn't exist")
            return res.redirect('back')
        }
        const { file } = req
        if (file) {
            imgur.setClientID(IMGUR_CLIENT_ID)
            imgur.upload(file.path, (err, img) => {
                return User.findByPk(req.params.id)
                    .then((user) => {
                        user.update({
                            name: req.body.name,
                            image: file ? img.data.link : user.image
                        })
                            .then((user) => {
                                req.flash('success_messages', 'profile was successfully to update')
                                res.redirect('/users/:id')
                            })
                    })
            })
        } else {
            return User.findByPk(req.params.id)
                .then((user) => {
                    user.update({
                        name: req.body.name,
                        image: user.image
                    })
                        .then((user) => {
                            req.flash('success_messages', 'profile was successfully to update')
                            res.redirect('/users/:id')
                        })
                })
        }

    },
    addFavorite: (req, res) => {
        return Favorite.create({
            UserId: req.user.id,
            RestaurantId: req.params.restaurantId
        })
            .then((restaurnat) => {
                return res.redirect('back')
            })
    },
    removeFavorite: (req, res) => {
        return Favorite.findOne({
            where: {
                UserId: req.user.id,
                RestaurantId: req.params.restaurantId
            }
        })
            .then((favorete) => {
                Favorite.destroy()
                    .then((restaurnat) => {
                        return res.redirect('back')
                    })
            })
    }
}

module.exports = userController