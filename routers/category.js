const express = require('express')
const router = express.Router();

const { getCategoryById, createCategory, getAllCategory, updateCategory,deleteCategory } = require("../controllers/category");
const { isAuthenticated, isAdmin, isSignedIn } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");


// for extracting parameter
router.param('userId', getUserById)
router.param('categoryId', getCategoryById)


//Actual Router goes here
//creates  category
router.post('/category/create/:userId', isSignedIn, isAuthenticated, isAdmin, createCategory)

//read router
router.get('/category', getAllCategory)

//updates Router
router.put('/category/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, updateCategory)

//deleted Router == uncompleted
router.delete('/category/:category/:userId', isSignedIn, isAuthenticated, isAdmin, deleteCategory)

module.exports = router;