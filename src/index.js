import express from 'express';
import http from 'http';
import { Server as socketio } from 'socket.io';
import events from 'events'
import { getFirestore, collection, addDoc, setDoc, doc } from "firebase/firestore";
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
import auth from './apis/firebase.js'

const app = express();
const server = http.Server(app);
const websocket = new socketio(server);
const localEmitter = new events.EventEmitter();

// firebase.initializeApp({
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID
// });
const db = getFirestore(app);

server.listen(3000, async () => {
    console.log('Listening on port 3000');
    try {
        const docRef = await addDoc(collection(db, "users"), {
          first: "Ada",
          last: "Lovelace",
          born: 1815
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
})


websocket.on('connection' , (socket) => {
    console.log('Client joined:', socket.id);
    // websocket.on('manual-disconnection' , (data) => {
    //     console.log('Client disconnected:', data);
    // })
    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
    });    

    socket.on('send_location', async (loc) => {
        console.log(`${loc.timestamp}`);
        try {
            const docRef = doc(db, "geo-data", `${loc.timestamp}` );
            const data = {
                timestamp: loc.timestamp,
                altitude: loc.coords.altitude,
                heading: loc.coords.heading,
                altitudeAccuracy: loc.coords.altitudeAccuracy,
                speed : loc.coords.speed,
                longitude : loc.coords.longitude,
                accuracy : loc.coords.accuracy
             };

            await setDoc(docRef, data);
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    })
})


