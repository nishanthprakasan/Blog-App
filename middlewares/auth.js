const User = require("../models/user");

async function restrictToLoggedInUser(req, res, next) {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user) {
        req.user = user;
        return next();
      }
    } catch (error) {
      console.error("Auth error:", error);
    }
  }

  return res.redirect("/user/login");
}

module.exports = {
  restrictToLoggedInUser,
};
