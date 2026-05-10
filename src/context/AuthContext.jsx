import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
    updateProfile,
    GoogleAuthProvider,
    signInWithCredential
} from 'firebase/auth';
import { auth } from '../utils/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in
                const userData = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                };
                setUser(userData);
                try {
                    await AsyncStorage.setItem('@MannaAuth', JSON.stringify(userData));
                } catch (e) {
                    console.warn("AsyncStorage error", e);
                }
            } else {
                // User is signed out
                setUser(null);
                try {
                    await AsyncStorage.removeItem('@MannaAuth');
                } catch (e) {
                    console.warn("AsyncStorage error", e);
                }
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signUp = async (email, password, firstName, lastName) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const fullName = `${firstName} ${lastName || ''}`.trim();
            
            await updateProfile(userCredential.user, {
                displayName: fullName
            });

            const userData = {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: fullName,
            };
            
            setUser(userData);
            return userData;
        } catch (error) {
            console.log("Firebase SignUp Error:", error.message);
            throw error;
        }
    };

    const signIn = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userData = {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: userCredential.user.displayName,
            };
            setUser(userData);
            return userData;
        } catch (error) {
            console.log("Firebase SignIn Error:", error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            await AsyncStorage.removeItem('@MannaAuth');
        } catch (error) {
            console.log("Firebase SignOut Error:", error.message);
            throw error;
        }
    };

    const signInWithGoogleCredential = async (idToken) => {
        try {
            const credential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(auth, credential);
            const userData = {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: userCredential.user.displayName,
                photoURL: userCredential.user.photoURL,
            };
            setUser(userData);
            return userData;
        } catch (error) {
            console.log("Firebase Google Auth Error:", error.message);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isLoading, 
            signUp, 
            signIn, 
            signInWithGoogleCredential,
            logout, 
            isAuthenticated: !!user 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
