import * as React from 'react';
import { auth, db } from '../config';
import { doc, getDoc } from 'firebase/firestore';
import { Box, Typography, CircularProgress } from '@mui/material';
import Navbar from '../components/Navbar';
import DisplayRecipes from '../components/DisplayRecipes';

export default function SavedRecipes() {
    const [recipes, setRecipes] = React.useState([]);
    const [openRecipeId, setOpenRecipeId] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_TASTY_KEY,
            'x-rapidapi-host': process.env.REACT_APP_RAPIDAPI_TASTY_HOST,
        },
    };

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const savedRecipesData = userDoc.data().savedRecipes || [];
                    if (savedRecipesData.length === 0) {
                        console.log('No recipes saved.');
                    }
                    try {
                        const recipesPromises = savedRecipesData.map(async (recipeId) => {
                            console.log('Processing recipeId:', recipeId);
                            const match = recipeId.match(/\d+/);
                            if (!match) {
                                console.error('Invalid recipeId:', recipeId);
                                return null;
                            }
                            const id = match[0];
                            const url = `https://tasty-co1.p.rapidapi.com/recipes/get-more-info?recipeId=${id}`;
                            console.log('Fetching recipe from URL:', url);
                            const response = await fetch(url, options);
                            if (!response.ok) {
                                console.error('Failed to fetch recipe:', response.statusText);
                                return null;
                            }
                            const result = await response.json();
                            console.log('Fetched recipe:', result.data);
                            return result.data;
                        });
                        const fetchedRecipes = await Promise.all(recipesPromises);
                        setRecipes(fetchedRecipes.filter(recipe => recipe !== null));
                    } catch (error) {
                        console.error('Error fetching recipes:', error);
                    }
                } else {
                    console.log('User document does not exist');
                }
            } else {
                console.log('User not authenticated');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleRecipeOpen = (id) => {
        setOpenRecipeId(id);
    };

    const handleRecipeClose = () => {
        setOpenRecipeId(null);
    };

    return (
        <div>
            <Navbar />
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" sx={{ mt: 3, mb: 3 }}>Saved Recipes</Typography>
                <DisplayRecipes
                    recipes={recipes}
                    openRecipeId={openRecipeId}
                    handleRecipeOpen={handleRecipeOpen}
                    handleRecipeClose={handleRecipeClose}
                    loading={loading}
                />
            </Box>
        </div>
    );
}