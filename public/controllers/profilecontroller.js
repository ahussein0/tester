const User = require('../models/user');

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.headers['user-id'];
        const updatedData = req.body;

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.headers['user-id'];
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
