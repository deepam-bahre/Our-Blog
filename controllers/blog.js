// Importing mongoose
const mongoose = require("mongoose");

// Importing Blog model
const Blog = require("../models/blog");
const memoryStore = require("../config/memoryStore");

const cloudinary = require("cloudinary").v2;
require("../handlers/cloudinary");

const isMongoActive = () => mongoose.connection.readyState === 1;

// Get All Blogs
const GetAllBlogs = async (req, res) => {
  if (isMongoActive()) {
    try {
      const blogs = await Blog.find({}).sort({ time: -1 });
      return res.render("blog/index", { blogs });
    } catch (err) {
      console.warn("MongoDB query failed, falling back to memory store:", err.message);
    }
  }

  const blogs = memoryStore.getBlogs();
  res.render("blog/index", { blogs });
};

// =================================================
//  BLOG ADD ROUTES
// =================================================

// Handles Add Blog
const AddBlogs = async (req, res) => {
  try {
    let imageUrl = "/images/blogs/blog-banner.jpg";

    if (req.file) {
      const hasCloudinary =
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET;

      if (hasCloudinary) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path);
          imageUrl = result.url || result.secure_url;
        } catch (cloudErr) {
          console.warn("Cloudinary upload failed, using local file:", cloudErr.message);
          imageUrl = `/uploads/${req.file.filename}`;
        }
      } else {
        imageUrl = `/uploads/${req.file.filename}`;
      }
    }

    const blogData = {
      title: req.body.title || "Untitled",
      blogImage: imageUrl,
      content: req.body.content || "",
      author: (req.user && req.user.username) || "Author",
    };

    if (isMongoActive()) {
      try {
        const newBlog = new Blog({
          _id: new mongoose.Types.ObjectId(),
          ...blogData,
        });
        await newBlog.save();
        req.flash("success", "Blog created successfully!");
        return res.redirect("/blogs");
      } catch (err) {
        console.warn("MongoDB save failed, saving to memory store:", err.message);
      }
    }

    memoryStore.createBlog(blogData);
    req.flash("success", "Blog created successfully!");
    res.redirect("/blogs");
  } catch (error) {
    console.error("Error in AddBlogs:", error);
    req.flash("error", "Failed to create blog.");
    res.redirect("/blogs");
  }
};

// =================================================
//  BLOG SHOW ROUTE
// =================================================

// Loads And Displays A Single Blog
const GetSingleBlogs = async (req, res) => {
  const { id } = req.params;

  if (isMongoActive() && mongoose.isValidObjectId(id)) {
    try {
      const blog = await Blog.findById(id);
      if (blog) {
        const timeStr = blog.time ? new Date(blog.time).toDateString() : new Date().toDateString();
        return res.render("blog/show", { blog, time: timeStr });
      }
    } catch (err) {
      console.warn("MongoDB findById failed, checking memory store:", err.message);
    }
  }

  const blog = memoryStore.getBlogById(id);
  if (blog) {
    const timeStr = blog.time ? new Date(blog.time).toDateString() : new Date().toDateString();
    return res.render("blog/show", { blog, time: timeStr });
  }

  req.flash("error", "Blog not found.");
  res.redirect("/blogs");
};

// =================================================
//  EDIT BLOG ROUTES
// =================================================

// Loads Edit View
const GetEditBlogs = async (req, res) => {
  const { id } = req.params;

  if (isMongoActive() && mongoose.isValidObjectId(id)) {
    try {
      const blog = await Blog.findById(id);
      if (blog) {
        return res.render("blog/edit", { blog });
      }
    } catch (err) {
      console.warn("MongoDB findById failed:", err.message);
    }
  }

  const blog = memoryStore.getBlogById(id);
  if (blog) {
    return res.render("blog/edit", { blog });
  }

  req.flash("error", "Blog not found for edit.");
  res.redirect(`/blogs/${id}`);
};

// Handles Update Blog
const UpdateBlogs = async (req, res) => {
  const { id } = req.params;
  const updateData = {
    title: req.body.title,
    content: req.body.content,
  };

  if (isMongoActive() && mongoose.isValidObjectId(id)) {
    try {
      const updated = await Blog.findByIdAndUpdate(id, updateData, { new: true });
      if (updated) {
        req.flash("success", "Blog updated successfully.");
        return res.redirect("/blogs");
      }
    } catch (err) {
      console.warn("MongoDB update failed:", err.message);
    }
  }

  memoryStore.updateBlog(id, updateData);
  req.flash("success", "Blog updated successfully.");
  res.redirect("/blogs");
};

// =================================================
//  DELETE BLOG ROUTES
// =================================================

// Loads Delete View
const GetDeleteBlogs = async (req, res) => {
  const { id } = req.params;

  if (isMongoActive() && mongoose.isValidObjectId(id)) {
    try {
      const blog = await Blog.findById(id);
      if (blog) {
        return res.render("blog/delete", { blog });
      }
    } catch (err) {
      console.warn("MongoDB delete view find failed:", err.message);
    }
  }

  const blog = memoryStore.getBlogById(id);
  if (blog) {
    return res.render("blog/delete", { blog });
  }

  req.flash("error", "Blog not found.");
  res.redirect(`/blogs/${id}`);
};

// Handles Delete Blog
const DeleteBlogs = async (req, res) => {
  const { id } = req.params;

  if (isMongoActive() && mongoose.isValidObjectId(id)) {
    try {
      await Blog.findByIdAndDelete(id);
      req.flash("success", "Blog deleted successfully.");
      return res.redirect("/blogs");
    } catch (err) {
      console.warn("MongoDB delete failed:", err.message);
    }
  }

  memoryStore.deleteBlog(id);
  req.flash("success", "Blog deleted successfully.");
  res.redirect("/blogs");
};

// Exports Our Blog Routes
module.exports = {
  GetAllBlogs,
  AddBlogs,
  GetSingleBlogs,
  GetEditBlogs,
  UpdateBlogs,
  GetDeleteBlogs,
  DeleteBlogs,
};
