import * as React from 'react';
import { Box, Typography, Card, CardMedia, Button } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import ViewRecipe from './ViewRecipe';
import AddIngredients from './AddIngredients';
import SaveRecipe from './SaveRecipe';

const truncateDescription = (description) => {
    if (!description) {
        return '';
    }
    if (description.length > 200) {
        return description.substring(0, 200) + '...';
    }
    return description;
};

export default function DisplayRecipes({ recipes, openRecipeId, handleRecipeOpen, handleRecipeClose }) {
    return (
        <Box sx={{ width: '100%' }}>
            {recipes.length > 0 ? (
                <>
                    <Typography variant="h5" sx={{ mt: 3, mb: 3 }}>Search Results</Typography>
                    <Masonry columns={{ xs: 1, sm: 2, md: 4 }} spacing={2}>
                        {recipes.map((recipe) => (
                            <Card key={recipe.id} sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, boxShadow: 0 }}>
                                <Typography variant="h7">{recipe.name}</Typography>
                                {recipe.original_video_url && (
                                    <CardMedia
                                        component="img"
                                        image={recipe.thumbnail_url}
                                        sx={{ mt: 2, width: '100%', height: 'auto', borderRadius: 2 }}
                                    />
                                )}
                                <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>{truncateDescription(recipe.description)}</Typography>
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
                </>
            ) : (
                <Typography variant="body1">No recipes found.</Typography>
            )}
        </Box>
    );
}