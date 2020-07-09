const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  blogImage: String,
  content: String,
  short_content: String,
  time: {
    type: Date,
    default: Date.now,
  },
  author: String,
});

// Blog Hook to do something with the doc before it is save.
blogSchema.post("validate", (doc, next) => {
  doc.short_content = doc.content.substr(0, 64) + "...";
  next();
});

// Export Our Blog Model
module.exports = mongoose.model("Blog", blogSchema);
