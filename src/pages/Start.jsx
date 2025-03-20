import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth, provider, db } from '../config';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Typography } from '@mui/material';

export default function Start() {
    const navigate = useNavigate();

    const [userEmail, setUserEmail] = React.useState('');
    const handleGetStarted = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            setUserEmail(user.email);
            localStorage.setItem('userEmail', user.email);

            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    uid: user.uid,
                    groceryList: []
                });
            } else {
                await setDoc(userDocRef, {
                    lastLogin: new Date()
                }, { merge: true });
            }

            navigate('/home');
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    React.useEffect(() => {
        const email = localStorage.getItem('userEmail');
        if (email) {
            setUserEmail(email);
            navigate('/home'); 
        }
    }, [navigate]);

    return (
        <div className="start-container">
            <div className="start-content">
                <Typography variant="h2" sx={{ fontWeight: 600 }}>GroceryWiz</Typography>
                <Typography variant="h5" sx={{ fontWeight: 500 }}>Eat Smart, Save More</Typography>
                <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>Recipes, Videos, & Real-Time Grocery Prices</Typography>
                <Button 
                    style={{ fontWeight: 600 }} 
                    onClick={handleGetStarted} 
                    variant="contained"
                >
                    Get Started
                </Button>
            </div>
        </div>
    );
}