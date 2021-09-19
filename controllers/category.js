const User = require('../models/user');
const Order = require('../models/order');
const Category = require('../models/category');


exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err) {
            return res.status(400).json({
                error: "No such Category Found for this id"
            })
        }
        req.category = category;
        next();
    })
}

exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, category) => {
        if (err) {
            return res.status(400).json({
                error: " You are not permitted to change in Category"
            })
        }
        category.id = undefined;
        res.json({ category })
    })
}

exports.getAllCategory = (req, res) => {
    Category.find().exec((err, items) => {
        if (err) {
            return res.status(400).json({
                error: "No CATEGORY FOUND"
            })
        }
        res.json(items)
    })
}

exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err, updatedCategory) => {
        if (err) {
            return res.status(400).json({
                error: "Filed to updated Category."
            })
        }
        res.json(updatedCategory)
    })
}

exports.deleteCategory = (req, res) => {
    const category = req.category;
    console.log(req.category);
    category.remove((err,category) =>{
        if(err){
            return res.status(400).json({
                error:`Filed to deleted this ${category}`
            })
        }
        res.json({
            message :`${category} deleted Successfully`
        }) 
    })
}
