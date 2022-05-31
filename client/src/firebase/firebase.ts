import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA3KM10rSEm0jwYeyQlk5GfCapiSSNwonE",
  authDomain: "team-table-6eccc.firebaseapp.com",
  projectId: "team-table-6eccc",
  storageBucket: "team-table-6eccc.appspot.com",
  messagingSenderId: "787119584618",
  appId: "1:787119584618:web:814446095eb2329a1fa113",
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
