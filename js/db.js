import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    getDocs, 
    getDoc, 
    doc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp,
    updateDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const ITEMS_COLLECTION = 'items';
const USERS_COLLECTION = 'users';

export const addItem = async (itemData) => {
    try {
        const docRef = await addDoc(collection(db, ITEMS_COLLECTION), {
            ...itemData,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
};

export const getItems = async (type = null) => {
    try {
        let q = collection(db, ITEMS_COLLECTION);
        
        if (type) {
            q = query(q, where("type", "==", type), orderBy("createdAt", "desc"));
        } else {
            q = query(q, orderBy("createdAt", "desc"));
        }

        const querySnapshot = await getDocs(q);
        const items = [];
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
        });
        return items;
    } catch (error) {
        console.error("Error getting documents: ", error);
        throw error;
    }
};

export const getItemById = async (id) => {
    try {
        const docRef = doc(db, ITEMS_COLLECTION, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting document: ", error);
        throw error;
    }
};

export const updateItemStatus = async (id, status) => {
    try {
        const docRef = doc(db, ITEMS_COLLECTION, id);
        await updateDoc(docRef, {
            status: status
        });
    } catch (error) {
        console.error("Error updating document: ", error);
        throw error;
    }
};

export const saveUserProfile = async (uid, data) => {
    try {
        await setDoc(doc(db, USERS_COLLECTION, uid), {
            ...data,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error saving user profile: ", error);
        throw error;
    }
};

export const getUserProfile = async (uid) => {
    try {
        const docRef = doc(db, USERS_COLLECTION, uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting user profile: ", error);
        throw error;
    }
};
