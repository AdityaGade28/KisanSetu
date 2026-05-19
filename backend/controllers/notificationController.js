import Notification from '../models/Notification.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    let notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Seed mock alert items on first load to immediately display vibrant alert dashboard
    if (notifications.length === 0) {
      const mockAlerts = [
        {
          user: req.user._id,
          title: 'Meteorological Sowing Alert',
          message: 'Temperature & soil humidity levels in Nashik are optimal for sowing Wheat crops today.',
          type: 'weather'
        },
        {
          user: req.user._id,
          title: 'Regional Pathological Advisory',
          message: 'Warning: Tomato Leaf Blight detected in a neighboring district. Inspect crop leaves via Disease AI.',
          type: 'disease'
        },
        {
          user: req.user._id,
          title: 'Welfare Subsidy Update',
          message: 'New PM Krishi Sinchayee Yojana micro-irrigation subsidy applications are now active.',
          type: 'scheme'
        }
      ];

      await Notification.insertMany(mockAlerts);
      notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    }

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve alerts telemetry' });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id
// @access  Private
export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification) {
      if (notification.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      notification.read = true;
      await notification.save();
      res.json(notification);
    } else {
      res.status(404).json({ message: 'Notification alert not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
