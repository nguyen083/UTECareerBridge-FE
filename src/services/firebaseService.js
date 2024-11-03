// services/firebaseService.js
import { getToken, deleteToken, onMessage  } from 'firebase/messaging';
import { messaging, registerServiceWorker } from '../utils/firebase_config';
import axios from "../utils/axiosCustomize.js";

// Utility function to handle configuration
let config = {};
const getAuthConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
});

// Request notification permission and get FCM token
export const initializeNotifications = async (userId) => {
  try {
    const swRegistration = await registerServiceWorker();
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: swRegistration
      });
      if (token) {
        localStorage.setItem('fcmToken', token);
          await axios.post('/notifications/subscribe', 
            { token, topic: 'admin' }, 
            getAuthConfig()
          );
        return token;
      }
    } else {
      throw new Error('Failed to get notification permission');
    }
  } catch (error) {
    console.error('Error initializing notifications:', error);
    throw error;
  }
};

// Send notification functions
export const sendNotification = {
    // Gửi thông báo đến token cụ thể
    toToken: async ({ title, body, token = localStorage.getItem('fcmToken'), data = {} }) => {
      try {
        const response = await axios.post(
          '/notifications/token',
          {
            title,
            body,
            token,
            data
          },
          getAuthConfig()
        );
        return response.data;
      } catch (error) {
        console.error('Error sending notification to token:', error);
        throw error;
      }
    },
  
    // Gửi thông báo đến topic
    toTopic: async ({ title, body, topic, data = {} }) => {
      try {
        const response = await axios.post(
          '/notifications/topic',
          {
            title,
            body,
            topic,
            data
          },
          getAuthConfig()
        );
        return response.data;
      } catch (error) {
        console.error('Error sending notification to topic:', error);
        throw error;
      }
    },
  
    // Gửi thông báo đến admin
    toAdmin: async ({ title, body, jobUrl }) => {
      try {
        const response = await axios.post(
          '/notifications/topic',
          {
            title,
            body,
            topic: 'admin',
            data: { jobUrl }
          },
          getAuthConfig()
        );
        return response.data;
      } catch (error) {
        console.error('Error sending notification to admin:', error);
        throw error;
      }
    }
  };
  
// Refresh FCM token
export const refreshFCMToken = async (userId) => {
  try {
    await deleteToken(messaging);
    return await initializeNotifications(userId);
  } catch (error) {
    console.error('Error refreshing FCM token:', error);
    throw error;
  }
};

// Mark a single notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axios.put(
      `/notifications/${notificationId}/read`,
      {},
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = async (userId) => {
  try {
    const response = await axios.put(
      `/notifications/user/${userId}/read-all`,
      {},
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};
export const setupMessageListener = (onMessageCallback) => {
    try {
      return onMessage(messaging, (payload) => {
        console.log('Received foreground message:', payload);
        onMessageCallback(payload);
      });
    } catch (error) {
      console.error('Error setting up message listener:', error);
      throw error;
    }
  };