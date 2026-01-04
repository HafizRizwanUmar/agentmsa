import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCV58QTrtSKk1LCWtDPFafWGVCmDKcVdgU",
    authDomain: "agentmsa-d5ba0.firebaseapp.com",
    projectId: "agentmsa-d5ba0",
    storageBucket: "agentmsa-d5ba0.firebasestorage.app",
    messagingSenderId: "942447353972",
    appId: "1:942447353972:web:7b0199a9f3c29e77b83121",
    measurementId: "G-FHD69V8DE4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
