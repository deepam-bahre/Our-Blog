const crypto = require("crypto");

function generateId() {
  return crypto.randomBytes(12).toString("hex");
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

// Initial seed blogs using existing assets in /uploads
const blogs = [
  {
    _id: "60f1a5b8e9b1d836248e0001",
    title: "The Excitement of Modern Cricket",
    blogImage: "/uploads/1594233130687Cricket.jpg",
    content: "Cricket is a beloved bat-and-ball sport played between two teams of eleven players. From traditional five-day test matches to the high-octane excitement of twenty-over leagues, modern cricket showcases extraordinary tactical nuance, athletic fielding, and masterclass batting performances.",
    short_content: "Cricket is a beloved bat-and-ball sport played between two teams of eleven players...",
    time: new Date("2024-05-12T10:00:00Z"),
    author: "Deepam"
  },
  {
    _id: "60f1a5b8e9b1d836248e0002",
    title: "World Football: The Beautiful Game",
    blogImage: "/uploads/1594233175497Football.jpg",
    content: "Football unites billions of fans worldwide. Whether playing in local neighborhood pitches or competing on world stage tournaments, the combination of tactical strategy, lightning passes, and dramatic stoppage-time goals makes football universally captivating.",
    short_content: "Football unites billions of fans worldwide. Whether playing in local neighborhood pitches...",
    time: new Date("2024-06-01T14:30:00Z"),
    author: "SportsDesk"
  },
  {
    _id: "60f1a5b8e9b1d836248e0003",
    title: "Speed and Precision in Field Hockey",
    blogImage: "/uploads/1594233214477Hockey.jpg",
    content: "Field hockey requires incredible cardiovascular endurance, lightning-quick reflexes, and pinpoint stick handling. Rapid turnovers, clever penalty corner routines, and aggressive goalkeeping make every minute thrilling to watch.",
    short_content: "Field hockey requires incredible cardiovascular endurance, lightning-quick reflexes...",
    time: new Date("2024-06-18T09:15:00Z"),
    author: "Deepam"
  },
  {
    _id: "60f1a5b8e9b1d836248e0004",
    title: "Grand Slam Drama on the Tennis Court",
    blogImage: "/uploads/1594233652803Tennis.jpg",
    content: "From the iconic grass lawns of Wimbledon to the clay courts of Roland Garros, tennis presents one of sports' greatest tests of mental fortitude and raw skill. Masterful aces, baseline rallies, and championship tiebreaks keep spectators on the edge of their seats.",
    short_content: "From the iconic grass lawns of Wimbledon to the clay courts of Roland Garros...",
    time: new Date("2024-07-04T16:45:00Z"),
    author: "Admin"
  }
];

// In-memory users with initial demo accounts
const users = [];

function initDemoUsers() {
  const salt = crypto.randomBytes(16).toString("hex");
  users.push({
    _id: "60f1a5b8e9b1d836248e00a1",
    username: "demo",
    email: "demo@ourblog.com",
    salt: salt,
    hash: hashPassword("demo123", salt)
  });
  const salt2 = crypto.randomBytes(16).toString("hex");
  users.push({
    _id: "60f1a5b8e9b1d836248e00a2",
    username: "admin",
    email: "admin@ourblog.com",
    salt: salt2,
    hash: hashPassword("admin123", salt2)
  });
}
initDemoUsers();

const contacts = [];

module.exports = {
  // BLOGS
  getBlogs: () => {
    return [...blogs].sort((a, b) => new Date(b.time) - new Date(a.time));
  },

  getBlogById: (id) => {
    return blogs.find((b) => String(b._id) === String(id)) || null;
  },

  createBlog: ({ title, blogImage, content, author }) => {
    const short_content = content && content.length > 64 ? content.substring(0, 64) + "..." : (content || "");
    const newBlog = {
      _id: generateId(),
      title: title || "Untitled Blog",
      blogImage: blogImage || "/images/blogs/blog-banner.jpg",
      content: content || "",
      short_content,
      time: new Date(),
      author: author || "Author"
    };
    blogs.unshift(newBlog);
    return newBlog;
  },

  updateBlog: (id, { title, content }) => {
    const blog = blogs.find((b) => String(b._id) === String(id));
    if (!blog) return null;
    if (title !== undefined) blog.title = title;
    if (content !== undefined) {
      blog.content = content;
      blog.short_content = content.length > 64 ? content.substring(0, 64) + "..." : content;
    }
    return blog;
  },

  deleteBlog: (id) => {
    const index = blogs.findIndex((b) => String(b._id) === String(id));
    if (index !== -1) {
      return blogs.splice(index, 1)[0];
    }
    return null;
  },

  // USERS
  getUserByUsername: (username) => {
    return users.find((u) => u.username.toLowerCase() === (username || "").toLowerCase()) || null;
  },

  getUserById: (id) => {
    return users.find((u) => String(u._id) === String(id)) || null;
  },

  registerUser: ({ username, email, password }) => {
    const existing = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      throw new Error("A user with the given username or email is already registered");
    }
    const salt = crypto.randomBytes(16).toString("hex");
    const newUser = {
      _id: generateId(),
      username,
      email,
      salt,
      hash: hashPassword(password, salt)
    };
    users.push(newUser);
    return newUser;
  },

  verifyUserPassword: (username, password) => {
    const user = users.find((u) => u.username.toLowerCase() === (username || "").toLowerCase());
    if (!user) return false;
    const computedHash = hashPassword(password, user.salt);
    return computedHash === user.hash ? user : false;
  },

  // CONTACTS
  saveContact: (contactData) => {
    const contact = {
      _id: generateId(),
      ...contactData,
      createdAt: new Date()
    };
    contacts.push(contact);
    return contact;
  }
};
