const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const { restrictToLoggedInUser } = require("../middlewares/auth");
const router = Router();
const {
  createBlog,
  postBlog,
  uploadImage,
  getBlogbyId,
  myBlogs,
  editBlog,
  updateBlog,
  deleteBlogById,
} = require("../controllers/blog");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "image-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

router
  .route("/create")
  .get(restrictToLoggedInUser, createBlog)
  .post(restrictToLoggedInUser, upload.single("coverImage"), postBlog);

router.post(
  "/upload-image",
  restrictToLoggedInUser,
  upload.single("image"),
  uploadImage
);

router.get("/myblogs", restrictToLoggedInUser, myBlogs);

router
  .route("/edit/:blogid")
  .get(restrictToLoggedInUser, editBlog)
  .post(restrictToLoggedInUser, upload.single("coverImage"), updateBlog);

router.get("/delete/:blogid", restrictToLoggedInUser, deleteBlogById);

router.get("/:blogid", restrictToLoggedInUser, getBlogbyId);

module.exports = router;
