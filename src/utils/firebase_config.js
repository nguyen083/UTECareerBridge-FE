// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyAZ2Bzcm7A0meyN0qx6wfEgu0NqZBj7na4",
    authDomain: "ute-career-bridge.firebaseapp.com",
    projectId: "ute-career-bridge",
    storageBucket: "ute-career-bridge.appspot.com",
    messagingSenderId: "320702176172",
    appId: "1:320702176172:web:ba4ce9fdfe5e69d5e9b809"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/',
          updateViaCache: 'none'
        });
        await registration.update();
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          throw new Error('Notification permission not granted');
        }
  
        console.log('Service Worker registered successfully:', registration);
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        throw error;
      }
    }
    throw new Error('Service Worker not supported in this browser');
  };