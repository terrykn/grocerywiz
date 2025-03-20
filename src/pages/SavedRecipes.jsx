import * as React from 'react';
import { auth, db } from '../config';
import { doc, getDoc } from 'firebase/firestore';
import { Box, Typography, CardMedia, Card, CardContent, Button, CircularProgress } from '@mui/material';
import SaveRecipe from '../components/SaveRecipe';
import AddIngredients from '../components/AddIngredients';
import ViewRecipe from '../components/ViewRecipe';
import Masonry from '@mui/lab/Masonry';
import Navbar from '../components/Navbar';

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

    const truncateDescription = (description) => {
        if (!description) {
            return '';
        }
        if (description.length > 200) {
            return description.substring(0, 200) + '...';
        }
        return description;
    };

    const handleRecipeOpen = (id) => {
        setOpenRecipeId(id);
    };

    const handleRecipeClose = () => {
        setOpenRecipeId(null);
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" sx={{ mt: 3, mb: 3 }}>Saved Recipes</Typography>
                <Masonry columns={{ xs: 1, sm: 2, md: 4 }} spacing={2}>
                    {recipes.map((recipe, index) => (
                        <Card key={`${recipe.id}-${index}`} sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, boxShadow: 0 }}>
                            <Typography variant="h7">{recipe.name}</Typography>
                            {recipe.original_video_url && (
                                <CardMedia
                                    component="img"
                                    image={recipe.thumbnail_url}
                                    sx={{ mt: 2, width: '100%', height: 'auto', borderRadius: 2 }}
                                />
                            )}
                            <Typography variant="body2" sx={{ mt: 1, mb: 1, minHeight: '3em' }}>{truncateDescription(recipe.description)}</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', minHeight: '3em' }}>
                                <Button variant='outlined' size='small' sx={{ height: 36, mr: .5, fontSize: 12 }} onClick={() => handleRecipeOpen(recipe.id)}>Recipe</Button>
                                <ViewRecipe open={openRecipeId === recipe.id} onClose={handleRecipeClose} recipe={recipe} />
                                <AddIngredients recipe={recipe} />
                                <SaveRecipe recipe={recipe} />
                            </Box>
                            <Typography variant="caption">Time: {recipe.total_time_minutes} minutes</Typography>
                        </Card>
                    ))}
                </Masonry>
            </Box>
        </div>
    );
}