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
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const ITEMS_COLLECTION = 'items';

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
