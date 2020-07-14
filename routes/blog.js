// Importing Express Router
const router = require('express').Router();

// Importing Blog Controllers
const BlogController = require('../controllers/blog');

// Importing Multer
const multer = require("multer");

// Middleware Import To Make Sure User is Logged to Add, Edit and Delete Blogs
const isLoggedIn = require('../middleware/middleware').isLoggedIn;


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
  })

  var upload = multer({ storage: storage })


// Get All Blogs
router.get('/', BlogController.GetAllBlogs);

// =================================================
//  BLOG ADD ROUTES
// =================================================

// Loads Add View
router.get('/add', (req, res) => {
    res.render('blog/add');
});


// Handles Add Blog
router.post('/', upload.single('blogImage'), isLoggedIn, BlogController.AddBlogs);

// =================================================
//  BLOG SHOW ROUTE
// =================================================

// Loads And Displays A Single Blog
router.get('/:id', BlogController.GetSingleBlogs);

// =================================================
//  EDIT BLOG ROUTES
// =================================================

// Loads Edit View
router.get('/:id/edit', isLoggedIn, BlogController.GetEditBlogs);

// Handles Update Blog
router.put('/:id', isLoggedIn, BlogController.UpdateBlogs);

// =================================================
//  DELETE BLOG ROUTES
// =================================================

// Loads Delete View
router.get('/:id/delete', isLoggedIn, BlogController.GetDeleteBlogs);

// Handles Delete Blog
router.delete('/:id', isLoggedIn, BlogController.DeleteBlogs);

// Exports Our Blog Routes
module.exports = router;




