import firebase from 'firebase';
import 'firebase/firestore';

var firebaseConfig = {
    apiKey: "AIzaSyDe0q4FaYh02HYDcnJ6faGh1sbyY7msCw8",
    authDomain: "seatcheck-751eb.firebaseapp.com",
    databaseURL: "https://seatcheck-751eb.firebaseio.com",
    projectId: "seatcheck-751eb",
    storageBucket: "seatcheck-751eb.appspot.com",
    messagingSenderId: "336251915233",
    appId: "1:336251915233:web:e8a8eb18b6fac0fcff60a0",
    measurementId: "G-M5Q00CMJLC"
};
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}



export default firebase;