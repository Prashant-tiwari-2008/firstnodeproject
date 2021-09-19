const express = require("express");
const router = express.Router();

const { isAdmin, isAuthenticated, isSignedIn } = require('../controllers/auth');
const { getCategoryById } = require('../controllers/category');
const { getUserById } = require('../controllers/user');
const { getProductById, createProduct, getProduct, photo, deleteProduct, updateProduct, getAllProduct,getAllUniqueCategories } = require('../controllers/product');

//for extracting parameter
router.param("userId", getUserById)
router.param("categoryId", getCategoryById)
router.param("productId", getProductById)

//Actual router goes here
//creating product
router.post('/product/create/:userId', isSignedIn, isAuthenticated, isAdmin, createProduct)
//read routes
router.get('/product/:productId', getProduct);
router.get("/product/photo/:productId", photo)

//listing router
router.get("/product", getAllProduct)

router.get("/product/categories",getAllUniqueCategories)

//delete Routes
router.delete('/product/:productId/:userId', isSignedIn, isAuthenticated, isAdmin, deleteProduct)

//update Router
router.put('/product/:productId/:userId', isSignedIn, isAuthenticated, isAdmin, updateProduct)



module.exports = router;