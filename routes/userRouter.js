const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const { restrictToLoggedInUser } = require("../middlewares/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const router = Router();

const {
  userLogin,
  userSignUp,
  handleUserSignUp,
  handleUserLogin,
  userLogout,
  showUserProfile,
  updatePersonalDetails,
  updateProfilePhoto,
  updatePassword,
} = require("../controllers/user");

router
  .route("/signup")
  .get(userSignUp)
  .post(upload.single("profileImage"), handleUserSignUp);

router.route("/login").get(userLogin).post(handleUserLogin);

router.route("/profile").get(restrictToLoggedInUser, showUserProfile);

router
  .route("/update-profile")
  .post(restrictToLoggedInUser, updatePersonalDetails);

router
  .route("/upload-avatar")
  .post(restrictToLoggedInUser, upload.single("avatar"), updateProfilePhoto);

router
  .route("/change-password")
  .post(restrictToLoggedInUser, upload.none(), updatePassword);

router.route("/logout").post(userLogout);
module.exports = router;
