import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  orderBy,
  limit,
  query,
  getDocs,
} from "firebase/firestore";
import Toastify from "toastify-js";
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCIIGmCx-fgU1qi22NQYcHBJOyDiGi5Cfg",

  authDomain: "kam-meter.firebaseapp.com",

  projectId: "kam-meter",

  storageBucket: "kam-meter.appspot.com",

  messagingSenderId: "1002193316378",

  appId: "1:1002193316378:web:c4e9ccd9176b28c15d7fa3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const collectionRef = collection(db, "collection");
const q = query(collectionRef, orderBy("time", "desc"), limit(1));

document.addEventListener("DOMContentLoaded", async () => {
  let last_value = 50;
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    last_value = doc.data().value;
  });
  const kamSlider = document.getElementById("kamSlider");
  const name = document.getElementById("name");
  const saveButton = document.getElementById("save");
  const discardButton = document.getElementById("discard");
  kamSlider.value = last_value;

  saveButton.addEventListener("click", async () => {
    if (!name.value) {
      Toastify({
        text: "Please Enter Name",
        className: "error",
        gravity: "bottom",
        position: "right",
        style: { background: "#df4759" },
      }).showToast();
      return;
    }
    const docRef = await addDoc(collectionRef, {
      time: Date.now(),
      name: name.value,
      value: kamSlider.value,
    });
    last_value = kamSlider.value;
    name.value = "";
    Toastify({
      text: "Saved",
      className: "info",
      gravity: "bottom",
      position: "right",
      style: { background: "#5cb85c" },
    }).showToast();
  });

  discardButton.addEventListener("click", () => {
    kamSlider.value = last_value;
    name.value = "";
    Toastify({
      text: "Discarded",
      className: "info",
      gravity: "bottom",
      position: "right",
      style: { background: "#5cb85c" },
    }).showToast();
  });
});
