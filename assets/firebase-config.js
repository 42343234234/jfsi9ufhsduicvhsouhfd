import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, get, set, child, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Twoje dane konfiguracyjne
const firebaseConfig = {
  apiKey: "AIzaSyDSgnZ1xqKRNOETL9q7tAlks0YXtQ_9DWg",
  authDomain: "pobywatelfree.firebaseapp.com",
  databaseURL: "https://pobywatelfree-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "pobywatelfree",
  storageBucket: "pobywatel3-15a57.appspot.com",
  messagingSenderId: "647085715029",
  appId: "1:647085715029:web:cb79cc3b27cf600ba46edc",
  measurementId: "G-2569KJZRJQ"
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);

// Inicjalizacja bazy danych
const database = getDatabase(app);

// Eksport wszystkiego co trzeba
export { database, ref, get, set, child, update };
