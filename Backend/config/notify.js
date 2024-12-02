const Notification = require('../models/notification'); // Adjust the path to your model

/**
 * Creates and saves a notification in the database.
 * @param {Object} options - The options for creating the notification.
 * @param {string} options.title - The title of the notification.
 * @param {string} options.route - The route associated with the notification.
 * @param {string} options.receiverId - The ID of the recipient.
 * @param {string} [options.status='unSeen'] - The status of the notification.
 * @param {Date} [options.date=new Date()] - The date of the notification.
 * @returns {Promise<Object>} - The saved notification object.
 */
const createNotification = async ({ title, route, reciverId, status = 'unSeen', date = new Date() }) => {
  try {
    const notification = new Notification({
      title,
      route,
      reciverId,
      date,
      status,
    });
    const savedNotification = await notification.save();
    return savedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

module.exports = { createNotification };
