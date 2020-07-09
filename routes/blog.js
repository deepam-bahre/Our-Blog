// Importing Express Router
const router = require('express').Router();

// Importing mongoose
const mongoose = require('mongoose');

// Importing Blog model
const Blog = require('../models/blog');

// Importing Multer
const multer = require("multer");

// Middleware Import To Make Sure User is Logged to Add, Edit and Delete Blogs
const isLoggedIn = require('../middleware/middleware').isLoggedIn;

const cloudinary = require('cloudinary').v2
require('../handlers/cloudinary')



// =================================================
//  Multer
// =================================================

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
router.get('/', (req, res) => {
    Blog.find({})
    .then(blogs => {
        res.render('blog/index', { blogs });
    })
    .catch(err => {
        //req.flash('error','Failed to load blogs.');
        res.redirect('/');
    });
});

// =================================================
//  BLOG ADD ROUTES
// =================================================

// Loads Add View
router.get('/add', (req, res) => {
    res.render('blog/add');
});


// Handles Add Blog
router.post('/', upload.single('blogImage'), isLoggedIn, (req, res) => {
    cloudinary.uploader.upload(req.file.path).then((result) => {
    // Makes a new object that will be used to create blog. Uses spread operator.
    const newBlog = new Blog({
        _id : new mongoose.Types.ObjectId(),
        title : req.body.title,
        blogImage : result.url,
        content : req.body.content,
        author : req.user.username
    });

    newBlog.save()
    .then(blog => {
        //req.flash('success','Blog created.');
        res.redirect('/blogs');
    })
    .catch(err => {
        //req.flash('error','Failed to create blog.');
        res.redirect('/blogs');
    });
}).catch((error) => {
    response.status(500).send({
      message: "failure",
      error,
    });
  });
});

// =================================================
//  BLOG SHOW ROUTE
// =================================================

// Loads And Displays A Single Blog
router.get('/:id', (req, res) => {

    // Grabs in req.params.id
    const { id } = req.params;

    Blog.findById(id)
    .then(blog => {
        res.render('blog/show', { blog, time: blog.time.toDateString() });
    })
    .catch(err => {
        //req.flash('error','Failed to load blog.');
        res.redirect('/blogs');
    });
});

// =================================================
//  EDIT BLOG ROUTES
// =================================================

// Loads Edit View
router.get('/:id/edit', isLoggedIn, (req, res) => {

    // Grabs in req.params.id
    const { id } = req.params;

    Blog.findById(id)
    .then(blog => {
        res.render('blog/edit', { blog });
    })
    .catch(err => {
        //req.flash('error','Failed to load blog for edit.');
        res.redirect(`/blogs/${id}`);
    });
});

// Handles Update Blog
router.put('/:id', isLoggedIn, (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body)
    .then(blog => {
        //req.flash('success','Blog updated.');
        res.redirect('/blogs');
    })
    .catch(err => {
        //req.flash('error','Failed to update the blog.');
        res.redirect(`/blogs/${req.params.id}`);
    });
});

// =================================================
//  DELETE BLOG ROUTES
// =================================================

// Loads Delete View
router.get('/:id/delete', isLoggedIn, (req, res) => {
    // Grabs in req.params.id
    const { id } = req.params;

    Blog.findById(id)
    .then(blog => {
        res.render('blog/delete', { blog });
    })
    .catch(err => {
        //req.flash('error','Failed to load blog for delete.');
        res.redirect(`/blogs/${id}`);
    });
});

// Handles Delete Blog
router.delete('/:id', isLoggedIn, (req, res) => {
    Blog.findByIdAndRemove(req.params.id)
    .then(() => {
        //req.flash('success', 'Blog deleted.');
        res.redirect('/blogs');
    })
    .catch(err => {
        req.flash('error','Failed to delete blog.');
        res.redirect(`/blogs/${req.params.id}`);
    });
});

// Exports Our Blog Routes
module.exports = router;




