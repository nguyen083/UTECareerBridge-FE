// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.jsx');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.jsx');

firebase.initializeApp({
  apiKey: "AIzaSyAZ2Bzcm7A0meyN0qx6wfEgu0NqZBj7na4",
  authDomain: "ute-career-bridge.firebaseapp.com",
  projectId: "ute-career-bridge",
  storageBucket: "ute-career-bridge.appspot.com",
  messagingSenderId: "320702176172",
  appId: "1:320702176172:web:ba4ce9fdfe5e69d5e9b809"
});

const messaging = firebase.messaging();

const showNotification = (title, options) => {
  return self.registration.showNotification(title, options);
};

// Handle background messages from FCM
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  try {
    const notificationTitle = payload.notification?.title || 'Thông báo mới';
    const notificationOptions = {
      body: payload.notification?.body || '',
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: 'notification-' + Date.now(),
      data: payload.data || {},
      requireInteraction: true,
      silent: false,
      vibrate: [200, 100, 200],
      actions: [
        {
          action: 'view',
          title: 'Xem chi tiết'
        }
      ]
    };

    return showNotification(notificationTitle, notificationOptions);
  } catch (error) {
    console.error('[firebase-messaging-sw.js] Error showing notification:', error);
  }
});

// Handle push events
self.addEventListener('push', function (event) {
  console.log('[firebase-messaging-sw.js] Push received:', event);

  if (!event.data) {
    console.log('[firebase-messaging-sw.js] Push event but no data');
    return;
  }

  try {
    // Safely handle the push data
    let payload;
    const rawData = event.data.text();

    try {
      // Try to parse as JSON first
      payload = JSON.parse(rawData);
    } catch (parseError) {
      console.log('[firebase-messaging-sw.js] Raw push data:', rawData);
      // If parsing fails, create a basic payload with the raw text
      payload = {
        notification: {
          title: 'Thông báo mới',
          body: rawData
        }
      };
    }

    console.log('[firebase-messaging-sw.js] Processed push data:', payload);

    // Extract notification data with careful null checks
    const title = payload?.notification?.title ||
      payload?.data?.title ||
      'Thông báo mới';

    const options = {
      body: payload?.notification?.body ||
        payload?.data?.body ||
        '',
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: 'notification-' + Date.now(),
      data: {
        ...(payload?.data || {}),
        url: payload?.data?.jobUrl || payload?.data?.url
      },
      requireInteraction: true,
      silent: false,
      vibrate: [200, 100, 200],
      renotify: true,
      actions: [
        {
          action: 'view',
          title: 'Xem chi tiết'
        }
      ]
    };

    event.waitUntil(
      Promise.all([
        // Show notification
        showNotification(title, options),
        // Update any open windows/tabs
        self.clients.matchAll({
          type: 'window',
          includeUncontrolled: true
        }).then(function (clientList) {
          return Promise.all(clientList.map(client => {
            return client.postMessage({
              type: 'PUSH_RECEIVED',
              payload: payload
            }).catch(error => {
              console.error('[firebase-messaging-sw.js] Error posting message to client:', error);
            });
          }));
        })
      ]).catch(error => {
        console.error('[firebase-messaging-sw.js] Error in push event:', error);
      })
    );
  } catch (error) {
    console.error('[firebase-messaging-sw.js] Error processing push event:', error);
    // Show a fallback notification in case of errors
    event.waitUntil(
      showNotification('Thông báo mới', {
        body: 'Có thông báo mới cho bạn',
        icon: '/logo192.png',
        badge: '/logo192.png'
      })
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', function (event) {
  console.log('[firebase-messaging-sw.js] Notification click:', event);

  event.notification.close();

  const urlToOpen = event.notification.data?.url ||
    event.notification.data?.jobUrl ||
    '/';

  event.waitUntil(
    self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function (clientList) {
      // Try to focus existing window
      for (let client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window if none exists
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    }).catch(error => {
      console.error('[firebase-messaging-sw.js] Error handling notification click:', error);
    })
  );
});

// Handle service worker installation
self.addEventListener('install', function (event) {
  console.log('[firebase-messaging-sw.js] Service Worker installed');
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', function (event) {
  console.log('[firebase-messaging-sw.js] Service Worker activated');
  event.waitUntil(self.clients.claim());
});