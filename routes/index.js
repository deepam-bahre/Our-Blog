const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/about", (req, res) => {
  res.render("pages/about");
});

router.get("/design", (req, res) => {
  res.render("pages/services/design");
});
router.get("/development", (req, res) => {
  res.render("pages/services/development");
});
router.get("/marketing", (req, res) => {
  res.render("pages/services/marketing");
});
router.get("/support", (req, res) => {
  res.render("pages/services/support");
});

router.get("/contact", (req, res) => {
  res.render("pages/contact");
});

module.exports = router;
