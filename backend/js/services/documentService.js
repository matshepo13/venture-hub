import { db, storage } from '../firebase.js';
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

class DocumentService {
    async uploadDocument(file, userId, category, content) {
        try {
            // Upload file to Firebase Storage
            const storageRef = ref(storage, `documents/${userId}/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const fileUrl = await getDownloadURL(storageRef);

            // Store document metadata in Firestore
            const docRef = await addDoc(collection(db, "documents"), {
                userId,
                fileName: file.name,
                fileUrl,
                fileType: file.type,
                uploadDate: new Date(),
                category,
                content
            });

            return docRef.id;
        } catch (error) {
            throw new Error('Failed to upload document: ' + error.message);
        }
    }

    async getUserDocuments(userId, category = null) {
        try {
            let q = query(
                collection(db, "documents"), 
                where("userId", "==", userId),
                orderBy("uploadDate", "desc")
            );
            
            if (category) {
                q = query(q, where("category", "==", category));
            }

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw new Error('Failed to fetch documents: ' + error.message);
        }
    }
}

export const documentService = new DocumentService();