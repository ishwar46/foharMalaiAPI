const express = require("express");
const {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser,
} = require("../controllers/userController");
const { authGuard, authGuardAdmin } = require("../middleware/authGuard");
const router = express.Router();

router
    .route("/profile")
    .get(authGuard, getUserProfile)
    .put(authGuard, updateUserProfile);

router.route("/all").get(authGuardAdmin, getAllUsers);

router.route("/:id").delete(authGuardAdmin, deleteUser);

module.exports = router;