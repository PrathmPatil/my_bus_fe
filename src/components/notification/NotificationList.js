import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notification.css';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching notifications');
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/notifications/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
    } catch (err) {
      setError(err.response?.data?.message || 'Error marking notification as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting notification');
    }
  };

  return (
    <div className="notification-list">
      <h2>Notifications</h2>
      
      {error && <div className="error-message">{error}</div>}

      <div className="notifications">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={`notification-item ${notification.type.toLowerCase()} ${
              notification.isRead ? 'read' : 'unread'
            }`}
          >
            <div className="notification-content">
              <p className="message">{notification.message}</p>
              <p className="meta">
                {notification.relatedBus && (
                  <span className="bus">Bus: {notification.relatedBus.busNumber}</span>
                )}
                <span className="time">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </p>
            </div>
            <div className="notification-actions">
              {!notification.isRead && (
                <button
                  onClick={() => markAsRead(notification._id)}
                  className="mark-read"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => deleteNotification(notification._id)}
                className="delete"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <p className="no-notifications">No notifications</p>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
