const User = require("../model/userModel");

// Get user profile
exports.getUserProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        res.json({
            success: true,
            message: "User profile retrieved successfully",
            data: user,
        });
    } catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Server Error", error: error.message });
    }
};

// Update user profile
exports.updateUserProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        user.fullName = req.body.fullName || user.fullName;
        user.email = req.body.email || user.email;
        user.username = req.body.username || user.username;
        user.address = req.body.address || user.address;
        user.mobileNo = req.body.mobileNo || user.mobileNo;
        user.image = req.body.image || user.image;

        const updatedUser = await user.save();
        res.json({
            success: true,
            message: "User profile updated successfully",
            data: {
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                username: updatedUser.username,
                address: updatedUser.address,
                mobileNo: updatedUser.mobileNo,
                image: updatedUser.image,
            },
        });
    } catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Server Error", error: error.message });
    }
};

// Get all users (Admin only)
exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({
            success: true,
            message: "All users retrieved successfully",
            data: users,
        });
    } catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Server Error", error: error.message });
    }
};

// Delete user (Admin only)
exports.deleteUser = async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Server Error", error: error.message });
    }
};