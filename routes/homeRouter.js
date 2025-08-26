const { Router } = require("express");
const { restrictToLoggedInUser } = require("../middlewares/auth");

const router = Router();

const { getHomepage, getBlogbyId } = require("../controllers/home");

router.get("/", restrictToLoggedInUser, getHomepage);

module.exports = router;
