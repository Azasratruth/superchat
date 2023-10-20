import React from 'react';
import './App.css';

// v9 compat packages are API compatible with v8 code
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth'
import { SignIn } from './SignIn';
import { SignOut } from './SignOut';
import { ChatRoom } from './ChatRoom';

const firebaseConfig = {
    // doesn't work without the mock string
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

firebase.initializeApp({
    // your config
    ...firebaseConfig,
})

export const auth = firebase.auth()
export const firestore = firebase.firestore()

function App() {

    // user object or null
    const [user] = useAuthState(auth)

    return (
        <div className="App">

            <header>
                <h1>⚛️🔥💬</h1>
                <SignOut />
            </header>

            <section>
                {user ? <ChatRoom /> : <SignIn />}
            </section>

        </div>
    );
}

export default App;
