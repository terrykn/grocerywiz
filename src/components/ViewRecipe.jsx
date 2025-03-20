import * as React from 'react';
import { Dialog, AppBar, Toolbar, IconButton, Typography, DialogContent, Box, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIngredients from './AddIngredients';
import { LocalGroceryStore } from '@mui/icons-material';
import SaveRecipe from './SaveRecipe';

export default function ViewRecipe({ open, onClose, recipe }) {
    if (!recipe) {
        return null; // Return null if recipe is not defined
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <AppBar sx={{ position: 'relative', boxShadow: 0 }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flex: 1 }}>
                        {recipe.name}
                    </Typography>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <AddIngredients recipe={recipe} />
                <SaveRecipe recipe={recipe} />
                {recipe.original_video_url && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2}}>
                        <video width='270' controls>
                            <source src={recipe.original_video_url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </Box>
                )}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Instructions</Typography>
                    {recipe.instructions && recipe.instructions.map((instruction, index) => (
                        <Typography key={index} variant="body2" sx={{ mt: 1 }}>{index + 1}. {instruction.display_text}</Typography>
                    ))}
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Nutrition</Typography>
                    {recipe.nutrition && (
                        <>
                            <Typography variant="body2" sx={{ mt: 1 }}>Calories: {recipe.nutrition.calories}</Typography>
                            <Typography variant="body2">Carbs: {recipe.nutrition.carbs}</Typography>
                            <Typography variant="body2">Fat: {recipe.nutrition.fat}</Typography>
                            <Typography variant="body2">Protein: {recipe.nutrition.protein}</Typography>
                            <Typography variant="body2">Sodium: {recipe.nutrition.sodium}</Typography>
                            <Typography variant="body2">Sugar: {recipe.nutrition.sugar}</Typography>
                        </>
                    )}
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Ingredients</Typography>
                    {recipe.sections && recipe.sections.map((section, index) => (
                        <Box key={index} sx={{ mt: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{section.title}</Typography>
                            {section.components && section.components.map((component, index) => (
                                <Typography key={index} variant="body2" sx={{ mt: 1 }}>{component.raw_text}</Typography>
                            ))}
                        </Box>
                    ))}
                </Box>
            </DialogContent>
        </Dialog>
    );
}