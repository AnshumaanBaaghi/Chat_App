import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCoqMhxXABOg4TvNXV8QvHJxmmY08W6kE0",
  authDomain: "chat-application-45a89.firebaseapp.com",
  projectId: "chat-application-45a89",
  storageBucket: "chat-application-45a89.appspot.com",
  messagingSenderId: "297188745221",
  appId: "1:297188745221:web:81ad221139b7386af8bc6c",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
