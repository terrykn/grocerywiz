import * as React from 'react';
import { Button } from '@mui/material';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../config';

export default function AddIngredients({ recipe }) {
    const handleAddIngredients = async () => {
        const user = auth.currentUser;
        if (!user) {
            console.error("User not authenticated");
            return;
        }

        const userDoc = doc(db, 'users', user.uid);
        const ingredients = recipe.sections.flatMap(section => 
            section.components.map(component => ({
                ingredient: component.raw_text,
                recipeId: recipe.canonical_id,
                recipeName: recipe.name,
            }))
        );
        try {
            await updateDoc(userDoc, {
                groceryList: arrayUnion(...ingredients)
            });
            console.log("Ingredients added to grocery list");
        } catch (error) {
            console.error("Error adding ingredients to grocery list:", error);
        }
    };

    return (
        <Button variant='outlined' size='small' sx={{ height: 36, fontSize: 12 }} onClick={handleAddIngredients}>
            Add to List<LocalGroceryStoreIcon sx={{ ml: .5, width: 14, height: 14 }} />
        </Button>
    );
}