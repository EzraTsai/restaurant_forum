const fs = require('fs')
const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
    getRestaurants: (req, res) => {
        return Restaurant.findAll({
            raw: true,
            nest: true,
            include: [Category]
        }).then(restaurants => {
            return res.render('admin/restaurants', { restaurants: restaurants })
        })

    },
    createRestaurant: (req, res) => {
        return res.render('admin/create')
    },
    postRestaurant: (req, res) => {
        try {
            if (!req.body.name) {
                req.flash('error_messages', "name didn't exist")
                return res.redirect('back')
            }

            const { file } = req
            if (file) {
                imgur.setClientID(IMGUR_CLIENT_ID);
                imgur.upload(file.path, (err, img) => {
                    return Restaurant.create({
                        name: req.body.name,
                        tel: req.body.tel,
                        address: req.body.address,
                        opening_hours: req.body.opening_hours,
                        description: req.body.description,
                        image: file ? img.data.link : null,
                    }).then((restaurant) => {
                        req.flash('success_messages', 'restaurant was successfully created')
                        return res.redirect('/admin/restaurants')
                    })
                })
            }
            else {
                return Restaurant.create({
                    name: req.body.name,
                    tel: req.body.tel,
                    address: req.body.address,
                    opening_hours: req.body.opening_hours,
                    description: req.body.description,
                    image: null
                }).then((restaurant) => {
                    req.flash('success_messages', 'restaurant was successfully created')
                    return res.redirect('/admin/restaurants')
                })
            }
        } catch (err) {
            // 印出錯誤訊息
            console.log(err)
            // 讓程式遇到錯誤的時候，導回其他頁面
            return res.redirect('/admin/restaurants')
        }
    },
    getRestaurant: (req, res) => {
        return Restaurant.findByPk(req.params.id, {
            raw: true,
            nest: true,
            include: [Category]
        }).then(restaurant => {
            return res.render('admin/restaurant', {
                restaurant: restaurant
            })
        })
    },
    editRestaurant: (req, res) => {
        return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
            return res.render('admin/create', { restaurant: restaurant })
        })
    },
    putRestaurant: (req, res) => {
        if (!req.body.name) {
            req.flash('error_messages', "name didn't exist")
            return res.redirect('back')
        }

        const { file } = req
        if (file) {
            imgur.setClientID(IMGUR_CLIENT_ID);
            imgur.upload(file.path, (err, img) => {
                return Restaurant.findByPk(req.params.id)
                    .then((restaurant) => {
                        restaurant.update({
                            name: req.body.name,
                            tel: req.body.tel,
                            address: req.body.address,
                            opening_hours: req.body.opening_hours,
                            description: req.body.description,
                            image: file ? img.data.link : restaurant.image,
                        })
                            .then((restaurant) => {
                                req.flash('success_messages', 'restaurant was successfully to update')
                                res.redirect('/admin/restaurants')
                            })
                    })
            })
        }
        else {
            return Restaurant.findByPk(req.params.id)
                .then((restaurant) => {
                    restaurant.update({
                        name: req.body.name,
                        tel: req.body.tel,
                        address: req.body.address,
                        opening_hours: req.body.opening_hours,
                        description: req.body.description,
                        image: restaurant.image
                    })
                        .then((restaurant) => {
                            req.flash('success_messages', 'restaurant was successfully to update')
                            res.redirect('/admin/restaurants')
                        })
                })
        }
    },
    deleteRestaurant: (req, res) => {
        return Restaurant.findByPk(req.params.id)
            .then((restaurant) => {
                restaurant.destroy()
                    .then((restaurant) => {
                        res.redirect('/admin/restaurants')
                    })
            })
    },
    getUsers: (req, res) => {
        return User.findAll({ raw: true }).then(users => {
            return res.render('admin/users', { users: users })
        })
    },
    putUsers: (req, res) => {
        return User.findByPk(req.params.id)
            .then((user) => {
                if (user.email === 'root@example.com') {
                    req.flash('error_messages', "root's authority can't be modified")
                    return res.redirect('back')
                }
                if (user.isAdmin) {
                    user.update({ isAdmin: 0, })
                        .then((user) => {
                            console.log(user.isAdmin)
                            req.flash("success_messages", "user was successfully to update");
                            return res.redirect("/admin/users");
                        })
                } else {
                    user.update({ isAdmin: 1, })
                        .then((user) => {
                            console.log(user.isAdmin)
                            req.flash("success_messages", "user was successfully to update");
                            return res.redirect("/admin/users");
                        })
                }
            })
    }
}
module.exports = adminController