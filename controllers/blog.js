
// Importing mongoose
const mongoose = require('mongoose');

// Importing Blog model
const Blog = require('../models/blog');

const cloudinary = require('cloudinary').v2
require('../handlers/cloudinary')



// Get All Blogs
const GetAllBlogs = (req, res) => {
    Blog.find({})
    .then(blogs => {
        res.render('blog/index', { blogs });
    })
    .catch(err => {
        //req.flash('error','Failed to load blogs.');
        res.redirect('/');
    });
};

// =================================================
//  BLOG ADD ROUTES
// =================================================


// Handles Add Blog
const AddBlogs = (req, res) => {
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
};

// =================================================
//  BLOG SHOW ROUTE
// =================================================

// Loads And Displays A Single Blog
const GetSingleBlogs = (req, res) => {

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
};

// =================================================
//  EDIT BLOG ROUTES
// =================================================

// Loads Edit View
const GetEditBlogs= (req, res) => {

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
};

// Handles Update Blog
const UpdateBlogs= (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body)
    .then(blog => {
        //req.flash('success','Blog updated.');
        res.redirect('/blogs');
    })
    .catch(err => {
        //req.flash('error','Failed to update the blog.');
        res.redirect(`/blogs/${req.params.id}`);
    });
};

// =================================================
//  DELETE BLOG ROUTES
// =================================================

// Loads Delete View
const GetDeleteBlogs=(req, res) => {
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
};

// Handles Delete Blog
const DeleteBlogs= (req, res) => {
    Blog.findByIdAndRemove(req.params.id)
    .then(() => {
        //req.flash('success', 'Blog deleted.');
        res.redirect('/blogs');
    })
    .catch(err => {
        req.flash('error','Failed to delete blog.');
        res.redirect(`/blogs/${req.params.id}`);
    });
};

// Exports Our Blog Routes
module.exports = {
    GetAllBlogs,AddBlogs,GetSingleBlogs,GetEditBlogs,UpdateBlogs,GetDeleteBlogs,DeleteBlogs
};




