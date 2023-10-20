import React, { useRef, useState } from 'react';
import firebase from 'firebase/compat/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { firestore, auth } from './App';
import { ChatMessage } from './ChatMessage';

export function ChatRoom() {

    const dummy = useRef();

    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);

    // fetch and listen to data
    const [messages] = useCollectionData(query, { idField: 'id' });

    const [formValue, setFormValue] = useState('');

    const sendMessage = async (e) => {

        e.preventDefault(); // stop page from refreshing 

        const { uid, photoURL } = auth.currentUser;

        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL,
        });

        setFormValue('');

        dummy.current.scrollIntoView({ behavior: 'smooth' });

    };

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
    );

}
