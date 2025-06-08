import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

interface NotificationsManagerProps {
  userId: string;
}

const NotificationsManager: React.FC<NotificationsManagerProps> = ({ userId }) => {
  useEffect(() => {
    // Request permission for iOS
    const requestUserPermission = async () => {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Authorization status:', authStatus);
        }
      }
    };

    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    // Register foreground handler
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      
      if (Platform.OS === 'ios') {
        // For iOS, use PushNotificationIOS
        PushNotificationIOS.addNotificationRequest({
          id: remoteMessage.messageId || `notification-${Date.now()}`,
          title: remoteMessage.notification?.title || '',
          body: remoteMessage.notification?.body || '',
          userInfo: remoteMessage.data,
        });
      } else {
        // For Android, Firebase Messaging handles notifications automatically
      }
    });

    // Get the device token
    messaging()
      .getToken()
      .then(token => {
        console.log('FCM Token:', token);
        // Here you would typically send this token to your backend
        // to associate it with the current user
        // saveTokenToDatabase(token, userId);
      });

    // Listen to token refresh
    const tokenRefreshListener = messaging().onTokenRefresh(token => {
      console.log('FCM Token refreshed:', token);
      // saveTokenToDatabase(token, userId);
    });

    requestUserPermission();

    return () => {
      unsubscribe();
      tokenRefreshListener();
    };
  }, [userId]);

  // This component doesn't render anything
  return null;
};

export default NotificationsManager; 