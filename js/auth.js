import { auth } from './firebase-config.js';
import { saveUserProfile } from './db.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export const signUp = async (email, password, profileData) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Save additional profile data
        await saveUserProfile(userCredential.user.uid, {
            email: email,
            ...profileData
        });
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export const logOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
};

export const monitorAuthState = (callback) => {
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
};
