/* Firebase Messaging Service Worker */
importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAGqaifr-68EzB85IvHGHMo7af3FAERryo",
  authDomain: "henryclub-383e5.firebaseapp.com",
  projectId: "henryclub-383e5",
  storageBucket: "henryclub-383e5.firebasestorage.app",
  messagingSenderId: "972447053262",
  appId: "1:972447053262:web:008a5a04c7a17e2645279f"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification?.title || 'HenryClub';
  const notificationOptions = {
    body: payload.notification?.body || 'Uusi ilmoitus',
    icon: '/icon-192.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
