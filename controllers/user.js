const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const { createHmac } = require("node:crypto");

async function userSignUp(req, res) {
  return res.render("signup");
}

async function handleUserSignUp(req, res) {
  try {
    const { fullName, email, password } = req.body;
    let profileImageURL = "/images/default.png";
    if (req.file) {
      profileImageURL = `/uploads/${req.file.filename}`;
    }
    const user = new User({
      fullName,
      email,
      password,
      profileImageURL,
    });

    await user.save();
    res.redirect("/user/login");
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.render("signup", {
        error:
          "User with this email already exists. Please use a different email.",
      });
    }

    console.error(error);
    res.status(500).send("Error in creating profile.");
  }
}

async function userLogin(req, res) {
  return res.render("login");
}

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.render("login", {
        error: "Please provide both email and password",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", {
        error: "Invalid email or password",
      });
    }

    const hashedPassword = createHmac("sha256", user.salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== user.password) {
      return res.render("login", {
        error: "Invalid email or password",
      });
    }

    req.session.userId = user._id;
    res.cookie("uid", user._id.toString(), {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect("/home");
  } catch (error) {
    console.error("Login error:", error);
    res.render("login", {
      error: "An error occurred during login. Please try again.",
    });
  }
}

async function userLogout(req, res) {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        res.clearCookie("connect.sid");
        res.clearCookie("uid");
        return res.redirect("/user/login?error=logout_failed");
      }

      res.clearCookie("connect.sid");
      res.clearCookie("uid");

      res.redirect("/user/login?message=logout_success");
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.clearCookie("connect.sid");
    res.clearCookie("uid");
    res.redirect("/user/login?error=logout_failed");
  }
}

async function showUserProfile(req, res) {
  const currUser = req.session.userId;
  const user = await User.findOne({ _id: currUser });
  console.log(user);
  return res.render("userprofile", { user: user, error: null });
}

async function updatePersonalDetails(req, res) {
  try {
    const { email, name } = req.body;
    const currUserId = req.session.userId;
    const user = await User.findByIdAndUpdate(currUserId, {
      name: name,
      email: email,
    });
    return res.redirect("/user/profile?msg=updated successfully");
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.redirect("/user/profile?error=Email already exists");
    }

    console.error(error);
    res.status(500).send("Error in creating profile.");
  }
}

async function updateProfilePhoto(req, res) {
  try {
    const user = await User.findById(req.user._id);

    if (
      user.profileImageURL &&
      user.profileImageURL !== "/images/default.png"
    ) {
      const oldPath = path.join(
        __dirname,
        "..",
        user.profileImageURL.replace(/^\//, "")
      );
      fs.unlink(oldPath, (err) => {
        if (err) console.warn("Old file not deleted:", err.message);
      });
    }

    user.profileImageURL = `/uploads/${req.file.filename}`;
    await user.save();
    return res.redirect("/profile");
  } catch (err) {
    console.error("Error updating profile photo:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}
async function updatePassword(req, res) {
  try {
    const currPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const user = await User.findById(req.user._id);

    const hashedPassword = createHmac("sha256", user.salt)
      .update(currPassword)
      .digest("hex");

    if (hashedPassword !== user.password) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }

    user.password = newPassword;

    await user.save();

    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Error updating password:", err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
}

module.exports = {
  userSignUp,
  userLogin,
  handleUserSignUp,
  handleUserLogin,
  userLogout,
  showUserProfile,
  updatePersonalDetails,
  updateProfilePhoto,
  updatePassword,
};
