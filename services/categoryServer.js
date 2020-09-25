const db = require('../models')
const Category = db.Category

const categoryService = {
    getCategories: (req, res, callback) => {
        return Category.findAll({
            raw: true,
            nest: true
        }).then(categories => {
            if (req.params.id) {
                Category.findByPk(req.params.id)
                    .then((category) => {
                        return res.render('admin/categories', {
                            categories: categories,
                            category: category.toJSON()
                        })
                    })
            } else {
                callback({ categories: categories })
            }
        })
    },
    postCategory: (req, res, callback) => {
        if (!req.body.name) {
            return callback({ status: 'error', message: 'name didn\'t exist' })
        } else {
            return Category.create({
                name: req.body.name
            })
                .then((category) => {
                    res.redirect('/admin/categories')
                })
        }
    }
}

module.exports = categoryService