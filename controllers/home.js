const Blogs = require("../models/blog");

async function getHomepage(req, res) {
  const currUser = req.session.userId;

  const blogs = await Blogs.find({ author: { $ne: currUser } }).sort({
    createdAt: -1,
  });
  return res.render("home", { user: req.user, blogs: blogs });
}

module.exports = {
  getHomepage,
};
