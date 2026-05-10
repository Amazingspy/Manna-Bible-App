import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyCT3qhblcU7cD-cZZlVcnzG2S9tZpIBjo4",
    authDomain: "manna---the-bible-project.firebaseapp.com",
    projectId: "manna---the-bible-project",
    storageBucket: "manna---the-bible-project.firebasestorage.app",
    messagingSenderId: "558492053164",
    appId: "1:558492053164:web:257e91e0079dcb7c993909",
    measurementId: "G-KEZP9248LN"
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth with Persistence
let _auth;
if (getApps().length > 0) {
    _auth = getAuth(app);
} else {
    _auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
}

export const auth = _auth;

// Initialize other Services
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
