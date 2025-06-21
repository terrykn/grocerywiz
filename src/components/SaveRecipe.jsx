import * as React from 'react';
import { Button } from '@mui/material';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../config';

export default function SaveRecipe({ recipe }) {
    const handleSave = async () => {
        const user = auth.currentUser;
        if (!user) {
            console.error("User not authenticated");
            return;
        }

        const userDoc = doc(db, 'users', user.uid);
        try {
            await updateDoc(userDoc, {
                savedRecipes: arrayUnion(recipe.canonical_id)
            });
            console.log("Recipe saved successfully");
        } catch (error) {
            console.error("Error saving recipe: ", error);
        }
    };

    return (
        <Button variant='outlined' size='small' sx={{ height: 36, fontSize: 12, ml: .5 }} onClick={handleSave}>
            Save
        </Button>
    );
}