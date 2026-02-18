import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
    apiKey: "AIzaSyBoTtJl3w1FjrdHuzvUCFYU1QDH9D1lSZo",
    authDomain: "device-streaming-8b161dab.firebaseapp.com",
    projectId: "device-streaming-8b161dab",
    storageBucket: "device-streaming-8b161dab.firebasestorage.app",
    messagingSenderId: "614476945726",
    appId: "1:614476945726:web:45be86a68e6cc1b33f746f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with platform-specific persistence
export const auth = Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
