const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Untitled",
  },
  blogImage: {
    type: String,
    default: "/images/blogs/blog-banner.jpg",
  },
  content: {
    type: String,
    default: "",
  },
  short_content: {
    type: String,
    default: "",
  },
  time: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: String,
    default: "Author",
  },
});

// Blog Hook to generate snippet before saving
blogSchema.pre("save", function (next) {
  if (this.content) {
    this.short_content =
      this.content.length > 64 ? this.content.substring(0, 64) + "..." : this.content;
  } else {
    this.short_content = "";
  }
  next();
});

// Export Our Blog Model
module.exports = mongoose.model("Blog", blogSchema);
