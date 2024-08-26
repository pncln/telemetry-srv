import express from 'express';
import http from 'http';
import { Server as socketio } from 'socket.io';
import events from 'events';
import { getFirestore, connectFirestoreEmulator, collection, addDoc, setDoc, doc } from "firebase/firestore";
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
import auth from './apis/firebase.js';

const app = express();
const server = http.Server(app);
const websocket = new socketio(server);
const localEmitter = new events.EventEmitter();

const db = getFirestore(app);
connectFirestoreEmulator(db, 'localhost', 8080);

const interpolate = () => {

}

server.listen(3000, async () => {
    console.log('Listening on port 3000');
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
                latitude: loc.coords.latitude,
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


