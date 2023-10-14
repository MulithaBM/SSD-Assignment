const express = require("express");
const authCtrl = require("../controllers/authController");
const auth = require("../middlewares/auth");
const rateLimiter = require("../middlewares/rateLimiter");

const router = express.Router();

// register route
router.post("/register", rateLimiter, authCtrl.register);

// verify and active account route
router.post("/active", authCtrl.activeAccount);

// login route

router.post("/login", rateLimiter, authCtrl.login);

// logout route must be authenticated

router.get("/logout", auth, authCtrl.logout);

// refresh token route

router.get("/refresh_token", authCtrl.refreshToken);

// google login route
router.post("/google_login", authCtrl.googleLogin);

module.exports = router;
