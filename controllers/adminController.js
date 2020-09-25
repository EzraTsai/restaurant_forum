const fs = require('fs')
const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = require('../services/adminService')

const adminController = {
    getRestaurants: (req, res) => {
        adminService.getRestaurants(req, res, (data) => {
            return res.render('admin/restaurants', data)
        })
    },
    createRestaurant: (req, res) => {
        Category.findAll({
            raw: true,
            nest: true
        }).then(categories => {
            return res.render('admin/create', {
                categories: categories
            })
        })
    },
    postRestaurant: (req, res) => {
        adminService.postRestaurant(req, res, (data) => {
            if (data['status'] === 'error') {
                req.flash('error_messages', data['message'])
                return res.redirect('back')
            }
            req.flash('success_messages', data['message'])
            res.redirect('/admin/restaurants')
        })
    },
    getRestaurant: (req, res) => {
        adminService.getRestaurant(req, res, (data) => {
            return res.render('admin/restaurant', data)
        })
    },
    editRestaurant: (req, res) => {
        Category.findAll({
            raw: true,
            nest: true
        }).then(categories => {
            return Restaurant.findByPk(req.params.id, {
                raw: true,
                nest: true
            }).then(restaurant => {
                return res.render('admin/create', {
                    categories: categories,
                    restaurant: restaurant
                })
            })
        })
    },
    putRestaurant: (req, res) => {
        adminService.putRestaurant(req, res, (data) => {
            if (data['status'] === 'error') {
                req.flash('error_messages', data['message'])
                return res.redirect('back')
            }
            req.flash('success_messages', data['message'])
            res.redirect('/admin/restaurants')
        })
    },
    deleteRestaurant: (req, res) => {
        adminService.deleteRestaurant(req, res, (data) => {
            if (data['status'] === 'success') {
                return res.redirect('/admin/restaurants')
            }
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