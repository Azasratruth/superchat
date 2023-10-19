import React, { useRef, useState } from 'react';
import './App.css';

// v9 compat packages are API compatible with v8 code
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

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

const auth = firebase.auth()
const firestore = firebase.firestore()

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

function SignIn() {

    const useSignInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        auth.signInWithPopup(provider)
    }

    return (
        <button onClick={useSignInWithGoogle}>Sign in with Google</button>
    )
}

function SignOut() {
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}>Sign Out</button>
    )
}

function ChatRoom() {

    const dummy = useRef()

    const messagesRef = firestore.collection('messages')
    const query = messagesRef.orderBy('createdAt').limit(25)

    // fetch and listen to data
    const [messages] = useCollectionData(query, { idField: 'id' })

    const [formValue, setFormValue] = useState('')

    const sendMessage = async (e) => {

        e.preventDefault() // stop page from refreshing 

        const { uid, photoURL } = auth.currentUser

        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL,
        })

        setFormValue('')

        dummy.current.scrollIntoView({ behavior: 'smooth' })

    }

    return (
        <>
            <main>
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

                {/* this scrolls the window to the bottom */}
                <div ref={dummy}></div>

            </main>


            <form onSubmit={sendMessage}>

                <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />

                <button type='submit'>🕊</button>

            </form>
        </>
    )

}

function ChatMessage(props) {

    const { text, uid, photoURL } = props.message

    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

    return (
        <div className={`message ${messageClass}`}>
            <img src={photoURL}></img>
            <p>{text}</p>
        </div>
    )
}

export default App;
