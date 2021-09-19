const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');
const Category = require('../models/category');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const { sortBy } = require('lodash');


exports.getProductById = (req, res, next, id) => {
    Product.findById(id).populate('category').sort().exec((err, product) => {
        if (err) {
            return res.status(400).json({
                error: "NO PRODUCT FOUND FOR THIS USER"
            })
        }
        req.product = product;
        next();
    })
}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;


    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "files is not in correct formate"
            })
        }

        //destructure the fields
        const { price, name, description, category, stock } = fields;
        console.log(price, name, description, category, stock)
        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: "Required fields are missing"
            })
        }

        let product = new Product(fields);

        //handling files here
        if (files.photo) {
            if (files.photo.size > 3333333) {
                return res.status(400).json({
                    error: "files size is too big !"
                })
            }
            //adding photo into db
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        //saving to the database
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: `you are not able to save photo b/c of ${err}`
                })
            }
            res.json(product)
        })

    })
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined
    return res.json(
        req.product
    )
}

// we send the photo in the background with help of middle ware
exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data)
    }
    next();
}

//delete product
exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: `Not able to delete ${deletedProduct} product`
            })
        }
        res.json({
            message: `${deletedProduct} product deleted successfully`
        })
    })
}

//update product
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "files is not in correct formate"
            })
        }

        let product = req.product;
        product = _.extend(product, fields)


        //handling files here
        if (files.photo) {
            if (files.photo.size > 3333333) {
                return res.status(400).json({
                    error: "files size is too big !"
                })
            }
            //adding photo into db
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        //saving to the database
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: `you are not able to update photo b/c of ${err}`
                })
            }
            res.json(product)
        })

    })
}

//Getting all products
exports.getAllProduct = (req, res) => {
    let limit = req.query.limit ? req.query.limit : 10;
    let sort = req.query.sort ? req.query.sort : '_id';
    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy, "asc"]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "NO PRODUCT FOUND"
                })
            }
            res.json(products)
        })
}

exports.getAllUniqueCategories =(req,res) =>{
    Product.distinct("category",{},(err,category) =>{
        if(err){
            return res.status(400).json({
                error : "NO category found"
            })
        }
        res.json(category)
    })
}


//middleware 
exports.updateStock = (req, res, next) => {
    let myOperation = req.body.Order.product.map(prod => {
        return {
            updateOne: {
                filter: { _id: prod._id },
                update: { $inc: { stock: -prod.count, sold: +prod.count } }
            }
        }
    })
    Product.bulkWrite(myOperation,{},(err,products) =>{
        if(err){
            return  res.status(400).json({
                error:"Bulk Operation failed"
            })
        }
        next();
    })
    
}