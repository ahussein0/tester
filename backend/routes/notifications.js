const express = require('express');
const router = express.Router();

// In-memory storage for notifications
let notifications = [];

// Helper function to create notification
function createNotification(type, message, userId, metadata = {}) {
    return {
        id: Date.now().toString(),
        type,
        message,
        userId,
        metadata,
        isRead: false,
        createdAt: new Date(),
        readAt: null
    };
}

// Get User Notifications
router.get('/', (req, res) => {
    try {
        const userId = req.headers['user-id'];
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Get user's notifications and sort by date
        const userNotifications = notifications
            .filter(notif => notif.userId === userId)
            .sort((a, b) => b.createdAt - a.createdAt);

        res.json(userNotifications);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching notifications', 
            error: error.message 
        });
    }
});

// Add Notification
router.post('/', (req, res) => {
    try {
        const { type, message, userId, metadata } = req.body;

        // Validation
        if (!message || !type || !userId) {
            return res.status(400).json({ message: 'Message, type, and userId are required' });
        }

        const notification = createNotification(type, message, userId, metadata);
        notifications.push(notification);

        res.status(201).json({ 
            message: 'Notification added successfully',
            notification 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating notification', 
            error: error.message 
        });
    }
});

// Mark Notification as Read
router.put('/:id/read', (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers['user-id'];

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const notification = notifications.find(n => n.id === id && n.userId === userId);
        
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.isRead = true;
        notification.readAt = new Date();

        res.json({ 
            message: 'Notification marked as read',
            notification 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating notification', 
            error: error.message 
        });
    }
});

// Mark All Notifications as Read
router.put('/read-all', (req, res) => {
    try {
        const userId = req.headers['user-id'];

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const currentTime = new Date();
        const userNotifications = notifications.filter(n => n.userId === userId);
        
        userNotifications.forEach(notification => {
            if (!notification.isRead) {
                notification.isRead = true;
                notification.readAt = currentTime;
            }
        });

        res.json({ 
            message: 'All notifications marked as read',
            count: userNotifications.length
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating notifications', 
            error: error.message 
        });
    }
});

// Delete Notification
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers['user-id'];

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const index = notifications.findIndex(n => n.id === id && n.userId === userId);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notifications.splice(index, 1);
        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting notification', 
            error: error.message 
        });
    }
});

// Clear All Read Notifications
router.delete('/clear-read', (req, res) => {
    try {
        const userId = req.headers['user-id'];

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const initialCount = notifications.length;
        notifications = notifications.filter(n => !n.isRead || n.userId !== userId);
        
        const deletedCount = initialCount - notifications.length;
        res.json({ 
            message: 'Read notifications cleared successfully',
            deletedCount
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error clearing notifications', 
            error: error.message 
        });
    }
});

// Get Unread Count
router.get('/unread-count', (req, res) => {
    try {
        const userId = req.headers['user-id'];

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const unreadCount = notifications.filter(
            n => n.userId === userId && !n.isRead
        ).length;

        res.json({ unreadCount });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error getting unread count', 
            error: error.message 
        });
    }
});

// Helper functions to create specific types of notifications
function createEventNotification(userId, eventName, eventId) {
    const notification = createNotification(
        'EVENT',
        `New event available: ${eventName}`,
        userId,
        { eventId }
    );
    notifications.push(notification);
    return notification;
}

function createMatchNotification(userId, eventName, eventId) {
    const notification = createNotification(
        'MATCH',
        `You've been matched to event: ${eventName}`,
        userId,
        { eventId }
    );
    notifications.push(notification);
    return notification;
}

function createReminderNotification(userId, eventName, eventId, eventDate) {
    const notification = createNotification(
        'REMINDER',
        `Reminder: ${eventName} is coming up on ${new Date(eventDate).toLocaleDateString()}`,
        userId,
        { eventId, eventDate }
    );
    notifications.push(notification);
    return notification;
}

// Export router and helper functions
module.exports = router;